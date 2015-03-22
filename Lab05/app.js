var express = require('express');
var app = express();
var Twitter = require('twitter');
var fs = require("fs");

var swig = require("swig");

//I am using swig as template engine
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', './views');

//Declared static directories for front-end to access directly instead of through path requests
app.use('/static', express.static(__dirname + '/static'));
app.use('/javascript', express.static(__dirname + '/javascript'));
app.use('/data', express.static(__dirname + '/data'));

//twitter module client
var client = new Twitter({
  consumer_key: "JcW7s8NqzHVnMWSDSgCA99yxs",
  consumer_secret: "Ubj965D63ctkY7xZgAh1zzv5cVb75kZBSw0X6QD9BYrd7Sjl1n",
  access_token_key: "141926536-7zli3kk32rd7UimUUWbnx8ua5oN9D1nn0e1JUJeT",
  access_token_secret: "JBEbl2UNTtaZ0NKzX7b1b1e56hAinamJoy8d7awkxpyLJ",
});

app.get('/', function (req, res) {
	//Hardcoded the query parameter as RPI and count of tweets to be fetched as 20 by default
	var params = {"q":"RPI", "count" : 20};	
	getTweets(params);
	res.render("tweets");
}); 

app.get('/getTweets', function(req, res) {
	console.log("getTweets route called");
	if(!req.query.count)
		var params = {"q":"RPI", "count" : 20};	
	else
	{	
		console.log("Got a request for " + req.query.count + " tweets");
		var params = {"q":"RPI", "count" : req.query.count};
	}	
	getTweets(params);
	res.send("");
});

//This function calls twitter API and writes the tweets to corresponding file which front-end can access with AJAX request
function getTweets(params) {
	
	var path = "https://api.twitter.com/1.1/search/tweets.json";
	
	(function callTwitterAPI() {
			client.get(path, params, function(error, tweets, response) {
		
			if(!error)
			{
				fs.writeFileSync("./data/" + params.count + "tweets.json", JSON.stringify(tweets.statuses));
			}
			else
				fs.writeFileSync("./data/" + params.count + "tweets.json", "[]");
		})
	})(); 
}

//Created an expressjs server at port 3000
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});