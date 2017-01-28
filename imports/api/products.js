import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Products = new Mongo.Collection('products');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('products', function productsPublication() {
    return Products.find();
  });
}

Meteor.methods({
  'products.insert'(num,name,sitio) {
    check(num, Number);
    check(name, String);
    check(sitio, String);

    // Make sure the user is logged in before inserting a product
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    //num, name, sitio,

    Products.insert({
      num,
      name,
      sitio,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'products.remove'(productId) {
    check(productId, String);

    Products.remove(productId);
  },
  'products.setChecked'(productId, setChecked) {
    check(productId, String);
    check(setChecked, Boolean);

    Products.update(productId, { $set: { checked: setChecked } });
  },
  'products.subtractProduct'(productId){
    check(productId, String);
    Products.update(productId, { $inc: { num : -1} });
  },
  'products.addProduct'(productId){
    check(productId, String);
    Products.update(productId, { $inc: { num : 1} });
  },
});
