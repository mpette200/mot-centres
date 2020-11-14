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
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.send();
  
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      if (req.status == 200) {
        
        var postcodeLoc = req.response;
        var query = txt.trim().toUpperCase();
        var coords = postcodeLoc[query];

        postcodeData.coords = new Coordinates(coords[0], coords[1]);
        callback();
      }
      else {
        postcodeData.coords = postcodeData.ERR_MSG;
        callback();
      }
    }
  };

  return null;
}

/**
 * Loads list of MOT stations
 * 
 * Always returns null, action initiated by callback passed as parameter
 */
function getMotStations(coords, callback) {
  var url = postcodeData.PATH_MOT;
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.send();
  
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      if (req.status == 200) {
        postcodeData.stations = req.response;
        callback();
      }
      else {
        postcodeData.stations = postcodeData.ERR_LOAD;
        callback();
      }
    }
  };

  return null;
}