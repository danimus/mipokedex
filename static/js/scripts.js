function printMap(locations, lat, long) {

    var styles = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];

    var mapProp = {
        center: new google.maps.LatLng(lat, long),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styles
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    var infowindow = new google.maps.InfoWindow();

    var marker, i;


    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
            text: 'Test',
            icon: "/static/img/pokemon/" + locations[i].pokemon_data.pokemon_id + ".png",
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i].pokemon_name);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

}


function success(position) {

    lat = position.coords.latitude;
    long = position.coords.longitude;

    $.get(location.protocol + "//" + location.host + "/api/" + lat + "/" + long, function(data) {

        var json = $.parseJSON(data);
        printMap(json, lat, long);

    });


}

function initialize() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
    } else {
        error('Geo Location is not supported');
    }


}

function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyByk399DfLeIwm1y64P-hMlYhUkC9avX88&callback=initialize";
    document.body.appendChild(script);
}