var $ = require('jquery');
var Q = require('q');

var RedditAPI = {
	CURRENT_ENDPOINT: null,
	REDDIT_ENDPOINT: 'https://reddit.com',

	request: function(url, option) {
		var options = option || {};
		var deferred = Q.defer();

		$.ajax({
			dataType: "jsonp", 
			url: url, 
			jsonp: "jsonp",
			options: options})
		.done(function(res) {
			deferred.resolve(res);
		})
		.fail(function(err) {
			deferred.resolve(err);
		});

		return deferred.promise;
	},
	get: function(url, options) {
		options.data = options.data || {};
		options.type = 'GET';

		return RedditAPI.request(url, options);
	},
	getCurrentUser: function() {
	},
	getSubReddit: function(text) {
		var options = {};

		var endPoint = RedditAPI.REDDIT_ENDPOINT + text + ".json?limit=25";

		this.CURRENT_ENDPOINT = endPoint;


		return RedditAPI.get(endPoint, options);
	},
	getSearch: function(text) {
		var options = {};

		var endPoint = RedditAPI.REDDIT_ENDPOINT + "/search.json?q=" + text;

		this.CURRENT_ENDPOINT = endPoint;


		return RedditAPI.get(endPoint, options);
	},
	getNext: function(next) {
		var options = {};

		var endPoint = this.CURRENT_ENDPOINT + "&after=" + next;

		console.log(endPoint);

		return RedditAPI.get(endPoint, options);
	}
};


module.exports = RedditAPI;