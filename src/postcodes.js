var postcodeLib = function postcode() {
  var public = {};
  
  public.getPrefix = getPrefix;
  public.coordinates = coordinates;
  public.parseCoordinates = parseCoordinates;
  
  /**
  * Helper method to get the 1st 2 characters of the postcode
  */
  function getPrefix(txt) {
    return txt.trim().substring(0, 2).toLowerCase();
  }
  
  /**
  * Constructor creates a new pair of coordinates
  * this.east and this.north
  */
  function coordinates(easting, northing) {
    this.east = easting;
    this.north = northing;
  }
  
  /**
  * Get the coordinates of the postcode by parsing text
  * text is formatted as a space separated file
  * the offsets are:  0          10       20
  * the data is:      XXXX XXX   123456   123456
  */
  function parseCoordinates(txt) {
    out = new coordinates(0, 0);
    return out;
  }
  
  return public;
}();
