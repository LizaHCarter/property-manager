'use strict';

var Mongo = require('mongodb');

var Room = require('./room');
var Renter = require('./renter');
var _ = require('lodash');

function Apartment(unit){
  this.unit = unit;
  this.rooms = [];
  this.renters = [];
}

Object.defineProperty(Apartment, 'collection', {
  get: function(){
    return global.mongodb.collection('apartments');
  }
});

Apartment.prototype.area = function(){
  var area = 0;

  for(var i = 0; i < this.rooms.length; i++){
    area+= this.rooms[i].area();
  }
  return area;
};

Apartment.prototype.cost = function(){
  var cost = 0;

  for(var i = 0; i < this.rooms.length; i++){
    cost += this.rooms[i].cost();
  }
  return cost;
};

Apartment.prototype.revenue = function(){
  return(this.renters.length) ? this.cost() : 0; /* ? */
};

Apartment.prototype.bedrooms = function(){
  var count = 0;

  for(var i = 0; i < this.rooms.length; i++){
    count += this.rooms[i].isBedroom() ? 1 : 0;
  }
  return count;
};

Apartment.prototype.isAvailable = function(){
  return this.bedrooms() > this.renters.length;
};

Apartment.prototype.purge = function(){
  var renters = [];

  for(var i = 0; i < this.renters.length; i++){
    if (!this.renters[i]._isEvicted){
      renters.push(this.renters[i]);
    }
  }
  this.renters = renters;
};

Apartment.prototype.collectRent = function(){
  if(!this.renters.length){return 0;}

  var rent = this.cost() / this.renters.length;
  var collected = 0;

  for(var i = 0; i < this.renters.length; i++){
    collected += this.renters[i].payRent(rent);
  }
  return collected;
};

Apartment.prototype.save = function(cb){
    Apartment.collection.save(this, cb);
  };

Apartment.find = function(query, cb){
  debugger;
  Apartment.collection.find(query).toArray(function(err, apts){
    debugger;
    for(var i = 0; i < apts.length; i++){
      apts[i] = changePrototype(apts[i]);
    }
    cb(err, apts);
  });
};

Apartment.findById= function(id, cb){
  id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  Apartment.collection.findOne({_id:id}, function(err, apt){
    cb(err, changePrototype(apt));
  });
};

Apartment.deleteById = function(id, cb){
  id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  Apartment.collection.findAndRemove({_id:id}, cb);
};

Apartment.area =  function(cb){
  Apartment.find({}, function(err, apts){
    var sum = 0;

    console.log(apts);

    for(var i=0; i < apts.length; i++){
      sum += apts[i].area();
    }
    cb(sum);
  });
};

Apartment.cost = function(cb){
  Apartment.find({}, function(err, apts){
    var sum = 0;

    for(var i = 0; i < apts.length; i++){
      sum+= apts[i].cost();
    }
    cb(sum);
  });
};

Apartment.revenue = function(cb){
  Apartment.find({}, function(err, apts){
    var sum = 0;

    for(var i = 0; i < apts.length; i++){
      sum += apts[i].revenue();
    }
    cb(sum);
  });
};

Apartment.tenants = function(cb){
  Apartment.find({}, function(err,apts){
    var sum = 0;

    for(var i = 0; i < apts.length; i++){
      sum += apts[i].renters.length;
    }
    cb(sum);
  });
};

module.exports = Apartment;

// PRIVATE FUNCTIONS //

function changePrototype(apt){
  apt = _.create(Apartment.prototype, apt);

  for(var i = 0; i < apt.rooms.length; i++){
    apt.rooms[i] = _.create(Room.prototype, apt.rooms[i]);
  }

  for(var j = 0; j < apt.renters.length; j++){
    apt.renters[j] = _.create(Renter.prototype, apt.renters[j]);
  }
  return apt;
}


