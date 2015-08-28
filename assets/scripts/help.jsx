var React = require('react');
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
        </div>
      </DocumentTitle>
    )
  }
});

module.exports = Help;