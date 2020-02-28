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
    
    app.use("/v1/", router);
};
