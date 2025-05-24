//  groupsCount: 10,
//       seriesCount: 5,
//       subseriesCount: 8,
//       productsCount: 120,
//       specificationsCount: 30,
//       mockupZoneCount: 20,
//       recentWorkCount: 15,
//       greetingCount: 2,
//       activeUsers: 150,
//       inactiveUsers: 30,
//       totalMessages: 200,
//       unreadMessages: 40,

const academy = require("../models/academy");
const contact = require("../models/contact");
const greeting = require("../models/greeting");
const group = require("../models/group");
const mockupZone = require("../models/mockupZone");
const product = require("../models/product");
const recentWork = require("../models/recentWork");
const series = require("../models/series");
const specification = require("../models/specification");
const subSeries = require("../models/subSeries");
const user = require("../models/user");

exports.getAllInfo = async (req, res) => {
  const groupsCount = await group.countDocuments();
  const seriesCount = await series.countDocuments();
  const subseriesCount = await subSeries.countDocuments();
  const productsCount = await product.countDocuments();
  const specificationsCount = await specification.countDocuments();
  const mockupZoneCount = await mockupZone.countDocuments();
  const recentWorkCount = await recentWork.countDocuments();
  const greetingCount = await greeting.countDocuments();
  const activeUsers = await user.countDocuments({ status: "active" });
  const inactiveUsers = await user.countDocuments({ status: "inactive" });
  const totalMessages = await contact.countDocuments();
  const readMessages = await contact.countDocuments({ status: "read" });
  const academyCount = await academy.countDocuments();

  const recentWorkMediaCount = await recentWork.aggregate([
    {
      $project: {
        imageCount: { $size: { $ifNull: ["$images", []] } },
        videoCount: { $size: { $ifNull: ["$videos", []] } },
      },
    },
    {
      $group: {
        _id: null,
        totalImages: { $sum: "$imageCount" },
        totalVideos: { $sum: "$videoCount" },
      },
    },
  ]);
  const recentWorkImageCount = recentWorkMediaCount.length
    ? recentWorkMediaCount[0].totalImages
    : 0;
  const recentWorkVideoCount = recentWorkMediaCount.length
    ? recentWorkMediaCount[0].totalVideos
    : 0;

  const mockupZoneMediaCount = await mockupZone.aggregate([
    {
      $project: {
        imageCount: { $size: { $ifNull: ["$images", []] } },
        videoCount: { $size: { $ifNull: ["$videos", []] } },
      },
    },
    {
      $group: {
        _id: null,
        totalImages: { $sum: "$imageCount" },
        totalVideos: { $sum: "$videoCount" },
      },
    },
  ]);
  const mockupZoneImageCount = mockupZoneMediaCount.length
    ? mockupZoneMediaCount[0].totalImages
    : 0;
  const mockupZoneVideoCount = mockupZoneMediaCount.length
    ? mockupZoneMediaCount[0].totalVideos
    : 0;

  res.status(200).json({
    groupsCount,
    seriesCount,
    subseriesCount,
    productsCount,
    specificationsCount,
    mockupZoneCount,
    recentWorkCount,
    greetingCount,
    activeUsers,
    inactiveUsers,
    totalMessages,
    readMessages,
    academyCount,
    unreadMessages: totalMessages - readMessages,
    recentWorkImageCount,
    recentWorkVideoCount,
    mockupZoneImageCount,
    mockupZoneVideoCount,
  });
};
exports.getMessageActivity = async (req, res) => {
  try {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 6); // 7 days including today

    // Fetch all contacts created in the last 7 days
    const contacts = await contact.find({
      createdAt: { $gte: startDate, $lte: currentDate },
    });

    // Initialize message data array
    const messageData = [
      { day: "Mon", messages: 0 },
      { day: "Tue", messages: 0 },
      { day: "Wed", messages: 0 },
      { day: "Thu", messages: 0 },
      { day: "Fri", messages: 0 },
      { day: "Sat", messages: 0 },
      { day: "Sun", messages: 0 },
    ];

    // Count messages per day
    contacts.forEach((contact) => {
      const dayIndex = new Date(contact.createdAt).getDay(); // getDay() returns 0 (Sun) to 6 (Sat)
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        dayIndex
      ];

      const index = messageData.findIndex((data) => data.day === dayName);
      if (index !== -1) {
        messageData[index].messages += 1;
      }
    });

    res.status(200).json(messageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
