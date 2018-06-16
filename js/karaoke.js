window.snowAsyncInit = function() {
   var config = {
      //'wss_ip': "192.168.1.187",
      'wss_ip': "wss.snowem.io",
      'wss_port': 8443
   };
   SnowSDK.init(config);

   console.log("start your app here");
   start_app();
}


function start_app() {

  var vid = document.getElementById("videoTag");
  var channel = null;
  var config = {
    'audio': true,
    'video': true,
    'data' : true
  };
  var stream = new SnowSDK.Stream(config);

  function onSuccess(data) {
     channel = data;

     var channelid = channel.id;
     console.log("channelid: " + JSON.stringify(channelid));

     $("#playFBDiv").append('<div class="text-center"> channel id: <span id="channelId"></span></div>');
     document.getElementById("channelId").innerHTML = channelid;

     channel.listen("onConnected", function() {
       console.log("onConnected");
     });

     channel.listen("onAddStream", function(stream) {
       console.log("onAddStream: got remote stream " + JSON.stringify(stream.getId()));
       stream.listen("onMediaReady", function(info) {
         console.log("onMediaReady: got media");
         var remote_video_elm = document.getElementById("remoteVideo");
         $("#remoteVideo").show();
         stream.setRemoteVideoElm(remote_video_elm);

         var localElm = document.getElementById('localVideo');
         localElm.volume = 0.0;
         stream.setLocalVideoElm(localElm);
         stream.call();
       });
       stream.getUserMedia({'type':'video', 'tag': 'videoTag'});
     });

     channel.listen("onRemoveStream", function(stream) {
       console.log("removed stream " + stream.getId());
     });
     channel.connect();
  }

  function onError(resp) {
     console.log("resp: " + resp);
  }

  $("#remoteVideo").hide();
  vid.onplay = function() {
    var data = {
      'name': 'karaoke',
      'type': 'p2p',
      'key': 'nonce'
    }
    vid.volume = 0.0;
    SnowSDK.createChannel(data, onSuccess, onError);
  };
}

