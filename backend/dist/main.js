/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Room/PlayGround.js":
/*!********************************!*\
  !*** ./src/Room/PlayGround.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! colyseus */ \"colyseus\");\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(colyseus__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @colyseus/schema */ \"@colyseus/schema\");\n/* harmony import */ var _colyseus_schema__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! regenerator-runtime */ \"regenerator-runtime\");\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime__WEBPACK_IMPORTED_MODULE_2__);\n\r\n\r\n/*\r\nimporting regeneratorRuntime is to use async/await in bundling\r\n*/\r\n\r\n/*\r\nhttps://discuss.colyseus.io/topic/52/version-0-9-0-has-been-released/2\r\npoints out we shouldn't use babel node (nodemon --exec babel node ..) to run script, or following error\r\ncolyseus.js: server error: Class constructor Room cannot be invoked without 'new'\r\nwill happen.\r\n*/\r\n\r\nclass playGround extends colyseus__WEBPACK_IMPORTED_MODULE_0__[\"Room\"]{\r\n    constructor(options) {\r\n        super(options);\r\n        this.playerList = []        \r\n    }\r\n\r\n    onInit(options) {\r\n        this.maxClients = 2;\r\n        this.setState(new roomStatus());\r\n        console.log(\"CREATING NEW ROOM\");\r\n    }\r\n\r\n    onJoin (client, options, auth) {\r\n        console.log(\"JOINING ROOM\");\r\n        this.state.players[client.sessionId] = new Player();\r\n        this.state.players[client.sessionId].connected = true;\r\n        this.playerList.push(client.sessionId);\r\n        console.log(\"join \" + client.id);\r\n        \r\n        let gameCanStart = this.hasReachedMaxClients();\r\n        if (gameCanStart) {\r\n            this.state.waitingForUser = false;\r\n            // broadcast a message to all clients\r\n            this.broadcast([\"gameCanStart\", { [this.playerList[0]]: 0 }, { [this.playerList[1]]: 1 }]);\r\n        }\r\n    }\r\n\r\n\r\n\r\n    requestJoin (options, isNewRoom) {\r\n        return (options.create)\r\n            ? (options.create && isNewRoom)\r\n            : this.clients.length > 0;\r\n    }\r\n\r\n    onMessage(client, message) {\r\n        // broadcast a message to all clients\r\n        console.log(\"broadcast to all the clients\")\r\n        console.log(message);\r\n        this.broadcast(message, { except: client });\r\n        //\r\n    }\r\n    \r\n    async onLeave(client, consented) {\r\n        // flag client as inactive for other users\r\n        //this.state.players[client.sessionId].connected = false;\r\n\r\n        try {\r\n            if (consented) {\r\n                throw new Error(\"consented leave\");\r\n            }\r\n\r\n            // allow disconnected client to rejoin into this room until 20 seconds\r\n            await this.allowReconnection(client, 20);\r\n\r\n            // client returned! let's re-activate it.\r\n            this.state.players[client.sessionId].connected = true;\r\n\r\n        } catch (e) {\r\n\r\n            // 20 seconds expired. let's remove the client.\r\n            delete this.state.players[client.sessionId];\r\n        }\r\n\r\n        console.log(\"ChatRoom: \", client.sessionId, \"left!\");\r\n    }\r\n    \r\n    // useless function\r\n    onDispose () {\r\n        delete this.state.players;\r\n        console.log(\"Dispose: \" + this.state)        \r\n    }\r\n    \r\n}\r\n\r\n/*\r\nwarm reminder:\r\n    field not initialised in constructor is default undefined\r\n*/\r\nclass Player extends _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"Schema\"] {\r\n}\r\nObject(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"type\"])(\"boolean\")(Player.prototype, \"connected\");\r\n\r\nclass roomStatus extends _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"Schema\"] {\r\n    constructor() {\r\n        super();\r\n        this.players = new _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"MapSchema\"]();\r\n        this.waitingForUser = true;\r\n    }\r\n}\r\nObject(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"type\"])(\"boolean\")(roomStatus.prototype, \"waitingForUser\");\r\nObject(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"type\"])(\"string\")(roomStatus.prototype, \"currentTurn\");\r\nObject(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"type\"])({ map:Player })(roomStatus.prototype, \"players\");\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (playGround);\r\n\n\n//# sourceURL=webpack:///./src/Room/PlayGround.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! colyseus */ \"colyseus\");\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(colyseus__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! regenerator-runtime */ \"regenerator-runtime\");\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _colyseus_monitor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @colyseus/monitor */ \"@colyseus/monitor\");\n/* harmony import */ var _colyseus_monitor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_colyseus_monitor__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _Room_PlayGround__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Room/PlayGround */ \"./src/Room/PlayGround.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n//const socialRoutes = require(\"@colyseus/social/express\").default;\r\n\r\n\r\nconst port = process.env.PORT || 2567;\r\nconst app = express__WEBPACK_IMPORTED_MODULE_1___default()();\r\napp.use(cors__WEBPACK_IMPORTED_MODULE_3___default()());\r\nconst server = http__WEBPACK_IMPORTED_MODULE_0___default.a.createServer(app);\r\nconst gameServer = new colyseus__WEBPACK_IMPORTED_MODULE_2__[\"Server\"]({ server });\r\nconst playboradRoutes = express__WEBPACK_IMPORTED_MODULE_1___default.a.Router()\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nmongoose.connect('mongodb://127.0.0.1:27017/ranking', { useNewUrlParser: true });\r\nconst connection = mongoose.connection;\r\nconnection.once('open', function() {\r\n    console.log(\"MongoDB database connection established successfully\");\r\n})\r\n\r\n\r\nplayboradRoutes.route('/playborad').post(function(req, res) {\r\n    let rank = new Rank(req.body);\r\n    rank.save()\r\n        .then(post => {\r\n            res.status(200).json({'rank': 'rank added successfully'});\r\n        })\r\n        .catch(err => {\r\n            res.status(400).send('adding new rank failed');\r\n        });\r\n});\r\n\r\n// register your room handlers\r\n/*\r\nThere could be many rooms in a single registrant\r\neach room follows its handler's rule\r\nIn this line for example, it said registrant game_room_handler\r\ncould have many rooms and each room follows handler playGround's \r\npattern.\r\n*/\r\ngameServer.register('game_room_handler', _Room_PlayGround__WEBPACK_IMPORTED_MODULE_6__[\"default\"]);\r\napp.use(express__WEBPACK_IMPORTED_MODULE_1___default.a.static(__dirname + \"../../../frontend/dist/index.html\"));\r\n\r\n// register @colyseus/social routes\r\n//app.use(\"/\", socialRoutes);\r\n\r\n// register colyseus monitor AFTER registering your room handlers\r\napp.use(\"/colyseus\", Object(_colyseus_monitor__WEBPACK_IMPORTED_MODULE_5__[\"monitor\"])(gameServer));\r\n\r\ngameServer.listen(port);\r\nconsole.log(`Listening on ws://localhost:${ port }`)\r\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "@colyseus/monitor":
/*!************************************!*\
  !*** external "@colyseus/monitor" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@colyseus/monitor\");\n\n//# sourceURL=webpack:///external_%22@colyseus/monitor%22?");

/***/ }),

/***/ "@colyseus/schema":
/*!***********************************!*\
  !*** external "@colyseus/schema" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@colyseus/schema\");\n\n//# sourceURL=webpack:///external_%22@colyseus/schema%22?");

/***/ }),

/***/ "colyseus":
/*!***************************!*\
  !*** external "colyseus" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"colyseus\");\n\n//# sourceURL=webpack:///external_%22colyseus%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "regenerator-runtime":
/*!**************************************!*\
  !*** external "regenerator-runtime" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"regenerator-runtime\");\n\n//# sourceURL=webpack:///external_%22regenerator-runtime%22?");

/***/ })

/******/ });