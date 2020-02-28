var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Applications = mongoose.model('Applications'),
  Trips = mongoose.model('Trips');

 /**
 * @swagger
 * path:
 *  '/dataWarehouse':
 *    get:
 *      tags:
 *        - DataWareHouse
 *      description: >-
 *        Retrieve the records of the all the sets of the global statistics ever computed
 *      operationId: getStatsDataWarehouse
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - type: array
 *                  items:
 *                    $ref: '#/components/schemas/statsDataWareHouse'
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.list_all_indicators = function(req, res) {
  console.log('Requesting indicators');
  
  DataWareHouse.find().sort("-computationMoment").exec(function(err, indicators) {
    if (err){
      res.send(err);
    }
    else{
      res.json(indicators);
    }
  });
};

 /**
 * @swagger
 * path:
 *  '/dataWarehouse/latest':
 *    get:
 *      tags:
 *        - DataWareHouse
 *      description: >-
 *        Retrieve the last set of global statistics computed
 *      operationId: getLatestStatsDataWarehouse
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/statsDataWareHouse'
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.last_indicator = function(req, res) {
  
  DataWareHouse.find().sort("-computationMoment").limit(1).exec(function(err, indicators) {
    if (err){
      res.send(err);
    }
    else{
      res.json(indicators);
    }
  });
};

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '*/30 * * * * *';  //El que se usará por defecto
var computeDataWareHouseJob;

exports.rebuildPeriod = function(req, res) {
  console.log('Updating rebuild period. Request: period:'+req.query.rebuildPeriod);
  rebuildPeriod = req.query.rebuildPeriod;
  computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
  computeDataWareHouseJob.start();

  res.json(req.query.rebuildPeriod);
};

function createDataWareHouseJob(){
      computeDataWareHouseJob = new CronJob(rebuildPeriod,  function() {
      
      var new_dataWareHouse = new DataWareHouse();
      console.log('Cron job submitted. Rebuild period: '+rebuildPeriod);
      async.parallel([
        computeStatsNumberTripsByManager,
        computeStatsNumberApplicationByTrips,
        computeStatsPriceByTrips,
        computeRatioApplicationsByStatus
      ], function (err, results) {
        if (err) {
          console.log("Error computing datawarehouse: "+err);
        }
        else {
            new_dataWareHouse.statsNumberTripsByManager = results[0];
            new_dataWareHouse.statsNumberApplicationByTrips = results[1];
            new_dataWareHouse.statsPriceByTrips = results[2];
            new_dataWareHouse.ratioApplicationsByStatus = results[3];
            new_dataWareHouse.rebuildPeriod = rebuildPeriod;

            //console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(new_dataWareHouse));
            
            new_dataWareHouse.save(function(err, datawarehouse) {
                if (err){
                    console.log("Error saving datawarehouse: "+err);
                }
                else{
                    console.log("new DataWareHouse succesfully saved. Date: "+new Date());
                }
            });
        }
    });
    }, null, true, 'Europe/Madrid');
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;

function computeStatsNumberTripsByManager (callback) {
    Trips.aggregate([
        {
            $group: {
                _id: "$managerId",
                nbTrips: { $sum: 1 }
            }
        }, {
            $group: {
                _id: null,
                avg: { $avg: "$nbTrips" },
                min: { $min: "$nbTrips" },
                max: { $max: "$nbTrips" },
                stdDeviation: { $stdDevPop: "$nbTrips" },
            }
        }, {
            $project: {
                _id: 0
            }
        }
    ], function(err, res){
        callback(err, res[0])
    });
};

function computeStatsNumberApplicationByTrips (callback) {
    Applications.aggregate([
        {
            $group: {
                _id: "$idTrip",
                nbApplications: { $sum: 1 }
            }
        }, {
            $group: {
                _id: null,
                avg: { $avg: "$nbApplications" },
                min: { $min: "$nbApplications" },
                max: { $max: "$nbApplications" },
                stdDeviation: { $stdDevPop: "$nbApplications" },
            }
        }, {
            $project: {
                _id: 0
            }
        }
    ], function(err, res){
        callback(err, res[0])
    });
};

function computeStatsPriceByTrips (callback) {
    Trips.aggregate([
        {
            $group: {
                _id: null,
                avg: { $avg: "$price" },
                min: { $min: "$price" },
                max: { $max: "$price" },
                stdDeviation: { $stdDevPop: "$price" },
            }
        }, {
            $project: {
                _id: 0
            }
        }
    ], function(err, res){
        callback(err, res[0])
    });
};

function computeRatioApplicationsByStatus (callback) {
    Applications.aggregate([
        {
            $group: {
                _id: null, n: { $sum: 1 }
            }
        }
    ], function(err, res) {
        Applications.aggregate([
            {
                $group: {
                    _id: "$status",
                    ratio: { $sum: 1 / res.n }
                }
            }, {
                $project: {
                    _id: 0,
                    status: "$_id",
                    ratio: 1
                }
            }
        ], function(err, res){
            callback(err, res)
        });
    });
};