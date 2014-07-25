/*global describe, it, before, beforeEach*/
/*jshint expr: true*/
'use strict';

var expect = require('chai').expect;
var connect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');
var Room = require('../../app/models/room.js');
var Renter = require('../../app/models/renter.js');
var Apartment;

describe ('Apartment', function(){
  before(function(done){
    connect('property-manager-test', function(){
      Apartment = require('../../app/models/apartment.js');
      done();
    });
  });
  beforeEach(function(done){
    global.mongodb.collection('apartments').remove(function(){
      done();
    });
  });

  describe('#save', function(){
    it('should save an apartment to the mongo database', function(done){
      var a1 = new Apartment('A1');
      a1.save(function(){
        expect(a1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.find', function(){
    it('should find an apartment in the mongo database', function(done){
      var a1 = new Apartment('A1');
      a1.save(function(){
        Apartment.find({}, function(apartments){
          expect(apartments).to.have.length(1);
          done();
        });
      });
    });
  });
  
  describe('.findById', function(){
    it('should find an apartment in the mongo database using the Object ID', function(done){
      var a1 = new Apartment('A1');
      a1.save(function(){
        Apartment.findById(a1._id, function(apt){
          expect(apt).to.be.ok;
          done();
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a new apartment', function(){
      var a1 = new Apartment('A1');

      expect(a1).to.be.an.instanceof(Apartment);
      expect(a1.unit).to.equal('A1');
      expect(a1.rooms).to.have.length(0);
      expect(a1.renters).to.have.length(0);
    });
  });
  describe('#area', function(){
    it('should calculate the area of the apartment', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '10', '8');
      var r2 = new Room('bathroom', '6', '9') ; 
      var r3 = new Room('kitchen', '11', '12');
      var r4 = new Room('bedroom', '10', '10');
      
      a1.rooms.push(r1, r2, r3, r4);

      expect(a1.area()).to.equal(366);
      expect(a1.rooms).to.have.length(4);
    });
  });
  describe('#cost', function(){
    it('should calculate the cost of the apartment', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '10', '8');
      var r2 = new Room('bathroom', '6', '9') ; 
      var r3 = new Room('kitchen', '11', '12');
      var r4 = new Room('bedroom', '10', '10');
      
      a1.rooms.push( r1, r2, r3, r4);
      
      expect(a1.cost()).to.equal(1830);
    });
  });
  describe('#bedrooms', function(){
    it('should count the number of bedrooms', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '10', '8');
      var r2 = new Room('bathroom', '6', '9') ; 
      var r3 = new Room('kitchen', '11', '12');
      var r4 = new Room('bedroom', '10', '10');
      
      a1.rooms.push( r1, r2, r3, r4);

      expect(a1.bedrooms()).to.equal(2);
    });
  });
  describe('#isAvailable', function(){
    it('should identify available rooms', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '10', '8');
      var r2 = new Room('bathroom', '6', '9') ; 
      var r3 = new Room('kitchen', '11', '12');
      var r4 = new Room('bedroom', '10', '10');
      var liza = new Renter('liza', '25', 'female', 'coder');

      a1.rooms.push( r1, r2, r3, r4);
      a1.renters.push(liza);

      expect(a1.isAvailable()).to.be.true;
      expect(a1.renters).to.have.length(1);
    });
  });
  describe('#purgeEvicted', function(){
    it('should evict tenants who cannot pay their rent', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '10', '8');
      var r2 = new Room('bathroom', '6', '9') ; 
      var r3 = new Room('kitchen', '11', '12');
      var r4 = new Room('bedroom', '10', '10');
      var liza = new Renter('liza', '25', 'female', 'coder');
      var franklin = new Renter('franklin', '21', 'male', 'waiter');

      a1.rooms.push( r1, r2, r3, r4);
      a1.renters.push(liza, franklin);

      liza.payRent(8000);       
      a1.purgeEvicted();

      expect(a1.renters).to.have.length(1);
      expect(a1.isAvailable()).to.be.true;
    });
  });
  describe('#collectRent', function(){
    it('should collect rent from renters', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '10', '8');
      var r2 = new Room('bathroom', '6', '9') ; 
      var r3 = new Room('kitchen', '11', '12');
      var r4 = new Room('bedroom', '10', '10');
      var liza = new Renter('liza', '25', 'female', 'coder');
      var franklin = new Renter('franklin', '21', 'male', 'waiter');
      liza._cash = 2000;
      franklin._cash = 500;

      a1.rooms.push( r1, r2, r3, r4);
      a1.renters.push(liza, franklin);

      var rent = a1.collectRent();
      expect(rent).to.equal(915);
      console.log('******************');
      console.log(liza, franklin);

      liza.payRent(rent);
      franklin.payRent(rent);
      a1.purgeEvicted();
      expect(a1.renters).to.have.length(1);
      expect(a1.isAvailable()).to.equal.true;
    });
  });
});
