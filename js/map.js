function initMap() {
    //map options
    var options = {
      zoom: 16,
      center: {lat: 42.343852, lng:-71.066320},
      mapTypeId: 'roadmap'
    }
    //initialize new map
    var map= new
    google.maps.Map(document.getElementById('map'), options);

    //location marker variable
    var marker = new google.maps.Marker({
      position:{lat: 42.343852, lng:-71.066320},
      map:map
    });
    //parking marker varible
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
      parking: {
        name: 'Parking',
        icon: iconBase + 'parking_lot_maps.png'
      },


    };

    var features = [
      {
        position: new google.maps.LatLng(42.344364, -71.066222),
        type: 'parking'
      }, {
        position: new google.maps.LatLng(42.342569, -71.066198),
        type: 'parking'
      }, {
        position: new google.maps.LatLng(42.342110, -71.065045),
        type: 'parking'
      }
    ];

    // Create markers.
    features.forEach(function (feature) {
      var marker = new google.maps.Marker({
        position: feature.position,
        icon: icons[feature.type].icon,
        map: map
      });
    });

    var legend = document.getElementById('legend');
    for (var key in icons) {
      var type = icons[key];
      var name = type.name;
      var icon = type.icon;
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + icon + '"> ' + name;
      legend.appendChild(div);
    }

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  }