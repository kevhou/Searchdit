var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var DocumentTitle = require("react-document-title");

var About = React.createClass({
  render: function() {
    return(
      <DocumentTitle title="About - Searchdit">
        <div className="m-info">
    			<a className="info-logo" href="#">
    				<img className="img-responsive" alt="Searchdit" src="assets/images/logo1.png"/>
    			</a>

          <div className="info-body">
            <div className="title">ABOUT</div>
            <div className="body">Browse reddit at work without getting caught</div>
            <div className="body">Built with ReactJs and React-Router</div>
            <div className="body">Source code at <a target="_blank" href="https://github.com/kevhou/Searchdit">Github</a></div>
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

module.exports = About;