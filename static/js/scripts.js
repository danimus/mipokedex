function printMap(locations, lat, long) {

    var mapProp = {
        center: new google.maps.LatLng(lat, long),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
            text: 'Test',
            icon: "https://ugc.pokevision.com/images/pokemon/" + locations[i].pokemon_data.pokemon_id + ".png",
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