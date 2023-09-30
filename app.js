const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const dataFilePath = 'data.json';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Página inicial
app.get('/', (req, res) => {
  const query = req.query.query;
  const data = query ? searchRecords(query) : loadData();
  res.render('index.ejs', { data });
});


// Adicionar um novo registro
app.post('/add', (req, res) => {
  const newData = {
    nome: req.body.nome,
    idade: req.body.idade,
  };

  const data = loadData();
  data.push(newData);
  saveData(data);

  res.redirect('/');
});

// Excluir um registro
app.get('/delete/:index', (req, res) => {
  const index = req.params.index;
  const data = loadData();
  if (index >= 0 && index < data.length) {
    data.splice(index, 1);
    saveData(data);
  }
  res.redirect('/');
});

// Página de edição de registro
app.get('/edit/:index', (req, res) => {
  const index = req.params.index;
  const data = loadData();
  if (index >= 0 && index < data.length) {
    res.render('edit.ejs', { index, record: data[index] });
  } else {
    res.redirect('/');
  }
});

// Atualizar registro
app.post('/update/:index', (req, res) => {
  const index = req.params.index;
  const data = loadData();
  if (index >= 0 && index < data.length) {
    data[index] = {
      nome: req.body.nome,
      idade: req.body.idade,
    };
    saveData(data);
  }
  res.redirect('/');
});

// Rota para pesquisa
app.get('/search', (req, res) => {
  const query = req.query.query.toLowerCase();
  const data = loadData();
  const results = data.filter(record => record.nome.toLowerCase().includes(query));
  res.render('index.ejs', { data: results });
});


// Função para carregar dados do arquivo JSON
function loadData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Função para salvar dados no arquivo JSON
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
