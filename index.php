<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>YC Zone Map App</title>

    <link href='containerPlus/css/mb.containerPlus.css' rel='stylesheet' type='text/css'>
    <style type="text/css">
        html, body, #map-canvas {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        #map-canvas div:first-child div:first-child div:first-child div:first-child div:first-child div:first-child div:first-child img {
            opacity: 0.5;
        }

        .labels {
            color: red;
            background-color: white;
            text-align: center;
            white-space: nowrap;
            font-size: 8px !important;
        }

        .mbc_container > .mbc_header h2 {
            padding: 0;
        }

        .mbc_title {
            height: 30px;
        }

        .mbc_container > .mbc_content {
            overflow: hidden !important;
        }

        #appControls {
             top: 25;
             left: 88px;
             width: 280px;
             opacity: 0.8;
        }

        #chart1 {
             top: 126px;
             left: 1095px;
             opacity: 0.8;
             width: 625px;
             height: 493px;
        }

        #myform {
            visibility: hidden;
            display: none;
        }
        
        input[type="range"] {
            -webkit-appearance: none !important;
            background-color: silver;    
            height: 15px;
            width: 135px;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            background-color: #080861;    
            opacity: 0.5;
            height: 15px;
            width: 10px;
        }
        
        /*legend styles*/
        #legend {
            background: #FFF;
            padding: 5px;
            margin: 5px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            border: 1px solid black;
            width: 90px;
            height: 125px;
        }
        #legend h4:first-child {
            margin: 0px;
        }
        .color {
            border: 1px solid;
            height: 12px;
            width: 12px;
            margin-right: 3px;
            float: left;
        }
        .red {
            background: #ff9900;
        }
        .yellow {
            background: #ffff00;
        }
        .green {
            background: #00ffff;
        }
        .blue {
            background: #0000ff;
        }
    </style>

    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=visualization"></script>
    <script src="markerwithlabel.js"></script>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.js"></script>
    <script type="text/javascript" src="containerPlus/inc/jquery.mb.containerPlus.js"></script>
    <script type="text/javascript" src="containerPlus/inc/mb.containerPlus.plugins.js"></script>

    <script type="text/javascript" src="zones.js"></script>
    <script type="text/javascript" src="mymap.js"></script>
  </head>
  <body>
    <div id="map-canvas"></div>
    <div id="appControls" class="container" data-centeronwindow=true data-icon="containerPlus/css/icons/browser.png"
    data-drag=true data-resize=true data-dock="dock" data-collapsable=true data-containment="document" data-buttons="dock,fullscreen" data-rememberme="true">
      <h2>Controls</h2>
      <table>
        <tr><td><label><input onclick="toggleLabels()" type="checkbox" id="labelsButton" value="labels" checked />Labels</label></td></tr>
        <tr><td><select onchange="fillOutline(this.value)" id="fillOutlineSelect" value="layers" disabled="true" /><option value="Fill">Fill</option><option value="Outline">Outline</option><option value="None">None</option></select></td></tr>
        <tr><td><label><input onchange="heatmap(this)" type="checkbox" id="fusioncb" />Fusion Heatmap</label></td></tr>
        <tr><td><label><input onchange="apiheatmap(this)" type="checkbox" id="heatmapcb" />Maps API Heatmap</label></td></tr>
        <tr><td><label><input onchange="zoneHeatmap(this)" type="checkbox" id="fusionHeatcb" />Zone Heatmap</label></td></tr>
        <tr><td><form id="myform"><label>Zone:</label><br /><select id="zoneSelect"></select></form></td></tr>
        <tr><td><label>Opacity of Layers</label></td></tr>
        <tr><td><input onchange="layerOpacity(this.value / 100)" type="range" id="slide" min="1" max="100" value="50"/></td></tr>
      </table>
    </div>
    <div id="chart1" class="container" data-centeronwindow=true data-icon="containerPlus/css/icons/chart.png" data-drag=true data-resize=true
    data-dock="dock" data-collapsable=true data-containment="document" data-buttons="dock,fullscreen" data-rememberme=false>
        <h2>Chart</h2>
        <div id="visualization"></div>
    </div>
  </body>
</html>