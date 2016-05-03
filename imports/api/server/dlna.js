/**
 * Created by joachim on 12.04.2016.
 */
import { Meteor } from 'meteor/meteor';

const DLNA_SERVER = 'http://192.168.178.13:9090/';


export var buildGetDir = function(srv, itm){
  return DLNA_SERVER + 'getDirs?name='+srv+'&itm='+itm;
}

var apiCall = function (apiUrl, callback) {
  // try…catch allows you to handle errors
  try {
    var response = HTTP.get(apiUrl).data;
    // A successful API call returns no error
    // but the contents from the JSON response
    callback(null, response);
  } catch (error) {
    // If the API responded with an error message and a payload
    if (error.response) {
      var errorCode = error.response.data.code;
      var errorMessage = error.response.data.message;
      // Otherwise use a generic error message
    } else {
      var errorCode = 500;
      var errorMessage = 'Cannot access the API';
    }
    // Create an Error object and return it via callback
    var myError = new Meteor.Error(errorCode, errorMessage);
    callback(myError, null);
  }
}


Meteor.methods({
  'dlna.scanServers': function () {
    var apiUrl = DLNA_SERVER + 'getServer';
    // avoid blocking other method calls from the same client
    this.unblock();
    // asynchronous call to the dedicated API calling function
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    return response;
  },

  'dlna.scanRenderer': function () {
    var apiUrl = DLNA_SERVER + 'getRenderer';
    // avoid blocking other method calls from the same client
    this.unblock();
    // asynchronous call to the dedicated API calling function
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    return response;
  },

  'dlna.getDirs': function (srv, itm) {
    var apiUrl = DLNA_SERVER + 'getDirs?name='+srv+'&itm='+itm;
    // avoid blocking other method calls from the same client
    this.unblock();
    // asynchronous call to the dedicated API calling function
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    return response;
  },

  'dlna.play': function (dest, src, itm, len, no) {
    var apiUrl = DLNA_SERVER + 'play?dest='+dest+'&src='+src+'&itm='+itm+'&len='+len;
    if(no != null){
      apiUrl = apiUrl + '&no='+no;
    }
    // avoid blocking other method calls from the same client
    this.unblock();
    // asynchronous call to the dedicated API calling function
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    return response;
  },

  'dlna.stat': function () {
    var apiUrl = DLNA_SERVER + 'pstat';
    // avoid blocking other method calls from the same client
    this.unblock();
    // asynchronous call to the dedicated API calling function
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    return response;
  },

});


const POLL_INTERVAL = 500;
Meteor.publish('dlna.status', function() {
  const publishedKeys = {};

  const poll = () => {
    // Let's assume the data comes back as an array of JSON documents, with an _id field, for simplicity
    const data = HTTP.get(DLNA_SERVER + 'pstat', "");

    /*
     {
     "status":"playing",
     "playlist":"1029",
     "screen":"55ee1fe4-8a9a-11e4-a7b3-8a740cf11e07",
     "server":"d177b566-d506-481e-8985-fbf851ae5c3e",
     "itemTitle":"scan 26",
     "itemPath":"http://192.168.178.20:52100/Image/F20573.jpg",
     "itemNo":26,
     "listLength":29,
     "totalTime":30000,
     "restTime":14000,
     "pictTime":30000
     }
     */
    if(!(data.content === null)){
      var c = JSON.parse(data.content).content;
      var key = c.screen;
      if (publishedKeys[key]) {
        this.changed('dlna.screenStatus', key, c);
      } else {
        publishedKeys[key] = true;
        if (publishedKeys[key]) {
          this.added('dlna.screenStatus', key, c);
        }
      }
    }
  };

  poll();
  this.ready();

  const interval = Meteor.setInterval(poll, POLL_INTERVAL);

  this.onStop(() => {
    Meteor.clearInterval(interval);
  });
});