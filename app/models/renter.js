'use strict';

function Renter(name, age, gender, profession){
  this.name = name;
  this.age = parseInt(age);
  this.gender = gender;
  this.profession = profession;

  this._isEvicted = false;
  this._cash = Math.floor(Math.random() * 4901) + 100;
}

Renter.prototype.work = function(){
  if(this.profession === 'movie star'){
    this._cash = this._cash += (Math.floor(Math.random() * 7001)+ 3000);
  }else if(this.profession === 'coder'){
    this._cash = this._cash += (Math.floor(Math.random() * 6001)+ 1000);
  }else if(this.profession === 'waiter'){
    this._cash = this._cash += (Math.floor(Math.random() * 201)+ 50);
  }else{
    this._cash = this._cash += (Math.floor(Math.random() * 601)+ 150);
  }
};

Renter.prototype.payRent = function(amount){
  this._cash -= amount;
  if(this._cash < 0){
    this._isEvicted = true;
  }
};

Renter.prototype.party = function(){
  var party = Math.floor(Math.random()*10)+1;
  if(party < 8){
    this._isEvicted = false;
  }else{
    this._isEvicted = true;
  }
  console.log(party);
};

module.exports = Renter;
