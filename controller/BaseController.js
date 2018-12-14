sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"OurHouse/DataAccess"
], function (Controller, History, JSONModel, DataAccess) {
	"use strict";

	return Controller.extend("OurHouse.BaseController", {

		constructor: function() {
		
			this._dataAccess = new DataAccess();			
			this.eventBus = new sap.ui.core.EventBus();	
	
		},
	
		getModel: function(sModelName) {
			return this.getOwnerComponent().getModel(sModelName);
		},
	
		setModel: function(oModel, sModelName) {
			return this.getOwnerComponent().setModel(oModel, sModelName);
		},
	
		getRouter : function () {
			return this.getOwnerComponent().getRouter();
		},
		
		getById: function(sId) {
		
			return this.getView().byId(sId);
		
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("overview", {}, true /*no history*/);
			}
		},
		
		loadSensorsAndData: function () {
		
			this.getSensors();
			this.updateSensorData();
			var oIntervallTrigger = new sap.ui.core.IntervalTrigger(10000);
			oIntervallTrigger.removeListener(this.updateSensorData, this);			
			oIntervallTrigger.addListener(this.updateSensorData, this);			
		
		},
		
		getSensors: function() {
		
			this._dataAccess.getSensors(this, this._getSensorSuccess);
		
		},
		
		_getSensorSuccess: function(oJson) {
		
			var oSensorModel = { id: "",
								   sensorName: "",
								   sensorType: "",
								   displayOrder: 0,
								   active: false,
								   measurementIntervall: 0,
								   sensorOk: true,
								   criticality: "Good", //Critical
								   tempIndicator: "None", //Up, Down
								   tempHistory: [],
								   currentTemp: 0,
								   currentHum: 0,
								   currentPres: 0,
								   currentTime: 0,
								   lastTemp: 0,
								   lastHum: 0,
								   lastPres: 0,
								   lastTime: 0,
								   tempEnabled: false,
								   humEnabled: false,
								   pressureEnabled: false								   
								};
		
			var aSensors = JSON.parse(oJson);
			//sort array in order to have the correct order later on
			aSensors.sort(function(a, b){
				return  b.displayOrder - a.displayOrder;
			})
			
			var that = this;
			aSensors.forEach( function (oSensorIn) {					
				var oSensor = Object.create(oSensorModel);
				oSensor.id  = oSensorIn.sensorId;
				oSensor.sensorName = oSensorIn.description;
				oSensor.sensorType = oSensorIn.sensorTypeDescription;
				oSensor.displayOrder = oSensorIn.displayOrder;
				oSensor.measurementIntervall = oSensorIn.measurementIntervall;
				oSensor.active = oSensorIn.active === "0" ? false : true;
				var mModelSensors = that.getModel().getProperty("/sensors");
				mModelSensors[oSensor.id] = oSensor;
			});
			
		},
		
		getSensorData: function (sSensorId) {
				
			this._dataAccess.getSensorData(this, sSensorId, this._getSensorDataSuccess);
		
		},
		
		_getSensorDataSuccess: function(oJson) {
		
			var oData = JSON.parse(oJson);
			
			var sPropertyPrefix = "/sensors/" + oData.sensorId;
			
			var that = this;
			oData.capabilities.forEach( function(sCapability) { 
			
				switch (sCapability) {
					case "1":
						that.getModel().setProperty(sPropertyPrefix + "/tempEnabled", true);
						break;
					case "2":
						that.getModel().setProperty(sPropertyPrefix + "/humEnabled", true);	
						break;
					case "3":
						that.getModel().setProperty(sPropertyPrefix + "/pressureEnabled", true);
						break;
				}								
			});
			
			var aTempHistory = [];
			
			//measurement history is ordered by dateTime desc
			for (var i=oData.measurements.length-1; i>=0; i--){
				var measurement = oData.measurements[i];
				if (measurement === ""){
					continue;
				}

				var sTime = measurement.dateTime.substr(11, 8);
				var sDate = measurement.dateTime; //.replace(/ /g,"T");
				var oDate = new Date(sDate.substr(0,4), sDate.substr(5,2)-1, sDate.substr(8,2),
									 sDate.substr(11,2), sDate.substr(14,2), sDate.substr(17,2) );
				var obj = {
							x: oData.measurements.length - i,
							temp: parseFloat(measurement.temp).toFixed(1),
							hum:  parseFloat(measurement.hum).toFixed(1),
							pres: parseFloat(measurement.pres).toFixed(1),
							time: sTime,
							dateTime: oDate
						};
			  aTempHistory.push(obj);
			}						
			
			this.getModel().setProperty(sPropertyPrefix + "/tempHistory", aTempHistory);
			
			if (aTempHistory.length === 0) {
			   return;
			}
			
			var iIndexCurrentEntry = aTempHistory.length - 1;
			var iIndexLastEntry = 0;
			this.getModel().setProperty(sPropertyPrefix + "/currentTemp",  aTempHistory[iIndexCurrentEntry].temp);
			this.getModel().setProperty(sPropertyPrefix + "/currentHum",   aTempHistory[iIndexCurrentEntry].hum);
			this.getModel().setProperty(sPropertyPrefix + "/currentPres",  aTempHistory[iIndexCurrentEntry].pres);
			this.getModel().setProperty(sPropertyPrefix + "/currentTime",  aTempHistory[iIndexCurrentEntry].time);
			this.getModel().setProperty(sPropertyPrefix + "/lastTemp",     aTempHistory[iIndexLastEntry].temp);
			this.getModel().setProperty(sPropertyPrefix + "/lastHum",      aTempHistory[iIndexLastEntry].hum);
			this.getModel().setProperty(sPropertyPrefix + "/lastPres",     aTempHistory[iIndexLastEntry].pres);
			this.getModel().setProperty(sPropertyPrefix + "/lastTime",     aTempHistory[iIndexLastEntry].time);
				
			var o1stEntry = aTempHistory[iIndexCurrentEntry];
			var o2ndEntry = aTempHistory[iIndexCurrentEntry-1];
		
			var oType = new sap.ui.model.type.Time( { style: "short",
													  relative: true,
													  relativeScale: "auto"																	
													} );
			
			var sLastMeasurement = oType.formatValue(o1stEntry.dateTime, "Date");			
			this.getModel().setProperty(sPropertyPrefix + "/lastMeasurementTime", sLastMeasurement);
			
			var dNow = new Date();
			var diffMilliSeconds = dNow - aTempHistory[iIndexCurrentEntry].dateTime;
			var minutes = Math.floor((diffMilliSeconds/1000)/60);
			if (minutes > 60) {
				this.getModel().setProperty(sPropertyPrefix + "/sensorOk", false);
			}
			
			if (o1stEntry.temp > o2ndEntry.temp){
				this.getModel().setProperty(sPropertyPrefix + "/tempIndicator", "Up");
			} else {
				this.getModel().setProperty(sPropertyPrefix + "/tempIndicator", "Down");
			}
			if (o1stEntry.temp > 70){
				this.getModel().setProperty(sPropertyPrefix + "/criticality", "Error");
			} else if (o1stEntry.temp > 50) {
				this.getModel().setProperty(sPropertyPrefix + "/criticality", "Critical");
			} else {
				this.getModel().setProperty(sPropertyPrefix + "/criticality", "Good");
			}	
		},
		
		updateSensorData: function() {
		
			var aSensors = this.getModel().getProperty("/sensors");
			var that = this;
			for (var oSensor in aSensors) {
				that.getSensorData(aSensors[oSensor].id);	
			};
			
			this.eventBus.publish("sensorDataUpdated");
			
		}

	});

});
