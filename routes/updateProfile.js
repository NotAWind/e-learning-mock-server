const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { defaultPort } = require("../utils/const");

const upload = multer({ dest: "uploads/" });

const handleProfileUpload = (server, dataDir) => {
  server.post("/updateProfile", upload.single("avatar"), (req, res) => {
    console.log("I am updateProfile");
    console.log("I am here!!");
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the uploaded file
    const { filename } = req.file;
    const avatarUrl = `http://localhost:${defaultPort}/uploads/${filename}`;

    // Mock updating user data (assuming user ID is passed in request body)
    const { userId, username, email } = req.body;
    const dbFilePath = path.join(dataDir, "users.json");
    const db = JSON.parse(fs.readFileSync(dbFilePath, "utf8"));

    const user = db.users.find((user) => user.userId === userId);
    if (user) {
      user.userName = username;
      user.email = email;
      user.avatar = avatarUrl;

      fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));

      res.json({ message: "File uploaded successfully", user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  server.use(
    "/uploads",
    require("express").static(path.join(__dirname, "uploads"))
  );
};

module.exports = handleProfileUpload;
