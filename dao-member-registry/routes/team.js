const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// GET alle Team-Mitglieder
router.get('/', async (req, res) => {
  const team = await TeamMember.find();
  res.json(team);
});

// POST neues Team-Mitglied
router.post('/', async (req, res) => {
  const { accountId, description } = req.body;
  if (!accountId) return res.status(400).json({ error: 'AccountId erforderlich' });
  try {
    const member = new TeamMember({ accountId, description });
    await member.save();
    res.status(201).json(member);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE Team-Mitglied
router.delete('/:accountId', async (req, res) => {
  await TeamMember.deleteOne({ accountId: req.params.accountId });
  res.json({ success: true });
});

// PUT Beschreibung ändern
router.put('/:accountId', async (req, res) => {
  const { description } = req.body;
  const member = await TeamMember.findOneAndUpdate(
    { accountId: req.params.accountId },
    { description },
    { new: true }
  );
  res.json(member);
});

module.exports = router; 