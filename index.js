var slice = Array.prototype.slice;

module.exports = function(errorHandler, successHandler) {
    return function(err) {
        if (err) {
            if (errorHandler) {
                errorHandler.apply(this, slice.call(arguments, 0));
            }
        } else {
            if (successHandler) {
                successHandler.apply(this, slice.call(arguments, 1)); // Give all arguments except err.
            }
        }
    };
};