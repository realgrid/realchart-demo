import http from "http";
import express from "express";
import path from "path";
import reload from "reload";

const app = express();
const root = path.resolve();

app.set('port', 6010);
app.set('reload', 6011);

app.use('/', express.static(root + "/web/"));
app.use('/images/', express.static(root + "/web/realchart/asset/image/"));

app.get('/', function (req, res) {
    res.sendFile(path.join(root, '/index.html'));
});

var server = http.createServer(app);

reload(app, { port: app.get('reload') }).then(function (reloadReturned) {
    server.listen(app.get('port'), function () {
        console.log("RealChart v1.0 Test Server Running on port " + app.get('port'));
    });
}).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
})

  
