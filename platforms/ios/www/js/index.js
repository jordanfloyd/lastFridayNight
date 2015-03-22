/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 
var packageMap = null;
var records = [];
var currentRecord = 0;
var displayRecordsInterval = null;

var db = null;
var lat = null;
var _long = null;
var currentTime = null;

var collectPositionInterval = null;
 
var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
		$(document).on( "pagecontainerbeforeshow", function( event, ui ) {
			resizeContentPanel();
			if (ui.toPage[0].id == "two")
				goToMap();
		});
	
		$("#start-button").click(function(){
			$("#start-panel").hide();
			initDB();
			db.transaction(createDB, errorCB, successCB);
			collectPosition();
			collectPositionInterval = window.setInterval(collectPosition, 5000);
			$("#stop-panel").show();
		});
		
		$("#stop-button").click(function(){
			$("#stop-panel").hide();
			clearInterval(collectPositionInterval);
			$("#start-panel").show();
		});
		
	}

};

function goToMap()
{
	if (packageMap)
		packageMap.remove();
		
	initDB();
	db.transaction(readFromDB, errorCB, successCB);
}

function readFromDB(tx){
	tx.executeSql('SELECT * FROM locations; ', [], readRecords, errorCB);
}

function readRecords(tx, results){
    var len = results.rows.length;
	records= [];
    console.log("DEMO table: " + len + " rows found.");
    for (var i=0; i<len; i++){
		records.push({
			lat: results.rows.item(i).lat,
			lon: results.rows.item(i).lon,
			time: results.rows.item(i).current_time
		});	
    }
	
	if(records.length == 0)
		return;	
	
	L.mapbox.accessToken = 'pk.eyJ1IjoibWFqaWQiLCJhIjoiUC1RNmlDRSJ9.8hveF1kmFd6XeR0S5wokDA';
	packageMap = L.mapbox.map('packagemap', 'majid.lh61h6f6');
	currentRecord = 0;
	displayRecordsInterval = window.setInterval(updateMap, 3000);
}

function updateMap() {	
	if (currentRecord == records.length){
		clearInterval(displayRecordsInterval);
		return;
	}		
	
	packageMap.setView([records[currentRecord].lat, records[currentRecord].lon], 18);
	
	var marker = L.marker([records[currentRecord].lat, records[currentRecord].lon], {
	  icon: L.icon({
		iconUrl: 'http://www.markjmueller.com/wp-content/uploads/2015/03/logo.png',
		iconSize: [36, 36],
	  })
	}).addTo(packageMap);
	
	currentRecord++;
}

function errorCB(err) {
    console.log("Error processing SQL: "+err.code);
}

function successCB() {
    console.log("success!");
}

// onError Callback receives a PositionError object
//
function onError(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function resizeContentPanel(){
	var screen = $.mobile.getScreenHeight(),
		header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
		footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
		contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
		content = screen - header - footer - contentCurrent;
	$(".ui-content").height(content);
}

function initDB() {
	if (db) return
	db = window.openDatabase("lnr", "1.0", "LNR DB", 1000000);
}

function collectPosition() {
	initDB();
	navigator.geolocation.getCurrentPosition(writePosition, onError, { timeout: 30000 });
}

function createDB(tx){
	tx.executeSql('DROP TABLE IF EXISTS locations;');
	tx.executeSql('CREATE TABLE IF NOT EXISTS locations (lat REAL, lon REAL, current_time DATETIME);');
}

function writePosition(position) {
	lat = position.coords.latitude, 
	_long = position.coords.longitude; 
	var time = new Date();
	currentTime = new moment().format("YYYY-MM-DD HH:mm:ss");
	db.transaction(writePositionToDB, successCB, errorCB);
}

function writePositionToDB(tx) {
	tx.executeSql("INSERT INTO locations (lat, lon, current_time) VALUES (" + lat + ", " + _long + ", '" + currentTime + "' )");
}
