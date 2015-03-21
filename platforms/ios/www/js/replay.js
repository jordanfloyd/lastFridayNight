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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
		var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000 });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


function onSuccess(position) {
	
//	document.getElementById('packagemap').style.width = screen.width;
//	document.getElementById('packagemap').style.height = screen.height;
	var coords = [position.coords.latitude , position.coords.longitude ];
	L.mapbox.accessToken = 'pk.eyJ1IjoibWFqaWQiLCJhIjoiUC1RNmlDRSJ9.8hveF1kmFd6XeR0S5wokDA';
	var packageMap = L.mapbox.map('packagemap', 'majid.lh61h6f6').setView(coords, 18);
	
	var marker = L.marker(coords, {
	  icon: L.icon({
		iconUrl: 'https://www.mapbox.com/maki/renders/embassy-24@2x.png',
		iconSize: [24, 24],
	  })
	}).addTo(packageMap);
	
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
