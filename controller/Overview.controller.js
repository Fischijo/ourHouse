sap.ui.define([
		"OurHouse/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"OurHouse/controller/LivingRoomLightController"
	], function(BaseController, JSONModel, LivingRoomLightController) {
		"use strict";
		return BaseController.extend("OurHouse.Overview", {
		
			onInit: function(){
			
				this.setModel(this.getOwnerComponent().getModel());
				this.loadSensorsAndData();
				this._addContent();
				
			},
			
			_addContent: function() {
				this._addSensorTiles();
				this._addLightControlTiles();			
			},
			
			_addSensorTiles: function() {
			
				var aSensors = this.getModel().getProperty("/sensors");
						
				var that = this;				
				for (var sSensor in aSensors) { 
					var oSensorData = aSensors[sSensor];
					if (oSensorData.active) {
						var oSensorTile = sap.ui.xmlfragment(that.getView().getId(), "OurHouse.view.fragments.GenericTempTile", that);
						oSensorTile.bindElement("/sensors/" + sSensor);
						that.getById("tempTilePanelId").insertContent(oSensorTile);
					}
				};	
				
			},
			
			_addLightControlTiles: function() {
			
				var oLivingRoomLightController = new LivingRoomLightController();				
				var oLightControlTile = sap.ui.xmlfragment("OurHouse.view.fragments.WohnzimmerLicht", oLivingRoomLightController);
				this.getById("lightPanelId").insertContent(oLightControlTile);
				
			},
			
			onTempTileClicked: function (oEvent) {
				
				var sPath = oEvent.getSource().getBindingContext().getPath();
				var oSensorModel = this.getModel().getProperty(sPath);
				
				this.getOwnerComponent().getRouter().navTo("temperatureDetail", {
					sensorId: oSensorModel.id
				}, false);
				
			},
			
			onManageSensorsPress: function() {
			
				this.getOwnerComponent().getRouter().navTo("manageSensors", false);
			
			}
		
	});
});