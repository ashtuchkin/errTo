# errTo - simple error handling helper for Node.js/CoffeeScript

[![Build Status](https://secure.travis-ci.org/ashtuchkin/errTo.png?branch=master)](http://travis-ci.org/ashtuchkin/errTo)

Often in Node.js you need to check for 'err' parameter returned from async function. 
This small module helps dealing with this by calling error handler automatically.

## Sample Usage (CoffeeScript)

```coffeescript
# What you needed to write without errTo. Remember to check error after each and every async call.
readDirectoryAsync = (catalog, callback) ->
    fs.readdir catalog, (err, filenames) ->
        if err? then return callback(err) # <= This is evil.
        console.log "Success!"
        callback null, filenames

# The unicorns come to the rescue.
errTo = require 'errto'

# Same function as above, with the errTo helper.
readDirectoryAsync = (catalog, callback) ->
    fs.readdir catalog, errTo callback, (filenames) -> # Notice no 'err' argument.
        # Error check is done automatically in errTo and callback(err) is called on error.
        # Subsequent code is called ONLY when no error given.
        console.log "Success!"
        callback null, filenames

# Express sample.
app.get '/', (req, res, next) ->
    readDirectoryAsync __dirname, errTo next, (filenames) -> # Use Express error handling by calling next(err)
        res.send filenames
```

## Sample Usage (JavaScript)

```javascript
// What you needed to write without errTo. Remember to check error after each and every async call.
function readDirectoryAsync(catalog, callback) {
    fs.readdir(catalog, function(err, filenames) {
        if (err) {          // <= This whole block is evil.
            callback(err); 
            return;
        }
        
        callback(null, filenames);
    });
}

// The unicorns come to the rescue.
var errTo = require('errto');

// Same function as above, with the errTo helper.
function readDirectoryAsync(catalog, callback) {
    fs.readdir(catalog, errTo(callback, function(filenames) { // Notice no 'err' argument.
        // Error check is done automatically in errTo and callback(err) is called on error.
        // Subsequent code is called ONLY when no error given.
        console.log("Success!");
        callback(null, filenames);
    }));
}

// Express sample.
app.get('/', function(req, res, next) {
    readDirectoryAsync(__dirname, errTo(next, function(filenames) { // Use Express error handling by calling next(err)
        res.send(filenames);
    }));
});
```

## How it works

(See index.js, its only 15 LOC)

errTo function takes 2 arguments: errorHandler and successHandler. It returns a function which, when called,
will check if its first argument (err) is truthy and call first or second function correspondingly. 
errorHandler is called with 'err' argument. successHandler is called with all but the 'err' argument.

**License: MIT**
