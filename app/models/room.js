'use strict';

function Room(name, width, length){
  this.name = name;
  this.width = parseInt(width);
  this.length = parseInt(length);
}

Room.prototype.area = function(){
  return this.length * this.width;
};

Room.prototype.cost = function(){
  return this.area() * 5;
};

Room.prototype.isBedroom = function(){
  return this.name === 'bed';
};

module.exports = Room;
