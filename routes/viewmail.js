const express = require('express');
const router = express.Router();
const Mail = require('../models/MailStorage');

router.get('/', async (req, res) => {
  const mails = await Mail.find();
  res.render('mail', { mails });
});

router.get('/:id', async (req, res) => {
  const mail = await Mail.findById(req.params.id);
  res.render('maildetail', { mail });
});

module.exports = router;
