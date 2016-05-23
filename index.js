var config = require('config');
var ddp = require('ddp');
var play = require('play');

console.log(config.server.host + ":" + config.server.port);

var ddpclient = new ddp({ host: config.server.host, port: config.server.port, autoReconnect : true });

ddpclient.connect(function(error) {
    if (error) {
        console.log('ah crap');
        play.sound('./samples/connection_lost.mp3');
        process.exit(1);
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

