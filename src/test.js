import { removeFrontMatter } from "./md2Notion.js";
const data = [
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [
        {
          type: "text",
          annotations: {
            bold: false,
            strikethrough: false,
            underline: false,
            italic: false,
            code: false,
            color: "default",
          },
          text: {
            content:
              "title: The Pantheon of Hesiod\ncreated: Thu Apr 01 2021 20:27:08 GMT-0700 (Pacific Daylight Time)\nmodified: Thu Apr 01 2021 20:27:08 GMT-0700 (Pacific Daylight Time)\nterms: myths",
          },
        },
      ],
    },
  },
];

console.log("front matter gone", removeFrontMatter(data));
