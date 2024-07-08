const ecomDB = require("../db/dbConnection");

module.exports = {
  registerUser,
  getAllUsers,
  loginUser,
};

async function registerUser(req, res) {
  try {
    const collection = await ecomDB.connectUsersDB();
    const newUser = req.body;
    await collection.insertOne(newUser);

    res.json({ data: newUser, msg: "User Registered Successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllUsers(req, res) {
  try {
    const collection = await ecomDB.connectUsersDB();

    const users = await collection
      .find({}, { projection: { password: 0 } })
      .toArray();

    let totalCount = 0;
    if (users.length > 0) {
      totalCount = users.length;
    }
    res.json({
      data: users,
      totalCount: totalCount,
      msg: "Users Retrieved Successfully",
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function loginUser(req, res) {
  try {
    const collection = await ecomDB.connectUsersDB();

    const { username, password } = req.body;

    // Query the database to find a user with the provided username and password
    const user = await collection.findOne({ username, password });

    let logedInUser = [];
    if (user) {
      logedInUser = user;
      res.status(200).json({ data: logedInUser, err: false, msg: "User Login successfully" });
    } else {
      // If no user found, send an error message
      res.status(401).json({ data: logedInUser, err: true, msg: "Please enter correct credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
