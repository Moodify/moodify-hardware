var five = require("johnny-five"),
	board, photoresistor;
var fetch = require('node-fetch');

board = new five.Board();

board.on("ready", function () {
	var led = new five.Led(11);

	photoresistor = new five.Sensor({
		pin: "A2", 
		freq: 250,
		threshold: 5
	});

	board.repl.inject({
		pot: photoresistor
	});

	var currentLightLevel = 1000000;
	var mood;

	photoresistor.on("data", function(){

		var lightVal = this.value;
		console.log(lightVal);

		if(Math.abs(currentLightLevel - lightVal) > 40) {

			if(currentLightLevel < 250) {
				mood = "happy";
			}
			else if(currentLightLevel > 250 && currentLightLevel < 500) {
				mood = "tbt";
			}
			else if(currentLightLevel > 501) {
				mood = "jazz";
			}
			else {
				mood = "ganster";
			}

			console.log(mood);

			fetch("http://10.0.0.27:3000/mood/"+mood)
				.then(function(res) { return res.json(); })
				.then(function(json){ resolveJSON(json); });

			currentLightLevel = lightVal;
		}

	});	
});
function resolveJSON (json) {
	console.log(json.mood);
}

