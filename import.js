var bookmarks = require('./sample/Bookmarks');
var Crawler = require("crawler");
var fs = require('fs');
var funcs = require('./common');

require('events').EventEmitter.prototype._maxListeners = 100;

var outDir = 'fetched';
var counter = 0, pushed = 0, k = 0;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.setMaxListeners(0);

var initState = {
    keys: []
}

var keysBase = funcs.keysBase;

var crawler = new Crawler({
    maxConnections: 10,
    maxRedirects: 10,
    forceUTF8: true,
    followRedirect: true,
 });


funcs.handleItem(bookmarks.roots.bookmark_bar, initState);

for(k in keysBase){
    var item = keysBase[k], fname = outDir + '/' + item.id;
    
    if( !fs.existsSync(fname) ){
        crawler.queue({
            uri: item.url
            , jQuery: true
            , contextItem: item

            , callback: funcs.fetchCallback
        });
    }else{
        console.log('Item already dowloaded, id=' + item.id);
    }
}

