import MovieService from '../../MovieService'
import CommentService from '../../CommentService'
import TweetService from '../../TweetService'

import * as hbs from '../../../templates'

import { db } from 'baqend/realtime'
import { processPromiseOrStream } from '../../lib/helpers'

class CommentsTab {
  constructor() {
    this.update = this.update.bind(this)
    this.queryComments = this.queryComments.bind(this)
  }

  init() {
    $("#parameter-comment, #limit-comment").keyup(this.queryComments)
    $("#query-type-comment").change(this.queryComments)
  }

  update() {
    this.queryComments();
  }

  queryComments() {
    var params = {
      parameter : $("#parameter-comment").val(),
      limit : $("#limit-comment").val(),
      type : $("#query-type-comment").val()
    };
    processPromiseOrStream(CommentService.queryComments(params), (comments) => {
      $("#comments-container").html(hbs.CommentsTable({comments: comments}))
    })
  }
}

const commentsTab = new CommentsTab()

export default commentsTab
