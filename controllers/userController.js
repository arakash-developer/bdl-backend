const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  console.log(req.body);
  const registeredUser = await User.findOne({ email });
  if (registeredUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const user = new User({
      name,
      email,
      password,
      phone,
      role,
    });
    await user.save();
    const token = await user.getJwtToken();
    res.status(201).json({
      userId: user.email,
      token,
      message: "User registered successfully!",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.status === "active") {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Your password is incorrect please try again" });
      }
      const token = await user.getJwtToken();
      res.status(200).json({
        user: user._id,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: "User is not active" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.password = req.body.password || user.password;
    user.role = req.body.role || user.role;
    user.status = req.body.status || user.status;
    await user.save();
    res.status(200).json({ message: "User updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
