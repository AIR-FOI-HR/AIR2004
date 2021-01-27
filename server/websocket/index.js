const tabletNamespace = require("./tablet");
const teacherNamespace = require("./teacher");

const websocket = (server) => {
  global.io = require("socket.io")(server);
  console.log("WebSocket server started!");

  const teacher = io.of("/teacher");
  const tablet = io.of("/tablet");

  // Namespace to which the teacher connects using mobile app
  // Contains logic of all socket messages that are sent from the mobile application by the teacher
  teacher.on("connection", teacherNamespace);

  // Namespace to which the tablet application conencts to
  // Contains logic for all socket messages that are sent from the tablet to the server.
  tablet.on("connection", tabletNamespace);
};

module.exports = websocket;
