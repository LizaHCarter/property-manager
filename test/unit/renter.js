/*jshint expr:true*/
/*global describe, it */
'use strict';

var expect = require('chai').expect;

var Renter = require('../../app/models/renter.js');

describe('Renter', function(){
  describe('constructor', function(){
    it('should create a renter', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');

      expect(melanie).to.be.instanceof(Renter);
      expect(melanie.name).to.equal('Melanie');
      expect(melanie.age).to.equal(29);
      expect(melanie.gender).to.equal('female');
      expect(melanie.cash).to.be.within(100, 5000);
      expect(melanie.isEvicted).to.be.false;
      expect(melanie.profession).to.equal('movie star');
    });
  });

  describe('#work', function(){
   it('should add cash to renter', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
      melanie.work();

      expect(melanie.cash).to.be.within(3100, 15000);
      expect(melanie.cash).to.be.a('number');
    });
  });

  describe('#payRent', function(){
    it('should charge tenant rent', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
      melanie.work();
      melanie.payRent(1500);

      expect(melanie.cash).to.be.within(1600, 13500);
      expect(melanie.isEvicted).to.be.false;
    });
    it('should evict tenant - not enough money', function(){
      var liza = new Renter('Liza', '25', 'female', 'waiter');
      liza.work();
      liza.payRent(5300);

      expect(liza.cash).to.be.below(0);
      expect(liza.isEvicted).to.be.true;
    });
  });

  describe('#party', function(){
    it('should pArTy - evict tenant', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
      while(melanie.isEvicted === false){
        melanie.party();
      }
      expect(melanie.isEvicted).to.be.true;
    });
  });

});


