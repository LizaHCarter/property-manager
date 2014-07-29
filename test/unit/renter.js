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
      expect(melanie._cash).to.be.within(100, 5000);
      expect(melanie._isEvicted).to.be.false;
      expect(melanie.profession).to.equal('movie star');
    });
  });

  describe('#work', function(){
   it('should add cash to renter', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'coder');
      melanie.cash = 0;
      melanie.work();

      expect(melanie._cash).to.be.within(1000, 7000);
      expect(melanie._cash).to.be.a('number');
    });
  });

  describe('#payRent', function(){
    it('should charge tenant rent', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
      melanie._cash = 2000;
      melanie.payRent(1500);

      expect(melanie._cash).to.be.equal(500);
      expect(melanie._isEvicted).to.be.false;
    });
    it('should evict tenant - not enough money', function(){
      var liza = new Renter('Liza', '25', 'female', 'waiter');
      liza._cash = 1000;
      liza.payRent(5000);

      expect(liza._cash).to.equal(1000);
      expect(liza._isEvicted).to.be.true;
    });
  });

  describe('#party', function(){
    it('should cause no disturbance - not evicted', function(){
      var melanie;

      while(true){
        melanie = new Renter('melanie', '29', 'female', 'movie star');
        melanie.party();

        if(!melanie.isEvicted){
          break;
        }
      }

    });
    
    it('should pArTy - evict tenant', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
      while(melanie._isEvicted === false){
        melanie.party();
      }
      expect(melanie._isEvicted).to.be.true;
    });
  });
});
