window.addEventListener("load", init, false);
var pos = 0;
var onUpdate;

var position_x = 0;
var position_y = 0;

var obstaculos_x = new Array();
var obstaculos_y = new Array();

var coins_x = new Array();
var coins_y = new Array();

var coinsCount = 0;
var coinsToGet = 0;

var lista = new Array();

var meta_x;
var meta_y;

var current_level = 6;

var jump;

var niveles = new Array();

niveles[0] = [
  0, 1, 0, 1, 0, 0, 1, 2, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 3, 1,
  0, 1, 0, 1, 0, 1,
];

niveles[1] = [
  3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
  0, 0, 0, 1, 2, 1,
];

niveles[2] = [
  0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 3,
  0, 0, 0, 1, 0, 1,
];

niveles[3] = [
  1, 0, 1, 1, 2, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1,
  3, 0, 0, 1, 0, 1,
];

niveles[4] = [
  2, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
  0, 3, 0, 1, 0, 1,
];

niveles[5] = [
  2, 1, 4, 1, 4, 1, 4, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 4, 4, 1, 0, 1, 0, 4, 0,
  4, 1, 0, 1, 3, 1,
];

niveles[6] = [
  0, 1, 4, 0, 1, 0, 1, 4, 4, 0, 1, 0, 1, 0, 0, 1, 1, 4, 1, 0, 4, 2, 1, 0, 0, 0,
  1, 3, 0, 1, 0, 4,
];

niveles[7] = [
  4, 0, 0, 3, 4, 1, 4, 0, 1, 1, 1, 1, 1, 0, 0, 1, 4, 0, 1, 0, 4, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 2, 1,
];

niveles[8] = [
  1, 0, 0, 3, 4, 1, 4, 0, 4, 1, 4, 1, 0, 0, 4, 1, 4, 0, 1, 2, 4, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 4, 1,
];

niveles[9] = [
  1, 0, 0, 3, 4, 1, 4, 0, 0, 1, 0, 1, 0, 0, 4, 1, 4, 0, 1, 4, 1, 4, 1, 4, 1, 0,
  4, 1, 0, 1, 4, 2,
];

niveles[10] = [
  0, 1, 4, 1, 0, 0, 1, 2, 0, 4, 1, 4, 1, 4, 1, 1, 0, 1, 4, 1, 0, 1, 1, 1, 3, 1,
  4, 1, 0, 1, 0, 1,
];
//Commands Definition----------------------

//Definicion de Comandos o funciones

//Funcion para Mover Arriba
function MOVERARRIBA() {
  position_y -= 1;
}
//Funcion para Mover Abajo
function MOVERABAJO() {
  position_y += 1;
}
//Funcion para Mover Derecha
function MOVERDERECHA() {
  position_x += 1;
}
//Funcion para Mover Izquierda
function MOVERIZQUIERDA() {
  position_x -= 1;
}
//------------------------------------------

//Funciones para saltar --------------------

function SALTARARRIBA() {
  jump.play();
  position_y -= 2;
}
//Funcion para Mover Abajo
function SALTARABAJO() {
  jump.play();
  position_y += 2;
}
//Funcion para Mover Derecha
function SALTARDERECHA() {
  jump.play();
  position_x += 2;
}
//Funcion para Mover Izquierda
function SALTARIZQUIERDA() {
  jump.play();
  position_x -= 2;
}

//------------------------------------------

function init() {
  $.getScript("js/CommandsDefinition.js", function () {
    console.log("Load was performed.");
  });
  $.getScript("js/howler.js", function () {
    console.log("Load was performed.");
  });
  $.getScript("js/howler.min.js", function () {
    console.log("Load was performed.");
  });
  inicializar();
  jump = new Howl({ urls: ["media/Jump2.wav"] });
}

function leerComandos() {
  $("#dangerMsj").hide();

  var lines = $("#comandos").val().split(";");
  for (var i = 0; i < lines.length - 1; i++) {
    //code here using lines[i] which will give you each line
    if (lines[i].trim() != "") if (!validarComando(lines[i].trim())) return;
  }
  if (lines.length > 1) {
    myFunction(lista);
  } else {
    $("#dangerMsj").show();
  }
}
function asignarComandos(comando, instruccion) {
  var commandStr = instruccion;
  var start_pos = commandStr.indexOf("(") + 1;
  var end_pos = commandStr.indexOf(")", start_pos);
  var cant = commandStr.substring(start_pos, end_pos);

  var result = parseInt(cant == "" ? "1" : eval(cant));
  for (var j = 0; j < result; j++) {
    if (result != 0) {
      var item = {
        Comando: comando,
        Cantidad: result,
      };
    }
    lista[lista.length] = item;
  }

  //lista[i] = item;
}
function validarComando(instruccion, i) {
  /*
    Commands contiene la definicion de comandos y metodos que 
    se permiten en guco
  */

  var inst = instruccion.split("(")[0].toUpperCase();
  //Aqui se verifica si en el arreglo de comandos se encuentra el comando evaluado;
  /*if ($.inArray(inst.toUpperCase().trim(), commands1) != -1){ 
        asignarComandos($.inArray(inst.toUpperCase().trim(), commands1), instruccion, i);
      return true;
    }*/
  //Test Garifuna
  if (findCommand(inst.toUpperCase().trim())) {
    asignarComandos(findCommand(inst.toUpperCase().trim()), instruccion);
    return true;
  }

  $("#dangerMsj").show();
  return false;
}

