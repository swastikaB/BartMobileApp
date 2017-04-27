
var Client = require('node-rest-client').Client;
var express = require('express');
var fs = require('fs');
/*
*   Global variables
*/
var app = express();
var client = new Client();
var stationNameList = " ";
var htmlString = "";

/*
*   start server
*/
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("BART app listening at http://%s:%s", host, port)
})
/* ******************************************************************************************* */

/*
* Handle requests for /stations -- Gets a list of BART stations using BART API as JSON 
*/
app.get('/stations', function (req, res) {
  /*
  *   get BART API xml data for station Names
  */
  client.get("http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V", function (data, response) {
    var stations = data.root.stations[0].station;
    /* var len = stations.length; 
        for (var i = 0; i < len; i++) {
        stationNameList += ("\n" + stations[i].name[0]);
        }
    console.log(stationNameList);
    */
    //console.log("All staions have been listed");
    //res.send(JSON.stringify(stations));
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(stations);

  });
});
/* ******************************************************************************************* */

/*
* Handle requests for /station -- Gives Information about supplied Station 
*/
app.get('/station', function (req, res) {
  const query = req.query; 
  const stationAbbr = query.source; 
  //console.log(query.source);
  /*
  *   get BART API xml data for station Names
  */
  const url = "http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=" + stationAbbr
  + "&key=MW9S-E7SL-26DU-VV8V";
  client.get(url, function (data, response) {
    var stations = data.root.stations[0].station;
    //console.log(stations);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(stations);
  });
});
/* ******************************************************************************************* */

/*
* Handle requests for /trips -- Gives a detailed list of information for trains between supplied Source and Destination
*/
app.get('/trips', function (req, res) {
  const query = req.query; 
  const sourceAbbr = query.source;
  const destAbbr = query.dest;
  /*
  *   get BART API xml data for station Names
  */
  const url = "http://api.bart.gov/api/sched.aspx?cmd=depart&orig=" + sourceAbbr
  + "&dest=" + destAbbr + "&time=now&date=now&key=MW9S-E7SL-26DU-VV8V&b=1&a=4&l=1";
  
  client.get(url, function (data, response) {
    //check if source and destination are same else send error message
    if (sourceAbbr === destAbbr) {
      var tripInfo = data;
    } else {
      var tripInfo = data.root.schedule[0].request[0];
    }
    //console.log(tripInfo);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(tripInfo);
  });
});
/* ******************************************************************************************* */


/*
* Handle requests for homepage 
*/
app.get('/', function (req, res) {
    fs.readFile('index.html', 'utf8', function(err, text){
          res.send(text);
    });
});

app.get('/*.js', function (req, res) {
    fs.readFile(req.path.substring(1), 'utf8', function(err, text){
      res.setHeader("content-type", "text/javascript; charset=UTF-8")
          res.send(text);
    });
});

app.get('/*.css', function (req, res) {
  fs.readFile(req.path.substring(1), 'utf8', function(err, text){
    res.setHeader("content-type", "text/css; charset=UTF-8");
        res.send(text);
  });
});

/*response.writeHead(200,{"Content-type" : "text/css"});
  var fileContents = fs.readFileSync('./views/styles.css', {encoding: "utf8"}, function(err, data) {
    if (!err) {
      response.write(data);
    } else {
      console.log(err);
    }
    });*/