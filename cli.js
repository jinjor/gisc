const argv = require("argv");
const gitscaf = require("./index.js");

argv.info("Usage: gitscaf user/project src target [options]");
argv.option([
  {
    name: "server",
    type: "string",
    description: "Use custom server (default: github.com)"
  },
  {
    name: "protocol",
    type: "string",
    description: "Use one of [ https, git ] (default: https)"
  },
  {
    name: "branch",
    short: "b",
    type: "string",
    description: "Fetch a particular branch (default: master)"
  },
  {
    name: "force",
    short: "f",
    type: "boolean",
    description: "Override existing target (default: false)"
  }
]);
const { targets, options } = argv.run();
if (targets.length !== 3) {
  argv.help();
  process.exit(1);
}
try {
  gitscaf(...targets, options);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
