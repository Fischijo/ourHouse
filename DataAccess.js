sap.ui.define([
	"sap/ui/base/Object"
], function (BaseObject) {
	"use strict";

	return BaseObject.extend("OurHouse.DataAccess", {
	
		constructor: function () {
		
		},
		
		getSensors: function (oContext, fnSuccess) {
		
			$.ajax({
				type: "GET",
				url: "getSensors.php",
				dataType: "text",
				async: false,
				context: oContext,
				success: fnSuccess
			});
		
		},
		
		getSensorData: function (oContext, sSensorId, fnSuccess) {
		
			$.ajax({
				type: "GET",
				url: "getAllSensorData.php",   //"getSensorData.php",  
				data: {	sensorId: sSensorId, 
						top: 500
					  },
				dataType: "text",
				async: false,
				context: oContext,
				success: fnSuccess
			});
		
		}
	
	})

});	
