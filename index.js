var config = require('config');
var ddp = require('ddp');
var play = require('play');

//var track = './node_modules/play/wavs/drums/tick.wav';

//var track = './node_modules/play/wavs/sfx/alarm.wav';
//var track = './node_modules/play/wavs/sfx/crinkle.wav';
//var track = './node_modules/play/wavs/sfx/flush.wav';
//var track = './node_modules/play/wavs/sfx/intro.wav';
var track = './node_modules/play/wavs/sfx/ding.wav';
//var track = "/Users/garethmidwood/Desktop/test.mp3";

var ddpclient = new ddp({ host: config.server.host, port: config.server.port, autoReconnect : true });

ddpclient.connect(function(error) {
    if (error) {
        console.log('ah crap');
        return;
    }

    play.sound(track);

    ddpclient.subscribe('options');

    var observer = ddpclient.observe('options');

    observer.changed = function(_id, oldFields, clearedFields, newFields) {
        if (newFields.winner === true) {
            var chosenTrack = ddpclient.collections.options[_id];
            console.log('Playing "' + chosenTrack.label + '"');
            play.sound(track);
        }
    };
});

