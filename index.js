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

    console.log('connected');
    player.play('./samples/connected.mp3');

    ddpclient.subscribe('pub_config');

    var observer = ddpclient.observe('pub_config');

    observer.changed = function(_id, oldFields, clearedFields, newFields) {
        console.log('something changed');
        console.log(newFields);
        if (newFields._id === "gameWinner") {
            player.play('./samples/cookie.mp3');
        }
    };
});

