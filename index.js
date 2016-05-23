var config = require('config');
var ddp = require('ddp');
var play = require('play');

var ddpclient = new ddp({ host: config.server.host, port: config.server.port, autoReconnect : true });

ddpclient.connect(function(error) {
    if (error) {
        console.log('ah crap');
        return;
    }

    play.sound('./samples/connected.mp3');

    ddpclient.subscribe('options');

    var observer = ddpclient.observe('options');

    observer.changed = function(_id, oldFields, clearedFields, newFields) {
        if (newFields.winner === true) {
            var chosenTrack = ddpclient.collections.options[_id];
            console.log('Playing "' + chosenTrack.label + '"');
            play.sound('./samples/' + chosenTrack.file);
        }
    };
});

