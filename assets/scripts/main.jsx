var React = require('react');
window.$ = window.jQuery = require('jquery')
require('bootstrap');
var InfiniteScroll = require('react-infinite-scroll')(React);
var Truncate = require('truncate');
var Moment = require('moment');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var Link = Router.Link;

var RedditAPI = require('./RedditAPI.js');
var Search = require('./search.jsx');
var entities = require("entities");

var Home = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      search: null,
    };
  },
  handleSubmit: function() {
    this.context.router.transitionTo('/q=' + this.state.search);
    // console.log(this.refs.search)
  },
  handleChange: function(event) {
    this.setState({search: event.target.value.substr(0, 140)});
  },
  render: function() {
    return(
      <div className="container">
        <h1>SEARCHDIT</h1>
        <div className="row">
          <form className="input-group" onSubmit={this.handleSubmit}>
             <input value={this.state.search} onChange={this.handleChange} type="text" className="form-control"/>
             <span className="input-group-btn">
                  <button className="btn btn-default" type="submit">Search</button>
             </span>
          </form>
        </div>
      </div>
    )
  }
});


// <div>
//         <h1>SEARCHDIT</h1>
//         <div onSubmit={this.handleSubmit}>
//           <input value={this.state.search} onChange={this.handleChange} type="text"/>
//           <input type="submit" value="Search" />
//         </div>
//       </div>

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

var Comments = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      post: null,
      comments: [],
      path: null,
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({path: nextProps.params.splat});
  },
  handleChange: function(event) {
    this.setState({path: event.target.value.substr(0, 140)});
  },
  handleSubmit: function() {
    this.context.router.transitionTo('/q=' + this.state.path);
  },
  componentDidMount: function(){
    RedditAPI.getComment(this.props.params.id)
    .then(function(data){
      if(this.isMounted()){
        this.setState({
          post: data[0].data.children,
          comments: data[1].data.children,
        });
      }
    }.bind(this));
  },
  getComments: function(comments){
    return(
      <div className="row">
        {comments.map(function(item, i) {
          var data = item.data;
          // var text = Truncate(data.body, 300);
          var text = entities.decodeHTML(data.body_html);
          var author = data.author;
          var date = Moment.unix(data.created_utc).fromNow();
          var score = data.score + ' pts';

          return(
            <ul key={i}>
              { item.kind == "more" ? <li><a> more </a></li> : (
                <li>
                <p dangerouslySetInnerHTML={{__html: text}} />
                <h5>- {author} - {date} - {score}</h5>
                </li>
              )}
              
              { data.replies ? <ul> {this.getComments(data.replies.data.children)} </ul> : null }
            </ul>
          )
        }.bind(this))}
      </div>
    )
  },
  //              { data.replies ? <ul> {this.getComments(data.replies.data.children)} </ul> : null }

  render: function() {
    console.log(this.state.comments[0])

    return(
      <div className="container">
        <div className="row">
          <div className="input-group">
             <input value={this.state.path} onChange={this.handleChange} type="text" className="form-control"/>
             <span className="input-group-btn">
                  <button className="btn btn-default" type="button" onClick={this.handleSubmit}>Search</button>
             </span>
          </div>
        </div>

        {this.getComments(this.state.comments)}
      </div>
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
    React.render(<Root/>, document.body);
});