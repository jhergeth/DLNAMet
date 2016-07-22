/**
 * Created by joachim on 13.04.2016.
 */
import { Template } from 'meteor/templating';

import {setState, getState } from './body.js';

import './dispCurr.html';

const dlnaStatus = new Mongo.Collection("dlna.screenStatus");

function hasInfo(scr){
  if(scr != null && typeof scr !== 'undefined'){
    var s = dlnaStatus.findOne(scr);
    if(s != null && s !== 'undefined' )
    return true;
  }
  return false;
}

Template.dispCurr.onCreated(function bodyOnCreated() {
//  this.getScreen = () => getState('dlna.rendererSelected');
  this.screen = this.id;
  this.autorun(() => {
    this.subscribe('dlna.Status', this.screen );
  });
});

Template.dispCurr.helpers({
  playRestTime: function () {
    var scr = this.id;
    if(hasInfo(scr))
      return dlnaStatus.findOne(scr).restTime/1000;
    else
      return "";
  },
  playPath: function(){
    var scr = this.id;
    if(hasInfo(scr))
      return dlnaStatus.findOne(scr).itemPath;
    else
      return "";
  },
  playTitle: function(){
    var scr = this.id;
    if(hasInfo(scr))
      return dlnaStatus.findOne(scr).itemTitle;
    else
      return "";
  },
  itemNo: function(){
    var scr = this.id;
    if(hasInfo(scr))
      return dlnaStatus.findOne(scr).itemNo;
    else
      return "";
  },
  listLength: function(){
    var scr = this.id;
    if(hasInfo(scr))
      return dlnaStatus.findOne(scr).listLength;
    else
      return "";
  },
  playList: function(){
    var scr = this.id;
    if(hasInfo(scr))
      return dlnaStatus.findOne(scr).playlist;
    else
      return "";
  },
});

