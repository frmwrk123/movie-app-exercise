import '../styles/main.scss'
import 'bootstrap'
import './lib/typeahead'

import * as hbs from '../templates'

import { db } from 'baqend/realtime'

import MoviesTab from './components/tabs/MoviesTab'
import CommentsTab from './components/tabs/CommentsTab'
import TweetsTab from './components/tabs/TweetsTab'
import Login from './components/Login'

const app = 'movie-app'
db.connect(app);

document.addEventListener("DOMContentLoaded", function() {
    $("#main").html(hbs.main())

    $('#myTab a').click(function(e) {
      e.preventDefault();
      $(this).tab('show');
    });

    $("ul.nav-tabs > li > a").on("shown.bs.tab", function(e) {
      e.preventDefault()
      var id = $(e.target).attr("href").substr(1);
      history.replaceState(null,null,'#' + id);
    });

    db.ready(function() {
      $('#status').html('Connected to Baqend app <strong>' + app + "</strong>");
      MoviesTab.init()
      CommentsTab.init()
      TweetsTab.init()
      Login.init()

      $("ul.nav-tabs > li > a[href='#movies']").on("shown.bs.tab", function(e) {
        MoviesTab.update()
      });

      $("ul.nav-tabs > li > a[href='#comments']").on("shown.bs.tab", function(e) {
        CommentsTab.update()
      });

      $("ul.nav-tabs > li > a[href='#tweets']").on("shown.bs.tab", function(e) {
        TweetsTab.update()
      });

      $('#myTab a[href="' + (window.location.hash || '#movies') + '"]').tab('show');
    })

})
