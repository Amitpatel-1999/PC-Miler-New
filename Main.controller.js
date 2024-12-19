sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/unified/Menu",
    "sap/ui/unified/MenuItem",
    "sap/ui/core/Fragment"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Device, Menu, MenuItem, Fragment) {
        "use strict";
        var flag = true;
        var searchHelp = [];
        var dataFromAPI = {};
        var initialPosition = "";

        return Controller.extend("ymsli.com.zfitddistanceduration.controller.Main", {

            onInit: function () {

                var data = {

                    "KeyVal": 1,
                    "DataVersion": "Current",
                    "RouteType": "0",
                    "HighwayOnly": "",
                    "OverrideClass": "1",
                    "AvoidTolls": "X",
                    "OpenBorders": "",
                    "OverrideRestriction": "",
                    "DetailRoute": "X",
                    "LinkGeoPositionSet": [],

                    "RouteOptionSet": [

                    ],

                    "DescriptionSet": [

                    ],

                    "TabDataSet": []


                };

              
                var that = this;
                var defaultModel = this.getOwnerComponent().getModel();
                var url2 = "/CountryCodeSet";
                defaultModel.read(url2, {
                    success: function (oData) {
                        // searchHelp = oData2.results;
                        var oSearchHelp = that.getOwnerComponent().getModel("searchHelp");
                        console.log("Data Country", oData);
                        oSearchHelp.setSizeLimit(300);
                        oSearchHelp.setData(oData.results);
                        console.log("oSearchHelp", oSearchHelp);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });

                var model = new sap.ui.model.json.JSONModel();
                model.setData(data);

                this.getView().setModel(model);

                this.getView().byId('table0').bindRows("/TabDataSet");


                var oGeoMap = this.getView().byId("geoMap");

                var oMapConfig = {

                    "MapProvider": [{

                        "name": "HEREMAPS",

                        "type": "",

                        "description": "",

                        "tileX": "256",

                        "tileY": "256",

                        "maxLOD": "20",

                        "copyright": "Tiles Courtesy of HERE Maps",

                        "Source": [{

                            "id": "s1",

                            "url": "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?apiKey=hc4DRZpfqJbhJ_F36yUexH3jaUuVNClKSPXl36-3OFU"

                        }, {

                            "id": "s2",

                            "url": "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?apiKey=hc4DRZpfqJbhJ_F36yUexH3jaUuVNClKSPXl36-3OFU"

                        }, {

                            "id": "s3",

                            "url": "https://3.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?apiKey=hc4DRZpfqJbhJ_F36yUexH3jaUuVNClKSPXl36-3OFU"

                        }, {

                            "id": "s4",

                            "url": "https://4.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?apiKey=hc4DRZpfqJbhJ_F36yUexH3jaUuVNClKSPXl36-3OFU"

                        }

                        ]

                    }],

                    "MapLayerStacks": [{

                        "name": "DEFAULT",

                        "MapLayer": {

                            "name": "layer1",

                            "refMapProvider": "HEREMAPS",

                            "opacity": "1.0",

                            "colBkgnd": "RGB(255,255,255)"

                        }

                    }]

                };

                oGeoMap.setMapConfiguration(oMapConfig);

                oGeoMap.setRefMapLayerStack("DEFAULT");

            },



            onPressAdd: function () {
                var model = this.getView().getModel();
                var currentRows = model.getProperty("/TabDataSet");
                var newRows = currentRows.concat(this.createEntry());
                model.setProperty("/TabDataSet", newRows);
                model.refresh(true);
            },

            createEntry: function () {
                return {};
            },

            onPressDelete: function () {
                var oTable = this.getView().byId('table0');
                var selectedIndices = oTable.getSelectedIndices();
                var model = this.getView().getModel();
                var data = model.getData();
                selectedIndices.forEach((index) => {
                    data.TabDataSet.splice(index, 1);
                });
                model.setData(data);
            },

            onPressMoveDown: function () {
                var oTable = this.getView().byId('table0');
                var selectedIndices = oTable.getSelectedIndices();
                var oModel = this.getView().getModel();
                var data = oModel.oData;
                var index = selectedIndices[0];

                if (index < data.TabDataSet.length - 1) {
                    [data.TabDataSet[index], data.TabDataSet[index + 1]] = [data.TabDataSet[index + 1], data.TabDataSet[index]];
                };

                oModel.setData(data);
                oModel.refresh(true);
            },

            onPressMoveUp: function () {
                var oTable = this.getView().byId('table0');
                var selectedIndices = oTable.getSelectedIndices();
                var oModel = this.getView().getModel();
                var data = oModel.oData;
                var index = selectedIndices[0];

                if (index > 0) {
                    [data.TabDataSet[index - 1], data.TabDataSet[index]] = [data.TabDataSet[index], data.TabDataSet[index - 1]];
                };

                oModel.setData(data);
                oModel.refresh(true);
            },



            onPressRouteOption: function () {
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "ymsli.com.zfitddistanceduration.view.Dialog0"
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },

            onCloseDialog: function () {
                this.byId("dialog0").close();
                var routeOptions = this.getSelectedData();
                console.log(routeOptions);

                var model = this.getView().getModel();
                var data = model.getData();
                console.log("route option Data Before", data);
                data.AvoidTolls = routeOptions.AvoidTolls;
                data.DataVersion = routeOptions.DataVersion;
                data.RouteType = routeOptions.RouteType;
                data.HighwayOnly = routeOptions.HighwayOnly;
                data.OverrideClass = routeOptions.OverrideClass;
                data.OpenBorders = routeOptions.OpenBorders;
                data.OverrideRestriction = routeOptions.OverrideRestriction;
                data.DetailRoute = routeOptions.DetailRoute;
                console.log("route option Data After", data);

                model.setData(data);
                model.refresh(true);
                console.log(model);
            },



            onRestore: function () {
                this.byId("rbg1").setSelectedIndex(0);
                this.byId("rbg2").setSelectedIndex(0);
                this.byId("cb0").setSelected(false);
                this.byId("cb1").setSelected(true);
                this.byId("cb2").setSelected(false);
                this.byId("cb3").setSelected(false);
                this.byId("cb4").setSelected(true);
                this.byId("sel0").setSelectedKey("Current");
            },



            onPressExecute: function () {
                this.executeAPI();
               
            },

            executeAPI: function () {
                var oModel = this.getOwnerComponent().getModel();
                var url = "/PcMilerDataSet";
                var model = this.getView().getModel();
                var data = model.getData();
                console.log("data from model", data);
                var tabData = data.TabDataSet;
                console.log("tab data", tabData);
                var zipArr = [];
                var cityArr = [];
                var countryArr = [];
                var stateArr = [];

                for (var i = 0; i < tabData.length; i++) {
                    zipArr.push(tabData[i].Zip);
                    cityArr.push(tabData[i].City);
                    countryArr.push(tabData[i].Country);
                    stateArr.push(tabData[i].State);
                }

                console.log("zip array", zipArr);
                console.log("City Array", cityArr);

                data.TabDataSet.length = 0;

                for (var i = 0; i < zipArr.length; i++) {
                    data.TabDataSet.push({
                        Zip: zipArr[i],
                        City: cityArr[i],
                        Country: countryArr[i],
                        State: stateArr[i]
                    });
                }

                console.log("final data", data);

                var that = this;
                oModel.create(url, data, {
                    success: function (oData) {
                        that.setDataToTable(oData);
                        console.log("response data", oData);
                        dataFromAPI = oData;
                    },
                    error: function (err) {
                        console.log("error", err);
                    }
                });
            },

            setDataToTable: function (dataFromService) {
                var oGeoMap = this.getView().byId("geoMap");
                var tableData = dataFromService.TabDataSet.results;
                var tableModel = this.getView().getModel();
                var currentData = tableModel.getData();
                var filteredData = tableData.filter(function (item) {
                    return tableData.some(function (tableItem) {
                        return tableItem.City === item.City || tableItem.Zip === item.Zip || tableItem.Country === item.Country || tableItem.State === item.State;
                    });
                });
                currentData.TabDataSet = filteredData;
                var oModel = new sap.ui.model.json.JSONModel();
                var pathArr = [
                    {
                        position: "",
                        labelText: ""
                    }
                ];
                var markerLocations = [
                    {
                        position: "",
                        tooltip: "",
                        key: ""
                    }
                ];

                pathArr = [];
                markerLocations = [];

                oModel.setProperty("/pathArr", pathArr);
                oModel.setProperty("/markerLocations", markerLocations);
                oGeoMap.setModel(oModel, "routeModel");
                oGeoMap.rerender();

                var location = dataFromService.TabDataSet.results;
                var stringPath = dataFromService.RouteOptionSet.results;
                var descriptionSet = dataFromService.DescriptionSet.results;
                console.log("description", descriptionSet);
                var counter = 0;
                for (var i = 0; i < stringPath.length; i++) {
                    var tempString = location[i].City;
                    var tempString = tempString.concat(" To ");
                    var tempString = tempString.concat(location[i + 1].City);
                    console.log(descriptionSet[i+counter].Value);
                    var stringWithoutSpaces = descriptionSet[i+counter].Value.split(' ').join('');
                    var tooltipText = tempString + "\n" + stringWithoutSpaces + "\nStage: " + descriptionSet[i+counter+1].Value + "\nDistance: " + descriptionSet[i+counter+2].Value + "\nDuration: " + descriptionSet[i+counter+3].Value;
                    counter += 3;
                    pathArr.push({
                        position: stringPath[i].RoutePath,
                        labelText: tempString,
                        tooltip: tooltipText
                    });
                }

                console.log(location);
                for (var i = 0; i < location.length; i++) {
                    var tempString = location[i].Longitude;
                    var tempString = tempString.concat(";");
                    var tempString = tempString.concat(location[i].Latitude);
                    var tempString = tempString.concat(";0");
                    markerLocations.push({
                        position: tempString,
                        tooltip: location[i].City,
                        key: i
                    });
                };

                oModel.setProperty("/pathArr", pathArr);
                oModel.setProperty("/markerLocations", markerLocations);
                oGeoMap.rerender();
                oGeoMap.setModel(oModel, "routeModel");
                oModel.setProperty("/pathArr", pathArr);
                oModel.setProperty("/markerLocations", markerLocations);
                console.log("locations",markerLocations);
                oGeoMap.setModel(oModel, "routeModel");
                oGeoMap.rerender();
                tableModel.setData(currentData);
                var oTable = this.getView().byId('table0');
                oTable.setModel(tableModel, "tableModel");
                tableModel.refresh(true);
                this.zoomOnRoute();
            },



            getSelectedData: function (selectedData) {
                var selectedData = {
                    RouteType: this.getSelectedRadioButtonText("rbg1"),
                    OverrideClass: this.getSelectedRadioButtonText("rbg2"),
                    HighwayOnly: this.getCheckBoxSelected("cb0"),
                    AvoidTolls: this.getCheckBoxSelected("cb1"),
                    OpenBorders: this.getCheckBoxSelected("cb2"),
                    OverrideRestriction: this.getCheckBoxSelected("cb3"),
                    DataVersion: this.getSelectedDataVersion("sel0"),
                    DetailRoute: this.getCheckBoxSelected("cb4")
                };
                return selectedData;
            },

            getSelectedRadioButtonText: function (radioButtonGroupId) {
                var radioButtonGroup = this.byId(radioButtonGroupId);
                var selectedButton = radioButtonGroup.getSelectedButton();
                var text = selectedButton.getText();

                if (text === "Practical" || text === "None") {
                    return '0';
                } else if (text === "Shortest" || text === "Fifty Three Foot") {
                    return '1';
                } else if (text === "Fastest" || text === "National Network") {
                    return '2';
                } else return '3';
            },



            getCheckBoxSelected: function (checkboxId) {
                var checkBox = this.byId(checkboxId);
                if (checkBox.getSelected()) {
                    return 'X';
                } else {
                    return '';
                }
            },

            getSelectedDataVersion: function (selectControlId) {
                var selectControl = this.byId(selectControlId);
                var selectedItem = selectControl.getSelectedItem();
                return selectedItem.getKey();
            },

            onOpenDetail: function (evt) {
                var key = evt.oSource.mDTWindowCxt.key;
                var tableModel = this.getView().getModel();
                var data = tableModel.getData();
                var street = data.TabDataSet[key].Street;
                var city = data.TabDataSet[key].City;
                var state = data.TabDataSet[key].State;
                var zip = data.TabDataSet[key].Zip;
                var distance = data.TabDataSet[key].Distance;
                var duration = data.TabDataSet[key].Duration;
                var content = document.getElementById(evt.getParameter("contentarea").id);
                content.innerHTML = 'Street: ' + street + '<br>' + 'City: ' + city + '<br>' + 'State: ' + state + '<br>' + 'Zip: ' + zip + '<br>' + 'Distance: ' + distance + '<br>' + 'Duration: ' + duration;
            },

            onCloseDetail: function (evt) {

            },

            onClickSpot: function (evt) {
                var location = "Location: " + evt.oSource.mAggregations.tooltip;
                evt.getSource().openDetailWindow(location, "0", "0");
            },

            onSuggest: function (oEvent) {
                var sValue = oEvent.getParameter("input5");
                var oFilter = new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.Contains, sValue); // Replace "YourField" with the field you want to filter
                var oBinding = oEvent.getSource().getBinding("suggestionItems");
                oBinding.filter([oFilter]);
            },
            zoomOnRoute: function (){
                var tempModel = this.getView().getModel();
                var tempArr = tempModel.oData.TabDataSet;
                initialPosition = tempArr[0].Latitude + ";" + tempArr[0].Longitude + ";" + "0";
                tempModel.setProperty("/initialPosition",initialPosition);
                console.log(initialPosition);
            }
        });
    });