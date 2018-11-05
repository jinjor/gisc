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

module.exports = function get(userAndProject, src, target, options, dry) {
  options = options || {};
  const tmpDir = "/tmp/gisc";
  const server = options.server || "github.com";
  const protocol = options.protocol || "https";
  const branch = options.branch || "master";
  const force = options.force || false;

  const templatePath = src && path.join(tmpDir, src);
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
  target && cleanup.push(() => fs.removeSync(target));

  fs.removeSync(tmpDir);
  if (userAndProject.startsWith("/") || userAndProject.startsWith(".")) {
    // debug mode
    const projectPath = path.resolve(userAndProject);
    fs.copySync(projectPath, tmpDir);
  } else {
    cleanup.push(() => fs.removeSync(tmpDir));
    cp.execSync(`git clone ${gitUrl} ${tmpDir} -b ${branch} --depth 1 --quiet`);

    if (templatePath) {
      const gitPath = path.join(templatePath, ".git");
      fs.existsSync(gitPath) && fs.removeSync(gitPath);
    }
  }
  if (dry) {
    if (templatePath && !fs.existsSync(templatePath)) {
      throw new Error("Template does not exist: " + templatePath);
    }
  } else {
    fs.removeSync(target);
    fs.copySync(templatePath, target);
  }

  fs.removeSync(tmpDir);
};
