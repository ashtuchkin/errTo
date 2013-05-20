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
    "When the callback is called several times": {
        "either error or success handler is called only once": function() {
            var errors = [], successes = [];
            var errCb = function(err) {errors.push(err)};
            var succCb = function(data) {successes.push(data)};

            var cb1 = errTo(errCb, succCb);
            cb1(new Error("First Error"));
            cb1(new Error("Second Error"));
            cb1(null, "Success");

            assert.strictEqual(successes.length, 0);
            assert.strictEqual(errors.length, 1);
            assert.strictEqual(errors[0].message, "First Error");

            errors = [];
            var cb2 = errTo(errCb, succCb);
            cb2(null, "Success");
            cb2(null, "Success 2");
            cb2(new Error("First Error"));
            cb2(new Error("Second Error"));

            assert.strictEqual(successes.length, 1);
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(successes[0], "Success");
        },
        "and error handler cannot be called several times": function() {
            var errors = [];
            var errCb = function(err) {errors.push(err)};

            var cb1 = errTo(errCb, function(data) { assert.fail(); });
            var cb2 = errTo(errCb, function(data) { assert.fail(); });

            cb1(new Error("First Error"));  // Try to call errCb several times.
            cb2(new Error("Second Error"));

            assert.strictEqual(errors.length, 1);
            assert.strictEqual(errors[0].message, "First Error"); // Only the first error should be raised.
        }
    },
};

vows.describe("Basic tests").addBatch(testsBatch).export(module);

