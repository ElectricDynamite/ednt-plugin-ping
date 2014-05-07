
exports.NAME = "ednt-plugin-ping";
exports.FRIENDLY_NAME = "ping";
exports.VERSION = "0.0.1";
exports.MOUNTPOINT = "ping";
exports.SU_REQUIRED = true;

exports.ROUTES = {
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


var ping = require('net-ping');


exports.init = function(options) {
  this.session = ping.createSession();
  this.session.on('error', function(e) {
    console.log('session error');
    console.dir(e);
  });
  return true;
}

exports.newRequest = function(req, res, callback) {
  target = req.query['target'];
  if(target === undefined || target === '') callback(null,'This would return the partial view \
to query the params, I guess');
  this.session.pingHost (target, function (error, target, sent, rcvd) {
    var ms = rcvd - sent;
    if (error)
        result = target + ": " + error.toString ();
    else
        result = target + ": Alive (ms=" + ms + ")";
    callback(null, result);
  });
}

exports.cancelRequest = function(requestId) {
  
}

exports.getView = function(viewName) {
  viewName = viewName || "default";
}


