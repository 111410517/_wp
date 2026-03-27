const express = require('express');
const app = express();
const port = 3000;

// 使用 EJS 視圖引擎
app.set('view engine', 'ejs');
// 設定表單解析中間件
app.use(express.urlencoded({ extended: true }));

// 記憶體中儲存筆記的陣列
const notes = [
  { id: 1, title: '第一篇筆記', content: '這是我的第一篇筆記，用來測試基礎 Express 筆記系統。', createdAt: new Date().toLocaleDateString() },
  { id: 2, title: '購物清單', content: '買牛奶、麵包、雞蛋，還有貓罐頭。', createdAt: new Date().toLocaleDateString() }
];

// 路由：顯示所有筆記
app.get('/', (req, res) => {
  res.render('index', { notes });
});

// 路由：新增筆記頁面
app.get('/new', (req, res) => {
  res.render('new');
});

// 路由：處置新增筆記表單提交
app.post('/new', (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    const newNote = {
      id: notes.length + 1,
      title,
      content,
      createdAt: new Date().toLocaleDateString()
    };
    notes.push(newNote);
  }
  res.redirect('/');
});

// 路由：刪除特定筆記
app.get('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex(note => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`筆記系統基本版已啟動於 http://localhost:${port}`);
});
