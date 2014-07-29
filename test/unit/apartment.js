/*global describe, it, before, beforeEach*/
/*jshint expr: true*/

'use strict';

var expect = require('chai').expect;
var Apartment = require('../../app/models/apartment.js');
var Room = require('../../app/models/room.js');
var Renter = require('../../app/models/renter.js');
var connection = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var a1, a2;

describe ('Apartment', function(){
  before(function(done){
    connection('property-manager-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Apartment.collection.remove(function(){
      a1 = new Apartment('A1');
      var b1 = new Room('bed', 10, 20);
      var b2 = new Room('bed', 25, 25);
      var b3 = new Room('bed', 30, 15);
      var k1 = new Room('Kitchen', 5, 10);
      var l1 = new Room('Living', 45, 30);
      var bob = new Renter('Bob', 22, 'male', 'waiter');
      var amy = new Renter('Amy', 25, 'female', 'movie star');
      a1.rooms.push(b1, b2, b3, l1, k1);
      a1.renters.push(bob, amy);

      a2 = new Apartment('A2');
      var b4 = new Room('Bed', 30, 25);
      var b5 = new Room('Bed', 15, 45);
      var k2 = new Room('Kitchen', 25, 15);
      a2.rooms.push(b4, b5, k2);

      a1.save(function(){
        a2.save(function(){
          debugger;
          done();
        });
      });
    });
});

  describe('constructor', function(){
    it('should create a new apartment object', function(){
      var a2 = new Apartment('A2');

      expect(a2).to.be.an.instanceof(Apartment);
      expect(a2.unit).to.equal('A2');
      expect(a2.rooms).to.have.length(0);
      expect(a2.renters).to.have.length(0);
    });
  });

  describe('#area', function(){
    it('should compute the area of the apartment', function(){
      expect(a1.area()).to.equal(2675);
    });
  });

  describe('#cost', function(){
    it('should compute the cost of the apartment', function(){
      expect(a1.cost()).to.equal(13375);
    });
  });

  describe('#bedrooms', function(){
    it('should count the number of bedrooms in apartment', function(){
      expect(a1.bedrooms()).to.equal(3);
    });
  });

  describe('#isAvailable', function(){
    it('should identify available rooms', function(){
      expect(a1.isAvailable()).to.be.true;
    });
  });

  describe('#purge', function(){
    it('should evict tenants who cannot pay their rent', function(){
      var gil = new Renter('Gil', 23, 'female', 'coder');
      gil._isEvicted = true;
      a1.renters.push(gil);

      expect(a1.renters).to.have.length(3);
      a1.purge();
      expect(a1.renters).to.have.length(2);
    });
  });

  describe('#collectRent', function(){
    it('should collect rent from renters', function(){
      a1.renters[0]._cash = 10000;
      a1.renters[1]._cash = 7000;
      var collected = a1.collectRent();
      expect(collected).to.be.closeTo(13375, 1);

      a1.renters[0]._cash = 10000;
      a1.renters[1]._cash = 300;
      collected = a1.collectRent();
      expect(a1.renters[0]._isEvicted).to.be.false;
      expect(a1.renters[1]._isEvicted).to.be.true;
    });
  });

   describe('#save', function(){
    it('should insert an apartment to the mongo database', function(){
        expect(a1._id).to.be.instanceof(Mongo.ObjectID);
      });
    it('should update an existing apartment from the database', function(done){
      a1.unit = 'A1*';
      a1.save(function(){
        Apartment.findById(a1._id, function(err, apt){
          expect(apt.unit).to.equal('A1*');
          done();
        });
      });
    });
  });

  describe('.find', function(){
    it('should find an apartment in the mongo database', function(done){
      Apartment.find({unit:'A1'}, function(err, apts){
          expect(apts).to.have.length(1);
          done();
        });
      });
    });
  });
  
  describe('.findById', function(){
    it('should find an apartment using the Object ID', function(done){
      Apartment.findById(a1._id, function(err,apt){
          expect(apt.unit).to.equal('A1');
          expect(apt).to.respondTo('area');
          expect(apt.rooms[0]).to.respondTo('area');
          expect(apt.renters[0]).to.respondTo('work');
          done();
        });
      });
  });

  describe('.deleteById', function(){
    it('should find an apartment in the mongo database and delete it', function(done){
      Apartment.deleteById(a1._id, function(){
        Apartment.find({}, function(err, apts){
           expect(apts).to.have.length(1);
           done();
        });
      });
    });
  });
  
  describe('.area', function(){
    it('should find total area of complex', function(done){
     Apartment.area(function(area){
      expect(area).to.equal(4475);
      done();
     }); 
    });
  });

  describe('.cost', function(){
    it('should find cost of apartment complex', function(done){
      Apartment.cost(function(cost){
        expect(cost).to.equal(22375);
        done();
      });
    });
  });
  
  describe('.revenue', function(){
    it('should find revenue of apartment complex', function(done){
      Apartment.revenue(function(revenue){
        expect(revenue).to.equal(13375);
        done();
      });
    });
  });

  describe('.tenants', function(){
    it('should find all tenants in the apartment complex', function(done){
      Apartment.tenants(function(tenants){
        expect(tenants).to.equal(2);
        done();
      });
    });
  });
