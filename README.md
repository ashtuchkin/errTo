errTo - simple error handling helper for Node.js/CoffeeScript
=====

There are lots of times in Node.js when you need to check for 'err' parameter returned from async function. 
This small module helps dealing with this by calling error handler automatically.

Sample Usage
-----

```coffeescript
# Old style. You need to remember to check error after every async call.
readDirectoryAsync = (catalog, callback) ->
    fs.readdir catalog, (err, filenames) ->
        if err? then return callback(err)
        callback null, filenames

errTo = require 'errto'

# Same function, with the errTo helper.
readDirectoryAsync = (catalog, callback) ->
    fs.readdir catalog, errTo callback, (filenames) -> # Notice no 'err' argument.
        # This code is called ONLY on successful fs.readdir.
        callback null, filenames

# Express sample.
app.get '/', (req, res, next) ->
    readDirectoryAsync __dirname, errTo next, (filenames) ->
        res.send filenames
```

How it works
-----

(See index.js, its 15 LOC)

errTo function takes 2 arguments: errorHandler and successHandler. It returns a function which, when called,
will check its first argument (err) and call first or second function correspondingly. errorHandler is called with 'err' 
argument. successHandler is called with all but the 'err' argument.

License: MIT
