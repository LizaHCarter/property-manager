'use strict';
var cApartment = global.mongodb.collection('apartments');
//var _ = require('lodash');

function Apartment(unit){
  this.unit = unit;
  this.rooms = [];
  this.renters = [];
}

Apartment.prototype.save = function(cb){
  cApartment.save(this, function(err, obj){
    cb();
  });
};

Apartment.find = function(query, cb){
  cApartment.find(query).toArray(function(err, apartments){
    cb(apartments);
  });
};

Apartment.findById= function(id, cb){
  cApartment.findOne({_id:id}, function(err, apt){
    cb(apt);
  });
};

Apartment.prototype.area = function(){
  var total = 0;
  for(var i = 0; i < this.rooms.length; i++){
    total += (this.rooms[i].length * this.rooms[i].width);
  }
  return total;
};

Apartment.prototype.cost = function(){
  var cost = this.area() * 5;
  return cost;
};

Apartment.prototype.bedrooms = function(){
  var br = 0;
  for(var i =0; i < this.rooms.length; i++){
    if(this.rooms[i].name === 'bedroom'){
      br += 1;
    }
  }
  return br;
};

Apartment.prototype.isAvailable = function(){
  return this.bedrooms() > this.renters.length;
};

Apartment.prototype.purgeEvicted = function(){
  var notEvicted = [];
  for(var i = 0; i < this.renters.length; i++){
    if(this.renters[i]._isEvicted === false){
      notEvicted.push(this.renters[i]);
    }
  }
  this.renters = notEvicted;
};

Apartment.prototype.collectRent = function(){
  var rent = 0;
  rent = this.cost() / this.renters.length;
  return rent;
};


module.exports = Apartment;
