var React = require('react');
var InfiniteScroll = require('react-infinite-scroll')(React);
var Moment = require('moment');
var Truncate = require('truncate');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var entities = require("entities");

var RedditAPI = require('./RedditAPI.js');

var Search = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      posts: [],
      next: null,
      path: this.props.params.splat,
      sort: this.props.params.sort,
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
    this.sub(this.state.path + '/' + this.state.sort);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({path: nextProps.params.splat,
                   sort: nextProps.params.sort});
    this.sub(nextProps.params.splat + '/' + nextProps.params.sort);
  },
  handleChange: function(event) {
    this.setState({path: event.target.value.substr(0, 140)});
  },
  handleSubmit: function() {
    this.context.router.transitionTo('/sort=hot&q=' + this.state.path);
  },
  sortBy: function(sort) {
    // this.context.router.transitionTo('/sort=hot&q=' + this.state.path);
    this.context.router.transitionTo('/sort='+ sort + '&q=' + this.state.path);
    // console.log("test")
  },
  getComponent: function() {
      $(this.getDOMNode()).addClass("selected");
  },
  render: function() {
    var title, titleLink, subreddit, date, score, comments, text, nsfw;

    return (
      <div className="l-result">

        <div className="result-bar">
          <div className="m-searchbar">
            <a href="#">
              <span className="searchbar-logo">Searchdit</span>
            </a>
            <div className="input-group">
              <input className="form-control" value={this.state.path} onChange={this.handleChange} type="text"/>
              <div className="input-group-btn">
                <button className="btn" onClick={this.handleSubmit}><i className="glyphicon glyphicon-search"></i></button>
              </div>
            </div>
          </div>
        </div>

        <div className="result-sort">
          <div className="m-sort">
              <Link activeClassName="selected" to="search" params={{sort: "hot", splat: this.props.params.splat}}>Hot</Link>
              <Link activeClassName="selected" to="search" params={{sort: "new", splat: this.props.params.splat}}>New</Link>
              <Link activeClassName="selected" to="search" params={{sort: "rising", splat: this.props.params.splat}}>Rising</Link>
              <Link activeClassName="selected" to="search" params={{sort: "controversial", splat: this.props.params.splat}}>Controversial</Link>
              <Link activeClassName="selected" to="search" params={{sort: "top", splat: this.props.params.splat}}>Top</Link>
          </div>
        </div>

        <div className="result-body">
          <div className="m-post">
            {this.state.posts.map(function(item, i) {
              var data = item.data;
              title = entities.decodeHTML(item.data.title);
              subreddit = '/r/' + data.subreddit;
              date = Moment.unix(data.created_utc).fromNow();
              score = data.score + ' pts';
              numComments = data.num_comments + ' comments';
              commentsLink = '/#/comments=' + data.id;

              if(data.selftext){
                text = Truncate(data.selftext, 150);
                titleLink = commentsLink;
              }else{
                text = Truncate(data.url, 150);
                titleLink = data.url;
              }
              
              if(data.over_18){
                nsfw = "[NSFW]";
              }

              return(
                <div className="post-block" key={i}>
                  <div><a className="post-title" href={titleLink}>{title}</a> <Link className="post-subreddit" to="search" params={{sort: "hot", splat: subreddit}}>{subreddit}</Link></div>
                  <div className="post-text">{text}</div>
                  <div className="post-footer">{nsfw} {date} - {score} - <a href={commentsLink}>{numComments}</a></div>
                </div>
              )
            }.bind(this))}

            { this.state.next ? <button className="btn btn-default" onClick={this.handleShowMore}>Show More</button> :null }
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Search;