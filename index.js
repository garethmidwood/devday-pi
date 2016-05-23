var config = require('config');
var ddp = require('ddp');
var player = require('play-sound')({"players": ["omxplayer", "afplay"]});

console.log(config.server.host + ":" + config.server.port);

var ddpclient = new ddp({ host: config.server.host, port: config.server.port, autoReconnect : true });

ddpclient.connect(function(error) {
    if (error) {
        console.log('ah crap');
        player.play('./samples/connection_lost.mp3');
        process.exit(1);
        return;
    }

    player.play('./samples/connected.mp3');

    ddpclient.subscribe('options');

    var observer = ddpclient.observe('options');

    observer.changed = function(_id, oldFields, clearedFields, newFields) {
        if (newFields.winner === true) {
            var chosenTrack = ddpclient.collections.options[_id];
            console.log('Playing "' + chosenTrack.label + '"');
            player.play('./samples/' + chosenTrack.file);
        }
    };
});

