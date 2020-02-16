var express = require('express'),
app = express(),
port = process.env.PORT || 8080,
mongoose = require('mongoose'),
swaggerDoc = require('./api/routes/swaggerDoc'),
Actor = require('./api/models/actorModel'),
Sponsorship = require('./api/models/sponsorshipModel'),
Trip = require('./api/models/tripModel'),
bodyParser = require('body-parser');

 
// MongoDB URI building
var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "ACME-Explorer";
var mongoDBURI = "mongodb://" + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;
 
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

app.use("/v1", swaggerDoc);

var routesActors = require('./api/routes/actorRoutes'),
routesTrips = require('./api/routes/tripRoutes'),
routesSponsorships = require('./api/routes/sponsorshipRoutes');
 
routesActors(app);
routesTrips(app);
routesSponsorships(app);

console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});
 
mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});