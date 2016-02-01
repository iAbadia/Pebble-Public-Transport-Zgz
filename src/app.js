var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var settings = require('settings');

// RECENTS
if(settings.data('tramRecents') === undefined){
	settings.data('tramRecents',[]);
}
if(settings.data('busRecents') === undefined){
	settings.data('busRecents', []);
}
function addToRecents(key, _new){
	var recents = settings.data(key);
	function alreadyIn(e, _new){
		var result = false;
		for(var i=0;i<e.length && !result;i++){
			if(e[i].id == _new.id){
				result = true;
			}
		}
		return result;
	}
	if(!alreadyIn(recents, _new)){
		if(recents.length == 10){
			// Remove last
			recents.pop();
		}
		recents.unshift(_new);
		settings.data(key, recents);
	}
}

// TRAM
var tramStopsList = [
  {title: 'Avda. Academia',          type: 0, subtitle: 'Hacia Mago de Oz',  	id:101},
  {title: 'Parque Goya',             type: 1, id1:201, id2:202, 			 	id:200},
  {title: 'Juslibol',                type: 1, id1:301, id2:302, 			 	id:300},
  {title: 'Campus Rio Ebro',         type: 1, id1:401, id2:402, 			 	id:400},
  {title: 'Garcia Abril',            type: 0, subtitle: 'Hacia Avda. Academia', id:502},
  {title: 'Margarita Xirgu',         type: 0, subtitle: 'Hacia Mago de Oz',     id:501},
  {title: 'Adolfo Aznar',            type: 0, subtitle: 'Hacia Avda. Academia', id:602},
  {title: 'Legaz Lacambra',          type: 0, subtitle: 'Hacia Mago de Oz',     id:601},
  {title: 'Pablo Neruda',            type: 0, subtitle: 'Hacia Avda. Academia', id:702},
  {title: 'Clara Campoamor',         type: 0, subtitle: 'Hacia Mago de Oz',     id:701},
  {title: 'Leon Felipe',             type: 0, subtitle: 'Hacia Avda. Academia', id:802},
  {title: 'Rosalia de Castro',       type: 0, subtitle: 'Hacia Mago de Oz',     id:801},
  {title: 'Maria Montesori',         type: 0, subtitle: 'Hacia Avda. Academia', id:902},
  {title: 'Martinez Soria',          type: 0, subtitle: 'Hacia Mago de Oz',     id:901},
  {title: 'La Chimenea',             type: 1, id1:1001, id2:1002, 				id:1000},
  {title: 'Plz. Pilar/Murallas',     type: 1, id1:1101, id2:1102, 			 	id:1100},
  {title: 'Cesar Augusto',           type: 1, id1:1201, id2:1202, 			 	id:1200},
  {title: 'Plaza España',            type: 1, id1:1301, id2:1302, 			 	id:1300},
  {title: 'Plaza Aragón',            type: 1, id1:1311, id2:1312, 			 	id:1310},
  {title: 'Gran Via',                type: 1, id1:1401, id2:1402, 			 	id:1400},
  {title: 'Fernando Católico',       type: 1, id1:1501, id2:1502, 			 	id:1500},
  {title: 'Plz. San Fracisco',     	 type: 1, id1:1601, id2:1602, 			 	id:1600},
  {title: 'Emp. Carlos V',           type: 1, id1:1701, id2:1702, 			 	id:1700},
  {title: 'Romareda',                type: 1, id1:1801, id2:1802, 			 	id:1800},
  {title: 'Casablanca',              type: 1, id1:1901, id2:1902, 			 	id:1900},
  {title: 'Argualas',                type: 1, id1:2001, id2:2002, 			 	id:2000},
  {title: 'Los Olvidados',           type: 1, id1:2101, id2:2102, 			 	id:2100},
  {title: 'Ventana Indiscreta',      type: 0, subtitle: 'Hacia Avda. Academia', id:2322},
  {title: 'Los Pájaros',             type: 0, subtitle: 'Hacia Mago de Oz',     id:2301},
  {title: 'Americano París',         type: 0, subtitle: 'Hacia Avda. Academia', id:2422},
  {title: 'Bajo la Lluvia',          type: 0, subtitle: 'Hacia Mago de Oz',     id:2401},
  {title: 'Mago de Oz',              type: 0, subtitle: 'Hacia Avda. Academia', id:2502},
  {title: 'Mago de Oz',              type: 0, subtitle: 'Hacia fin de linea',   id:2501},
];
function requestTram(e){
	// Add to recents
		addToRecents('tramRecents', e.item);
		var URL = 'http://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/tranvia/';
		// Show progress card
		var card = new UI.Card({
			fullscreen: true,
			title: e.item.title,
			subtitle: 'Fetching...'
		});
		card.show();
		if (e.item.type == '0') {
			// Single stop
			URL += e.item.id + '.json';
			ajax({
					url: URL,
					type: 'json'
				},
				function(data) {
					// Success!
					console.log('Successfully fetched tram data!');
					console.log(data);
					// Build times string
					var tramTimes = '';
					if(data.destinos !== undefined){
						for (var i = 0; i < data.destinos.length; i++) {
							tramTimes += data.destinos[i].minutos + 'min. ';
						}
						var tramMenu = new UI.Menu({
							fullscreen: true,
							sections: [{
								title: 'L1',
								items: [{
									title: tramTimes
								}]
							}]
						});
						tramMenu.show();
					}else{
						var errorCard = new UI.Card({
							title: 'Error fetching',
							body: 'Server is not providing info for this stop at the moment'
						});
						errorCard.show();
					}
					card.hide();
				},
				function(error) {
					// Failure!
					console.log('Failed fetching tram data: ' + error);
					var errorCard = new UI.Card({
						title: 'Error fetching',
						body: "Couldn't complete the request, server not responding"
					});
					errorCard.show();
					card.hide();
				}
			);
		} else {
			// Dual stop
			var URL2 = [URL + e.item.id1 + '.json', URL + e.item.id2 + '.json'];
			var done = 0;
			var times = ['', ''];
			var iterationFetch = function(i) {
				console.log("Fetching " + URL2[i]);
				ajax({
						url: URL2[i],
						type: 'json',
					},
					function(data) {
						// Success!
						console.log('Successfully fetched tram data!');
						console.log(data);
						// Build times string
						var tramTimes = '';
						for (var j = 0; j < data.destinos.length; j++) {
							tramTimes += data.destinos[j].minutos + 'min. ';
						}
						times[i] = tramTimes;
						done++;
					},
					function(error) {
						// Failure!
						console.log('Failed fetching tram data: ' + error);
					}
				);
			};
			for (var i = 0; i < 2; i++) {
				iterationFetch(i);
			}
			var buildTramMenu = function() {
				if (done < 2) {
					setTimeout(buildTramMenu, 50);
					return;
				}
				var tramMenu = new UI.Menu({
					fullscreen: true,
					sections: [{
						title: 'L1 → Mago de Oz',
						items: [{
							title: times[0]
						}]
					}, {
						title: 'L1 → Avda. Academia',
						items: [{
							title: times[1]
						}]
					}]
				});
				tramMenu.show();
				card.hide();
			};
			setTimeout(buildTramMenu, 50);
			// TO-DO: Fetch twice, construct card and show
		}
}
function tram() {
	var tramMenu = new UI.Menu({
		fullscreen: true,
		sections: [{
			title: 'Tram stops',
			items: [{
				title: 'Stops list',
				subtitle: 'Choose from full list'
			}]
		}, {
			title: 'Recents',
			// TO-DO: Add recents
			items: settings.data('tramRecents')
		}]
	});
	tramMenu.on('select', function(e) {
		if (e.sectionIndex === 0) {
			// Stops list selected
			tramList();
		} else {
			// One of the recents selected
			requestTram(e);
		}
	});
	tramMenu.show();
}
function tramList() {
	var tramListMenu = new UI.Menu({
		fullscreen: true,
		sections: [{
			title: 'Tram stops list',
			items: tramStopsList
		}]
	});
	tramListMenu.on('select', function(e) {
		requestTram(e);
	});
	tramListMenu.show();
}

