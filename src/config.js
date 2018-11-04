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

const cleanup = [];
process.on("exit", function(code, signal) {
  if (code || signal === "SIGINT") {
    for (let c of cleanup) {
      c();
    }
  }
});

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
function showAlias(name, config) {
  const args = getAlias(name, config);
  if (args) {
    console.log(`${name} = ${args.join(" ")}`);
  }
}
function registerAlias(name, args) {
  const blacklist = ["alias"];
  if (blacklist.includes(name)) {
    throw new Error(`Alias name should not be one of ` + blacklist);
  }
  const config = getConfig();
  config.aliases[name] = args;
  // console.log(name, args);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = {
  listAlias,
  showAlias,
  registerAlias,
  getAlias
};
