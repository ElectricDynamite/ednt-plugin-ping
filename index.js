

var ping = require('net-ping');
var events = require('events');
var _ = require('underscore');
var Plugin = function() {};
Plugin.prototype = new events.EventEmitter;

Plugin.prototype.NAME = "ednt-plugin-ping";
Plugin.prototype.FRIENDLY_NAME = "ping";
Plugin.prototype.VERSION = "0.0.1";
Plugin.prototype.MOUNTPOINT = "ping";
Plugin.prototype.SU_REQUIRED = true;

Plugin.prototype.ROUTES = {
  "/": {
    "method": "GET",
    "params": {
      "target": {
        "mandatory": true,
        "type": "String"
      },
      "count": {
        "type": "Integer",
        "default": 5
      },
      "interval": {
        "type": "Integer",
        "default": 1000
      },
      "timeout": {
        "type": "Integer"
      }        
    }
  }
};


Plugin.prototype.init = function(options) {
  this.session = ping.createSession();
  this.session.on('error', function(e) {
    console.log('session error');
    console.dir(e);
  });
  return true;
}

Plugin.prototype.newRequest = function(params) {
  var self = this;
  params['count'] = params['count'] || this.ROUTES['/'].params.count.default;
  params['interval'] = params['interval'] || this.ROUTES['/'].params.interval.default;
  console.log(params['count']); 
  if(params['target'] === undefined || params['target'] === '') {
    self.emit('output', null,'This would return the partial view \
to query the params, I guess');
    self.emit('end');
  }
  var count = params['count'];
  self.emit('output', null, 'test');
  
  self.ping(params, count, function(err) {
    self.emit('end', null);
  });
}

Plugin.prototype.ping = function(params, i, callback) {
  var self = this;
  var delay = (i === params['count']) ? 0 : params['interval'];
  var nextCallback = _.bind(self.ping, this);
  var nextPing = _.bind(self.executePing, this);
  i--;
  if(i < 0) callback();
  else setTimeout(nextPing, delay, params, i, callback, nextCallback);
}

Plugin.prototype.executePing = function(params, i, finalCallback, callback) {
  var self = this;
  this.session.pingHost (params['target'], function (err, target, sent, rcvd) {
    var ms = rcvd - sent;
    if (err)
        result = target + ": " + err.toString ();
     else
        result = target + ": Alive (ms=" + ms + ")";
    //callback(null, result);
    //console.log(result);
    self.emit('output', null, result);
    callback(params, i, finalCallback);
  });
}

Plugin.prototype.cancelRequest = function(requestId) {
  
}

Plugin.getView = function(viewName) {
  viewName = viewName || "default";
}

module.exports = new Plugin();

