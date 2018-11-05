const argv = require("argv");
const get = require("./get.js");
const config = require("./config.js");

argv.info(`Usage:
    gisc get user/project src target [options]
    gisc add alias_name user/project src target [options]
    gisc ls
    gisc remove alias_name
    gisc share
    `);
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
  if (!subCommand) {
    argv.help();
    process.exit(0);
  }
  if (subCommand === "ls") {
    if (args.length > 0) {
      argv.help();
      process.exit(1);
    }
    config.listAlias();
  } else if (subCommand === "add") {
    const [name, ...rest] = args;
    if (args.length <= 1) {
      argv.help();
      process.exit(1);
    }
    // dry run
    [userAndProject, src, target] = rest;
    get(userAndProject, src, target, options, true);

    config.addAlias(name, process.argv.splice(4));
  } else if (subCommand === "remove") {
    if (args.length > 1) {
      argv.help();
      process.exit(1);
    }
    const [name] = args;
    config.removeAlias(name);
  } else if (subCommand === "get") {
    if (args.length !== 3) {
      argv.help();
      process.exit(1);
    }
    [userAndProject, src, target] = args;
    get(userAndProject, src, target, options);
  } else if (subCommand === "share") {
    config.shareAlias(args);
  } else {
    const aliasName = subCommand;
    const partialArgs = config.getAlias(aliasName);
    if (!partialArgs) {
      throw new Error(`No such alias: ${aliasName}`);
    }
    const allArgs = partialArgs.concat(process.argv.splice(3));
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
