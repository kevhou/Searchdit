var React = require('react');
var InfiniteScroll = require('react-infinite-scroll')(React);
var Moment = require('moment');
var Truncate = require('truncate');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var entities = require("entities");
var DocumentTitle = require("react-document-title");

var RedditAPI = require('./RedditAPI.js');

var Search = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      posts: [],
      next: null,
      path: this.props.params.splat,
      sort: this.props.params.sort,
      type: null,
    };
  },
  sub: function(sub, sort) {
    RedditAPI.getSub(sub, sort).then(function(data){
      if(this.isMounted()){
        if(sub === "/r/random"){
          this.context.router.transitionTo('/sort=hot&q=/r/' + data.data.children[0].data.subreddit);
        }
        if(data.data.children.length == 0){
            this.setState({
              posts: [{data: {title: "No posts found",
                              subreddit: null,
                              id: null,
                              selftext: "there doesn't seem to be anything here"}}],
              next: null,
              type: "sub"
            });
        }else{
          this.setState({
            posts: data.data.children,
            next: data.data.after,
            type: "sub"
          });
        }
      }
    }.bind(this)).fail(function(){
      this.search(sub, sort);
    }.bind(this));
  },
  search: function(sub, sort) {
    RedditAPI.getSearch(sub, sort).then(function(data){
      if(this.isMounted()){
        if(data.data.children.length == 0){
          this.setState({
            posts: [{data: {title: "No search results found",
                            subreddit: null,
                            id: null,
                            selftext: "there doesn't seem to be anything here"}}],
            next: null,
            type: "search"
          });
        }else{
          this.setState({
            posts: data.data.children,
            next: data.data.after,
            type: "search"
          });
        }
      }
    }.bind(this));
  },
  handleShowMore: function(){
    RedditAPI.getNext(this.state.next).then(function(data){
      if(this.isMounted()){
        var appendPosts = this.state.posts.concat(data.data.children);
        this.setState({
          posts: appendPosts,
          next: data.data.after});
      }
    }.bind(this));
  },
  componentDidMount: function(){
    this.sub(this.state.path, this.state.sort);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({path: nextProps.params.splat,
                   sort: nextProps.params.sort});
    this.sub(nextProps.params.splat, nextProps.params.sort);
  },
  handleChange: function(event) {
    this.setState({path: event.target.value.substr(0, 140)});
  },
  handleSubmit: function(e) {
    e.preventDefault();

    this.context.router.transitionTo('/sort=hot&q=' + this.state.path);
  },
  getComponent: function() {
      $(this.getDOMNode()).addClass("selected");
  },
  render: function() {
    var title, titleLink, subreddit, date, score, comments, text, nsfw;

    return (
      <DocumentTitle title={this.props.params.splat + "- Searchdit"}>
        <div id="content">
          <div className="l-result">

            <div className="result-bar">
              <div className="m-searchbar">
                <a href="#">
                  <span className="searchbar-logo">Searchdit</span>
                </a>

                <form className="input-group" onSubmit={this.handleSubmit}>
                  <input className="form-control" value={this.state.path} onChange={this.handleChange} type="text"/>
                  <div className="input-group-btn">
                    <button className="btn" type="submit"><i className="glyphicon glyphicon-search"></i></button>
                  </div>
                </form>

              </div>
            </div>

            <div className="result-sort">
              <div className="m-sort">
                  { this.state.type ? <Link activeClassName="selected" to="search" params={{sort: "hot", splat: this.props.params.splat}}>Hot</Link> : null}
                  { this.state.type ? <Link activeClassName="selected" to="search" params={{sort: "new", splat: this.props.params.splat}}>New</Link> : null}
                  { this.state.type === "sub" ? <Link activeClassName="selected" to="search" params={{sort: "rising", splat: this.props.params.splat}}>Rising</Link> : null}
                  { this.state.type === "sub" ? <Link activeClassName="selected" to="search" params={{sort: "controversial", splat: this.props.params.splat}}>Controversial</Link> : null}
                  { this.state.type ? <Link activeClassName="selected" to="search" params={{sort: "top", splat: this.props.params.splat}}>Top</Link> : null}
                  { this.state.type === "search" ? <Link activeClassName="selected" to="search" params={{sort: "relevance", splat: this.props.params.splat}}>Relevance</Link> : null}
              </div>
            </div>

            <div className="result-body">
              <div className="m-post">
              
                <InfiniteScroll
                  loadMore={this.handleShowMore}
                  hasMore={this.state.next}
                  loader={<div className="loader">Loading ...</div>}>

                  {this.state.posts.map(function(item, i) {
                    var data = item.data;
                    title = entities.decodeHTML(item.data.title);
                    subreddit = '/r/' + data.subreddit;
                    date = Moment.unix(data.created_utc).fromNow();
                    score = data.score + ' pts';
                    numComments = data.num_comments + ' comments';
                    if(data.id){
                      commentsLink = '/#/sort=best&comments=' + data.id;
                    }else{
                      commentsLink = null;
                    }

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
                        <div><a className="post-title" href={titleLink}>{title}</a> { data.subreddit ? <Link className="post-subreddit" to="search" params={{sort: "hot", splat: subreddit}}>{subreddit}</Link> : null}</div>
                        <div className="post-text">{text}</div>
                        { data.id ? <div className="post-footer">{nsfw} {date} - {score} - <a href={commentsLink}>{numComments}</a> </div> : null}
                      </div>
                    )
                  }.bind(this))}

              </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
});

module.exports = Search;