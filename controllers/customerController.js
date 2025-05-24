const Customer = require("../models/customer");

exports.getAllCustomer = async (req, res) => {
  try {
    const customer = await Customer.find();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  const {
    customerCode,
    customerCategory,
    profession,
    name,
    email,
    phoneNumber,
    address,
    discount,
    remarks,
  } = req.body;

  console.log(
    customerCode,
    customerCategory,
    profession,
    name,
    email,
    phoneNumber,
    address,
    discount,
    remarks
  );

  try {
    const customer = new Customer({
      customerCode,
      customerCategory,
      profession,
      name,
      email,
      phoneNumber,
      address,
      discount,
      remarks,
    });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const {
    customerCode,
    customerCategory,
    profession,
    name,
    email,
    phoneNumber,
    address,
    discount,
    remarks,
  } = req.body;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.customerCode = customerCode || customer.customerCode;
    customer.customerCategory = customerCategory || customer.customerCategory;
    customer.profession = profession || customer.profession;
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;
    customer.address = address || customer.address;
    customer.discount = discount || customer.discount;
    customer.remarks = remarks || customer.remarks;

    await customer.save();
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
