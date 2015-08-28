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
var Help = require('./help.jsx');
var About = require('./about.jsx');
var entities = require("entities");

var routes = (
  <Route>
    <Route name="home" path="/" handler={Home}/>
    <Route name="search" path="/sort=:sort&q=*" handler={Search}/>
    <Route name="comments" path="/sort=:sort&comments=:id" handler={Comments}/>
    <Route name="help" path="/help" handler={Help}/>
    <Route name="about" path="/about" handler={About}/>
    <NotFoundRoute handler={Home} />
  </Route>
);

Router.run(routes, function (Root) {
    React.render(<Root/>, document.getElementById("main"));
});