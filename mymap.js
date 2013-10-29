var map, kmlLayer, labels, fusionheat, windowwidth, opt, zoneSelect, layer, heatmap
    zone = 'All',
    labelsArray = [],
    matches = [];

google.load('visualization', '1', { packages: ['corechart'] });

function initialize() {
    var myLatLng = new google.maps.LatLng(26.133070810163336, -80.25464710424808);
      
    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 12,
        center: myLatLng,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        }
    };    

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
    kmlLayer = new google.maps.KmlLayer({
        url: 'https://c9.io/hurricandeditka16/gmaps/workspace/tempFill.kml',
        preserveViewport: true,
        map: map
      });
    
    google.maps.event.addListener(kmlLayer, 'status_changed', function() {
        if (kmlLayer.getStatus() == google.maps.KmlLayerStatus.OK) {
            document.getElementById('fillOutlineSelect').disabled = false;
        } else {
            console.log("error: kml status = " + kmlLayer.getStatus());
        }
    });
   
    // zones, zonesLat and zonesLon are from zones.js that contains the kml polygon info in arrays
    var len = zones.length;
    zoneSelect = document.getElementById('zoneSelect');
    for (var i = 0; i < len; i++) {
        labels = new MarkerWithLabel({
            position: new google.maps.LatLng(zonesLat[i], zonesLon[i]),
            draggable: true,
            raiseOnDrag: true,
            map: map,
            labelContent: zones[i],
            labelClass: 'labels',
            labelAnchor: new google.maps.Point(50, 0),
            icon: {}
        });
        
        labelsArray.push(labels);
        
        // fill zone select dropdown with zones
        opt = document.createElement('option');
        opt.innerHTML = zones[i];
        opt.value = zones[i];
        zoneSelect.appendChild(opt);
        
        // google.maps.event.addListener(labels, 'dragend', function (e) {
        //     console.log(e.target.innerHTML + " , " + e.latLng.toUrlValue()); 
        // });
    }
    opt.value = zone;
    opt.innerHTML = zone;
    zoneSelect.options.add(opt, 0);
    zoneSelect.options.selectedIndex = 133;
    
    styleMap(map);
    $(".container").containerize();
    drawVisualization(zone);
    
    google.maps.event.addDomListener(document.getElementById('zoneSelect'), 'change', function() {
        zone = this.value;
        updateLayerQuery(layer, zone);
        drawVisualization(zone);
    });
}

function drawVisualization(zone) {
    var where = "";
    if (zone !== "All") {
        where = "WHERE Zone = '" + zone + "'";
        google.visualization.drawChart({
            containerId: "visualization",
            dataSourceUrl: "http://www.google.com/fusiontables/gvizdata?tq=",
            query: "SELECT Month, Trips, Avg as 'Total Avg' " + "FROM 1FApavNb2YPK1TtEtkrD3zyNvX--ZEB6YtGX2kN8 " + where,
            chartType: "ComboChart",
            options: {
                title: zone,
                height: 400,
                width: 600,
                seriesType: "bars",
                hAxis: {slantedText: true},
                series: {1: {type: "line"}} 
            }
        });
    } else {
        google.visualization.drawChart({
            containerId: "visualization",
            dataSourceUrl: "http://www.google.com/fusiontables/gvizdata?tq=",
            query: "SELECT Month, SUM(Trips) AS 'Total Trips'" + "FROM 1FApavNb2YPK1TtEtkrD3zyNvX--ZEB6YtGX2kN8 GROUP BY Month",
            chartType: "ColumnChart",
            options: {
                title: zone,
                height: 400,
                width: 600,
                hAxis: {slantedText: true}
            }
        });
    }
}

function toggleLabels() {
    var x = 0;
    if (labels.visible) {
        for (; x < labelsArray.length; x++) {
            labelsArray[x].setVisible(false);
        }
    } else {
        for (; x < labelsArray.length; x++) {
            labelsArray[x].setVisible(true);
        }
    }
}

