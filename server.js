// Importando as dependências
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

// Inicializando o app e o banco
const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./biblioteca.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite!");
  }
});

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    ano INTEGER
  )
`);

// Rota para listar todos os livros
app.get("/livros", (req, res) => {
  db.all("SELECT * FROM livros", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// Rota para adicionar novo livro
app.post("/livros", (req, res) => {
  const { titulo, autor, ano } = req.body;
  if (!titulo || !autor) {
    return res.status(400).json({ erro: "Título e autor são obrigatórios!" });
  }
  db.run(
    "INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?)",
    [titulo, autor, ano],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.status(201).json({ id: this.lastID, titulo, autor, ano });
    }
  );
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
