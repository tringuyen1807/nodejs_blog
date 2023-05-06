const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken')


router.post('/login', async function(req, res) {
  const { email, password } = req.body;

  // Kiểm tra xem tên đăng nhập và mật khẩu có hợp lệ hay không
  if (!email || !password) {
    req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ')
    res.redirect('/login')
  }

  try {
    // Tìm kiếm tài khoản với tên đăng nhập
    const user = await User.findOne({ email: email });

    // Nếu tài khoản không tồn tại, trả về lỗi
    if (!user) {
      req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ')
      res.redirect('/login')    
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ')
      res.redirect('/login')
    }

    // Tạo token JWT và gửi về phía client
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token);
    res.render("index")
  } catch (err) {
    console.error(err);
    req.flash('error', 'Lỗi Server')
    res.redirect('/login')
  }
});

router.get('/login', (req, res) => {
  res.render("login", { message: req.flash('error') })
})

module.exports = router