function fillOutline(selection) {
    if (selection == "Fill") {
        kmlLayer.setUrl('https://c9.io/hurricandeditka16/gmaps/workspace/tempFill.kml');
    } else if (selection == "Outline") {
        kmlLayer.setUrl('https://c9.io/hurricandeditka16/gmaps/workspace/tempOutline.kml');
    } else {
        kmlLayer.setUrl(null);
    }
}

function layerOpacity(slideAmount) {
    matches = document.querySelectorAll('#map-canvas div:first-child div:first-child div:first-child div:first-child div:first-child div:first-child div:first-child img');
    var len = matches.length;
    for (var i = 0; i < len; i++) {
        matches[i].style.opacity = slideAmount;    
       // matches[i].style.filter = 'alpha(opacity=' + slideAmount + ')';
    }
    
}

function styleMap(map) {
    var style = [{
        featureType: "all",
        stylers: [{
            saturation: 0
        }]
    }, {
        featureType: "poi",
        stylers: [{
            visibility: "on"
        }]
    }, {
        featureType: "road",
        stylers: [{
            visibility: "on"
        }]
    }];
    var styledMapType = new google.maps.StyledMapType(style, {
        map: map,
        name: "Styled Map"
    });
    map.mapTypes.set("map-style", styledMapType);
    map.setMapTypeId("map-style");
}

function heatmap(check) {
    if (check.checked) {
        fusionheat = new google.maps.FusionTablesLayer({
            query: {
                select: 'Longitude, Latitude',
                from: '1jrdXYdZguTfpCD3inJfzvbfnFM-xpOZwY6V3toQ'
            },
            heatmap: {
                enabled: false
            }
        });
        fusionheat.setMap(map);
    }
    else {
        fusionheat.setMap(null);
    }
}

function apiheatmap(check) {
    if (check.checked) {
        $.get("https://googledrive.com/host/0B2e_pVm37PcgSE1HdF84S0cyZ0E", function() {
            heatmap = new google.maps.visualization.HeatmapLayer({ 
                    data: heatMapData,
            });
            heatmap.setMap(map);
        });
    } else {
        heatmap.setMap(null);
    }
}

function zoneHeatmap(check) {
    toggleLegend(map);
    if (check.checked) {
        $('#myform').css({
            'visibility' : 'visible',
            'display' : 'block'
        });
        layer = new google.maps.FusionTablesLayer();
        updateLayerQuery(layer, zone);
        layer.setMap(map);
        return false;
    } 
    $('#myform').css({
        'visibility' : 'hidden',
        'display' : 'none'
    });
    layer.setMap(null);
}

function updateLayerQuery(layer, zone) {
    var where;
    if (zone !== 'All') {
        where = "Zone = '" + zone + "'";
    }

    layer.setOptions({
        query: {
            select: 'geometry',
            from: '1JJEnn7gwPEwRyNimgjI77LZ5VUYzWAJYJdech6c',
            where: where
        },
        styles: [{
           polygonOptions: {
               fillOpacity: 0.8
           } 
        }],
        styleId: 2
    });
}

function toggleLegend(map) {
    var legendCheck = document.getElementById('legend');
    if (legendCheck) {
        legendCheck.parentNode.removeChild(legendCheck);
        return false;
    } 
    var legend = document.createElement('div');
    legend.id = 'legend';
    var content = [];
    content.push('<h4>Trips</h4>');
    content.push('<p><div class="color red"></div>2 to 200</p>');
    content.push('<p><div class="color yellow"></div>101 to 200</p>');
    content.push('<p><div class="color green"></div>201 to 300</p>');
    content.push('<p><div class="color blue"></div>301 to 2,065</p>');
    legend.innerHTML = content.join('');
    legend.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}

$(window).resize(function() {
    windowwidth = $(window).width();
    windowwidth = windowwidth - 50;
    $(".containerIcon").css({
        left: windowwidth
    });
});

google.maps.event.addDomListener(window, 'load', initialize);
