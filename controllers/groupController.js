/**
 * Group Controller
 * @author havetic
 *
 */
const Group = require("../models/group");
const upload = require("../config/fileconfig");
const fs = require("fs");
const Series = require("../models/series");

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all groups from the database and sends them as a response.
 */
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().sort({ _id: -1 });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function creates a new group in the database.
 */

const createGroup = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "No data provided" });
  }
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    console.log("Uploaded Files:", req.files); // Log the uploaded files
    const { name } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;

    console.log(image, name);

    if (!image) {
      return res.status(400).json({ message: "image is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    const group = new Group({
      name,
      image,
    });

    try {
      const newGroup = await group.save();
      res.status(201).json({ newGroup, message: "success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function updates a group in the database.
 */
const updateGroup = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { name } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;
    const { id } = req.params;

    try {
      const group = await Group.findById(id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      if (name) {
        group.name = name;
      }

      if (image) {
        if (group.image && fs.existsSync(group.image)) {
          fs.unlinkSync(group.image);
        }
        group.image = image;
      }

      const updatedGroup = await group.save();
      res.status(200).json({ updatedGroup, message: "success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function deletes a group from the database.
 */

// const deleteGroup = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const group = await Group.findById(id);
//     if (!group) {
//       return res.status(404).json({ message: "Group not found" });
//     }
//     if (group.image && fs.existsSync(group.image)) {
//       fs.unlinkSync(group.image);
//     }
//     await group.remove();
//     res.status(200).json({ message: "Group deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

/**
 *
 * @param {*} req
 * @param {*} res
 * The function deletes a group from the database and checks if there are any associated series before deleting it.
 */
const deleteGroup = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    // Check if there are any associated series
    const associatedSeries = await Series.findOne({ group: id });
    console.log("associatedSeries", associatedSeries);

    if (associatedSeries) {
      return res.status(400).json({
        message: "Cannot delete group because it has associated series",
      });
    }

    // Check if the group exists
    const group = await Group.findOneAndDelete({ _id: id });
    console.log("group", group);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Proceed with deletion
    if (group.image && fs.existsSync(group.image)) {
      fs.unlinkSync(group.image);
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves a group by its ID from the database and sends it as a response.
 */
const getGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({ group, message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupById,
};
