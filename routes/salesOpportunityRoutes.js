const express = require('express');
const {
  createSalesOpportunity,
  getSalesOpportunities,
  getSalesOpportunityById,
  updateSalesOpportunity,
  deleteSalesOpportunity,
} = require('../controllers/salesOpportunityController');

const router = express.Router();

// Route to create a new sales opportunity
router.post('/', createSalesOpportunity);

// Route to get all sales opportunities
router.get('/', getSalesOpportunities);

// Route to get a sales opportunity by ID
router.get('/:id', getSalesOpportunityById);

// Route to update a sales opportunity
router.put('/:id', updateSalesOpportunity);

// Route to delete a sales opportunity
router.delete('/:id', deleteSalesOpportunity);

module.exports = router;