const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'my-notes-privacy-secret-key',
  resave: false,
  saveUninitialized: true
}));

const users = [];
const notes = [
  { id: 1, title: '歡迎筆記 (公開)', content: '這是一篇公開筆記，所有人都可以看見。', owner: 'admin', isPublic: true, createdAt: new Date().toLocaleDateString() },
  { id: 2, title: '機密代辦 (私人)', content: '這是 admin 的私人筆記，只有 admin 能看見。', owner: 'admin', isPublic: false, createdAt: new Date().toLocaleDateString() }
];

function requireLogin(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
}

// 路由：顯示公開筆記，以及如果登入則顯示個人的私人筆記
app.get('/', (req, res) => {
  const user = req.session.username;
  
  // 公開筆記所有人都能看
  const publicNotes = notes.filter(n => n.isPublic);
  // 私人筆記只有登入的擁有者能看
  const privateNotes = user ? notes.filter(n => !n.isPublic && n.owner === user) : [];

  res.render('index', { username: user, publicNotes, privateNotes });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.render('register', { error: '該帳號已被註冊！' });
  }
  users.push({ username, password });
  req.session.username = username;
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.username = username;
    res.redirect('/');
  } else {
    res.render('login', { error: '帳號或密碼錯誤！' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/new', requireLogin, (req, res) => {
  res.render('new');
});

app.post('/new', requireLogin, (req, res) => {
  const { title, content, privacy } = req.body;
  if (title && content) {
    notes.push({
      id: notes.length + 1,
      title,
      content,
      owner: req.session.username,
      isPublic: privacy === 'public',
      createdAt: new Date().toLocaleDateString()
    });
  }
  res.redirect('/');
});

app.get('/delete/:id', requireLogin, (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex(note => note.id === id && note.owner === req.session.username);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`筆記隱私版已啟動於 http://localhost:${port}`);
});
