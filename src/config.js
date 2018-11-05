const cp = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const home = path.join(os.homedir(), ".gisc");
const configPath = path.join(home, "config.json");

function getConfig() {
  fs.ensureDirSync(home);
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          aliases: {}
        },
        null,
        2
      )
    );
  }
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}
function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
function listAlias() {
  const config = getConfig();
  for (let name in config.aliases) {
    showAlias(name, config);
  }
}
function getAlias(name, config) {
  config = config || getConfig();
  return config.aliases[name];
}
function removeAlias(name) {
  const config = getConfig();
  delete config.aliases[name];
  saveConfig(config);
}
function showAlias(name, config) {
  const args = getAlias(name, config);
  if (args) {
    console.log(`${name} = ${args.join(" ")}`);
  }
}
function showAliasCommand(name, config) {
  const args = getAlias(name, config);
  if (args) {
    console.log(`gisc add ${name} ${args.join(" ")}`);
  }
}
function shareAlias(names) {
  const config = getConfig();
  names = names.length ? names : Object.keys(config.aliases);
  for (let name of names) {
    showAliasCommand(name, config);
  }
}
function addAlias(name, args) {
  const blacklist = ["add", "ls", "remove", "get", "share"];
  if (blacklist.includes(name)) {
    throw new Error(`Alias name should not be one of ` + blacklist);
  }
  const config = getConfig();
  config.aliases[name] = args;
  saveConfig(config);
}

module.exports = {
  listAlias,
  addAlias,
  removeAlias,
  getAlias,
  shareAlias
};
