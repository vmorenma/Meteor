import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Products } from '../api/products.js';

import './product.js';
import './body.html';


 Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('products');
});

Template.body.helpers({
  products() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')){
      if(instance.state.get('showsuper')){
        return Products.find({ $and: [{checked: { $ne: true }, sitio:{$eq: "Supermercado" }}]}, { sort: { checked: 1 , createdAt: -1} });
      }
      else if(instance.state.get('showfrozen')){
        return Products.find({ $and: [{checked: { $ne: true }, sitio:{$eq: "Congelado" }}]}, { sort: { checked: 1 , createdAt: -1} });
      }
      else if(instance.state.get('showgreengrocer')){
        return Products.find({ $and: [{checked: { $ne: true }, sitio:{$eq: "Fruteria" }}]}, { sort: { checked: 1 , createdAt: -1} });
      }
      else if(instance.state.get('showall')){
        return Products.find({ checked: { $ne: true }}, { sort: { checked: 1 , createdAt: -1} });
      }
      else{
        return Products.find({ checked: { $ne: true }}, { sort: { checked: 1 , createdAt: -1} });
      }
    }else{
      if(instance.state.get('showsuper')){
        return Products.find({ sitio:{$eq: "Supermercado" }}, { sort: { checked: 1 , createdAt: -1} });

      };
      if(instance.state.get('showfrozen')){
        return Products.find({ sitio:{$eq: "Congelado" }}, { sort: { checked: 1 , createdAt: -1} });
      };
      if(instance.state.get('showgreengrocer')){
        return Products.find({ sitio:{$eq: "Fruteria" }}, { sort: { checked: 1 , createdAt: -1} });
      };
      if(instance.state.get('showall')){
        return Products.find({}, { sort: { checked: 1 , createdAt: -1} });
      };

      return Products.find({}, { sort: { checked: 1 , createdAt: -1} });

    }
  },

  incompleteCount() {
  return Products.find({ checked: { $ne: true }}).count();
  },

  incompleteCountFruteria() {
  return Products.find({ $and : [{checked: { $ne: true }},{sitio:{$eq: "Fruteria" }} ]}).count();
  },

  incompleteCountSuper() {
  return Products.find({ $and : [{checked: { $ne: true }},{sitio:{$eq: "Supermercado" }} ]}).count();
  },

  incompleteCountCongelado() {
  return Products.find({ $and : [{checked: { $ne: true }},{sitio:{$eq: "Congelado" }} ]}).count();
  }
});

  Template.body.events({
    'submit .new-product'(event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;
      const num = parseInt(target.num.value);
      const name = target.productname.value;
      const sitio = target.sitio.value;

      // Insert a task into the collection
      Meteor.call('products.insert',num,name,sitio);

      // Clear form
      target.productname.value = '';

  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
  'change .show-all input'(event, instance) {
    instance.state.set('showall', event.target.checked);
    instance.state.set('showsuper', false);
    instance.state.set('showfrozen', false);
    instance.state.set('showgreengrocer', false);
  },
  'change .show-super input'(event, instance) {
    instance.state.set('showsuper', event.target.checked);
    instance.state.set('showall', false);
    instance.state.set('showfrozen', false);
    instance.state.set('showgreengrocer', false);
  },
  'change .show-frozen input'(event, instance) {
    instance.state.set('showfrozen', event.target.checked);
    instance.state.set('showsuper', false);
    instance.state.set('showall', false);
    instance.state.set('showgreengrocer', false);
  },
  'change .show-greengrocer input'(event, instance) {
    instance.state.set('showgreengrocer', event.target.checked);
    instance.state.set('showsuper', false);
    instance.state.set('showfrozen', false);
    instance.state.set('showall', false);
  },
});
