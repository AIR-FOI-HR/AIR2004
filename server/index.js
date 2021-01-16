require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Connect to the database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configure Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Unittend API Documentation",
      servers: ["http://localhost:8080/"],
      version: process.env.npm_package_version,
    },
    basePath: "/api",
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
    },
  },
  apis: ["./routes/*.js"],
};

// Serve Swagger documentation
//const swaggerDocs = swaggerJsDoc(swaggerOptions);
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// REST API
app.use(express.json());
app.use("/api", routes);

const server = app.listen(process.env.PORT || 8080, () => console.log(`Started on port ${process.env.PORT}!`));

// Start WebSocket server on the same Express server
require("./websocket")(server);
