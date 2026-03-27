const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'my-notes-publisher-secret-key',
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

// 路由：首頁，支援關鍵字搜尋
app.get('/', (req, res) => {
  const user = req.session.username;
  const { query } = req.query; // 搜尋關鍵字
  
  let filteredNotes = notes;
  if (query) {
    filteredNotes = notes.filter(n => 
      n.title.toLowerCase().includes(query.toLowerCase()) || 
      n.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  // 分流公開與私人筆記
  const publicNotes = filteredNotes.filter(n => n.isPublic);
  const privateNotes = user ? filteredNotes.filter(n => !n.isPublic && n.owner === user) : [];

  res.render('index', { username: user, publicNotes, privateNotes, query: query || '' });
});

// 路由：匯出個人的全部筆記為 JSON 檔案下載
app.get('/export', requireLogin, (req, res) => {
  const user = req.session.username;
  // 找出屬於這個使用者的所有筆記
  const userNotes = notes.filter(n => n.owner === user);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=notes_backup_${user}.json`);
  res.send(JSON.stringify(userNotes, null, 2));
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
  console.log(`筆記發布與匯出版已啟動於 http://localhost:${port}`);
});
