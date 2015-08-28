var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var DocumentTitle = require("react-document-title");

var Help = React.createClass({
  render: function() {
    return(
      <DocumentTitle title="Help - Searchdit">
        <div className="m-info">
    			<a className="info-logo" href="#">
    				<img className="img-responsive" alt="Searchdit" src="assets/images/logo1.png"/>
    			</a>

          <div className="info-body">
            <div className="title">HELP</div>
            <div className="body">Search as you would on reddit</div>
            <div className="body">Search '/r/[subreddit]' to view posts of a certain subreddit</div>
          </div>

          <div className="m-footer">
            <Link to="home">Home</Link>
            <Link to="help">Help</Link>
            <Link to="about">About</Link>
            <Link to="search" params={{sort: "hot", splat:"/r/random"}}>Random</Link>
          </div>
        </div>
      </DocumentTitle>
    )
  }
});

module.exports = Help;