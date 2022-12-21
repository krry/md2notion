import fs from "fs";
import path from "path";
import chalk from "chalk";
import { markdownToBlocks } from "@tryfabric/martian";
import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";
import { walk } from "./walk.js";
import { dashToTitle } from "./utils.js";

dotenv.config();

const apiToken = process.env.NOTION_KEY;
const notion = new Client({ auth: apiToken });
const databaseId = process.env.NOTION_DATABASE_ID;
const failedImports = [];

async function retrieveDatabaseProperties(dbId) {
  const response = await notion.databases.retrieve({
    database_id: dbId,
  });
  console.log(
    chalk.blue("[Notion]"),
    "db props",
    response.properties.Category.select.options
  );
}

async function addItemToNotion(text, category, blocks) {
  try {
    console.log(chalk.blue("[Notion]"), "Importing", text);
    const response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
        Category: {
          select: {
            name: category,
          },
        },
      },
      children: JSON.parse(blocks) ?? [],
    });
    console.log(
      chalk.blue("[Notion]"),
      chalk.green("Success! Added", response.id)
    );
  } catch (error) {
    failedImports.push(text);
    console.error(chalk.blue("[Notion]"), chalk.red("Error:", error.body));
  }
}

export function removeFrontMatter({ content, title }) {
  if (
    content[0].type === "heading_2" &&
    content[0].heading_2.rich_text[0].text.content.includes("title: ")
  ) {
    content.shift();
  }
  if (
    content[0].type === "heading_1" &&
    content[0].heading_1.rich_text[0].text.content === title
  ) {
    content.shift();
  }
  return content;
}

export async function importMarkdownFile({ file, category }) {
  console.log(chalk.yellow("[Import]"), category, file);

  const stat = fs.statSync(file);

  if (stat && stat.isDirectory()) {
    importMarkdownFromDir({ dir: file, category });
  } else {
    const pathToFile = file;
    const title = dashToTitle(path.basename(file, path.extname(file)));
    const markdown = fs.readFileSync(pathToFile);
    const notionBlocks = removeFrontMatter({
      content: markdownToBlocks(markdown),
      title,
    });
    const content = JSON.stringify(notionBlocks);

    await addItemToNotion(title, category, content);
  }
}

export async function importMarkdownFromDir({ dir, category }) {
  const startTime = new Date();
  const fileDir = path.join(process.cwd(), dir);

  walk(fileDir, async function (err, results) {
    if (err) throw new Error(err);
    for (let file of results) {
      await importMarkdownFile({ file, category });
    }
    if (failedImports.length) {
      console.log("failed to import");
      failedImports.forEach((file) => console.log(file));
    }
    console.log("Completed in", new Date() - startTime + "ms");
  });
}