function findCommand(command) {
  var result = false;
  for (var i = 0; i < principalCommands.length; i++) {
    if (principalCommands[i].com == command) {
      result = command;
      break;
    }
  }

  for (var i = 0; i < garifunaCommands.length; i++) {
    if (garifunaCommands[i].com == command) {
      var _idp = garifunaCommands[i].idP;
      for (var j = 0; j < principalCommands.length; j++) {
        if (principalCommands[j].idP == _idp) {
          result = principalCommands[j].com;
          break;
        }
      }
      if (!result) break;
    }
  }

  return result;
}

function goGuco(posActual) {
  pintarCuadro("actual", position_x, position_y);
  esCoin(position_x, position_y);
  if (esObstaculo(position_x, position_y)) {
    alert("Pucha! perdiste has chocado con un obstaculo!");
    window.clearInterval(onUpdate);
    lista = new Array();
    inicializar();
  }

  if (esMeta(position_x, position_y)) {
    if (coinsCount < coinsToGet) {
      alert(
        "Pucha! llegaste a la meta pero no has recojido todas las plantas!",
      );
      window.clearInterval(onUpdate);
      lista = new Array();
      inicializar();
    } else {
      alert("Siiii ganaste! ahora intentalo en el siguiente nivel");
      window.clearInterval(onUpdate);
      current_level++;
      lista = new Array();
      inicializar();
    }
  }

  if (posActual == lista.length - 1) {
    if (esMeta(position_x, position_y)) {
      if (coinsCount < coinsToGet) {
        alert(
          "Pucha! llegaste a la meta pero no has recojido todas las plantas!",
        );
        window.clearInterval(onUpdate);
        lista = new Array();
        inicializar();
      } else {
        alert("Siiii ganaste! ahora intentalo en el siguiente nivel");
        window.clearInterval(onUpdate);
        lista = new Array();
        current_level++;
        inicializar();
      }
    } else {
      alert("Pucha! perdiste no has llegado a la meta!");
      window.clearInterval(onUpdate);
      lista = new Array();
      inicializar();
    }
  }
}

function inicializar() {
  pos = 0;
  obstaculos_x = new Array();
  obstaculos_y = new Array();
  coins_x = new Array();
  coins_y = new Array();
  coinsCount = 0;
  coinsToGet = 0;
  initLevel(current_level);
}

function myFunction() {
  inicializar();
  onUpdate = setInterval(function () {
    //pintarCuadro vacio limpia el actual donde esta el robot
    pintarCuadro("vacio", position_x, position_y);

    // for (var i = 0; i <= lista.length; i++) {
    //llama el metodo que corresponda Mover: Arriba, abajo, derecha e izquierda
    // var a = commands1[lista[pos].Comando].toUpperCase();
    var a = lista[pos].Comando.toUpperCase();

    window[a]();

    goGuco(pos);

    //};
    pos++;
    if (pos >= lista.length) {
      lista = new Array();
      window.clearInterval(onUpdate);
    }
  }, 500);
}

function initLevel(level) {
  limpiarPantalla();
}

function limpiarPantalla() {
  var y = 0;
  while (y < 4) {
    pintarCuadro("vacio", 0, y);
    pintarCuadro("vacio", 1, y);
    pintarCuadro("vacio", 2, y);
    pintarCuadro("vacio", 3, y);
    pintarCuadro("vacio", 4, y);
    pintarCuadro("vacio", 5, y);
    pintarCuadro("vacio", 6, y);
    pintarCuadro("vacio", 7, y);
    y++;
  }
  /*var i=0;
  while(i<obstaculos_x.length && obstaculos_x.length!=0)
  {
    pintarCuadro("obstaculo",obstaculos_x[i],obstaculos_y[i]);
    i++;
  }*/
  makeLevels(current_level);
  // pintarCuadro("meta",meta_x,meta_y);
  //pintarCuadro("actual",position_x,position_y);
}

function makeLevels(level) {
  var fila = 0;
  var col = 0;
  var a = eval(level - 1);
  for (var i = 0; i < niveles[a].length; i++) {
    var b = niveles[a][i];
    if (b == 3) {
      position_x = fila;
      position_y = col;
      pintarCuadro("actual", fila, col);
    } else if (b == 2) {
      meta_x = fila;
      meta_y = col;
      pintarCuadro("meta", fila, col);
    } else if (b == 1) {
      obstaculos_x.push(fila);
      obstaculos_y.push(col);
      pintarCuadro("obstaculo", fila, col);
    } else if (b == 4) {
      coins_x.push(fila);
      coins_y.push(col);
      coinsToGet++;
      pintarCuadro("coin", fila, col);
    }
    fila++;
    if (i == 7 || i == 15 || i == 23 || i == 31) {
      fila = 0;
      col++;
    }
  }
}

function pintarCuadro(tipo, col, row) {
  if (col < 0 || col > 7 || row < 0 || col > 7) return;
  var table = $("#myTable")[0];
  var columna = table.rows[row].cells;
  columna[col].innerHTML =
    '<img class="img-responsive" src=img/' + tipo + ".png></img>";
}

function esObstaculo(pos_x, pos_y) {
  if (pos_x < 0 || pos_x > 7 || pos_y < 0 || pos_y > 4) {
    return true;
  }

  var i = 0;
  while (i < obstaculos_x.length) {
    if (pos_x == obstaculos_x[i] && pos_y == obstaculos_y[i]) {
      return true;
    }
    i++;
  }
  return false;
}
function esCoin(pos_x, pos_y) {
  if (pos_x < 0 || pos_x > 7 || pos_y < 0 || pos_y > 4) {
    return true;
  }
  var i = 0;
  while (i < coins_x.length) {
    if (pos_x == coins_x[i] && pos_y == coins_y[i]) {
      coinsCount++;
    }
    i++;
  }
}
function esMeta(pos_x, pos_y) {
  return pos_x == meta_x && pos_y == meta_y;
}
