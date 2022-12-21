#! /usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { importMarkdownFromDir, importMarkdownFile } from "../src/md2Notion.js";

const usage = "$0 <cmd> [args] \nImports markdown into a Notion database";

yargs(hideBin(process.argv))
  .scriptName("md2notion")
  .usage(usage)
  .command(
    "$0",
    "imports a markdown file or directory of markdown recursively",
    () => {},
    function (argv) {
      importMarkdownFile({ file: argv._[0], category: argv.category });
    }
  )
  .option("c", {
    alias: ["category"],
    default: "note",
    demandOption: false,
    describe: "Category of the note imported",
    type: "string",
  })
  .help(true).argv;
