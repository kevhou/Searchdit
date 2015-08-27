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
			deferred.reject(err);
		});

		return deferred.promise;
	},
	get: function(url, options) {
		options.data = options.data || {};
		options.type = 'GET';

		return RedditAPI.request(url, options);
	},
	getSub: function(text) {
		var options = {};

		// var path = decodeURIComponent(text);

		var endPoint = RedditAPI.REDDIT_ENDPOINT + text + ".json?limit=25&jsonp=?";

		this.CURRENT_ENDPOINT = endPoint;

		return RedditAPI.get(endPoint, options);
	},
	getSearch: function(text) {
		var options = {};

		var endPoint = RedditAPI.REDDIT_ENDPOINT + "/search.json?q=" + text + "&jsonp=?";

		this.CURRENT_ENDPOINT = endPoint;


		return RedditAPI.get(endPoint, options);
	},
	getComment: function(id) {
		var options = {};

		var endPoint = RedditAPI.REDDIT_ENDPOINT + "/comments/" + id + ".json";

		this.CURRENT_ENDPOINT = endPoint;


		return RedditAPI.get(endPoint, options);
	},
	getNext: function(next) {
		var options = {};

		var endPoint = this.CURRENT_ENDPOINT + "&after=" + next;

		return RedditAPI.get(endPoint, options);
	}
};


module.exports = RedditAPI;