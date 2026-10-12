const dns = require('dns');
const { Resolver } = require('dns');

// Bypass local router / ISP DNS blocking for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

try {
  if (dns.promises && dns.promises.setServers) {
    dns.promises.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  }
} catch (e) {}

const customResolver = new Resolver();
try {
  customResolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const origLookup = dns.lookup;
dns.lookup = (hostname, options, cb) => {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  if (hostname && (hostname.includes('mongodb.net') || hostname.includes('mongodb'))) {
    customResolver.resolve4(hostname, (err, addrs) => {
      if (err || !addrs || !addrs.length) {
        return origLookup(hostname, options, cb);
      }
      if (options && options.all) {
        return cb(null, addrs.map(a => ({ address: a, family: 4 })));
      }
      return cb(null, addrs[0], 4);
    });
  } else {
    origLookup(hostname, options, cb);
  }
};

module.exports = true;
