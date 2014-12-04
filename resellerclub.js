var querystring = require("querystring");
var https = require('https');

var ResellerClub = function(userId, key, test) {
  this.userId = userId;
  this.key = key;
  this.test = (test)?true:false;
  //var self = this;
  this.domains = new Domains(this);
}

Domains = function(parent){
  this.parent = parent;
}

ResellerClub.prototype._request = function(method, path, data, callback, args) {
  if (data) {
    contentLength = data.length;
  } else {
    contentLength = 0;
  }
  var options = {
    host: ((this.test)?'test.':'')+'httpapi.com',
    path: path,
    method: method,
    headers: {
      'User-Agent': 'Mozilla/4.0 (Node.js ResellerClub client)',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': contentLength
    }
  };
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var buffer = '';
    res.on('data', function(data) {
      buffer += data;
    });
    res.on('end', function() {
      try {
        var json = JSON.parse(buffer);
      } catch (err) {
        return callback(err);
      }
      if (json.error) {
        callback(json.error);
      } else {
        callback(null, json);
      }
    });
  });
  req.on('error', function(err) {
    callback(err);
  });
  req.setTimeout(60000, function() {
    req.abort();
  });
  req.end(data);
}

ResellerClub.prototype._get = function(apiClass, method, callback, args) {
  var path = '/api/' + apiClass + '/' + method + '.json';
  args['auth-userid'] = this.userId;
  args['api-key'] = this.key;
  path += '?' + querystring.stringify(args);
  this._request('get', path, undefined, callback, args);
}

ResellerClub.prototype._post = function(apiClass, method, callback, args) {
  var path = '/api/' + apiClass + '/' + method + '.json';
  args['auth-userid'] = this.userId;
  args['api-key'] = this.key;
  var data = querystring.stringify(args);
  console.log(data);
  this._request('post', path, data, callback, args);
}

// 
// Domains API
// 

Domains.prototype.available = function(args, callback) {
  this.parent._get('domains', 'available', callback, args);
}

Domains.prototype.register = function(args, callback) {
  if (args['contacts']){
    var carr = ['reg-contact-id','admin-contact-id','tech-contact-id','billing-contact-id'];
    for(f in carr){
      args[carr[f]] = args['contacts'];
    }
    delete args['contacts'];
  }
  this.parent._post('domains', 'register', callback, args);
}

module.exports = ResellerClub;
