const MockupZone = require("../models/mockupZone");
const upload = require("../config/fileconfig3");
const fs = require("fs");
const path = require("path");

exports.getMockZoneSeries = async (req, res) => {
  try {
    const zones = await MockupZone.find({ status: "active" })
      .select("name")
      .sort({ prioroty: -1 });
    const zoneSeries = zones.map((zone) => zone.name);
    res.status(200).json(zoneSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
