var async = require("async");
var mongoose = require('mongoose'),
DataWareHouse = mongoose.model('DataWareHouse'),
Applications = mongoose.model('Applications'),
Trips = mongoose.model('Trips');
Finders = mongoose.model('Finders');
const Table = require('olap-cube').model.Table
const COMPARISON_OPERATIONS = new Map([
    ['EQ', (b) => (a)  => a == b],
    ['NE', (b) => (a) => a != b],
    ['GT', (b) => (a) => a > b],
    ['GTE', (b) => (a) => a >= b],
    ['LT', (b) => (a) => a < b],
    ['LTE', (b) => (a) => a <= b]
]);
const summation = (sum, value) => {
    return [sum[0] + value[0]]
};
var cube;

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

 /**
 * @swagger
 * path:
 *  '/dataWarehouse/cube':
 *    post:
 *      tags:
 *        - DataWareHouse
 *      description: >-
 *        Compute a new version of the cube M[e, p]that returns the amount of money that explorer e has spent on trips during period p, which can be M01-M36 to denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years
 *      operationId: computeNewCube
 *      responses:
 *        '201':
 *          description: Created
 *        '500':
 *           description: Internal server error
 */
exports.compute_cube = function(req, res) {
    var cubeMoneySpent = new Table({
        dimensions: ['month', 'year', 'explorer'],
        fields: ['moneySpent']
    })

    dateMax = new Date();
    dateMin = new Date();
    dateMin.setFullYear(dateMin.getFullYear() - 3);

    Applications.aggregate([
        {
            $match: {
                payedAt: { $gt: dateMin }
            }
        }, {
            $project: {
                idTrip: "$idTrip",
                idExplorer: "$idExplorer",
                payedAt: {
                    $subtract: [dateMax, "$payedAt"]
                }
            } 
        }, {
            $lookup: {
                from: "trips",
                localField: "idTrip",
                foreignField: "_id",
                as: "trip"
            }
        }, {
            $project: {
                idExplorer: 1,
                payedAt: 1,
                trip: {
                    $arrayElemAt: ["$trip", 0]
                }
            }
        }, {
            $group: {
                _id: {
                    "idExplorer": "$idExplorer",
                    "month": {
                        $dateToString: {
                            format: "%m",
                            date: {
                                $add: [new Date(0), "$payedAt"]
                            }
                        }
                    },
                    "year": {
                        $dateToString: {
                            format: "%Y",
                            date: {
                                $add: [new Date(0), "$payedAt"]
                            }
                        }
                    },
                },
                moneySpent: { $sum: "$trip.price" }
            }
        }, {
            $project: {
                idExplorer: "$_id.idExplorer",
                month:  "$_id.month",
                year:  "$_id.year",
                moneySpent: 1
            }
        }, {
            $sort: { year: 1, month: 1, idExplorer: 1 }
        },
    ], function(err, res2){
        if(err) {
            res.status(500).send(err);
        } else {
            cube = cubeMoneySpent.addRows({
                header: ['month', 'year', 'explorer', 'moneySpent'],
                rows: res2.map(row => [parseInt(row.month) - 1, parseInt(row.year) - 1970, row.idExplorer.toString(), row.moneySpent])
            });
            res.sendStatus(201);
        }
    })
}

 /**
 * @swagger
 * path:
 *  '/dataWarehouse/cube':
 *    get:
 *      tags:
 *        - DataWareHouse
 *      description: >-
 *        Retrieve the result of a query on the cube (only if he's already computed)
 *      operationId: queryCube
 *      parameters:
 *        - name: period
 *          in: query
 *          description: period that you wanna retrieve the money spent on by explorers
 *          required: true
 *          schema:
 *            type: string
 *        - name: explorer
 *          in: query
 *          description: Id of the explorer that you wanna retrieve the money spent on the period
 *          required: false
 *          schema:
 *            type: string
 *        - name: value
 *          in: query
 *          description: Value of the money spent by each explorer on the period to compare with
 *          required: false
 *          schema:
 *            type: number
 *        - name: operator
 *          in: query
 *          description: Operator to use to compare the value to the money spent by each explorer on the period
 *          required: false
 *          schema:
 *            type: string
 *            enum: ['EQ','NE', 'GT', 'GTE', 'LT', 'LTE']
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                required:
 *                  - result
 *                properties:
 *                  result:
 *                    type: array
 *                    items:
 *                      type:
 *                        oneOf:
 *                          - string
 *                          - float
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.read_cube_data = function(req, res) {
    idExplorer = req.query.explorer;
    period = req.query.period; // M01-36 || Y01-03
    if(!(typeof(period) == 'string' && period.match(/(M0[1-9])|(M[1-2][0-9])|(M3[0-6])|(Y0[0-3])/g))) {
        res.status(422).send({ error: "Incorrect query"});
        return;
    }
    numberPeriod = parseInt(period.slice(1));
    year = period.slice(0, 1) == 'Y' ? numberPeriod - 1 : Math.floor(numberPeriod / 12);
    month = period.slice(0, 1) == 'M' ? numberPeriod - 1 % 12 : null;
    if(idExplorer) {
        cubeTemp = cube.slice('explorer', idExplorer);
        console.log(cubeTemp.rows)
        cubeTemp = cubeTemp.slice('year', year);
        if(month) {
            moneySpent = cubeTemp.slice('month', month).data;
        } else {
            moneySpent = cubeTemp.rollup('year', ['moneySpent'], summation, [0]).data;
        }
        res.send({ result: moneySpent.length > 0 ? moneySpent[0] : 0 });
    } else {
        var explorers;
        value = parseInt(req.query.value);
        operator = req.query.operator;
        if(typeof(value) != 'number' || !COMPARISON_OPERATIONS.has(operator)) {
            res.status(422).send({ error: "Incorrect query"});
            return;
        }
        year = period.slice(0, 1) == 'Y' ? numberPeriod - 1 : Math.floor(numberPeriod / 12);
        month = period.slice(0, 1) == 'M' ? numberPeriod - 1 % 12 : null;
        operation = COMPARISON_OPERATIONS.get(operator)(value);
        cubeTemp = cube.slice('year', year);
        if(month) {
            cubeTemp = cubeTemp.slice('month', month);
            explorers = cubeTemp.rows
                .filter(row => operation(row[3]))
                .map(row => row[2]);
        } else {

            cubeTemp = cubeTemp.rollup('explorer', ['moneySpent'], summation, [0]);
            explorers = cubeTemp.rows
                .filter(row => operation(row[1]))
                .map(row => row[0]);
        }
        
        res.send({ result: explorers.flat() });
    }
}

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '*/10 * * * * *';  //El que se usará por defecto
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
        computeRatioApplicationsByStatus,
        computeStatsAveragePriceInFinders,
        computeStatsTopKeyWords
      ], function (err, results) {
        if (err) {
          console.log("Error computing datawarehouse: "+err);
        }
        else {
            console.log(results)
            new_dataWareHouse.statsNumberTripsByManager = results[0];
            new_dataWareHouse.statsNumberApplicationByTrips = results[1];
            new_dataWareHouse.statsPriceByTrips = results[2];
            new_dataWareHouse.ratioApplicationsByStatus = results[3];
            new_dataWareHouse.statsAveragePriceInFinders = results[4];
            new_dataWareHouse.statsTopKeyWords = results[5];
            new_dataWareHouse.rebuildPeriod = rebuildPeriod;
            
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
        callback(err, res.length != 0 ? res[0] : res)
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
        callback(err, res.length != 0? res[0] : res)
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
        callback(err, res.length != 0 ? res[0] : res)
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
        if(res.length == 0) {
            callback(err, res)
            return;
        }
        Applications.aggregate([
            {
                $group: {
                    _id: "$status",
                    ratio: { $sum: 1 / res[0].n }
                }
            }, {
                $project: {
                    _id: 0,
                    status: "$_id",
                    ratio: 1
                }
            }
        ], function(err, res){
            callback(err, res.length != 0 ? res[0] : res)
        });
    });
};

function computeStatsAveragePriceInFinders (callback) {
    Finders.aggregate([
        {
            $group: {
                _id: null,
                minAvg: { $avg: "$priceMin" },
                maxAvg: { $avg: "$priceMax" }
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

function computeStatsTopKeyWords (callback) {
    Finders.aggregate([
        {
            $group: {
                _id: "$keyWord",
                numFinder: { $sum: 1 }
            }
        }, {
            $sort: {
                numFinder: -1
            }
        }, {
            $limit: 10
        }, {
            $project: {
                _id: 0,
                keyWord: "$_id"
            }
        }
    ], function(err, res){
        callback(err, res)
    });
};