"use-strict";

const PORT = 26855;
const express = require("express");
app = express();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// HINT: curl url --output video.mp4
const tokens = [];
function TokenGen() {
    const output = crypto.randomBytes(16).toString("hex");
    tokens.push(output);
    return output;
}
app.get("/gettoken", (req, res) => {
    const token = TokenGen();
    res.json({ token: token });
});
app.get("/3-3646bb40-6fc4-4cbb-866b-95103af40186.mp4", (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).send("Requests which do not contain a ?token=AValidToken are forbidden. Try to get a token or die trying.");
    }
    if (!tokens.includes(token)) {
        return res.status(401).send("The given token was not valid anymore. Try to copy how the real client gets a valid token.");
    }
    const tokenIndex = tokens.indexOf(token);
    tokens.splice(tokenIndex, 1);
    return next();
});

app.use("/4-ee50c483-9880-43ab-81fe-2a65d7e3dd22.mp4", (req, res, next) => {
    const maxRequestLength = 1024 * 1024;
    if (req.method === "GET") {
        const fileSize = fs.statSync("./public_html/4-ee50c483-9880-43ab-81fe-2a65d7e3dd22.mp4").size;
        const range = req.headers.range;
        if (!range) {
            return res.status(411).send("Requests which ask for more than 128KB are forbidden. Use request range and content length to ask for only part of the file or die trying.");
        }
        const match = range.match(/bytes=(\d+)-(\d+)?/);
        if (match) {
            const start = parseInt(match[1], 10);
            const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
            const rangeSize = end - start + 1;
            if (rangeSize > maxRequestLength) {
                return res.status(416).send("Requests which ask for more than 128KB are forbidden. Use request range and content length to ask for only part of the file or die trying.");
            }
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": rangeSize,
                "Content-Type": "video/mp4",
            });
            const stream = fs.createReadStream("./public_html/4-ee50c483-9880-43ab-81fe-2a65d7e3dd22.mp4", { start, end });
            stream.pipe(res);
        } else {
            return res.status(416).send("Requests which ask for more than 128KB are forbidden. Use request range and content length to ask for only part of the file or die trying.");
        }
    } else {
        return next();
    }
});

app.use("/", express.static("./public_html"));
app.get("/", (req, res) => {
    res.sendFile("./public_html/index.html");
});
app.listen(PORT, () => {
    console.log(`Started server on ${PORT}!`);
});