var React = require('react');
window.$ = window.jQuery = require('jquery')
require('bootstrap');
var _ = require('underscore');
window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');
var InfiniteScroll = require('react-infinite-scroll')(React);
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;

var RedditAPI = require('./RedditAPI.js');

var Search = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      posts: [],
      next: null,
      subreddit: null,
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var subreddit;

    subreddit = React.findDOMNode(this.refs.searchTerm).value.trim();

    RedditAPI.getSubReddit(subreddit).then(function(data){
      if(this.isMounted()){
        this.setState({posts: data.data.children,
        next: data.data.after});
      }
    }.bind(this));

    this.transitionTo('search', {subreddit: subreddit});
  },
  handleShowMore: function(){
    RedditAPI.getNext(this.state.next).then(function(data){
      if(this.isMounted()){
        var appendPosts = this.state.posts.concat(data.data.children);
        this.setState({posts: appendPosts,
        next: data.data.after});
      }
    }.bind(this));
  },
  handleChange: function(event) {
    this.setState({subreddit: event.target.value.substr(0, 140)});
  },
  componentWillMount: function(){
    var subreddit = this.props.params.subreddit;
    this.setState({subreddit: subreddit});

    RedditAPI.getSubReddit(subreddit).then(function(data){
      if(this.isMounted()){
        this.setState({posts: data.data.children,
        next: data.data.after});
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.subreddit} onChange={this.handleChange} ref="searchTerm" />
          <input type="submit" value="Search" />
        </form>

        {this.state.posts.map(function(item, i) {
          return(<p key={i}>{item.data.title}</p>)
        }.bind(this))}

        { this.state.next ? <button className="btn btn-default" onClick={this.handleShowMore}>Show More</button> :null }
      </div>
    )
  }
});

var routes = (
  <Route handler={App}>
    <Route path="/" handler={Search}/>
    <Route name="search" path="/r/:subreddit" handler={Search}/>
  </Route>
);

var App = React.createClass({
  displayName: "App",

  render: function render() {
    return (
      <div>
        <RouteHandler/>
      </div>
    )
  }
});

Router.run(routes, function (Root) {
    React.render(<Root/>, document.body);
});