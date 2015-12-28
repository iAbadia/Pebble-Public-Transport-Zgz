var UI = require('ui');
var ajax = require('ajax');

// List of tram stops
var tramStopsList = [
  {title: 'Avda. Academia',        type: 1, id1:101, id2:102},
  {title: 'Parque Goya',             type: 1, id1:201, id2:202},
  {title: 'Juslibol',                type: 1, id1:301, id2:302},
  {title: 'Campus Rio Ebro',         type: 1, id1:401, id2:402},
  {title: 'Garcia Abril',            type: 0, subtitle: 'Hacia Avda. Academia',  id:502},
  {title: 'Margarita Xirgu',         type: 0, subtitle: 'Hacia Mago de Oz',      id:501},
  {title: 'Adolfo Aznar',            type: 0, subtitle: 'Hacia Avda. Academia',  id:602},
  {title: 'Legaz Lacambra',          type: 0, subtitle: 'Hacia Mago de Oz',      id:601},
  {title: 'Pablo Neruda',            type: 0, subtitle: 'Hacia Avda. Academia',  id:702},
  {title: 'Clara Campoamor',         type: 0, subtitle: 'Hacia Mago de Oz',      id:701},
  {title: 'Leon Felipe',             type: 0, subtitle: 'Hacia Avda. Academia',  id:802},
  {title: 'Rosalia de Castro',       type: 0, subtitle: 'Hacia Mago de Oz',      id:801},
  {title: 'Maria Montesori',         type: 0, subtitle: 'Hacia Avda. Academia',  id:902},
  {title: 'Martinez Soria',          type: 0, subtitle: 'Hacia Mago de Oz',      id:901},
  {title: 'La Chimenea',             type: 1, id1:1001, id2:1002},
  {title: 'Plz. Pilar/Murallas',     type: 1, id1:1101, id2:1102},
  {title: 'Cesar Augusto',           type: 1, id1:1201, id2:1202},
  {title: 'Plaza España',            type: 1, id1:1301, id2:1302},
  {title: 'Plaza Aragón',            type: 1, id1:1311, id2:1312},
  {title: 'Gran Via',                type: 1, id1:1401, id2:1402},
  {title: 'Fernando Católico',       type: 1, id1:1501, id2:1502},
  {title: 'Plaza San Fracisco',      type: 1, id1:1601, id2:1602},
  {title: 'Carlos V',                type: 1, id1:1701, id2:1702},
  {title: 'Romareda',                type: 1, id1:1801, id2:1802},
  {title: 'Casablanca',              type: 1, id1:1901, id2:1902},
  {title: 'Argualas',                type: 1, id1:2001, id2:2002},
  {title: 'Los Olvidados',           type: 1, id1:2101, id2:2102},
  {title: 'Ventana Indiscreta',      type: 0, subtitle: 'Hacia Avda. Academia', id:2322},
  {title: 'Los Pájaros',             type: 0, subtitle: 'Hacia Mago de Oz',     id:2301},
  {title: 'Americano París',         type: 0, subtitle: 'Hacia Avda. Academia', id:2422},
  {title: 'Bajo la Lluvia',          type: 0, subtitle: 'Hacia Mago de Oz',     id:2401},
  {title: 'Mago de Oz',              type: 0, subtitle: 'Hacia Avda. Academia', id:2502},
  {title: 'Mago de Oz',              type: 0, subtitle: 'Hacia fin de linea',   id:2501},
];

// TramList Menu
var tramList = function(){
  var tramListMenu = new UI.Menu({
    sections: [{
      title: 'Tram stops list',
      items: tramStopsList
    }]
  });
  tramListMenu.on('select', function(e){
    var URL = 'http://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/tranvia/';
    // Show progress card
    var card = new UI.Card({
      title: e.item.title,
      subtitle:'Fetching...'
    });
    card.show();
    if(e.type === 0){
      // Single stop
      URL = URL + e.item.id;
      ajax({
          url: URL,
          type: 'json'
        },
        function(data) {
          // Success!
          console.log('Successfully fetched tram data!');
          // TO-DO: Fetch, construct card and show
        },
        function(error) {
          // Failure!
          console.log('Failed fetching tram data: ' + error);
          
        }
      );
    }else{
      // Dual stop
      // TO-DO: Fetch twice, construct card and show
    }
  });
  tramListMenu.show();
};

// BusPost
// TO-DO: Implement keyboard screen

// Tram Menu
var tram = function(){
  var tramMenu = new UI.Menu({
    sections: [{
      title: 'Tram stops',
      items: [{title:'Stops list', subtitle:'Choose from full list'}]},
      {
      title: 'Recents',
      // TO-DO: Add recents
      items: []}]
  });
  tramMenu.on('select', function(e){
  if(e.itemIndex === 0){
    // Stops list selected
    tramList();
  }else{
    // One of the recents selected
    // TO-DO: Request for chosen stop
  }
});
tramMenu.show();
};

// Bus Menu
var bus = function(){
  var busMenu = new UI.Menu({
    sections: [{
      title: 'Bus stops',
      // TO-DO: Add stored recents
      items: [{title:'Post nº', subtitle:'Introduce post number'}]
    }]
  });
  busMenu.on('select', function(e){
  if(e.itemIndex === 0){
    // Stops list selected
    busStopsMenu();
  }else{
    // One of the recents selected
    // TO-DO: Request for chosen stop
  }
});
busMenu.show();
};

// Show tramBus screen
var tramBus = new UI.Menu({
  sections: [{
    title: 'Choose transport',
    items: [{title: 'Tram', subtitle: 'Tram stops'},{title: 'Bus', subtitle: 'Bus stops'}]
    }]
  });

// Set callback for tramBus screen and show
tramBus.on('select', function(e){
  if(e.itemIndex === 0){
    // Tram selected
    tram();
  }else{
    // Bus selected
    bus();
  }
});
tramBus.show();