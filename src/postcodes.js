'use strict';

var postcodeData = {};

// place to hold result data
postcodeData.PATH_P = '';
postcodeData.PATH_MOT = '';
postcodeData.ERR_MSG = 'Postcode Not Found';
postcodeData.ERR_LOAD = 'Error loading mot stations data';
postcodeData.coords = null;
postcodeData.stations = null;

/**
* Constructor creates a new pair of coordinates
* this.east and this.north
*/
function Coordinates(easting, northing) {
  this.east = easting;
  this.north = northing;
}

/**
 * Calculates the distance between 2 pairs of coordinates
 * returns distance in miles
 */
function getDistance(coord1, coord2) {
  var diffE = coord1.east - coord2.east;
  var diffN = coord1.north - coord2.north;
  
  var distKm = (diffE**2 + diffN**2) ** 0.5;
  var distanceMiles = distKm / 1000 / 1.6;
  
  return distanceMiles;
}

/**
 * Helper function to do ajax request of data
 * On success do the success callback otherwise do the failure callback
 * 
 * Success callback is passed a single parameter holding the request object
 * Failure callback not passed any parameters
 */
function ajaxFetch(url, success, failure) {
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.send();
  
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      if (req.status == 200) {
        success(req);
      }
      else {
        failure();
      }
    }
  };

  return null;
}

/**
* Get the coordinates of the postcode by fetching relevant json file
* json file has the 1st letter part of the postcode
* eg. EC2M 5BB -> ec.json
* 
* Always returns null, action initiated by callback passed as parameter
*/
function getCoordinates(txt, callback) {
  // any letter 1 or 2 times at beginning of string
  var regex = /^[a-z]{1,2}/
  var prefix = txt.trim().toLowerCase().match(regex);

  if (prefix === null) {
    postcodeData.coords = postcodeData.ERR_MSG;
    callback();
    return null;
  }

  var url = postcodeData.PATH_P + prefix + '.json';
  
  var onFailure = function() {
    postcodeData.coords = postcodeData.ERR_MSG;
    callback();
  }

  var onSuccess = function(req) {
    var postcodeLoc = req.response;
    var query = txt.trim().toUpperCase();

    if (!(query in postcodeLoc)) {
      onFailure();
      return null;
    }

    var coords = postcodeLoc[query];
    postcodeData.coords = new Coordinates(coords[0], coords[1]);
    callback();
  }

  ajaxFetch(url, onSuccess, onFailure);
  return null;
}

/**
 * Loads list of MOT stations
 * Then calculates distance from postcode. 
 * 
 * Always returns null, action initiated by callback passed as parameter
 */
function getMotStations(coords, callback) {
  var url = postcodeData.PATH_MOT;

  var onFailure = function() {
    postcodeData.stations = postcodeData.ERR_LOAD;
    callback();
  }

  var onSuccess = function(req) {
    var stations = req.response;
    var length = stations.length;
    // get distance info
    for (var i=0; i < length; i++) {
      let s = stations[i];
      let stationCoords = new Coordinates(s.Easting, s.Northing);
      s.Distance = getDistance(postcodeData.coords, stationCoords);
    }

    // sort by distance
    var compareDist = function (stn1, stn2) {
      return stn1.Distance - stn2.Distance;
    };

    stations.sort(compareDist);
    postcodeData.stations = stations;
    callback();
  }

  ajaxFetch(url, onSuccess, onFailure);
  return null;
}
