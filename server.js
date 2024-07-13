const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");

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
server.use(jsonServer.rewriter(routes));
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
