var Crawler = require("crawler");
var htmlToText = require('html-to-text');

var c = new Crawler({
    maxConnections : 10,
    forceUTF8: true,
    
    // This will be called for each crawled page
    callback : function (error, result, $) {
        console.log(htmlToText.fromString(result.body));
        process.exit();
    }
});


c.queue('http://google.com');