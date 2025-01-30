const SalesOpportunity = require('../models/sales');
const mongoose = require('mongoose');

// @desc    Get all sales opportunities
// @route   GET /api/sales-opportunities
// @access  Private (User must be authenticated)
const getSalesOpportunities = async (req, res) => {
  try {
    const salesOpportunities = await SalesOpportunity.find({ user: req.user.id }); // Filter sales opportunities by user
    res.status(200).json(salesOpportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single sales opportunity by ID
// @route   GET /api/sales-opportunities/:id
// @access  Private (User must be authenticated)
const getSalesOpportunityById = async (req, res) => {
  try {
    const salesOpportunity = await SalesOpportunity.findOne({ _id: req.params.id, user: req.user.id }); // Ensure sales opportunity belongs to user
  
    if (!salesOpportunity) {
      return res.status(404).json({ message: 'Sales Opportunity not found or you do not have permission to view it' });
    }
  
    res.status(200).json(salesOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a sales opportunity
// @route   POST /api/sales-opportunities
// @access  Private (User must be authenticated)
const createSalesOpportunity = async (req, res) => {
  const { title, description, stage, value, createdBy, priority, expectedCloseDate } = req.body;

  try {
    const newSalesOpportunity = new SalesOpportunity({
      title,
      description,
      stage,
      value,
      createdBy,
      priority,
      expectedCloseDate,
      user: req.user.id, // Associate the sales opportunity with the user
    });

    await newSalesOpportunity.save();
    res.status(201).json(newSalesOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a sales opportunity
// @route   PUT /api/sales-opportunities/:id
// @access  Private (User must be authenticated)
const updateSalesOpportunity = async (req, res) => {
  try {
    const salesOpportunity = await SalesOpportunity.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure the sales opportunity belongs to the user
      req.body,
      { new: true }
    );

    if (!salesOpportunity) {
      return res.status(404).json({ message: 'Sales Opportunity not found or you do not have permission to update it' });
    }

    res.status(200).json(salesOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a sales opportunity
// @route   DELETE /api/sales-opportunities/:id
// @access  Private (User must be authenticated)
const deleteSalesOpportunity = async (req, res) => {
  try {
    const salesOpportunity = await SalesOpportunity.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Ensure the sales opportunity belongs to the user

    if (!salesOpportunity) {
      return res.status(404).json({ message: 'Sales Opportunity not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Sales Opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Sales Analytics
// @route   GET /api/sales-analytics
// @access  Private (User must be authenticated)
const getSalesAnalytics = async (req) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // Ensure ObjectId

    const analytics = await SalesOpportunity.aggregate([
      { $match: { user: userId } }, // Filter by user

      {
        $facet: {
          salesByStage: [
            {
              $group: {
                _id: "$stage",
                count: { $sum: 1 },
              },
            },
          ],

          salesByPriority: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
              },
            },
          ],

          salesDistributionByUser: [
            {
              $group: {
                _id: "$user",
                count: { $sum: 1 },
              },
            },
          ],

          totalSalesValue: [
            {
              $group: {
                _id: null,
                totalValue: { $sum: "$value" },
              },
            },
            {
              $project: {
                _id: 0,
                totalSalesValue: "$totalValue",
              },
            },
          ],
        },
      },
    ]);

    console.log("Raw Sales Analytics:", JSON.stringify(analytics, null, 2));

    const result = analytics[0];

    return {
      salesByStage: result.salesByStage ?? [],
      salesByPriority: result.salesByPriority ?? [],
      salesDistributionByUser: result.salesDistributionByUser ?? [],
      totalSalesValue: result.totalSalesValue?.[0]?.totalSalesValue ?? 0,
    };
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw new Error("Error fetching sales analytics");
  }
};


// Export Controller Functions
module.exports = {
  getSalesOpportunities,
  getSalesOpportunityById,
  createSalesOpportunity,
  updateSalesOpportunity,
  deleteSalesOpportunity,
  getSalesAnalytics,
};
