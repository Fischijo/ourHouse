sap.ui.define([
		"OurHouse/controller/BaseController",
		"OurHouse/justgage",
		"OurHouse/raphael",
		"sap/viz/ui5/data/FlattenedDataset", 
		"sap/viz/ui5/controls/common/feeds/FeedItem",
		"sap/ui/model/json/JSONModel"
	], 
	function(BaseController, justgage, raphael, FlattenedDataset, FeedItem, JSONModel) {
		"use strict";
		
		return BaseController.extend("OurHouse.TemperatureDetail", { 

		_vizFrameProperties: {
			general: {
				layout: {
					padding: 0
				}
			},
			title: {
				text: ""
			},
			plotArea: {
				background: {
					color: "#e6f2ff",
					drawingEffect: "glossy",
					gradientDirection: "vertical",
					border: {
						bottom: {
							visible: true
						},
						left: {
							visible: true
						},
						right: {
							visible: true
						}
					}
				},
				window: {
					start: "firstDataPoint",
					end: "lastDataPoint"
				},
				width: 1,
				marker:{
					visible : false,
					displayMode: "auto"
				},
				dataLabel: {
					visible: false
				},
				isSmoothed: true,
				showGap: false,
				adjustScale: true,
				colorPalette: ["#0080ff", "#ff9900"]
			},
			valueAxis: {
				visible: true,
				color: "#0080ff",
				axisLine: { 
					visible: false
					},
				title: {
					text: "Temperatur °C",
					applyAxislineColor: true
					}
			},
			valueAxis2: {
				visible: true,
				color: "#ff9900",
				axisLine: { 
					visible: false
					},
				title: {
					text: "Luftfeuchte %"
					}
			},					
			interaction: {
				behaviorType: null,
				selectability: {
					legendSelection: false,
					axisLabelSelection: false,
					mode: "exclusive"
				}
			},
			tooltip: {
				visible: true
			}
		},
		
		onInit: function() {
	
			this.getRouter().getRoute("temperatureDetail").attachPatternMatched(this._onRouteMatched, this);
			this.eventBus.subscribe("sensorDataUpdated", this._sensorDataUpdated, this);			
	
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
			
			this._initVizFrames(sBindingPath);
	
			this._refreshGauges(sBindingPath);

		},
	
		_sensorDataUpdated: function(oEvent) {
		
			var sBindingContext = this.getView().getBindingContext();
			if (sBindingContext) {
				this._refreshGauges(sBindingContext.sPath);
			}
		
		},
	
		_initVizFrames: function(sBindingPath) {
			
			var oProperties = this._vizFrameProperties;
			
			var oTempVizFrame = this.getById("chartContainerVizFrame");	
			oTempVizFrame.setVizProperties(oProperties);			
			this._setVizFrameModel(oTempVizFrame, sBindingPath);
			
			var oPresVizFrame = this.getById("presChartContainerVizFrame");
			oProperties.valueAxis.title.text = "Luftdruck hPa";
			oPresVizFrame.setVizProperties(oProperties);			
			this._setVizFrameModel(oPresVizFrame, sBindingPath);
		
		},
		
		_setVizFrameModel: function(oVizFrame, sBindingPath) {						
			var oSensorModel = this.getModel().getProperty(sBindingPath);
			var oModel = new JSONModel(oSensorModel);
			oVizFrame.setModel(oModel);
		},
		
		afterRenderingTempGauge: function(oEvent) {
		
			//if (oEvent.getParameter("isPreservedDOM")) {
			if($("#tempGauge").length > 0) {
				this.tempHtmlRendered = true; 
			} else {
				return;
			}
			
			var oBindingContext = oEvent.getSource().getBindingContext();
			if (!oBindingContext) {
				return;
			}
		
			if (!this.tempGauge) {
				this._createTempGauge(oBindingContext.sPath);
			}
		
		},
		
		_createTempGauge: function(sBindingPath) {
		
			this.tempGauge = new JustGage({
								id: "tempGauge",
								value: this.getModel().getProperty(sBindingPath + "/currentTemp"),
								min: 0,
								max: 50,							
								levelColors: [
								  "#ff9900",
								  "#70db70",
								  "#ff3300"
								],
								levelColorsGradient: true,
								decimals: 1,
								symbol: "°C",
								pointer: true,
								pointerOptions: {
									  toplength: 8,
									  bottomlength: 20,
									  bottomwidth: 4,
									  color: '#8e8e93'
									},
								gaugeWidthScale: 0.1,
								title: "Aktuelle Temperatur",
								startAnimationTime: 4000,
								startAnimationType: "bounce",
								refreshAnimationTime: 4000,
								refreshAnimationType: "bounce"
							  });
		
			this._setTempGaugeVisibility(sBindingPath);
			
		},
		
		afterRenderingHumGauge: function(oEvent) {
			
			//if (oEvent.getParameter("isPreservedDOM")) {
			if($("#humGauge").length > 0) {
				this.humHtmlRendered = true;
			} else {
				return;
			}
				
			var oBindingContext = oEvent.getSource().getBindingContext();
			if (!oBindingContext) {
				return;
			}
	
			if (!this.humGauge) {
				this._createHumGauge(oBindingContext.sPath);
			}
		
		},
		
		_createHumGauge: function(sBindingPath) {
			
			this.humGauge = new JustGage({
								id: "humGauge",
								value: this.getModel().getProperty(sBindingPath + "/currentHum"),
								percents: true,
								min: 0,
								max: 100,
								levelColors: [
								  "#ff9900",
								  "#70db70",
								  "#ff3300"
								],
								levelColorsGradient: false,
								decimals: 1,
								symbol: "%",
								pointer: true,
								pointerOptions: {
									  toplength: 8,
									  bottomlength: 20,
									  bottomwidth: 4,
									  color: '#8e8e93'
									},
								gaugeWidthScale: 0.1,
								title: "Luftfeuchtigkeit",
								startAnimationTime: 4000,
								startAnimationType: "bounce",
								refreshAnimationTime: 4000,
								refreshAnimationType: "bounce"
							  });
							  
			this._setHumGaugeVisibility(sBindingPath);
		
		},
		
		afterRenderingPresGauge: function(oEvent) {
		
			//if (oEvent.getParameter("isPreservedDOM")) {
			if($("#presGauge").length > 0) {
				this.presHtmlRendered = true; 
			} else {
				return;
			}
			
			var oBindingContext = oEvent.getSource().getBindingContext();
			if (!oBindingContext) {
				return;
			}
		
			if (!this.presGauge) {
				this._createPresGauge(oBindingContext.sPath);
			}
		
		},
		
		_createPresGauge: function(sBindingPath) {
		
			this.presGauge = new JustGage({
								id: "presGauge",
								value: this.getModel().getProperty(sBindingPath + "/currentPres"),
								min: 900,
								max: 1200,							
								levelColors: [
								  "#ff9900",
								  "#70db70",
								  "#ff3300"
								],
								levelColorsGradient: true,
								decimals: 0,
								symbol: "hPa",
								pointer: true,
								pointerOptions: {
									  toplength: 8,
									  bottomlength: 20,
									  bottomwidth: 4,
									  color: '#8e8e93'
									},
								gaugeWidthScale: 0.1,
								title: "Luftdruck",
								startAnimationTime: 4000,
								startAnimationType: "bounce",
								refreshAnimationTime: 4000,
								refreshAnimationType: "bounce"
							  });
		
			this._setPresGaugeVisibility(sBindingPath);
			
		},
		
		_refreshGauges: function(sBindingPath) {
			
			this._refreshTempGauge(sBindingPath);
			this._refreshHumGauge(sBindingPath);
			this._refreshPresGauge(sBindingPath);			
			
		},
		
		_refreshTempGauge: function(sBindingPath) {
		
			if (this.tempHtmlRendered && !this.tempGauge) {
				this._createTempGauge(sBindingPath);
			}
			
			if (this.tempGauge) {
			
				var currentTemp = this.getModel().getProperty(sBindingPath + "/currentTemp");
				this.tempGauge.refresh(currentTemp);
				this._setTempGaugeVisibility(sBindingPath);
				
			}
		
		},
		
		_refreshHumGauge: function(sBindingPath) {
		
			if (this.humHtmlRendered && !this.humGauge) {
				this._createHumGauge(sBindingPath);
			}
			
			if (this.humGauge) {
			
				var currentHum = this.getModel().getProperty(sBindingPath + "/currentHum");
				this.humGauge.refresh(currentHum);
				this._setHumGaugeVisibility(sBindingPath);
			
			}
		
		},
		
		_refreshPresGauge: function(sBindingPath) {
		
			if (this.presHtmlRendered && !this.presGauge) {
				this._createPresGauge(sBindingPath);
			}
			
			if (this.presGauge) {
			
				var currentPres = this.getModel().getProperty(sBindingPath + "/currentPres");
				this.presGauge.refresh(currentPres);
				this._setPresGaugeVisibility(sBindingPath);
				
			}
		
		},
		
		_setTempGaugeVisibility: function(sBindingPath) {
		
			var tempEnabled = this.getModel().getProperty(sBindingPath + "/tempEnabled");
			if (tempEnabled) {
				this.getView().byId("tempGaugeHtmlId").setVisible(true);
				$("#tempGauge").show();
			} else {
				this.getView().byId("tempGaugeHtmlId").setVisible(false);
				$("#tempGauge").hide();
			}
		
		},
		
		_setHumGaugeVisibility: function(sBindingPath) {

			var humEnabled = this.getModel().getProperty(sBindingPath + "/humEnabled");
			if (humEnabled) {
				this.getView().byId("humGaugeHtmlId").setVisible(true);
				$("#humGauge").show();
				this._addHumFeed();
			} else {				
				this.getView().byId("humGaugeHtmlId").setVisible(false);
				$("#humGauge").hide();
				this._removeHumFeed();
			}
		
		},
		
		_setPresGaugeVisibility: function(sBindingPath) {
		
			var presEnabled = this.getModel().getProperty(sBindingPath + "/pressureEnabled");
			if (presEnabled) {
				this.getView().byId("presGaugeHtmlId").setVisible(true);
				$("#presGauge").show();
			} else {
				this.getView().byId("presGaugeHtmlId").setVisible(false);
				$("#presGauge").hide();
			}
		
		},
		
		_addHumFeed: function() {
			
			this._getVizFrame().setVizType("info/dual_line");
			
			var aFeeds = this._getVizFrame().getFeeds();
			for(var i=0; i < aFeeds.length;i++){
				if (aFeeds[i].sId === this.createId("humFeed")) {
					this._getVizFrame().removeFeed(aFeeds[i]);
					aFeeds[i].setValues(["Luftfeuchte"]);
					this._getVizFrame().addFeed(aFeeds[i]);
					return;
				}
			}					
			
		},
		
		_removeHumFeed: function() {
							
			var aFeeds = this._getVizFrame().getFeeds();
			for(var i=0; i < aFeeds.length;i++){
				if (aFeeds[i].sId === this.createId("humFeed")) {
					this._getVizFrame().removeFeed(aFeeds[i]);
					aFeeds[i].setValues([]);
					this._getVizFrame().addFeed(aFeeds[i]);
				}
			}
			
			this._getVizFrame().setVizType("line");
				
		},
		
		_getVizFrame: function() {
		
			return this.getView().byId("chartContainerVizFrame");
		
		}
		
	})
		
});