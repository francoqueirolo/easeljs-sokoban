(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var createSubClass = require('./util/create_subclass')
    , Tile = require('./Tile');


module.exports = createSubClass(Tile, 'Block', {
    initialize: Block$initialize
});


function Block$initialize(x, y) {
    Tile.prototype.initialize.apply(this, arguments);
    this.name = 'block';
    
    this.graphics.beginFill('black').drawRect(0, 0, 50, 50);
}

},{"./Tile":5,"./util/create_subclass":8}],2:[function(require,module,exports){
'use strict';

var createSubClass = require('./util/create_subclass')
    , Tile = require('./Tile');


module.exports = createSubClass(Tile, 'Box', {
    initialize: Box$initialize
});


function Box$initialize(x, y) {
    Tile.prototype.initialize.apply(this, arguments);
    this.name = 'box';

    this.graphics.beginFill('red').drawRect(0, 0, 50, 50);
}

},{"./Tile":5,"./util/create_subclass":8}],3:[function(require,module,exports){
'use strict';

var createSubClass = require('./util/create_subclass')
    , Tile = require('./Tile');


module.exports = createSubClass(Tile, 'Diamond', {
    initialize: Diamond$initialize
});


function Diamond$initialize(x, y) {
    Tile.prototype.initialize.apply(this, arguments);
    this.regX = -25;
    this.regY = -25;
    this.name = 'diamond';

    this.graphics.beginFill('blue').drawCircle(0, 0, 25);
}

},{"./Tile":5,"./util/create_subclass":8}],4:[function(require,module,exports){
'use strict';

var createSubClass = require('./util/create_subclass')
    , Tile = require('./Tile');


module.exports = createSubClass(Tile, 'Hero', {
    initialize: Hero$initialize
});


function Hero$initialize(x, y) {
    Tile.prototype.initialize.apply(this, arguments);
    this.name = 'hero';
    
    this.graphics.beginFill('green').drawRoundRect(0, 0, 50, 50, 15);
}

},{"./Tile":5,"./util/create_subclass":8}],5:[function(require,module,exports){
'use strict';

var createSubClass = require('./util/create_subclass')
    , Shape = createjs.Shape;

var TILE_SIZE = 50;


module.exports = createSubClass(Shape, 'Tile', {
    initialize: Tile$initialize,
    setPos: Tile$setPos,
    getPos: Tile$getPos,
    move: Tile$move
});


function Tile$initialize(x, y) {
    Shape.call(this, null);
    this.setPos(x, y);
}


function Tile$setPos(x, y) {
    this.gameX = x;
    this.gameY = y;
    this.x = x * TILE_SIZE;
    this.y = y * TILE_SIZE;
}


function Tile$getPos() {
    return {
        x: this.gameX,
        y: this.gameY
    }
}


function Tile$move(dX, dY) {
    this.gameX += dX;
    this.gameY += dY;
    this.x += dX * TILE_SIZE;
    this.y += dY * TILE_SIZE;
}


},{"./util/create_subclass":8}],6:[function(require,module,exports){
'use strict';

module.exports = [
    {
        name: 'Level 1',
        map: [
            [1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1],
            [1,0,2,0,0,3,0,1],
            [1,0,3,0,0,2,4,1],
            [1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1]
        ]
    },
    {
        name: 'Level 2',
        map: [
            [1,1,1,1,0,0,0,0],
            [1,0,0,1,1,1,1,1],
            [1,0,2,0,0,3,0,1],
            [1,0,3,0,0,2,4,1],
            [1,1,1,0,0,1,1,1],
            [0,0,1,1,1,1,0,0]
        ]
    }
];

},{}],7:[function(require,module,exports){
'use strict';

var domReady = require('./util').domReady
    , levels = require('./levels')
    , Hero = require('./Hero')
    , Diamond = require('./Diamond')
    , Box = require('./Box')
    , Block = require('./Block');

var classMap = {
    '1': [Block],
    '2': [Diamond],
    '3': [Box],
    '4': [Hero],
    '5': [Diamond, Box],
    '6': [Diamond, Hero]
};

var c = createjs
    , diamondTiles = []
    , currentLevel = 0
    , stage
    , mapGroup
    , hero
    , tiles;

console.log('Game Started: EaselJS version: ' + c.EaselJS.version);


domReady(function init() {
    prepareWorld();
    window.addEventListener('keydown', onKeyDown);
});


function prepareWorld() {
    stage = new c.Stage('main');
    mapGroup = new c.Container();
    mapGroup.x = 50;
    mapGroup.y = 50;
    stage.addChild(mapGroup);

    loadLevel();
}


function loadLevel() {
    hero = undefined;
    mapGroup.removeAllChildren();
    var map = levels[currentLevel].map;
    tiles = [];

    map.forEach(function (row, indexY) {
        tiles.push([]);
        row.forEach(function (tile, indexX) {
            var tileArr = tiles[indexY][indexX] = [];
            var classArr = classMap[tile];
            if (classArr) {
                classArr.forEach(function (TileClass) {
                    var newTile = new TileClass(indexX, indexY);
                    mapGroup.addChild(newTile);
                    tileArr.push(newTile);
                    if (TileClass == Hero) hero = newTile;
                });
                if (tile == 2 || tile == 5 || tile == 6)
                    diamondTiles.push(tileArr);              
            }
        });
    });

    if (!hero) console.error('main.js: no hero in map');
    stage.update();
}


function onKeyDown(event) {
    var didMove = false;
    switch (event.keyCode) {
        case 37: //left
            didMove = tryMove(hero, -1, 0);
            break;

        case 38: //up
            didMove = tryMove(hero, 0, -1);
            break;

        case 39: //right
            didMove = tryMove(hero, 1, 0);
            break;

        case 40: //down
            didMove = tryMove(hero, 0, 1);
            break;
    }

    if (didMove) {
        stage.update();
        checkWin();
    }
}


function tryMove(obj, x, y) {
    var myX = obj.gameX
        , myY = obj.gameY
        , tryX = myX + x
        , tryY = myY + y
        , myTile = tiles[myY][myX]
        , tryTile = tiles[tryY] && tiles[tryY][tryX];
    
    if (!tryTile) return; // Quick exit false
    if (!tryTile.length) return processMove(); // Quick exit true
    
    var tryTileTop = tryTile[tryTile.length-1];
    if (tryTileTop.name == 'block') return false; // Hit a block
    if (tryTileTop.name == 'box') { // Hit a box
        if (obj.name == 'box') return false; // Can't push two boxes

        var canTryTileMove = tryMove(tryTileTop, x, y); // Try pushing box
        if (!canTryTileMove) return false; // Exit if box can't move
    }

    return processMove(); //If we made it this far, move

    function processMove() {
        myTile.pop();
        tryTile.push(obj);
        obj.move(x, y);
        mapGroup.addChild(obj);
        return true;
    }
}


function checkWin() {
    var anyFailing = diamondTiles.some(function (tileArr) {
        return tileArr[tileArr.length - 1].name != 'box';
    });

    if (!anyFailing) {
        currentLevel++;
        if (currentLevel == levels.length)
            alert('All Levels Complete!');
        else
            setTimeout(loadLevel, 300);
    }
}



},{"./Block":1,"./Box":2,"./Diamond":3,"./Hero":4,"./levels":6,"./util":10}],8:[function(require,module,exports){
'use strict';

module.exports = createSubclass;

function createSubclass(Superclass, name, methods) {
    var Subclass;

    eval('Subclass = function ' + name + '(){ this.initialize.apply(this, arguments) }');
    Subclass.prototype = Object.create(Superclass.prototype);

    for (var key in methods) {
        if (methods.hasOwnProperty(key))
            Subclass.prototype[key] = methods[key];
    }

    return Subclass;
}

},{}],9:[function(require,module,exports){
'use strict';


module.exports = domReady;


/**
 * Fires when dom is ready, can be used at any time as result is cached
 * @param  {Function} func callback function for when dom is ready
 * @return {Any}           returns whatever func returns
 */
function domReady(func) { // , arguments
    var self = this
        , args = Array.prototype.slice.call(arguments, 1);
    if (isReady.call(this))
        return callFunc();
    else
        document.addEventListener('readystatechange', callFunc);

    function callFunc() {
        document.removeEventListener('readystatechange', callFunc);
        return func.apply(self, args);
    }
}

domReady.isReady = isReady;


/**
 * Returns true if the dom is ready
 * @return {Boolean}
 */
function isReady() {
    var readyState = document.readyState;
    return readyState == 'loading' ? false : readyState;
}

},{}],10:[function(require,module,exports){
'use strict';

module.exports = {
    domReady: require('./dom_ready'),
    createSubclass: require('./create_subclass')
};

},{"./create_subclass":8,"./dom_ready":9}]},{},[7]);