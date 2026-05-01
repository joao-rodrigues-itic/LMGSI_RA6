const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "artists.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

// Creem la taula i ens assegurem que hi hagi dades inicials.
db.serialize(() => {

  //Borrar les taules a principi
  db.run(`
    DROP TABLE IF EXISTS artists_albumes;
    DROP TABLE IF EXISTS albumes_cancons;
    DROP TABLE IF EXISTS artists;
    DROP TABLE IF EXISTS albumes;
    DROP TABLE IF EXISTS canco;
  `);

  //Creació de la taula artistes
  db.run(`
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      nacionalitat TEXT
    )
  `);

  //Creació de la taula albumes
  db.run(`
    CREATE TABLE IF NOT EXISTS albumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      any INTEGER NOT NULL
    )
  `);

    //Creació de la taula canco
  db.run(`
    CREATE TABLE IF NOT EXISTS canco (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duracio TIME
    )
  `);

    //Creació de la taula artists_albumes
  db.run(`
    CREATE TABLE IF NOT EXISTS artists_albumes (
      id_artista INTEGER,
      id_album INTEGER,
      PRIMARY KEY (id_artista, id_album),
      CONSTRAINT FK_ID_ARTISTA FOREIGN KEY (id_artista) REFERENCES artists(id),
      CONSTRAINT FK_ID_ALBUMES FOREIGN KEY (id_album) REFERENCES albumes(id)
    )
  `);

  //Creació de la taula albumes_cancons
  db.run(`
    CREATE TABLE IF NOT EXISTS albumes_cancons (
      id_album INTEGER,
      id_canco INTEGER,
      PRIMARY KEY (id_album, id_canco),
      CONSTRAINT FK_ID_ALBUMES FOREIGN KEY (id_album) REFERENCES albumes(id),
      CONSTRAINT FK_ID_CANCONS FOREIGN KEY (id_canco) REFERENCES canco(id)
    )
  `);

  db.get("SELECT id FROM artists WHERE name = ?", ["Txarango"], (error, row) => {
    if (error) {
      console.log("Error comprovant dades inicials:", error.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO artists (name) VALUES (?)", ["Txarango"]);
    }
  });

  db.get("SELECT id FROM artists WHERE name = ?", ["Oques Grasses"], (error, row) => {
    if (error) {
      console.log("Error comprovant dades inicials:", error.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO artists (name) VALUES (?)", ["Oques Grasses"]);
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Adicionar artistes POST
app.post("/api/AddArtist",  (req, res) => {
  const name = req.body.data;
  //Afegint la informació de nacionalitat per els artistes
  const nacionalitat = req.body.nacionalitat || null;
  db.run("INSERT INTO artists (name, nacionalitat) VALUES (?, ?)", [name, nacionalitat], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Artista desat: ${name}`);
  });
});

// Consultar artistes GET
app.post("/api/artists",  (req, res) => {
  const table = req.body.data;
  db.all(`SELECT * FROM ${table} ORDER BY id`, (err, rows) => {

    if (err){
      return res.status(500).json({ error: err.message });
    }
    console.log(rows);
    res.json({ result: rows });
  });
});

// Deletar artistes DELETE
app.delete("/api/DelArtist",  (req, res) => {
  const name = req.body.data;
  db.run("DELETE FROM artists WHERE (name) = (?)", [name], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Artista eliminat: ${name}`);
  });
});

// Actualitzar artistes UPDATE
app.put("/api/UpdateArtist",  (req, res) => {
  const name = req.body.oldName;
  const newName = req.body.newName;
  const newNacionality = req.body.newNacionalitat || null;

  if (!name || !newName) {
    res.status(400).type("text").send("Cal el nom actual i el nou nom de l'artista.");
    return;
  }

  db.run("UPDATE artists SET name = ?, nacionalitat = ? WHERE name = ?", [newName, newNacionality, name], function(error) {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    //Si no hi ha línies afectades, s'envia un missatge
    if (this.changes === 0) {
      res.status(404).type("text").send(`No s'ha trobat cap artista amb el nom: ${name}`);
      return;
    }
    res.status(200).type("text").send(`Artista actualitzat: ${name} → ${newName}`);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor a http://localhost:${PORT}`);
  console.log(`Base de dades SQLite: ${dbPath}`);
});

//------------------------------------------------------------------------------

// Adicionar album POST
app.post("/api/AddAlbum",  (req, res) => {
  const name = req.body.name;
  const year = req.body.year;
  db.run("INSERT INTO albumes (name, any) VALUES (?, ?)", [name, year], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Album creat: ${name}`);
  });
});

// Consultar artistes GET
app.post("/api/albumes",  (req, res) => {
  const table = req.body.data;
  db.all(`SELECT * FROM ${table} ORDER BY id`, (err, rows) => {

    if (err){
      return res.status(500).json({ error: err.message });
    }
    console.log(rows);
    res.json({ result: rows });
  });
});

// Deletar album DELETE
app.delete("/api/DelAlbum",  (req, res) => {
  const name = req.body.data;
  db.run("DELETE FROM albumes WHERE (name) = (?)", [name], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Album eliminat: ${name}`);
  });
});