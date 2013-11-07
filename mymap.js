var map, kmlLayer, labels, windowwidth, opt, zoneSelect, layer, heatmap, zoneMonth, apiHeatMonths, selectedMonth, wrapper, asdf, circularHeatMonths, circularChart,
  zone = 'All',
  labelsArray = [],
  matches = [];

function initialize() {
  var myLatLng = new google.maps.LatLng(26.133070810163336, - 80.25464710424808);
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
    url: 'https://googledrive.com/host/0B2e_pVm37PcgMXZpWXJIaFFia1k',
    preserveViewport: true,
    suppressInfoWindows: true,
    map: map
  });
  google.maps.event.addListener(kmlLayer, 'status_changed', function() {
    if (kmlLayer.getStatus() == google.maps.KmlLayerStatus.OK) {
      document.getElementById('fillOutlineSelect').disabled = false;
    }
    else {
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
  
  $.get("https://googledrive.com/host/" + circularHeatMonths['April'], function() {
    // circular heat chart
  	circularChart = circularHeatChart()
      .segmentHeight(30)
      .innerRadius(20)
      .numSegments(24)
      .range(["white","red"])
      .radialLabels(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
      .segmentLabels(["Midnight", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "Midday", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"]);
      
    d3.select('#circularChart')
  		.selectAll('svg')
  		.data([circularHeatData])
  		.enter()
  		.append('svg')
  		.call(circularChart);
  });
  
  google.maps.event.addDomListener(document.getElementById('zoneSelect'), 'change', function() {
    zone = this.value;
    updateLayerQuery(layer, zone, zoneMonth);
    drawVisualization(zone);
  });
  google.maps.event.addDomListener(document.getElementById('zoneHeatMonthSelect'), 'change', function() {
    zoneMonth = this.value;
    updateLayerQuery(layer, zone, zoneMonth);
    drawVisualization(zone);
  });
  google.maps.event.addDomListener(document.getElementById("heatMonthSelect"), "change", function() {
    heatmap.setMap(null);
    heatMapData = [];
    apiHeatMap();
  });
}

function drawVisualization(zone) {
  var where = "";
  if (zone !== "All") {
    where = "WHERE Zone = '" + zone + "'";
    wrapper = new google.visualization.ChartWrapper({
      'containerId': 'visualization',
      'dataSourceUrl': 'http://www.google.com/fusiontables/gvizdata?tq=',
      'query': "SELECT MonthNum, Month, Trips, Avg AS 'Total Avg' " + "FROM 17RDkRPbCd_I3YHXGYqzDceHsVQoGQAGmeBnvLms " + where + " ORDER BY MonthNum",
      'chartType': 'ComboChart',
      'options': {
        'title': zone,
        'height': 400,
        'width': 600,
        'seriesType': 'bars',
        'hAxis': {
          'slantedText': true
        },
        'series': {
          1: {
            'type': 'line'
          }
        }
      },
      view : {
        columns: [1,2,3]
      }
    });
  }
  else {
    wrapper = new google.visualization.ChartWrapper({
      containerId: "visualization",
      dataSourceUrl: "http://www.google.com/fusiontables/gvizdata?tq=",
      query: "SELECT Month, MonthNum, SUM(Trips) AS 'Total Trips'" + "FROM 17RDkRPbCd_I3YHXGYqzDceHsVQoGQAGmeBnvLms GROUP BY Month, MonthNum ORDER BY MonthNum",
      chartType: "ColumnChart",
      options: {
        title: zone,
        height: 400,
        width: 600,
        hAxis: {
          slantedText: true
        }
      },
      view: {
        columns: [0,2]
      }
    });
  }
  wrapper.draw();
  // google.visualization.events.addListener(wrapper, 'select', function() {
  //   console.log("click event on chart");
  //   asdf = wrapper.getChart().getSelection()[0].row; // or wrapper.Bh.J[0].c[1].v // to get actual values from chart
  //   console.log(asdf);
  // });
}

function toggleLabels() {
  var x = 0;
  if (labels.visible) {
    for (; x < labelsArray.length; x++) {
      labelsArray[x].setVisible(false);
    }
  }
  else {
    for (; x < labelsArray.length; x++) {
      labelsArray[x].setVisible(true);
    }
  }
}

function fillOutline(selection) {
  if (selection == "Fill") {
    kmlLayer.setUrl('https://googledrive.com/host/0B2e_pVm37PcgMXZpWXJIaFFia1k');
  }
  else if (selection == "Outline") {
    kmlLayer.setUrl('https://googledrive.com/host/0B2e_pVm37PcgVEhSSmlwUDNrYkE');
  }
  else {
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

// function heatmap(check) {
//   if (check.checked) {
//     fusionheat = new google.maps.FusionTablesLayer({
//       query: {
//         select: 'Longitude, Latitude',
//         from: '1jrdXYdZguTfpCD3inJfzvbfnFM-xpOZwY6V3toQ'
//       },
//       heatmap: {
//         enabled: false
//       }
//     });
//     fusionheat.setMap(map);
//   }
//   else {
//     fusionheat.setMap(null);
//   }
// }
apiHeatMonths = {
  'April': '0B2e_pVm37PcgSE1HdF84S0cyZ0E',
  'May': '0B2e_pVm37Pcgb0NkZjZyU2tlc1k',
  'June': '0B2e_pVm37PcgemdFYzdZaEdmS1U',
  'July': '0B2e_pVm37PcgSkx3NlZ6OTI0bkk',
  'August': '0B2e_pVm37PcgMWsxTkh0MXkyZ2s',
  'September': '0B2e_pVm37PcgbEp0T3psSERFems',
  'October': '0B2e_pVm37PcgM2RqWmhQQUtiMGs'
};

circularHeatMonths = {
  'April': '0B2e_pVm37PcgWWFfSnlNNVRqLTg',
  'May': '0B2e_pVm37PcgM2pSa1ZnN1hWOWc',
  'June': '0B2e_pVm37PcgSGNKT29rTjdGdTg',
  'July': '0B2e_pVm37Pcga1RQRFpzRTRsb2M',
  'August': '0B2e_pVm37PcgMUwwbGtiTXF5OFE',
  'September': '0B2e_pVm37PcgYzBnUmlSb0hkZzg',
  'October': '0B2e_pVm37PcgeGU3MUxxZ29zcGM'
};

function apiHeatMap(check) {
  if ($("#heatmapcb").is(":checked")) {
    $('#heatMonthSelect').css({
      'visibility': 'visible',
      'display': 'inline'
    });
    selectedMonth = $("#heatMonthSelect").val();
    $.get("https://googledrive.com/host/" + apiHeatMonths[selectedMonth], function() {
      heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
      });
      heatmap.setMap(map);
    });
    $.get("https://googledrive.com/host/" + circularHeatMonths[selectedMonth], function() {
      // circular heat chart
      d3.select('#circularChart')
    		.selectAll('svg')
    		.remove();
    		
  	  d3.select('#circularChart')
    		.selectAll('svg')
    		.data([circularHeatData])
    		.enter()
    		.append('svg')
    		.call(circularChart);
    });
  } else {
    heatmap.setMap(null);
    $('#heatMonthSelect').css({
      'visibility': 'hidden',
      'display': 'none'
    });
  }
}

function zoneHeatmap(check) {
  zoneMonth = $("#zoneHeatMonthSelect").val();
  console.log("zoneMonth: " + zoneMonth);
  toggleLegend(map);
  if (check.checked) {
    $('#myform').css({
      'visibility': 'visible',
      'display': 'block'
    });
    $('#zoneHeatMonthSelect').css({
      'visibility': 'visible',
      'display': 'inline'
    });
    layer = new google.maps.FusionTablesLayer();
    updateLayerQuery(layer, zone, zoneMonth);
    layer.setMap(map);
    return false;
  }
  $('#myform').css({
    'visibility': 'hidden',
    'display': 'none'
  });
  $('#zoneHeatMonthSelect').css({
    'visibility': 'hidden',
    'display': 'none'
  });
  layer.setMap(null);
}

function updateLayerQuery(layer, zone, zoneMonth) {
  var where;
  if (zone !== 'All') {
    where = "Zone = '" + zone + "' and Month = '" + zoneMonth + "'";
  }
  else {
    where = "Month = '" + zoneMonth + "'";
  }
  console.log("where: " + where);
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
  console.log(layer);
  google.maps.event.addListener(layer, 'click', function(e) {
    e.infoWindowHtml = e.row['Zone'].value + "<br>" + e.row['Month'].value + ": " + e.row['Trips'].value;
    drawVisualization(e.row['Zone'].value);
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
  content.push('<p><div class="color red"></div>1 to 399</p>');
  content.push('<p><div class="color yellow"></div>400 to 799</p>');
  content.push('<p><div class="color green"></div>800 to 1,119</p>');
  content.push('<p><div class="color blue"></div>1,200+</p>');
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