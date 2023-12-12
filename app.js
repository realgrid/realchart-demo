import http from "http";
import express from "express";
import path from "path";
import reload from "reload";
import cors from 'cors';
import fs from 'fs';

const app = express();
const root = path.resolve();

app.set('port', 6010);
app.set('reload', 6011);

app.use(cors({
    origin: '*'
  }));
app.use('/', express.static(root + "/web/"));
app.use('/images/', express.static(root + "/web/realchart/asset/image/"));

app.get('/', function (req, res) {
    // res.sendFile(path.join(root, '/index.html'));
    res.render('index.html')
});

app.get('/realchart/:sub', function(req, res) {
    const files = fs.readdirSync(`web/realchart/${req.params.sub}`);
    const htmlFiles = files.filter(fname => fname.endsWith('.html'));
    const alinks =  htmlFiles.map(fname => {
        return `<li><a href="./${fname}">${fname}</a></li>`
    }).join('\n');
    res.send(`<ul>
    ${alinks}
    </ul>`);
});

var server = http.createServer(app);

reload(app, { port: app.get('reload') }).then(function (reloadReturned) {
    const port = app.get('port');
    server.listen(port, function () {
        console.log(`RealChart v1.0 Test Server Running on http://localhost:${port}`);
    });
}).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
})

  
