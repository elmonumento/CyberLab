"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/style.css", ["style.css", "text/css; charset=utf-8"]],
  ["/script.js", ["script.js", "text/javascript; charset=utf-8"]],
  ["/cyberlab-logo.png", ["cyberlab-logo.png", "image/png"]],
  ["/cyberlab-favicon-v2.svg", ["cyberlab-favicon-v2.svg", "image/svg+xml"]],
]);
const port = Number(process.env.PORT || 4173);

http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  const pathname = new URL(request.url, `http://${request.headers.host || "localhost"}`).pathname;
  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  fs.readFile(path.join(__dirname, file[0]), (error, contents) => {
    if (error) {
      console.error(`Could not read ${file[0]}:`, error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Could not load CyberLab.");
      return;
    }

    response.writeHead(200, {
      "Content-Type": file[1],
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'",
    });
    response.end(request.method === "HEAD" ? undefined : contents);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`CyberLab is ready at http://localhost:${port}`);
});
