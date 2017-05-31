class Map {
  constructor(id) {
    this.id = id,
    this.map = null,
    this.infoWindow = null,
    this.markers = [],
    this.options = {
      zoom: 4,
      center: new google.maps.LatLng(53.598048, 9.931692),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    this.addMarker = this.addMarker.bind(this)
    this.closeWindows = this.closeWindows.bind(this)
    this.showCoordinates = this.showCoordinates.bind(this)
  }

  init() {
    console.log(document.getElementById(this.id))
    this.map = new google.maps.Map(document.getElementById(this.id), this.options)
    google.maps.event.addListener(this.map, 'click', this.showCoordinates.bind(this))
  }

  closeWindows() {
    if (this.infoWindow)
      this.infoWindow.close();
    if (this.circle)
      this.circle.setVisible(false);
  }

  showCoordinates(event) {
    this.closeWindows()
    this.infoWindow = new google.maps.InfoWindow({
      position: event.latLng,
      content: "<b>Position</b>:<br> " + event.latLng.toString().replace(/[)() ]/g,"") + ",1000"
    })
    this.circle = new google.maps.Circle({
      map: this.map,
      radius: 1000000,
      fillColor: '#AA0000',
      center: event.latLng
    })
    google.maps.event.addListener(this.infoWindow, 'closeclick', this.closeWindows.bind(this))
    this.infoWindow.open(this.map)
  }

  addMarker(title, tweet, lat, lng) {
    var markerOptions = {
      position : new google.maps.LatLng(lat, lng),
      map : this.map,
      title : title,
      animation : google.maps.Animation.DROP
    }
		//Check that marker is not yet added
    if ($.inArray(JSON.stringify(arguments), this.markers) == -1) {
      this.markers.push(JSON.stringify(arguments));
      var marker = new google.maps.Marker(markerOptions);
      marker.info = new google.maps.InfoWindow({
        content : '<div style="min-width: 200px;"><b>Movie:</b> '
        + title + "<br>" + '<b>User:</b> ' + tweet.user
        + "<br>" + '<b>Tweet:</b> ' + tweet.text + "</div>"
      })
      google.maps.event.addListener(marker, 'click', () => {
        this.closeWindows();
        this.infoWindow = marker.info;
        this.infoWindow.open(this.map, marker);
      })
    }
  }

}

export default new Map('map')
