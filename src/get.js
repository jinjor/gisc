const cp = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const cleanup = [];
process.on("exit", function(code, signal) {
  if (code || signal === "SIGINT") {
    for (let c of cleanup) {
      c();
    }
  }
});

module.exports = function get(userAndProject, src, target, options) {
  if (!target) {
    throw new Error("Invalid command");
  }
  options = options || {};
  const tmpDir = "/tmp/gisc";
  const server = options.server || "github.com";
  const protocol = options.protocol || "https";
  const branch = options.branch || "master";
  const force = options.force || false;

  const templatePath = path.join(tmpDir, src);
  const gitUrl =
    protocol === "git"
      ? `git@${server}:${userAndProject}.git`
      : protocol === "https"
        ? `https://${server}/${userAndProject}.git`
        : (() => {
            throw new Error(`Unsupported protocol: ${protocol}`);
          })();
  if (!force && fs.existsSync(target)) {
    throw new Error(`Target "${target}" already exists`);
  }
  cleanup.push(() => fs.removeSync(target));

  fs.removeSync(tmpDir);
  if (userAndProject.startsWith("/") || userAndProject.startsWith(".")) {
    // debug mode
    const projectPath = path.resolve(userAndProject);
    fs.copySync(projectPath, tmpDir);
  } else {
    cleanup.push(() => fs.removeSync(tmpDir));
    cp.execSync(`git clone ${gitUrl} ${tmpDir} -b ${branch} --depth 1 --quiet`);
    fs.removeSync(path.join(templatePath, ".git"));
  }
  fs.copySync(templatePath, target);
  fs.removeSync(tmpDir);
};
