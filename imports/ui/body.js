import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import 'meteor/mizzao:jquery-ui';

import { Tasks } from '../api/tasks.js';

import './components/combobox/bootstrap-combobox.css';
import { Combobox } from './components/combobox/bootstrap-combobox.js';

import './components/fancyTree/ui.fancytree.min.css';

import './task.js';
import './scanServers.js';
// import './scanRenderer.js';
import './fancyTree.js';
import './dlnaUI.js';
import './dispCurr.js';
import './body.html';

// const dlnaStatus = Meteor.subscribe('dlna.status');

let State = null;

export function getState(key){
  if( State == null )
    return null;

  return State.get(key);
}

export function setState(key, val){
  if( State == null )
    return null;

  return State.set(key, val);
}

Template.body.onCreated(function bodyOnCreated() {
  State = new ReactiveDict();
  scanRenderer();
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
  },
  selectedNode: function(){
    var sn = getState('dlna.selectedNode');
    return sn?sn.title + ' [' + sn.key + ']':"";
  },
  selectedPath: function(){
    var sn = getState('dlna.selectedNode');
    return sn?sn.uri:"";
  },
  selectedNodeIcon: function(){
    var sn = getState('dlna.selectedNode');
    return sn?sn.icon:"";
  },
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



Template.body.events({
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