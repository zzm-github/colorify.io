const fs = require('fs');
const slice = Array.prototype.slice;

function queueWrite(items, index, callback) {
    var item = items[index];
    if(!item) {
        callback && callback();
        return;
    }
    fs.writeFile(item.path, item.content, function(err) {
        if(err) {
            items.forEach(function(item) {
                if(fs.existsSync(item.path)) {
                    fs.unlinkSync(item.path);
                }
            });
            callback && callback(err);
            return;
        }
        queueWrite(items, index+1, callback);
    });
}

module.exports = function(items, callback) {
    queueWrite(items, 0, callback);
};
