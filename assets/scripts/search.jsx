var React = require('react');
var InfiniteScroll = require('react-infinite-scroll')(React);
var Moment = require('moment');
var Truncate = require('truncate');
var Router = require('react-router');
var Route = Router.Route;

var RedditAPI = require('./RedditAPI.js');

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
  render: function() {
    var subreddit, date, score, comments, text, nsfw;

    console.log(this.state.posts[0]);

    return (
      <div className="container">
        <div className="row">
          <div className="input-group">
             <input value={this.state.path} onChange={this.handleChange} type="text" className="form-control"/>
             <span className="input-group-btn">
                  <button className="btn btn-default" type="button" onClick={this.handleSubmit}>Search</button>
             </span>
          </div>
        </div>

        <div className="row">
          {this.state.posts.map(function(item, i) {
            var data = item.data;
            subreddit = '/r/' + data.subreddit;
            subredditLink = '/#/q=' + subreddit;
            date = Moment.unix(data.created_utc).fromNow();
            score = data.score + ' pts';
            numComments = data.num_comments + ' comments';
            commentsLink = '/#/comments=' + data.id;
            text = Truncate(data.selftext, 300);
            if(data.over_18){
              nsfw = "[NSFW]";
            }

            return(
              <div key={i}>
                <h4><a href={commentsLink}>{item.data.title}</a> - <a href={subredditLink}>{subreddit}</a></h4>
                <p>{text}</p>
                <p>{nsfw} {date} - {score} - {numComments}</p>
                <br/><br/>
              </div>
            )
          }.bind(this))}

          { this.state.next ? <button className="btn btn-default" onClick={this.handleShowMore}>Show More</button> :null }
        </div>
      </div>
    )
  }
});

// <div>
//   <form className="commentForm" onSubmit={this.handleSubmit}>
//     <input className="test" value={path} onChange={this.handleChange} type="text" ref="searchTerm" />
//     <input type="submit" value="Search" />
//   </form>

//   {this.state.posts.map(function(item, i) {
//     var data = item.data;
//     subreddit = '/r/' + data.subreddit;
//     subredditLink = '/#/r/' + data.subreddit;
//     date = data.created;
//     score = data.score + ' pts';
//     comments = data.num_comments + ' comments';

//     return(
//       <div key={i}>
//         <p>{item.data.title}</p>
//         <p>{date} - {score} - {comments}</p>
//         <a href={subredditLink}>{subreddit}</a>
//         <br/><br/>
//       </div>
//     )
//   }.bind(this))}

//   { this.state.next ? <button className="btn btn-default" onClick={this.handleShowMore}>Show More</button> :null }
// </div>

// <div className="container">
//   <h1>SEARCHDIT</h1>
//   <div className="row">
//     <form className="input-group" onSubmit={this.handleSubmit}>
//        <input value={this.state.search} onChange={this.handleChange} type="text" className="form-control"/>
//        <span className="input-group-btn">
//             <button className="btn btn-default" type="submit">Search</button>
//        </span>
//     </form>
//   </div>
// </div>

module.exports = Search;