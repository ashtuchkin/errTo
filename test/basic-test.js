var vows = require('vows'),
    assert = require('assert'),
    errTo = require(__dirname+'/../'),
    fs = require('fs');

var testsBatch = {
    "When async function returns successfully": {
        topic: function() {
            var that = this;
            var errHandler = function(err) {
                that.callback('error', err);
            };

            fs.stat(__filename, errTo(errHandler, function(stats) {
                that.callback('success', stats);
            }));
        },
        "main handler must be called without the err argument": function(result, stats) {
            assert.strictEqual('success', result);
            assert.isNotNull(stats);
            assert.isTrue(stats.isFile());
        },
    },
    "When async function takes several arguments": {
        topic: function() {
            var that = this;
            var errHandler = function(err) {
                that.callback('error', err);
            };

            var asyncFunction = function(callback) {
                callback(null, "arg1", "arg2", "arg3");
            };

            asyncFunction(errTo(errHandler, function(arg1, arg2, arg3) {
                that.callback('success', arg1, arg2, arg3);
            }));
        },
        "main handler must be called with all given arguments": function(result, arg1, arg2, arg3) {
            assert.strictEqual('success', result);
            assert.strictEqual('arg1', arg1);
            assert.strictEqual('arg2', arg2);
            assert.strictEqual('arg3', arg3);
        },
    },
    "When async function fails": {
        topic: function() {
            var that = this;
            var errHandler = function(err) {
                that.callback('error', err);
            };

            fs.stat(__filename+"!!", errTo(errHandler, function(stats) {
                that.callback('success', stats);
            }));
        },
        "error handler must be called only with the err argument": function(result, err) {
            assert.strictEqual('error', result);
            assert.isNotNull(err);
            assert.instanceOf(err, Error);
        },
    },
};

vows.describe("Basic tests").addBatch(testsBatch).export(module);

