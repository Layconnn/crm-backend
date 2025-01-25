const express = require('express');
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');

const router = express.Router();

// Routes for contacts
router.post('/', createContact); // Create contact
router.get('/', getContacts); // Get all contacts
router.get('/:id', getContactById); // Get single contact by ID
router.put('/:id', updateContact); // Update contact
router.delete('/:id', deleteContact); // Delete contact

module.exports = router;