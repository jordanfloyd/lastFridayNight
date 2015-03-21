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
 
 
var startTime = null;
var endTime = null;
var packageMap = null;
 
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
			var sd = $("start-date").val();
			var st = $("start-time").val();
			var ed = $("end-date").val();
			var et = $("end-time").val();
			
			if (!sd || !st || !ed || !et)
				return;
				
			startTime = sd + ' ' + st;	
			endTime = ed + ' ' + et;
			var db = window.openDatabase("lnr", "1.0", "LNR DB", 1000000);
			db.transaction(populateDB, errorCB, successCB);
		});
		
	}

};

function goToMap()
{
	if (packageMap)
		packageMap.remove();
	//$.mobile.loading( 'show', { theme: "b", text: "foo", textonly: true } );
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000 });
	//alert("SDFSD");
}

function populateDB(tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS times (types CHARACTER(20), dt DATETIME)');
	tx.executeSql("INSERT INTO times (types, dt) VALUES ('start', '" + startTime + "')");
	tx.executeSql("INSERT INTO times (types, dt) VALUES ('start', '" + endTime + "')");
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    alert("success!");
}

function onSuccess(position) {
	var coords = [position.coords.latitude , position.coords.longitude ];
	L.mapbox.accessToken = 'pk.eyJ1IjoibWFqaWQiLCJhIjoiUC1RNmlDRSJ9.8hveF1kmFd6XeR0S5wokDA';
	

		packageMap = L.mapbox.map('packagemap', 'majid.lh61h6f6').setView(coords, 18);

	
	var marker = L.marker(coords, {
	  icon: L.icon({
		iconUrl: 'http://www.markjmueller.com/wp-content/uploads/2015/03/logo.png',
		iconSize: [36, 36],
	  })
	}).addTo(packageMap);
	
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
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
