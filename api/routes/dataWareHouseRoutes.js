'use strict';

const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var dataWareHouse = require('../controllers/dataWareHouseController');
    
    dataWareHouse.createDataWareHouseJob();

  	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get post
	 * @url /dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	router.route('/dataWareHouse')
	.get(dataWareHouse.list_all_indicators)
	.post(dataWareHouse.rebuildPeriod);

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	router.route('/dataWareHouse/latest')
	.get(dataWareHouse.last_indicator);
	
		/**
	 * Get a list of last computed cube
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/cube
	 * 
	*/
	router.route('/dataWareHouse/cube')
	.get(dataWareHouse.read_cube_data)
	
		/**
	 * Generated a new cube
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type post
	 * @url /dataWareHouse/cube
	 * 
	*/
    .post(dataWareHouse.compute_cube);
    
    app.use("/v1/", router);
};
