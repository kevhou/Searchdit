var React = require('react');
var Truncate = require('truncate');
var Moment = require('moment');
var Router = require('react-router');
var Link = Router.Link;

var RedditAPI = require('./RedditAPI.js');
var entities = require("entities");

var Comments = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      post: null,
      comments: [],
      path: this.props.params.id,
      sort: this.props.params.sort,
      search: null,
    };
  },
  comments: function(sub, sort) {
    RedditAPI.getComment(sub, sort).then(function(data){
      if(this.isMounted()){
        this.setState({
          post: data[0].data.children,
          comments: data[1].data.children,
        });
      }
    }.bind(this));
  },
  handleChange: function(event) {
    this.setState({search: event.target.value.substr(0, 140)});
  },
  handleSubmit: function(e) {
    e.preventDefault();

    this.context.router.transitionTo('/sort=hot&q=' + this.state.search);
  },
  componentDidMount: function(){
    this.comments(this.state.path, this.state.sort);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({path: nextProps.params.id,
                   sort: nextProps.params.sort});
    this.comments(nextProps.params.id, nextProps.params.sort);
  },
  getComments: function(comments){
    return(
      <div className="m-comments">
        {comments.map(function(item, i) {
          var data = item.data;
          var text = entities.decodeHTML(data.body_html);
          var author = data.author;
          var date = Moment.unix(data.created_utc).fromNow();
          var score = data.score + ' pts';

          return(
            <ul className="comments-list" key={i}>
              { item.kind == "more" ? <li><Link to="comments" params={{sort: "best", id: this.props.params.id + "/" + item.data.id}}> more </Link></li> : (
                <li className="comments-item">
                  <div className="comments-author">
                    {author} <span className="comments-info"> {date} - {score}</span>
                  </div>
                  <div className="comments-text" dangerouslySetInnerHTML={{__html: text}} />
                </li>
              )}
              
              { data.replies ? <div> {this.getComments(data.replies.data.children)} </div> : null }
            </ul>
          )
        }.bind(this))}
      </div>
    )
  },
  getPost: function(){
    var data, title, titleLink, subreddit, date, score, comments, text, nsfw, subredditLink, numComments;
    
      data = this.state.post[0].data;
      title = entities.decodeHTML(data.title);
      subreddit = '/r/' + data.subreddit;
      subredditLink = '/#/q=' + subreddit;
      date = Moment.unix(data.created_utc).fromNow();
      score = data.score + ' pts';
      numComments = data.num_comments + ' comments';
      
      if(data.selftext){
        text = entities.decodeHTML(data.selftext_html);
      }else{
        text = data.url;
        titleLink = data.url;
      }

      if(data.over_18){
        nsfw = "[NSFW]";
      }

    return(
      <div className="m-post">
        <div className="post-block">
          <div><a className="post-title" href={titleLink}>{title}</a> <Link className="post-subreddit" to="search" params={{sort: "hot", splat: subreddit}}>{subreddit}</Link></div>
          <div className="post-text" dangerouslySetInnerHTML={{__html: text}} />
          <div className="post-footer">{nsfw} {date} - {score} - {numComments}</div>
        </div>
      </div>
    )
  },
  render: function() {
    return(
      <div className="l-comments">

        <div className="comments-bar">
          <div className="m-searchbar">
            <a href="#">
              <span className="searchbar-logo">Searchdit</span>
            </a>
            <form className="input-group" onSubmit={this.handleSubmit}>
              <input className="form-control " value={this.state.search} onChange={this.handleChange} type="text"/>
              <div className="input-group-btn">
                <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
              </div>
            </form>
          </div>
        </div>

        <div className="comments-sort">
          <div className="m-sort">
              <Link activeClassName="selected" to="comments" params={{sort: "best", id: this.props.params.id}}>Best</Link>
              <Link activeClassName="selected" to="comments" params={{sort: "top", id: this.props.params.id}}>Top</Link>
              <Link activeClassName="selected" to="comments" params={{sort: "new", id: this.props.params.id}}>New</Link>
              <Link activeClassName="selected" to="comments" params={{sort: "controversial", id: this.props.params.id}}>Controversial</Link>
              <Link activeClassName="selected" to="comments" params={{sort: "old", id: this.props.params.id}}>Old</Link>
              <Link activeClassName="selected" to="comments" params={{sort: "qa", id: this.props.params.id}}>Q&A</Link>
          </div>
        </div>

        { this.state.post ? <div className="comments-post">{this.getPost()}</div> :null }
        
        <div className="comments-body">
          {this.getComments(this.state.comments)}
        </div>
      </div>
    )
  }
});

module.exports = Comments;