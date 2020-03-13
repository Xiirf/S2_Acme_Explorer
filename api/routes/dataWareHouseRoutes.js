'use strict';

const express = require('express');
var routerv1 = express.Router();
var routerv2 = express.Router();


module.exports = function(app) {
	var dataWareHousev1 = require('../controllers/v1/dataWareHouseController');
	var dataWareHousev2 = require('../controllers/v2/dataWareHouseController');
	var auth = require('../controllers/v2/authController');
    
	routerv1.route('/dataWareHouse')
		.get(dataWareHousev1.list_all_indicators)
		.post(dataWareHousev1.rebuildPeriod);

	routerv1.route('/dataWareHouse/latest')
		.get(dataWareHousev1.last_indicator);

	routerv1.route('/dataWareHouse/cube')
		.get(dataWareHousev1.read_cube_data)
    	.post(dataWareHousev1.compute_cube);
    
	app.use("/v1/", routerv1);

	dataWareHousev2.createDataWareHouseJob();
  	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get post
	 * @url /dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	routerv2.route('/dataWareHouse')
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
	routerv2.route('/dataWareHouse/latest')
		.get(auth.verifyUser(['Administrator']), dataWareHousev2.last_indicator);
	
		/**
		 * Get a list of last computed cube
		 * RequiredRole: Administrator
		 * @section dataWareHouse
		 * @type get
		 * @url /dataWareHouse/cube
		 * 
		*/
	routerv2.route('/dataWareHouse/cube')
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
    
    app.use("/v2/", routerv2);
};
