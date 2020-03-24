var express = require('express'),
enable_cors = require('cors'),
app = express(),
port = process.env.PORT || 8080,
mongoose = require('mongoose'),
swaggerDocV1 = require('./api/routes/swaggerDocV1'),
// swaggerDocV2 = require('./api/routes/swaggerDocV2'),
GlobalVars = require('./api/models/globalVarsModel'),
Actor = require('./api/models/actorModel'),
Trip = require('./api/models/tripModel'),
Sponsorship = require('./api/models/sponsorshipModel'),
Application = require('./api/models/applicationModel'),
Finder = require('./api/models/finderModel'),
DataWareHouse = require('./api/models/dataWareHouseModel'),
Cube = require('./api/models/cubeModel'),
POIs = require('./api/models/poiModel'),
admin = require('firebase-admin'),
serviceAccount = require("./acme-explorer-6415d-firebase-adminsdk-ea57g-024809d2fe"),
bodyParser = require('body-parser');
require('dotenv').config();
var fs = require('fs');
var https = require('https');
// MongoDB URI building
var mongoDBUser = process.env.MONGO_USER || "admin";
var mongoDBPass = process.env.MONGO_PASSWORD || "mdp";
var mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ":" + mongoDBPass + "@" : "";

var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "ACME-Explorer";

var mongoDBURI = "mongodb://" + mongoDBCredentials + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;
 
mongoose.connect(mongoDBURI, {
    reconnectTries: 10,
    reconnectInterval: 500,
    poolSize: 10, // Up to 10 sockets
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // skip trying IPv6
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(enable_cors());

app.use("/v1", swaggerDocV1);
// app.use("/v2", swaggerDocV2);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://acme-explorer-6415d.firebaseio.com"
});

var routesActors = require('./api/routes/actorRoutes'),
routesSponsorships = require('./api/routes/sponsorshipRoutes'),
routesActors = require('./api/routes/actorRoutes'),
routesApplications = require('./api/routes/applicationRoutes'),
routesTrips = require('./api/routes/tripRoutes'),
routesFinders = require('./api/routes/finderRoutes')
routesGlobalVars = require('./api/routes/globalVarsRoutes');
routesDataWareHouse = require('./api/routes/dataWareHouseRoutes'),
routesStorage = require('./api/routes/storageRoutes'),
routesLogin = require('./api/routes/loginRoutes'),
routesPOIs = require('./api/routes/poiRoutes');
 
routesActors(app);
routesSponsorships(app);
routesApplications(app);
routesTrips(app);
routesFinders(app);
routesGlobalVars(app);
routesDataWareHouse(app);
routesStorage(app);
routesLogin(app);
routesPOIs(app);
 
console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    GlobalVars.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }, (err, glob) => {});

    Actors.findOne({"email": "admin@test.com"}, (err, actor) => {
        if(!actor) {
            new Actor({
                "name": "Test",
                "surname": "Test",
                "email": "admin@test.com",
                "phone": "012459786",
                "password": "mdp",
                "address": "algun lugar",
                "role": "Administrator"
            }).save();
        }
    });
    
    https.createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.cert')
    }, app)
    .listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});
 
mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});

module.exports = app;