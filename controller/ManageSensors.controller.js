sap.ui.define([
		"OurHouse/controller/BaseController",
		"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("OurHouse.ManageSensors", {
	
		onInit: function(){
		
			this.getRouter().getRoute("manageSensors").attachPatternMatched(this._onRouteMatched, this);
		
		},
		
		_onRouteMatched: function(oEvent) {
		
			if (!Object.keys(this.getModel().getData().sensors).length) {
				this.loadSensorsAndData();
				var oModel = this.getOwnerComponent().getModel();
				this.setModel(oModel);
			}
			
			var mSensors = this.getModel().getProperty("/sensors");
			var aSensors = [];
			for (var sSensor in mSensors) {
				aSensors.push(mSensors[sSensor]);
			}
			var oSensorModel = new JSONModel(aSensors);
			this.setModel(oSensorModel, "sensorData");
		
		},
		
		onItemPress: function(oEvent) {
		
			var oSource = oEvent.getSource();
			var sBindingPath = oSource.getSelectedContextPaths()[0];
			var oSensor = this.getModel("sensorData").getObject(sBindingPath);
			this.getOwnerComponent().getRouter().navTo("manageSensorDetail", {
					sensorId: oSensor.id
				}, false);
		
		}
	})
});