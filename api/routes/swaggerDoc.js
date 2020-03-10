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
        parameters: {
          language: {
            name: "Accept-Language",
            in: "header",
            description: "The ISO 639-1 language code that will be used to return error messages. Only the first two letters of the header are relevant.",
            required: false,
            schema: {
              type: "string",
              default: "en-US"
            },
            example: "en-US"
          }
        },
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
          url: process.env.urlApp || "https://localhost:8080/v1"
        }
      ]
    },
    apis: [//Add your file with swagger doc here
        "./api/models/tripModel.js",
        "./api/models/actorModel.js",
        "./api/models/sponsorshipModel.js",
        "./api/models/applicationModel.js",
        "./api/models/finderModel.js",
        "./api/models/globalVarsModel.js",
        "./api/models/dataWareHouseModel.js",
        "./api/controllers/globalVarsController.js",
        "./api/controllers/v2/actorController.js",
        "./api/controllers/v2/sponsorshipController.js",
        "./api/controllers/tripController.js",
        "./api/controllers/applicationController.js",
        "./api/controllers/finderController.js",
        "./api/controllers/dataWareHouseController.js",
        "./api/controllers/storageController.js"
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