var provision = function(abstraction, options) {
  var self = this; // eslint-disable-line no-unused-vars

  if (options.provider) {
    abstraction.setProvider(options.provider);
  }

  if (options.network_id) {
    abstraction.setNetwork(options.network_id);
  }

  if (options.network && options.networks) {
    abstraction.setNetworkType(options.networks[options.network].type);
  }

  if (options.ens) {
    abstraction.ens = options.ens;
  }

  if (abstraction.interfaceAdapter.web3) {
    ["from", "gas", "gasPrice"].forEach(key => {
      if (options[key]) {
        var obj = {};
        obj[key] = options[key];
        abstraction.defaults(obj);
      }
    });
  }

  return abstraction;
};

module.exports = provision;
