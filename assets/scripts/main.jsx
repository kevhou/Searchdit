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


var Redirect = React.createClass({
  mixins: [Router.Navigation],

  componentWillMount: function() {
    this.context.router.transitionTo('/q=/r/' + this.props.params.sub);
  },
  render: function() {
    return(
      <h1>Redirecting...</h1>
    )
  }
});

var routes = (
  <Route handler={App}>
    <Route path="/" handler={Home}/>
    <Route path="/r/:sub" handler={Redirect}/>
    <Route path="/q=*" handler={Search}/>
    <Route path="/comments=:id" handler={Comments}/>

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