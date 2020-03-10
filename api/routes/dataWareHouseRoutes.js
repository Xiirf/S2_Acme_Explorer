'use strict';

const express = require('express');
var router = express.Router();

module.exports = function(app) {
	var dataWareHousev1 = require('../controllers/v1/dataWareHouseController');
	var dataWareHousev2 = require('../controllers/v2/dataWareHouseController');
	var auth = require('../controllers/authController');
    
    dataWareHouse.createDataWareHouseJob();
	router.route('/dataWareHouse')
		.get(dataWareHousev1.list_all_indicators)
		.post(dataWareHousev1.rebuildPeriod);

	router.route('/dataWareHouse/latest')
		.get(dataWareHousev1.last_indicator);

	router.route('/dataWareHouse/cube')
		.get(dataWareHousev1.read_cube_data)
    	.post(dataWareHousev1.compute_cube);
    
	app.use("/v1/", router);

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
		.get(auth.verifyUser(['Administrator']), dataWareHousev2.list_all_indicators)
		.post(auth.verifyUser(['Administrator']), dataWareHousev2.rebuildPeriod);

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	router.route('/dataWareHouse/latest')
		.get(auth.verifyUser(['Administrator']), dataWareHousev2.last_indicator);
	
		/**
		 * Get a list of last computed cube
		 * RequiredRole: Administrator
		 * @section dataWareHouse
		 * @type get
		 * @url /dataWareHouse/cube
		 * 
		*/
	router.route('/dataWareHouse/cube')
		.get(auth.verifyUser(['Administrator']), dataWareHousev2.read_cube_data)
	
		/**
		 * Generated a new cube
		 * RequiredRole: Administrator
		 * @section dataWareHouse
		 * @type post
		 * @url /dataWareHouse/cube
		 * 
		*/
    	.post(auth.verifyUser(['Administrator']), dataWareHousev2.compute_cube);
    
    app.use("/v2/", router);
};
