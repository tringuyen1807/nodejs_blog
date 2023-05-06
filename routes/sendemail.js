const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const MailStorage = require('../models/MailStorage')

router.get('/sendemail', (req, res) => {
  if (req.session && req.session.user){
    res.render("sendemail")// hiển thị form gửi email
  }else{
    res.redirect('/login')
}
});

router.post('/send', async (req, res) => {
  // Lấy dữ liệu từ form
  const { to, subject, content } = req.body;

  // Tạo transporter để send mail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Tạo mail options
  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    html: content,
  };

  try {
    // Send mail
    await transporter.sendMail(mailOptions);

    // Lưu mail vào database
    const newMail = new MailStorage({
      to: to,
      subject: subject,
      content: content,
      createdAt: new Date(),
    });
    await newMail.save();

    // Chuyển hướng về trang inbox
    res.redirect('/inbox');
  } catch (err) {
    console.log(err);
    res.render('error', { message: 'Failed to send email' });
  }
});


module.exports = router;
