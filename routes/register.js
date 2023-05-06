const express = require('express')
const bcrypt = require('bcrypt')
const saltRounds = 10
const User = require('../models/User')
const router = express.Router()


const bodyparser = require("body-parser");
router.use(bodyparser.urlencoded({ extended: false }));
router.use(bodyparser.json());

// Đăng ký tài khoản mới
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem email đã được sử dụng chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    // Tạo password hash bằng bcrypt
    const hash = await bcrypt.hash(password, saltRounds);

    // Lưu thông tin người dùng vào MongoDB
    const user = new User({
      email,
      password: hash
    });
    const savedUser = await user.save();

    res.status(201).json({
      message: 'User has been registered successfully',
      userId: savedUser._id
    });
  } catch (error) {
    console.log('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

router.get('/register', (req, res) => {
    res.render("register")
})

module.exports = router;
