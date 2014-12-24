var bookmarks = require('./sample/Bookmarks');
var htmlToText = require('html-to-text');
var Crawler = require("crawler");
var fs = require('fs');

var outDir = 'fetched';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var initState = {
    keys: []
}

var keysBase = [];

var crawler = new Crawler({
    maxConnections: 10,
    forceUTF8: true
});

var counter = 0;

handleItem(bookmarks.roots.bookmark_bar, initState);

for(var k in keysBase){
    var item = keysBase[k];
    
    crawler.queue({
        uri: item.url
        , jQuery: false
        , contextItem: item

        , callback: fetchCallback
    });
}

function fetchCallback(error, result) {
    counter++;
    console.log('Counter is ' + counter + ' of ' + keysBase.length);
    
    if (error)
        console.log(error);
    else {
        var item = result.options.contextItem;
        var body = htmlToText.fromString(result.body);

        fs.writeFile(outDir + '/' + item.id, body);
    }
}


function handleItem(item, state) {
    var keys = JSON.parse(JSON.stringify(state.keys));
    keys.push(item.name)

    if (item.type == 'folder') {
        var childState = {keys: keys};

        for (var i in item.children) {
            var child = item.children[i];
            handleItem(child, childState);
        }
    } else {
        keysBase.push({keys: keys, url: item.url, id: item.id});
    }
}

function fetchItem(url, callback) {
    var options = {url: url};

    curl.request(options, function (err, parts) {
        parts = parts.split('\r\n');
        var data = parts.pop();

        var text = htmlToText.fromString(data);
        callback(text);
    });
}