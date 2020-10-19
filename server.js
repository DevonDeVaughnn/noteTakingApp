// Dependencies
const express = require('express');
const fs = require("fs")

// Define path to notes
const dataPath = __dirname + "/db/db.json";

const app = express();
const PORT = process.env.PORT || 8080;

// Gives more options for POST requests
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(express.static('public')) 

app.listen(PORT, function() {
    console.log('Listening on http://localhost:' + PORT);
});


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/notes/", function (req, res) {
    res.sendFile(__dirname + "/public/notes.html");
});

app.get("/api/notes/:id", function (req, res) {
    
    // Get the id that was passed
    let id = req.params.id;
    console.log(id);

    // Read the database
    let notesDB = readDB();

    // Search the databse for an article with that title
    for (let i = 0; i < notesDB.length; i++) {
        // If we get a match, send it off
        if (notesDB[i].title == id) {
            console.log(notesDB[i]);
            return res.json(notesDB[i])
        }
    }

    // If we don't get a match, send an error message
    res.send("Sorry, that note doesn't exist");
});

app.get("/api/notes/", function(req, res) {

    // Get the database
    let notesDB = readDB();

    res.json(notesDB);
})

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// POST

app.post("/api/notes", function (req, res) {

    // Make an object using the data sent
    let newNote = {
        title:req.body.title,
        text:req.body.text
    }

    // Load the database
    let db = readDB();

    // Push to database
    db.push(newNote);

    // Save database
    storeDB(db);

    res.send("POST request received!")
});

// DELETE
app.delete("/api/notes/:id", function (req, res) {
    let target = req.params.id;

    // Load the database
    let db = readDB();

    // Run through the database
    for (i in db) {
        // if note title matches target
        if (db[i].title === target) {
            // splice out of the database
            db.splice(i, 1, "");

            // save the database
            storeDB(db);

            // And exit the function
            return res.send(`Deleted '${target}' from database!`)
        }
    }
})

// If the notes db doesn't exist, we make it
if (!fs.existsSync(dataPath)) {
    let notesDB = [{
        title:"Welcome!",
        text:"Check out the readme for operation information"
    }];

    storeDB(notesDB);
}

// This function stores the database by writing it to db.json
function storeDB(ref) {
    fs.writeFile(dataPath,JSON.stringify(ref),"utf8",err=>{if (err) throw err});
}

// This function reads the database, then returns the information
function readDB() {
    return JSON.parse(fs.readFileSync(dataPath,"utf8",err=>{if (err) throw err}));
}