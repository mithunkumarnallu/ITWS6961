//Animator function which animates controls. It works by calling jQuery's animate API and sets each element's marginTop to
//negative of its existing height. Also, it sets the time for this animation to happen as 3 secs and once its done, it appends the animated
//element to the end of its parent
function animator(current_item) {
	var distance =  current_item.height();
	current_item.animate({marginTop: -distance}, 3000, "swing", function() {
		current_item.appendTo(current_item.parent()).css("marginTop",0);
		animator(current_item.parent().children(":first"));
	});
};
var myModule = angular.module('twitterTicker', []);

myModule.controller('TwitterTickerController', TwitterTickerController);

function TwitterTickerController()
{
	this.count = 20;
	this.format = /^[0-9]$/;
	this.tweetsExtracted = 20;
	this.getTweets(this.count);
	
}

TwitterTickerController.prototype.getTweets = function(count) {
	console.log("Inside getTweets");
	$.ajax({
		type: "GET",
		url: "/getTweets?count=" + count,
		
		//If the AJAX call could successfully read tweets.json create the html dynamically
		success: function(responseData, status) {
			console.log("Got data from backend");
			renderTweets(count);
			
		},
		error: function(err) {
			console.log(JSON.stringify(err));
		}
	});
	this.tweetsExtracted = count;
}
	
function renderTweets(count)
{
	var i=0;
	
	//Read tweets.json file with an AJAX call
	$.ajax({
		type: "GET",
		url: "/data/" + count + "tweets.json",
		dataType: "json",
		
		//If the AJAX call could successfully read tweets.json create the html dynamically
		success: function(responseData, status) {
			//mainDiv is where I am inserting every row of the tweet ticker
			var mainDiv = $("#mainDiv");
			var hashTagDiv = $("#hashTagDiv");
			mainDiv.empty();
			hashTagDiv.empty();
			
			for(var i = 0; i < responseData.length; i++)
			{
				var profileUrl = responseData[i].user.profile_image_url;
				var tweet = responseData[i].text;
				//Reusing a html I created in html for each tweet, which includes styling info and data to be shown
				var tweetTemplate = $($("#tweetTemplate").html());
				var div = $("<div>");
				
				//Setting the tweetTemplate's profile picture url and tweet text dynamically
				tweetTemplate.find("#profile_picture").attr("src",profileUrl);
				tweetTemplate.find("#tweet").text(tweet);
				
				div.append(tweetTemplate);
				
				//Append the generated tweetTemplate for each tweet to mainDic
				mainDiv.append(div);
			}
			
			//Get hashtags from entities present in all tweets
			var hashTags = getHashTags(responseData);
			for(var i = 0; i < hashTags.length; i++)
			{
				var div = $("<div>");
				div.text(hashTags[i]);
				//Dynamically create and append the created hashTag to hashTagDiv
				hashTagDiv.append(div);
			}
			//Animator function which animates controls
			animator(mainDiv.children(":first"));
			animator(hashTagDiv.children(":first"));
		},
		error: function(err) {
			console.log("Could not read tweets from server " + (JSON.stringify(err)));
		}
	});
};

//Iterate through all hashtags present in all entities data and return a single array of hashtags
function getHashTags(data)	{
	var hashTags = [];
	for(var i = 0; i < data.length; i++)
	{
		if(data[i].entities.hashtags.length > 0)
		{
			var innerHashTags = data[i].entities.hashtags;
			for(var j = 0; j < innerHashTags.length; j++)
			{
				hashTags.push("#" + innerHashTags[j].text);
			}
		}
	}
	return hashTags;
}
