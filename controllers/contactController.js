const Contact = require('../models/contacts');
const mongoose = require("mongoose");

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private (User must be authenticated)
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, notes } = req.body;

    // Associate the contact with the logged-in user (from req.user)
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      company,
      notes,
      user: req.user.id, // Link the contact to the logged-in user
    });

    const contact = await newContact.save();

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private (User must be authenticated)
const getContacts = async (req, res) => {
  try {
    // Find contacts that belong to the logged-in user
    const contacts = await Contact.find({ user: req.user.id });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single contact
// @route   GET /api/contacts/:id
// @access  Private (User must be authenticated)
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user.id });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private (User must be authenticated)
const updateContact = async (req, res) => {
  console.log("Request Params ID:", req.params.id);
  console.log("Request Body:", req.body);

  try {
    // Check if the contact belongs to the logged-in user before updating
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure the contact belongs to the user
      req.body,
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found or not authorized" });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private (User must be authenticated)
const deleteContact = async (req, res) => {
  try {
    // Check if the contact belongs to the logged-in user before deleting
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contact analytics
// @route   GET /api/contacts/analytics
// @access  Private
const getContactAnalytics = async (req) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // Ensure ObjectId

    const contactAnalytics = await Contact.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$company", // Group by company
          contactCount: { $sum: 1 }, // Count contacts per company
        },
      },
    ]);

    console.log("Raw Contact Analytics:", JSON.stringify(contactAnalytics, null, 2));

    return {
      data: contactAnalytics ?? [],
    };
  } catch (error) {
    console.error("Error fetching contact analytics:", error);
    throw new Error("Error fetching contact analytics");
  }
};



module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactAnalytics,
};
