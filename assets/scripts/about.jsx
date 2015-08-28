var React = require('react');
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
            <div className="body">Source code at <a href="https://github.com/kevhou/Searchdit">Github</a></div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
});

module.exports = About;