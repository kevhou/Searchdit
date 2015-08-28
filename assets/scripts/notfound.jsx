var React = require('react');
var DocumentTitle = require("react-document-title");

var NotFound = React.createClass({
  render: function() {
    return(
		<DocumentTitle title="Notfound - Searchdit">
			<h1>NOT FOUND</h1>
		</DocumentTitle>
    )
  }
});

module.exports = NotFound;