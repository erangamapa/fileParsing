var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '274586',
  key: '0650e45d333a22a63199',
  secret: 'a12eeebcfa7b77bc74b3',
  cluster: 'ap1',
  encrypted: true
});

exports.sendMessage = function(channelName, event, value){
	pusher.trigger(channelName, event, {
	  "value": value
	});
}