"use strict";

var tto = require('../index.js');
var should = require('should');
var _ = require('lodash');

var getRandomStuff = function() {
    var abc = "abcdefghijklmnopqrstuvwxyz";
    var num = "1234567890";
    if (Math.round(Math.random()) === 1) {
        return abc.substr(0, _.random(abc.length-1));
    } else {
        return parseInt(num.substr(0, _.random(num.length-1)));
    }
}

describe('terminal-table-output.js', function() {

    describe('Public functions and interface', function() {

        it('factory should return correct object', function() {
            var _tto = tto.create();
            _tto.should.have.ownProperty('print');
            _tto.should.have.ownProperty('row');
            _tto.should.have.ownProperty('col');
        });

        it('factory should return a new object', function() {
            var _tto1 = tto.create(),
                _tto2 = tto.create();

            _tto1.should.not.equal(_tto2);
        });

    });

    describe('Insertion and verification of input', function() {

        var _tto = tto.create();

        it('pushrow should a a full row', function() {

            var _i = _.times(5, function(val) {
                return getRandomStuff();
            });
            _tto.pushrow(_i);

            (_tto.output[0]).should.equal(_i);

            var _j = _.times(5, function(val) {
                return getRandomStuff();
            });

            _tto.pushrow(_j);

            (_tto.output[1]).should.equal(_j);

        });

        it('col should add a column to last row', function() {
            _tto.col("test");
            var tto_o = _tto.output[1];
            (_.last(tto_o)).should.equal("test");
        });

        it('row should add a row', function() {
            _tto.row()
                .col("foobar");

            (_.last(_tto.output)[0]).should.be.exactly("foobar");
        });

        it('reset should clear the data', function() {
            _tto.reset();

            (_tto.output.length).should.be.exactly(0);
        });

    });

    describe('Same width columns for printing', function() {

        var _tto = tto.create();

        _.times(15, function(val) {
             _tto.pushrow(_.times(_.random(1, 6), function() {
                 return getRandomStuff();
             }));
        });

        it('verify that test data is correct', function() {
            (_tto.output.length).should.be.exactly(15);
            (_.first(_tto.output).length).should.be.within(1, 6);
        });

        _tto.print();

        it('should make everything a string', function() {
            _.forEach(_tto.output_print, function(row) {
               _.forEach(row, function(item) {
                   item.should.be.a.String();
               });
            });
        });

        it('should output a nice table', function() {
            _tto.print(true);
        });

        it('should return a string', function() {
            _tto.print().should.be.a.String();
        });

    });

});
