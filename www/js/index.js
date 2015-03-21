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
 
var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
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
    },

};

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
