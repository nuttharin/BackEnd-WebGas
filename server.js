



const http = require('http') ;
const app = require('./app') ;

const port = process.env.PORT || 8081 ;
const server = http.createServer(app) ;


server.listen(port , function(){
    console.log('Starting node.js on port ' + port) ;
})