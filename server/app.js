const express = require('express');
//const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
//const io = require('socket.io')(server);

const courierRoutes = require('./routes/courier.routes')
const routeRoutes = require('./routes/route.routes')
const statusRoutes = require('./routes/status.routes')

//app.use(cors());

app.use('/api/courier', courierRoutes)
app.use('/api/route', routeRoutes)
app.use('/api/status', statusRoutes)

module.exports = {app, server};