// BUS
function requestBus(postN){
		// Add to recents
		addToRecents('busRecents', {title: 'Post ' + postN, id: postN});
		var URL = 'http://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/transporte-urbano/poste/';
		// Show progress card
		var card = new UI.Card({
			title: 'Post ' + postN,
			subtitle: 'Fetching...'
		});
		card.show();
		URL += 'tuzsa-' + parseInt(postN) + '.json';
		ajax({
				url: URL,
				type: 'json'
			},
			function(data) {
				// Success!
				console.log('Successfully fetched bus data!');
				console.log(data);
				// Build times string
				var busTimesArray = ['', ''];
				for (var i = 0; i < data.destinos.length; i++) {
					var first = data.destinos[i].primero.split(" ");
					var sec = data.destinos[i].segundo.split(" ");
					busTimesArray[i] = {
						title: 'Linea ' + data.destinos[i].linea,
						items: [{
							title: first[0] + first[1].substr(0, 3) + ' ' + sec[0] + sec[1].substr(0, 3)
						}]
					};
				}
				new UI.Menu({
					fullscreen: true,
					sections: busTimesArray
				}).show();
				card.hide();
			},
			function(error) {
				// Failure!
				console.log('Failed fetching bus data: ' + error);
				var errorCard = new UI.Card({
					title: 'Error fetching',
					body: 'Either server is not responding or post ' + postN + ' doesn\'t exist'
				});
				errorCard.show();
				card.hide();
			}
		);
}
function mod(n, m) {
        return ((n % m) + m) % m;
}
function T3K() {
	// For accesing the Object from inside its methods
	var t3k = this;
	// Change keyboard options
	var changeKeys = function(up, mid, down) {
		t3k.UI.bUp.text.remove();
		t3k.UI.bMid.text.remove();
		t3k.UI.bDown.text.remove();
		t3k.UI.bUp.text.text(up);
		t3k.UI.bMid.text.text(mid);
		t3k.UI.bDown.text.text(down);
		console.log(up.length);
		if (up.length == 1) {
			t3k.UI.bUp.text.position(new Vector2(119, 5));
		} else {
			t3k.UI.bUp.text.position(new Vector2(119, -5));
		}
		if (mid.length < 4) {
			t3k.UI.bMid.text.position(new Vector2(119, 64));
		} else {
			t3k.UI.bMid.text.position(new Vector2(119, 54));
		}
		if (down.length == 1) {
			t3k.UI.bDown.text.position(new Vector2(119, 123));
		} else {
			t3k.UI.bDown.text.position(new Vector2(119, 113));
		}
		t3k.UI.window.add(t3k.UI.bUp.text);
		t3k.UI.window.add(t3k.UI.bMid.text);
		t3k.UI.window.add(t3k.UI.bDown.text);
	};
	// Set value for target
	var setValue = function(number) {
		var index = t3k.UI.values[t3k.target].index();
		t3k.UI.values[t3k.target].remove();
		t3k.UI.values[t3k.target].text(number);
		t3k.UI.window.insert(index, t3k.UI.values[t3k.target]);
	};
	// UI elements
	this.UI = {
		window: new UI.Window({
			backgroundColor: 'white',
			fullscreen: true
		}), // Window
		bUp: {
			button: new UI.Rect({
				size: new Vector2(30, 50),
				position: new Vector2(114, 0),
				backgroundColor: 'black'
			}),
			text: new UI.Text({
				text: '<',
				font: 'gothic-24-bold',
				textAlign: 'center',
				color: 'white',
				position: new Vector2(119, 5),
				size: new Vector2(25, 25)
			})
		},
		bMid: {
			button: new UI.Rect({
				size: new Vector2(30, 50),
				position: new Vector2(114, 59),
				backgroundColor: 'black'
			}),
			text: new UI.Text({
				text: '+',
				font: 'gothic-24-bold',
				textAlign: 'center',
				color: 'white',
				position: new Vector2(119, 64),
				size: new Vector2(25, 25)
			})
		},
		bDown: {
			button: new UI.Rect({
				size: new Vector2(30, 50),
				position: new Vector2(114, 118),
				backgroundColor: 'black'
			}),
			text: new UI.Text({
				text: '>',
				font: 'gothic-24-bold',
				textAlign: 'center',
				color: 'white',
				position: new Vector2(119, 123),
				size: new Vector2(25, 25)
			})
		},
		values: [
			new UI.Text({
				text: '0',
				font: 'bitham-42-bold',
				textAlign: 'center',
				color: 'black',
				position: new Vector2(1, 54),
				size: new Vector2(30, 28)
			}),
			new UI.Text({
				text: '0',
				font: 'bitham-42-light',
				textAlign: 'center',
				color: 'black',
				position: new Vector2(29, 54),
				size: new Vector2(30, 28)
			}),
			new UI.Text({
				text: '0',
				font: 'bitham-42-light',
				textAlign: 'center',
				color: 'black',
				position: new Vector2(56, 54),
				size: new Vector2(30, 28)
			}),
			new UI.Text({
				text: '0',
				font: 'bitham-42-light',
				textAlign: 'center',
				color: 'black',
				position: new Vector2(83, 54),
				size: new Vector2(30, 28)
			})
		]
	};
	// Current machine state
	this.state = 0;
	// Targeted value
	this.target = 0;
	this.keyUp = function() {
		function mod(n, m) {
			return ((n % m) + m) % m;
		}
		switch (t3k.state) {
			case 0: // Move target left
				t3k.UI.values[t3k.target].remove();
				t3k.UI.values[t3k.target].font('bitham-42-light');
				t3k.UI.window.add(t3k.UI.values[t3k.target]);
				t3k.target = mod(t3k.target - 1, 4);
				t3k.UI.values[t3k.target].remove();
				t3k.UI.values[t3k.target].font('bitham-42-bold');
				t3k.UI.window.add(t3k.UI.values[t3k.target]);
				break;
			case 1: // 0 1 2
				changeKeys('0', '1', '2');
				t3k.state = 2;
				break;
			case 2: // Place 0
				changeKeys('<', '+', '>');
				setValue('0');
				t3k.state = 0;
				break;
			case 3: // Place 3
				changeKeys('<', '+', '>');
				setValue('3');
				t3k.state = 0;
				break;
			case 4: // Place 7
				changeKeys('<', '+', '>');
				setValue('7');
				t3k.state = 0;
				break;
			case 5: // Place 4
				changeKeys('<', '+', '>');
				setValue('4');
				t3k.state = 0;
				break;
			case 6: // End state
				console.log('Pitfall!');
				break;
			default:
				// Dead code
				console.log('Something went wrong, defUp');
		}
	};
	this.keyMid = function() {
		switch (t3k.state) {
			case 0: // Show numbers
				changeKeys('0 1\n2', '3 4\n5 6', '7 8\n9');
				t3k.state = 1;
				break;
			case 1: // 3 4 5 6
				changeKeys('3', '4 5', '6');
				t3k.state = 3;
				break;
			case 2: // Place 1
				changeKeys('<', '+', '>');
				setValue('1');
				t3k.state = 0;
				break;
			case 3: // 4 5
				changeKeys('4', '', '5');
				t3k.state = 5;
				break;
			case 4: // Place 8
				changeKeys('<', '+', '>');
				setValue('8');
				t3k.state = 0;
				break;
			case 5: // Nothing
				break;
			case 6: // End state
				console.log('Pitfall!');
				break;
			default:
				// Dead code
				console.log('Something went wrong, defMid');
		}
	};
	this.keyDown = function() {
		switch (t3k.state) {
			case 0: // Move target right
				t3k.UI.values[t3k.target].remove();
				t3k.UI.values[t3k.target].font('bitham-42-light');
				t3k.UI.window.add(t3k.UI.values[t3k.target]);
				t3k.target = mod(t3k.target + 1, 4);
				t3k.UI.values[t3k.target].remove();
				t3k.UI.values[t3k.target].font('bitham-42-bold');
				t3k.UI.window.add(t3k.UI.values[t3k.target]);
				break;
			case 1: // 7 8 9
				changeKeys('7', '8', '9');
				t3k.state = 4;
				break;
			case 2: // Place 2
				changeKeys('<', '+', '>');
				setValue('2');
				t3k.state = 0;
				break;
			case 3: // Place 6
				changeKeys('<', '+', '>');
				setValue('6');
				t3k.state = 0;
				break;
			case 4: // Place 9
				changeKeys('<', '+', '>');
				setValue('9');
				t3k.state = 0;
				break;
			case 5: // Place 5
				changeKeys('<', '+', '>');
				setValue('5');
				t3k.state = 0;
				break;
			case 6: // End state
				console.log('Pitfall!');
				break;
			default:
				// Dead code
				console.log('Something went wrong, defDown');
		}
	};
	this.getValue = function() {
		return t3k.UI.values[0].text() + t3k.UI.values[1].text() + t3k.UI.values[2].text() + t3k.UI.values[3].text();
	};
	this.prepare = function() {
		t3k.UI.window.add(t3k.UI.bUp.button);
		t3k.UI.window.add(t3k.UI.bUp.text);
		t3k.UI.window.add(t3k.UI.bMid.button);
		t3k.UI.window.add(t3k.UI.bMid.text);
		t3k.UI.window.add(t3k.UI.bDown.button);
		t3k.UI.window.add(t3k.UI.bDown.text);
		t3k.UI.window.add(t3k.UI.values[0]);
		t3k.UI.window.add(t3k.UI.values[1]);
		t3k.UI.window.add(t3k.UI.values[2]);
		t3k.UI.window.add(t3k.UI.values[3]);

		t3k.UI.window.on('click', 'up', t3k.keyUp);
		t3k.UI.window.on('click', 'select', t3k.keyMid);
		t3k.UI.window.on('click', 'down', t3k.keyDown);
	};
	this.show = function() {
		t3k.UI.window.show();
	};
}
function busStopsPostN() {
	var postN = new T3K();
	postN.prepare();
	postN.show();
	postN.UI.window.on('longClick', 'select', function() {
		requestBus(postN.getValue());
	});
}
function bus() {
	var busMenu = new UI.Menu({
		fullscreen: true,
		sections: [{
			title: 'Bus stops',
			items: [{
				title: 'Post Nº',
				subtitle: 'Input post number'
			}]
		}, {
			title: 'Recents',
			// TO-DO: Add recents
			items: settings.data('busRecents')
		}]
	});
	busMenu.on('select', function(e) {
		if (e.sectionIndex === 0) {
			// Stops list selected
			busStopsPostN();
		} else {
			// One of the recents selected
			requestBus(e.item.id);
		}
	});
	busMenu.show();
}

// Welcome screen
var tramBus = new UI.Menu({
	fullscreen: true,
	sections: [{
		title: 'Choose transport',
		items: [{
			title: 'Tram',
			subtitle: 'Tram stops'
		}, {
			title: 'Bus',
			subtitle: 'Bus stops'
		}]
	}]
});
tramBus.on('select', function(e) {
	if (e.itemIndex === 0) {
		// Tram selected
		tram();
	} else {
		// Bus selected
		bus();
	}
});
tramBus.show();