const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// 使用 express-session 中間件
app.use(session({
  secret: 'my-notes-auth-secret-key',
  resave: false,
  saveUninitialized: true
}));

// 模擬資料庫
const users = []; // 儲存 { username, password }
const notes = [
  { id: 1, title: '系統初始筆記', content: '歡迎使用筆記系統，這是公共初始筆記。', owner: 'admin', createdAt: new Date().toLocaleDateString() }
];

// 中間件：檢查是否登入
function requireLogin(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
}

// 路由：顯示目前登入使用者的所有筆記
app.get('/', (req, res) => {
  const user = req.session.username;
  // 過濾出屬於目前登入使用者的筆記
  const userNotes = notes.filter(note => note.owner === user);
  res.render('index', { username: user, notes: userNotes });
});

// 路由：註冊頁面
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// 路由：處置註冊表單
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.render('register', { error: '該帳號已被註冊！' });
  }
  users.push({ username, password });
  req.session.username = username; // 註冊成功後直接登入
  res.redirect('/');
});

// 路由：登入頁面
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// 路由：處置登入表單
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

// 路由：登出
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// 路由：新增筆記頁面 (需要登入)
app.get('/new', requireLogin, (req, res) => {
  res.render('new');
});

// 路由：處置新增筆記表單
app.post('/new', requireLogin, (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    notes.push({
      id: notes.length + 1,
      title,
      content,
      owner: req.session.username,
      createdAt: new Date().toLocaleDateString()
    });
  }
  res.redirect('/');
});

// 路由：刪除筆記 (需要登入且必須是擁有者)
app.get('/delete/:id', requireLogin, (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex(note => note.id === id && note.owner === req.session.username);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`筆記驗證版已啟動於 http://localhost:${port}`);
});
