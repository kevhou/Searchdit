var React = require('react');
window.$ = window.jQuery = require('jquery')
require('bootstrap');
var _ = require('underscore');
// var Firebase = require('firebase');
// var ReactFireMixin = require('reactfire');
// var firebaseRef = new Firebase("https://klickstalker.firebaseio.com/stalker");
// var Loader = require('react-loader');
// var ga = require('react-google-analytics');
// var GAInitiailizer = ga.Initializer;

var RedditAPI = require('./RedditAPI.js');

var App = React.createClass({
	// mixins: [ReactFireMixin],

	getInitialState: function () {
	    return {
	    };
	},
	render: function() {
		return (
			<p>hi</p>
		)
	}
});

React.render(<App/>, document.getElementById('content'));