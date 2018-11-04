const cp = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const config = require("./config.js");

module.exports = function alias(name, args) {
  if (!name) {
    config.listAlias();
    return;
  }
  if (!args.length) {
    const args = config.getAlias(name);
    console.log(args.join(" "));
    return;
  }
  config.registerAlias(name, args);
};
