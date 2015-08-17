var React = require('react');
var InfiniteScroll = require('react-infinite-scroll')(React);
var Moment = require('moment');
var Truncate = require('truncate');
var Router = require('react-router');
var Route = Router.Route;
var entities = require("entities");

var RedditAPI = require('./RedditAPI.js');

var SearchBar = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      search: "",
    };
  },
  handleSubmit: function() {
    if($.trim(this.state.search)){
      this.context.router.transitionTo('/q=' + this.state.search);
    }
  },
  handleChange: function(event) {
    this.setState({search: event.target.value.substr(0, 140)});
  },
  render: function() {
    return(
      <div className="row">
        <form className="input-group" onSubmit={this.handleSubmit}>
           <input value={this.state.search} onChange={this.handleChange} type="text" className="form-control"/>
           <span className="input-group-btn">
                <button className="btn btn-default" type="submit">Search</button>
           </span>
        </form>
      </div>
    )
  }
});

var Search = React.createClass({
  mixins: [Router.Navigation],

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
  // <div className="l-search-result">
        
  //       <div className="search-result-bar">
  //         <div className="row m-search-bar">
  //           <div className="col-sm-2">
  //             <a  href="#">
  //               <img className="search-bar-img" alt="Searchdit" src="assets/images/logo1.png"/>
  //             </a>
  //           </div>
            
  //           <div className="navbar-form col-sm-10" role="search">
  //             <div className="input-group">
  //               <input value={this.state.path} onChange={this.handleChange} type="text" className="form-control"/>
  //               <div className="input-group-btn">
  //                 <button className="btn btn-default" onClick={this.handleSubmit}><i className="glyphicon glyphicon-search"></i></button>
  //               </div>
  //             </div>
  //           </div>
  //         </div><input className="searchbar-input form-control" value={this.state.path} onChange={this.handleChange} type="text" />
  //       </div>
  render: function() {
    var title, subreddit, date, score, comments, text, nsfw;

    return (
      <div className="l-result">

        <div className="result-bar">

          <div className="m-searchbar">
            <a tabIndex="-1" href="#">
              <span className="searchbar-logo">Searchdit</span>
            </a>
            <div className="input-group">
              <input className="form-control " value={this.state.path} onChange={this.handleChange} type="text"/>
              <div className="input-group-btn">
                <button className="btn btn-default" onClick={this.handleSubmit}><i className="glyphicon glyphicon-search"></i></button>
              </div>
            </div>
            
            
          </div>

        </div>

        <div className="result-body">
          <div className="m-result">
            {this.state.posts.map(function(item, i) {
              var data = item.data;
              title = entities.decodeHTML(item.data.title);
              subreddit = '/r/' + data.subreddit;
              subredditLink = '/#/q=' + subreddit;
              date = Moment.unix(data.created_utc).fromNow();
              score = data.score + ' pts';
              numComments = data.num_comments + ' comments';
              commentsLink = '/#/comments=' + data.id;
              text = Truncate(data.selftext, 150);
              if(data.over_18){
                nsfw = "[NSFW]";
              }

              return(
                <div className="result-block" key={i}>
                  <div className="result-title"><a href={commentsLink}>{title}</a> <a className="result-subreddit" href={subredditLink}>{subreddit}</a></div>
                  <div className="result-text">{text}</div>
                  <div className="result-footer">{nsfw} {date} - {score} - {numComments}</div>
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