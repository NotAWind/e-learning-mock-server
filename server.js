const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router({});
const middlewares = jsonServer.defaults();

server.use(middlewares);

const dataDir = path.join(__dirname, "data");

// Function to merge JSON files
const getMergedData = () => {
  const files = fs.readdirSync(dataDir);
  let data = {};

  files.forEach((file) => {
    const filePath = path.join(dataDir, file);
    const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    data = { ...data, ...fileData };
  });

  return data;
};

// Middleware to update the router with merged data
server.use((req, res, next) => {
  router.db.setState(getMergedData());
  next();
});

server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
