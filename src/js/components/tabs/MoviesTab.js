import MovieService from '../../MovieService'
import CommentService from '../../CommentService'
import TweetService from '../../TweetService'

import * as hbs from '../../../templates'

import { db } from 'baqend/realtime'
import { processPromiseOrStream } from '../../lib/helpers'

class MoviesTab {
  constructor() {
    this.initiated = false
    this.selectedMovie = null
    this.pauseCommentStream = false

    this.update = this.update.bind(this)
    this.queryMovies = this.queryMovies.bind(this)
    this.selectMovie = this.selectMovie.bind(this)
    this.unselectMovie = this.unselectMovie.bind(this)
    this.getMoviePoster = this.getMoviePoster.bind(this)
    this.getMovieComments = this.getMovieComments.bind(this)
    this.getMovieTweets = this.getMovieTweets.bind(this)
  }

  init() {
    $("#parameter, #limit").keyup(this.queryMovies)
    $("#query-type").change(this.queryMovies)
    $("#table-container").on("click", "table .btn", (e) => {
      this.selectMovie($(e.target).data("title"))
    });
    $(document).on("click", "#movie-data #backToSearch", (e) => {
      e.preventDefault()
      this.unselectMovie()
    })
    $(document).on("submit", '#movie-data .add-comment', (e) => {
      e.preventDefault();
      let $name = $("#movie-data .add-comment .name")
      let $text = $("#movie-data .add-comment .text")
      let comment = {
        username: $name.val(),
        text: $text.val()
      }
      CommentService.addComment(this.selectedMovie, comment).then((r) => {
        $name.val('')
        $text.val('')
      })
    })
    $(document).on("submit", '#movie-data .edit-comment-form', (e) => {
      console.log("bla")
      e.preventDefault();
      let $comment = $(e.target).parents('.comment')
      let comment = db.getReference($comment.data('comment'))
      let text = $comment.find('textarea.text').val()
      this.pauseCommentStream = false
      CommentService.editComment(comment, text)
    })
    $(document).on("click", '#movie-data .edit-comment', (e) => {
      e.preventDefault();
      this.pauseCommentStream = true
      let $elem = $(e.target).parents('.comment').find('.content')
      $elem.find('> .text').hide()
      $elem.find('> .edit-comment-form').show()
    })
  }

  update(force = false) {
    let params = {}
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str,key,value) => {
      params[key] = decodeURIComponent(value);
    })
    if (params['movie']) {
      if (!this.selectedMovie || !this.initiated || force)
        this.selectMovie(params['movie'])
      if (this.selectedMovie) {
        this.getMovieComments(this.selectedMovie)
        this.getMovieTweets(this.selectedMovie)
      }
    } else {
      if (this.selectedMovie || !this.initiated || force)
        this.queryMovies();
    }
    this.initiated = true
  }

  queryMovies() {
    this.selectedMovie = null
    var params = {
      parameter : $("#parameter").val(),
      limit : $("#limit").val(),
      type : $("#query-type").val()
    };
    $("#movie-search").show()
    $("#movie-data").hide()
    processPromiseOrStream(MovieService.queryMovies(params), (movies) => {
      $("#table-container").html(hbs.MoviesTable({movies: movies}))
    })
  }

  selectMovie(movie) {
    MovieService.loadMovieByTitle(movie).then((movie) => {
      this.selectedMovie = movie
      history.replaceState(null, null, '?' + $.param({movie: this.selectedMovie.title}) + '#movies')
      $("#movie-search").hide()
      $("#movie-data").show().html(hbs.MovieData(movie))
      this.getMoviePoster(movie)
      this.getMovieComments(movie)
      this.getMovieTweets(movie)
    })
  }

  unselectMovie() {
    history.replaceState(null, null, '/#movies')
    this.update()
  }

  getMoviePoster(movie) {
    $.getJSON(
      "https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + movie.title + "&callback=?",
      (json) => {
        if(json.results && json.results[0] && json.results[0].poster_path)
          $('img#' + movie.key).attr('src', 'http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path)
      }
    )
  }

  getMovieComments(movie) {
    processPromiseOrStream([false, CommentService.streamComments(movie)], (comments = []) => {
      if (!this.pauseCommentStream) {
        $("#movie-data-comments").html(hbs.MovieDataComments({ comments: comments, user: db.User.me }))
        $(".comment").each((index, elem) => {
          let data = $(elem).data()
          if (db.User.me == data.user || !data.user.length) {
            $(elem).find('.edit-comment').show()
          }
        })
      }
    })
  }

  getMovieTweets(movie) {
    processPromiseOrStream([false, TweetService.streamMovieTweets(movie)], (tweets = []) => {
      $("#movie-data-tweets").html(hbs.MovieDataTweets({ tweets: tweets }))
    })
  }

}

const moviesTab = new MoviesTab()

export default moviesTab
