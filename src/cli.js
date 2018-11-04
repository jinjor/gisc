const argv = require("argv");
const get = require("./get.js");
const alias = require("./alias.js");
const config = require("./config.js");

argv.info(`Usage:
    gisc get user/project src target [options]
    gisc alias alias_name user/project src target [options]`);
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

try {
  const { targets, options } = argv.run();
  const [subCommand, ...args] = targets;
  if (subCommand === "alias") {
    const [name, ...rest] = args;
    if (rest.length > 3) {
      argv.help();
      process.exit(1);
    }
    alias(name, process.argv.splice(4));
  } else if (subCommand === "get") {
    if (args.length !== 3) {
      argv.help();
      process.exit(1);
    }
    get(...args, options);
  } else {
    const aliasName = subCommand;
    const partialArgs = config.getAlias(aliasName);
    if (!partialArgs) {
      throw new Error(`No such alias: ${aliasName}`);
    }
    const allArgs = partialArgs.concat(args);
    const { targets, options } = argv.run(["get", ...allArgs]);
    const [_, ..._args] = targets;
    if (_args.length !== 3) {
      const commandString = `gisc get ${allArgs.join(" ")}`;
      throw new Error("Failed to execute: " + commandString);
    }
    get(..._args, options);
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
