var htmlToText = require('html-to-text');
var fs = require('fs');

var keysBase = [], counter = 0, outDir = 'fetched'; 

module.exports = {
    keysBase: keysBase,
    counter: counter,
    outDir: outDir,
    
    handleItem: function (item, state) {
        var keys = JSON.parse(JSON.stringify(state.keys));
        keys.push(item.name)

        if (item.type == 'folder') {
            var childState = {keys: keys};

            for (var i in item.children) {
                var child = item.children[i];
                this.handleItem(child, childState);
            }
        } else {
            this.keysBase.push({keys: keys, url: item.url, id: item.id});
        }
    },

    fetchCallback: function (error, result) {
        counter++;

        console.log('Counter is ' + counter + ' of ' + keysBase.length);

        if (error)
            console.log(error);
        else {
            var item = result.options.contextItem;
            console.log('Item id: ' + item.id + ' and url: ' + item.url);
            var body = htmlToText.fromString(result.body);

            fs.writeFile(outDir + '/' + item.id, body);
        }
    }

}