#! /usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { importMarkdownFromDir, importMarkdownFile } from "../src/md2Notion.js";

const usage = "$0 <cmd> [args] \nImports markdown into a Notion database";

yargs(hideBin(process.argv))
  .scriptName("md2notion")
  .usage(usage)
  .command(
    "rake [dir]",
    "imports all markdown files in top-level of this directory",
    (yargs) => {
      yargs.positional("dir", {
        type: "string",
        default: ".",
        describe: "from whence the markdown files come",
      });
    },
    function (argv) {
      importMarkdownFromDir({ dir: argv.dir, category: argv.category });
    }
  )
  .command(
    "$0",
    "imports a single markdown file",
    () => {},
    function (argv) {
      importMarkdownFile({ file: argv._[0], category: argv.category });
    }
  )
  .option("c", {
    alias: ["cat", "category"],
    default: "note",
    demandOption: false,
    describe: "Category of the note imported",
    type: "string",
  })
  .option("d", {
    alias: ["dir", "directory"],
    default: ".",
    demandOption: false,
    describe: "Directory to import from",
    type: "string",
  })
  .help(true).argv;
