## errTo - simple error handling helper for Node.js/CoffeeScript/IcedCoffeeScript

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

## Sample Usage (IcedCoffeeScript)

```coffeescript
# Almost the same as in CoffeeScript
errTo = require 'errto'

app.get '/', (req, res, next) ->
    await db.getUserById req.userId, errTo next, defer user  # Notice, errTo is outside defer.
    res.render 'index', {user}

app.get '/posts/:postId', (req, res, next) ->
    noErr = errTo.bind(null, next) # errTo can be bound in the beginning, using standard JS construct.
    await db.getPostById req.param('postId'), noErr defer post
    
    await
        # Notice these 2 requests will be run in parallel and if at least one of them fails (returns error)
        # then the whole block fails. But if both fail, then only the first error is kept.
        db.getPostComments post._id, errTo next, defer comments
        db.getPostText post._id, errTo next, defer text

    render 'post', {comments, text}
```

## How it works

(See index.js, its only 19 LOC)

errTo function takes 2 arguments: errorHandler and successHandler. It returns a function which, when called,
will check if its first argument (err) is truthy and call first or second function correspondingly. 
errorHandler is called with 'err' argument. successHandler is called with all but the 'err' argument.

Note, either errorHandler or successHandler will be called, and only once. All subsequent calls will be ignored.
Also, a errorHandler will not be called more than once, even if wrapped by different calls to errTo. This is needed
to provide protection when multiple commands are executing at the same time.

**License: MIT**
