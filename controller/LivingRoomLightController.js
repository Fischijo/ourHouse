sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("OurHouse.LivingRoomLightController", {
	
		constructor: function() {
			this._ligthActionsMap = this.getLightActions();
		},
		
		onLightSwitchPressed: function(oEvent) {
			var oSource = oEvent.getSource();
			var sButtonId = oSource.getId();
			//var iButtonIdOffset = oSource.getId().length + 2;
			var lightActionId = sButtonId; //sButtonId.substr(iButtonIdOffset);
			var lightActionRequest = this._ligthActionsMap.get(lightActionId);
			if (lightActionRequest){
				$.get(lightActionRequest);
				var sButtonText = oSource.getText();
				MessageToast.show(sButtonText);
			}
		},
			
		getLightActions: function(){
		
			var lightActionMap = new Map();
			lightActionMap.set("wohnzimmerLampeAan", "http://192.168.178.237/?LED=A_On");
			lightActionMap.set("wohnzimmerLampeAaus", "http://192.168.178.237/?LED=A_Off");
			lightActionMap.set("wohnzimmerLampeBan", "http://192.168.178.237/?LED=B_On");
			lightActionMap.set("wohnzimmerLampeBaus", "http://192.168.178.237/?LED=B_Off");
			lightActionMap.set("wohnzimmerLampeCan", "http://192.168.178.237/?LED=C_On");
			lightActionMap.set("wohnzimmerLampeCaus", "http://192.168.178.237/?LED=C_Off");
			
			return lightActionMap;
		
		}
		
	})
});	