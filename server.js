const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");
const constant = require("./utils/const");
const handleProfileUpdate = require("./routes/updateProfile");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const dataDir = path.join(__dirname, "data");
const routes = JSON.parse(fs.readFileSync("routes.json"));

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

const router = jsonServer.router(getMergedData());

server.use(middlewares);

// Ensure the body parser middleware is used before custom routes
server.use(jsonServer.bodyParser);

// Custom middleware for POST requests
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  next();
});

// Handle profile update route
handleProfileUpdate(server, dataDir);

// Use the rewriter to handle custom routes from routes.json
server.use(jsonServer.rewriter(routes));

// Use the default JSON Server router
server.use(router);

const PORT = process.env.PORT || constant.defaultPort;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
