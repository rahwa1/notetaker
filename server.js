const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express();

const PORT = process.env.PORT || 3001;

let createNote = [];
let id = uuidv4();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'));

app.get("/api/notes", function (err, res) {
  try {
    createNote = fs.readFileSync("db/db.json", "utf8");
    console.log("Hello from the SERVER!");
    createNote = JSON.parse(createNote);
  } catch (err) {
    console.log("\n error (catch err app.get):");
    console.log(err);
  }
  res.json(createNote);
});

app.post("/api/notes", function (req, res) {
  try {
    createNote = fs.readFileSync("./db/db.json", "utf8");
    console.log(createNote);
    createNote = JSON.parse(createNote);
    req.body.id = createNote.length;
    createNote.push(req.body);
    createNote = JSON.stringify(createNote);
    fs.writeFile("./db/db.json", createNote, "utf8", function (err) {
      if (err) throw err;
    });

    res.json(JSON.parse(createNote));
  } catch (err) {
    throw err;
    console.error(err);
  }
});

app.delete("/api/notes/:id", function (req, res) {
  try {
    createNote = fs.readFileSync("./db/db.json", "utf8");
    createNote = JSON.parse(createNote);
    createNote = createNote.filter(function (note) {
      return note.id != req.params.id;
    });
    createNote = JSON.stringify(createNote);

    fs.writeFile("./db/db.json", createNote, "utf8", function (err) {
      if (err) throw err;
    });

    res.send(JSON.parse(createNote));
  } catch (err) {
    throw err;
    console.log(err);
  }
});

// go to notes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// go back to main
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(__dirname, "db/db.json"));
});

// Start the server on the port
app.listen(PORT, function () {
    console.log( `Example app listening at http://localhost:${PORT}` );
});