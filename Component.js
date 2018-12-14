sap.ui.define( [
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	], 
function (UIComponent, JSONModel) {
	"use strict";
	return UIComponent.extend("OurHouse", {

		metadata: {
			rootView: {
				"viewName": "OurHouse.view.App",
				"type": "XML",
				"async": true
			},
			routing: {
				config: {
					routerClass: "sap.m.routing.Router",
					viewPath: "OurHouse.view",
					controlId: "rootControl",
					controlAggregation: "pages",
					viewType: "XML",
					async: true
				},
				routes: [
					{
						pattern: "",
						name: "overview",						
						target: "overview"
					},
					{
						pattern: "tempDetail/{sensorId}",
						name: "temperatureDetail",						
						target: "temperatureDetail"
					},
					{
						pattern: "manageSensors",
						name: "manageSensors",
						target: "manageSensors"
					},
					{
						pattern: "manageSensorDetail/{sensorId}",
						name: "manageSensorDetail",
						target: "manageSensorDetail"
					}
				],
				targets: {
					overview: {
						viewName: "Overview",
						viewLevel: 0
					},
					temperatureDetail: {
						viewName: "TemperatureDetail",
						viewLevel: 1
					},
					manageSensors: {
						viewName: "ManageSensors",
						viewLevel: 1
					},
					manageSensorDetail: {
						viewName: "ManageSensorDetail",
						viewLevel: 2
					}
				}
			}
		},

		init : function () {
			UIComponent.prototype.init.apply(this, arguments);

			// Parse the current url and display the targets of the route that matches the hash
			this.getRouter().initialize();
			

			var oModel = new JSONModel({
									tempUnit: "°C",
									tempIconUri: sap.ui.core.IconPool.getIconURI("temperature"), 
									sensors : []
								});
			this.setModel(oModel);

		}

	});

}, /* bExport= */ true);
