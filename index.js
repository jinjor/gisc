const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const argv = require("argv");
const rimraf = require("rimraf");

const cleanup = [];
process.on("exit", function(code, signal) {
  if (code || signal === "SIGINT") {
    for (let c of cleanup) {
      c();
    }
  }
});

argv.info("Usage: gitscaf my_project user/project template_path [options]");
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
  }
]);
const { targets, options } = argv.run();
const [destDir, userAndProject, templateRelativePath] = targets;
if (!templateRelativePath) {
  argv.help();
  process.exit(1);
}
const tmpDir = "/tmp/gitscaf";
const templatePath = path.join(tmpDir, templateRelativePath);
if (!path.relative(tmpDir, templatePath)) {
  console.error("WARN: Using the top level directory is not recommended.");
}
const server = options.server || "github.com";
const protocol = options.protocol || "https";
const branch = options.branch || "master";

const gitUrl =
  protocol === "git"
    ? `git@${server}:${userAndProject}.git`
    : protocol === "https"
      ? `https://${server}/${userAndProject}.git`
      : (console.error(`Unsupported protocol: ${protocol}`), process.exit(1));

if (destDir !== ".") {
  if (fs.existsSync(`${destDir}`)) {
    console.error(`Directory "${destDir}" already exists.`);
    process.exit(1);
  }
  cleanup.push(() => rimraf.sync(`${destDir}`));
}

rimraf.sync(`${tmpDir}`);
if (userAndProject.startsWith("/") || userAndProject.startsWith(".")) {
  // debug mode
  const projectPath = path.resolve(userAndProject);
  cp.execSync(`cp -r ${projectPath} ${tmpDir}`);
} else {
  cleanup.push(() => rimraf.sync(`${tmpDir}`));
  cp.execSync(`git clone ${gitUrl} ${tmpDir} -b ${branch} --depth 1 --quiet`);
}
cp.execSync(`cp -r ${templatePath} ${destDir}`);
rimraf.sync(`${tmpDir}`);

if (fs.existsSync(`${destDir}/init`)) {
  cp.execSync(`cd ${destDir} && ${process.env.SHELL} init`);
  fs.unlinkSync(`${destDir}/init`);
}
