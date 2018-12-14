sap.ui.define([
		"OurHouse/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageToast) {
	"use strict";
	return BaseController.extend("OurHouse.ManageSensorDetail", {
	
		onInit: function(){
		
			this.getRouter().getRoute("manageSensorDetail").attachPatternMatched(this._onRouteMatched, this);
		
		},
		
		_onRouteMatched: function(oEvent) {
		
			if (!Object.keys(this.getModel().getData().sensors).length) {
				this.loadSensorsAndData();
				var oModel = this.getOwnerComponent().getModel();
				this.setModel(oModel);
			}
			
			var oArgs = oEvent.getParameter("arguments");			
			var sBindingPath = "/sensors/" + oArgs.sensorId;
			this.getView().bindElement(sBindingPath);
			
		},
		
		onSavePressed: function(oEvent) {
			
			var oPage = oEvent.getSource().getParent();
			var sBindingPath = oPage.getBindingContext().sPath;
			var oSensor = this.getModel().getProperty(sBindingPath);
		
			//TODO: in DataAccess.js umziehen
			$.ajax({
				type: "GET",
				url: "updateSensor.php",  
				data: {	sensorId: oSensor.id, 
						name: oSensor.sensorName,
						displayOrder: oSensor.displayOrder,
						intervall: oSensor.measurementIntervall,
						type: "",
						active: oSensor.active === true ? 1 : 0
					  },
				dataType: "text",
				async: false,
				//context: oContext,
				success: function(sResult){
					MessageToast.show(sResult);
				}
			});	
			
		}
	})
	
});