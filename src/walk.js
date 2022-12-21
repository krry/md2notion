import fs from "fs";
import path from "path";

export function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (err) console.log("Error:", err);
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            if (err) console.log("Error:", err);
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.match(/[md,mdx]$/)) results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}
