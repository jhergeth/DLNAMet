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

const dlnaStatus = Meteor.subscribe('dlna.status');

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
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (getState('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  selectedNode: function(){
    var sn = getState('dlna.selectedNode');
    return sn?sn.title + ' [' + sn.key + ']':"";
  },
  selectedNodeIcon: function(){
    var sn = getState('dlna.selectedNode');
    return sn?sn.icon:"";
  },
  playPath: function(){
    var sn = getState('dlna.selectedNode');
    return sn?sn.itemPath:"";
  },
  playRestTime: function(){
    var sn = getState('dlna.selectedNode');
    return sn?sn.restTime:"";
  },
});



Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
    setState('hideCompleted', event.target.checked);
  },
});


