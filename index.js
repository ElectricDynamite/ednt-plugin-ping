

var ping = require('net-ping');
var events = require('events');
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
        "type": "Integer"
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

Plugin.prototype.newRequest = function(req) {
  var self = this;
  target = req.query['target'];
  count = req.query['count'] || 5;
  if(target === undefined || target === '') callback(null,'This would return the partial view \
to query the params, I guess');
  this.session.pingHost (target, function (error, target, sent, rcvd) {
    var ms = rcvd - sent;
    if (error)
        result = target + ": " + error.toString ();
     else
        result = target + ": Alive (ms=" + ms + ")";
    //callback(null, result);
    self.emit('output', null, result);
    self.emit('end', null);
  });
}

Plugin.prototype.cancelRequest = function(requestId) {
  
}

Plugin.getView = function(viewName) {
  viewName = viewName || "default";
}

module.exports = new Plugin();

