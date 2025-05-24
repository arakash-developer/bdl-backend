const Greeting = require("../models/greeting");
const fs = require("fs");
const upload = require("../config/fileconfig");

exports.getAllGreetings = async (req, res) => {
  try {
    const greetings = await Greeting.find();
    res.status(200).json(greetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGreeting = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { title, message, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const image = req.files["image"][0].path;
    try {
      const newGreeting = new Greeting({
        title,
        image,
        message,
        status,
      });
      await newGreeting.save();
      res.status(201).json({ newGreeting, message: "success" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.updateGreeting = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { id } = req.params;
    const { status } = req.body;
    const greeting = await Greeting.findById(id);
    try {
      greeting.status = status;
      await greeting.save();
      res.status(200).json(greeting);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteGreeting = async (req, res) => {
  const { id } = req.params;
  const greeting = await Greeting.findByIdAndDelete(id);
  if (!greeting) {
    return res.status(404).json({ message: "greeting not found" });
  }
  if (greeting.image && fs.existsSync(greeting.image)) {
    fs.unlinkSync(greeting.image);
  }
  try {
    res.status(200).json({ message: "greeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGreetingById = async (req, res) => {
  const { id } = req.params;
  try {
    const greeting = await Greeting.findById(id);
    if (!greeting) {
      return res.status(404).json({ message: "greeting not found" });
    }
    res.status(200).json(greeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
