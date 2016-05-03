/**
 * Created by joachim on 13.04.2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';


import './scanServers.html';

Template.scanServers.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  const instance = Template.instance();
  scanServers();
});


Template.scanServers.helpers({
  scanServers: function () {
    return instance.state.get('dlna.scanServers');
  }
});

Template.scanServers.onRendered(function(){
  instance.$('combobox').combobox();
});

Template.scanServers.events({
  'click button': function() {
    scanServers();
  },
  'change': function(event){
    instance.state.set('dlna.serverSelected', event.target.value );
  }
});

function scanServers() {
  instance = Template.instance();
  Meteor.call('dlna.scanServers', function (err, res) {
    // The method call sets the Session variable to the callback value
    if (err) {
      instance.state.set('dlna.scanServers', {error: err});
    } else {
      instance.state.set('dlna.scanServers', res);
      return res;
    }
  });
}