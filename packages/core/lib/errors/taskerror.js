var TruffleError = require("@dune-network/error");
var inherits = require("util").inherits;

inherits(TaskError, TruffleError);

function TaskError(message) {
  TaskError.super_.call(this, message);
}

module.exports = TaskError;
