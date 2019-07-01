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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! colyseus */ \"colyseus\");\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(colyseus__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @colyseus/schema */ \"@colyseus/schema\");\n/* harmony import */ var _colyseus_schema__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! regenerator-runtime */ \"regenerator-runtime\");\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime__WEBPACK_IMPORTED_MODULE_2__);\n\n\n/*\nimporting regeneratorRuntime is to use async/await in bundling\n*/\n\n/*\nhttps://discuss.colyseus.io/topic/52/version-0-9-0-has-been-released/2\npoints out we shouldn't use babel node (nodemon --exec babel node ..) to run script, or following error\ncolyseus.js: server error: Class constructor Room cannot be invoked without 'new'\nwill happen.\n*/\n\nclass playGround extends colyseus__WEBPACK_IMPORTED_MODULE_0__[\"Room\"]{\n    constructor(options) {\n        super(options);\n        this.playerList = []        \n    }\n\n    onInit(options) {\n        this.maxClients = 2;\n        this.setState(new roomStatus());\n        console.log(\"CREATING NEW ROOM\");\n    }\n\n    onJoin (client, options, auth) {\n        console.log(\"JOINING ROOM\");\n        this.state.players[client.sessionId] = new Player();\n        this.state.players[client.sessionId].connected = true;\n        this.playerList.push(client.sessionId);\n        console.log(\"join \" + client.id);\n        \n        let gameCanStart = this.hasReachedMaxClients();\n        if (gameCanStart) {\n            this.state.waitingForUser = false;\n            // broadcast a message to all clients\n            this.broadcast([\"gameCanStart\", { [this.playerList[0]]: 0 }, { [this.playerList[1]]: 1 }]);\n        }\n    }\n\n    \n\n    requestJoin (options, isNewRoom) {\n        return (options.create)\n            ? (options.create && isNewRoom)\n            : this.clients.length > 0;\n    }\n\n    onMessage(client, message) {\n        // broadcast a message to all clients\n        console.log(\"broadcast to all the clients\")\n        console.log(message);\n        this.broadcast(message, { except: client });\n        //\n    }\n    \n    async onLeave(client, consented) {\n        // flag client as inactive for other users\n        //this.state.players[client.sessionId].connected = false;\n\n        try {\n            if (consented) {\n                throw new Error(\"consented leave\");\n            }\n\n            // allow disconnected client to rejoin into this room until 20 seconds\n            await this.allowReconnection(client, 20);\n\n            // client returned! let's re-activate it.\n            this.state.players[client.sessionId].connected = true;\n\n        } catch (e) {\n\n            // 20 seconds expired. let's remove the client.\n            delete this.state.players[client.sessionId];\n        }\n\n        console.log(\"ChatRoom: \", client.sessionId, \"left!\");\n    }\n    \n    // useless function\n    onDispose () {\n        delete this.state.players;\n        console.log(\"Dispose: \" + this.state)        \n    }\n    \n}\n\n/*\nwarm reminder:\n    field not initialised in constructor is default undefined\n*/\nclass Player extends _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"Schema\"] {\n}\nObject(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"type\"])(\"boolean\")(Player.prototype, \"connected\");\n\nclass roomStatus extends _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"Schema\"] {\n    constructor() {\n        super();\n        this.players = new _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"MapSchema\"]();\n        this.waitingForUser = true;\n    }\n}\nObject(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"type\"])(\"boolean\")(roomStatus.prototype, \"waitingForUser\");\nObject(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"type\"])(\"string\")(roomStatus.prototype, \"currentTurn\");\nObject(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__[\"type\"])({ map:Player })(roomStatus.prototype, \"players\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (playGround);\n\n\n//# sourceURL=webpack:///./src/Room/PlayGround.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! colyseus */ \"colyseus\");\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(colyseus__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! regenerator-runtime */ \"regenerator-runtime\");\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _colyseus_monitor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @colyseus/monitor */ \"@colyseus/monitor\");\n/* harmony import */ var _colyseus_monitor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_colyseus_monitor__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _Room_PlayGround__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Room/PlayGround */ \"./src/Room/PlayGround.js\");\n\n\n\n\n\n\n\n//const socialRoutes = require(\"@colyseus/social/express\").default;\n\n\nconst port = process.env.PORT || 2567;\nconst app = express__WEBPACK_IMPORTED_MODULE_1___default()();\napp.use(cors__WEBPACK_IMPORTED_MODULE_3___default()());\nconst server = http__WEBPACK_IMPORTED_MODULE_0___default.a.createServer(app);\nconst gameServer = new colyseus__WEBPACK_IMPORTED_MODULE_2__[\"Server\"]({ server });\nconst playboradRoutes = express__WEBPACK_IMPORTED_MODULE_1___default.a.Router()\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\nmongoose.connect('mongodb://127.0.0.1:27017/ranking', { useNewUrlParser: true });\nconst connection = mongoose.connection;\nconnection.once('open', function() {\n    console.log(\"MongoDB database connection established successfully\");\n})\n\n\nplayboradRoutes.route('/playborad').post(function(req, res) {\n    let rank = new Rank(req.body);\n    rank.save()\n        .then(post => {\n            res.status(200).json({'rank': 'rank added successfully'});\n        })\n        .catch(err => {\n            res.status(400).send('adding new rank failed');\n        });\n});\n\n// register your room handlers\n/*\nThere could be many rooms in a single registrant\neach room follows its handler's rule\nIn this line for example, it said registrant game_room_handler\ncould have many rooms and each room follows handler playGround's \npattern.\n*/\ngameServer.register('game_room_handler', _Room_PlayGround__WEBPACK_IMPORTED_MODULE_6__[\"default\"]);\n\n// register @colyseus/social routes\n//app.use(\"/\", socialRoutes);\n\n// register colyseus monitor AFTER registering your room handlers\napp.use(\"/colyseus\", Object(_colyseus_monitor__WEBPACK_IMPORTED_MODULE_5__[\"monitor\"])(gameServer));\n\ngameServer.listen(port);\nconsole.log(`Listening on ws://localhost:${ port }`)\n\n\n//# sourceURL=webpack:///./src/index.js?");

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