const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser');
var Cylon = require('cylon');





// GPIO 4
Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },
  devices: {
    light: { driver: 'direct-pin', pin: 7 }
  },
  work: function(my){

    var lightStatus;

    my.light.digitalRead(function(err, status){
      lightStatus = status;
    });

    app.use('/*', function(req, res , next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      next();
    })

    app.use(bodyParser.json());

    app.get('/', (request, response) => {
      response.send('Hello from Express!')
    })

    app.get('/status', (request, response) => {

      var dataResponse;
      if(lightStatus == 1) {
        console.log('Status: Light is on!');
        dataResponse = {status: true};
      } else {
		console.log('Status: Light is off!');
        dataResponse = {status: false};
      }

      response.send(dataResponse);
    })

    app.post('/light', (request, response) => {
      var newState = request.body.newState;

      if(newState) {
        console.log('Turning on lights...');
        //my.light.turnOn();
        my.light.digitalWrite(1);
        console.log('Lights are turned on!');
      }else {
        console.log('Turning off lights...');
        //my.light.turnOff();
        my.light.digitalWrite(0);
        console.log('Lights are turned off!');
      }

      response.send({status: newState});
	});

    app.listen(port, (err) => {
      if (err) {
        return console.log('something bad happened', err)
      }

      console.log('server is listening on ${port}')
    })
  }
}).start();


