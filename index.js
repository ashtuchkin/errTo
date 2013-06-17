var slice = Array.prototype.slice;

module.exports = function(errorHandler, successHandler) {
    var called = false;
    function errTo(err) {
        if (called) return; // Ignore all calls after the first one.
        called = true;

        if (err) {
            if (errorHandler && !errorHandler._errToCalled) {
                errorHandler._errToCalled = true;                     // Prevent calling error handler several times.
                errorHandler.apply(this, slice.call(arguments, 0));
            }
        } else {
            if (successHandler) {
                successHandler.apply(this, slice.call(arguments, 1)); // Give all arguments except err.
            }
        }
    };
    errTo.errorHandler = errorHandler;
    errTo.successHandler = successHandler;
    return errTo;
};