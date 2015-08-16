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

		if(Math.abs(currentLightLevel - lightVal) > 10) {

			if(currentLightLevel > 1020) {
				mood = "jazz";
			}
			else if (currentLightLevel > 900 && currentLightLevel < 1019) {
				mood = "tbt";
			}
			else {
				mood = "happy";
			}

			fetch("http://192.168.3.163:3000/mood/"+mood)
				.then(function(res) { return res.json(); })
				.then(function(json){ resolveJSON(json); });

			currentLightLevel = lightVal;
		}

	});	
});
function resolveJSON (json) {
	console.log(json.mood);
}

