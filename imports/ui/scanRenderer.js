/**
 * Created by joachim on 13.04.2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import {setState, getState } from './body.js';

import './scanRenderer.html';

Template.scanRenderer.onCreated(function bodyOnCreated() {
  const instance = Template.instance();

  scanRenderer();
});


Template.scanRenderer.helpers({
  scanRenderer: function () {
    return getState('dlna.scanRenderer');
  }
});

Template.scanRenderer.onRendered(function(){
  instance.$('combobox').combobox();
});

Template.scanRenderer.events({
  'click button': scanRenderer(),
  'change': function(event){
    setState('dlna.rendererSelected', event.target.value);
  }
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