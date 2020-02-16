var express = require('express');
var router = express.Router()
require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger set up
const options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "API ACME Explorer",
        version: "1.0.0",
        description:
          "Documentation API ACME Explorer",
        license: {
          name: "MIT",
          url: "https://choosealicense.com/licenses/mit/"
        },
        contact: {
          name: "Swagger",
          url: "https://swagger.io",
          email: "Info@SmartBear.com"
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      security: [{
        bearerAuth: []
      }],
      servers: [
        {
          url: process.env.urlApp || "http://localhost:8080/v1"
        }
      ]
    },
    apis: [//Add your file with swagger doc here
        "./api/models/tripModel.js",
        "./api/models/actorModel.js",
        "./api/models/sponsorshipModel.js",
        "./api/controllers/actorController.js",
        "./api/controllers/sponsorshipController.js",
        "./api/controllers/tripController.js",
    ],        
  };

const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve);
router.get(
    "/docs",
    swaggerUi.setup(specs, {
        explorer: true
    })
);

module.exports = router