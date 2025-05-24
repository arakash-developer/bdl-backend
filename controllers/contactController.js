const upload = require("../config/fileconfig");
const Contact = require("../models/contact");
const fs = require("fs");
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ status: -1 })
      .sort({ _id: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContact = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { name, email, message, url, phoneNumber } = req.body;
    console.log(req.body);
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const visitingCard = req.files["visitingCard"]
      ? req.files["visitingCard"].map((file) => file.path)
      : null;

    if (!visitingCard) {
      return res.status(400).json({ message: "Visiting card is required" });
    }

    try {
      const contact = new Contact({
        name,
        email,
        message,
        url,
        phoneNumber,
        visitingCard,
      });
      await contact.save();
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const contact = await Contact.findByIdAndDelete({ _id: id });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    if (contact.visitingCard && fs.existsSync(contact.visitingCard)) {
      fs.unlinkSync(contact.visitingCard);
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContactById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(status);
  const contact = await Contact.findById(id);
  console.log(contact);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  contact.status = status;
  try {
    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
