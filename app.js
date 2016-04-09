const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.use(express.static(__dirname + "/"));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

const server = http.createServer(app);

server.listen(port);

app.get('/', function(req, res) {
    res.render('index.html');
});


var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});

var CLIENTS = [];

wss.on('connection', function(ws) {

    CLIENTS.push(ws);

    console.log(CLIENTS.length);
    showData('connections',CLIENTS.length);

    ws.on('close',function(){
        CLIENTS.splice(CLIENTS.indexOf(ws), 1);
        console.log(CLIENTS.length);
        showData('connections',CLIENTS.length);
    });

    ws.on('error',function(){
        CLIENTS.splice(CLIENTS.indexOf(ws), 1);
        console.log(CLIENTS.length);
        showData('connections',CLIENTS.length);
    });
  
});


var showData = function(type,data) {

    var object = {
        type:type,
        data: data,
    }

    var object = JSON.stringify(object);

    for(var i =0;i<CLIENTS.length;i++)
    {
        CLIENTS[i].send(object);
    }

}



// Routes

const giphy = require('giphy-api')();

app.post('/gif', function(req, res) {

    giphy.search(req.body.query, function(error, gifs) {

        if(typeof gifs.data != 'undefined' && gifs.data.length>0 && !error)
        {

            console.log(gifs);

            var gif = gifs.data[0].images.fixed_height.url;

            showData('gif',gif);

            res.send({success:true, data:gif});
        }
        else
        {
            res.sendStatus(404);
        }

    });

});