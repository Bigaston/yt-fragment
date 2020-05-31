require("dotenv").config()

const express = require('express')
const bodyParser = require('body-parser');
const m = require("./modules")

m.utils.flush()
setInterval(m.utils.flush, 1000 * 60 * 15);

m.generation.restart_generation();
m.generation.init_new_generation();

var app = express()

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.use("/static", express.static('./web/static'));

app.get("/" + process.env.ADDR_PREFIX, m.main_crtl.index)
app.post("/" + process.env.ADDR_PREFIX + "/add", m.main_crtl.add)
app.get("/" + process.env.ADDR_PREFIX + "/dl", m.main_crtl.dl_page)
app.get("/" + process.env.ADDR_PREFIX + "/dl/:id", m.main_crtl.dl_video)

app.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`))