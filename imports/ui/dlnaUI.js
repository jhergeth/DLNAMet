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

});

Template.dlnaUI.onRendered(function(){
});

Template.dlnaUI.events({
  'click .go': function(event){
    var scr = this.id;
    if(scr != null ){
      var node = getState('dlna.selectedNode');
      setState('dlna.PlaylistTitle', node.title);
      var dur = getState('dlna.duration');
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

  'click .backk': function(event){
    var scr = this.id;
    if(scr != null ){
      Meteor.call('dlna.cmd', 'jump', scr, -10);
    }
  },

  'click .back': function(event){
    var scr = this.id;
    if(scr != null ){
      Meteor.call('dlna.cmd', 'jump', scr, -1);
    }
  },

  'click .forw': function(event){
    var scr = this.id;
    if(scr != null ){
      Meteor.call('dlna.cmd', 'jump', scr, 1);
    }
  },

  'click .forww': function(event){
    var scr = this.id;
    if(scr != null ){
      Meteor.call('dlna.cmd', 'jump', scr, 10);
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
