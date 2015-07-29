var React = require('react');
window.$ = window.jQuery = require('jquery')
require('bootstrap');
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
      path: this.props.params.splat,
    };
  },
  sub: function(sub) {
    RedditAPI.getSub(sub).then(function(data){
      if(this.isMounted()){
        this.setState({
          posts: data.data.children,
          next: data.data.after,
        });
      }
    }.bind(this)).fail(function(){
      this.search(sub);
    }.bind(this));
  },
  search: function(sub) {
    RedditAPI.getSearch(sub)
    .then(function(data){
      if(this.isMounted()){
        this.setState({
          posts: data.data.children,
          next: data.data.after,
        });
      }
    }.bind(this));
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
  componentDidMount: function(){
    this.sub(this.state.path);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({path: nextProps.params.splat});
    this.sub(nextProps.params.splat);
  },
  handleChange: function(event) {
    this.setState({path: event.target.value.substr(0, 140)});
  },
  handleSubmit: function() {
    this.context.router.transitionTo('/q=' + this.state.path);
  },
  render: function() {
    var path = this.state.path;

    return (
      <div>
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input className="test" value={path} onChange={this.handleChange} type="text" ref="searchTerm" />
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

var Home = React.createClass({
  render: function() {
    return(
      <h1>HOME</h1>
    )
  }
});

var Test = React.createClass({
  mixins: [ Router.State ],

  render: function() {
    console.log(this.context.router.getCurrentQuery());

    return(
      <h1>{this.props.params.splat}</h1>
    )
  }
});

var NotFound = React.createClass({
  render: function() {
    return(
      <h1>NOT FOUND</h1>
    )
  }
});

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
    <Route path="*" handler={NotFound}/>
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
    React.render(<Root/>, document.body);
});