#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const moment = require("moment");
const chokidar = require("chokidar");
const chalk = require("chalk");

const extensions = [".png", ".jpg", ".gif", ".svg"];
const rootDir = process.cwd();

console.log(`
	now watching ${chalk.green(rootDir)}.
	Press <ctrl>-c to stop.
`);

function getNewFilename(filename, date) {
  return path.format({
    dir: path.dirname(filename),
    ext: path.extname(filename),
    name: `render-${moment(date).format("YYYY-MM-DD_HH-mm-ss")}`
  });
}

const watcher = chokidar.watch(rootDir, {
  ignored: /(^|[\/\\])\../,
  ignoreInitial: true,
  persistent: true,
  alwaysStat: true
});

watcher.on("add", (filename, stats) => {
  const basename = path.basename(filename);
  if (!extensions.includes(path.extname(filename))) {
    console.log(chalk.gray(`file ignored: ${basename}`));
    return;
  }

  if (path.basename(filename).match(/^render-\d{4}-\d{2}-\d{2}/)) {
    console.log(chalk.gray(`file ignored: ${basename}`));
    return;
  }

  const newFilename = getNewFilename(filename, stats.birthtime);
  console.log(
    `new file: ${chalk.blue(basename)}` +
      ` --> ${chalk.blueBright(path.basename(newFilename))}`
  );
  fs.renameSync(filename, newFilename);
});
