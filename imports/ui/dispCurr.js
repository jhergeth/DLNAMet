/**
 * Created by joachim on 13.04.2016.
 */
import { Template } from 'meteor/templating';

import {setState, getState } from './body.js';

import './dispCurr.html';

const dlnaStatus = new Mongo.Collection("dlna.screenStatus");

Template.dispCurr.onCreated(function bodyOnCreated() {
  this.getScreen = () => getState('dlna.rendererSelected');
  this.autorun(() => {
    this.subscribe('dlna.Status', this.getScreen() );
  });
});

Template.dispCurr.helpers({
  playRestTime: function () {
    var scr = getState('dlna.rendererSelected');
    if(typeof scr !== 'undefined')
      return dlnaStatus.findOne(scr).restTime/1000;
    else
      return "";
  },
  playPath: function(){
    var scr = getState('dlna.rendererSelected');
    if(typeof scr !== 'undefined')
      return dlnaStatus.findOne(scr).itemPath;
    else
      return "";
  },
  playTitle: function(){
    var scr = getState('dlna.rendererSelected');
    if(typeof scr !== 'undefined')
      return dlnaStatus.findOne(scr).itemTitle;
    else
      return "";
  },
  itemNo: function(){
    var scr = getState('dlna.rendererSelected');
    if(typeof scr !== 'undefined')
      return dlnaStatus.findOne(scr).itemNo;
    else
      return "";
  },
  listLength: function(){
    var scr = getState('dlna.rendererSelected');
    if(typeof scr !== 'undefined')
      return dlnaStatus.findOne(scr).listLength;
    else
      return "";
  },
});

