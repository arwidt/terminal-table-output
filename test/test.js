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

        it('after line it should be possible to use col directly', function() {
            var _tt = tto.create();
            _tt.col('foo')
                .col('bar')
                .line();

            _tt.col('bar')
                .col('foo')
                .row();
        });

        it('if running col as the first call, it should create the first row array', function() {
            _tto.col("FIRST");
            (_.first(_tto.output)[0]).should.equal('FIRST');
        });

        it('pushrow should add a full row', function() {

            var _i = _.times(5, function(val) {
                return getRandomStuff();
            });
            _tto.pushrow(_i);

            (_.last(_tto.output)).should.equal(_i);

            var _j = _.times(5, function(val) {
                return getRandomStuff();
            });

            _tto.pushrow(_j);

            (_.last(_tto.output)).should.equal(_j);

        });

        it('col should add a column to last row', function() {
            _tto.col("test");
            var tto_o = _.last(_tto.output);
            (_.last(tto_o)).should.equal("test");
        });

        it('row should add a row', function() {
            _tto.row()
                .col("foobar");

            (_.last(_tto.output)[0]).should.be.exactly("foobar");
        });

        it('line should add the string line instead of a array', function() {
            _tto.line();
            (_.last(_tto.output)).should.be.exactly('{{line}}');
        });

        it('line should take a string, this string will be used as that current line gfx', function() {
            _tto.line("<->");
            (_.last(_tto.output)).should.be.exactly('{{line}}<->');
        });

        it('reset should clear the data', function() {
            _tto.reset();

            (_tto.output.length).should.be.exactly(0);
        });

    });

    describe('Same width columns for printing', function() {

        var _tto = tto.create();
        _tto.col("TESTDATA")
            .line()
            .line("<line>")
            .line("/");

        _.times(15, function(val) {
             _tto.pushrow(_.times(_.random(1, 6), function() {
                 return getRandomStuff();
             }));
        });

        it('verify that test data is correct', function() {
            (_tto.output.length).should.be.exactly(19);
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
