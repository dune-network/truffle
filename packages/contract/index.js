require("source-map-support/register");
const Schema = require("@dune-network/contract-schema");
const Contract = require("./lib/contract");
const truffleContractVersion = require("./package.json").version;

const contract = (json = {}, networkType = "ethereum") => {
  json = Object.assign({}, json, { networkType });
  const normalizedArtifactObject = Schema.normalize(json);

  // Note we don't use `new` here at all. This will cause the class to
  // "mutate" instead of instantiate an instance
  return Contract.clone(normalizedArtifactObject);
};

contract.version = truffleContractVersion;

module.exports = contract;

if (typeof window !== "undefined") {
  window.TruffleContract = contract;
}
