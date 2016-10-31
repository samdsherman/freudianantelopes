var request = require('request');
var bearerToken = require('../config.js');

var parseInstagramHTML = function(instagramHandle, groupMemberName, callback) {
  if (instagramHandle.charAt(0) === '@') {
    instagramHandle = instagramHandle.slice(1);
  }
  var link = 'https://www.instagram.com/' + instagramHandle + '/?hl=en';
  var parsedData = [];
  request({ uri: link}, function(err, response, html) {
    if (err) {
      console.log(err)
    }

    var index = html.indexOf('window._sharedData'), index2;
    html = html.slice(index, html.length);
    index = html.indexOf('<');
    index2 = html.indexOf('{')
    html = html.slice(index2, index - 1);
    html = JSON.parse(html)

    if (html.entry_data.ProfilePage) {
      
      html.entry_data.ProfilePage[0].user.media.nodes.forEach(function(post) {
        var obj = {};
        obj.contentType = 'picture';
        obj.profilePic = html.entry_data.ProfilePage[0].user.profile_pic_url;
        obj.postPic = post.display_src;
        obj.postContent = post.caption;
        obj.groupMemberName = groupMemberName;
        obj.timeStamp = post.date;
        obj.service = 'Instagram';
        obj.linkToPost = 'https://www.instagram.com/p/' + post.code + '/?taken-by=' + html.entry_data.ProfilePage[0].user.instagramHandle
        obj.likes = post.likes.count;
        obj.numberComments = post.comments.count;
        parsedData.push(obj)
      })
    }
    callback(parsedData);
  })
};

var parseTwitterAPI = function(twitterHandle, groupMemberName, callback) {
  if (twitterHandle.charAt(0) === '@') {
    twitterHandle = twitterHandle.slice(1);
  }
  var link = 'https://api.twitter.com/1.1/statuses/user_timeline.json\?count\=10\&screen_name\=' + twitterHandle;
  // For security, we should clean this up later
  request({
    method: 'GET',
    uri: link,
    headers: {Authorization: bearerToken}
  }, function(err, apiResponse) {
    if (err) {
      console.log('could not call twitter api', err);
    }
    apiResponse = JSON.parse(apiResponse.body);
    var parsedResponses = [];

    for (var i = 0; i < apiResponse.length; i++) {
      parsedResponses[i] = {};

      parsedResponses[i].profilePic = apiResponse[i].user.profile_image_url_https;
      parsedResponses[i].postContent = apiResponse[i].text;
      parsedResponses[i].contentType;
      parsedResponses[i].groupMemberName = groupMemberName;
      parsedResponses[i].timeStamp = apiResponse[i].created_at;
      parsedResponses[i].service = 'Twitter';
      parsedResponses[i].linkToPost = 'https://twitter.com/' + apiResponse[i].user.screen_name + '/status/' + apiResponse[i].id_str;
      parsedResponses[i].retweetCount = apiResponse[i].retweet_count;
      parsedResponses[i].likes = apiResponse[i].favorite_count;
      parsedResponses[i].numberComments;
    }
    callback(parsedResponses);
  });
};

var parseURL = function(url) {
  var url = url.slice(7);
  var username = url.slice(0, url.indexOf('/'));
  var groupName = url.slice(username.length + 1);

  return { username: username, groupName: groupName };
}

exports.parseInstagramHTML = parseInstagramHTML;
exports.parseTwitterAPI = parseTwitterAPI;
exports.parseURL = parseURL;