var assert = require("chai").assert;
var fs = require("fs-extra");
var glob = require("glob");
var Box = require("@dune-network/box");
var Profiler = require("@dune-network/compile-solidity/profiler");
var Resolver = require("@dune-network/resolver");
var Artifactor = require("@dune-network/artifactor");

// TOOD: Move this to @dune-network/compile-solidity!

describe("profiler", function() {
  var config;

  before("Create a sandbox", async () => {
    config = await Box.sandbox("default");
    config.resolver = new Resolver(config);
    config.artifactor = new Artifactor(config.contracts_build_directory);
    config.network = "development";
  });

  after("Cleanup tmp files", function(done) {
    glob("tmp-*", (err, files) => {
      if (err) done(err);
      files.forEach(file => fs.removeSync(file));
      done();
    });
  });

  it("profiles example project successfully", function(done) {
    Profiler.required_sources(
      config.with({
        paths: ["./ConvertLib.sol"],
        base_path: config.contracts_directory
      }),
      function(err, allSources, compilationTargets) {
        if (err) return done(err);

        assert.equal(Object.keys(allSources).length, 3);
        assert.equal(compilationTargets.length, 2);
        done();
      }
    );
  });
}).timeout(10000);
