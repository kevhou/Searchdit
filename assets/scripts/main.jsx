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
  mixins: [Router.State],

  getInitialState: function () {
    return {
      posts: [],
      next: null,
      subreddit: this.props.params.subreddit,
    };
  },
  componentDidMount: function(){
    // this.setState({subreddit: this.props.params.subreddit});
    // $('.test').val(this.props.params.subreddit);
    // React.findDOMNode(this.refs.searchTerm).value(this.props.params.subreddit);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({subreddit: nextProps.params.subreddit});
    // console.log(nextProps);
    this.search(nextProps.params.subreddit);
  },
  search: function(sub) {
    RedditAPI.getSearch(sub).then(function(data){
      if(this.isMounted()){
        this.setState({
          posts: data.data.children,
          next: data.data.after,
        });
      }
    }.bind(this));
  },
  handleChange: function(event) {
    this.setState({subreddit: event.target.value.substr(0, 140)});
    // this.props.onChange(event.target.value);
  },
  handleSubmit: function() {
    // this.context.router.transitionTo('search', {subreddit: this.state.subreddit});
    this.context.router.transitionTo('/' + encodeURIComponent(this.state.subreddit));
    // this.setState({subreddit: this.state.subreddit});
  },
  componentWillMount: function(){
    this.search(this.state.subreddit);
  },
  render: function() {
    // console.log(this.getParams().subreddit);

    var subreddit = decodeURIComponent(this.state.subreddit);

    return (
      <div>
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input className="test" value={subreddit} onChange={this.handleChange} type="text" ref="searchTerm" />
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
    <Route name="search" path="/:subreddit*" handler={Search}/>
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