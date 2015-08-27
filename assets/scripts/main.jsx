var React = require('react');
window.$ = window.jQuery = require('jquery')
var InfiniteScroll = require('react-infinite-scroll')(React);
var Truncate = require('truncate');
var Moment = require('moment');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var Link = Router.Link;

var RedditAPI = require('./RedditAPI.js');
var Search = require('./search.jsx');
var Home = require('./home.jsx');
var NotFound = require('./notfound.jsx');
var Comments = require('./comments.jsx');
var entities = require("entities");

var routes = (
  <Route handler={App}>
    <Route name="home" path="/" handler={Home}/>
    <Route name="search" path="/sort=:sort&q=*" handler={Search}/>
    <Route name="comments" path="/sort=:sort&comments=*" handler={Comments}/>

    <NotFoundRoute handler={NotFound} />
  </Route>
);

var App = React.createClass({
  displayName: "App",

  render: function () {
    return (
      <div>
        <RouteHandler/>
      </div>
    )
  }
});

Router.run(routes, function (Root) {
    React.render(<Root/>, document.getElementById("content"));
});