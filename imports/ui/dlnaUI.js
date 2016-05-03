/**
 * Created by joachim on 13.04.2016.
 */
import { Template } from 'meteor/templating';

import {setState, getState } from './body.js';

import './dlnaUI.html';

Template.dlnaUI.helpers({
  scanRenderer: function () {
    return getState('dlna.scanRenderer');
  },
  duration: function(){
    return getState('dlna.duration');
  },
  random: function(){
    return getState('dlna.random');
  },
});

Template.dlnaUI.onCreated(function bodyOnCreated() {
  const instance = Template.instance();

  scanRenderer();
});

Template.dlnaUI.onRendered(function(){
});

Template.dlnaUI.events({
  'click button': function(event){
    var scr = getState('dlna.rendererSelected');
    var node = getState('dlna.selectedNode');
    var dur = getState('dlna.duration');
    if(scr != null ){
      var parts = node.key.split("|");
      var srv = parts[0];
      var key = "";
      if( parts.length == 2){
        key = parts[1];
      }
      else{
        key = "0";
      }
      Meteor.call('dlna.play', scr, srv, key, dur, function (err, res) {
        setState('dlna.doPlay', 'play '+key+' from '+srv+' to '+scr);
      });
    }

  },
  'change #renderer': function(event){
    setState('dlna.rendererSelected', event.target.value);
  },
  'change #duration': function(event){
    setState('dlna.duration', parseFloat(event.target.value)*1000);
  },
  'change #random': function(event){
    setState('dlna.random', event.target.value);
  },
});

function scanRenderer(){
  instance = Template.instance();
  Meteor.call('dlna.scanRenderer', function (err, res) {
    // The method call sets the Session variable to the callback value
    if (err) {
      setState('dlna.Error', {error: err});
    } else {
      setState('dlna.scanRenderer', res);
      return res;
    }
  });
}