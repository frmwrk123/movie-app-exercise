import MovieService from '../../MovieService'
import CommentService from '../../CommentService'
import TweetService from '../../TweetService'

import * as hbs from '../../../templates'

import { db } from 'baqend/realtime'
import { processPromiseOrStream } from '../../lib/helpers'

class TweetsTab {
  constructor() {
    this.update = this.update.bind(this)
    this.queryTweets = this.queryTweets.bind(this)
  }

  init() {
    $("#parameter-tweet, #limit-tweet").keyup(this.queryTweets);
		$("#query-type-tweet").change(this.queryTweets);
  }

  update() {
    this.queryTweets()
  }

  queryTweets() {
    var params = {
      parameter : $("#parameter-tweet").val(),
      limit : $("#limit-tweet").val(),
      type : $("#query-type-tweet").val()
    };
    processPromiseOrStream(TweetService.queryTweets(params), (tweets) => {
      $("#tweet-container").html(hbs.TweetsTable({tweets: tweets}))
    })
  }
}

const tweetsTab = new TweetsTab()

export default tweetsTab
