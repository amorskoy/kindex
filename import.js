var bookmarks = require('./sample/Bookmarks');
var curl = require('curlrequest');
var htmlToText = require('html-to-text');

var initState = {
    keys: []
}

var keysBase = [];

handleItem(bookmarks.roots.bookmark_bar, initState);

for(var k in keysBase){
    var item = keysBase[k];
    
    fetchItem(item.url, function(text){
        console.log(item.keys);
        console.log(text);
    });
}

function handleItem(item, state) {
    var keys = JSON.parse(JSON.stringify(state.keys));
    keys.push(item.name)
    
    if (item.type == 'folder'){
        var childState = {keys:keys};
        
        for (var i in item.children) {
            var child = item.children[i];
            handleItem(child, childState);
        }
    }else{
        keysBase.push({keys:keys, url: item.url});
    }
}

function fetchItem(url, callback){
    var options = { url: url};
    
    curl.request(options, function (err, parts) {
        parts = parts.split('\r\n');
        var data = parts.pop();

        var text = htmlToText.fromString(data);
        callback(text);
    });
}