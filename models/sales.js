const mongoose = require("mongoose");

const salesOpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stage: {
      type: String,
      enum: [
        "Prospect",
        "Qualified",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    expectedCloseDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Ensures it's a reference to the User model
      required: true,
    },    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ensure tasks are associated with a User model
        required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalesOpportunity", salesOpportunitySchema);
