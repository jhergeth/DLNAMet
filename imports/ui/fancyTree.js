/**
 * Created by joachim on 13.04.2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import {setState, getState } from './body.js';


import './fancyTree.html';

Template.fancyTree.onCreated(function bodyOnCreated() {
  const instance = Template.instance();
  // Get the Fancytree instance
  var ft = $("#tree").fancytree("getTree");
  setState("fancyTree", ft);
});

Template.fancyTree.getBase = function() {
  const instance = Template.instance();
  var dfd = new $.Deferred();

  Meteor.call('dlna.scanServers', function (err, res) {
    // The method call sets the Session variable to the callback value
    if (err) {
      setState('dlna.Error', {error: err});
    } else {
      var srvs = res.content;
      var srvCnt = srvs.length;
      var tre = [];
      for (var i = 0; i < srvCnt; i++) {
        tre.push({ title: srvs[i].name, key: srvs[i].id+"|0", folder: true, lazy: true });
      }
      dfd.resolve(tre);
    }
  });

  return dfd.promise();
}

Template.fancyTree.getNode = function(event, data){
  const instance = Template.instance();
  var parent = data.node.key;
  var parts = parent.split("|");
  var srv = parts[0];
  var key = "";
  if( parts.length > 1){
    key = parts[1];
  }
  else{
    key = "0";
  }

  var dfd = new $.Deferred();

  Meteor.call('dlna.getDirs', srv, key, function (err, res) {
    // The method call sets the Session variable to the callback value
    if (err) {
      setState('dlna.Error', {error: err});
    } else {
      var dirs = res.dirs;
      var itms = res.items;
      var dirCnt = dirs.length;
      var tre = [];
      for (var i = 0; i < dirCnt; i++) {
        if(dirs[i] != null)
          tre.push({ title: dirs[i].title, key: srv+"|"+dirs[i].id+"|"+dirs[i].uri, icon: dirs[i].tmb, folder: true, lazy: true });
      }
      var itmCnt = itms.length;
      for (i = 0; i < itmCnt; i++) {
        if(itms[i] != null)
          tre.push({ title: itms[i].title, key: srv+"|"+itms[i].id+"|"+itms[i].uri, icon: itms[i].tmb, folder: false, lazy: false });
      }

      dfd.resolve(tre);
    }
  });

  return dfd.promise();
}

Template.fancyTree.setState = function(node){
  var parts = node.key.split("|");

  var d = {
    title: node.title,
    key: node.key,
    icon: node.icon,
    pic: !node.isFolder(),
    srv: parts[0],
    id: parts[1],
    uri: parts[2],
  }

  setState('dlna.selectedNode', d);
}

Template.fancyTree.onRendered(function(){
  this.$('#tree').fancytree({
    source: Template.fancyTree.getBase(),

    lazyLoad: function(event, data) {
      data.result = Template.fancyTree.getNode(event, data);
    },

    click: function(event, data){
      Template.fancyTree.setState(data.node);
      return true;
    },

    dblclick: function (event, data) {
      var node = data.node;
      Template.fancyTree.setState(data.node);
      if(node.isFolder() ){
        var scr = getState('dlna.rendererSelected')
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
          Meteor.call('dlna.play', scr, srv, key, 20000, function (err, res) {
            setState('dlna.doPlay', 'play '+key+' from '+srv+' to '+scr);
          });
        }
        return false;
      }
      return true;
    },

    focus: function(event, data){
      data.node.scrollIntoView(true);
    },

    extensions: ["glyph"],
    glyph: {
      map: {
        checkbox: "glyphicon glyphicon-unchecked",
        checkboxSelected: "glyphicon glyphicon-check",
        checkboxUnknown: "glyphicon glyphicon-share",
        dragHelper: "glyphicon glyphicon-play",
        dropMarker: "glyphicon glyphicon-arrow-right",
        error: "glyphicon glyphicon-warning-sign",
        expanderClosed: "glyphicon glyphicon-plus-sign",
        expanderLazy: "glyphicon glyphicon-plus-sign",
        expanderOpen: "glyphicon glyphicon-minus-sign",
        // Default node icons.
        // (Use tree.options.icon callback to define custom icons based on node data)
        doc: "glyphicon glyphicon-file",
        docOpen: "glyphicon glyphicon-file",
        folder: "glyphicon glyphicon-folder-close",
        folderOpen: "glyphicon glyphicon-folder-open",
        loading: "glyphicon glyphicon-refresh glyphicon-spin"
      }
    },
    activeVisible: true, // Make sure, active nodes are visible (expanded).
    aria: false, // Enable WAI-ARIA support.
    autoActivate: true, // Automatically activate a node when it is focused (using keys).
    autoCollapse: true, // Automatically collapse all siblings, when a node is expanded.
    autoScroll: true, // Automatically scroll nodes into visible area.
    clickFolderMode: 4, // 1:activate, 2:expand, 3:activate and expand, 4:activate (dblclick expands)
    checkbox: false, // Show checkboxes.
    debugLevel: 2, // 0:quiet, 1:normal, 2:debug
    disabled: false, // Disable control
    focusOnSelect: false, // Set focus when node is checked by a mouse click
    generateIds: false, // Generate id attributes like <span id='fancytree-id-KEY'>
    idPrefix: "ft_", // Used to generate node id�s like <span id='fancytree-id-<key>'>.
    icon: true, // Display node icons.
    keyboard: true, // Support keyboard navigation.
    keyPathSeparator: "/", // Used by node.getKeyPath() and tree.loadKeyPath().
    minExpandLevel: 1, // 1: root node is not collapsible
    quicksearch: false, // Navigate to next node by typing the first letters.
    selectMode: 2, // 1:single, 2:multi, 3:multi-hier
    tabindex: 0, // Whole tree behaves as one single control
    titlesTabbable: false, // Node titles can receive keyboard focus
  });
});


Template.fancyTree.events({
});

