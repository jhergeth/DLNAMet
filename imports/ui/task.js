/**
 * Created by joachim on 12.04.2016.
 */
import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.html';

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
});