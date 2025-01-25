const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    company: {
      type: String,
    },
    notes: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure tasks are associated with a User model
      required: true,
    },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    Timestamp: true, // This will automatically add createdAt and updatedAt fields
  }
);

contactSchema.index({ updatedAt: -1 });
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
