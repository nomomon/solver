/******/ (function () { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 760:
/***/ (function (module) {

                module.exports = {
                    XMLSerializer: window.XMLSerializer,
                    DOMParser: window.DOMParser,
                    XMLDocument: window.XMLDocument
                };

                /***/
            }),

      /***/ 712:
      /***/ (function (module) {

                var ctXML = "[Content_Types].xml";

                function collectContentTypes(overrides, defaults, zip) {
                    var partNames = {};

                    for (var i = 0, len = overrides.length; i < len; i++) {
                        var override = overrides[i];
                        var contentType = override.getAttribute("ContentType");
                        var partName = override.getAttribute("PartName").substr(1);
                        partNames[partName] = contentType;
                    }

                    var _loop = function _loop(_i, _len) {
                        var def = defaults[_i];
                        var contentType = def.getAttribute("ContentType");
                        var extension = def.getAttribute("Extension"); // eslint-disable-next-line no-loop-func

                        zip.file(/./).map(function (_ref) {
                            var name = _ref.name;

                            if (name.slice(name.length - extension.length) === extension && !partNames[name] && name !== ctXML) {
                                partNames[name] = contentType;
                            }
                        });
                    };

                    for (var _i = 0, _len = defaults.length; _i < _len; _i++) {
                        _loop(_i, _len);
                    }

                    return partNames;
                }

                module.exports = collectContentTypes;

                /***/
            }),

      /***/ 557:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

                function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

                function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

                function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

                function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

                function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

                function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

                function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

                var _require = __webpack_require__(760),
                    DOMParser = _require.DOMParser,
                    XMLSerializer = _require.XMLSerializer;

                var _require2 = __webpack_require__(257),
                    throwXmlTagNotFound = _require2.throwXmlTagNotFound;

                var _require3 = __webpack_require__(287),
                    last = _require3.last,
                    first = _require3.first;

                function isWhiteSpace(value) {
                    return /^[ \n\r\t]+$/.test(value);
                }

                function parser(tag) {
                    return {
                        get: function get(scope) {
                            if (tag === ".") {
                                return scope;
                            }

                            return scope[tag];
                        }
                    };
                }

                var attrToRegex = {};

                function setSingleAttribute(partValue, attr, attrValue) {
                    var regex; // Stryker disable next-line all : because this is an optimisation

                    if (attrToRegex[attr]) {
                        regex = attrToRegex[attr];
                    } else {
                        regex = new RegExp("(<.* ".concat(attr, "=\")([^\"]*)(\".*)$"));
                        attrToRegex[attr] = regex;
                    }

                    if (regex.test(partValue)) {
                        return partValue.replace(regex, "$1".concat(attrValue, "$3"));
                    }

                    var end = partValue.lastIndexOf("/>");

                    if (end === -1) {
                        end = partValue.lastIndexOf(">");
                    }

                    return partValue.substr(0, end) + " ".concat(attr, "=\"").concat(attrValue, "\"") + partValue.substr(end);
                }

                function getSingleAttribute(value, attributeName) {
                    var index = value.indexOf(" ".concat(attributeName, "=\""));

                    if (index === -1) {
                        return null;
                    }

                    var startIndex = value.substr(index).search(/["']/) + index;
                    var endIndex = value.substr(startIndex + 1).search(/["']/) + startIndex;
                    return value.substr(startIndex + 1, endIndex - startIndex);
                }

                function endsWith(str, suffix) {
                    return str.indexOf(suffix, str.length - suffix.length) !== -1;
                }

                function startsWith(str, prefix) {
                    return str.substring(0, prefix.length) === prefix;
                }

                function uniq(arr) {
                    var hash = {},
                        result = [];

                    for (var i = 0, l = arr.length; i < l; ++i) {
                        if (!hash[arr[i]]) {
                            hash[arr[i]] = true;
                            result.push(arr[i]);
                        }
                    }

                    return result;
                }

                function chunkBy(parsed, f) {
                    return parsed.reduce(function (chunks, p) {
                        var currentChunk = last(chunks);
                        var res = f(p);

                        if (res === "start") {
                            chunks.push([p]);
                        } else if (res === "end") {
                            currentChunk.push(p);
                            chunks.push([]);
                        } else {
                            currentChunk.push(p);
                        }

                        return chunks;
                    }, [[]]).filter(function (p) {
                        return p.length > 0;
                    });
                }

                var defaults = {
                    errorLogging: "json",
                    paragraphLoop: false,
                    nullGetter: function nullGetter(part) {
                        return part.module ? "" : "undefined";
                    },
                    xmlFileNames: ["[Content_Types].xml"],
                    parser: parser,
                    linebreaks: false,
                    fileTypeConfig: null,
                    delimiters: {
                        start: "{",
                        end: "}"
                    }
                };

                function mergeObjects() {
                    var resObj = {};
                    var obj;

                    for (var i = 0; i < arguments.length; i += 1) {
                        obj = arguments[i];
                        resObj = _objectSpread(_objectSpread({}, resObj), obj);
                    }

                    return resObj;
                }

                function xml2str(xmlNode) {
                    var a = new XMLSerializer();
                    return a.serializeToString(xmlNode).replace(/xmlns(:[a-z0-9]+)?="" ?/g, "");
                }

                function str2xml(str) {
                    if (str.charCodeAt(0) === 65279) {
                        // BOM sequence
                        str = str.substr(1);
                    }

                    return new DOMParser().parseFromString(str, "text/xml");
                }

                var charMap = [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ['"', "&quot;"], ["'", "&apos;"]];
                var charMapRegexes = charMap.map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        endChar = _ref2[0],
                        startChar = _ref2[1];

                    return {
                        rstart: new RegExp(startChar, "g"),
                        rend: new RegExp(endChar, "g"),
                        start: startChar,
                        end: endChar
                    };
                });

                function wordToUtf8(string) {
                    var r;

                    for (var i = charMapRegexes.length - 1; i >= 0; i--) {
                        r = charMapRegexes[i];
                        string = string.replace(r.rstart, r.end);
                    }

                    return string;
                }

                function utf8ToWord(string) {
                    // To make sure that the object given is a string (this is a noop for strings).
                    string = string.toString();
                    var r;

                    for (var i = 0, l = charMapRegexes.length; i < l; i++) {
                        r = charMapRegexes[i];
                        string = string.replace(r.rend, r.start);
                    }

                    return string;
                } // This function is written with for loops for performance


                function concatArrays(arrays) {
                    var result = [];

                    for (var i = 0; i < arrays.length; i++) {
                        var array = arrays[i];

                        for (var j = 0, len = array.length; j < len; j++) {
                            result.push(array[j]);
                        }
                    }

                    return result;
                }

                var spaceRegexp = new RegExp(String.fromCharCode(160), "g");

                function convertSpaces(s) {
                    return s.replace(spaceRegexp, " ");
                }

                function pregMatchAll(regex, content) {
                    /* regex is a string, content is the content. It returns an array of all matches with their offset, for example:
                         regex=la
                         content=lolalolilala
                    returns: [{array: {0: 'la'},offset: 2},{array: {0: 'la'},offset: 8},{array: {0: 'la'} ,offset: 10}]
                    */
                    var matchArray = [];
                    var match;

                    while ((match = regex.exec(content)) != null) {
                        matchArray.push({
                            array: match,
                            offset: match.index
                        });
                    }

                    return matchArray;
                }

                function isEnding(value, element) {
                    return value === "</" + element + ">";
                }

                function isStarting(value, element) {
                    return value.indexOf("<" + element) === 0 && [">", " ", "/"].indexOf(value[element.length + 1]) !== -1;
                }

                function getRight(parsed, element, index) {
                    var val = getRightOrNull(parsed, element, index);

                    if (val !== null) {
                        return val;
                    }

                    throwXmlTagNotFound({
                        position: "right",
                        element: element,
                        parsed: parsed,
                        index: index
                    });
                }

                function getRightOrNull(parsed, elements, index) {
                    if (typeof elements === "string") {
                        elements = [elements];
                    }

                    var level = 1;

                    for (var i = index, l = parsed.length; i < l; i++) {
                        var part = parsed[i];

                        for (var j = 0, len = elements.length; j < len; j++) {
                            var element = elements[j];

                            if (isEnding(part.value, element)) {
                                level--;
                            }

                            if (isStarting(part.value, element)) {
                                level++;
                            }

                            if (level === 0) {
                                return i;
                            }
                        }
                    }

                    return null;
                }

                function getLeft(parsed, element, index) {
                    var val = getLeftOrNull(parsed, element, index);

                    if (val !== null) {
                        return val;
                    }

                    throwXmlTagNotFound({
                        position: "left",
                        element: element,
                        parsed: parsed,
                        index: index
                    });
                }

                function getLeftOrNull(parsed, elements, index) {
                    if (typeof elements === "string") {
                        elements = [elements];
                    }

                    var level = 1;

                    for (var i = index; i >= 0; i--) {
                        var part = parsed[i];

                        for (var j = 0, len = elements.length; j < len; j++) {
                            var element = elements[j];

                            if (isStarting(part.value, element)) {
                                level--;
                            }

                            if (isEnding(part.value, element)) {
                                level++;
                            }

                            if (level === 0) {
                                return i;
                            }
                        }
                    }

                    return null;
                } // Stryker disable all : because those are functions that depend on the parsed
                // structure based and we don't want minimal code here, but rather code that
                // makes things clear.


                function isTagStart(tagType, _ref3) {
                    var type = _ref3.type,
                        tag = _ref3.tag,
                        position = _ref3.position;
                    return type === "tag" && tag === tagType && (position === "start" || position === "selfclosing");
                }

                function isTagStartStrict(tagType, _ref4) {
                    var type = _ref4.type,
                        tag = _ref4.tag,
                        position = _ref4.position;
                    return type === "tag" && tag === tagType && position === "start";
                }

                function isTagEnd(tagType, _ref5) {
                    var type = _ref5.type,
                        tag = _ref5.tag,
                        position = _ref5.position;
                    return type === "tag" && tag === tagType && position === "end";
                }

                function isParagraphStart(part) {
                    return isTagStartStrict("w:p", part) || isTagStartStrict("a:p", part);
                }

                function isParagraphEnd(part) {
                    return isTagEnd("w:p", part) || isTagEnd("a:p", part);
                }

                function isTextStart(_ref6) {
                    var type = _ref6.type,
                        position = _ref6.position,
                        text = _ref6.text;
                    return type === "tag" && position === "start" && text;
                }

                function isTextEnd(_ref7) {
                    var type = _ref7.type,
                        position = _ref7.position,
                        text = _ref7.text;
                    return type === "tag" && position === "end" && text;
                }

                function isContent(_ref8) {
                    var type = _ref8.type,
                        position = _ref8.position;
                    return type === "placeholder" || type === "content" && position === "insidetag";
                }

                function isModule(_ref9, modules) {
                    var module = _ref9.module,
                        type = _ref9.type;

                    if (!(modules instanceof Array)) {
                        modules = [modules];
                    }

                    return type === "placeholder" && modules.indexOf(module) !== -1;
                } // Stryker restore all


                var corruptCharacters = /[\x00-\x08\x0B\x0C\x0E-\x1F]/; // 00    NUL '\0' (null character)
                // 01    SOH (start of heading)
                // 02    STX (start of text)
                // 03    ETX (end of text)
                // 04    EOT (end of transmission)
                // 05    ENQ (enquiry)
                // 06    ACK (acknowledge)
                // 07    BEL '\a' (bell)
                // 08    BS  '\b' (backspace)
                // 0B    VT  '\v' (vertical tab)
                // 0C    FF  '\f' (form feed)
                // 0E    SO  (shift out)
                // 0F    SI  (shift in)
                // 10    DLE (data link escape)
                // 11    DC1 (device control 1)
                // 12    DC2 (device control 2)
                // 13    DC3 (device control 3)
                // 14    DC4 (device control 4)
                // 15    NAK (negative ack.)
                // 16    SYN (synchronous idle)
                // 17    ETB (end of trans. blk)
                // 18    CAN (cancel)
                // 19    EM  (end of medium)
                // 1A    SUB (substitute)
                // 1B    ESC (escape)
                // 1C    FS  (file separator)
                // 1D    GS  (group separator)
                // 1E    RS  (record separator)
                // 1F    US  (unit separator)

                function hasCorruptCharacters(string) {
                    return corruptCharacters.test(string);
                }

                function invertMap(map) {
                    return Object.keys(map).reduce(function (invertedMap, key) {
                        var value = map[key];
                        invertedMap[value] = invertedMap[value] || [];
                        invertedMap[value].push(key);
                        return invertedMap;
                    }, {});
                }

                module.exports = {
                    endsWith: endsWith,
                    startsWith: startsWith,
                    isContent: isContent,
                    isParagraphStart: isParagraphStart,
                    isParagraphEnd: isParagraphEnd,
                    isTagStart: isTagStart,
                    isTagEnd: isTagEnd,
                    isTextStart: isTextStart,
                    isTextEnd: isTextEnd,
                    isStarting: isStarting,
                    isEnding: isEnding,
                    isModule: isModule,
                    uniq: uniq,
                    chunkBy: chunkBy,
                    last: last,
                    first: first,
                    mergeObjects: mergeObjects,
                    xml2str: xml2str,
                    str2xml: str2xml,
                    getRightOrNull: getRightOrNull,
                    getRight: getRight,
                    getLeftOrNull: getLeftOrNull,
                    getLeft: getLeft,
                    pregMatchAll: pregMatchAll,
                    convertSpaces: convertSpaces,
                    charMapRegexes: charMapRegexes,
                    hasCorruptCharacters: hasCorruptCharacters,
                    defaults: defaults,
                    wordToUtf8: wordToUtf8,
                    utf8ToWord: utf8ToWord,
                    concatArrays: concatArrays,
                    invertMap: invertMap,
                    charMap: charMap,
                    getSingleAttribute: getSingleAttribute,
                    setSingleAttribute: setSingleAttribute,
                    isWhiteSpace: isWhiteSpace
                };

                /***/
            }),

      /***/ 380:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                var _excluded = ["modules"];

                function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

                function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

                function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

                function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

                var DocUtils = __webpack_require__(557);

                DocUtils.traits = __webpack_require__(505);
                DocUtils.moduleWrapper = __webpack_require__(223);

                var createScope = __webpack_require__(919);

                var _require = __webpack_require__(257),
                    throwMultiError = _require.throwMultiError,
                    throwResolveBeforeCompile = _require.throwResolveBeforeCompile,
                    throwRenderInvalidTemplate = _require.throwRenderInvalidTemplate;

                var logErrors = __webpack_require__(567);

                var collectContentTypes = __webpack_require__(712);

                var ctXML = "[Content_Types].xml";

                var commonModule = __webpack_require__(107);

                var Lexer = __webpack_require__(303);

                var defaults = DocUtils.defaults,
                    str2xml = DocUtils.str2xml,
                    xml2str = DocUtils.xml2str,
                    moduleWrapper = DocUtils.moduleWrapper,
                    concatArrays = DocUtils.concatArrays,
                    uniq = DocUtils.uniq;

                var _require2 = __webpack_require__(257),
                    XTInternalError = _require2.XTInternalError,
                    throwFileTypeNotIdentified = _require2.throwFileTypeNotIdentified,
                    throwFileTypeNotHandled = _require2.throwFileTypeNotHandled,
                    throwApiVersionError = _require2.throwApiVersionError;

                var currentModuleApiVersion = [3, 32, 0];

                var Docxtemplater = /*#__PURE__*/function () {
                    function Docxtemplater(zip) {
                        var _this = this;

                        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                            _ref$modules = _ref.modules,
                            modules = _ref$modules === void 0 ? [] : _ref$modules,
                            options = _objectWithoutProperties(_ref, _excluded);

                        _classCallCheck(this, Docxtemplater);

                        if (!Array.isArray(modules)) {
                            throw new Error("The modules argument of docxtemplater's constructor must be an array");
                        }

                        this.scopeManagers = {};
                        this.compiled = {};
                        this.modules = [commonModule()];
                        this.setOptions(options);
                        modules.forEach(function (module) {
                            _this.attachModule(module);
                        });

                        if (arguments.length > 0) {
                            if (!zip || !zip.files || typeof zip.file !== "function") {
                                throw new Error("The first argument of docxtemplater's constructor must be a valid zip file (jszip v2 or pizzip v3)");
                            }

                            this.loadZip(zip); // remove the unsupported modules

                            this.modules = this.modules.filter(function (module) {
                                if (module.supportedFileTypes) {
                                    if (!Array.isArray(module.supportedFileTypes)) {
                                        throw new Error("The supportedFileTypes field of the module must be an array");
                                    }

                                    var isSupportedModule = module.supportedFileTypes.indexOf(_this.fileType) !== -1;

                                    if (!isSupportedModule) {
                                        module.on("detached");
                                    }

                                    return isSupportedModule;
                                }

                                return true;
                            });
                            this.compile();
                            this.v4Constructor = true;
                        }
                    }

                    _createClass(Docxtemplater, [{
                        key: "verifyApiVersion",
                        value: function verifyApiVersion(neededVersion) {
                            neededVersion = neededVersion.split(".").map(function (i) {
                                return parseInt(i, 10);
                            });

                            if (neededVersion.length !== 3) {
                                throwApiVersionError("neededVersion is not a valid version", {
                                    neededVersion: neededVersion,
                                    explanation: "the neededVersion must be an array of length 3"
                                });
                            }

                            if (neededVersion[0] !== currentModuleApiVersion[0]) {
                                throwApiVersionError("The major api version do not match, you probably have to update docxtemplater with npm install --save docxtemplater", {
                                    neededVersion: neededVersion,
                                    currentModuleApiVersion: currentModuleApiVersion,
                                    explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
                                });
                            }

                            if (neededVersion[1] > currentModuleApiVersion[1]) {
                                throwApiVersionError("The minor api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
                                    neededVersion: neededVersion,
                                    currentModuleApiVersion: currentModuleApiVersion,
                                    explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
                                });
                            }

                            if (neededVersion[1] === currentModuleApiVersion[1] && neededVersion[2] > currentModuleApiVersion[2]) {
                                throwApiVersionError("The patch api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
                                    neededVersion: neededVersion,
                                    currentModuleApiVersion: currentModuleApiVersion,
                                    explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
                                });
                            }

                            return true;
                        }
                    }, {
                        key: "setModules",
                        value: function setModules(obj) {
                            this.modules.forEach(function (module) {
                                module.set(obj);
                            });
                        }
                    }, {
                        key: "sendEvent",
                        value: function sendEvent(eventName) {
                            this.modules.forEach(function (module) {
                                module.on(eventName);
                            });
                        }
                    }, {
                        key: "attachModule",
                        value: function attachModule(module) {
                            if (this.v4Constructor) {
                                throw new XTInternalError("attachModule() should not be called manually when using the v4 constructor");
                            }

                            var moduleType = _typeof(module);

                            if (moduleType === "function") {
                                throw new XTInternalError("Cannot attach a class/function as a module. Most probably you forgot to instantiate the module by using `new` on the module.");
                            }

                            if (!module || moduleType !== "object") {
                                throw new XTInternalError("Cannot attachModule with a falsy value");
                            }

                            if (module.requiredAPIVersion) {
                                this.verifyApiVersion(module.requiredAPIVersion);
                            }

                            if (module.attached === true) {
                                if (typeof module.clone === "function") {
                                    module = module.clone();
                                } else {
                                    throw new Error("Cannot attach a module that was already attached : \"".concat(module.name, "\". The most likely cause is that you are instantiating the module at the root level, and using it for multiple instances of Docxtemplater"));
                                }
                            }

                            module.attached = true;
                            var wrappedModule = moduleWrapper(module);
                            this.modules.push(wrappedModule);
                            wrappedModule.on("attached");
                            return this;
                        }
                    }, {
                        key: "setOptions",
                        value: function setOptions(options) {
                            var _this2 = this;

                            if (this.v4Constructor) {
                                throw new Error("setOptions() should not be called manually when using the v4 constructor");
                            }

                            if (!options) {
                                throw new Error("setOptions should be called with an object as first parameter");
                            }

                            this.options = {};
                            Object.keys(defaults).forEach(function (key) {
                                var defaultValue = defaults[key];
                                _this2.options[key] = options[key] != null ? options[key] : defaultValue;
                                _this2[key] = _this2.options[key];
                            });
                            this.delimiters.start = DocUtils.utf8ToWord(this.delimiters.start);
                            this.delimiters.end = DocUtils.utf8ToWord(this.delimiters.end);

                            if (this.zip) {
                                this.updateFileTypeConfig();
                            }

                            return this;
                        }
                    }, {
                        key: "loadZip",
                        value: function loadZip(zip) {
                            if (this.v4Constructor) {
                                throw new Error("loadZip() should not be called manually when using the v4 constructor");
                            }

                            if (zip.loadAsync) {
                                throw new XTInternalError("Docxtemplater doesn't handle JSZip version >=3, please use pizzip");
                            }

                            this.zip = zip;
                            this.updateFileTypeConfig();
                            this.modules = concatArrays([this.fileTypeConfig.baseModules.map(function (moduleFunction) {
                                return moduleFunction();
                            }), this.modules]);
                            return this;
                        }
                    }, {
                        key: "precompileFile",
                        value: function precompileFile(fileName) {
                            var currentFile = this.createTemplateClass(fileName);
                            currentFile.preparse();
                            this.compiled[fileName] = currentFile;
                        }
                    }, {
                        key: "compileFile",
                        value: function compileFile(fileName) {
                            this.compiled[fileName].parse();
                        }
                    }, {
                        key: "getScopeManager",
                        value: function getScopeManager(to, currentFile, tags) {
                            if (!this.scopeManagers[to]) {
                                this.scopeManagers[to] = createScope({
                                    tags: tags || {},
                                    parser: this.parser,
                                    cachedParsers: currentFile.cachedParsers
                                });
                            }

                            return this.scopeManagers[to];
                        }
                    }, {
                        key: "resolveData",
                        value: function resolveData(data) {
                            var _this3 = this;

                            var errors = [];

                            if (!Object.keys(this.compiled).length) {
                                throwResolveBeforeCompile();
                            }

                            return Promise.resolve(data).then(function (data) {
                                _this3.setData(data);

                                _this3.setModules({
                                    data: _this3.data,
                                    Lexer: Lexer
                                });

                                _this3.mapper = _this3.modules.reduce(function (value, module) {
                                    return module.getRenderedMap(value);
                                }, {});
                                return Promise.all(Object.keys(_this3.mapper).map(function (to) {
                                    var _this3$mapper$to = _this3.mapper[to],
                                        from = _this3$mapper$to.from,
                                        data = _this3$mapper$to.data;
                                    return Promise.resolve(data).then(function (data) {
                                        var currentFile = _this3.compiled[from];
                                        currentFile.filePath = to;
                                        currentFile.scopeManager = _this3.getScopeManager(to, currentFile, data);
                                        return currentFile.resolveTags(data).then(function (result) {
                                            currentFile.scopeManager.finishedResolving = true;
                                            return result;
                                        }, function (errs) {
                                            Array.prototype.push.apply(errors, errs);
                                        });
                                    });
                                })).then(function (resolved) {
                                    if (errors.length !== 0) {
                                        if (_this3.options.errorLogging) {
                                            logErrors(errors, _this3.options.errorLogging);
                                        }

                                        throwMultiError(errors);
                                    }

                                    return concatArrays(resolved);
                                });
                            });
                        }
                    }, {
                        key: "compile",
                        value: function compile() {
                            var _this4 = this;

                            if (Object.keys(this.compiled).length) {
                                return this;
                            }

                            this.options = this.modules.reduce(function (options, module) {
                                return module.optionsTransformer(options, _this4);
                            }, this.options);
                            this.options.xmlFileNames = uniq(this.options.xmlFileNames);
                            this.xmlDocuments = this.options.xmlFileNames.reduce(function (xmlDocuments, fileName) {
                                var content = _this4.zip.files[fileName].asText();

                                xmlDocuments[fileName] = str2xml(content);
                                return xmlDocuments;
                            }, {});
                            this.setModules({
                                zip: this.zip,
                                xmlDocuments: this.xmlDocuments
                            });
                            this.getTemplatedFiles(); // Loop inside all templatedFiles (ie xml files with content).
                            // Sometimes they don't exist (footer.xml for example)

                            this.templatedFiles.forEach(function (fileName) {
                                if (_this4.zip.files[fileName] != null) {
                                    _this4.precompileFile(fileName);
                                }
                            });
                            this.templatedFiles.forEach(function (fileName) {
                                if (_this4.zip.files[fileName] != null) {
                                    _this4.compileFile(fileName);
                                }
                            });
                            this.setModules({
                                compiled: this.compiled
                            });
                            verifyErrors(this);
                            return this;
                        }
                    }, {
                        key: "updateFileTypeConfig",
                        value: function updateFileTypeConfig() {
                            var _this5 = this;

                            var fileType;

                            if (this.zip.files.mimetype) {
                                fileType = "odt";
                            }

                            var contentTypes = this.zip.files[ctXML];
                            this.targets = [];
                            var contentTypeXml = contentTypes ? str2xml(contentTypes.asText()) : null;
                            var overrides = contentTypeXml ? contentTypeXml.getElementsByTagName("Override") : null;
                            var defaults = contentTypeXml ? contentTypeXml.getElementsByTagName("Default") : null;

                            if (contentTypeXml) {
                                this.filesContentTypes = collectContentTypes(overrides, defaults, this.zip);
                                this.invertedContentTypes = DocUtils.invertMap(this.filesContentTypes);
                                this.setModules({
                                    contentTypes: this.contentTypes,
                                    invertedContentTypes: this.invertedContentTypes
                                });
                            }

                            this.modules.forEach(function (module) {
                                fileType = module.getFileType({
                                    zip: _this5.zip,
                                    contentTypes: contentTypes,
                                    contentTypeXml: contentTypeXml,
                                    overrides: overrides,
                                    defaults: defaults,
                                    doc: _this5
                                }) || fileType;
                            });

                            if (fileType === "odt") {
                                throwFileTypeNotHandled(fileType);
                            }

                            if (!fileType) {
                                throwFileTypeNotIdentified();
                            }

                            this.fileType = fileType;
                            this.fileTypeConfig = this.options.fileTypeConfig || this.fileTypeConfig || Docxtemplater.FileTypeConfig[this.fileType]();
                            return this;
                        }
                    }, {
                        key: "renderAsync",
                        value: function renderAsync(data) {
                            var _this6 = this;

                            return this.resolveData(data).then(function () {
                                return _this6.render();
                            });
                        }
                    }, {
                        key: "render",
                        value: function render(data) {
                            var _this7 = this;

                            this.compile();

                            if (this.errors.length > 0) {
                                throwRenderInvalidTemplate();
                            }

                            if (data) {
                                this.setData(data);
                            }

                            this.setModules({
                                data: this.data,
                                Lexer: Lexer
                            });
                            this.mapper = this.mapper || this.modules.reduce(function (value, module) {
                                return module.getRenderedMap(value);
                            }, {});
                            Object.keys(this.mapper).forEach(function (to) {
                                var _this7$mapper$to = _this7.mapper[to],
                                    from = _this7$mapper$to.from,
                                    data = _this7$mapper$to.data;
                                var currentFile = _this7.compiled[from];
                                currentFile.scopeManager = _this7.getScopeManager(to, currentFile, data);
                                currentFile.render(to);

                                _this7.zip.file(to, currentFile.content, {
                                    createFolders: true
                                });
                            });
                            verifyErrors(this);
                            this.sendEvent("syncing-zip");
                            this.syncZip();
                            return this;
                        }
                    }, {
                        key: "syncZip",
                        value: function syncZip() {
                            var _this8 = this;

                            Object.keys(this.xmlDocuments).forEach(function (fileName) {
                                _this8.zip.remove(fileName);

                                var content = xml2str(_this8.xmlDocuments[fileName]);
                                return _this8.zip.file(fileName, content, {
                                    createFolders: true
                                });
                            });
                        }
                    }, {
                        key: "setData",
                        value: function setData(data) {
                            this.data = data;
                            return this;
                        }
                    }, {
                        key: "getZip",
                        value: function getZip() {
                            return this.zip;
                        }
                    }, {
                        key: "createTemplateClass",
                        value: function createTemplateClass(path) {
                            var content = this.zip.files[path].asText();
                            return this.createTemplateClassFromContent(content, path);
                        }
                    }, {
                        key: "createTemplateClassFromContent",
                        value: function createTemplateClassFromContent(content, filePath) {
                            var _this9 = this;

                            var xmltOptions = {
                                filePath: filePath,
                                contentType: this.filesContentTypes[filePath]
                            };
                            Object.keys(defaults).concat(["filesContentTypes", "fileTypeConfig", "fileType", "modules"]).forEach(function (key) {
                                xmltOptions[key] = _this9[key];
                            });
                            return new Docxtemplater.XmlTemplater(content, xmltOptions);
                        }
                    }, {
                        key: "getFullText",
                        value: function getFullText(path) {
                            return this.createTemplateClass(path || this.fileTypeConfig.textPath(this)).getFullText();
                        }
                    }, {
                        key: "getTemplatedFiles",
                        value: function getTemplatedFiles() {
                            var _this10 = this;

                            this.templatedFiles = this.fileTypeConfig.getTemplatedFiles(this.zip);
                            this.targets.forEach(function (target) {
                                _this10.templatedFiles.push(target);
                            });
                            this.templatedFiles = uniq(this.templatedFiles);
                            return this.templatedFiles;
                        }
                    }]);

                    return Docxtemplater;
                }();

                function verifyErrors(doc) {
                    var compiled = doc.compiled;
                    doc.errors = concatArrays(Object.keys(compiled).map(function (name) {
                        return compiled[name].allErrors;
                    }));

                    if (doc.errors.length !== 0) {
                        if (doc.options.errorLogging) {
                            logErrors(doc.errors, doc.options.errorLogging);
                        }

                        throwMultiError(doc.errors);
                    }
                }

                Docxtemplater.DocUtils = DocUtils;
                Docxtemplater.Errors = __webpack_require__(257);
                Docxtemplater.XmlTemplater = __webpack_require__(827);
                Docxtemplater.FileTypeConfig = __webpack_require__(952);
                Docxtemplater.XmlMatcher = __webpack_require__(465);
                module.exports = Docxtemplater;

                /***/
            }),

      /***/ 567:
      /***/ (function (module) {

                // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
                function replaceErrors(key, value) {
                    if (value instanceof Error) {
                        return Object.getOwnPropertyNames(value).concat("stack").reduce(function (error, key) {
                            error[key] = value[key];

                            if (key === "stack") {
                                // This is used because in Firefox, stack is not an own property
                                error[key] = value[key].toString();
                            }

                            return error;
                        }, {});
                    }

                    return value;
                }

                function logger(error, logging) {
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify({
                        error: error
                    }, replaceErrors, logging === "json" ? 2 : null));

                    if (error.properties && error.properties.errors instanceof Array) {
                        var errorMessages = error.properties.errors.map(function (error) {
                            return error.properties.explanation;
                        }).join("\n"); // eslint-disable-next-line no-console

                        console.log("errorMessages", errorMessages); // errorMessages is a humanly readable message looking like this :
                        // 'The tag beginning with "foobar" is unopened'
                    }
                }

                module.exports = logger;

                /***/
            }),

      /***/ 257:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

                function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

                function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

                var _require = __webpack_require__(287),
                    last = _require.last,
                    first = _require.first;

                function XTError(message) {
                    this.name = "GenericError";
                    this.message = message;
                    this.stack = new Error(message).stack;
                }

                XTError.prototype = Error.prototype;

                function XTTemplateError(message) {
                    this.name = "TemplateError";
                    this.message = message;
                    this.stack = new Error(message).stack;
                }

                XTTemplateError.prototype = new XTError();

                function XTRenderingError(message) {
                    this.name = "RenderingError";
                    this.message = message;
                    this.stack = new Error(message).stack;
                }

                XTRenderingError.prototype = new XTError();

                function XTScopeParserError(message) {
                    this.name = "ScopeParserError";
                    this.message = message;
                    this.stack = new Error(message).stack;
                }

                XTScopeParserError.prototype = new XTError();

                function XTInternalError(message) {
                    this.name = "InternalError";
                    this.properties = {
                        explanation: "InternalError"
                    };
                    this.message = message;
                    this.stack = new Error(message).stack;
                }

                XTInternalError.prototype = new XTError();

                function XTAPIVersionError(message) {
                    this.name = "APIVersionError";
                    this.properties = {
                        explanation: "APIVersionError"
                    };
                    this.message = message;
                    this.stack = new Error(message).stack;
                }

                XTAPIVersionError.prototype = new XTError();

                function throwApiVersionError(msg, properties) {
                    var err = new XTAPIVersionError(msg);
                    err.properties = _objectSpread({
                        id: "api_version_error"
                    }, properties);
                    throw err;
                }

                function throwMultiError(errors) {
                    var err = new XTTemplateError("Multi error");
                    err.properties = {
                        errors: errors,
                        id: "multi_error",
                        explanation: "The template has multiple errors"
                    };
                    throw err;
                }

                function getUnopenedTagException(options) {
                    var err = new XTTemplateError("Unopened tag");
                    err.properties = {
                        xtag: last(options.xtag.split(" ")),
                        id: "unopened_tag",
                        context: options.xtag,
                        offset: options.offset,
                        lIndex: options.lIndex,
                        explanation: "The tag beginning with \"".concat(options.xtag.substr(0, 10), "\" is unopened")
                    };
                    return err;
                }

                function getDuplicateOpenTagException(options) {
                    var err = new XTTemplateError("Duplicate open tag, expected one open tag");
                    err.properties = {
                        xtag: first(options.xtag.split(" ")),
                        id: "duplicate_open_tag",
                        context: options.xtag,
                        offset: options.offset,
                        lIndex: options.lIndex,
                        explanation: "The tag beginning with \"".concat(options.xtag.substr(0, 10), "\" has duplicate open tags")
                    };
                    return err;
                }

                function getDuplicateCloseTagException(options) {
                    var err = new XTTemplateError("Duplicate close tag, expected one close tag");
                    err.properties = {
                        xtag: first(options.xtag.split(" ")),
                        id: "duplicate_close_tag",
                        context: options.xtag,
                        offset: options.offset,
                        lIndex: options.lIndex,
                        explanation: "The tag ending with \"".concat(options.xtag.substr(0, 10), "\" has duplicate close tags")
                    };
                    return err;
                }

                function getUnclosedTagException(options) {
                    var err = new XTTemplateError("Unclosed tag");
                    err.properties = {
                        xtag: first(options.xtag.split(" ")).substr(1),
                        id: "unclosed_tag",
                        context: options.xtag,
                        offset: options.offset,
                        lIndex: options.lIndex,
                        explanation: "The tag beginning with \"".concat(options.xtag.substr(0, 10), "\" is unclosed")
                    };
                    return err;
                }

                function throwXmlTagNotFound(options) {
                    var err = new XTTemplateError("No tag \"".concat(options.element, "\" was found at the ").concat(options.position));
                    var part = options.parsed[options.index];
                    err.properties = {
                        id: "no_xml_tag_found_at_".concat(options.position),
                        explanation: "No tag \"".concat(options.element, "\" was found at the ").concat(options.position),
                        offset: part.offset,
                        part: part,
                        parsed: options.parsed,
                        index: options.index,
                        element: options.element
                    };
                    throw err;
                }

                function getCorruptCharactersException(_ref) {
                    var tag = _ref.tag,
                        value = _ref.value,
                        offset = _ref.offset;
                    var err = new XTRenderingError("There are some XML corrupt characters");
                    err.properties = {
                        id: "invalid_xml_characters",
                        xtag: tag,
                        value: value,
                        offset: offset,
                        explanation: "There are some corrupt characters for the field ".concat(tag)
                    };
                    return err;
                }

                function getInvalidRawXMLValueException(_ref2) {
                    var tag = _ref2.tag,
                        value = _ref2.value,
                        offset = _ref2.offset;
                    var err = new XTRenderingError("Non string values are not allowed for rawXML tags");
                    err.properties = {
                        id: "invalid_raw_xml_value",
                        xtag: tag,
                        value: value,
                        offset: offset,
                        explanation: "The value of the raw tag : '".concat(tag, "' is not a string")
                    };
                    return err;
                }

                function throwExpandNotFound(options) {
                    var _options$part = options.part,
                        value = _options$part.value,
                        offset = _options$part.offset,
                        _options$id = options.id,
                        id = _options$id === void 0 ? "raw_tag_outerxml_invalid" : _options$id,
                        _options$message = options.message,
                        message = _options$message === void 0 ? "Raw tag not in paragraph" : _options$message;
                    var part = options.part;
                    var _options$explanation = options.explanation,
                        explanation = _options$explanation === void 0 ? "The tag \"".concat(value, "\" is not inside a paragraph") : _options$explanation;

                    if (typeof explanation === "function") {
                        explanation = explanation(part);
                    }

                    var err = new XTTemplateError(message);
                    err.properties = {
                        id: id,
                        explanation: explanation,
                        rootError: options.rootError,
                        xtag: value,
                        offset: offset,
                        postparsed: options.postparsed,
                        expandTo: options.expandTo,
                        index: options.index
                    };
                    throw err;
                }

                function throwRawTagShouldBeOnlyTextInParagraph(options) {
                    var err = new XTTemplateError("Raw tag should be the only text in paragraph");
                    var tag = options.part.value;
                    err.properties = {
                        id: "raw_xml_tag_should_be_only_text_in_paragraph",
                        explanation: "The raw tag \"".concat(tag, "\" should be the only text in this paragraph. This means that this tag should not be surrounded by any text or spaces."),
                        xtag: tag,
                        offset: options.part.offset,
                        paragraphParts: options.paragraphParts
                    };
                    throw err;
                }

                function getUnmatchedLoopException(part) {
                    var location = part.location,
                        offset = part.offset;
                    var t = location === "start" ? "unclosed" : "unopened";
                    var T = location === "start" ? "Unclosed" : "Unopened";
                    var err = new XTTemplateError("".concat(T, " loop"));
                    var tag = part.value;
                    err.properties = {
                        id: "".concat(t, "_loop"),
                        explanation: "The loop with tag \"".concat(tag, "\" is ").concat(t),
                        xtag: tag,
                        offset: offset
                    };
                    return err;
                }

                function getUnbalancedLoopException(pair, lastPair) {
                    var err = new XTTemplateError("Unbalanced loop tag");
                    var lastL = lastPair[0].part.value;
                    var lastR = lastPair[1].part.value;
                    var l = pair[0].part.value;
                    var r = pair[1].part.value;
                    err.properties = {
                        id: "unbalanced_loop_tags",
                        explanation: "Unbalanced loop tags {#".concat(lastL, "}{/").concat(lastR, "}{#").concat(l, "}{/").concat(r, "}"),
                        offset: [lastPair[0].part.offset, pair[1].part.offset],
                        lastPair: {
                            left: lastPair[0].part.value,
                            right: lastPair[1].part.value
                        },
                        pair: {
                            left: pair[0].part.value,
                            right: pair[1].part.value
                        }
                    };
                    return err;
                }

                function getClosingTagNotMatchOpeningTag(_ref3) {
                    var tags = _ref3.tags;
                    var err = new XTTemplateError("Closing tag does not match opening tag");
                    err.properties = {
                        id: "closing_tag_does_not_match_opening_tag",
                        explanation: "The tag \"".concat(tags[0].value, "\" is closed by the tag \"").concat(tags[1].value, "\""),
                        openingtag: first(tags).value,
                        offset: [first(tags).offset, last(tags).offset],
                        closingtag: last(tags).value
                    };
                    return err;
                }

                function getScopeCompilationError(_ref4) {
                    var tag = _ref4.tag,
                        rootError = _ref4.rootError,
                        offset = _ref4.offset;
                    var err = new XTScopeParserError("Scope parser compilation failed");
                    err.properties = {
                        id: "scopeparser_compilation_failed",
                        offset: offset,
                        xtag: tag,
                        explanation: "The scope parser for the tag \"".concat(tag, "\" failed to compile"),
                        rootError: rootError
                    };
                    return err;
                }

                function getScopeParserExecutionError(_ref5) {
                    var tag = _ref5.tag,
                        scope = _ref5.scope,
                        error = _ref5.error,
                        offset = _ref5.offset;
                    var err = new XTScopeParserError("Scope parser execution failed");
                    err.properties = {
                        id: "scopeparser_execution_failed",
                        explanation: "The scope parser for the tag ".concat(tag, " failed to execute"),
                        scope: scope,
                        offset: offset,
                        xtag: tag,
                        rootError: error
                    };
                    return err;
                }

                function getLoopPositionProducesInvalidXMLError(_ref6) {
                    var tag = _ref6.tag,
                        offset = _ref6.offset;
                    var err = new XTTemplateError("The position of the loop tags \"".concat(tag, "\" would produce invalid XML"));
                    err.properties = {
                        xtag: tag,
                        id: "loop_position_invalid",
                        explanation: "The tags \"".concat(tag, "\" are misplaced in the document, for example one of them is in a table and the other one outside the table"),
                        offset: offset
                    };
                    return err;
                }

                function throwUnimplementedTagType(part, index) {
                    var errorMsg = "Unimplemented tag type \"".concat(part.type, "\"");

                    if (part.module) {
                        errorMsg += " \"".concat(part.module, "\"");
                    }

                    var err = new XTTemplateError(errorMsg);
                    err.properties = {
                        part: part,
                        index: index,
                        id: "unimplemented_tag_type"
                    };
                    throw err;
                }

                function throwMalformedXml() {
                    var err = new XTInternalError("Malformed xml");
                    err.properties = {
                        explanation: "The template contains malformed xml",
                        id: "malformed_xml"
                    };
                    throw err;
                }

                function throwResolveBeforeCompile() {
                    var err = new XTInternalError("You must run `.compile()` before running `.resolveData()`");
                    err.properties = {
                        id: "resolve_before_compile",
                        explanation: "You must run `.compile()` before running `.resolveData()`"
                    };
                    throw err;
                }

                function throwRenderInvalidTemplate() {
                    var err = new XTInternalError("You should not call .render on a document that had compilation errors");
                    err.properties = {
                        id: "render_on_invalid_template",
                        explanation: "You should not call .render on a document that had compilation errors"
                    };
                    throw err;
                }

                function throwFileTypeNotIdentified() {
                    var err = new XTInternalError("The filetype for this file could not be identified, is this file corrupted ?");
                    err.properties = {
                        id: "filetype_not_identified",
                        explanation: "The filetype for this file could not be identified, is this file corrupted ?"
                    };
                    throw err;
                }

                function throwXmlInvalid(content, offset) {
                    var err = new XTTemplateError("An XML file has invalid xml");
                    err.properties = {
                        id: "file_has_invalid_xml",
                        content: content,
                        offset: offset,
                        explanation: "The docx contains invalid XML, it is most likely corrupt"
                    };
                    throw err;
                }

                function throwFileTypeNotHandled(fileType) {
                    var err = new XTInternalError("The filetype \"".concat(fileType, "\" is not handled by docxtemplater"));
                    err.properties = {
                        id: "filetype_not_handled",
                        explanation: "The file you are trying to generate is of type \"".concat(fileType, "\", but only docx and pptx formats are handled"),
                        fileType: fileType
                    };
                    throw err;
                }

                module.exports = {
                    XTError: XTError,
                    XTTemplateError: XTTemplateError,
                    XTInternalError: XTInternalError,
                    XTScopeParserError: XTScopeParserError,
                    XTAPIVersionError: XTAPIVersionError,
                    // Remove this alias in v4
                    RenderingError: XTRenderingError,
                    XTRenderingError: XTRenderingError,
                    getClosingTagNotMatchOpeningTag: getClosingTagNotMatchOpeningTag,
                    getLoopPositionProducesInvalidXMLError: getLoopPositionProducesInvalidXMLError,
                    getScopeCompilationError: getScopeCompilationError,
                    getScopeParserExecutionError: getScopeParserExecutionError,
                    getUnclosedTagException: getUnclosedTagException,
                    getUnopenedTagException: getUnopenedTagException,
                    getUnmatchedLoopException: getUnmatchedLoopException,
                    getDuplicateCloseTagException: getDuplicateCloseTagException,
                    getDuplicateOpenTagException: getDuplicateOpenTagException,
                    getCorruptCharactersException: getCorruptCharactersException,
                    getInvalidRawXMLValueException: getInvalidRawXMLValueException,
                    getUnbalancedLoopException: getUnbalancedLoopException,
                    throwApiVersionError: throwApiVersionError,
                    throwFileTypeNotHandled: throwFileTypeNotHandled,
                    throwFileTypeNotIdentified: throwFileTypeNotIdentified,
                    throwMalformedXml: throwMalformedXml,
                    throwMultiError: throwMultiError,
                    throwExpandNotFound: throwExpandNotFound,
                    throwRawTagShouldBeOnlyTextInParagraph: throwRawTagShouldBeOnlyTextInParagraph,
                    throwUnimplementedTagType: throwUnimplementedTagType,
                    throwXmlTagNotFound: throwXmlTagNotFound,
                    throwXmlInvalid: throwXmlInvalid,
                    throwResolveBeforeCompile: throwResolveBeforeCompile,
                    throwRenderInvalidTemplate: throwRenderInvalidTemplate
                };

                /***/
            }),

      /***/ 952:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                var loopModule = __webpack_require__(19);

                var spacePreserveModule = __webpack_require__(95);

                var rawXmlModule = __webpack_require__(182);

                var expandPairTrait = __webpack_require__(999);

                var render = __webpack_require__(163);

                function DocXFileTypeConfig() {
                    return {
                        getTemplatedFiles: function getTemplatedFiles() {
                            return [];
                        },
                        textPath: function textPath(doc) {
                            return doc.targets[0];
                        },
                        tagsXmlTextArray: ["Company", "HyperlinkBase", "Manager", "cp:category", "cp:keywords", "dc:creator", "dc:description", "dc:subject", "dc:title", "w:t", "m:t", "vt:lpstr", "vt:lpwstr"],
                        tagsXmlLexedArray: ["w:proofState", "w:tc", "w:tr", "w:table", "w:p", "w:r", "w:br", "w:rPr", "w:pPr", "w:spacing", "w:sdtContent", "w:drawing", "w:sectPr", "w:type", "w:headerReference", "w:footerReference"],
                        expandTags: [{
                            contains: "w:tc",
                            expand: "w:tr"
                        }],
                        onParagraphLoop: [{
                            contains: "w:p",
                            expand: "w:p",
                            onlyTextInTag: true
                        }],
                        tagRawXml: "w:p",
                        baseModules: [loopModule, spacePreserveModule, expandPairTrait, rawXmlModule, render],
                        tagShouldContain: [{
                            tag: "w:tc",
                            shouldContain: ["w:p"],
                            value: "<w:p></w:p>"
                        }, {
                            tag: "w:sdtContent",
                            shouldContain: ["w:p", "w:r"],
                            value: "<w:p></w:p>"
                        }]
                    };
                }

                function PptXFileTypeConfig() {
                    return {
                        getTemplatedFiles: function getTemplatedFiles() {
                            return [];
                        },
                        textPath: function textPath(doc) {
                            return doc.targets[0];
                        },
                        tagsXmlTextArray: ["Company", "HyperlinkBase", "Manager", "cp:category", "cp:keywords", "dc:creator", "dc:description", "dc:subject", "dc:title", "a:t", "m:t", "vt:lpstr", "vt:lpwstr"],
                        tagsXmlLexedArray: ["p:sp", "a:tc", "a:tr", "a:table", "a:p", "a:r", "a:rPr", "p:txBody", "a:txBody", "a:off", "a:ext", "p:graphicFrame", "p:xfrm", "a16:rowId"],
                        expandTags: [{
                            contains: "a:tc",
                            expand: "a:tr"
                        }],
                        onParagraphLoop: [{
                            contains: "a:p",
                            expand: "a:p",
                            onlyTextInTag: true
                        }],
                        tagRawXml: "p:sp",
                        baseModules: [loopModule, expandPairTrait, rawXmlModule, render],
                        tagShouldContain: [{
                            tag: "p:txBody",
                            shouldContain: ["a:p"],
                            value: "<a:p></a:p>"
                        }, {
                            tag: "a:txBody",
                            shouldContain: ["a:p"],
                            value: "<a:p></a:p>"
                        }]
                    };
                }

                module.exports = {
                    docx: DocXFileTypeConfig,
                    pptx: PptXFileTypeConfig
                };

                /***/
            }),

      /***/ 330:
      /***/ (function (module) {

                var docxContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml";
                var docxmContentType = "application/vnd.ms-word.document.macroEnabled.main+xml";
                var dotxContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml";
                var dotmContentType = "application/vnd.ms-word.template.macroEnabledTemplate.main+xml";
                var headerContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml";
                var footerContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml";
                var pptxContentType = "application/vnd.openxmlformats-officedocument.presentationml.slide+xml";
                var pptxSlideMaster = "application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml";
                var pptxSlideLayout = "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml";
                var pptxPresentationContentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml";
                var main = [docxContentType, docxmContentType, dotxContentType, dotmContentType];
                var filetypes = {
                    main: main,
                    docx: [].concat(main, [headerContentType, footerContentType]),
                    pptx: [pptxContentType, pptxSlideMaster, pptxSlideLayout, pptxPresentationContentType]
                };
                module.exports = filetypes;

                /***/
            }),

      /***/ 127:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                var _require = __webpack_require__(557),
                    startsWith = _require.startsWith,
                    endsWith = _require.endsWith,
                    isStarting = _require.isStarting,
                    isEnding = _require.isEnding,
                    isWhiteSpace = _require.isWhiteSpace;

                var filetypes = __webpack_require__(330);

                function addEmptyParagraphAfterTable(parts) {
                    var lastNonEmpty = "";

                    for (var i = 0, len = parts.length; i < len; i++) {
                        var p = parts[i];

                        if (isWhiteSpace(p)) {
                            continue;
                        }

                        if (endsWith(lastNonEmpty, "</w:tbl>")) {
                            if (!startsWith(p, "<w:p") && !startsWith(p, "<w:tbl") && !startsWith(p, "<w:sectPr")) {
                                p = "<w:p/>".concat(p);
                            }
                        }

                        lastNonEmpty = p;
                        parts[i] = p;
                    }

                    return parts;
                } // eslint-disable-next-line complexity


                function joinUncorrupt(parts, options) {
                    var contains = options.fileTypeConfig.tagShouldContain || [];
                    /* Before doing this "uncorruption" method here, this was done with the
                     * `part.emptyValue` trick, however, there were some corruptions that were
                     * not handled, for example with a template like this :
                     *
                     * ------------------------------------------------
                     * | {-w:p falsy}My para{/falsy}   |              |
                     * | {-w:p falsy}My para{/falsy}   |              |
                     */

                    var collecting = "";
                    var currentlyCollecting = -1;

                    if (filetypes.docx.indexOf(options.contentType) !== -1) {
                        parts = addEmptyParagraphAfterTable(parts);
                    }

                    for (var i = 0, len = parts.length; i < len; i++) {
                        var part = parts[i];

                        for (var j = 0, len2 = contains.length; j < len2; j++) {
                            var _contains$j = contains[j],
                                tag = _contains$j.tag,
                                shouldContain = _contains$j.shouldContain,
                                value = _contains$j.value;

                            if (currentlyCollecting === j) {
                                if (isEnding(part, tag)) {
                                    currentlyCollecting = -1;
                                    parts[i] = collecting + value + part;
                                    break;
                                }

                                collecting += part;

                                for (var k = 0, len3 = shouldContain.length; k < len3; k++) {
                                    var sc = shouldContain[k];

                                    if (isStarting(part, sc)) {
                                        currentlyCollecting = -1;
                                        parts[i] = collecting;
                                        break;
                                    }
                                }

                                if (currentlyCollecting > -1) {
                                    parts[i] = "";
                                }

                                break;
                            }

                            if (currentlyCollecting === -1 && isStarting(part, tag) && // to verify that the part doesn't have multiple tags, such as <w:tc><w:p>
                                part.substr(1).indexOf("<") === -1) {
                                // self-closing tag such as <w:t/>
                                if (part[part.length - 2] === "/") {
                                    parts[i] = "";
                                    break;
                                } else {
                                    currentlyCollecting = j;
                                    collecting = part;
                                    parts[i] = "";
                                    break;
                                }
                            }
                        }
                    }

                    return parts;
                }

                module.exports = joinUncorrupt;

                /***/
            }),

      /***/ 303:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

                function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

                function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

                function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

                function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

                var _require = __webpack_require__(257),
                    getUnclosedTagException = _require.getUnclosedTagException,
                    getUnopenedTagException = _require.getUnopenedTagException,
                    getDuplicateOpenTagException = _require.getDuplicateOpenTagException,
                    getDuplicateCloseTagException = _require.getDuplicateCloseTagException,
                    throwMalformedXml = _require.throwMalformedXml,
                    throwXmlInvalid = _require.throwXmlInvalid,
                    XTTemplateError = _require.XTTemplateError;

                var _require2 = __webpack_require__(557),
                    isTextStart = _require2.isTextStart,
                    isTextEnd = _require2.isTextEnd,
                    wordToUtf8 = _require2.wordToUtf8;

                var DELIMITER_NONE = 0,
                    DELIMITER_EQUAL = 1,
                    DELIMITER_START = 2,
                    DELIMITER_END = 3;

                function inRange(range, match) {
                    return range[0] <= match.offset && match.offset < range[1];
                }

                function updateInTextTag(part, inTextTag) {
                    if (isTextStart(part)) {
                        if (inTextTag) {
                            throwMalformedXml();
                        }

                        return true;
                    }

                    if (isTextEnd(part)) {
                        if (!inTextTag) {
                            throwMalformedXml();
                        }

                        return false;
                    }

                    return inTextTag;
                }

                function getTag(tag) {
                    var position = "";
                    var start = 1;
                    var end = tag.indexOf(" ");

                    if (tag[tag.length - 2] === "/") {
                        position = "selfclosing";

                        if (end === -1) {
                            end = tag.length - 2;
                        }
                    } else if (tag[1] === "/") {
                        start = 2;
                        position = "end";

                        if (end === -1) {
                            end = tag.length - 1;
                        }
                    } else {
                        position = "start";

                        if (end === -1) {
                            end = tag.length - 1;
                        }
                    }

                    return {
                        tag: tag.slice(start, end),
                        position: position
                    };
                }

                function tagMatcher(content, textMatchArray, othersMatchArray) {
                    var cursor = 0;
                    var contentLength = content.length;
                    var allMatches = {};

                    for (var i = 0, len = textMatchArray.length; i < len; i++) {
                        allMatches[textMatchArray[i]] = true;
                    }

                    for (var _i = 0, _len = othersMatchArray.length; _i < _len; _i++) {
                        allMatches[othersMatchArray[_i]] = false;
                    }

                    var totalMatches = [];

                    while (cursor < contentLength) {
                        cursor = content.indexOf("<", cursor);

                        if (cursor === -1) {
                            break;
                        }

                        var offset = cursor;
                        var nextOpening = content.indexOf("<", cursor + 1);
                        cursor = content.indexOf(">", cursor);

                        if (cursor === -1 || nextOpening !== -1 && cursor > nextOpening) {
                            throwXmlInvalid(content, offset);
                        }

                        var tagText = content.slice(offset, cursor + 1);

                        var _getTag = getTag(tagText),
                            tag = _getTag.tag,
                            position = _getTag.position;

                        var text = allMatches[tag];

                        if (text == null) {
                            continue;
                        }

                        totalMatches.push({
                            type: "tag",
                            position: position,
                            text: text,
                            offset: offset,
                            value: tagText,
                            tag: tag
                        });
                    }

                    return totalMatches;
                }

                function getDelimiterErrors(delimiterMatches, fullText) {
                    var errors = [];
                    var inDelimiter = false;
                    var lastDelimiterMatch = {
                        offset: 0
                    };
                    var xtag;
                    delimiterMatches.forEach(function (delimiterMatch) {
                        xtag = fullText.substr(lastDelimiterMatch.offset, delimiterMatch.offset - lastDelimiterMatch.offset);

                        if (delimiterMatch.position === "start" && inDelimiter || delimiterMatch.position === "end" && !inDelimiter) {
                            if (delimiterMatch.position === "start") {
                                if (lastDelimiterMatch.offset + lastDelimiterMatch.length === delimiterMatch.offset) {
                                    xtag = fullText.substr(lastDelimiterMatch.offset, delimiterMatch.offset - lastDelimiterMatch.offset + lastDelimiterMatch.length + 4);
                                    errors.push(getDuplicateOpenTagException({
                                        xtag: xtag,
                                        offset: lastDelimiterMatch.offset
                                    }));
                                } else {
                                    errors.push(getUnclosedTagException({
                                        xtag: wordToUtf8(xtag),
                                        offset: lastDelimiterMatch.offset
                                    }));
                                }

                                delimiterMatch.error = true;
                            } else {
                                if (lastDelimiterMatch.offset + lastDelimiterMatch.length === delimiterMatch.offset) {
                                    xtag = fullText.substr(lastDelimiterMatch.offset - 4, delimiterMatch.offset - lastDelimiterMatch.offset + 4 + lastDelimiterMatch.length);
                                    errors.push(getDuplicateCloseTagException({
                                        xtag: xtag,
                                        offset: lastDelimiterMatch.offset
                                    }));
                                } else {
                                    errors.push(getUnopenedTagException({
                                        xtag: xtag,
                                        offset: delimiterMatch.offset
                                    }));
                                }

                                delimiterMatch.error = true;
                            }
                        } else {
                            inDelimiter = !inDelimiter;
                        }

                        lastDelimiterMatch = delimiterMatch;
                    });
                    var delimiterMatch = {
                        offset: fullText.length
                    };
                    xtag = fullText.substr(lastDelimiterMatch.offset, delimiterMatch.offset - lastDelimiterMatch.offset);

                    if (inDelimiter) {
                        errors.push(getUnclosedTagException({
                            xtag: wordToUtf8(xtag),
                            offset: lastDelimiterMatch.offset
                        }));
                        delimiterMatch.error = true;
                    }

                    return errors;
                }

                function compareOffsets(startOffset, endOffset) {
                    if (startOffset === -1 && endOffset === -1) {
                        return DELIMITER_NONE;
                    }

                    if (startOffset === endOffset) {
                        return DELIMITER_EQUAL;
                    }

                    if (startOffset === -1 || endOffset === -1) {
                        return endOffset < startOffset ? DELIMITER_START : DELIMITER_END;
                    }

                    return startOffset < endOffset ? DELIMITER_START : DELIMITER_END;
                }

                function splitDelimiters(inside) {
                    var newDelimiters = inside.split(" ");

                    if (newDelimiters.length !== 2) {
                        var err = new XTTemplateError("New Delimiters cannot be parsed");
                        err.properties = {
                            id: "change_delimiters_invalid",
                            explanation: "Cannot parser delimiters"
                        };
                        throw err;
                    }

                    var _newDelimiters = _slicedToArray(newDelimiters, 2),
                        start = _newDelimiters[0],
                        end = _newDelimiters[1];

                    if (start.length === 0 || end.length === 0) {
                        var err = new XTTemplateError("New Delimiters cannot be parsed");
                        err.properties = {
                            id: "change_delimiters_invalid",
                            explanation: "Cannot parser delimiters"
                        };
                        throw err;
                    }

                    return [start, end];
                }

                function getAllDelimiterIndexes(fullText, delimiters) {
                    var indexes = [];
                    var start = delimiters.start,
                        end = delimiters.end;
                    var offset = -1;
                    var insideTag = false;

                    while (true) {
                        var startOffset = fullText.indexOf(start, offset + 1);
                        var endOffset = fullText.indexOf(end, offset + 1);
                        var position = null;
                        var len = void 0;
                        var compareResult = compareOffsets(startOffset, endOffset);

                        if (compareResult === DELIMITER_EQUAL) {
                            compareResult = insideTag ? DELIMITER_END : DELIMITER_START;
                        }

                        switch (compareResult) {
                            case DELIMITER_NONE:
                                return indexes;

                            case DELIMITER_END:
                                insideTag = false;
                                offset = endOffset;
                                position = "end";
                                len = end.length;
                                break;

                            case DELIMITER_START:
                                insideTag = true;
                                offset = startOffset;
                                position = "start";
                                len = start.length;
                                break;
                        } // if tag starts with =, such as {=[ ]=}


                        if (DELIMITER_START && fullText[offset + start.length] === "=") {
                            indexes.push({
                                offset: startOffset,
                                position: "start",
                                length: start.length,
                                changedelimiter: true
                            });
                            var nextEqual = fullText.indexOf("=", offset + start.length + 1);
                            var nextEndOffset = fullText.indexOf(end, nextEqual + 1);
                            indexes.push({
                                offset: nextEndOffset,
                                position: "end",
                                length: end.length,
                                changedelimiter: true
                            });

                            var _insideTag = fullText.substr(offset + start.length + 1, nextEqual - offset - start.length - 1);

                            var _splitDelimiters = splitDelimiters(_insideTag);

                            var _splitDelimiters2 = _slicedToArray(_splitDelimiters, 2);

                            start = _splitDelimiters2[0];
                            end = _splitDelimiters2[1];
                            offset = nextEndOffset;
                            continue;
                        }

                        indexes.push({
                            offset: offset,
                            position: position,
                            length: len
                        });
                    }
                }

                function parseDelimiters(innerContentParts, delimiters) {
                    var full = innerContentParts.map(function (p) {
                        return p.value;
                    }).join("");
                    var delimiterMatches = getAllDelimiterIndexes(full, delimiters);
                    var offset = 0;
                    var ranges = innerContentParts.map(function (part) {
                        offset += part.value.length;
                        return {
                            offset: offset - part.value.length,
                            lIndex: part.lIndex
                        };
                    });
                    var errors = getDelimiterErrors(delimiterMatches, full, ranges);
                    var cutNext = 0;
                    var delimiterIndex = 0;
                    var parsed = ranges.map(function (p, i) {
                        var offset = p.offset;
                        var range = [offset, offset + innerContentParts[i].value.length];
                        var partContent = innerContentParts[i].value;
                        var delimitersInOffset = [];

                        while (delimiterIndex < delimiterMatches.length && inRange(range, delimiterMatches[delimiterIndex])) {
                            delimitersInOffset.push(delimiterMatches[delimiterIndex]);
                            delimiterIndex++;
                        }

                        var parts = [];
                        var cursor = 0;

                        if (cutNext > 0) {
                            cursor = cutNext;
                            cutNext = 0;
                        }

                        delimitersInOffset.forEach(function (delimiterInOffset) {
                            var value = partContent.substr(cursor, delimiterInOffset.offset - offset - cursor);

                            if (delimiterInOffset.changedelimiter) {
                                if (delimiterInOffset.position === "start") {
                                    if (value.length > 0) {
                                        parts.push({
                                            type: "content",
                                            value: value
                                        });
                                    }
                                } else {
                                    cursor = delimiterInOffset.offset - offset + delimiterInOffset.length;
                                }

                                return;
                            }

                            if (value.length > 0) {
                                parts.push({
                                    type: "content",
                                    value: value
                                });
                                cursor += value.length;
                            }

                            var delimiterPart = {
                                type: "delimiter",
                                position: delimiterInOffset.position,
                                offset: cursor + offset
                            };
                            parts.push(delimiterPart);
                            cursor = delimiterInOffset.offset - offset + delimiterInOffset.length;
                        });
                        cutNext = cursor - partContent.length;
                        var value = partContent.substr(cursor);

                        if (value.length > 0) {
                            parts.push({
                                type: "content",
                                value: value
                            });
                        }

                        return parts;
                    }, this);
                    return {
                        parsed: parsed,
                        errors: errors
                    };
                }

                function isInsideContent(part) {
                    // Stryker disable all : because the part.position === "insidetag" would be enough but we want to make the API future proof
                    return part.type === "content" && part.position === "insidetag"; // Stryker restore all
                }

                function getContentParts(xmlparsed) {
                    return xmlparsed.filter(isInsideContent);
                }

                function decodeContentParts(xmlparsed) {
                    var inTextTag = false;
                    xmlparsed.forEach(function (part) {
                        inTextTag = updateInTextTag(part, inTextTag);

                        if (part.type === "content") {
                            part.position = inTextTag ? "insidetag" : "outsidetag";
                        }

                        if (isInsideContent(part)) {
                            part.value = part.value.replace(/>/g, "&gt;"); // if (inTextTag) {
                            // 	part.value = wordToUtf8(part.value);
                            // }
                        }
                    });
                }

                module.exports = {
                    parseDelimiters: parseDelimiters,
                    parse: function parse(xmlparsed, delimiters) {
                        decodeContentParts(xmlparsed);

                        var _parseDelimiters = parseDelimiters(getContentParts(xmlparsed), delimiters),
                            delimiterParsed = _parseDelimiters.parsed,
                            errors = _parseDelimiters.errors;

                        var lexed = [];
                        var index = 0;
                        var lIndex = 0;
                        xmlparsed.forEach(function (part) {
                            if (isInsideContent(part)) {
                                Array.prototype.push.apply(lexed, delimiterParsed[index].map(function (p) {
                                    if (p.type === "content") {
                                        p.position = "insidetag";
                                    }

                                    p.lIndex = lIndex++;
                                    return p;
                                }));
                                index++;
                            } else {
                                part.lIndex = lIndex++;
                                lexed.push(part);
                            }
                        });
                        return {
                            errors: errors,
                            lexed: lexed
                        };
                    },
                    xmlparse: function xmlparse(content, xmltags) {
                        var matches = tagMatcher(content, xmltags.text, xmltags.other);
                        var cursor = 0;
                        var parsed = matches.reduce(function (parsed, match) {
                            var value = content.substr(cursor, match.offset - cursor);

                            if (value.length > 0) {
                                parsed.push({
                                    type: "content",
                                    value: value
                                });
                            }

                            cursor = match.offset + match.value.length;
                            delete match.offset;
                            parsed.push(match);
                            return parsed;
                        }, []);
                        var value = content.substr(cursor);

                        if (value.length > 0) {
                            parsed.push({
                                type: "content",
                                value: value
                            });
                        }

                        return parsed;
                    }
                };

                /***/
            }),

      /***/ 509:
      /***/ (function (module) {

                function getMinFromArrays(arrays, state) {
                    var minIndex = -1;

                    for (var i = 0, l = arrays.length; i < l; i++) {
                        if (state[i] >= arrays[i].length) {
                            continue;
                        }

                        if (minIndex === -1 || arrays[i][state[i]].offset < arrays[minIndex][state[minIndex]].offset) {
                            minIndex = i;
                        }
                    }

                    return minIndex;
                }

                module.exports = function (arrays) {
                    var totalLength = arrays.reduce(function (sum, array) {
                        return sum + array.length;
                    }, 0);
                    arrays = arrays.filter(function (array) {
                        return array.length > 0;
                    });
                    var resultArray = new Array(totalLength);
                    var state = arrays.map(function () {
                        return 0;
                    });

                    for (var i = 0; i < totalLength; i++) {
                        var arrayIndex = getMinFromArrays(arrays, state);
                        resultArray[i] = arrays[arrayIndex][state[arrayIndex]];
                        state[arrayIndex]++;
                    }

                    return resultArray;
                };

                /***/
            }),

      /***/ 223:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                var _require = __webpack_require__(257),
                    XTInternalError = _require.XTInternalError;

                function emptyFun() { }

                function identity(i) {
                    return i;
                }

                module.exports = function (module) {
                    var defaults = {
                        set: emptyFun,
                        matchers: function matchers() {
                            return [];
                        },
                        parse: emptyFun,
                        render: emptyFun,
                        getTraits: emptyFun,
                        getFileType: emptyFun,
                        nullGetter: emptyFun,
                        optionsTransformer: identity,
                        postrender: identity,
                        errorsTransformer: identity,
                        getRenderedMap: identity,
                        preparse: identity,
                        postparse: identity,
                        on: emptyFun,
                        resolve: emptyFun
                    };

                    if (Object.keys(defaults).every(function (key) {
                        return !module[key];
                    })) {
                        var err = new XTInternalError("This module cannot be wrapped, because it doesn't define any of the necessary functions");
                        err.properties = {
                            id: "module_cannot_be_wrapped",
                            explanation: "This module cannot be wrapped, because it doesn't define any of the necessary functions"
                        };
                        throw err;
                    }

                    Object.keys(defaults).forEach(function (key) {
                        module[key] = module[key] || defaults[key];
                    });
                    return module;
                };

                /***/
            }),

      /***/ 107:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

                function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

                var wrapper = __webpack_require__(223);

                var filetypes = __webpack_require__(330);

                var coreContentType = "application/vnd.openxmlformats-package.core-properties+xml";
                var appContentType = "application/vnd.openxmlformats-officedocument.extended-properties+xml";
                var customContentType = "application/vnd.openxmlformats-officedocument.custom-properties+xml";
                var settingsContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml";
                var commonContentTypes = [settingsContentType, coreContentType, appContentType, customContentType];

                var Common = /*#__PURE__*/function () {
                    function Common() {
                        _classCallCheck(this, Common);

                        this.name = "Common";
                    }

                    _createClass(Common, [{
                        key: "getFileType",
                        value: function getFileType(_ref) {
                            var doc = _ref.doc;
                            var invertedContentTypes = doc.invertedContentTypes;

                            if (!invertedContentTypes) {
                                return;
                            }

                            var keys = Object.keys(filetypes);
                            var ftCandidate;

                            for (var i = 0, len = keys.length; i < len; i++) {
                                var contentTypes = filetypes[keys[i]];

                                for (var j = 0, len2 = contentTypes.length; j < len2; j++) {
                                    var ct = contentTypes[j];

                                    if (invertedContentTypes[ct]) {
                                        ftCandidate = keys[i];
                                        Array.prototype.push.apply(doc.targets, invertedContentTypes[ct]);
                                    }
                                }
                            }

                            for (var _j = 0, _len = commonContentTypes.length; _j < _len; _j++) {
                                var _ct = commonContentTypes[_j];

                                if (invertedContentTypes[_ct]) {
                                    Array.prototype.push.apply(doc.targets, invertedContentTypes[_ct]);
                                }
                            }

                            return ftCandidate;
                        }
                    }]);

                    return Common;
                }();

                module.exports = function () {
                    return wrapper(new Common());
                };

                /***/
            }),

      /***/ 999:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                var traitName = "expandPair";

                var mergeSort = __webpack_require__(509);

                var _require = __webpack_require__(557),
                    getLeft = _require.getLeft,
                    getRight = _require.getRight;

                var wrapper = __webpack_require__(223);

                var _require2 = __webpack_require__(505),
                    getExpandToDefault = _require2.getExpandToDefault;

                var _require3 = __webpack_require__(257),
                    getUnmatchedLoopException = _require3.getUnmatchedLoopException,
                    getClosingTagNotMatchOpeningTag = _require3.getClosingTagNotMatchOpeningTag,
                    getUnbalancedLoopException = _require3.getUnbalancedLoopException;

                function getOpenCountChange(part) {
                    switch (part.location) {
                        case "start":
                            return 1;

                        case "end":
                            return -1;
                    }
                }

                function match(start, end) {
                    return start != null && end != null && (start.part.location === "start" && end.part.location === "end" && start.part.value === end.part.value || end.part.value === "");
                }

                function transformer(traits) {
                    var i = 0;
                    var errors = [];

                    while (i < traits.length) {
                        var part = traits[i].part;

                        if (part.location === "end") {
                            if (i === 0) {
                                traits.splice(0, 1);
                                errors.push(getUnmatchedLoopException(part));
                                return {
                                    traits: traits,
                                    errors: errors
                                };
                            }

                            var endIndex = i;
                            var startIndex = i - 1;
                            var offseter = 1;

                            if (match(traits[startIndex], traits[endIndex])) {
                                traits.splice(endIndex, 1);
                                traits.splice(startIndex, 1);
                                return {
                                    errors: errors,
                                    traits: traits
                                };
                            }

                            while (offseter < 50) {
                                var startCandidate = traits[startIndex - offseter];
                                var endCandidate = traits[endIndex + offseter];

                                if (match(startCandidate, traits[endIndex])) {
                                    traits.splice(endIndex, 1);
                                    traits.splice(startIndex - offseter, 1);
                                    return {
                                        errors: errors,
                                        traits: traits
                                    };
                                }

                                if (match(traits[startIndex], endCandidate)) {
                                    traits.splice(endIndex + offseter, 1);
                                    traits.splice(startIndex, 1);
                                    return {
                                        errors: errors,
                                        traits: traits
                                    };
                                }

                                offseter++;
                            }

                            errors.push(getClosingTagNotMatchOpeningTag({
                                tags: [traits[startIndex].part, traits[endIndex].part]
                            }));
                            traits.splice(endIndex, 1);
                            traits.splice(startIndex, 1);
                            return {
                                traits: traits,
                                errors: errors
                            };
                        }

                        i++;
                    }

                    traits.forEach(function (_ref) {
                        var part = _ref.part;
                        errors.push(getUnmatchedLoopException(part));
                    });
                    return {
                        traits: [],
                        errors: errors
                    };
                }

                function getPairs(traits) {
                    var levelTraits = {};
                    var errors = [];
                    var pairs = [];
                    var transformedTraits = [];

                    for (var i = 0; i < traits.length; i++) {
                        transformedTraits.push(traits[i]);
                    }

                    while (transformedTraits.length > 0) {
                        var result = transformer(transformedTraits);
                        errors = errors.concat(result.errors);
                        transformedTraits = result.traits;
                    } // Stryker disable all : because this check makes the function return quicker


                    if (errors.length > 0) {
                        return {
                            pairs: pairs,
                            errors: errors
                        };
                    } // Stryker restore all


                    var countOpen = 0;

                    for (var _i = 0; _i < traits.length; _i++) {
                        var currentTrait = traits[_i];
                        var part = currentTrait.part;
                        var change = getOpenCountChange(part);
                        countOpen += change;

                        if (change === 1) {
                            levelTraits[countOpen] = currentTrait;
                        } else {
                            var startTrait = levelTraits[countOpen + 1];

                            if (countOpen === 0) {
                                pairs = pairs.concat([[startTrait, currentTrait]]);
                            }
                        }

                        countOpen = countOpen >= 0 ? countOpen : 0;
                    }

                    return {
                        pairs: pairs,
                        errors: errors
                    };
                }

                var expandPairTrait = {
                    name: "ExpandPairTrait",
                    optionsTransformer: function optionsTransformer(options, docxtemplater) {
                        this.expandTags = docxtemplater.fileTypeConfig.expandTags.concat(docxtemplater.options.paragraphLoop ? docxtemplater.fileTypeConfig.onParagraphLoop : []);
                        return options;
                    },
                    postparse: function postparse(postparsed, _ref2) {
                        var _this = this;

                        var getTraits = _ref2.getTraits,
                            postparse = _ref2.postparse;
                        var traits = getTraits(traitName, postparsed);
                        traits = traits.map(function (trait) {
                            return trait || [];
                        });
                        traits = mergeSort(traits);

                        var _getPairs = getPairs(traits),
                            pairs = _getPairs.pairs,
                            errors = _getPairs.errors;

                        var lastRight = 0;
                        var lastPair = null;
                        var expandedPairs = pairs.map(function (pair) {
                            var expandTo = pair[0].part.expandTo;

                            if (expandTo === "auto") {
                                var result = getExpandToDefault(postparsed, pair, _this.expandTags);

                                if (result.error) {
                                    errors.push(result.error);
                                }

                                expandTo = result.value;
                            }

                            if (!expandTo) {
                                var _left = pair[0].offset;
                                var _right = pair[1].offset;

                                if (_left < lastRight) {
                                    errors.push(getUnbalancedLoopException(pair, lastPair));
                                }

                                lastPair = pair;
                                lastRight = _right;
                                return [_left, _right];
                            }

                            var left, right;

                            try {
                                left = getLeft(postparsed, expandTo, pair[0].offset);
                            } catch (e) {
                                errors.push(e);
                            }

                            try {
                                right = getRight(postparsed, expandTo, pair[1].offset);
                            } catch (e) {
                                errors.push(e);
                            }

                            if (left < lastRight) {
                                errors.push(getUnbalancedLoopException(pair, lastPair));
                            }

                            lastRight = right;
                            lastPair = pair;
                            return [left, right];
                        }); // Stryker disable all : because this check makes the function return quicker

                        if (errors.length > 0) {
                            return {
                                postparsed: postparsed,
                                errors: errors
                            };
                        } // Stryker restore all


                        var currentPairIndex = 0;
                        var innerParts;
                        var newParsed = postparsed.reduce(function (newParsed, part, i) {
                            var inPair = currentPairIndex < pairs.length && expandedPairs[currentPairIndex][0] <= i && i <= expandedPairs[currentPairIndex][1];
                            var pair = pairs[currentPairIndex];
                            var expandedPair = expandedPairs[currentPairIndex];

                            if (!inPair) {
                                newParsed.push(part);
                                return newParsed;
                            }

                            if (expandedPair[0] === i) {
                                innerParts = [];
                            }

                            if (pair[0].offset !== i && pair[1].offset !== i) {
                                innerParts.push(part);
                            }

                            if (expandedPair[1] === i) {
                                var basePart = postparsed[pair[0].offset];
                                basePart.subparsed = postparse(innerParts, {
                                    basePart: basePart
                                });
                                delete basePart.location;
                                delete basePart.expandTo;
                                newParsed.push(basePart);
                                currentPairIndex++;
                            }

                            return newParsed;
                        }, []);
                        return {
                            postparsed: newParsed,
                            errors: errors
                        };
                    }
                };

                module.exports = function () {
                    return wrapper(expandPairTrait);
                };

                /***/
            }),

      /***/ 19:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

                function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

                function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

                function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

                function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

                function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

                function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

                function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

                function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

                function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

                function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

                function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

                var _require = __webpack_require__(557),
                    chunkBy = _require.chunkBy,
                    last = _require.last,
                    isParagraphStart = _require.isParagraphStart,
                    isModule = _require.isModule,
                    isParagraphEnd = _require.isParagraphEnd,
                    isContent = _require.isContent,
                    startsWith = _require.startsWith,
                    isTagEnd = _require.isTagEnd,
                    isTagStart = _require.isTagStart,
                    getSingleAttribute = _require.getSingleAttribute,
                    setSingleAttribute = _require.setSingleAttribute;

                var filetypes = __webpack_require__(330);

                var wrapper = __webpack_require__(223);

                var moduleName = "loop";

                function hasContent(parts) {
                    return parts.some(function (part) {
                        return isContent(part);
                    });
                }

                function getFirstMeaningFulPart(parsed) {
                    for (var i = 0, len = parsed.length; i < len; i++) {
                        if (parsed[i].type !== "content") {
                            return parsed[i];
                        }
                    }

                    return null;
                }

                function isInsideParagraphLoop(part) {
                    var firstMeaningfulPart = getFirstMeaningFulPart(part.subparsed);
                    return firstMeaningfulPart != null && firstMeaningfulPart.tag !== "w:t";
                }

                function getPageBreakIfApplies(part) {
                    return part.hasPageBreak && isInsideParagraphLoop(part) ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : "";
                }

                function isEnclosedByParagraphs(parsed) {
                    return parsed.length && isParagraphStart(parsed[0]) && isParagraphEnd(last(parsed));
                }

                function getOffset(chunk) {
                    return hasContent(chunk) ? 0 : chunk.length;
                }

                function addPageBreakAtEnd(subRendered) {
                    var j = subRendered.parts.length - 1;

                    if (subRendered.parts[j] === "</w:p>") {
                        subRendered.parts.splice(j, 0, '<w:r><w:br w:type="page"/></w:r>');
                    } else {
                        subRendered.parts.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
                    }
                }

                function addPageBreakAtBeginning(subRendered) {
                    subRendered.parts.unshift('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
                }

                function isContinuous(parts) {
                    return parts.some(function (part) {
                        return isTagStart("w:type", part) && part.value.indexOf("continuous") !== -1;
                    });
                }

                function addContinuousType(parts) {
                    var stop = false;
                    var inSectPr = false;
                    return parts.reduce(function (result, part) {
                        if (stop === false && startsWith(part, "<w:sectPr")) {
                            inSectPr = true;
                        }

                        if (inSectPr) {
                            if (startsWith(part, "<w:type")) {
                                stop = true;
                            }

                            if (stop === false && startsWith(part, "</w:sectPr")) {
                                result.push('<w:type w:val="continuous"/>');
                            }
                        }

                        result.push(part);
                        return result;
                    }, []);
                }

                function dropHeaderFooterRefs(parts) {
                    return parts.filter(function (text) {
                        return !startsWith(text, "<w:headerReference") && !startsWith(text, "<w:footerReference");
                    });
                }

                function hasPageBreak(chunk) {
                    return chunk.some(function (part) {
                        return part.tag === "w:br" && part.value.indexOf('w:type="page"') !== -1;
                    });
                }

                function hasImage(chunk) {
                    return chunk.some(function (_ref) {
                        var tag = _ref.tag;
                        return tag === "w:drawing";
                    });
                }

                function getSectPr(chunks) {
                    var collectSectPr = false;
                    var sectPrs = [];
                    chunks.forEach(function (part) {
                        if (isTagStart("w:sectPr", part)) {
                            sectPrs.push([]);
                            collectSectPr = true;
                        }

                        if (collectSectPr) {
                            sectPrs[sectPrs.length - 1].push(part);
                        }

                        if (isTagEnd("w:sectPr", part)) {
                            collectSectPr = false;
                        }
                    });
                    return sectPrs;
                }

                function getSectPrHeaderFooterChangeCount(chunks) {
                    var collectSectPr = false;
                    var sectPrCount = 0;
                    chunks.forEach(function (part) {
                        if (isTagStart("w:sectPr", part)) {
                            collectSectPr = true;
                        }

                        if (collectSectPr) {
                            if (part.tag === "w:headerReference" || part.tag === "w:footerReference") {
                                sectPrCount++;
                                collectSectPr = false;
                            }
                        }

                        if (isTagEnd("w:sectPr", part)) {
                            collectSectPr = false;
                        }
                    });
                    return sectPrCount;
                }

                function getLastSectPr(parsed) {
                    var sectPr = [];
                    var inSectPr = false;

                    for (var i = parsed.length - 1; i >= 0; i--) {
                        var part = parsed[i];

                        if (isTagEnd("w:sectPr", part)) {
                            inSectPr = true;
                        }

                        if (isTagStart("w:sectPr", part)) {
                            sectPr.unshift(part.value);
                            inSectPr = false;
                        }

                        if (inSectPr) {
                            sectPr.unshift(part.value);
                        }

                        if (isParagraphStart(part)) {
                            if (sectPr.length > 0) {
                                return sectPr.join("");
                            }

                            break;
                        }
                    }

                    return "";
                }

                var LoopModule = /*#__PURE__*/function () {
                    function LoopModule() {
                        _classCallCheck(this, LoopModule);

                        this.name = "LoopModule";
                        this.inXfrm = false;
                        this.totalSectPr = 0;
                        this.prefix = {
                            start: "#",
                            end: "/",
                            dash: /^-([^\s]+)\s(.+)/,
                            inverted: "^"
                        };
                    }

                    _createClass(LoopModule, [{
                        key: "optionsTransformer",
                        value: function optionsTransformer(opts, docxtemplater) {
                            this.docxtemplater = docxtemplater;
                            return opts;
                        }
                    }, {
                        key: "preparse",
                        value: function preparse(parsed, _ref2) {
                            var contentType = _ref2.contentType;

                            if (filetypes.main.indexOf(contentType) !== -1) {
                                this.sects = getSectPr(parsed);
                            }
                        }
                    }, {
                        key: "matchers",
                        value: function matchers() {
                            var module = moduleName;
                            return [[this.prefix.start, module, {
                                expandTo: "auto",
                                location: "start",
                                inverted: false
                            }], [this.prefix.inverted, module, {
                                expandTo: "auto",
                                location: "start",
                                inverted: true
                            }], [this.prefix.end, module, {
                                location: "end"
                            }], [this.prefix.dash, module, function (_ref3) {
                                var _ref4 = _slicedToArray(_ref3, 3),
                                    expandTo = _ref4[1],
                                    value = _ref4[2];

                                return {
                                    location: "start",
                                    inverted: false,
                                    expandTo: expandTo,
                                    value: value
                                };
                            }]];
                        }
                    }, {
                        key: "getTraits",
                        value: function getTraits(traitName, parsed) {
                            // Stryker disable all : because getTraits should disappear in v4
                            if (traitName !== "expandPair") {
                                return;
                            } // Stryker restore all


                            return parsed.reduce(function (tags, part, offset) {
                                if (isModule(part, moduleName) && part.subparsed == null) {
                                    tags.push({
                                        part: part,
                                        offset: offset
                                    });
                                }

                                return tags;
                            }, []);
                        }
                    }, {
                        key: "postparse",
                        value: function postparse(parsed, _ref5) {
                            var basePart = _ref5.basePart;

                            if (basePart && this.docxtemplater.fileType === "docx") {
                                basePart.sectPrCount = getSectPrHeaderFooterChangeCount(parsed);
                                this.totalSectPr += basePart.sectPrCount;
                                var sects = this.sects;
                                sects.some(function (sect, index) {
                                    if (sect[0].lIndex > basePart.lIndex) {
                                        if (index + 1 < sects.length && isContinuous(sects[index + 1])) {
                                            basePart.addContinuousType = true;
                                        }

                                        return true;
                                    }
                                });
                                basePart.lastParagrapSectPr = getLastSectPr(parsed);
                            }

                            if (!basePart || basePart.expandTo !== "auto" || basePart.module !== moduleName || !isEnclosedByParagraphs(parsed)) {
                                return parsed;
                            }

                            basePart.paragraphLoop = true;
                            var level = 0;
                            var chunks = chunkBy(parsed, function (p) {
                                if (isParagraphStart(p)) {
                                    level++;

                                    if (level === 1) {
                                        return "start";
                                    }
                                }

                                if (isParagraphEnd(p)) {
                                    level--;

                                    if (level === 0) {
                                        return "end";
                                    }
                                }

                                return null;
                            });
                            var firstChunk = chunks[0];
                            var lastChunk = last(chunks);
                            var firstOffset = getOffset(firstChunk);
                            var lastOffset = getOffset(lastChunk);
                            basePart.hasPageBreakBeginning = hasPageBreak(firstChunk);
                            basePart.hasPageBreak = hasPageBreak(lastChunk);

                            if (hasImage(firstChunk)) {
                                firstOffset = 0;
                            }

                            if (hasImage(lastChunk)) {
                                lastOffset = 0;
                            }

                            return parsed.slice(firstOffset, parsed.length - lastOffset);
                        }
                    }, {
                        key: "resolve",
                        value: function resolve(part, options) {
                            if (!isModule(part, moduleName)) {
                                return null;
                            }

                            var sm = options.scopeManager;
                            var promisedValue = sm.getValueAsync(part.value, {
                                part: part
                            });
                            var promises = [];

                            function loopOver(scope, i, length) {
                                var scopeManager = sm.createSubScopeManager(scope, part.value, i, part, length);
                                promises.push(options.resolve({
                                    filePath: options.filePath,
                                    modules: options.modules,
                                    baseNullGetter: options.baseNullGetter,
                                    resolve: options.resolve,
                                    compiled: part.subparsed,
                                    tags: {},
                                    scopeManager: scopeManager
                                }));
                            }

                            var errorList = [];
                            return promisedValue.then(function (values) {
                                return new Promise(function (resolve) {
                                    if (values instanceof Array) {
                                        Promise.all(values).then(resolve);
                                    } else {
                                        resolve(values);
                                    }
                                }).then(function (values) {
                                    sm.loopOverValue(values, loopOver, part.inverted);
                                    return Promise.all(promises).then(function (r) {
                                        return r.map(function (_ref6) {
                                            var resolved = _ref6.resolved,
                                                errors = _ref6.errors;
                                            errorList.push.apply(errorList, _toConsumableArray(errors));
                                            return resolved;
                                        });
                                    }).then(function (value) {
                                        if (errorList.length > 0) {
                                            throw errorList;
                                        }

                                        return value;
                                    });
                                });
                            });
                        } // eslint-disable-next-line complexity

                    }, {
                        key: "render",
                        value: function render(part, options) {
                            if (part.tag === "p:xfrm") {
                                this.inXfrm = part.position === "start";
                            }

                            if (part.tag === "a:ext" && this.inXfrm) {
                                this.lastExt = part;
                                return part;
                            }

                            if (!isModule(part, moduleName)) {
                                return null;
                            }

                            var totalValue = [];
                            var errors = [];
                            var heightOffset = 0;
                            var firstTag = part.subparsed[0];
                            var tagHeight = 0;

                            if ((firstTag === null || firstTag === void 0 ? void 0 : firstTag.tag) === "a:tr") {
                                tagHeight = +getSingleAttribute(firstTag.value, "h");
                            }

                            heightOffset -= tagHeight;
                            var a16RowIdOffset = 0;

                            function loopOver(scope, i, length) {
                                heightOffset += tagHeight;
                                var scopeManager = options.scopeManager.createSubScopeManager(scope, part.value, i, part, length);
                                part.subparsed.forEach(function (pp) {
                                    if (isTagStart("a16:rowId", pp)) {
                                        var val = +getSingleAttribute(pp.value, "val") + a16RowIdOffset;
                                        a16RowIdOffset = 1;
                                        pp.value = setSingleAttribute(pp.value, "val", val);
                                    }
                                });
                                var subRendered = options.render(_objectSpread(_objectSpread({}, options), {}, {
                                    compiled: part.subparsed,
                                    tags: {},
                                    scopeManager: scopeManager
                                }));

                                if (part.hasPageBreak && i === length - 1 && isInsideParagraphLoop(part)) {
                                    addPageBreakAtEnd(subRendered);
                                }

                                var isNotFirst = scopeManager.scopePathItem.some(function (i) {
                                    return i !== 0;
                                });

                                if (isNotFirst) {
                                    if (part.sectPrCount === 1) {
                                        subRendered.parts = dropHeaderFooterRefs(subRendered.parts);
                                    }

                                    if (part.addContinuousType) {
                                        subRendered.parts = addContinuousType(subRendered.parts);
                                    }
                                }

                                if (part.hasPageBreakBeginning && isInsideParagraphLoop(part)) {
                                    addPageBreakAtBeginning(subRendered);
                                }

                                for (var _i2 = 0, len = subRendered.parts.length; _i2 < len; _i2++) {
                                    totalValue.push(subRendered.parts[_i2]);
                                }

                                Array.prototype.push.apply(errors, subRendered.errors);
                            }

                            var result = options.scopeManager.loopOver(part.value, loopOver, part.inverted, {
                                part: part
                            }); // if the loop is showing empty content

                            if (result === false) {
                                if (part.lastParagrapSectPr) {
                                    if (part.paragraphLoop) {
                                        return {
                                            value: "<w:p><w:pPr>".concat(part.lastParagrapSectPr, "</w:pPr></w:p>")
                                        };
                                    }

                                    return {
                                        value: "</w:t></w:r></w:p><w:p><w:pPr>".concat(part.lastParagrapSectPr, "</w:pPr><w:r><w:t>")
                                    };
                                }

                                return {
                                    value: getPageBreakIfApplies(part) || "",
                                    errors: errors
                                };
                            }

                            if (heightOffset !== 0) {
                                var cy = +getSingleAttribute(this.lastExt.value, "cy");
                                this.lastExt.value = setSingleAttribute(this.lastExt.value, "cy", cy + heightOffset);
                            }

                            return {
                                value: options.joinUncorrupt(totalValue, _objectSpread(_objectSpread({}, options), {}, {
                                    basePart: part
                                })),
                                errors: errors
                            };
                        }
                    }]);

                    return LoopModule;
                }();

                module.exports = function () {
                    return wrapper(new LoopModule());
                };

                /***/
            }),

      /***/ 182:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

                function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

                var traits = __webpack_require__(505);

                var _require = __webpack_require__(557),
                    isContent = _require.isContent;

                var _require2 = __webpack_require__(257),
                    throwRawTagShouldBeOnlyTextInParagraph = _require2.throwRawTagShouldBeOnlyTextInParagraph,
                    getInvalidRawXMLValueException = _require2.getInvalidRawXMLValueException;

                var moduleName = "rawxml";

                var wrapper = __webpack_require__(223);

                function getInner(_ref) {
                    var part = _ref.part,
                        left = _ref.left,
                        right = _ref.right,
                        postparsed = _ref.postparsed,
                        index = _ref.index;
                    var paragraphParts = postparsed.slice(left + 1, right);
                    paragraphParts.forEach(function (p, i) {
                        if (i === index - left - 1) {
                            return;
                        }

                        if (isContent(p)) {
                            throwRawTagShouldBeOnlyTextInParagraph({
                                paragraphParts: paragraphParts,
                                part: part
                            });
                        }
                    });
                    return part;
                }

                var RawXmlModule = /*#__PURE__*/function () {
                    function RawXmlModule() {
                        _classCallCheck(this, RawXmlModule);

                        this.name = "RawXmlModule";
                        this.prefix = "@";
                    }

                    _createClass(RawXmlModule, [{
                        key: "optionsTransformer",
                        value: function optionsTransformer(options, docxtemplater) {
                            this.fileTypeConfig = docxtemplater.fileTypeConfig;
                            return options;
                        }
                    }, {
                        key: "matchers",
                        value: function matchers() {
                            return [[this.prefix, moduleName]];
                        }
                    }, {
                        key: "postparse",
                        value: function postparse(postparsed) {
                            return traits.expandToOne(postparsed, {
                                moduleName: moduleName,
                                getInner: getInner,
                                expandTo: this.fileTypeConfig.tagRawXml,
                                error: {
                                    message: "Raw tag not in paragraph",
                                    id: "raw_tag_outerxml_invalid",
                                    explanation: function explanation(part) {
                                        return "The tag \"".concat(part.value, "\" is not inside a paragraph, putting raw tags inside an inline loop is disallowed.");
                                    }
                                }
                            });
                        }
                    }, {
                        key: "render",
                        value: function render(part, options) {
                            if (part.module !== moduleName) {
                                return null;
                            }

                            var value;
                            var errors = [];

                            try {
                                value = options.scopeManager.getValue(part.value, {
                                    part: part
                                });

                                if (value == null) {
                                    value = options.nullGetter(part);
                                }
                            } catch (e) {
                                errors.push(e);
                                return {
                                    errors: errors
                                };
                            }

                            value = value ? value : "";

                            if (typeof value === "string") {
                                return {
                                    value: value
                                };
                            }

                            return {
                                errors: [getInvalidRawXMLValueException({
                                    tag: part.value,
                                    value: value,
                                    offset: part.offset
                                })]
                            };
                        }
                    }]);

                    return RawXmlModule;
                }();

                module.exports = function () {
                    return wrapper(new RawXmlModule());
                };

                /***/
            }),

      /***/ 163:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

                function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

                var wrapper = __webpack_require__(223);

                var _require = __webpack_require__(257),
                    getScopeCompilationError = _require.getScopeCompilationError;

                var _require2 = __webpack_require__(557),
                    utf8ToWord = _require2.utf8ToWord,
                    hasCorruptCharacters = _require2.hasCorruptCharacters;

                var _require3 = __webpack_require__(257),
                    getCorruptCharactersException = _require3.getCorruptCharactersException;

                var ftprefix = {
                    docx: "w",
                    pptx: "a"
                };

                var Render = /*#__PURE__*/function () {
                    function Render() {
                        _classCallCheck(this, Render);

                        this.name = "Render";
                        this.recordRun = false;
                        this.recordedRun = [];
                    }

                    _createClass(Render, [{
                        key: "optionsTransformer",
                        value: function optionsTransformer(options, docxtemplater) {
                            this.parser = docxtemplater.parser;
                            this.fileType = docxtemplater.fileType;
                            return options;
                        }
                    }, {
                        key: "set",
                        value: function set(obj) {
                            if (obj.compiled) {
                                this.compiled = obj.compiled;
                            }

                            if (obj.data != null) {
                                this.data = obj.data;
                            }
                        }
                    }, {
                        key: "getRenderedMap",
                        value: function getRenderedMap(mapper) {
                            var _this = this;

                            return Object.keys(this.compiled).reduce(function (mapper, from) {
                                mapper[from] = {
                                    from: from,
                                    data: _this.data
                                };
                                return mapper;
                            }, mapper);
                        }
                    }, {
                        key: "postparse",
                        value: function postparse(postparsed, options) {
                            var _this2 = this;

                            var errors = [];
                            postparsed.forEach(function (p) {
                                if (p.type === "placeholder") {
                                    var tag = p.value;

                                    try {
                                        options.cachedParsers[p.lIndex] = _this2.parser(tag, {
                                            tag: p
                                        });
                                    } catch (rootError) {
                                        errors.push(getScopeCompilationError({
                                            tag: tag,
                                            rootError: rootError,
                                            offset: p.offset
                                        }));
                                    }
                                }
                            });
                            return {
                                postparsed: postparsed,
                                errors: errors
                            };
                        }
                    }, {
                        key: "render",
                        value: function render(part, _ref) {
                            var scopeManager = _ref.scopeManager,
                                linebreaks = _ref.linebreaks,
                                nullGetter = _ref.nullGetter;

                            if (linebreaks) {
                                this.recordRuns(part);
                            }

                            if (part.type !== "placeholder" || part.module) {
                                return;
                            }

                            var value;

                            try {
                                value = scopeManager.getValue(part.value, {
                                    part: part
                                });
                            } catch (e) {
                                return {
                                    errors: [e]
                                };
                            }

                            if (value == null) {
                                value = nullGetter(part);
                            }

                            if (hasCorruptCharacters(value)) {
                                return {
                                    errors: [getCorruptCharactersException({
                                        tag: part.value,
                                        value: value,
                                        offset: part.offset
                                    })]
                                };
                            }

                            return {
                                value: linebreaks && typeof value === "string" ? this.renderLineBreaks(value) : utf8ToWord(value)
                            };
                        }
                    }, {
                        key: "recordRuns",
                        value: function recordRuns(part) {
                            if (part.tag === "".concat(ftprefix[this.fileType], ":r")) {
                                this.recordedRun = [];
                            } else if (part.tag === "".concat(ftprefix[this.fileType], ":rPr")) {
                                if (part.position === "start") {
                                    this.recordRun = true;
                                    this.recordedRun = [part.value];
                                }

                                if (part.position === "end") {
                                    this.recordedRun.push(part.value);
                                    this.recordRun = false;
                                }
                            } else if (this.recordRun) {
                                this.recordedRun.push(part.value);
                            }
                        }
                    }, {
                        key: "renderLineBreaks",
                        value: function renderLineBreaks(value) {
                            var _this3 = this;

                            var p = ftprefix[this.fileType];
                            var br = this.fileType === "docx" ? "<w:r><w:br/></w:r>" : "<a:br/>";
                            var lines = value.split("\n");
                            var runprops = this.recordedRun.join("");
                            return lines.map(function (line) {
                                return utf8ToWord(line);
                            }).reduce(function (result, line, i) {
                                result.push(line);

                                if (i < lines.length - 1) {
                                    result.push("</".concat(p, ":t></").concat(p, ":r>").concat(br, "<").concat(p, ":r>").concat(runprops, "<").concat(p, ":t").concat(_this3.fileType === "docx" ? ' xml:space="preserve"' : "", ">"));
                                }

                                return result;
                            }, []);
                        }
                    }]);

                    return Render;
                }();

                module.exports = function () {
                    return wrapper(new Render());
                };

                /***/
            }),

      /***/ 95:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                var wrapper = __webpack_require__(223);

                var _require = __webpack_require__(557),
                    isTextStart = _require.isTextStart,
                    isTextEnd = _require.isTextEnd,
                    endsWith = _require.endsWith,
                    startsWith = _require.startsWith;

                var wTpreserve = '<w:t xml:space="preserve">';
                var wTpreservelen = wTpreserve.length;
                var wtEnd = "</w:t>";
                var wtEndlen = wtEnd.length;

                function isWtStart(part) {
                    return isTextStart(part) && part.tag === "w:t";
                }

                function addXMLPreserve(chunk, index) {
                    var tag = chunk[index].value;

                    if (chunk[index + 1].value === "</w:t>") {
                        return tag;
                    }

                    if (tag.indexOf('xml:space="preserve"') !== -1) {
                        return tag;
                    }

                    return tag.substr(0, tag.length - 1) + ' xml:space="preserve">';
                }

                function isInsideLoop(meta, chunk) {
                    return meta && meta.basePart && chunk.length > 1;
                }

                var spacePreserve = {
                    name: "SpacePreserveModule",
                    postparse: function postparse(postparsed, meta) {
                        var chunk = [],
                            inTextTag = false,
                            endLindex = 0,
                            lastTextTag = 0;

                        function isStartingPlaceHolder(part, chunk) {
                            return part.type === "placeholder" && (!part.module || part.module === "loop") && chunk.length > 1;
                        }

                        var result = postparsed.reduce(function (postparsed, part) {
                            if (isWtStart(part)) {
                                inTextTag = true;
                                lastTextTag = chunk.length;
                            }

                            if (!inTextTag) {
                                postparsed.push(part);
                                return postparsed;
                            }

                            chunk.push(part);

                            if (isInsideLoop(meta, chunk)) {
                                endLindex = meta.basePart.endLindex;
                                chunk[0].value = addXMLPreserve(chunk, 0);
                            }

                            if (isStartingPlaceHolder(part, chunk)) {
                                chunk[lastTextTag].value = addXMLPreserve(chunk, lastTextTag);
                                endLindex = part.endLindex;
                            }

                            if (isTextEnd(part) && part.lIndex > endLindex) {
                                if (endLindex !== 0) {
                                    chunk[lastTextTag].value = addXMLPreserve(chunk, lastTextTag);
                                }

                                Array.prototype.push.apply(postparsed, chunk);
                                chunk = [];
                                inTextTag = false;
                                endLindex = 0;
                                lastTextTag = 0;
                            }

                            return postparsed;
                        }, []);
                        Array.prototype.push.apply(result, chunk);
                        return result;
                    },
                    postrender: function postrender(parts) {
                        var lastNonEmpty = "";
                        var lastNonEmptyIndex = 0;

                        for (var i = 0, len = parts.length; i < len; i++) {
                            var index = i;
                            var p = parts[i];

                            if (p === "") {
                                continue;
                            }

                            if (endsWith(lastNonEmpty, wTpreserve) && startsWith(p, wtEnd)) {
                                parts[lastNonEmptyIndex] = lastNonEmpty.substr(0, lastNonEmpty.length - wTpreservelen) + "<w:t/>";
                                p = p.substr(wtEndlen);
                            }

                            lastNonEmpty = p;
                            lastNonEmptyIndex = index;
                            parts[i] = p;
                        }

                        return parts;
                    }
                };

                module.exports = function () {
                    return wrapper(spacePreserve);
                };

                /***/
            }),

      /***/ 190:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

                function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

                function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

                function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

                function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

                function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

                function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

                function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

                function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

                function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

                function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

                var _require = __webpack_require__(557),
                    wordToUtf8 = _require.wordToUtf8;

                var _require2 = __webpack_require__(3),
                    match = _require2.match,
                    getValue = _require2.getValue,
                    getValues = _require2.getValues;

                function getMatchers(modules, options) {
                    var matchers = [];

                    for (var i = 0, l = modules.length; i < l; i++) {
                        var _module = modules[i];

                        if (_module.matchers) {
                            var mmm = _module.matchers(options);

                            if (!(mmm instanceof Array)) {
                                throw new Error("module matcher returns a non array");
                            }

                            matchers.push.apply(matchers, _toConsumableArray(mmm));
                        }
                    }

                    return matchers;
                }

                function getMatches(matchers, placeHolderContent, options) {
                    var matches = [];

                    for (var i = 0, len = matchers.length; i < len; i++) {
                        var matcher = matchers[i];

                        var _matcher = _slicedToArray(matcher, 2),
                            prefix = _matcher[0],
                            _module2 = _matcher[1];

                        var properties = matcher[2] || {};

                        if (options.match(prefix, placeHolderContent)) {
                            var values = options.getValues(prefix, placeHolderContent);

                            if (typeof properties === "function") {
                                properties = properties(values);
                            }

                            if (!properties.value) {
                                var _values = _slicedToArray(values, 2);

                                properties.value = _values[1];
                            }

                            matches.push(_objectSpread({
                                type: "placeholder",
                                prefix: prefix,
                                module: _module2,
                                onMatch: properties.onMatch,
                                priority: properties.priority
                            }, properties));
                        }
                    }

                    return matches;
                }

                function moduleParse(placeHolderContent, options) {
                    var modules = options.modules;
                    var startOffset = options.startOffset;
                    var endLindex = options.lIndex;
                    var moduleParsed;
                    options.offset = startOffset;
                    options.match = match;
                    options.getValue = getValue;
                    options.getValues = getValues;
                    var matchers = getMatchers(modules, options);
                    var matches = getMatches(matchers, placeHolderContent, options);

                    if (matches.length > 0) {
                        var bestMatch = null;
                        matches.forEach(function (match) {
                            match.priority = match.priority || -match.value.length;

                            if (!bestMatch || match.priority > bestMatch.priority) {
                                bestMatch = match;
                            }
                        });
                        bestMatch.offset = startOffset;
                        delete bestMatch.priority;
                        bestMatch.endLindex = endLindex;
                        bestMatch.lIndex = endLindex;
                        bestMatch.raw = placeHolderContent;

                        if (bestMatch.onMatch) {
                            bestMatch.onMatch(bestMatch);
                        }

                        delete bestMatch.onMatch;
                        delete bestMatch.prefix;
                        return bestMatch;
                    }

                    for (var i = 0, l = modules.length; i < l; i++) {
                        var _module3 = modules[i];
                        moduleParsed = _module3.parse(placeHolderContent, options);

                        if (moduleParsed) {
                            moduleParsed.offset = startOffset;
                            moduleParsed.endLindex = endLindex;
                            moduleParsed.lIndex = endLindex;
                            moduleParsed.raw = placeHolderContent;
                            return moduleParsed;
                        }
                    }

                    return {
                        type: "placeholder",
                        value: placeHolderContent,
                        offset: startOffset,
                        endLindex: endLindex,
                        lIndex: endLindex
                    };
                }

                var parser = {
                    preparse: function preparse(parsed, modules, options) {
                        function preparse(parsed, options) {
                            return modules.forEach(function (module) {
                                module.preparse(parsed, options);
                            });
                        }

                        return {
                            preparsed: preparse(parsed, options)
                        };
                    },
                    parse: function parse(lexed, modules, options) {
                        var inPlaceHolder = false;
                        var placeHolderContent = "";
                        var startOffset;
                        var tailParts = [];
                        return lexed.reduce(function lexedToParsed(parsed, token) {
                            if (token.type === "delimiter") {
                                inPlaceHolder = token.position === "start";

                                if (token.position === "end") {
                                    options.parse = function (placeHolderContent) {
                                        return moduleParse(placeHolderContent, _objectSpread(_objectSpread(_objectSpread({}, options), token), {}, {
                                            startOffset: startOffset,
                                            modules: modules
                                        }));
                                    };

                                    parsed.push(options.parse(wordToUtf8(placeHolderContent)));
                                    Array.prototype.push.apply(parsed, tailParts);
                                    tailParts = [];
                                }

                                if (token.position === "start") {
                                    tailParts = [];
                                    startOffset = token.offset;
                                }

                                placeHolderContent = "";
                                return parsed;
                            }

                            if (!inPlaceHolder) {
                                parsed.push(token);
                                return parsed;
                            }

                            if (token.type !== "content" || token.position !== "insidetag") {
                                tailParts.push(token);
                                return parsed;
                            }

                            placeHolderContent += token.value;
                            return parsed;
                        }, []);
                    },
                    postparse: function postparse(postparsed, modules, options) {
                        function getTraits(traitName, postparsed) {
                            return modules.map(function (module) {
                                return module.getTraits(traitName, postparsed);
                            });
                        }

                        var errors = [];

                        function _postparse(postparsed, options) {
                            return modules.reduce(function (postparsed, module) {
                                var r = module.postparse(postparsed, _objectSpread(_objectSpread({}, options), {}, {
                                    postparse: function postparse(parsed, opts) {
                                        return _postparse(parsed, _objectSpread(_objectSpread({}, options), opts));
                                    },
                                    getTraits: getTraits
                                }));

                                if (r == null) {
                                    return postparsed;
                                }

                                if (r.errors) {
                                    Array.prototype.push.apply(errors, r.errors);
                                    return r.postparsed;
                                }

                                return r;
                            }, postparsed);
                        }

                        return {
                            postparsed: _postparse(postparsed, options),
                            errors: errors
                        };
                    }
                };
                module.exports = parser;

                /***/
            }),

      /***/ 393:
      /***/ (function (module) {

                // convert string to array (typed, when possible)
                // Stryker disable all : because this is an external function
                // eslint-disable-next-line complexity
                function string2buf(str) {
                    var c,
                        c2,
                        mPos,
                        i,
                        bufLen = 0;
                    var strLen = str.length; // count binary size

                    for (mPos = 0; mPos < strLen; mPos++) {
                        c = str.charCodeAt(mPos);

                        if ((c & 0xfc00) === 0xd800 && mPos + 1 < strLen) {
                            c2 = str.charCodeAt(mPos + 1);

                            if ((c2 & 0xfc00) === 0xdc00) {
                                c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
                                mPos++;
                            }
                        }

                        bufLen += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
                    } // allocate buffer


                    var buf = new Uint8Array(bufLen); // convert

                    for (i = 0, mPos = 0; i < bufLen; mPos++) {
                        c = str.charCodeAt(mPos);

                        if ((c & 0xfc00) === 0xd800 && mPos + 1 < strLen) {
                            c2 = str.charCodeAt(mPos + 1);

                            if ((c2 & 0xfc00) === 0xdc00) {
                                c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
                                mPos++;
                            }
                        }

                        if (c < 0x80) {
                            /* one byte */
                            buf[i++] = c;
                        } else if (c < 0x800) {
                            /* two bytes */
                            buf[i++] = 0xc0 | c >>> 6;
                            buf[i++] = 0x80 | c & 0x3f;
                        } else if (c < 0x10000) {
                            /* three bytes */
                            buf[i++] = 0xe0 | c >>> 12;
                            buf[i++] = 0x80 | c >>> 6 & 0x3f;
                            buf[i++] = 0x80 | c & 0x3f;
                        } else {
                            /* four bytes */
                            buf[i++] = 0xf0 | c >>> 18;
                            buf[i++] = 0x80 | c >>> 12 & 0x3f;
                            buf[i++] = 0x80 | c >>> 6 & 0x3f;
                            buf[i++] = 0x80 | c & 0x3f;
                        }
                    }

                    return buf;
                } // Stryker restore all


                function postrender(parts, options) {
                    for (var i = 0, l = options.modules.length; i < l; i++) {
                        var _module = options.modules[i];
                        parts = _module.postrender(parts, options);
                    }

                    var fullLength = 0;
                    var newParts = options.joinUncorrupt(parts, options);
                    var longStr = "";
                    var lenStr = 0;
                    var maxCompact = 65536;
                    var uintArrays = [];

                    for (var _i = 0, len = newParts.length; _i < len; _i++) {
                        var part = newParts[_i]; // This condition should be hit in the integration test at :
                        // it("should not regress with long file (hit maxCompact value of 65536)", function () {
                        // Stryker disable all : because this is an optimisation that won't make any tests fail

                        if (part.length + lenStr > maxCompact) {
                            var _arr = string2buf(longStr);

                            fullLength += _arr.length;
                            uintArrays.push(_arr);
                            longStr = "";
                        } // Stryker restore all


                        longStr += part;
                        lenStr += part.length;
                        delete newParts[_i];
                    }

                    var arr = string2buf(longStr);
                    fullLength += arr.length;
                    uintArrays.push(arr);
                    var array = new Uint8Array(fullLength);
                    var j = 0; // Stryker disable all : because this is an optimisation that won't make any tests fail

                    uintArrays.forEach(function (buf) {
                        for (var _i2 = 0; _i2 < buf.length; ++_i2) {
                            array[_i2 + j] = buf[_i2];
                        }

                        j += buf.length;
                    }); // Stryker restore all

                    return array;
                }

                module.exports = postrender;

                /***/
            }),

      /***/ 3:
      /***/ (function (module) {

                var nbspRegex = new RegExp(String.fromCharCode(160), "g");

                function replaceNbsps(str) {
                    return str.replace(nbspRegex, " ");
                }

                function match(condition, placeHolderContent) {
                    if (typeof condition === "string") {
                        return replaceNbsps(placeHolderContent.substr(0, condition.length)) === condition;
                    }

                    if (condition instanceof RegExp) {
                        return condition.test(replaceNbsps(placeHolderContent));
                    }
                }

                function getValue(condition, placeHolderContent) {
                    if (typeof condition === "string") {
                        return replaceNbsps(placeHolderContent).substr(condition.length);
                    }

                    if (condition instanceof RegExp) {
                        return replaceNbsps(placeHolderContent).match(condition)[1];
                    }
                }

                function getValues(condition, placeHolderContent) {
                    if (typeof condition === "string") {
                        return [placeHolderContent, replaceNbsps(placeHolderContent).substr(condition.length)];
                    }

                    if (condition instanceof RegExp) {
                        return replaceNbsps(placeHolderContent).match(condition);
                    }
                }

                module.exports = {
                    match: match,
                    getValue: getValue,
                    getValues: getValues
                };

                /***/
            }),

      /***/ 89:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                var _require = __webpack_require__(257),
                    throwUnimplementedTagType = _require.throwUnimplementedTagType;

                function moduleRender(part, options) {
                    var moduleRendered;

                    for (var i = 0, l = options.modules.length; i < l; i++) {
                        var _module = options.modules[i];
                        moduleRendered = _module.render(part, options);

                        if (moduleRendered) {
                            return moduleRendered;
                        }
                    }

                    return false;
                }

                function render(options) {
                    var baseNullGetter = options.baseNullGetter;
                    var compiled = options.compiled,
                        scopeManager = options.scopeManager;

                    options.nullGetter = function (part, sm) {
                        return baseNullGetter(part, sm || scopeManager);
                    };

                    var errors = [];
                    var parts = compiled.map(function (part, i) {
                        options.index = i;
                        var moduleRendered = moduleRender(part, options);

                        if (moduleRendered) {
                            if (moduleRendered.errors) {
                                Array.prototype.push.apply(errors, moduleRendered.errors);
                            }

                            return moduleRendered;
                        }

                        if (part.type === "content" || part.type === "tag") {
                            return part;
                        }

                        throwUnimplementedTagType(part, i);
                    }).reduce(function (parts, _ref) {
                        var value = _ref.value;

                        if (value instanceof Array) {
                            for (var i = 0, len = value.length; i < len; i++) {
                                parts.push(value[i]);
                            }
                        } else if (value) {
                            parts.push(value);
                        }

                        return parts;
                    }, []);
                    return {
                        errors: errors,
                        parts: parts
                    };
                }

                module.exports = render;

                /***/
            }),

      /***/ 207:
      /***/ (function (module) {

                function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

                function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

                function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

                function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

                function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

                function moduleResolve(part, options) {
                    var moduleResolved;

                    for (var i = 0, l = options.modules.length; i < l; i++) {
                        var _module = options.modules[i];
                        moduleResolved = _module.resolve(part, options);

                        if (moduleResolved) {
                            return moduleResolved;
                        }
                    }

                    return false;
                }

                function resolve(options) {
                    var resolved = [];
                    var baseNullGetter = options.baseNullGetter;
                    var compiled = options.compiled,
                        scopeManager = options.scopeManager;

                    options.nullGetter = function (part, sm) {
                        return baseNullGetter(part, sm || scopeManager);
                    };

                    options.resolved = resolved;
                    var errors = [];
                    return Promise.all(compiled.filter(function (part) {
                        return ["content", "tag"].indexOf(part.type) === -1;
                    }).reduce(function (promises, part) {
                        var moduleResolved = moduleResolve(part, options);
                        var result;

                        if (moduleResolved) {
                            result = moduleResolved.then(function (value) {
                                resolved.push({
                                    tag: part.value,
                                    value: value,
                                    lIndex: part.lIndex
                                });
                            });
                        } else if (part.type === "placeholder") {
                            result = scopeManager.getValueAsync(part.value, {
                                part: part
                            }).then(function (value) {
                                if (value == null) {
                                    value = options.nullGetter(part);
                                }

                                resolved.push({
                                    tag: part.value,
                                    value: value,
                                    lIndex: part.lIndex
                                });
                                return value;
                            });
                        } else {
                            return;
                        }

                        promises.push(result["catch"](function (e) {
                            if (e instanceof Array) {
                                errors.push.apply(errors, _toConsumableArray(e));
                            } else {
                                errors.push(e);
                            }
                        }));
                        return promises;
                    }, [])).then(function () {
                        return {
                            errors: errors,
                            resolved: resolved
                        };
                    });
                }

                module.exports = resolve;

                /***/
            }),

      /***/ 919:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

                function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

                var _require = __webpack_require__(257),
                    getScopeParserExecutionError = _require.getScopeParserExecutionError;

                var _require2 = __webpack_require__(287),
                    last = _require2.last;

                var _require3 = __webpack_require__(557),
                    concatArrays = _require3.concatArrays;

                function find(list, fn) {
                    var length = list.length >>> 0;
                    var value;

                    for (var i = 0; i < length; i++) {
                        value = list[i];

                        if (fn.call(this, value, i, list)) {
                            return value;
                        }
                    }

                    return undefined;
                }

                function _getValue(tag, meta, num) {
                    var _this = this;

                    var scope = this.scopeList[num];

                    if (this.root.finishedResolving) {
                        var w = this.resolved;
                        this.scopePath.slice(this.resolveOffset).forEach(function (p, index) {
                            var lIndex = _this.scopeLindex[index];
                            w = find(w, function (r) {
                                return r.lIndex === lIndex;
                            });
                            w = w.value[_this.scopePathItem[index]];
                        });
                        return find(w, function (r) {
                            return meta.part.lIndex === r.lIndex;
                        }).value;
                    } // search in the scopes (in reverse order) and keep the first defined value


                    var result;
                    var parser;

                    if (!this.cachedParsers || !meta.part) {
                        parser = this.parser(tag, {
                            scopePath: this.scopePath
                        });
                    } else if (this.cachedParsers[meta.part.lIndex]) {
                        parser = this.cachedParsers[meta.part.lIndex];
                    } else {
                        parser = this.cachedParsers[meta.part.lIndex] = this.parser(tag, {
                            scopePath: this.scopePath
                        });
                    }

                    try {
                        result = parser.get(scope, this.getContext(meta, num));
                    } catch (error) {
                        throw getScopeParserExecutionError({
                            tag: tag,
                            scope: scope,
                            error: error,
                            offset: meta.part.offset
                        });
                    }

                    if (result == null && num > 0) {
                        return _getValue.call(this, tag, meta, num - 1);
                    }

                    return result;
                }

                function _getValueAsync(tag, meta, num) {
                    var _this2 = this;

                    var scope = this.scopeList[num]; // search in the scopes (in reverse order) and keep the first defined value

                    var parser;

                    if (!this.cachedParsers || !meta.part) {
                        parser = this.parser(tag, {
                            scopePath: this.scopePath
                        });
                    } else if (this.cachedParsers[meta.part.lIndex]) {
                        parser = this.cachedParsers[meta.part.lIndex];
                    } else {
                        parser = this.cachedParsers[meta.part.lIndex] = this.parser(tag, {
                            scopePath: this.scopePath
                        });
                    }

                    return Promise.resolve().then(function () {
                        return parser.get(scope, _this2.getContext(meta, num));
                    })["catch"](function (error) {
                        throw getScopeParserExecutionError({
                            tag: tag,
                            scope: scope,
                            error: error,
                            offset: meta.part.offset
                        });
                    }).then(function (result) {
                        if (result == null && num > 0) {
                            return _getValueAsync.call(_this2, tag, meta, num - 1);
                        }

                        return result;
                    });
                }

                var ScopeManager = /*#__PURE__*/function () {
                    function ScopeManager(options) {
                        _classCallCheck(this, ScopeManager);

                        this.root = options.root || this;
                        this.resolveOffset = options.resolveOffset || 0;
                        this.scopePath = options.scopePath;
                        this.scopePathItem = options.scopePathItem;
                        this.scopePathLength = options.scopePathLength;
                        this.scopeList = options.scopeList;
                        this.scopeLindex = options.scopeLindex;
                        this.parser = options.parser;
                        this.resolved = options.resolved;
                        this.cachedParsers = options.cachedParsers;
                    }

                    _createClass(ScopeManager, [{
                        key: "loopOver",
                        value: function loopOver(tag, functor, inverted, meta) {
                            return this.loopOverValue(this.getValue(tag, meta), functor, inverted);
                        }
                    }, {
                        key: "functorIfInverted",
                        value: function functorIfInverted(inverted, functor, value, i, length) {
                            if (inverted) {
                                functor(value, i, length);
                            }

                            return inverted;
                        }
                    }, {
                        key: "isValueFalsy",
                        value: function isValueFalsy(value, type) {
                            return value == null || !value || type === "[object Array]" && value.length === 0;
                        }
                    }, {
                        key: "loopOverValue",
                        value: function loopOverValue(value, functor, inverted) {
                            if (this.root.finishedResolving) {
                                inverted = false;
                            }

                            var type = Object.prototype.toString.call(value);

                            if (this.isValueFalsy(value, type)) {
                                return this.functorIfInverted(inverted, functor, last(this.scopeList), 0, 1);
                            }

                            if (type === "[object Array]") {
                                for (var i = 0; i < value.length; i++) {
                                    this.functorIfInverted(!inverted, functor, value[i], i, value.length);
                                }

                                return true;
                            }

                            if (type === "[object Object]") {
                                return this.functorIfInverted(!inverted, functor, value, 0, 1);
                            }

                            return this.functorIfInverted(!inverted, functor, last(this.scopeList), 0, 1);
                        }
                    }, {
                        key: "getValue",
                        value: function getValue(tag, meta) {
                            var result = _getValue.call(this, tag, meta, this.scopeList.length - 1);

                            if (typeof result === "function") {
                                return result(this.scopeList[this.scopeList.length - 1], this);
                            }

                            return result;
                        }
                    }, {
                        key: "getValueAsync",
                        value: function getValueAsync(tag, meta) {
                            var _this3 = this;

                            return _getValueAsync.call(this, tag, meta, this.scopeList.length - 1).then(function (result) {
                                if (typeof result === "function") {
                                    return result(_this3.scopeList[_this3.scopeList.length - 1], _this3);
                                }

                                return result;
                            });
                        }
                    }, {
                        key: "getContext",
                        value: function getContext(meta, num) {
                            return {
                                num: num,
                                meta: meta,
                                scopeList: this.scopeList,
                                resolved: this.resolved,
                                scopePath: this.scopePath,
                                scopePathItem: this.scopePathItem,
                                scopePathLength: this.scopePathLength
                            };
                        }
                    }, {
                        key: "createSubScopeManager",
                        value: function createSubScopeManager(scope, tag, i, part, length) {
                            return new ScopeManager({
                                root: this.root,
                                resolveOffset: this.resolveOffset,
                                resolved: this.resolved,
                                parser: this.parser,
                                cachedParsers: this.cachedParsers,
                                scopeList: concatArrays([this.scopeList, [scope]]),
                                scopePath: concatArrays([this.scopePath, [tag]]),
                                scopePathItem: concatArrays([this.scopePathItem, [i]]),
                                scopePathLength: concatArrays([this.scopePathLength, [length]]),
                                scopeLindex: concatArrays([this.scopeLindex, [part.lIndex]])
                            });
                        }
                    }]);

                    return ScopeManager;
                }();

                module.exports = function (options) {
                    options.scopePath = [];
                    options.scopePathItem = [];
                    options.scopePathLength = [];
                    options.scopeLindex = [];
                    options.scopeList = [options.tags];
                    return new ScopeManager(options);
                };

                /***/
            }),

      /***/ 505:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

                function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

                function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

                function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

                function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

                function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

                function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

                function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

                function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

                function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

                function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

                function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

                function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

                var _require = __webpack_require__(557),
                    getRightOrNull = _require.getRightOrNull,
                    getRight = _require.getRight,
                    getLeft = _require.getLeft,
                    getLeftOrNull = _require.getLeftOrNull,
                    chunkBy = _require.chunkBy,
                    isTagStart = _require.isTagStart,
                    isTagEnd = _require.isTagEnd,
                    isContent = _require.isContent,
                    last = _require.last,
                    first = _require.first;

                var _require2 = __webpack_require__(257),
                    XTTemplateError = _require2.XTTemplateError,
                    throwExpandNotFound = _require2.throwExpandNotFound,
                    getLoopPositionProducesInvalidXMLError = _require2.getLoopPositionProducesInvalidXMLError;

                function lastTagIsOpenTag(tags, tag) {
                    if (tags.length === 0) {
                        return false;
                    }

                    var innerLastTag = last(tags).substr(1);
                    return innerLastTag.indexOf(tag) === 0;
                }

                function getListXmlElements(parts) {
                    /*
                    Gets the list of closing and opening tags between two texts. It doesn't take
                    into account tags that are opened then closed. Those that are closed then
                    opened are kept
                        Example input :
                        [
                        {
                            "type": "placeholder",
                            "value": "table1",
                            ...
                        },
                        {
                            "type": "placeholder",
                            "value": "t1data1",
                        },
                        {
                            "type": "tag",
                            "position": "end",
                            "text": true,
                            "value": "</w:t>",
                            "tag": "w:t",
                            "lIndex": 112
                        },
                        {
                            "type": "tag",
                            "value": "</w:r>",
                        },
                        {
                            "type": "tag",
                            "value": "</w:p>",
                        },
                        {
                            "type": "tag",
                            "value": "</w:tc>",
                        },
                        {
                            "type": "tag",
                            "value": "<w:tc>",
                        },
                        {
                            "type": "content",
                            "value": "<w:tcPr><w:tcW w:w="2444" w:type="dxa"/><w:tcBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/></w:tcBorders><w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/></w:tcPr>",
                        },
                        ...
                        {
                            "type": "tag",
                            "value": "<w:r>",
                        },
                        {
                            "type": "tag",
                            "value": "<w:t xml:space="preserve">",
                        },
                        {
                            "type": "placeholder",
                            "value": "t1data4",
                        }
                    ]
                        returns
                        [
                            {
                                "tag": "</w:t>",
                            },
                            {
                                "tag": "</w:r>",
                            },
                            {
                                "tag": "</w:p>",
                            },
                            {
                                "tag": "</w:tc>",
                            },
                            {
                                "tag": "<w:tc>",
                            },
                            {
                                "tag": "<w:p>",
                            },
                            {
                                "tag": "<w:r>",
                            },
                            {
                                "tag": "<w:t>",
                            },
                        ]
                    */
                    var result = [];

                    for (var i = 0; i < parts.length; i++) {
                        var _parts$i = parts[i],
                            position = _parts$i.position,
                            value = _parts$i.value,
                            tag = _parts$i.tag; // Stryker disable all : because removing this condition would also work but we want to make the API future proof

                        if (!tag) {
                            continue;
                        } // Stryker restore all


                        if (position === "end") {
                            if (lastTagIsOpenTag(result, tag)) {
                                result.pop();
                            } else {
                                result.push(value);
                            }
                        } else if (position === "start") {
                            result.push(value);
                        } // ignore position === "selfclosing"

                    }

                    return result;
                }

                function has(name, xmlElements) {
                    for (var i = 0; i < xmlElements.length; i++) {
                        var xmlElement = xmlElements[i];

                        if (xmlElement.indexOf("<".concat(name)) === 0) {
                            return true;
                        }
                    }

                    return false;
                }

                function getExpandToDefault(postparsed, pair, expandTags) {
                    var parts = postparsed.slice(pair[0].offset, pair[1].offset);
                    var xmlElements = getListXmlElements(parts);
                    var closingTagCount = xmlElements.filter(function (tag) {
                        return tag[1] === "/";
                    }).length;
                    var startingTagCount = xmlElements.filter(function (tag) {
                        return tag[1] !== "/" && tag[tag.length - 2] !== "/";
                    }).length;

                    if (closingTagCount !== startingTagCount) {
                        return {
                            error: getLoopPositionProducesInvalidXMLError({
                                tag: first(pair).part.value,
                                offset: [first(pair).part.offset, last(pair).part.offset]
                            })
                        };
                    }

                    var _loop = function _loop(i, len) {
                        var _expandTags$i = expandTags[i],
                            contains = _expandTags$i.contains,
                            expand = _expandTags$i.expand,
                            onlyTextInTag = _expandTags$i.onlyTextInTag;

                        if (has(contains, xmlElements)) {
                            if (onlyTextInTag) {
                                var left = getLeftOrNull(postparsed, contains, pair[0].offset);
                                var right = getRightOrNull(postparsed, contains, pair[1].offset);

                                if (left === null || right === null) {
                                    return "continue";
                                }

                                var chunks = chunkBy(postparsed.slice(left, right), function (p) {
                                    return isTagStart(contains, p) ? "start" : isTagEnd(contains, p) ? "end" : null;
                                });
                                var firstChunk = first(chunks);
                                var lastChunk = last(chunks);
                                var firstContent = firstChunk.filter(isContent);
                                var lastContent = lastChunk.filter(isContent);

                                if (firstContent.length !== 1 || lastContent.length !== 1) {
                                    return "continue";
                                }
                            }

                            return {
                                v: {
                                    value: expand
                                }
                            };
                        }
                    };

                    for (var i = 0, len = expandTags.length; i < len; i++) {
                        var _ret = _loop(i, len);

                        if (_ret === "continue") continue;
                        if (_typeof(_ret) === "object") return _ret.v;
                    }

                    return {};
                }

                function getExpandLimit(part, index, postparsed, options) {
                    var expandTo = part.expandTo || options.expandTo; // Stryker disable all : because this condition can be removed in v4 (the only usage was the image module before version 3.12.3 of the image module

                    if (!expandTo) {
                        return;
                    } // Stryker restore all


                    var right, left;

                    try {
                        left = getLeft(postparsed, expandTo, index);
                        right = getRight(postparsed, expandTo, index);
                    } catch (rootError) {
                        if (rootError instanceof XTTemplateError) {
                            throwExpandNotFound(_objectSpread({
                                part: part,
                                rootError: rootError,
                                postparsed: postparsed,
                                expandTo: expandTo,
                                index: index
                            }, options.error));
                        }

                        throw rootError;
                    }

                    return [left, right];
                }

                function expandOne(_ref, part, postparsed, options) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        left = _ref2[0],
                        right = _ref2[1];

                    var index = postparsed.indexOf(part);
                    var leftParts = postparsed.slice(left, index);
                    var rightParts = postparsed.slice(index + 1, right + 1);
                    var inner = options.getInner({
                        postparse: options.postparse,
                        index: index,
                        part: part,
                        leftParts: leftParts,
                        rightParts: rightParts,
                        left: left,
                        right: right,
                        postparsed: postparsed
                    });

                    if (!inner.length) {
                        inner.expanded = [leftParts, rightParts];
                        inner = [inner];
                    }

                    return {
                        left: left,
                        right: right,
                        inner: inner
                    };
                }

                function expandToOne(postparsed, options) {
                    var errors = [];

                    if (postparsed.errors) {
                        errors = postparsed.errors;
                        postparsed = postparsed.postparsed;
                    }

                    var limits = [];

                    for (var i = 0, len = postparsed.length; i < len; i++) {
                        var part = postparsed[i];

                        if (part.type === "placeholder" && part.module === options.moduleName) {
                            try {
                                var limit = getExpandLimit(part, i, postparsed, options);

                                if (!limit) {
                                    continue;
                                }

                                var _limit = _slicedToArray(limit, 2),
                                    left = _limit[0],
                                    right = _limit[1];

                                limits.push({
                                    left: left,
                                    right: right,
                                    part: part,
                                    i: i,
                                    leftPart: postparsed[left],
                                    rightPart: postparsed[right]
                                });
                            } catch (error) {
                                if (error instanceof XTTemplateError) {
                                    errors.push(error);
                                } else {
                                    throw error;
                                }
                            }
                        }
                    }

                    limits.sort(function (l1, l2) {
                        if (l1.left === l2.left) {
                            return l2.part.lIndex < l1.part.lIndex ? 1 : -1;
                        }

                        return l2.left < l1.left ? 1 : -1;
                    });
                    var maxRight = -1;
                    var offset = 0;
                    limits.forEach(function (limit, i) {
                        var _postparsed;

                        maxRight = Math.max(maxRight, i > 0 ? limits[i - 1].right : 0);

                        if (limit.left < maxRight) {
                            return;
                        }

                        var result;

                        try {
                            result = expandOne([limit.left + offset, limit.right + offset], limit.part, postparsed, options);
                        } catch (error) {
                            if (error instanceof XTTemplateError) {
                                errors.push(error);
                            } else {
                                throw error;
                            }
                        }

                        if (!result) {
                            return;
                        }

                        offset += result.inner.length - (result.right + 1 - result.left);

                        (_postparsed = postparsed).splice.apply(_postparsed, [result.left, result.right + 1 - result.left].concat(_toConsumableArray(result.inner)));
                    });
                    return {
                        postparsed: postparsed,
                        errors: errors
                    };
                }

                module.exports = {
                    expandToOne: expandToOne,
                    getExpandToDefault: getExpandToDefault
                };

                /***/
            }),

      /***/ 287:
      /***/ (function (module) {

                function last(a) {
                    return a[a.length - 1];
                }

                function first(a) {
                    return a[0];
                }

                module.exports = {
                    last: last,
                    first: first
                };

                /***/
            }),

      /***/ 465:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                var _require = __webpack_require__(557),
                    pregMatchAll = _require.pregMatchAll;

                module.exports = function xmlMatcher(content, tagsXmlArray) {
                    var res = {
                        content: content
                    };
                    var taj = tagsXmlArray.join("|");
                    var regexp = new RegExp("(?:(<(?:".concat(taj, ")[^>]*>)([^<>]*)</(?:").concat(taj, ")>)|(<(?:").concat(taj, ")[^>]*/>)"), "g");
                    res.matches = pregMatchAll(regexp, res.content);
                    return res;
                };

                /***/
            }),

      /***/ 827:
      /***/ (function (module, __unused_webpack_exports, __webpack_require__) {

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

                function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

                var _require = __webpack_require__(557),
                    wordToUtf8 = _require.wordToUtf8,
                    convertSpaces = _require.convertSpaces;

                var xmlMatcher = __webpack_require__(465);

                var Lexer = __webpack_require__(303);

                var Parser = __webpack_require__(190);

                var _render = __webpack_require__(89);

                var postrender = __webpack_require__(393);

                var resolve = __webpack_require__(207);

                var joinUncorrupt = __webpack_require__(127);

                function _getFullText(content, tagsXmlArray) {
                    var matcher = xmlMatcher(content, tagsXmlArray);
                    var result = matcher.matches.map(function (match) {
                        return match.array[2];
                    });
                    return wordToUtf8(convertSpaces(result.join("")));
                }

                module.exports = /*#__PURE__*/function () {
                    function XmlTemplater(content, options) {
                        var _this = this;

                        _classCallCheck(this, XmlTemplater);

                        this.cachedParsers = {};
                        this.content = content;
                        Object.keys(options).forEach(function (key) {
                            _this[key] = options[key];
                        });
                        this.setModules({
                            inspect: {
                                filePath: options.filePath
                            }
                        });
                    }

                    _createClass(XmlTemplater, [{
                        key: "resolveTags",
                        value: function resolveTags(tags) {
                            var _this2 = this;

                            this.tags = tags;
                            var options = this.getOptions();
                            var filePath = this.filePath;
                            options.scopeManager = this.scopeManager;
                            options.resolve = resolve;
                            return resolve(options).then(function (_ref) {
                                var resolved = _ref.resolved,
                                    errors = _ref.errors;
                                errors.forEach(function (error) {
                                    // error properties might not be defined if some foreign error
                                    // (unhandled error not thrown by docxtemplater willingly) is
                                    // thrown.
                                    error.properties = error.properties || {};
                                    error.properties.file = filePath;
                                });

                                if (errors.length !== 0) {
                                    throw errors;
                                }

                                return Promise.all(resolved).then(function (resolved) {
                                    options.scopeManager.root.finishedResolving = true;
                                    options.scopeManager.resolved = resolved;

                                    _this2.setModules({
                                        inspect: {
                                            resolved: resolved,
                                            filePath: filePath
                                        }
                                    });

                                    return resolved;
                                });
                            });
                        }
                    }, {
                        key: "getFullText",
                        value: function getFullText() {
                            return _getFullText(this.content, this.fileTypeConfig.tagsXmlTextArray);
                        }
                    }, {
                        key: "setModules",
                        value: function setModules(obj) {
                            this.modules.forEach(function (module) {
                                module.set(obj);
                            });
                        }
                    }, {
                        key: "preparse",
                        value: function preparse() {
                            this.allErrors = [];
                            this.xmllexed = Lexer.xmlparse(this.content, {
                                text: this.fileTypeConfig.tagsXmlTextArray,
                                other: this.fileTypeConfig.tagsXmlLexedArray
                            });
                            this.setModules({
                                inspect: {
                                    xmllexed: this.xmllexed
                                }
                            });

                            var _Lexer$parse = Lexer.parse(this.xmllexed, this.delimiters),
                                lexed = _Lexer$parse.lexed,
                                lexerErrors = _Lexer$parse.errors;

                            this.allErrors = this.allErrors.concat(lexerErrors);
                            this.lexed = lexed;
                            this.setModules({
                                inspect: {
                                    lexed: this.lexed
                                }
                            });
                            var options = this.getOptions();
                            Parser.preparse(this.lexed, this.modules, options);
                        }
                    }, {
                        key: "parse",
                        value: function parse() {
                            this.setModules({
                                inspect: {
                                    filePath: this.filePath
                                }
                            });
                            var options = this.getOptions();
                            this.parsed = Parser.parse(this.lexed, this.modules, options);
                            this.setModules({
                                inspect: {
                                    parsed: this.parsed
                                }
                            });

                            var _Parser$postparse = Parser.postparse(this.parsed, this.modules, options),
                                postparsed = _Parser$postparse.postparsed,
                                postparsedErrors = _Parser$postparse.errors;

                            this.postparsed = postparsed;
                            this.setModules({
                                inspect: {
                                    postparsed: this.postparsed
                                }
                            });
                            this.allErrors = this.allErrors.concat(postparsedErrors);
                            this.errorChecker(this.allErrors);
                            return this;
                        }
                    }, {
                        key: "errorChecker",
                        value: function errorChecker(errors) {
                            var _this3 = this;

                            errors.forEach(function (error) {
                                // error properties might not be defined if some foreign
                                // (unhandled error not thrown by docxtemplater willingly) is
                                // thrown.
                                error.properties = error.properties || {};
                                error.properties.file = _this3.filePath;
                            });
                            this.modules.forEach(function (module) {
                                errors = module.errorsTransformer(errors);
                            });
                        }
                    }, {
                        key: "baseNullGetter",
                        value: function baseNullGetter(part, sm) {
                            var _this4 = this;

                            var value = this.modules.reduce(function (value, module) {
                                if (value != null) {
                                    return value;
                                }

                                return module.nullGetter(part, sm, _this4);
                            }, null);

                            if (value != null) {
                                return value;
                            }

                            return this.nullGetter(part, sm);
                        }
                    }, {
                        key: "getOptions",
                        value: function getOptions() {
                            return {
                                compiled: this.postparsed,
                                cachedParsers: this.cachedParsers,
                                tags: this.tags,
                                modules: this.modules,
                                parser: this.parser,
                                contentType: this.contentType,
                                baseNullGetter: this.baseNullGetter.bind(this),
                                filePath: this.filePath,
                                fileTypeConfig: this.fileTypeConfig,
                                fileType: this.fileType,
                                linebreaks: this.linebreaks
                            };
                        }
                    }, {
                        key: "render",
                        value: function render(to) {
                            this.filePath = to;
                            var options = this.getOptions();
                            options.resolved = this.scopeManager.resolved;
                            options.scopeManager = this.scopeManager;
                            options.render = _render;
                            options.joinUncorrupt = joinUncorrupt;

                            var _render2 = _render(options),
                                errors = _render2.errors,
                                parts = _render2.parts;

                            if (errors.length > 0) {
                                this.allErrors = errors;
                                this.errorChecker(errors);
                                return this;
                            }

                            this.content = postrender(parts, options);
                            this.setModules({
                                inspect: {
                                    content: this.content
                                }
                            });
                            return this;
                        }
                    }]);

                    return XmlTemplater;
                }();

                /***/
            })

        /******/
    });
      /************************************************************************/
      /******/ 	// The module cache
      /******/ 	var __webpack_module_cache__ = {};
      /******/
      /******/ 	// The require function
      /******/ 	function __webpack_require__(moduleId) {
      /******/ 		// Check if module is in cache
      /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
      /******/ 		if (cachedModule !== undefined) {
      /******/ 			return cachedModule.exports;
            /******/
        }
      /******/ 		// Create a new module (and put it into the cache)
      /******/ 		var module = __webpack_module_cache__[moduleId] = {
      /******/ 			// no module.id needed
      /******/ 			// no module.loaded needed
      /******/ 			exports: {}
            /******/
        };
      /******/
      /******/ 		// Execute the module function
      /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
      /******/
      /******/ 		// Return the exports of the module
      /******/ 		return module.exports;
        /******/
    }
      /******/
      /************************************************************************/
      /******/
      /******/ 	// startup
      /******/ 	// Load entry module and return exports
      /******/ 	// This entry module is referenced by other modules so it can't be inlined
      /******/ 	var __webpack_exports__ = __webpack_require__(380);
      /******/ 	window.docxtemplater = __webpack_exports__;
    /******/
    /******/
})()
    ; window["PizZip"] =
      /******/ (function (modules) { // webpackBootstrap
      /******/ 	// The module cache
      /******/ 	var installedModules = {};
      /******/
      /******/ 	// The require function
      /******/ 	function __webpack_require__(moduleId) {
      /******/
      /******/ 		// Check if module is in cache
      /******/ 		if (installedModules[moduleId]) {
      /******/ 			return installedModules[moduleId].exports;
                    /******/
                }
      /******/ 		// Create a new module (and put it into the cache)
      /******/ 		var module = installedModules[moduleId] = {
      /******/ 			i: moduleId,
      /******/ 			l: false,
      /******/ 			exports: {}
                    /******/
                };
      /******/
      /******/ 		// Execute the module function
      /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/
      /******/ 		// Flag the module as loaded
      /******/ 		module.l = true;
      /******/
      /******/ 		// Return the exports of the module
      /******/ 		return module.exports;
                /******/
            }
      /******/
      /******/
      /******/ 	// expose the modules object (__webpack_modules__)
      /******/ 	__webpack_require__.m = modules;
      /******/
      /******/ 	// expose the module cache
      /******/ 	__webpack_require__.c = installedModules;
      /******/
      /******/ 	// define getter function for harmony exports
      /******/ 	__webpack_require__.d = function (exports, name, getter) {
      /******/ 		if (!__webpack_require__.o(exports, name)) {
      /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
                    /******/
                }
                /******/
            };
      /******/
      /******/ 	// define __esModule on exports
      /******/ 	__webpack_require__.r = function (exports) {
      /******/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                    /******/
                }
      /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
                /******/
            };
      /******/
      /******/ 	// create a fake namespace object
      /******/ 	// mode & 1: value is a module id, require it
      /******/ 	// mode & 2: merge all properties of value into the ns
      /******/ 	// mode & 4: return value when already ns object
      /******/ 	// mode & 8|1: behave like require
      /******/ 	__webpack_require__.t = function (value, mode) {
      /******/ 		if (mode & 1) value = __webpack_require__(value);
      /******/ 		if (mode & 8) return value;
      /******/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      /******/ 		var ns = Object.create(null);
      /******/ 		__webpack_require__.r(ns);
      /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
      /******/ 		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
      /******/ 		return ns;
                /******/
            };
      /******/
      /******/ 	// getDefaultExport function for compatibility with non-harmony modules
      /******/ 	__webpack_require__.n = function (module) {
      /******/ 		var getter = module && module.__esModule ?
      /******/ 			function getDefault() { return module['default']; } :
      /******/ 			function getModuleExports() { return module; };
      /******/ 		__webpack_require__.d(getter, 'a', getter);
      /******/ 		return getter;
                /******/
            };
      /******/
      /******/ 	// Object.prototype.hasOwnProperty.call
      /******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
      /******/
      /******/ 	// __webpack_public_path__
      /******/ 	__webpack_require__.p = "";
      /******/
      /******/
      /******/ 	// Load entry module and return exports
      /******/ 	return __webpack_require__(__webpack_require__.s = "./es6/index.js");
            /******/
        })
      /************************************************************************/
      /******/({

      /***/ "./es6/arrayReader.js":
      /*!****************************!*\
        !*** ./es6/arrayReader.js ***!
        \****************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar DataReader = __webpack_require__(/*! ./dataReader.js */ \"./es6/dataReader.js\");\n\nfunction ArrayReader(data) {\n  if (data) {\n    this.data = data;\n    this.length = this.data.length;\n    this.index = 0;\n    this.zero = 0;\n\n    for (var i = 0; i < this.data.length; i++) {\n      data[i] &= data[i];\n    }\n  }\n}\n\nArrayReader.prototype = new DataReader();\n/**\n * @see DataReader.byteAt\n */\n\nArrayReader.prototype.byteAt = function (i) {\n  return this.data[this.zero + i];\n};\n/**\n * @see DataReader.lastIndexOfSignature\n */\n\n\nArrayReader.prototype.lastIndexOfSignature = function (sig) {\n  var sig0 = sig.charCodeAt(0),\n      sig1 = sig.charCodeAt(1),\n      sig2 = sig.charCodeAt(2),\n      sig3 = sig.charCodeAt(3);\n\n  for (var i = this.length - 4; i >= 0; --i) {\n    if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {\n      return i - this.zero;\n    }\n  }\n\n  return -1;\n};\n/**\n * @see DataReader.readData\n */\n\n\nArrayReader.prototype.readData = function (size) {\n  this.checkOffset(size);\n\n  if (size === 0) {\n    return [];\n  }\n\n  var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);\n  this.index += size;\n  return result;\n};\n\nmodule.exports = ArrayReader;\n\n//# sourceURL=webpack://PizZip/./es6/arrayReader.js?");

                    /***/
                }),

      /***/ "./es6/base64.js":
      /*!***********************!*\
        !*** ./es6/base64.js ***!
        \***********************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval(" // private property\n\nvar _keyStr = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\"; // public method for encoding\n\nexports.encode = function (input) {\n  var output = \"\";\n  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;\n  var i = 0;\n\n  while (i < input.length) {\n    chr1 = input.charCodeAt(i++);\n    chr2 = input.charCodeAt(i++);\n    chr3 = input.charCodeAt(i++);\n    enc1 = chr1 >> 2;\n    enc2 = (chr1 & 3) << 4 | chr2 >> 4;\n    enc3 = (chr2 & 15) << 2 | chr3 >> 6;\n    enc4 = chr3 & 63;\n\n    if (isNaN(chr2)) {\n      enc3 = enc4 = 64;\n    } else if (isNaN(chr3)) {\n      enc4 = 64;\n    }\n\n    output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);\n  }\n\n  return output;\n}; // public method for decoding\n\n\nexports.decode = function (input) {\n  var output = \"\";\n  var chr1, chr2, chr3;\n  var enc1, enc2, enc3, enc4;\n  var i = 0;\n  input = input.replace(/[^A-Za-z0-9\\+\\/\\=]/g, \"\");\n\n  while (i < input.length) {\n    enc1 = _keyStr.indexOf(input.charAt(i++));\n    enc2 = _keyStr.indexOf(input.charAt(i++));\n    enc3 = _keyStr.indexOf(input.charAt(i++));\n    enc4 = _keyStr.indexOf(input.charAt(i++));\n    chr1 = enc1 << 2 | enc2 >> 4;\n    chr2 = (enc2 & 15) << 4 | enc3 >> 2;\n    chr3 = (enc3 & 3) << 6 | enc4;\n    output += String.fromCharCode(chr1);\n\n    if (enc3 !== 64) {\n      output += String.fromCharCode(chr2);\n    }\n\n    if (enc4 !== 64) {\n      output += String.fromCharCode(chr3);\n    }\n  }\n\n  return output;\n};\n\n//# sourceURL=webpack://PizZip/./es6/base64.js?");

                    /***/
                }),

      /***/ "./es6/compressedObject.js":
      /*!*********************************!*\
        !*** ./es6/compressedObject.js ***!
        \*********************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nfunction CompressedObject() {\n  this.compressedSize = 0;\n  this.uncompressedSize = 0;\n  this.crc32 = 0;\n  this.compressionMethod = null;\n  this.compressedContent = null;\n}\n\nCompressedObject.prototype = {\n  /**\n   * Return the decompressed content in an unspecified format.\n   * The format will depend on the decompressor.\n   * @return {Object} the decompressed content.\n   */\n  getContent: function getContent() {\n    return null; // see implementation\n  },\n\n  /**\n   * Return the compressed content in an unspecified format.\n   * The format will depend on the compressed conten source.\n   * @return {Object} the compressed content.\n   */\n  getCompressedContent: function getCompressedContent() {\n    return null; // see implementation\n  }\n};\nmodule.exports = CompressedObject;\n\n//# sourceURL=webpack://PizZip/./es6/compressedObject.js?");

                    /***/
                }),

      /***/ "./es6/compressions.js":
      /*!*****************************!*\
        !*** ./es6/compressions.js ***!
        \*****************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nexports.STORE = {\n  magic: \"\\x00\\x00\",\n  compress: function compress(content) {\n    return content; // no compression\n  },\n  uncompress: function uncompress(content) {\n    return content; // no compression\n  },\n  compressInputType: null,\n  uncompressInputType: null\n};\nexports.DEFLATE = __webpack_require__(/*! ./flate.js */ \"./es6/flate.js\");\n\n//# sourceURL=webpack://PizZip/./es6/compressions.js?");

                    /***/
                }),

      /***/ "./es6/crc32.js":
      /*!**********************!*\
        !*** ./es6/crc32.js ***!
        \**********************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\"); // prettier-ignore\n\n\nvar table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];\n/**\n *\n *  Javascript crc32\n *  http://www.webtoolkit.info/\n *\n */\n\nmodule.exports = function crc32(input, crc) {\n  if (typeof input === \"undefined\" || !input.length) {\n    return 0;\n  }\n\n  var isArray = utils.getTypeOf(input) !== \"string\";\n\n  if (typeof crc == \"undefined\") {\n    crc = 0;\n  }\n\n  var x = 0;\n  var y = 0;\n  var b = 0;\n  crc ^= -1;\n\n  for (var i = 0, iTop = input.length; i < iTop; i++) {\n    b = isArray ? input[i] : input.charCodeAt(i);\n    y = (crc ^ b) & 0xff;\n    x = table[y];\n    crc = crc >>> 8 ^ x;\n  }\n\n  return crc ^ -1;\n};\n\n//# sourceURL=webpack://PizZip/./es6/crc32.js?");

                    /***/
                }),

      /***/ "./es6/dataReader.js":
      /*!***************************!*\
        !*** ./es6/dataReader.js ***!
        \***************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n\nfunction DataReader() {\n  this.data = null; // type : see implementation\n\n  this.length = 0;\n  this.index = 0;\n  this.zero = 0;\n}\n\nDataReader.prototype = {\n  /**\n   * Check that the offset will not go too far.\n   * @param {string} offset the additional offset to check.\n   * @throws {Error} an Error if the offset is out of bounds.\n   */\n  checkOffset: function checkOffset(offset) {\n    this.checkIndex(this.index + offset);\n  },\n\n  /**\n   * Check that the specifed index will not be too far.\n   * @param {string} newIndex the index to check.\n   * @throws {Error} an Error if the index is out of bounds.\n   */\n  checkIndex: function checkIndex(newIndex) {\n    if (this.length < this.zero + newIndex || newIndex < 0) {\n      throw new Error(\"End of data reached (data length = \" + this.length + \", asked index = \" + newIndex + \"). Corrupted zip ?\");\n    }\n  },\n\n  /**\n   * Change the index.\n   * @param {number} newIndex The new index.\n   * @throws {Error} if the new index is out of the data.\n   */\n  setIndex: function setIndex(newIndex) {\n    this.checkIndex(newIndex);\n    this.index = newIndex;\n  },\n\n  /**\n   * Skip the next n bytes.\n   * @param {number} n the number of bytes to skip.\n   * @throws {Error} if the new index is out of the data.\n   */\n  skip: function skip(n) {\n    this.setIndex(this.index + n);\n  },\n\n  /**\n   * Get the byte at the specified index.\n   * @param {number} i the index to use.\n   * @return {number} a byte.\n   */\n  byteAt: function byteAt() {// see implementations\n  },\n\n  /**\n   * Get the next number with a given byte size.\n   * @param {number} size the number of bytes to read.\n   * @return {number} the corresponding number.\n   */\n  readInt: function readInt(size) {\n    var result = 0,\n        i;\n    this.checkOffset(size);\n\n    for (i = this.index + size - 1; i >= this.index; i--) {\n      result = (result << 8) + this.byteAt(i);\n    }\n\n    this.index += size;\n    return result;\n  },\n\n  /**\n   * Get the next string with a given byte size.\n   * @param {number} size the number of bytes to read.\n   * @return {string} the corresponding string.\n   */\n  readString: function readString(size) {\n    return utils.transformTo(\"string\", this.readData(size));\n  },\n\n  /**\n   * Get raw data without conversion, <size> bytes.\n   * @param {number} size the number of bytes to read.\n   * @return {Object} the raw data, implementation specific.\n   */\n  readData: function readData() {// see implementations\n  },\n\n  /**\n   * Find the last occurence of a zip signature (4 bytes).\n   * @param {string} sig the signature to find.\n   * @return {number} the index of the last occurence, -1 if not found.\n   */\n  lastIndexOfSignature: function lastIndexOfSignature() {// see implementations\n  },\n\n  /**\n   * Get the next date.\n   * @return {Date} the date.\n   */\n  readDate: function readDate() {\n    var dostime = this.readInt(4);\n    return new Date((dostime >> 25 & 0x7f) + 1980, // year\n    (dostime >> 21 & 0x0f) - 1, // month\n    dostime >> 16 & 0x1f, // day\n    dostime >> 11 & 0x1f, // hour\n    dostime >> 5 & 0x3f, // minute\n    (dostime & 0x1f) << 1); // second\n  }\n};\nmodule.exports = DataReader;\n\n//# sourceURL=webpack://PizZip/./es6/dataReader.js?");

                    /***/
                }),

      /***/ "./es6/defaults.js":
      /*!*************************!*\
        !*** ./es6/defaults.js ***!
        \*************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nexports.base64 = false;\nexports.binary = false;\nexports.dir = false;\nexports.createFolders = false;\nexports.date = null;\nexports.compression = null;\nexports.compressionOptions = null;\nexports.comment = null;\nexports.unixPermissions = null;\nexports.dosPermissions = null;\n\n//# sourceURL=webpack://PizZip/./es6/defaults.js?");

                    /***/
                }),

      /***/ "./es6/deprecatedPublicUtils.js":
      /*!**************************************!*\
        !*** ./es6/deprecatedPublicUtils.js ***!
        \**************************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.string2binary = function (str) {\n  return utils.string2binary(str);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.string2Uint8Array = function (str) {\n  return utils.transformTo(\"uint8array\", str);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.uint8Array2String = function (array) {\n  return utils.transformTo(\"string\", array);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.string2Blob = function (str) {\n  var buffer = utils.transformTo(\"arraybuffer\", str);\n  return utils.arrayBuffer2Blob(buffer);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.arrayBuffer2Blob = function (buffer) {\n  return utils.arrayBuffer2Blob(buffer);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.transformTo = function (outputType, input) {\n  return utils.transformTo(outputType, input);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.getTypeOf = function (input) {\n  return utils.getTypeOf(input);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.checkSupport = function (type) {\n  return utils.checkSupport(type);\n};\n/**\n * @deprecated\n * This value will be removed in a future version without replacement.\n */\n\n\nexports.MAX_VALUE_16BITS = utils.MAX_VALUE_16BITS;\n/**\n * @deprecated\n * This value will be removed in a future version without replacement.\n */\n\nexports.MAX_VALUE_32BITS = utils.MAX_VALUE_32BITS;\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\nexports.pretty = function (str) {\n  return utils.pretty(str);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.findCompression = function (compressionMethod) {\n  return utils.findCompression(compressionMethod);\n};\n/**\n * @deprecated\n * This function will be removed in a future version without replacement.\n */\n\n\nexports.isRegExp = function (object) {\n  return utils.isRegExp(object);\n};\n\n//# sourceURL=webpack://PizZip/./es6/deprecatedPublicUtils.js?");

                    /***/
                }),

      /***/ "./es6/flate.js":
      /*!**********************!*\
        !*** ./es6/flate.js ***!
        \**********************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar USE_TYPEDARRAY = typeof Uint8Array !== \"undefined\" && typeof Uint16Array !== \"undefined\" && typeof Uint32Array !== \"undefined\";\n\nvar pako = __webpack_require__(/*! pako/dist/pako.es5.js */ \"./node_modules/pako/dist/pako.es5.js\");\n\nexports.uncompressInputType = USE_TYPEDARRAY ? \"uint8array\" : \"array\";\nexports.compressInputType = USE_TYPEDARRAY ? \"uint8array\" : \"array\";\nexports.magic = \"\\x08\\x00\";\n\nexports.compress = function (input, compressionOptions) {\n  return pako.deflateRaw(input, {\n    level: compressionOptions.level || -1 // default compression\n\n  });\n};\n\nexports.uncompress = function (input) {\n  return pako.inflateRaw(input);\n};\n\n//# sourceURL=webpack://PizZip/./es6/flate.js?");

                    /***/
                }),

      /***/ "./es6/index.js":
      /*!**********************!*\
        !*** ./es6/index.js ***!
        \**********************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar base64 = __webpack_require__(/*! ./base64.js */ \"./es6/base64.js\");\n/**\nUsage:\n   zip = new PizZip();\n   zip.file(\"hello.txt\", \"Hello, World!\").file(\"tempfile\", \"nothing\");\n   zip.folder(\"images\").file(\"smile.gif\", base64Data, {base64: true});\n   zip.file(\"Xmas.txt\", \"Ho ho ho !\", {date : new Date(\"December 25, 2007 00:00:01\")});\n   zip.remove(\"tempfile\");\n\n   base64zip = zip.generate();\n\n**/\n\n/**\n * Representation a of zip file in js\n * @constructor\n * @param {String=|ArrayBuffer=|Uint8Array=} data the data to load, if any (optional).\n * @param {Object=} options the options for creating this objects (optional).\n */\n\n\nfunction PizZip(data, options) {\n  // if this constructor is used without `new`, it adds `new` before itself:\n  if (!(this instanceof PizZip)) {\n    return new PizZip(data, options);\n  } // object containing the files :\n  // {\n  //   \"folder/\" : {...},\n  //   \"folder/data.txt\" : {...}\n  // }\n\n\n  this.files = {};\n  this.comment = null; // Where we are in the hierarchy\n\n  this.root = \"\";\n\n  if (data) {\n    this.load(data, options);\n  }\n\n  this.clone = function () {\n    var newObj = new PizZip();\n\n    for (var i in this) {\n      if (typeof this[i] !== \"function\") {\n        newObj[i] = this[i];\n      }\n    }\n\n    return newObj;\n  };\n}\n\nPizZip.prototype = __webpack_require__(/*! ./object.js */ \"./es6/object.js\");\nPizZip.prototype.load = __webpack_require__(/*! ./load.js */ \"./es6/load.js\");\nPizZip.support = __webpack_require__(/*! ./support.js */ \"./es6/support.js\");\nPizZip.defaults = __webpack_require__(/*! ./defaults.js */ \"./es6/defaults.js\");\n/**\n * @deprecated\n * This namespace will be removed in a future version without replacement.\n */\n\nPizZip.utils = __webpack_require__(/*! ./deprecatedPublicUtils.js */ \"./es6/deprecatedPublicUtils.js\");\nPizZip.base64 = {\n  /**\n   * @deprecated\n   * This method will be removed in a future version without replacement.\n   */\n  encode: function encode(input) {\n    return base64.encode(input);\n  },\n\n  /**\n   * @deprecated\n   * This method will be removed in a future version without replacement.\n   */\n  decode: function decode(input) {\n    return base64.decode(input);\n  }\n};\nPizZip.compressions = __webpack_require__(/*! ./compressions.js */ \"./es6/compressions.js\");\nmodule.exports = PizZip;\n\n//# sourceURL=webpack://PizZip/./es6/index.js?");

                    /***/
                }),

      /***/ "./es6/load.js":
      /*!*********************!*\
        !*** ./es6/load.js ***!
        \*********************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar base64 = __webpack_require__(/*! ./base64.js */ \"./es6/base64.js\");\n\nvar utf8 = __webpack_require__(/*! ./utf8.js */ \"./es6/utf8.js\");\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n\nvar ZipEntries = __webpack_require__(/*! ./zipEntries.js */ \"./es6/zipEntries.js\");\n\nmodule.exports = function (data, options) {\n  var i, input;\n  options = utils.extend(options || {}, {\n    base64: false,\n    checkCRC32: false,\n    optimizedBinaryString: false,\n    createFolders: false,\n    decodeFileName: utf8.utf8decode\n  });\n\n  if (options.base64) {\n    data = base64.decode(data);\n  }\n\n  var zipEntries = new ZipEntries(data, options);\n  var files = zipEntries.files;\n\n  for (i = 0; i < files.length; i++) {\n    input = files[i];\n    this.file(input.fileNameStr, input.decompressed, {\n      binary: true,\n      optimizedBinaryString: true,\n      date: input.date,\n      dir: input.dir,\n      comment: input.fileCommentStr.length ? input.fileCommentStr : null,\n      unixPermissions: input.unixPermissions,\n      dosPermissions: input.dosPermissions,\n      createFolders: options.createFolders\n    });\n  }\n\n  if (zipEntries.zipComment.length) {\n    this.comment = zipEntries.zipComment;\n  }\n\n  return this;\n};\n\n//# sourceURL=webpack://PizZip/./es6/load.js?");

                    /***/
                }),

      /***/ "./es6/nodeBuffer.js":
      /*!***************************!*\
        !*** ./es6/nodeBuffer.js ***!
        \***************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("/* WEBPACK VAR INJECTION */(function(Buffer) {\n\nmodule.exports = function (data, encoding) {\n  if (typeof data === \"number\") {\n    return Buffer.alloc(data);\n  }\n\n  return Buffer.from(data, encoding);\n};\n\nmodule.exports.test = function (b) {\n  return Buffer.isBuffer(b);\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/buffer/index.js */ \"./node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack://PizZip/./es6/nodeBuffer.js?");

                    /***/
                }),

      /***/ "./es6/nodeBufferReader.js":
      /*!*********************************!*\
        !*** ./es6/nodeBufferReader.js ***!
        \*********************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar Uint8ArrayReader = __webpack_require__(/*! ./uint8ArrayReader.js */ \"./es6/uint8ArrayReader.js\");\n\nfunction NodeBufferReader(data) {\n  this.data = data;\n  this.length = this.data.length;\n  this.index = 0;\n  this.zero = 0;\n}\n\nNodeBufferReader.prototype = new Uint8ArrayReader();\n/**\n * @see DataReader.readData\n */\n\nNodeBufferReader.prototype.readData = function (size) {\n  this.checkOffset(size);\n  var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);\n  this.index += size;\n  return result;\n};\n\nmodule.exports = NodeBufferReader;\n\n//# sourceURL=webpack://PizZip/./es6/nodeBufferReader.js?");

                    /***/
                }),

      /***/ "./es6/object.js":
      /*!***********************!*\
        !*** ./es6/object.js ***!
        \***********************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar support = __webpack_require__(/*! ./support.js */ \"./es6/support.js\");\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n\nvar _crc = __webpack_require__(/*! ./crc32.js */ \"./es6/crc32.js\");\n\nvar signature = __webpack_require__(/*! ./signature.js */ \"./es6/signature.js\");\n\nvar defaults = __webpack_require__(/*! ./defaults.js */ \"./es6/defaults.js\");\n\nvar base64 = __webpack_require__(/*! ./base64.js */ \"./es6/base64.js\");\n\nvar compressions = __webpack_require__(/*! ./compressions.js */ \"./es6/compressions.js\");\n\nvar CompressedObject = __webpack_require__(/*! ./compressedObject.js */ \"./es6/compressedObject.js\");\n\nvar nodeBuffer = __webpack_require__(/*! ./nodeBuffer.js */ \"./es6/nodeBuffer.js\");\n\nvar utf8 = __webpack_require__(/*! ./utf8.js */ \"./es6/utf8.js\");\n\nvar StringWriter = __webpack_require__(/*! ./stringWriter.js */ \"./es6/stringWriter.js\");\n\nvar Uint8ArrayWriter = __webpack_require__(/*! ./uint8ArrayWriter.js */ \"./es6/uint8ArrayWriter.js\");\n/**\n * Returns the raw data of a ZipObject, decompress the content if necessary.\n * @param {ZipObject} file the file to use.\n * @return {String|ArrayBuffer|Uint8Array|Buffer} the data.\n */\n\n\nfunction getRawData(file) {\n  if (file._data instanceof CompressedObject) {\n    file._data = file._data.getContent();\n    file.options.binary = true;\n    file.options.base64 = false;\n\n    if (utils.getTypeOf(file._data) === \"uint8array\") {\n      var copy = file._data; // when reading an arraybuffer, the CompressedObject mechanism will keep it and subarray() a Uint8Array.\n      // if we request a file in the same format, we might get the same Uint8Array or its ArrayBuffer (the original zip file).\n\n      file._data = new Uint8Array(copy.length); // with an empty Uint8Array, Opera fails with a \"Offset larger than array size\"\n\n      if (copy.length !== 0) {\n        file._data.set(copy, 0);\n      }\n    }\n  }\n\n  return file._data;\n}\n/**\n * Returns the data of a ZipObject in a binary form. If the content is an unicode string, encode it.\n * @param {ZipObject} file the file to use.\n * @return {String|ArrayBuffer|Uint8Array|Buffer} the data.\n */\n\n\nfunction getBinaryData(file) {\n  var result = getRawData(file),\n      type = utils.getTypeOf(result);\n\n  if (type === \"string\") {\n    if (!file.options.binary) {\n      // unicode text !\n      // unicode string => binary string is a painful process, check if we can avoid it.\n      if (support.nodebuffer) {\n        return nodeBuffer(result, \"utf-8\");\n      }\n    }\n\n    return file.asBinary();\n  }\n\n  return result;\n} // return the actual prototype of PizZip\n\n\nvar out = {\n  /**\n   * Read an existing zip and merge the data in the current PizZip object.\n   * The implementation is in pizzip-load.js, don't forget to include it.\n   * @param {String|ArrayBuffer|Uint8Array|Buffer} stream  The stream to load\n   * @param {Object} options Options for loading the stream.\n   *  options.base64 : is the stream in base64 ? default : false\n   * @return {PizZip} the current PizZip object\n   */\n  load: function load() {\n    throw new Error(\"Load method is not defined. Is the file pizzip-load.js included ?\");\n  },\n\n  /**\n   * Filter nested files/folders with the specified function.\n   * @param {Function} search the predicate to use :\n   * function (relativePath, file) {...}\n   * It takes 2 arguments : the relative path and the file.\n   * @return {Array} An array of matching elements.\n   */\n  filter: function filter(search) {\n    var result = [];\n    var filename, relativePath, file, fileClone;\n\n    for (filename in this.files) {\n      if (!this.files.hasOwnProperty(filename)) {\n        continue;\n      }\n\n      file = this.files[filename]; // return a new object, don't let the user mess with our internal objects :)\n\n      fileClone = new ZipObject(file.name, file._data, utils.extend(file.options));\n      relativePath = filename.slice(this.root.length, filename.length);\n\n      if (filename.slice(0, this.root.length) === this.root && // the file is in the current root\n      search(relativePath, fileClone)) {\n        // and the file matches the function\n        result.push(fileClone);\n      }\n    }\n\n    return result;\n  },\n\n  /**\n   * Add a file to the zip file, or search a file.\n   * @param   {string|RegExp} name The name of the file to add (if data is defined),\n   * the name of the file to find (if no data) or a regex to match files.\n   * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded\n   * @param   {Object} o     File options\n   * @return  {PizZip|Object|Array} this PizZip object (when adding a file),\n   * a file (when searching by string) or an array of files (when searching by regex).\n   */\n  file: function file(name, data, o) {\n    if (arguments.length === 1) {\n      if (utils.isRegExp(name)) {\n        var regexp = name;\n        return this.filter(function (relativePath, file) {\n          return !file.dir && regexp.test(relativePath);\n        });\n      } // text\n\n\n      return this.filter(function (relativePath, file) {\n        return !file.dir && relativePath === name;\n      })[0] || null;\n    } // more than one argument : we have data !\n\n\n    name = this.root + name;\n    fileAdd.call(this, name, data, o);\n    return this;\n  },\n\n  /**\n   * Add a directory to the zip file, or search.\n   * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.\n   * @return  {PizZip} an object with the new directory as the root, or an array containing matching folders.\n   */\n  folder: function folder(arg) {\n    if (!arg) {\n      return this;\n    }\n\n    if (utils.isRegExp(arg)) {\n      return this.filter(function (relativePath, file) {\n        return file.dir && arg.test(relativePath);\n      });\n    } // else, name is a new folder\n\n\n    var name = this.root + arg;\n    var newFolder = folderAdd.call(this, name); // Allow chaining by returning a new object with this folder as the root\n\n    var ret = this.clone();\n    ret.root = newFolder.name;\n    return ret;\n  },\n\n  /**\n   * Delete a file, or a directory and all sub-files, from the zip\n   * @param {string} name the name of the file to delete\n   * @return {PizZip} this PizZip object\n   */\n  remove: function remove(name) {\n    name = this.root + name;\n    var file = this.files[name];\n\n    if (!file) {\n      // Look for any folders\n      if (name.slice(-1) !== \"/\") {\n        name += \"/\";\n      }\n\n      file = this.files[name];\n    }\n\n    if (file && !file.dir) {\n      // file\n      delete this.files[name];\n    } else {\n      // maybe a folder, delete recursively\n      var kids = this.filter(function (relativePath, file) {\n        return file.name.slice(0, name.length) === name;\n      });\n\n      for (var i = 0; i < kids.length; i++) {\n        delete this.files[kids[i].name];\n      }\n    }\n\n    return this;\n  },\n\n  /**\n   * Generate the complete zip file\n   * @param {Object} options the options to generate the zip file :\n   * - base64, (deprecated, use type instead) true to generate base64.\n   * - compression, \"STORE\" by default.\n   * - type, \"base64\" by default. Values are : string, base64, uint8array, arraybuffer, blob.\n   * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the zip file\n   */\n  generate: function generate(options) {\n    options = utils.extend(options || {}, {\n      base64: true,\n      compression: \"STORE\",\n      compressionOptions: null,\n      type: \"base64\",\n      platform: \"DOS\",\n      comment: null,\n      mimeType: \"application/zip\",\n      encodeFileName: utf8.utf8encode\n    });\n    utils.checkSupport(options.type); // accept nodejs `process.platform`\n\n    if (options.platform === \"darwin\" || options.platform === \"freebsd\" || options.platform === \"linux\" || options.platform === \"sunos\") {\n      options.platform = \"UNIX\";\n    }\n\n    if (options.platform === \"win32\") {\n      options.platform = \"DOS\";\n    }\n\n    var zipData = [],\n        encodedComment = utils.transformTo(\"string\", options.encodeFileName(options.comment || this.comment || \"\"));\n    var localDirLength = 0,\n        centralDirLength = 0,\n        writer,\n        i; // first, generate all the zip parts.\n\n    for (var name in this.files) {\n      if (!this.files.hasOwnProperty(name)) {\n        continue;\n      }\n\n      var file = this.files[name];\n      var compressionName = file.options.compression || options.compression.toUpperCase();\n      var compression = compressions[compressionName];\n\n      if (!compression) {\n        throw new Error(compressionName + \" is not a valid compression method !\");\n      }\n\n      var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};\n      var compressedObject = generateCompressedObjectFrom.call(this, file, compression, compressionOptions);\n      var zipPart = generateZipParts.call(this, name, file, compressedObject, localDirLength, options.platform, options.encodeFileName);\n      localDirLength += zipPart.fileRecord.length + compressedObject.compressedSize;\n      centralDirLength += zipPart.dirRecord.length;\n      zipData.push(zipPart);\n    }\n\n    var dirEnd = \"\"; // end of central dir signature\n\n    dirEnd = signature.CENTRAL_DIRECTORY_END + // number of this disk\n    \"\\x00\\x00\" + // number of the disk with the start of the central directory\n    \"\\x00\\x00\" + // total number of entries in the central directory on this disk\n    decToHex(zipData.length, 2) + // total number of entries in the central directory\n    decToHex(zipData.length, 2) + // size of the central directory   4 bytes\n    decToHex(centralDirLength, 4) + // offset of start of central directory with respect to the starting disk number\n    decToHex(localDirLength, 4) + // .ZIP file comment length\n    decToHex(encodedComment.length, 2) + // .ZIP file comment\n    encodedComment; // we have all the parts (and the total length)\n    // time to create a writer !\n\n    var typeName = options.type.toLowerCase();\n\n    if (typeName === \"uint8array\" || typeName === \"arraybuffer\" || typeName === \"blob\" || typeName === \"nodebuffer\") {\n      writer = new Uint8ArrayWriter(localDirLength + centralDirLength + dirEnd.length);\n    } else {\n      writer = new StringWriter(localDirLength + centralDirLength + dirEnd.length);\n    }\n\n    for (i = 0; i < zipData.length; i++) {\n      writer.append(zipData[i].fileRecord);\n      writer.append(zipData[i].compressedObject.compressedContent);\n    }\n\n    for (i = 0; i < zipData.length; i++) {\n      writer.append(zipData[i].dirRecord);\n    }\n\n    writer.append(dirEnd);\n    var zip = writer.finalize();\n\n    switch (options.type.toLowerCase()) {\n      // case \"zip is an Uint8Array\"\n      case \"uint8array\":\n      case \"arraybuffer\":\n      case \"nodebuffer\":\n        return utils.transformTo(options.type.toLowerCase(), zip);\n\n      case \"blob\":\n        return utils.arrayBuffer2Blob(utils.transformTo(\"arraybuffer\", zip), options.mimeType);\n      // case \"zip is a string\"\n\n      case \"base64\":\n        return options.base64 ? base64.encode(zip) : zip;\n\n      default:\n        // case \"string\" :\n        return zip;\n    }\n  },\n\n  /**\n   * @deprecated\n   * This method will be removed in a future version without replacement.\n   */\n  crc32: function crc32(input, crc) {\n    return _crc(input, crc);\n  },\n\n  /**\n   * @deprecated\n   * This method will be removed in a future version without replacement.\n   */\n  utf8encode: function utf8encode(string) {\n    return utils.transformTo(\"string\", utf8.utf8encode(string));\n  },\n\n  /**\n   * @deprecated\n   * This method will be removed in a future version without replacement.\n   */\n  utf8decode: function utf8decode(input) {\n    return utf8.utf8decode(input);\n  }\n};\n/**\n * Transform this._data into a string.\n * @param {function} filter a function String -> String, applied if not null on the result.\n * @return {String} the string representing this._data.\n */\n\nfunction dataToString(asUTF8) {\n  var result = getRawData(this);\n\n  if (result === null || typeof result === \"undefined\") {\n    return \"\";\n  } // if the data is a base64 string, we decode it before checking the encoding !\n\n\n  if (this.options.base64) {\n    result = base64.decode(result);\n  }\n\n  if (asUTF8 && this.options.binary) {\n    // PizZip.prototype.utf8decode supports arrays as input\n    // skip to array => string step, utf8decode will do it.\n    result = out.utf8decode(result);\n  } else {\n    // no utf8 transformation, do the array => string step.\n    result = utils.transformTo(\"string\", result);\n  }\n\n  if (!asUTF8 && !this.options.binary) {\n    result = utils.transformTo(\"string\", out.utf8encode(result));\n  }\n\n  return result;\n}\n/**\n * A simple object representing a file in the zip file.\n * @constructor\n * @param {string} name the name of the file\n * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data\n * @param {Object} options the options of the file\n */\n\n\nfunction ZipObject(name, data, options) {\n  this.name = name;\n  this.dir = options.dir;\n  this.date = options.date;\n  this.comment = options.comment;\n  this.unixPermissions = options.unixPermissions;\n  this.dosPermissions = options.dosPermissions;\n  this._data = data;\n  this.options = options;\n  /*\n   * This object contains initial values for dir and date.\n   * With them, we can check if the user changed the deprecated metadata in\n   * `ZipObject#options` or not.\n   */\n\n  this._initialMetadata = {\n    dir: options.dir,\n    date: options.date\n  };\n}\n\nZipObject.prototype = {\n  /**\n   * Return the content as UTF8 string.\n   * @return {string} the UTF8 string.\n   */\n  asText: function asText() {\n    return dataToString.call(this, true);\n  },\n\n  /**\n   * Returns the binary content.\n   * @return {string} the content as binary.\n   */\n  asBinary: function asBinary() {\n    return dataToString.call(this, false);\n  },\n\n  /**\n   * Returns the content as a nodejs Buffer.\n   * @return {Buffer} the content as a Buffer.\n   */\n  asNodeBuffer: function asNodeBuffer() {\n    var result = getBinaryData(this);\n    return utils.transformTo(\"nodebuffer\", result);\n  },\n\n  /**\n   * Returns the content as an Uint8Array.\n   * @return {Uint8Array} the content as an Uint8Array.\n   */\n  asUint8Array: function asUint8Array() {\n    var result = getBinaryData(this);\n    return utils.transformTo(\"uint8array\", result);\n  },\n\n  /**\n   * Returns the content as an ArrayBuffer.\n   * @return {ArrayBuffer} the content as an ArrayBufer.\n   */\n  asArrayBuffer: function asArrayBuffer() {\n    return this.asUint8Array().buffer;\n  }\n};\n/**\n * Transform an integer into a string in hexadecimal.\n * @private\n * @param {number} dec the number to convert.\n * @param {number} bytes the number of bytes to generate.\n * @returns {string} the result.\n */\n\nfunction decToHex(dec, bytes) {\n  var hex = \"\",\n      i;\n\n  for (i = 0; i < bytes; i++) {\n    hex += String.fromCharCode(dec & 0xff);\n    dec >>>= 8;\n  }\n\n  return hex;\n}\n/**\n * Transforms the (incomplete) options from the user into the complete\n * set of options to create a file.\n * @private\n * @param {Object} o the options from the user.\n * @return {Object} the complete set of options.\n */\n\n\nfunction prepareFileAttrs(o) {\n  o = o || {};\n\n  if (o.base64 === true && (o.binary === null || o.binary === undefined)) {\n    o.binary = true;\n  }\n\n  o = utils.extend(o, defaults);\n  o.date = o.date || new Date();\n\n  if (o.compression !== null) {\n    o.compression = o.compression.toUpperCase();\n  }\n\n  return o;\n}\n/**\n * Add a file in the current folder.\n * @private\n * @param {string} name the name of the file\n * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file\n * @param {Object} o the options of the file\n * @return {Object} the new file.\n */\n\n\nfunction fileAdd(name, data, o) {\n  // be sure sub folders exist\n  var dataType = utils.getTypeOf(data),\n      parent;\n  o = prepareFileAttrs(o);\n\n  if (typeof o.unixPermissions === \"string\") {\n    o.unixPermissions = parseInt(o.unixPermissions, 8);\n  } // UNX_IFDIR  0040000 see zipinfo.c\n\n\n  if (o.unixPermissions && o.unixPermissions & 0x4000) {\n    o.dir = true;\n  } // Bit 4    Directory\n\n\n  if (o.dosPermissions && o.dosPermissions & 0x0010) {\n    o.dir = true;\n  }\n\n  if (o.dir) {\n    name = forceTrailingSlash(name);\n  }\n\n  if (o.createFolders && (parent = parentFolder(name))) {\n    folderAdd.call(this, parent, true);\n  }\n\n  if (o.dir || data === null || typeof data === \"undefined\") {\n    o.base64 = false;\n    o.binary = false;\n    data = null;\n    dataType = null;\n  } else if (dataType === \"string\") {\n    if (o.binary && !o.base64) {\n      // optimizedBinaryString == true means that the file has already been filtered with a 0xFF mask\n      if (o.optimizedBinaryString !== true) {\n        // this is a string, not in a base64 format.\n        // Be sure that this is a correct \"binary string\"\n        data = utils.string2binary(data);\n      }\n    }\n  } else {\n    // arraybuffer, uint8array, ...\n    o.base64 = false;\n    o.binary = true;\n\n    if (!dataType && !(data instanceof CompressedObject)) {\n      throw new Error(\"The data of '\" + name + \"' is in an unsupported format !\");\n    } // special case : it's way easier to work with Uint8Array than with ArrayBuffer\n\n\n    if (dataType === \"arraybuffer\") {\n      data = utils.transformTo(\"uint8array\", data);\n    }\n  }\n\n  var object = new ZipObject(name, data, o);\n  this.files[name] = object;\n  return object;\n}\n/**\n * Find the parent folder of the path.\n * @private\n * @param {string} path the path to use\n * @return {string} the parent folder, or \"\"\n */\n\n\nfunction parentFolder(path) {\n  if (path.slice(-1) === \"/\") {\n    path = path.substring(0, path.length - 1);\n  }\n\n  var lastSlash = path.lastIndexOf(\"/\");\n  return lastSlash > 0 ? path.substring(0, lastSlash) : \"\";\n}\n/**\n * Returns the path with a slash at the end.\n * @private\n * @param {String} path the path to check.\n * @return {String} the path with a trailing slash.\n */\n\n\nfunction forceTrailingSlash(path) {\n  // Check the name ends with a /\n  if (path.slice(-1) !== \"/\") {\n    path += \"/\"; // IE doesn't like substr(-1)\n  }\n\n  return path;\n}\n/**\n * Add a (sub) folder in the current folder.\n * @private\n * @param {string} name the folder's name\n * @param {boolean=} [createFolders] If true, automatically create sub\n *  folders. Defaults to false.\n * @return {Object} the new folder.\n */\n\n\nfunction folderAdd(name, createFolders) {\n  createFolders = typeof createFolders !== \"undefined\" ? createFolders : false;\n  name = forceTrailingSlash(name); // Does this folder already exist?\n\n  if (!this.files[name]) {\n    fileAdd.call(this, name, null, {\n      dir: true,\n      createFolders: createFolders\n    });\n  }\n\n  return this.files[name];\n}\n/**\n * Generate a PizZip.CompressedObject for a given zipOject.\n * @param {ZipObject} file the object to read.\n * @param {PizZip.compression} compression the compression to use.\n * @param {Object} compressionOptions the options to use when compressing.\n * @return {PizZip.CompressedObject} the compressed result.\n */\n\n\nfunction generateCompressedObjectFrom(file, compression, compressionOptions) {\n  var result = new CompressedObject();\n  var content; // the data has not been decompressed, we might reuse things !\n\n  if (file._data instanceof CompressedObject) {\n    result.uncompressedSize = file._data.uncompressedSize;\n    result.crc32 = file._data.crc32;\n\n    if (result.uncompressedSize === 0 || file.dir) {\n      compression = compressions.STORE;\n      result.compressedContent = \"\";\n      result.crc32 = 0;\n    } else if (file._data.compressionMethod === compression.magic) {\n      result.compressedContent = file._data.getCompressedContent();\n    } else {\n      content = file._data.getContent(); // need to decompress / recompress\n\n      result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);\n    }\n  } else {\n    // have uncompressed data\n    content = getBinaryData(file);\n\n    if (!content || content.length === 0 || file.dir) {\n      compression = compressions.STORE;\n      content = \"\";\n    }\n\n    result.uncompressedSize = content.length;\n    result.crc32 = _crc(content);\n    result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);\n  }\n\n  result.compressedSize = result.compressedContent.length;\n  result.compressionMethod = compression.magic;\n  return result;\n}\n/**\n * Generate the UNIX part of the external file attributes.\n * @param {Object} unixPermissions the unix permissions or null.\n * @param {Boolean} isDir true if the entry is a directory, false otherwise.\n * @return {Number} a 32 bit integer.\n *\n * adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :\n *\n * TTTTsstrwxrwxrwx0000000000ADVSHR\n * ^^^^____________________________ file type, see zipinfo.c (UNX_*)\n *     ^^^_________________________ setuid, setgid, sticky\n *        ^^^^^^^^^________________ permissions\n *                 ^^^^^^^^^^______ not used ?\n *                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only\n */\n\n\nfunction generateUnixExternalFileAttr(unixPermissions, isDir) {\n  var result = unixPermissions;\n\n  if (!unixPermissions) {\n    // I can't use octal values in strict mode, hence the hexa.\n    //  040775 => 0x41fd\n    // 0100664 => 0x81b4\n    result = isDir ? 0x41fd : 0x81b4;\n  }\n\n  return (result & 0xffff) << 16;\n}\n/**\n * Generate the DOS part of the external file attributes.\n * @param {Object} dosPermissions the dos permissions or null.\n * @param {Boolean} isDir true if the entry is a directory, false otherwise.\n * @return {Number} a 32 bit integer.\n *\n * Bit 0     Read-Only\n * Bit 1     Hidden\n * Bit 2     System\n * Bit 3     Volume Label\n * Bit 4     Directory\n * Bit 5     Archive\n */\n\n\nfunction generateDosExternalFileAttr(dosPermissions) {\n  // the dir flag is already set for compatibility\n  return (dosPermissions || 0) & 0x3f;\n}\n/**\n * Generate the various parts used in the construction of the final zip file.\n * @param {string} name the file name.\n * @param {ZipObject} file the file content.\n * @param {PizZip.CompressedObject} compressedObject the compressed object.\n * @param {number} offset the current offset from the start of the zip file.\n * @param {String} platform let's pretend we are this platform (change platform dependents fields)\n * @param {Function} encodeFileName the function to encode the file name / comment.\n * @return {object} the zip parts.\n */\n\n\nfunction generateZipParts(name, file, compressedObject, offset, platform, encodeFileName) {\n  var useCustomEncoding = encodeFileName !== utf8.utf8encode,\n      encodedFileName = utils.transformTo(\"string\", encodeFileName(file.name)),\n      utfEncodedFileName = utils.transformTo(\"string\", utf8.utf8encode(file.name)),\n      comment = file.comment || \"\",\n      encodedComment = utils.transformTo(\"string\", encodeFileName(comment)),\n      utfEncodedComment = utils.transformTo(\"string\", utf8.utf8encode(comment)),\n      useUTF8ForFileName = utfEncodedFileName.length !== file.name.length,\n      useUTF8ForComment = utfEncodedComment.length !== comment.length,\n      o = file.options;\n  var dosTime,\n      dosDate,\n      extraFields = \"\",\n      unicodePathExtraField = \"\",\n      unicodeCommentExtraField = \"\",\n      dir,\n      date; // handle the deprecated options.dir\n\n  if (file._initialMetadata.dir !== file.dir) {\n    dir = file.dir;\n  } else {\n    dir = o.dir;\n  } // handle the deprecated options.date\n\n\n  if (file._initialMetadata.date !== file.date) {\n    date = file.date;\n  } else {\n    date = o.date;\n  }\n\n  var extFileAttr = 0;\n  var versionMadeBy = 0;\n\n  if (dir) {\n    // dos or unix, we set the dos dir flag\n    extFileAttr |= 0x00010;\n  }\n\n  if (platform === \"UNIX\") {\n    versionMadeBy = 0x031e; // UNIX, version 3.0\n\n    extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);\n  } else {\n    // DOS or other, fallback to DOS\n    versionMadeBy = 0x0014; // DOS, version 2.0\n\n    extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);\n  } // date\n  // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html\n  // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html\n  // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html\n\n\n  dosTime = date.getHours();\n  dosTime <<= 6;\n  dosTime |= date.getMinutes();\n  dosTime <<= 5;\n  dosTime |= date.getSeconds() / 2;\n  dosDate = date.getFullYear() - 1980;\n  dosDate <<= 4;\n  dosDate |= date.getMonth() + 1;\n  dosDate <<= 5;\n  dosDate |= date.getDate();\n\n  if (useUTF8ForFileName) {\n    // set the unicode path extra field. unzip needs at least one extra\n    // field to correctly handle unicode path, so using the path is as good\n    // as any other information. This could improve the situation with\n    // other archive managers too.\n    // This field is usually used without the utf8 flag, with a non\n    // unicode path in the header (winrar, winzip). This helps (a bit)\n    // with the messy Windows' default compressed folders feature but\n    // breaks on p7zip which doesn't seek the unicode path extra field.\n    // So for now, UTF-8 everywhere !\n    unicodePathExtraField = // Version\n    decToHex(1, 1) + // NameCRC32\n    decToHex(_crc(encodedFileName), 4) + // UnicodeName\n    utfEncodedFileName;\n    extraFields += // Info-ZIP Unicode Path Extra Field\n    \"\\x75\\x70\" + // size\n    decToHex(unicodePathExtraField.length, 2) + // content\n    unicodePathExtraField;\n  }\n\n  if (useUTF8ForComment) {\n    unicodeCommentExtraField = // Version\n    decToHex(1, 1) + // CommentCRC32\n    decToHex(this.crc32(encodedComment), 4) + // UnicodeName\n    utfEncodedComment;\n    extraFields += // Info-ZIP Unicode Path Extra Field\n    \"\\x75\\x63\" + // size\n    decToHex(unicodeCommentExtraField.length, 2) + // content\n    unicodeCommentExtraField;\n  }\n\n  var header = \"\"; // version needed to extract\n\n  header += \"\\x0A\\x00\"; // general purpose bit flag\n  // set bit 11 if utf8\n\n  header += !useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment) ? \"\\x00\\x08\" : \"\\x00\\x00\"; // compression method\n\n  header += compressedObject.compressionMethod; // last mod file time\n\n  header += decToHex(dosTime, 2); // last mod file date\n\n  header += decToHex(dosDate, 2); // crc-32\n\n  header += decToHex(compressedObject.crc32, 4); // compressed size\n\n  header += decToHex(compressedObject.compressedSize, 4); // uncompressed size\n\n  header += decToHex(compressedObject.uncompressedSize, 4); // file name length\n\n  header += decToHex(encodedFileName.length, 2); // extra field length\n\n  header += decToHex(extraFields.length, 2);\n  var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;\n  var dirRecord = signature.CENTRAL_FILE_HEADER + // version made by (00: DOS)\n  decToHex(versionMadeBy, 2) + // file header (common to file and central directory)\n  header + // file comment length\n  decToHex(encodedComment.length, 2) + // disk number start\n  \"\\x00\\x00\" + // internal file attributes\n  \"\\x00\\x00\" + // external file attributes\n  decToHex(extFileAttr, 4) + // relative offset of local header\n  decToHex(offset, 4) + // file name\n  encodedFileName + // extra field\n  extraFields + // file comment\n  encodedComment;\n  return {\n    fileRecord: fileRecord,\n    dirRecord: dirRecord,\n    compressedObject: compressedObject\n  };\n}\n\nmodule.exports = out;\n\n//# sourceURL=webpack://PizZip/./es6/object.js?");

                    /***/
                }),

      /***/ "./es6/signature.js":
      /*!**************************!*\
        !*** ./es6/signature.js ***!
        \**************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nexports.LOCAL_FILE_HEADER = \"PK\\x03\\x04\";\nexports.CENTRAL_FILE_HEADER = \"PK\\x01\\x02\";\nexports.CENTRAL_DIRECTORY_END = \"PK\\x05\\x06\";\nexports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = \"PK\\x06\\x07\";\nexports.ZIP64_CENTRAL_DIRECTORY_END = \"PK\\x06\\x06\";\nexports.DATA_DESCRIPTOR = \"PK\\x07\\x08\";\n\n//# sourceURL=webpack://PizZip/./es6/signature.js?");

                    /***/
                }),

      /***/ "./es6/stringReader.js":
      /*!*****************************!*\
        !*** ./es6/stringReader.js ***!
        \*****************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar DataReader = __webpack_require__(/*! ./dataReader.js */ \"./es6/dataReader.js\");\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n\nfunction StringReader(data, optimizedBinaryString) {\n  this.data = data;\n\n  if (!optimizedBinaryString) {\n    this.data = utils.string2binary(this.data);\n  }\n\n  this.length = this.data.length;\n  this.index = 0;\n  this.zero = 0;\n}\n\nStringReader.prototype = new DataReader();\n/**\n * @see DataReader.byteAt\n */\n\nStringReader.prototype.byteAt = function (i) {\n  return this.data.charCodeAt(this.zero + i);\n};\n/**\n * @see DataReader.lastIndexOfSignature\n */\n\n\nStringReader.prototype.lastIndexOfSignature = function (sig) {\n  return this.data.lastIndexOf(sig) - this.zero;\n};\n/**\n * @see DataReader.readData\n */\n\n\nStringReader.prototype.readData = function (size) {\n  this.checkOffset(size); // this will work because the constructor applied the \"& 0xff\" mask.\n\n  var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);\n  this.index += size;\n  return result;\n};\n\nmodule.exports = StringReader;\n\n//# sourceURL=webpack://PizZip/./es6/stringReader.js?");

                    /***/
                }),

      /***/ "./es6/stringWriter.js":
      /*!*****************************!*\
        !*** ./es6/stringWriter.js ***!
        \*****************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n/**\n * An object to write any content to a string.\n * @constructor\n */\n\n\nfunction StringWriter() {\n  this.data = [];\n}\n\nStringWriter.prototype = {\n  /**\n   * Append any content to the current string.\n   * @param {Object} input the content to add.\n   */\n  append: function append(input) {\n    input = utils.transformTo(\"string\", input);\n    this.data.push(input);\n  },\n\n  /**\n   * Finalize the construction an return the result.\n   * @return {string} the generated string.\n   */\n  finalize: function finalize() {\n    return this.data.join(\"\");\n  }\n};\nmodule.exports = StringWriter;\n\n//# sourceURL=webpack://PizZip/./es6/stringWriter.js?");

                    /***/
                }),

      /***/ "./es6/support.js":
      /*!************************!*\
        !*** ./es6/support.js ***!
        \************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("/* WEBPACK VAR INJECTION */(function(Buffer) {\n\nexports.base64 = true;\nexports.array = true;\nexports.string = true;\nexports.arraybuffer = typeof ArrayBuffer !== \"undefined\" && typeof Uint8Array !== \"undefined\"; // contains true if PizZip can read/generate nodejs Buffer, false otherwise.\n// Browserify will provide a Buffer implementation for browsers, which is\n// an augmented Uint8Array (i.e., can be used as either Buffer or U8).\n\nexports.nodebuffer = typeof Buffer !== \"undefined\"; // contains true if PizZip can read/generate Uint8Array, false otherwise.\n\nexports.uint8array = typeof Uint8Array !== \"undefined\";\n\nif (typeof ArrayBuffer === \"undefined\") {\n  exports.blob = false;\n} else {\n  var buffer = new ArrayBuffer(0);\n\n  try {\n    exports.blob = new Blob([buffer], {\n      type: \"application/zip\"\n    }).size === 0;\n  } catch (e) {\n    try {\n      var Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;\n      var builder = new Builder();\n      builder.append(buffer);\n      exports.blob = builder.getBlob(\"application/zip\").size === 0;\n    } catch (e) {\n      exports.blob = false;\n    }\n  }\n}\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/buffer/index.js */ \"./node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack://PizZip/./es6/support.js?");

                    /***/
                }),

      /***/ "./es6/uint8ArrayReader.js":
      /*!*********************************!*\
        !*** ./es6/uint8ArrayReader.js ***!
        \*********************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar ArrayReader = __webpack_require__(/*! ./arrayReader.js */ \"./es6/arrayReader.js\");\n\nfunction Uint8ArrayReader(data) {\n  if (data) {\n    this.data = data;\n    this.length = this.data.length;\n    this.index = 0;\n    this.zero = 0;\n  }\n}\n\nUint8ArrayReader.prototype = new ArrayReader();\n/**\n * @see DataReader.readData\n */\n\nUint8ArrayReader.prototype.readData = function (size) {\n  this.checkOffset(size);\n\n  if (size === 0) {\n    // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].\n    return new Uint8Array(0);\n  }\n\n  var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);\n  this.index += size;\n  return result;\n};\n\nmodule.exports = Uint8ArrayReader;\n\n//# sourceURL=webpack://PizZip/./es6/uint8ArrayReader.js?");

                    /***/
                }),

      /***/ "./es6/uint8ArrayWriter.js":
      /*!*********************************!*\
        !*** ./es6/uint8ArrayWriter.js ***!
        \*********************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n/**\n * An object to write any content to an Uint8Array.\n * @constructor\n * @param {number} length The length of the array.\n */\n\n\nfunction Uint8ArrayWriter(length) {\n  this.data = new Uint8Array(length);\n  this.index = 0;\n}\n\nUint8ArrayWriter.prototype = {\n  /**\n   * Append any content to the current array.\n   * @param {Object} input the content to add.\n   */\n  append: function append(input) {\n    if (input.length !== 0) {\n      // with an empty Uint8Array, Opera fails with a \"Offset larger than array size\"\n      input = utils.transformTo(\"uint8array\", input);\n      this.data.set(input, this.index);\n      this.index += input.length;\n    }\n  },\n\n  /**\n   * Finalize the construction an return the result.\n   * @return {Uint8Array} the generated array.\n   */\n  finalize: function finalize() {\n    return this.data;\n  }\n};\nmodule.exports = Uint8ArrayWriter;\n\n//# sourceURL=webpack://PizZip/./es6/uint8ArrayWriter.js?");

                    /***/
                }),

      /***/ "./es6/utf8.js":
      /*!*********************!*\
        !*** ./es6/utf8.js ***!
        \*********************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n\nvar support = __webpack_require__(/*! ./support.js */ \"./es6/support.js\");\n\nvar nodeBuffer = __webpack_require__(/*! ./nodeBuffer.js */ \"./es6/nodeBuffer.js\");\n/**\n * The following functions come from pako, from pako/lib/utils/strings\n * released under the MIT license, see pako https://github.com/nodeca/pako/\n */\n// Table with utf8 lengths (calculated by first byte of sequence)\n// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,\n// because max possible codepoint is 0x10ffff\n\n\nvar _utf8len = new Array(256);\n\nfor (var i = 0; i < 256; i++) {\n  _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;\n}\n\n_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start\n// convert string to array (typed, when possible)\n\nfunction string2buf(str) {\n  var buf,\n      c,\n      c2,\n      mPos,\n      i,\n      bufLen = 0;\n  var strLen = str.length; // count binary size\n\n  for (mPos = 0; mPos < strLen; mPos++) {\n    c = str.charCodeAt(mPos);\n\n    if ((c & 0xfc00) === 0xd800 && mPos + 1 < strLen) {\n      c2 = str.charCodeAt(mPos + 1);\n\n      if ((c2 & 0xfc00) === 0xdc00) {\n        c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);\n        mPos++;\n      }\n    }\n\n    bufLen += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;\n  } // allocate buffer\n\n\n  if (support.uint8array) {\n    buf = new Uint8Array(bufLen);\n  } else {\n    buf = new Array(bufLen);\n  } // convert\n\n\n  for (i = 0, mPos = 0; i < bufLen; mPos++) {\n    c = str.charCodeAt(mPos);\n\n    if ((c & 0xfc00) === 0xd800 && mPos + 1 < strLen) {\n      c2 = str.charCodeAt(mPos + 1);\n\n      if ((c2 & 0xfc00) === 0xdc00) {\n        c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);\n        mPos++;\n      }\n    }\n\n    if (c < 0x80) {\n      /* one byte */\n      buf[i++] = c;\n    } else if (c < 0x800) {\n      /* two bytes */\n      buf[i++] = 0xc0 | c >>> 6;\n      buf[i++] = 0x80 | c & 0x3f;\n    } else if (c < 0x10000) {\n      /* three bytes */\n      buf[i++] = 0xe0 | c >>> 12;\n      buf[i++] = 0x80 | c >>> 6 & 0x3f;\n      buf[i++] = 0x80 | c & 0x3f;\n    } else {\n      /* four bytes */\n      buf[i++] = 0xf0 | c >>> 18;\n      buf[i++] = 0x80 | c >>> 12 & 0x3f;\n      buf[i++] = 0x80 | c >>> 6 & 0x3f;\n      buf[i++] = 0x80 | c & 0x3f;\n    }\n  }\n\n  return buf;\n} // Calculate max possible position in utf8 buffer,\n// that will not break sequence. If that's not possible\n// - (very small limits) return max size as is.\n//\n// buf[] - utf8 bytes array\n// max   - length limit (mandatory);\n\n\nfunction utf8border(buf, max) {\n  var pos;\n  max = max || buf.length;\n\n  if (max > buf.length) {\n    max = buf.length;\n  } // go back from last position, until start of sequence found\n\n\n  pos = max - 1;\n\n  while (pos >= 0 && (buf[pos] & 0xc0) === 0x80) {\n    pos--;\n  } // Fuckup - very small and broken sequence,\n  // return max, because we should return something anyway.\n\n\n  if (pos < 0) {\n    return max;\n  } // If we came to start of buffer - that means vuffer is too small,\n  // return max too.\n\n\n  if (pos === 0) {\n    return max;\n  }\n\n  return pos + _utf8len[buf[pos]] > max ? pos : max;\n} // convert array to string\n\n\nfunction buf2string(buf) {\n  var i, out, c, cLen;\n  var len = buf.length; // Reserve max possible length (2 words per char)\n  // NB: by unknown reasons, Array is significantly faster for\n  //     String.fromCharCode.apply than Uint16Array.\n\n  var utf16buf = new Array(len * 2);\n\n  for (out = 0, i = 0; i < len;) {\n    c = buf[i++]; // quick process ascii\n\n    if (c < 0x80) {\n      utf16buf[out++] = c;\n      continue;\n    }\n\n    cLen = _utf8len[c]; // skip 5 & 6 byte codes\n\n    if (cLen > 4) {\n      utf16buf[out++] = 0xfffd;\n      i += cLen - 1;\n      continue;\n    } // apply mask on first byte\n\n\n    c &= cLen === 2 ? 0x1f : cLen === 3 ? 0x0f : 0x07; // join the rest\n\n    while (cLen > 1 && i < len) {\n      c = c << 6 | buf[i++] & 0x3f;\n      cLen--;\n    } // terminated by end of string?\n\n\n    if (cLen > 1) {\n      utf16buf[out++] = 0xfffd;\n      continue;\n    }\n\n    if (c < 0x10000) {\n      utf16buf[out++] = c;\n    } else {\n      c -= 0x10000;\n      utf16buf[out++] = 0xd800 | c >> 10 & 0x3ff;\n      utf16buf[out++] = 0xdc00 | c & 0x3ff;\n    }\n  } // shrinkBuf(utf16buf, out)\n\n\n  if (utf16buf.length !== out) {\n    if (utf16buf.subarray) {\n      utf16buf = utf16buf.subarray(0, out);\n    } else {\n      utf16buf.length = out;\n    }\n  } // return String.fromCharCode.apply(null, utf16buf);\n\n\n  return utils.applyFromCharCode(utf16buf);\n} // That's all for the pako functions.\n\n/**\n * Transform a javascript string into an array (typed if possible) of bytes,\n * UTF-8 encoded.\n * @param {String} str the string to encode\n * @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.\n */\n\n\nexports.utf8encode = function utf8encode(str) {\n  if (support.nodebuffer) {\n    return nodeBuffer(str, \"utf-8\");\n  }\n\n  return string2buf(str);\n};\n/**\n * Transform a bytes array (or a representation) representing an UTF-8 encoded\n * string into a javascript string.\n * @param {Array|Uint8Array|Buffer} buf the data de decode\n * @return {String} the decoded string.\n */\n\n\nexports.utf8decode = function utf8decode(buf) {\n  if (support.nodebuffer) {\n    return utils.transformTo(\"nodebuffer\", buf).toString(\"utf-8\");\n  }\n\n  buf = utils.transformTo(support.uint8array ? \"uint8array\" : \"array\", buf); // return buf2string(buf);\n  // Chrome prefers to work with \"small\" chunks of data\n  // for the method buf2string.\n  // Firefox and Chrome has their own shortcut, IE doesn't seem to really care.\n\n  var result = [],\n      len = buf.length,\n      chunk = 65536;\n  var k = 0;\n\n  while (k < len) {\n    var nextBoundary = utf8border(buf, Math.min(k + chunk, len));\n\n    if (support.uint8array) {\n      result.push(buf2string(buf.subarray(k, nextBoundary)));\n    } else {\n      result.push(buf2string(buf.slice(k, nextBoundary)));\n    }\n\n    k = nextBoundary;\n  }\n\n  return result.join(\"\");\n};\n\n//# sourceURL=webpack://PizZip/./es6/utf8.js?");

                    /***/
                }),

      /***/ "./es6/utils.js":
      /*!**********************!*\
        !*** ./es6/utils.js ***!
        \**********************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nvar support = __webpack_require__(/*! ./support.js */ \"./es6/support.js\");\n\nvar compressions = __webpack_require__(/*! ./compressions.js */ \"./es6/compressions.js\");\n\nvar nodeBuffer = __webpack_require__(/*! ./nodeBuffer.js */ \"./es6/nodeBuffer.js\");\n/**\n * Convert a string to a \"binary string\" : a string containing only char codes between 0 and 255.\n * @param {string} str the string to transform.\n * @return {String} the binary string.\n */\n\n\nexports.string2binary = function (str) {\n  var result = \"\";\n\n  for (var i = 0; i < str.length; i++) {\n    result += String.fromCharCode(str.charCodeAt(i) & 0xff);\n  }\n\n  return result;\n};\n\nexports.arrayBuffer2Blob = function (buffer, mimeType) {\n  exports.checkSupport(\"blob\");\n  mimeType = mimeType || \"application/zip\";\n\n  try {\n    // Blob constructor\n    return new Blob([buffer], {\n      type: mimeType\n    });\n  } catch (e) {\n    try {\n      // deprecated, browser only, old way\n      var Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;\n      var builder = new Builder();\n      builder.append(buffer);\n      return builder.getBlob(mimeType);\n    } catch (e) {\n      // well, fuck ?!\n      throw new Error(\"Bug : can't construct the Blob.\");\n    }\n  }\n};\n/**\n * The identity function.\n * @param {Object} input the input.\n * @return {Object} the same input.\n */\n\n\nfunction identity(input) {\n  return input;\n}\n/**\n * Fill in an array with a string.\n * @param {String} str the string to use.\n * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).\n * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.\n */\n\n\nfunction stringToArrayLike(str, array) {\n  for (var i = 0; i < str.length; ++i) {\n    array[i] = str.charCodeAt(i) & 0xff;\n  }\n\n  return array;\n}\n/**\n * Transform an array-like object to a string.\n * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.\n * @return {String} the result.\n */\n\n\nfunction arrayLikeToString(array) {\n  // Performances notes :\n  // --------------------\n  // String.fromCharCode.apply(null, array) is the fastest, see\n  // see http://jsperf.com/converting-a-uint8array-to-a-string/2\n  // but the stack is limited (and we can get huge arrays !).\n  //\n  // result += String.fromCharCode(array[i]); generate too many strings !\n  //\n  // This code is inspired by http://jsperf.com/arraybuffer-to-string-apply-performance/2\n  var chunk = 65536;\n  var result = [],\n      len = array.length,\n      type = exports.getTypeOf(array);\n  var k = 0,\n      canUseApply = true;\n\n  try {\n    switch (type) {\n      case \"uint8array\":\n        String.fromCharCode.apply(null, new Uint8Array(0));\n        break;\n\n      case \"nodebuffer\":\n        String.fromCharCode.apply(null, nodeBuffer(0));\n        break;\n    }\n  } catch (e) {\n    canUseApply = false;\n  } // no apply : slow and painful algorithm\n  // default browser on android 4.*\n\n\n  if (!canUseApply) {\n    var resultStr = \"\";\n\n    for (var i = 0; i < array.length; i++) {\n      resultStr += String.fromCharCode(array[i]);\n    }\n\n    return resultStr;\n  }\n\n  while (k < len && chunk > 1) {\n    try {\n      if (type === \"array\" || type === \"nodebuffer\") {\n        result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));\n      } else {\n        result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));\n      }\n\n      k += chunk;\n    } catch (e) {\n      chunk = Math.floor(chunk / 2);\n    }\n  }\n\n  return result.join(\"\");\n}\n\nexports.applyFromCharCode = arrayLikeToString;\n/**\n * Copy the data from an array-like to an other array-like.\n * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.\n * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.\n * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.\n */\n\nfunction arrayLikeToArrayLike(arrayFrom, arrayTo) {\n  for (var i = 0; i < arrayFrom.length; i++) {\n    arrayTo[i] = arrayFrom[i];\n  }\n\n  return arrayTo;\n} // a matrix containing functions to transform everything into everything.\n\n\nvar transform = {}; // string to ?\n\ntransform.string = {\n  string: identity,\n  array: function array(input) {\n    return stringToArrayLike(input, new Array(input.length));\n  },\n  arraybuffer: function arraybuffer(input) {\n    return transform.string.uint8array(input).buffer;\n  },\n  uint8array: function uint8array(input) {\n    return stringToArrayLike(input, new Uint8Array(input.length));\n  },\n  nodebuffer: function nodebuffer(input) {\n    return stringToArrayLike(input, nodeBuffer(input.length));\n  }\n}; // array to ?\n\ntransform.array = {\n  string: arrayLikeToString,\n  array: identity,\n  arraybuffer: function arraybuffer(input) {\n    return new Uint8Array(input).buffer;\n  },\n  uint8array: function uint8array(input) {\n    return new Uint8Array(input);\n  },\n  nodebuffer: function nodebuffer(input) {\n    return nodeBuffer(input);\n  }\n}; // arraybuffer to ?\n\ntransform.arraybuffer = {\n  string: function string(input) {\n    return arrayLikeToString(new Uint8Array(input));\n  },\n  array: function array(input) {\n    return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));\n  },\n  arraybuffer: identity,\n  uint8array: function uint8array(input) {\n    return new Uint8Array(input);\n  },\n  nodebuffer: function nodebuffer(input) {\n    return nodeBuffer(new Uint8Array(input));\n  }\n}; // uint8array to ?\n\ntransform.uint8array = {\n  string: arrayLikeToString,\n  array: function array(input) {\n    return arrayLikeToArrayLike(input, new Array(input.length));\n  },\n  arraybuffer: function arraybuffer(input) {\n    return input.buffer;\n  },\n  uint8array: identity,\n  nodebuffer: function nodebuffer(input) {\n    return nodeBuffer(input);\n  }\n}; // nodebuffer to ?\n\ntransform.nodebuffer = {\n  string: arrayLikeToString,\n  array: function array(input) {\n    return arrayLikeToArrayLike(input, new Array(input.length));\n  },\n  arraybuffer: function arraybuffer(input) {\n    return transform.nodebuffer.uint8array(input).buffer;\n  },\n  uint8array: function uint8array(input) {\n    return arrayLikeToArrayLike(input, new Uint8Array(input.length));\n  },\n  nodebuffer: identity\n};\n/**\n * Transform an input into any type.\n * The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.\n * If no output type is specified, the unmodified input will be returned.\n * @param {String} outputType the output type.\n * @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.\n * @throws {Error} an Error if the browser doesn't support the requested output type.\n */\n\nexports.transformTo = function (outputType, input) {\n  if (!input) {\n    // undefined, null, etc\n    // an empty string won't harm.\n    input = \"\";\n  }\n\n  if (!outputType) {\n    return input;\n  }\n\n  exports.checkSupport(outputType);\n  var inputType = exports.getTypeOf(input);\n  var result = transform[inputType][outputType](input);\n  return result;\n};\n/**\n * Return the type of the input.\n * The type will be in a format valid for PizZip.utils.transformTo : string, array, uint8array, arraybuffer.\n * @param {Object} input the input to identify.\n * @return {String} the (lowercase) type of the input.\n */\n\n\nexports.getTypeOf = function (input) {\n  if (input == null) {\n    return;\n  }\n\n  if (typeof input === \"string\") {\n    return \"string\";\n  }\n\n  if (Object.prototype.toString.call(input) === \"[object Array]\") {\n    return \"array\";\n  }\n\n  if (support.nodebuffer && nodeBuffer.test(input)) {\n    return \"nodebuffer\";\n  }\n\n  if (support.uint8array && input instanceof Uint8Array) {\n    return \"uint8array\";\n  }\n\n  if (support.arraybuffer && input instanceof ArrayBuffer) {\n    return \"arraybuffer\";\n  }\n\n  if (input instanceof Promise) {\n    throw new Error(\"Cannot read data from a promise, you probably are running new PizZip(data) with a promise\");\n  }\n\n  if (input instanceof Date) {\n    throw new Error(\"Cannot read data from a Date, you probably are running new PizZip(data) with a date\");\n  }\n\n  if (_typeof(input) === \"object\" && input.crc32 == null) {\n    throw new Error(\"Unsupported data given to new PizZip(data) (object given)\");\n  }\n};\n/**\n * Throw an exception if the type is not supported.\n * @param {String} type the type to check.\n * @throws {Error} an Error if the browser doesn't support the requested type.\n */\n\n\nexports.checkSupport = function (type) {\n  var supported = support[type.toLowerCase()];\n\n  if (!supported) {\n    throw new Error(type + \" is not supported by this browser\");\n  }\n};\n\nexports.MAX_VALUE_16BITS = 65535;\nexports.MAX_VALUE_32BITS = -1; // well, \"\\xFF\\xFF\\xFF\\xFF\\xFF\\xFF\\xFF\\xFF\" is parsed as -1\n\n/**\n * Prettify a string read as binary.\n * @param {string} str the string to prettify.\n * @return {string} a pretty string.\n */\n\nexports.pretty = function (str) {\n  var res = \"\",\n      code,\n      i;\n\n  for (i = 0; i < (str || \"\").length; i++) {\n    code = str.charCodeAt(i);\n    res += \"\\\\x\" + (code < 16 ? \"0\" : \"\") + code.toString(16).toUpperCase();\n  }\n\n  return res;\n};\n/**\n * Find a compression registered in PizZip.\n * @param {string} compressionMethod the method magic to find.\n * @return {Object|null} the PizZip compression object, null if none found.\n */\n\n\nexports.findCompression = function (compressionMethod) {\n  for (var method in compressions) {\n    if (!compressions.hasOwnProperty(method)) {\n      continue;\n    }\n\n    if (compressions[method].magic === compressionMethod) {\n      return compressions[method];\n    }\n  }\n\n  return null;\n};\n/**\n * Cross-window, cross-Node-context regular expression detection\n * @param  {Object}  object Anything\n * @return {Boolean}        true if the object is a regular expression,\n * false otherwise\n */\n\n\nexports.isRegExp = function (object) {\n  return Object.prototype.toString.call(object) === \"[object RegExp]\";\n};\n/**\n * Merge the objects passed as parameters into a new one.\n * @private\n * @param {...Object} var_args All objects to merge.\n * @return {Object} a new object with the data of the others.\n */\n\n\nexports.extend = function () {\n  var result = {};\n  var i, attr;\n\n  for (i = 0; i < arguments.length; i++) {\n    // arguments is not enumerable in some browsers\n    for (attr in arguments[i]) {\n      if (arguments[i].hasOwnProperty(attr) && typeof result[attr] === \"undefined\") {\n        result[attr] = arguments[i][attr];\n      }\n    }\n  }\n\n  return result;\n};\n\n//# sourceURL=webpack://PizZip/./es6/utils.js?");

                    /***/
                }),

      /***/ "./es6/zipEntries.js":
      /*!***************************!*\
        !*** ./es6/zipEntries.js ***!
        \***************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar StringReader = __webpack_require__(/*! ./stringReader.js */ \"./es6/stringReader.js\");\n\nvar NodeBufferReader = __webpack_require__(/*! ./nodeBufferReader.js */ \"./es6/nodeBufferReader.js\");\n\nvar Uint8ArrayReader = __webpack_require__(/*! ./uint8ArrayReader.js */ \"./es6/uint8ArrayReader.js\");\n\nvar ArrayReader = __webpack_require__(/*! ./arrayReader.js */ \"./es6/arrayReader.js\");\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n\nvar sig = __webpack_require__(/*! ./signature.js */ \"./es6/signature.js\");\n\nvar ZipEntry = __webpack_require__(/*! ./zipEntry.js */ \"./es6/zipEntry.js\");\n\nvar support = __webpack_require__(/*! ./support.js */ \"./es6/support.js\"); //  class ZipEntries {{{\n\n/**\n * All the entries in the zip file.\n * @constructor\n * @param {String|ArrayBuffer|Uint8Array} data the binary stream to load.\n * @param {Object} loadOptions Options for loading the stream.\n */\n\n\nfunction ZipEntries(data, loadOptions) {\n  this.files = [];\n  this.loadOptions = loadOptions;\n\n  if (data) {\n    this.load(data);\n  }\n}\n\nZipEntries.prototype = {\n  /**\n   * Check that the reader is on the speficied signature.\n   * @param {string} expectedSignature the expected signature.\n   * @throws {Error} if it is an other signature.\n   */\n  checkSignature: function checkSignature(expectedSignature) {\n    var signature = this.reader.readString(4);\n\n    if (signature !== expectedSignature) {\n      throw new Error(\"Corrupted zip or bug : unexpected signature \" + \"(\" + utils.pretty(signature) + \", expected \" + utils.pretty(expectedSignature) + \")\");\n    }\n  },\n\n  /**\n   * Check if the given signature is at the given index.\n   * @param {number} askedIndex the index to check.\n   * @param {string} expectedSignature the signature to expect.\n   * @return {boolean} true if the signature is here, false otherwise.\n   */\n  isSignature: function isSignature(askedIndex, expectedSignature) {\n    var currentIndex = this.reader.index;\n    this.reader.setIndex(askedIndex);\n    var signature = this.reader.readString(4);\n    var result = signature === expectedSignature;\n    this.reader.setIndex(currentIndex);\n    return result;\n  },\n\n  /**\n   * Read the end of the central directory.\n   */\n  readBlockEndOfCentral: function readBlockEndOfCentral() {\n    this.diskNumber = this.reader.readInt(2);\n    this.diskWithCentralDirStart = this.reader.readInt(2);\n    this.centralDirRecordsOnThisDisk = this.reader.readInt(2);\n    this.centralDirRecords = this.reader.readInt(2);\n    this.centralDirSize = this.reader.readInt(4);\n    this.centralDirOffset = this.reader.readInt(4);\n    this.zipCommentLength = this.reader.readInt(2); // warning : the encoding depends of the system locale\n    // On a linux machine with LANG=en_US.utf8, this field is utf8 encoded.\n    // On a windows machine, this field is encoded with the localized windows code page.\n\n    var zipComment = this.reader.readData(this.zipCommentLength);\n    var decodeParamType = support.uint8array ? \"uint8array\" : \"array\"; // To get consistent behavior with the generation part, we will assume that\n    // this is utf8 encoded unless specified otherwise.\n\n    var decodeContent = utils.transformTo(decodeParamType, zipComment);\n    this.zipComment = this.loadOptions.decodeFileName(decodeContent);\n  },\n\n  /**\n   * Read the end of the Zip 64 central directory.\n   * Not merged with the method readEndOfCentral :\n   * The end of central can coexist with its Zip64 brother,\n   * I don't want to read the wrong number of bytes !\n   */\n  readBlockZip64EndOfCentral: function readBlockZip64EndOfCentral() {\n    this.zip64EndOfCentralSize = this.reader.readInt(8);\n    this.versionMadeBy = this.reader.readString(2);\n    this.versionNeeded = this.reader.readInt(2);\n    this.diskNumber = this.reader.readInt(4);\n    this.diskWithCentralDirStart = this.reader.readInt(4);\n    this.centralDirRecordsOnThisDisk = this.reader.readInt(8);\n    this.centralDirRecords = this.reader.readInt(8);\n    this.centralDirSize = this.reader.readInt(8);\n    this.centralDirOffset = this.reader.readInt(8);\n    this.zip64ExtensibleData = {};\n    var extraDataSize = this.zip64EndOfCentralSize - 44;\n    var index = 0;\n    var extraFieldId, extraFieldLength, extraFieldValue;\n\n    while (index < extraDataSize) {\n      extraFieldId = this.reader.readInt(2);\n      extraFieldLength = this.reader.readInt(4);\n      extraFieldValue = this.reader.readString(extraFieldLength);\n      this.zip64ExtensibleData[extraFieldId] = {\n        id: extraFieldId,\n        length: extraFieldLength,\n        value: extraFieldValue\n      };\n    }\n  },\n\n  /**\n   * Read the end of the Zip 64 central directory locator.\n   */\n  readBlockZip64EndOfCentralLocator: function readBlockZip64EndOfCentralLocator() {\n    this.diskWithZip64CentralDirStart = this.reader.readInt(4);\n    this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);\n    this.disksCount = this.reader.readInt(4);\n\n    if (this.disksCount > 1) {\n      throw new Error(\"Multi-volumes zip are not supported\");\n    }\n  },\n\n  /**\n   * Read the local files, based on the offset read in the central part.\n   */\n  readLocalFiles: function readLocalFiles() {\n    var i, file;\n\n    for (i = 0; i < this.files.length; i++) {\n      file = this.files[i];\n      this.reader.setIndex(file.localHeaderOffset);\n      this.checkSignature(sig.LOCAL_FILE_HEADER);\n      file.readLocalPart(this.reader);\n      file.handleUTF8();\n      file.processAttributes();\n    }\n  },\n\n  /**\n   * Read the central directory.\n   */\n  readCentralDir: function readCentralDir() {\n    var file;\n    this.reader.setIndex(this.centralDirOffset);\n\n    while (this.reader.readString(4) === sig.CENTRAL_FILE_HEADER) {\n      file = new ZipEntry({\n        zip64: this.zip64\n      }, this.loadOptions);\n      file.readCentralPart(this.reader);\n      this.files.push(file);\n    }\n\n    if (this.centralDirRecords !== this.files.length) {\n      if (this.centralDirRecords !== 0 && this.files.length === 0) {\n        // We expected some records but couldn't find ANY.\n        // This is really suspicious, as if something went wrong.\n        throw new Error(\"Corrupted zip or bug: expected \" + this.centralDirRecords + \" records in central dir, got \" + this.files.length);\n      } else {// We found some records but not all.\n        // Something is wrong but we got something for the user: no error here.\n        // console.warn(\"expected\", this.centralDirRecords, \"records in central dir, got\", this.files.length);\n      }\n    }\n  },\n\n  /**\n   * Read the end of central directory.\n   */\n  readEndOfCentral: function readEndOfCentral() {\n    var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);\n\n    if (offset < 0) {\n      // Check if the content is a truncated zip or complete garbage.\n      // A \"LOCAL_FILE_HEADER\" is not required at the beginning (auto\n      // extractible zip for example) but it can give a good hint.\n      // If an ajax request was used without responseType, we will also\n      // get unreadable data.\n      var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);\n\n      if (isGarbage) {\n        throw new Error(\"Can't find end of central directory : is this a zip file ?\");\n      } else {\n        throw new Error(\"Corrupted zip : can't find end of central directory\");\n      }\n    }\n\n    this.reader.setIndex(offset);\n    var endOfCentralDirOffset = offset;\n    this.checkSignature(sig.CENTRAL_DIRECTORY_END);\n    this.readBlockEndOfCentral();\n    /* extract from the zip spec :\n              4)  If one of the fields in the end of central directory\n                  record is too small to hold required data, the field\n                  should be set to -1 (0xFFFF or 0xFFFFFFFF) and the\n                  ZIP64 format record should be created.\n              5)  The end of central directory record and the\n                  Zip64 end of central directory locator record must\n                  reside on the same disk when splitting or spanning\n                  an archive.\n           */\n\n    if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {\n      this.zip64 = true;\n      /*\n               Warning : the zip64 extension is supported, but ONLY if the 64bits integer read from\n               the zip file can fit into a 32bits integer. This cannot be solved : Javascript represents\n               all numbers as 64-bit double precision IEEE 754 floating point numbers.\n               So, we have 53bits for integers and bitwise operations treat everything as 32bits.\n               see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators\n               and http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf section 8.5\n               */\n      // should look for a zip64 EOCD locator\n\n      offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);\n\n      if (offset < 0) {\n        throw new Error(\"Corrupted zip : can't find the ZIP64 end of central directory locator\");\n      }\n\n      this.reader.setIndex(offset);\n      this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);\n      this.readBlockZip64EndOfCentralLocator(); // now the zip64 EOCD record\n\n      if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {\n        // console.warn(\"ZIP64 end of central directory not where expected.\");\n        this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);\n\n        if (this.relativeOffsetEndOfZip64CentralDir < 0) {\n          throw new Error(\"Corrupted zip : can't find the ZIP64 end of central directory\");\n        }\n      }\n\n      this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);\n      this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);\n      this.readBlockZip64EndOfCentral();\n    }\n\n    var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;\n\n    if (this.zip64) {\n      expectedEndOfCentralDirOffset += 20; // end of central dir 64 locator\n\n      expectedEndOfCentralDirOffset += 12\n      /* should not include the leading 12 bytes */\n      + this.zip64EndOfCentralSize;\n    }\n\n    var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;\n\n    if (extraBytes > 0) {\n      // console.warn(extraBytes, \"extra bytes at beginning or within zipfile\");\n      if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {// The offsets seem wrong, but we have something at the specified offset.\n        // So… we keep it.\n      } else {\n        // the offset is wrong, update the \"zero\" of the reader\n        // this happens if data has been prepended (crx files for example)\n        this.reader.zero = extraBytes;\n      }\n    } else if (extraBytes < 0) {\n      throw new Error(\"Corrupted zip: missing \" + Math.abs(extraBytes) + \" bytes.\");\n    }\n  },\n  prepareReader: function prepareReader(data) {\n    var type = utils.getTypeOf(data);\n    utils.checkSupport(type);\n\n    if (type === \"string\" && !support.uint8array) {\n      this.reader = new StringReader(data, this.loadOptions.optimizedBinaryString);\n    } else if (type === \"nodebuffer\") {\n      this.reader = new NodeBufferReader(data);\n    } else if (support.uint8array) {\n      this.reader = new Uint8ArrayReader(utils.transformTo(\"uint8array\", data));\n    } else if (support.array) {\n      this.reader = new ArrayReader(utils.transformTo(\"array\", data));\n    } else {\n      throw new Error(\"Unexpected error: unsupported type '\" + type + \"'\");\n    }\n  },\n\n  /**\n   * Read a zip file and create ZipEntries.\n   * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.\n   */\n  load: function load(data) {\n    this.prepareReader(data);\n    this.readEndOfCentral();\n    this.readCentralDir();\n    this.readLocalFiles();\n  }\n}; // }}} end of ZipEntries\n\nmodule.exports = ZipEntries;\n\n//# sourceURL=webpack://PizZip/./es6/zipEntries.js?");

                    /***/
                }),

      /***/ "./es6/zipEntry.js":
      /*!*************************!*\
        !*** ./es6/zipEntry.js ***!
        \*************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nvar StringReader = __webpack_require__(/*! ./stringReader.js */ \"./es6/stringReader.js\");\n\nvar utils = __webpack_require__(/*! ./utils.js */ \"./es6/utils.js\");\n\nvar CompressedObject = __webpack_require__(/*! ./compressedObject.js */ \"./es6/compressedObject.js\");\n\nvar pizzipProto = __webpack_require__(/*! ./object.js */ \"./es6/object.js\");\n\nvar support = __webpack_require__(/*! ./support.js */ \"./es6/support.js\");\n\nvar MADE_BY_DOS = 0x00;\nvar MADE_BY_UNIX = 0x03; // class ZipEntry {{{\n\n/**\n * An entry in the zip file.\n * @constructor\n * @param {Object} options Options of the current file.\n * @param {Object} loadOptions Options for loading the stream.\n */\n\nfunction ZipEntry(options, loadOptions) {\n  this.options = options;\n  this.loadOptions = loadOptions;\n}\n\nZipEntry.prototype = {\n  /**\n   * say if the file is encrypted.\n   * @return {boolean} true if the file is encrypted, false otherwise.\n   */\n  isEncrypted: function isEncrypted() {\n    // bit 1 is set\n    return (this.bitFlag & 0x0001) === 0x0001;\n  },\n\n  /**\n   * say if the file has utf-8 filename/comment.\n   * @return {boolean} true if the filename/comment is in utf-8, false otherwise.\n   */\n  useUTF8: function useUTF8() {\n    // bit 11 is set\n    return (this.bitFlag & 0x0800) === 0x0800;\n  },\n\n  /**\n   * Prepare the function used to generate the compressed content from this ZipFile.\n   * @param {DataReader} reader the reader to use.\n   * @param {number} from the offset from where we should read the data.\n   * @param {number} length the length of the data to read.\n   * @return {Function} the callback to get the compressed content (the type depends of the DataReader class).\n   */\n  prepareCompressedContent: function prepareCompressedContent(reader, from, length) {\n    return function () {\n      var previousIndex = reader.index;\n      reader.setIndex(from);\n      var compressedFileData = reader.readData(length);\n      reader.setIndex(previousIndex);\n      return compressedFileData;\n    };\n  },\n\n  /**\n   * Prepare the function used to generate the uncompressed content from this ZipFile.\n   * @param {DataReader} reader the reader to use.\n   * @param {number} from the offset from where we should read the data.\n   * @param {number} length the length of the data to read.\n   * @param {PizZip.compression} compression the compression used on this file.\n   * @param {number} uncompressedSize the uncompressed size to expect.\n   * @return {Function} the callback to get the uncompressed content (the type depends of the DataReader class).\n   */\n  prepareContent: function prepareContent(reader, from, length, compression, uncompressedSize) {\n    return function () {\n      var compressedFileData = utils.transformTo(compression.uncompressInputType, this.getCompressedContent());\n      var uncompressedFileData = compression.uncompress(compressedFileData);\n\n      if (uncompressedFileData.length !== uncompressedSize) {\n        throw new Error(\"Bug : uncompressed data size mismatch\");\n      }\n\n      return uncompressedFileData;\n    };\n  },\n\n  /**\n   * Read the local part of a zip file and add the info in this object.\n   * @param {DataReader} reader the reader to use.\n   */\n  readLocalPart: function readLocalPart(reader) {\n    // we already know everything from the central dir !\n    // If the central dir data are false, we are doomed.\n    // On the bright side, the local part is scary  : zip64, data descriptors, both, etc.\n    // The less data we get here, the more reliable this should be.\n    // Let's skip the whole header and dash to the data !\n    reader.skip(22); // in some zip created on windows, the filename stored in the central dir contains \\ instead of /.\n    // Strangely, the filename here is OK.\n    // I would love to treat these zip files as corrupted (see http://www.info-zip.org/FAQ.html#backslashes\n    // or APPNOTE#4.4.17.1, \"All slashes MUST be forward slashes '/'\") but there are a lot of bad zip generators...\n    // Search \"unzip mismatching \"local\" filename continuing with \"central\" filename version\" on\n    // the internet.\n    //\n    // I think I see the logic here : the central directory is used to display\n    // content and the local directory is used to extract the files. Mixing / and \\\n    // may be used to display \\ to windows users and use / when extracting the files.\n    // Unfortunately, this lead also to some issues : http://seclists.org/fulldisclosure/2009/Sep/394\n\n    this.fileNameLength = reader.readInt(2);\n    var localExtraFieldsLength = reader.readInt(2); // can't be sure this will be the same as the central dir\n\n    this.fileName = reader.readData(this.fileNameLength);\n    reader.skip(localExtraFieldsLength);\n\n    if (this.compressedSize === -1 || this.uncompressedSize === -1) {\n      throw new Error(\"Bug or corrupted zip : didn't get enough informations from the central directory \" + \"(compressedSize == -1 || uncompressedSize == -1)\");\n    }\n\n    var compression = utils.findCompression(this.compressionMethod);\n\n    if (compression === null) {\n      // no compression found\n      throw new Error(\"Corrupted zip : compression \" + utils.pretty(this.compressionMethod) + \" unknown (inner file : \" + utils.transformTo(\"string\", this.fileName) + \")\");\n    }\n\n    this.decompressed = new CompressedObject();\n    this.decompressed.compressedSize = this.compressedSize;\n    this.decompressed.uncompressedSize = this.uncompressedSize;\n    this.decompressed.crc32 = this.crc32;\n    this.decompressed.compressionMethod = this.compressionMethod;\n    this.decompressed.getCompressedContent = this.prepareCompressedContent(reader, reader.index, this.compressedSize, compression);\n    this.decompressed.getContent = this.prepareContent(reader, reader.index, this.compressedSize, compression, this.uncompressedSize); // we need to compute the crc32...\n\n    if (this.loadOptions.checkCRC32) {\n      this.decompressed = utils.transformTo(\"string\", this.decompressed.getContent());\n\n      if (pizzipProto.crc32(this.decompressed) !== this.crc32) {\n        throw new Error(\"Corrupted zip : CRC32 mismatch\");\n      }\n    }\n  },\n\n  /**\n   * Read the central part of a zip file and add the info in this object.\n   * @param {DataReader} reader the reader to use.\n   */\n  readCentralPart: function readCentralPart(reader) {\n    this.versionMadeBy = reader.readInt(2);\n    this.versionNeeded = reader.readInt(2);\n    this.bitFlag = reader.readInt(2);\n    this.compressionMethod = reader.readString(2);\n    this.date = reader.readDate();\n    this.crc32 = reader.readInt(4);\n    this.compressedSize = reader.readInt(4);\n    this.uncompressedSize = reader.readInt(4);\n    this.fileNameLength = reader.readInt(2);\n    this.extraFieldsLength = reader.readInt(2);\n    this.fileCommentLength = reader.readInt(2);\n    this.diskNumberStart = reader.readInt(2);\n    this.internalFileAttributes = reader.readInt(2);\n    this.externalFileAttributes = reader.readInt(4);\n    this.localHeaderOffset = reader.readInt(4);\n\n    if (this.isEncrypted()) {\n      throw new Error(\"Encrypted zip are not supported\");\n    }\n\n    this.fileName = reader.readData(this.fileNameLength);\n    this.readExtraFields(reader);\n    this.parseZIP64ExtraField(reader);\n    this.fileComment = reader.readData(this.fileCommentLength);\n  },\n\n  /**\n   * Parse the external file attributes and get the unix/dos permissions.\n   */\n  processAttributes: function processAttributes() {\n    this.unixPermissions = null;\n    this.dosPermissions = null;\n    var madeBy = this.versionMadeBy >> 8; // Check if we have the DOS directory flag set.\n    // We look for it in the DOS and UNIX permissions\n    // but some unknown platform could set it as a compatibility flag.\n\n    this.dir = !!(this.externalFileAttributes & 0x0010);\n\n    if (madeBy === MADE_BY_DOS) {\n      // first 6 bits (0 to 5)\n      this.dosPermissions = this.externalFileAttributes & 0x3f;\n    }\n\n    if (madeBy === MADE_BY_UNIX) {\n      this.unixPermissions = this.externalFileAttributes >> 16 & 0xffff; // the octal permissions are in (this.unixPermissions & 0x01FF).toString(8);\n    } // fail safe : if the name ends with a / it probably means a folder\n\n\n    if (!this.dir && this.fileNameStr.slice(-1) === \"/\") {\n      this.dir = true;\n    }\n  },\n\n  /**\n   * Parse the ZIP64 extra field and merge the info in the current ZipEntry.\n   */\n  parseZIP64ExtraField: function parseZIP64ExtraField() {\n    if (!this.extraFields[0x0001]) {\n      return;\n    } // should be something, preparing the extra reader\n\n\n    var extraReader = new StringReader(this.extraFields[0x0001].value); // I really hope that these 64bits integer can fit in 32 bits integer, because js\n    // won't let us have more.\n\n    if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {\n      this.uncompressedSize = extraReader.readInt(8);\n    }\n\n    if (this.compressedSize === utils.MAX_VALUE_32BITS) {\n      this.compressedSize = extraReader.readInt(8);\n    }\n\n    if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {\n      this.localHeaderOffset = extraReader.readInt(8);\n    }\n\n    if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {\n      this.diskNumberStart = extraReader.readInt(4);\n    }\n  },\n\n  /**\n   * Read the central part of a zip file and add the info in this object.\n   * @param {DataReader} reader the reader to use.\n   */\n  readExtraFields: function readExtraFields(reader) {\n    var start = reader.index;\n    var extraFieldId, extraFieldLength, extraFieldValue;\n    this.extraFields = this.extraFields || {};\n\n    while (reader.index < start + this.extraFieldsLength) {\n      extraFieldId = reader.readInt(2);\n      extraFieldLength = reader.readInt(2);\n      extraFieldValue = reader.readString(extraFieldLength);\n      this.extraFields[extraFieldId] = {\n        id: extraFieldId,\n        length: extraFieldLength,\n        value: extraFieldValue\n      };\n    }\n  },\n\n  /**\n   * Apply an UTF8 transformation if needed.\n   */\n  handleUTF8: function handleUTF8() {\n    var decodeParamType = support.uint8array ? \"uint8array\" : \"array\";\n\n    if (this.useUTF8()) {\n      this.fileNameStr = pizzipProto.utf8decode(this.fileName);\n      this.fileCommentStr = pizzipProto.utf8decode(this.fileComment);\n    } else {\n      var upath = this.findExtraFieldUnicodePath();\n\n      if (upath !== null) {\n        this.fileNameStr = upath;\n      } else {\n        var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);\n        this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);\n      }\n\n      var ucomment = this.findExtraFieldUnicodeComment();\n\n      if (ucomment !== null) {\n        this.fileCommentStr = ucomment;\n      } else {\n        var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);\n        this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);\n      }\n    }\n  },\n\n  /**\n   * Find the unicode path declared in the extra field, if any.\n   * @return {String} the unicode path, null otherwise.\n   */\n  findExtraFieldUnicodePath: function findExtraFieldUnicodePath() {\n    var upathField = this.extraFields[0x7075];\n\n    if (upathField) {\n      var extraReader = new StringReader(upathField.value); // wrong version\n\n      if (extraReader.readInt(1) !== 1) {\n        return null;\n      } // the crc of the filename changed, this field is out of date.\n\n\n      if (pizzipProto.crc32(this.fileName) !== extraReader.readInt(4)) {\n        return null;\n      }\n\n      return pizzipProto.utf8decode(extraReader.readString(upathField.length - 5));\n    }\n\n    return null;\n  },\n\n  /**\n   * Find the unicode comment declared in the extra field, if any.\n   * @return {String} the unicode comment, null otherwise.\n   */\n  findExtraFieldUnicodeComment: function findExtraFieldUnicodeComment() {\n    var ucommentField = this.extraFields[0x6375];\n\n    if (ucommentField) {\n      var extraReader = new StringReader(ucommentField.value); // wrong version\n\n      if (extraReader.readInt(1) !== 1) {\n        return null;\n      } // the crc of the comment changed, this field is out of date.\n\n\n      if (pizzipProto.crc32(this.fileComment) !== extraReader.readInt(4)) {\n        return null;\n      }\n\n      return pizzipProto.utf8decode(extraReader.readString(ucommentField.length - 5));\n    }\n\n    return null;\n  }\n};\nmodule.exports = ZipEntry;\n\n//# sourceURL=webpack://PizZip/./es6/zipEntry.js?");

                    /***/
                }),

      /***/ "./node_modules/base64-js/index.js":
      /*!*****************************************!*\
        !*** ./node_modules/base64-js/index.js ***!
        \*****************************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("\n\nexports.byteLength = byteLength\nexports.toByteArray = toByteArray\nexports.fromByteArray = fromByteArray\n\nvar lookup = []\nvar revLookup = []\nvar Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array\n\nvar code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'\nfor (var i = 0, len = code.length; i < len; ++i) {\n  lookup[i] = code[i]\n  revLookup[code.charCodeAt(i)] = i\n}\n\n// Support decoding URL-safe base64 strings, as Node.js does.\n// See: https://en.wikipedia.org/wiki/Base64#URL_applications\nrevLookup['-'.charCodeAt(0)] = 62\nrevLookup['_'.charCodeAt(0)] = 63\n\nfunction getLens (b64) {\n  var len = b64.length\n\n  if (len % 4 > 0) {\n    throw new Error('Invalid string. Length must be a multiple of 4')\n  }\n\n  // Trim off extra bytes after placeholder bytes are found\n  // See: https://github.com/beatgammit/base64-js/issues/42\n  var validLen = b64.indexOf('=')\n  if (validLen === -1) validLen = len\n\n  var placeHoldersLen = validLen === len\n    ? 0\n    : 4 - (validLen % 4)\n\n  return [validLen, placeHoldersLen]\n}\n\n// base64 is 4/3 + up to two characters of the original data\nfunction byteLength (b64) {\n  var lens = getLens(b64)\n  var validLen = lens[0]\n  var placeHoldersLen = lens[1]\n  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen\n}\n\nfunction _byteLength (b64, validLen, placeHoldersLen) {\n  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen\n}\n\nfunction toByteArray (b64) {\n  var tmp\n  var lens = getLens(b64)\n  var validLen = lens[0]\n  var placeHoldersLen = lens[1]\n\n  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))\n\n  var curByte = 0\n\n  // if there are placeholders, only get up to the last complete 4 chars\n  var len = placeHoldersLen > 0\n    ? validLen - 4\n    : validLen\n\n  var i\n  for (i = 0; i < len; i += 4) {\n    tmp =\n      (revLookup[b64.charCodeAt(i)] << 18) |\n      (revLookup[b64.charCodeAt(i + 1)] << 12) |\n      (revLookup[b64.charCodeAt(i + 2)] << 6) |\n      revLookup[b64.charCodeAt(i + 3)]\n    arr[curByte++] = (tmp >> 16) & 0xFF\n    arr[curByte++] = (tmp >> 8) & 0xFF\n    arr[curByte++] = tmp & 0xFF\n  }\n\n  if (placeHoldersLen === 2) {\n    tmp =\n      (revLookup[b64.charCodeAt(i)] << 2) |\n      (revLookup[b64.charCodeAt(i + 1)] >> 4)\n    arr[curByte++] = tmp & 0xFF\n  }\n\n  if (placeHoldersLen === 1) {\n    tmp =\n      (revLookup[b64.charCodeAt(i)] << 10) |\n      (revLookup[b64.charCodeAt(i + 1)] << 4) |\n      (revLookup[b64.charCodeAt(i + 2)] >> 2)\n    arr[curByte++] = (tmp >> 8) & 0xFF\n    arr[curByte++] = tmp & 0xFF\n  }\n\n  return arr\n}\n\nfunction tripletToBase64 (num) {\n  return lookup[num >> 18 & 0x3F] +\n    lookup[num >> 12 & 0x3F] +\n    lookup[num >> 6 & 0x3F] +\n    lookup[num & 0x3F]\n}\n\nfunction encodeChunk (uint8, start, end) {\n  var tmp\n  var output = []\n  for (var i = start; i < end; i += 3) {\n    tmp =\n      ((uint8[i] << 16) & 0xFF0000) +\n      ((uint8[i + 1] << 8) & 0xFF00) +\n      (uint8[i + 2] & 0xFF)\n    output.push(tripletToBase64(tmp))\n  }\n  return output.join('')\n}\n\nfunction fromByteArray (uint8) {\n  var tmp\n  var len = uint8.length\n  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes\n  var parts = []\n  var maxChunkLength = 16383 // must be multiple of 3\n\n  // go through the array every three bytes, we'll deal with trailing stuff later\n  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {\n    parts.push(encodeChunk(\n      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)\n    ))\n  }\n\n  // pad the end with zeros, but make sure to not forget the extra bytes\n  if (extraBytes === 1) {\n    tmp = uint8[len - 1]\n    parts.push(\n      lookup[tmp >> 2] +\n      lookup[(tmp << 4) & 0x3F] +\n      '=='\n    )\n  } else if (extraBytes === 2) {\n    tmp = (uint8[len - 2] << 8) + uint8[len - 1]\n    parts.push(\n      lookup[tmp >> 10] +\n      lookup[(tmp >> 4) & 0x3F] +\n      lookup[(tmp << 2) & 0x3F] +\n      '='\n    )\n  }\n\n  return parts.join('')\n}\n\n\n//# sourceURL=webpack://PizZip/./node_modules/base64-js/index.js?");

                    /***/
                }),

      /***/ "./node_modules/buffer/index.js":
      /*!**************************************!*\
        !*** ./node_modules/buffer/index.js ***!
        \**************************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    "use strict";
                    eval("/* WEBPACK VAR INJECTION */(function(global) {/*!\n * The buffer module from node.js, for the browser.\n *\n * @author   Feross Aboukhadijeh <http://feross.org>\n * @license  MIT\n */\n/* eslint-disable no-proto */\n\n\n\nvar base64 = __webpack_require__(/*! base64-js */ \"./node_modules/base64-js/index.js\")\nvar ieee754 = __webpack_require__(/*! ieee754 */ \"./node_modules/ieee754/index.js\")\nvar isArray = __webpack_require__(/*! isarray */ \"./node_modules/isarray/index.js\")\n\nexports.Buffer = Buffer\nexports.SlowBuffer = SlowBuffer\nexports.INSPECT_MAX_BYTES = 50\n\n/**\n * If `Buffer.TYPED_ARRAY_SUPPORT`:\n *   === true    Use Uint8Array implementation (fastest)\n *   === false   Use Object implementation (most compatible, even IE6)\n *\n * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,\n * Opera 11.6+, iOS 4.2+.\n *\n * Due to various browser bugs, sometimes the Object implementation will be used even\n * when the browser supports typed arrays.\n *\n * Note:\n *\n *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,\n *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.\n *\n *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.\n *\n *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of\n *     incorrect length in some situations.\n\n * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they\n * get the Object implementation, which is slower but behaves correctly.\n */\nBuffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined\n  ? global.TYPED_ARRAY_SUPPORT\n  : typedArraySupport()\n\n/*\n * Export kMaxLength after typed array support is determined.\n */\nexports.kMaxLength = kMaxLength()\n\nfunction typedArraySupport () {\n  try {\n    var arr = new Uint8Array(1)\n    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}\n    return arr.foo() === 42 && // typed array instances can be augmented\n        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`\n        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`\n  } catch (e) {\n    return false\n  }\n}\n\nfunction kMaxLength () {\n  return Buffer.TYPED_ARRAY_SUPPORT\n    ? 0x7fffffff\n    : 0x3fffffff\n}\n\nfunction createBuffer (that, length) {\n  if (kMaxLength() < length) {\n    throw new RangeError('Invalid typed array length')\n  }\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    // Return an augmented `Uint8Array` instance, for best performance\n    that = new Uint8Array(length)\n    that.__proto__ = Buffer.prototype\n  } else {\n    // Fallback: Return an object instance of the Buffer class\n    if (that === null) {\n      that = new Buffer(length)\n    }\n    that.length = length\n  }\n\n  return that\n}\n\n/**\n * The Buffer constructor returns instances of `Uint8Array` that have their\n * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of\n * `Uint8Array`, so the returned instances will have all the node `Buffer` methods\n * and the `Uint8Array` methods. Square bracket notation works as expected -- it\n * returns a single octet.\n *\n * The `Uint8Array` prototype remains unmodified.\n */\n\nfunction Buffer (arg, encodingOrOffset, length) {\n  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {\n    return new Buffer(arg, encodingOrOffset, length)\n  }\n\n  // Common case.\n  if (typeof arg === 'number') {\n    if (typeof encodingOrOffset === 'string') {\n      throw new Error(\n        'If encoding is specified then the first argument must be a string'\n      )\n    }\n    return allocUnsafe(this, arg)\n  }\n  return from(this, arg, encodingOrOffset, length)\n}\n\nBuffer.poolSize = 8192 // not used by this implementation\n\n// TODO: Legacy, not needed anymore. Remove in next major version.\nBuffer._augment = function (arr) {\n  arr.__proto__ = Buffer.prototype\n  return arr\n}\n\nfunction from (that, value, encodingOrOffset, length) {\n  if (typeof value === 'number') {\n    throw new TypeError('\"value\" argument must not be a number')\n  }\n\n  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {\n    return fromArrayBuffer(that, value, encodingOrOffset, length)\n  }\n\n  if (typeof value === 'string') {\n    return fromString(that, value, encodingOrOffset)\n  }\n\n  return fromObject(that, value)\n}\n\n/**\n * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError\n * if value is a number.\n * Buffer.from(str[, encoding])\n * Buffer.from(array)\n * Buffer.from(buffer)\n * Buffer.from(arrayBuffer[, byteOffset[, length]])\n **/\nBuffer.from = function (value, encodingOrOffset, length) {\n  return from(null, value, encodingOrOffset, length)\n}\n\nif (Buffer.TYPED_ARRAY_SUPPORT) {\n  Buffer.prototype.__proto__ = Uint8Array.prototype\n  Buffer.__proto__ = Uint8Array\n  if (typeof Symbol !== 'undefined' && Symbol.species &&\n      Buffer[Symbol.species] === Buffer) {\n    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97\n    Object.defineProperty(Buffer, Symbol.species, {\n      value: null,\n      configurable: true\n    })\n  }\n}\n\nfunction assertSize (size) {\n  if (typeof size !== 'number') {\n    throw new TypeError('\"size\" argument must be a number')\n  } else if (size < 0) {\n    throw new RangeError('\"size\" argument must not be negative')\n  }\n}\n\nfunction alloc (that, size, fill, encoding) {\n  assertSize(size)\n  if (size <= 0) {\n    return createBuffer(that, size)\n  }\n  if (fill !== undefined) {\n    // Only pay attention to encoding if it's a string. This\n    // prevents accidentally sending in a number that would\n    // be interpretted as a start offset.\n    return typeof encoding === 'string'\n      ? createBuffer(that, size).fill(fill, encoding)\n      : createBuffer(that, size).fill(fill)\n  }\n  return createBuffer(that, size)\n}\n\n/**\n * Creates a new filled Buffer instance.\n * alloc(size[, fill[, encoding]])\n **/\nBuffer.alloc = function (size, fill, encoding) {\n  return alloc(null, size, fill, encoding)\n}\n\nfunction allocUnsafe (that, size) {\n  assertSize(size)\n  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) {\n    for (var i = 0; i < size; ++i) {\n      that[i] = 0\n    }\n  }\n  return that\n}\n\n/**\n * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.\n * */\nBuffer.allocUnsafe = function (size) {\n  return allocUnsafe(null, size)\n}\n/**\n * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.\n */\nBuffer.allocUnsafeSlow = function (size) {\n  return allocUnsafe(null, size)\n}\n\nfunction fromString (that, string, encoding) {\n  if (typeof encoding !== 'string' || encoding === '') {\n    encoding = 'utf8'\n  }\n\n  if (!Buffer.isEncoding(encoding)) {\n    throw new TypeError('\"encoding\" must be a valid string encoding')\n  }\n\n  var length = byteLength(string, encoding) | 0\n  that = createBuffer(that, length)\n\n  var actual = that.write(string, encoding)\n\n  if (actual !== length) {\n    // Writing a hex string, for example, that contains invalid characters will\n    // cause everything after the first invalid character to be ignored. (e.g.\n    // 'abxxcd' will be treated as 'ab')\n    that = that.slice(0, actual)\n  }\n\n  return that\n}\n\nfunction fromArrayLike (that, array) {\n  var length = array.length < 0 ? 0 : checked(array.length) | 0\n  that = createBuffer(that, length)\n  for (var i = 0; i < length; i += 1) {\n    that[i] = array[i] & 255\n  }\n  return that\n}\n\nfunction fromArrayBuffer (that, array, byteOffset, length) {\n  array.byteLength // this throws if `array` is not a valid ArrayBuffer\n\n  if (byteOffset < 0 || array.byteLength < byteOffset) {\n    throw new RangeError('\\'offset\\' is out of bounds')\n  }\n\n  if (array.byteLength < byteOffset + (length || 0)) {\n    throw new RangeError('\\'length\\' is out of bounds')\n  }\n\n  if (byteOffset === undefined && length === undefined) {\n    array = new Uint8Array(array)\n  } else if (length === undefined) {\n    array = new Uint8Array(array, byteOffset)\n  } else {\n    array = new Uint8Array(array, byteOffset, length)\n  }\n\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    // Return an augmented `Uint8Array` instance, for best performance\n    that = array\n    that.__proto__ = Buffer.prototype\n  } else {\n    // Fallback: Return an object instance of the Buffer class\n    that = fromArrayLike(that, array)\n  }\n  return that\n}\n\nfunction fromObject (that, obj) {\n  if (Buffer.isBuffer(obj)) {\n    var len = checked(obj.length) | 0\n    that = createBuffer(that, len)\n\n    if (that.length === 0) {\n      return that\n    }\n\n    obj.copy(that, 0, 0, len)\n    return that\n  }\n\n  if (obj) {\n    if ((typeof ArrayBuffer !== 'undefined' &&\n        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {\n      if (typeof obj.length !== 'number' || isnan(obj.length)) {\n        return createBuffer(that, 0)\n      }\n      return fromArrayLike(that, obj)\n    }\n\n    if (obj.type === 'Buffer' && isArray(obj.data)) {\n      return fromArrayLike(that, obj.data)\n    }\n  }\n\n  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')\n}\n\nfunction checked (length) {\n  // Note: cannot use `length < kMaxLength()` here because that fails when\n  // length is NaN (which is otherwise coerced to zero.)\n  if (length >= kMaxLength()) {\n    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +\n                         'size: 0x' + kMaxLength().toString(16) + ' bytes')\n  }\n  return length | 0\n}\n\nfunction SlowBuffer (length) {\n  if (+length != length) { // eslint-disable-line eqeqeq\n    length = 0\n  }\n  return Buffer.alloc(+length)\n}\n\nBuffer.isBuffer = function isBuffer (b) {\n  return !!(b != null && b._isBuffer)\n}\n\nBuffer.compare = function compare (a, b) {\n  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {\n    throw new TypeError('Arguments must be Buffers')\n  }\n\n  if (a === b) return 0\n\n  var x = a.length\n  var y = b.length\n\n  for (var i = 0, len = Math.min(x, y); i < len; ++i) {\n    if (a[i] !== b[i]) {\n      x = a[i]\n      y = b[i]\n      break\n    }\n  }\n\n  if (x < y) return -1\n  if (y < x) return 1\n  return 0\n}\n\nBuffer.isEncoding = function isEncoding (encoding) {\n  switch (String(encoding).toLowerCase()) {\n    case 'hex':\n    case 'utf8':\n    case 'utf-8':\n    case 'ascii':\n    case 'latin1':\n    case 'binary':\n    case 'base64':\n    case 'ucs2':\n    case 'ucs-2':\n    case 'utf16le':\n    case 'utf-16le':\n      return true\n    default:\n      return false\n  }\n}\n\nBuffer.concat = function concat (list, length) {\n  if (!isArray(list)) {\n    throw new TypeError('\"list\" argument must be an Array of Buffers')\n  }\n\n  if (list.length === 0) {\n    return Buffer.alloc(0)\n  }\n\n  var i\n  if (length === undefined) {\n    length = 0\n    for (i = 0; i < list.length; ++i) {\n      length += list[i].length\n    }\n  }\n\n  var buffer = Buffer.allocUnsafe(length)\n  var pos = 0\n  for (i = 0; i < list.length; ++i) {\n    var buf = list[i]\n    if (!Buffer.isBuffer(buf)) {\n      throw new TypeError('\"list\" argument must be an Array of Buffers')\n    }\n    buf.copy(buffer, pos)\n    pos += buf.length\n  }\n  return buffer\n}\n\nfunction byteLength (string, encoding) {\n  if (Buffer.isBuffer(string)) {\n    return string.length\n  }\n  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&\n      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {\n    return string.byteLength\n  }\n  if (typeof string !== 'string') {\n    string = '' + string\n  }\n\n  var len = string.length\n  if (len === 0) return 0\n\n  // Use a for loop to avoid recursion\n  var loweredCase = false\n  for (;;) {\n    switch (encoding) {\n      case 'ascii':\n      case 'latin1':\n      case 'binary':\n        return len\n      case 'utf8':\n      case 'utf-8':\n      case undefined:\n        return utf8ToBytes(string).length\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return len * 2\n      case 'hex':\n        return len >>> 1\n      case 'base64':\n        return base64ToBytes(string).length\n      default:\n        if (loweredCase) return utf8ToBytes(string).length // assume utf8\n        encoding = ('' + encoding).toLowerCase()\n        loweredCase = true\n    }\n  }\n}\nBuffer.byteLength = byteLength\n\nfunction slowToString (encoding, start, end) {\n  var loweredCase = false\n\n  // No need to verify that \"this.length <= MAX_UINT32\" since it's a read-only\n  // property of a typed array.\n\n  // This behaves neither like String nor Uint8Array in that we set start/end\n  // to their upper/lower bounds if the value passed is out of range.\n  // undefined is handled specially as per ECMA-262 6th Edition,\n  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.\n  if (start === undefined || start < 0) {\n    start = 0\n  }\n  // Return early if start > this.length. Done here to prevent potential uint32\n  // coercion fail below.\n  if (start > this.length) {\n    return ''\n  }\n\n  if (end === undefined || end > this.length) {\n    end = this.length\n  }\n\n  if (end <= 0) {\n    return ''\n  }\n\n  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.\n  end >>>= 0\n  start >>>= 0\n\n  if (end <= start) {\n    return ''\n  }\n\n  if (!encoding) encoding = 'utf8'\n\n  while (true) {\n    switch (encoding) {\n      case 'hex':\n        return hexSlice(this, start, end)\n\n      case 'utf8':\n      case 'utf-8':\n        return utf8Slice(this, start, end)\n\n      case 'ascii':\n        return asciiSlice(this, start, end)\n\n      case 'latin1':\n      case 'binary':\n        return latin1Slice(this, start, end)\n\n      case 'base64':\n        return base64Slice(this, start, end)\n\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return utf16leSlice(this, start, end)\n\n      default:\n        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)\n        encoding = (encoding + '').toLowerCase()\n        loweredCase = true\n    }\n  }\n}\n\n// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect\n// Buffer instances.\nBuffer.prototype._isBuffer = true\n\nfunction swap (b, n, m) {\n  var i = b[n]\n  b[n] = b[m]\n  b[m] = i\n}\n\nBuffer.prototype.swap16 = function swap16 () {\n  var len = this.length\n  if (len % 2 !== 0) {\n    throw new RangeError('Buffer size must be a multiple of 16-bits')\n  }\n  for (var i = 0; i < len; i += 2) {\n    swap(this, i, i + 1)\n  }\n  return this\n}\n\nBuffer.prototype.swap32 = function swap32 () {\n  var len = this.length\n  if (len % 4 !== 0) {\n    throw new RangeError('Buffer size must be a multiple of 32-bits')\n  }\n  for (var i = 0; i < len; i += 4) {\n    swap(this, i, i + 3)\n    swap(this, i + 1, i + 2)\n  }\n  return this\n}\n\nBuffer.prototype.swap64 = function swap64 () {\n  var len = this.length\n  if (len % 8 !== 0) {\n    throw new RangeError('Buffer size must be a multiple of 64-bits')\n  }\n  for (var i = 0; i < len; i += 8) {\n    swap(this, i, i + 7)\n    swap(this, i + 1, i + 6)\n    swap(this, i + 2, i + 5)\n    swap(this, i + 3, i + 4)\n  }\n  return this\n}\n\nBuffer.prototype.toString = function toString () {\n  var length = this.length | 0\n  if (length === 0) return ''\n  if (arguments.length === 0) return utf8Slice(this, 0, length)\n  return slowToString.apply(this, arguments)\n}\n\nBuffer.prototype.equals = function equals (b) {\n  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')\n  if (this === b) return true\n  return Buffer.compare(this, b) === 0\n}\n\nBuffer.prototype.inspect = function inspect () {\n  var str = ''\n  var max = exports.INSPECT_MAX_BYTES\n  if (this.length > 0) {\n    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')\n    if (this.length > max) str += ' ... '\n  }\n  return '<Buffer ' + str + '>'\n}\n\nBuffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {\n  if (!Buffer.isBuffer(target)) {\n    throw new TypeError('Argument must be a Buffer')\n  }\n\n  if (start === undefined) {\n    start = 0\n  }\n  if (end === undefined) {\n    end = target ? target.length : 0\n  }\n  if (thisStart === undefined) {\n    thisStart = 0\n  }\n  if (thisEnd === undefined) {\n    thisEnd = this.length\n  }\n\n  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {\n    throw new RangeError('out of range index')\n  }\n\n  if (thisStart >= thisEnd && start >= end) {\n    return 0\n  }\n  if (thisStart >= thisEnd) {\n    return -1\n  }\n  if (start >= end) {\n    return 1\n  }\n\n  start >>>= 0\n  end >>>= 0\n  thisStart >>>= 0\n  thisEnd >>>= 0\n\n  if (this === target) return 0\n\n  var x = thisEnd - thisStart\n  var y = end - start\n  var len = Math.min(x, y)\n\n  var thisCopy = this.slice(thisStart, thisEnd)\n  var targetCopy = target.slice(start, end)\n\n  for (var i = 0; i < len; ++i) {\n    if (thisCopy[i] !== targetCopy[i]) {\n      x = thisCopy[i]\n      y = targetCopy[i]\n      break\n    }\n  }\n\n  if (x < y) return -1\n  if (y < x) return 1\n  return 0\n}\n\n// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,\n// OR the last index of `val` in `buffer` at offset <= `byteOffset`.\n//\n// Arguments:\n// - buffer - a Buffer to search\n// - val - a string, Buffer, or number\n// - byteOffset - an index into `buffer`; will be clamped to an int32\n// - encoding - an optional encoding, relevant is val is a string\n// - dir - true for indexOf, false for lastIndexOf\nfunction bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {\n  // Empty buffer means no match\n  if (buffer.length === 0) return -1\n\n  // Normalize byteOffset\n  if (typeof byteOffset === 'string') {\n    encoding = byteOffset\n    byteOffset = 0\n  } else if (byteOffset > 0x7fffffff) {\n    byteOffset = 0x7fffffff\n  } else if (byteOffset < -0x80000000) {\n    byteOffset = -0x80000000\n  }\n  byteOffset = +byteOffset  // Coerce to Number.\n  if (isNaN(byteOffset)) {\n    // byteOffset: it it's undefined, null, NaN, \"foo\", etc, search whole buffer\n    byteOffset = dir ? 0 : (buffer.length - 1)\n  }\n\n  // Normalize byteOffset: negative offsets start from the end of the buffer\n  if (byteOffset < 0) byteOffset = buffer.length + byteOffset\n  if (byteOffset >= buffer.length) {\n    if (dir) return -1\n    else byteOffset = buffer.length - 1\n  } else if (byteOffset < 0) {\n    if (dir) byteOffset = 0\n    else return -1\n  }\n\n  // Normalize val\n  if (typeof val === 'string') {\n    val = Buffer.from(val, encoding)\n  }\n\n  // Finally, search either indexOf (if dir is true) or lastIndexOf\n  if (Buffer.isBuffer(val)) {\n    // Special case: looking for empty string/buffer always fails\n    if (val.length === 0) {\n      return -1\n    }\n    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)\n  } else if (typeof val === 'number') {\n    val = val & 0xFF // Search for a byte value [0-255]\n    if (Buffer.TYPED_ARRAY_SUPPORT &&\n        typeof Uint8Array.prototype.indexOf === 'function') {\n      if (dir) {\n        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)\n      } else {\n        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)\n      }\n    }\n    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)\n  }\n\n  throw new TypeError('val must be string, number or Buffer')\n}\n\nfunction arrayIndexOf (arr, val, byteOffset, encoding, dir) {\n  var indexSize = 1\n  var arrLength = arr.length\n  var valLength = val.length\n\n  if (encoding !== undefined) {\n    encoding = String(encoding).toLowerCase()\n    if (encoding === 'ucs2' || encoding === 'ucs-2' ||\n        encoding === 'utf16le' || encoding === 'utf-16le') {\n      if (arr.length < 2 || val.length < 2) {\n        return -1\n      }\n      indexSize = 2\n      arrLength /= 2\n      valLength /= 2\n      byteOffset /= 2\n    }\n  }\n\n  function read (buf, i) {\n    if (indexSize === 1) {\n      return buf[i]\n    } else {\n      return buf.readUInt16BE(i * indexSize)\n    }\n  }\n\n  var i\n  if (dir) {\n    var foundIndex = -1\n    for (i = byteOffset; i < arrLength; i++) {\n      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {\n        if (foundIndex === -1) foundIndex = i\n        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize\n      } else {\n        if (foundIndex !== -1) i -= i - foundIndex\n        foundIndex = -1\n      }\n    }\n  } else {\n    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength\n    for (i = byteOffset; i >= 0; i--) {\n      var found = true\n      for (var j = 0; j < valLength; j++) {\n        if (read(arr, i + j) !== read(val, j)) {\n          found = false\n          break\n        }\n      }\n      if (found) return i\n    }\n  }\n\n  return -1\n}\n\nBuffer.prototype.includes = function includes (val, byteOffset, encoding) {\n  return this.indexOf(val, byteOffset, encoding) !== -1\n}\n\nBuffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {\n  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)\n}\n\nBuffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {\n  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)\n}\n\nfunction hexWrite (buf, string, offset, length) {\n  offset = Number(offset) || 0\n  var remaining = buf.length - offset\n  if (!length) {\n    length = remaining\n  } else {\n    length = Number(length)\n    if (length > remaining) {\n      length = remaining\n    }\n  }\n\n  // must be an even number of digits\n  var strLen = string.length\n  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')\n\n  if (length > strLen / 2) {\n    length = strLen / 2\n  }\n  for (var i = 0; i < length; ++i) {\n    var parsed = parseInt(string.substr(i * 2, 2), 16)\n    if (isNaN(parsed)) return i\n    buf[offset + i] = parsed\n  }\n  return i\n}\n\nfunction utf8Write (buf, string, offset, length) {\n  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)\n}\n\nfunction asciiWrite (buf, string, offset, length) {\n  return blitBuffer(asciiToBytes(string), buf, offset, length)\n}\n\nfunction latin1Write (buf, string, offset, length) {\n  return asciiWrite(buf, string, offset, length)\n}\n\nfunction base64Write (buf, string, offset, length) {\n  return blitBuffer(base64ToBytes(string), buf, offset, length)\n}\n\nfunction ucs2Write (buf, string, offset, length) {\n  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)\n}\n\nBuffer.prototype.write = function write (string, offset, length, encoding) {\n  // Buffer#write(string)\n  if (offset === undefined) {\n    encoding = 'utf8'\n    length = this.length\n    offset = 0\n  // Buffer#write(string, encoding)\n  } else if (length === undefined && typeof offset === 'string') {\n    encoding = offset\n    length = this.length\n    offset = 0\n  // Buffer#write(string, offset[, length][, encoding])\n  } else if (isFinite(offset)) {\n    offset = offset | 0\n    if (isFinite(length)) {\n      length = length | 0\n      if (encoding === undefined) encoding = 'utf8'\n    } else {\n      encoding = length\n      length = undefined\n    }\n  // legacy write(string, encoding, offset, length) - remove in v0.13\n  } else {\n    throw new Error(\n      'Buffer.write(string, encoding, offset[, length]) is no longer supported'\n    )\n  }\n\n  var remaining = this.length - offset\n  if (length === undefined || length > remaining) length = remaining\n\n  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {\n    throw new RangeError('Attempt to write outside buffer bounds')\n  }\n\n  if (!encoding) encoding = 'utf8'\n\n  var loweredCase = false\n  for (;;) {\n    switch (encoding) {\n      case 'hex':\n        return hexWrite(this, string, offset, length)\n\n      case 'utf8':\n      case 'utf-8':\n        return utf8Write(this, string, offset, length)\n\n      case 'ascii':\n        return asciiWrite(this, string, offset, length)\n\n      case 'latin1':\n      case 'binary':\n        return latin1Write(this, string, offset, length)\n\n      case 'base64':\n        // Warning: maxLength not taken into account in base64Write\n        return base64Write(this, string, offset, length)\n\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return ucs2Write(this, string, offset, length)\n\n      default:\n        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)\n        encoding = ('' + encoding).toLowerCase()\n        loweredCase = true\n    }\n  }\n}\n\nBuffer.prototype.toJSON = function toJSON () {\n  return {\n    type: 'Buffer',\n    data: Array.prototype.slice.call(this._arr || this, 0)\n  }\n}\n\nfunction base64Slice (buf, start, end) {\n  if (start === 0 && end === buf.length) {\n    return base64.fromByteArray(buf)\n  } else {\n    return base64.fromByteArray(buf.slice(start, end))\n  }\n}\n\nfunction utf8Slice (buf, start, end) {\n  end = Math.min(buf.length, end)\n  var res = []\n\n  var i = start\n  while (i < end) {\n    var firstByte = buf[i]\n    var codePoint = null\n    var bytesPerSequence = (firstByte > 0xEF) ? 4\n      : (firstByte > 0xDF) ? 3\n      : (firstByte > 0xBF) ? 2\n      : 1\n\n    if (i + bytesPerSequence <= end) {\n      var secondByte, thirdByte, fourthByte, tempCodePoint\n\n      switch (bytesPerSequence) {\n        case 1:\n          if (firstByte < 0x80) {\n            codePoint = firstByte\n          }\n          break\n        case 2:\n          secondByte = buf[i + 1]\n          if ((secondByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)\n            if (tempCodePoint > 0x7F) {\n              codePoint = tempCodePoint\n            }\n          }\n          break\n        case 3:\n          secondByte = buf[i + 1]\n          thirdByte = buf[i + 2]\n          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)\n            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {\n              codePoint = tempCodePoint\n            }\n          }\n          break\n        case 4:\n          secondByte = buf[i + 1]\n          thirdByte = buf[i + 2]\n          fourthByte = buf[i + 3]\n          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)\n            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {\n              codePoint = tempCodePoint\n            }\n          }\n      }\n    }\n\n    if (codePoint === null) {\n      // we did not generate a valid codePoint so insert a\n      // replacement char (U+FFFD) and advance only 1 byte\n      codePoint = 0xFFFD\n      bytesPerSequence = 1\n    } else if (codePoint > 0xFFFF) {\n      // encode to utf16 (surrogate pair dance)\n      codePoint -= 0x10000\n      res.push(codePoint >>> 10 & 0x3FF | 0xD800)\n      codePoint = 0xDC00 | codePoint & 0x3FF\n    }\n\n    res.push(codePoint)\n    i += bytesPerSequence\n  }\n\n  return decodeCodePointsArray(res)\n}\n\n// Based on http://stackoverflow.com/a/22747272/680742, the browser with\n// the lowest limit is Chrome, with 0x10000 args.\n// We go 1 magnitude less, for safety\nvar MAX_ARGUMENTS_LENGTH = 0x1000\n\nfunction decodeCodePointsArray (codePoints) {\n  var len = codePoints.length\n  if (len <= MAX_ARGUMENTS_LENGTH) {\n    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()\n  }\n\n  // Decode in chunks to avoid \"call stack size exceeded\".\n  var res = ''\n  var i = 0\n  while (i < len) {\n    res += String.fromCharCode.apply(\n      String,\n      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)\n    )\n  }\n  return res\n}\n\nfunction asciiSlice (buf, start, end) {\n  var ret = ''\n  end = Math.min(buf.length, end)\n\n  for (var i = start; i < end; ++i) {\n    ret += String.fromCharCode(buf[i] & 0x7F)\n  }\n  return ret\n}\n\nfunction latin1Slice (buf, start, end) {\n  var ret = ''\n  end = Math.min(buf.length, end)\n\n  for (var i = start; i < end; ++i) {\n    ret += String.fromCharCode(buf[i])\n  }\n  return ret\n}\n\nfunction hexSlice (buf, start, end) {\n  var len = buf.length\n\n  if (!start || start < 0) start = 0\n  if (!end || end < 0 || end > len) end = len\n\n  var out = ''\n  for (var i = start; i < end; ++i) {\n    out += toHex(buf[i])\n  }\n  return out\n}\n\nfunction utf16leSlice (buf, start, end) {\n  var bytes = buf.slice(start, end)\n  var res = ''\n  for (var i = 0; i < bytes.length; i += 2) {\n    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)\n  }\n  return res\n}\n\nBuffer.prototype.slice = function slice (start, end) {\n  var len = this.length\n  start = ~~start\n  end = end === undefined ? len : ~~end\n\n  if (start < 0) {\n    start += len\n    if (start < 0) start = 0\n  } else if (start > len) {\n    start = len\n  }\n\n  if (end < 0) {\n    end += len\n    if (end < 0) end = 0\n  } else if (end > len) {\n    end = len\n  }\n\n  if (end < start) end = start\n\n  var newBuf\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    newBuf = this.subarray(start, end)\n    newBuf.__proto__ = Buffer.prototype\n  } else {\n    var sliceLen = end - start\n    newBuf = new Buffer(sliceLen, undefined)\n    for (var i = 0; i < sliceLen; ++i) {\n      newBuf[i] = this[i + start]\n    }\n  }\n\n  return newBuf\n}\n\n/*\n * Need to make sure that buffer isn't trying to write out of bounds.\n */\nfunction checkOffset (offset, ext, length) {\n  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')\n  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')\n}\n\nBuffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var val = this[offset]\n  var mul = 1\n  var i = 0\n  while (++i < byteLength && (mul *= 0x100)) {\n    val += this[offset + i] * mul\n  }\n\n  return val\n}\n\nBuffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) {\n    checkOffset(offset, byteLength, this.length)\n  }\n\n  var val = this[offset + --byteLength]\n  var mul = 1\n  while (byteLength > 0 && (mul *= 0x100)) {\n    val += this[offset + --byteLength] * mul\n  }\n\n  return val\n}\n\nBuffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 1, this.length)\n  return this[offset]\n}\n\nBuffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  return this[offset] | (this[offset + 1] << 8)\n}\n\nBuffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  return (this[offset] << 8) | this[offset + 1]\n}\n\nBuffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return ((this[offset]) |\n      (this[offset + 1] << 8) |\n      (this[offset + 2] << 16)) +\n      (this[offset + 3] * 0x1000000)\n}\n\nBuffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset] * 0x1000000) +\n    ((this[offset + 1] << 16) |\n    (this[offset + 2] << 8) |\n    this[offset + 3])\n}\n\nBuffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var val = this[offset]\n  var mul = 1\n  var i = 0\n  while (++i < byteLength && (mul *= 0x100)) {\n    val += this[offset + i] * mul\n  }\n  mul *= 0x80\n\n  if (val >= mul) val -= Math.pow(2, 8 * byteLength)\n\n  return val\n}\n\nBuffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var i = byteLength\n  var mul = 1\n  var val = this[offset + --i]\n  while (i > 0 && (mul *= 0x100)) {\n    val += this[offset + --i] * mul\n  }\n  mul *= 0x80\n\n  if (val >= mul) val -= Math.pow(2, 8 * byteLength)\n\n  return val\n}\n\nBuffer.prototype.readInt8 = function readInt8 (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 1, this.length)\n  if (!(this[offset] & 0x80)) return (this[offset])\n  return ((0xff - this[offset] + 1) * -1)\n}\n\nBuffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  var val = this[offset] | (this[offset + 1] << 8)\n  return (val & 0x8000) ? val | 0xFFFF0000 : val\n}\n\nBuffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  var val = this[offset + 1] | (this[offset] << 8)\n  return (val & 0x8000) ? val | 0xFFFF0000 : val\n}\n\nBuffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset]) |\n    (this[offset + 1] << 8) |\n    (this[offset + 2] << 16) |\n    (this[offset + 3] << 24)\n}\n\nBuffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset] << 24) |\n    (this[offset + 1] << 16) |\n    (this[offset + 2] << 8) |\n    (this[offset + 3])\n}\n\nBuffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n  return ieee754.read(this, offset, true, 23, 4)\n}\n\nBuffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n  return ieee754.read(this, offset, false, 23, 4)\n}\n\nBuffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 8, this.length)\n  return ieee754.read(this, offset, true, 52, 8)\n}\n\nBuffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 8, this.length)\n  return ieee754.read(this, offset, false, 52, 8)\n}\n\nfunction checkInt (buf, value, offset, ext, max, min) {\n  if (!Buffer.isBuffer(buf)) throw new TypeError('\"buffer\" argument must be a Buffer instance')\n  if (value > max || value < min) throw new RangeError('\"value\" argument is out of bounds')\n  if (offset + ext > buf.length) throw new RangeError('Index out of range')\n}\n\nBuffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) {\n    var maxBytes = Math.pow(2, 8 * byteLength) - 1\n    checkInt(this, value, offset, byteLength, maxBytes, 0)\n  }\n\n  var mul = 1\n  var i = 0\n  this[offset] = value & 0xFF\n  while (++i < byteLength && (mul *= 0x100)) {\n    this[offset + i] = (value / mul) & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) {\n    var maxBytes = Math.pow(2, 8 * byteLength) - 1\n    checkInt(this, value, offset, byteLength, maxBytes, 0)\n  }\n\n  var i = byteLength - 1\n  var mul = 1\n  this[offset + i] = value & 0xFF\n  while (--i >= 0 && (mul *= 0x100)) {\n    this[offset + i] = (value / mul) & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)\n  this[offset] = (value & 0xff)\n  return offset + 1\n}\n\nfunction objectWriteUInt16 (buf, value, offset, littleEndian) {\n  if (value < 0) value = 0xffff + value + 1\n  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {\n    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>\n      (littleEndian ? i : 1 - i) * 8\n  }\n}\n\nBuffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value & 0xff)\n    this[offset + 1] = (value >>> 8)\n  } else {\n    objectWriteUInt16(this, value, offset, true)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 8)\n    this[offset + 1] = (value & 0xff)\n  } else {\n    objectWriteUInt16(this, value, offset, false)\n  }\n  return offset + 2\n}\n\nfunction objectWriteUInt32 (buf, value, offset, littleEndian) {\n  if (value < 0) value = 0xffffffff + value + 1\n  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {\n    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff\n  }\n}\n\nBuffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset + 3] = (value >>> 24)\n    this[offset + 2] = (value >>> 16)\n    this[offset + 1] = (value >>> 8)\n    this[offset] = (value & 0xff)\n  } else {\n    objectWriteUInt32(this, value, offset, true)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 24)\n    this[offset + 1] = (value >>> 16)\n    this[offset + 2] = (value >>> 8)\n    this[offset + 3] = (value & 0xff)\n  } else {\n    objectWriteUInt32(this, value, offset, false)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) {\n    var limit = Math.pow(2, 8 * byteLength - 1)\n\n    checkInt(this, value, offset, byteLength, limit - 1, -limit)\n  }\n\n  var i = 0\n  var mul = 1\n  var sub = 0\n  this[offset] = value & 0xFF\n  while (++i < byteLength && (mul *= 0x100)) {\n    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {\n      sub = 1\n    }\n    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) {\n    var limit = Math.pow(2, 8 * byteLength - 1)\n\n    checkInt(this, value, offset, byteLength, limit - 1, -limit)\n  }\n\n  var i = byteLength - 1\n  var mul = 1\n  var sub = 0\n  this[offset + i] = value & 0xFF\n  while (--i >= 0 && (mul *= 0x100)) {\n    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {\n      sub = 1\n    }\n    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)\n  if (value < 0) value = 0xff + value + 1\n  this[offset] = (value & 0xff)\n  return offset + 1\n}\n\nBuffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value & 0xff)\n    this[offset + 1] = (value >>> 8)\n  } else {\n    objectWriteUInt16(this, value, offset, true)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 8)\n    this[offset + 1] = (value & 0xff)\n  } else {\n    objectWriteUInt16(this, value, offset, false)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value & 0xff)\n    this[offset + 1] = (value >>> 8)\n    this[offset + 2] = (value >>> 16)\n    this[offset + 3] = (value >>> 24)\n  } else {\n    objectWriteUInt32(this, value, offset, true)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)\n  if (value < 0) value = 0xffffffff + value + 1\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 24)\n    this[offset + 1] = (value >>> 16)\n    this[offset + 2] = (value >>> 8)\n    this[offset + 3] = (value & 0xff)\n  } else {\n    objectWriteUInt32(this, value, offset, false)\n  }\n  return offset + 4\n}\n\nfunction checkIEEE754 (buf, value, offset, ext, max, min) {\n  if (offset + ext > buf.length) throw new RangeError('Index out of range')\n  if (offset < 0) throw new RangeError('Index out of range')\n}\n\nfunction writeFloat (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)\n  }\n  ieee754.write(buf, value, offset, littleEndian, 23, 4)\n  return offset + 4\n}\n\nBuffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {\n  return writeFloat(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {\n  return writeFloat(this, value, offset, false, noAssert)\n}\n\nfunction writeDouble (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)\n  }\n  ieee754.write(buf, value, offset, littleEndian, 52, 8)\n  return offset + 8\n}\n\nBuffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {\n  return writeDouble(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {\n  return writeDouble(this, value, offset, false, noAssert)\n}\n\n// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)\nBuffer.prototype.copy = function copy (target, targetStart, start, end) {\n  if (!start) start = 0\n  if (!end && end !== 0) end = this.length\n  if (targetStart >= target.length) targetStart = target.length\n  if (!targetStart) targetStart = 0\n  if (end > 0 && end < start) end = start\n\n  // Copy 0 bytes; we're done\n  if (end === start) return 0\n  if (target.length === 0 || this.length === 0) return 0\n\n  // Fatal error conditions\n  if (targetStart < 0) {\n    throw new RangeError('targetStart out of bounds')\n  }\n  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')\n  if (end < 0) throw new RangeError('sourceEnd out of bounds')\n\n  // Are we oob?\n  if (end > this.length) end = this.length\n  if (target.length - targetStart < end - start) {\n    end = target.length - targetStart + start\n  }\n\n  var len = end - start\n  var i\n\n  if (this === target && start < targetStart && targetStart < end) {\n    // descending copy from end\n    for (i = len - 1; i >= 0; --i) {\n      target[i + targetStart] = this[i + start]\n    }\n  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {\n    // ascending copy from start\n    for (i = 0; i < len; ++i) {\n      target[i + targetStart] = this[i + start]\n    }\n  } else {\n    Uint8Array.prototype.set.call(\n      target,\n      this.subarray(start, start + len),\n      targetStart\n    )\n  }\n\n  return len\n}\n\n// Usage:\n//    buffer.fill(number[, offset[, end]])\n//    buffer.fill(buffer[, offset[, end]])\n//    buffer.fill(string[, offset[, end]][, encoding])\nBuffer.prototype.fill = function fill (val, start, end, encoding) {\n  // Handle string cases:\n  if (typeof val === 'string') {\n    if (typeof start === 'string') {\n      encoding = start\n      start = 0\n      end = this.length\n    } else if (typeof end === 'string') {\n      encoding = end\n      end = this.length\n    }\n    if (val.length === 1) {\n      var code = val.charCodeAt(0)\n      if (code < 256) {\n        val = code\n      }\n    }\n    if (encoding !== undefined && typeof encoding !== 'string') {\n      throw new TypeError('encoding must be a string')\n    }\n    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {\n      throw new TypeError('Unknown encoding: ' + encoding)\n    }\n  } else if (typeof val === 'number') {\n    val = val & 255\n  }\n\n  // Invalid ranges are not set to a default, so can range check early.\n  if (start < 0 || this.length < start || this.length < end) {\n    throw new RangeError('Out of range index')\n  }\n\n  if (end <= start) {\n    return this\n  }\n\n  start = start >>> 0\n  end = end === undefined ? this.length : end >>> 0\n\n  if (!val) val = 0\n\n  var i\n  if (typeof val === 'number') {\n    for (i = start; i < end; ++i) {\n      this[i] = val\n    }\n  } else {\n    var bytes = Buffer.isBuffer(val)\n      ? val\n      : utf8ToBytes(new Buffer(val, encoding).toString())\n    var len = bytes.length\n    for (i = 0; i < end - start; ++i) {\n      this[i + start] = bytes[i % len]\n    }\n  }\n\n  return this\n}\n\n// HELPER FUNCTIONS\n// ================\n\nvar INVALID_BASE64_RE = /[^+\\/0-9A-Za-z-_]/g\n\nfunction base64clean (str) {\n  // Node strips out invalid characters like \\n and \\t from the string, base64-js does not\n  str = stringtrim(str).replace(INVALID_BASE64_RE, '')\n  // Node converts strings with length < 2 to ''\n  if (str.length < 2) return ''\n  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not\n  while (str.length % 4 !== 0) {\n    str = str + '='\n  }\n  return str\n}\n\nfunction stringtrim (str) {\n  if (str.trim) return str.trim()\n  return str.replace(/^\\s+|\\s+$/g, '')\n}\n\nfunction toHex (n) {\n  if (n < 16) return '0' + n.toString(16)\n  return n.toString(16)\n}\n\nfunction utf8ToBytes (string, units) {\n  units = units || Infinity\n  var codePoint\n  var length = string.length\n  var leadSurrogate = null\n  var bytes = []\n\n  for (var i = 0; i < length; ++i) {\n    codePoint = string.charCodeAt(i)\n\n    // is surrogate component\n    if (codePoint > 0xD7FF && codePoint < 0xE000) {\n      // last char was a lead\n      if (!leadSurrogate) {\n        // no lead yet\n        if (codePoint > 0xDBFF) {\n          // unexpected trail\n          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n          continue\n        } else if (i + 1 === length) {\n          // unpaired lead\n          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n          continue\n        }\n\n        // valid lead\n        leadSurrogate = codePoint\n\n        continue\n      }\n\n      // 2 leads in a row\n      if (codePoint < 0xDC00) {\n        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n        leadSurrogate = codePoint\n        continue\n      }\n\n      // valid surrogate pair\n      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000\n    } else if (leadSurrogate) {\n      // valid bmp char, but last char was a lead\n      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n    }\n\n    leadSurrogate = null\n\n    // encode utf8\n    if (codePoint < 0x80) {\n      if ((units -= 1) < 0) break\n      bytes.push(codePoint)\n    } else if (codePoint < 0x800) {\n      if ((units -= 2) < 0) break\n      bytes.push(\n        codePoint >> 0x6 | 0xC0,\n        codePoint & 0x3F | 0x80\n      )\n    } else if (codePoint < 0x10000) {\n      if ((units -= 3) < 0) break\n      bytes.push(\n        codePoint >> 0xC | 0xE0,\n        codePoint >> 0x6 & 0x3F | 0x80,\n        codePoint & 0x3F | 0x80\n      )\n    } else if (codePoint < 0x110000) {\n      if ((units -= 4) < 0) break\n      bytes.push(\n        codePoint >> 0x12 | 0xF0,\n        codePoint >> 0xC & 0x3F | 0x80,\n        codePoint >> 0x6 & 0x3F | 0x80,\n        codePoint & 0x3F | 0x80\n      )\n    } else {\n      throw new Error('Invalid code point')\n    }\n  }\n\n  return bytes\n}\n\nfunction asciiToBytes (str) {\n  var byteArray = []\n  for (var i = 0; i < str.length; ++i) {\n    // Node's code seems to be doing this and not & 0x7F..\n    byteArray.push(str.charCodeAt(i) & 0xFF)\n  }\n  return byteArray\n}\n\nfunction utf16leToBytes (str, units) {\n  var c, hi, lo\n  var byteArray = []\n  for (var i = 0; i < str.length; ++i) {\n    if ((units -= 2) < 0) break\n\n    c = str.charCodeAt(i)\n    hi = c >> 8\n    lo = c % 256\n    byteArray.push(lo)\n    byteArray.push(hi)\n  }\n\n  return byteArray\n}\n\nfunction base64ToBytes (str) {\n  return base64.toByteArray(base64clean(str))\n}\n\nfunction blitBuffer (src, dst, offset, length) {\n  for (var i = 0; i < length; ++i) {\n    if ((i + offset >= dst.length) || (i >= src.length)) break\n    dst[i + offset] = src[i]\n  }\n  return i\n}\n\nfunction isnan (val) {\n  return val !== val // eslint-disable-line no-self-compare\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack://PizZip/./node_modules/buffer/index.js?");

                    /***/
                }),

      /***/ "./node_modules/ieee754/index.js":
      /*!***************************************!*\
        !*** ./node_modules/ieee754/index.js ***!
        \***************************************/
      /*! no static exports found */
      /***/ (function (module, exports) {

                    eval("exports.read = function (buffer, offset, isLE, mLen, nBytes) {\n  var e, m\n  var eLen = (nBytes * 8) - mLen - 1\n  var eMax = (1 << eLen) - 1\n  var eBias = eMax >> 1\n  var nBits = -7\n  var i = isLE ? (nBytes - 1) : 0\n  var d = isLE ? -1 : 1\n  var s = buffer[offset + i]\n\n  i += d\n\n  e = s & ((1 << (-nBits)) - 1)\n  s >>= (-nBits)\n  nBits += eLen\n  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}\n\n  m = e & ((1 << (-nBits)) - 1)\n  e >>= (-nBits)\n  nBits += mLen\n  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}\n\n  if (e === 0) {\n    e = 1 - eBias\n  } else if (e === eMax) {\n    return m ? NaN : ((s ? -1 : 1) * Infinity)\n  } else {\n    m = m + Math.pow(2, mLen)\n    e = e - eBias\n  }\n  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)\n}\n\nexports.write = function (buffer, value, offset, isLE, mLen, nBytes) {\n  var e, m, c\n  var eLen = (nBytes * 8) - mLen - 1\n  var eMax = (1 << eLen) - 1\n  var eBias = eMax >> 1\n  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)\n  var i = isLE ? 0 : (nBytes - 1)\n  var d = isLE ? 1 : -1\n  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0\n\n  value = Math.abs(value)\n\n  if (isNaN(value) || value === Infinity) {\n    m = isNaN(value) ? 1 : 0\n    e = eMax\n  } else {\n    e = Math.floor(Math.log(value) / Math.LN2)\n    if (value * (c = Math.pow(2, -e)) < 1) {\n      e--\n      c *= 2\n    }\n    if (e + eBias >= 1) {\n      value += rt / c\n    } else {\n      value += rt * Math.pow(2, 1 - eBias)\n    }\n    if (value * c >= 2) {\n      e++\n      c /= 2\n    }\n\n    if (e + eBias >= eMax) {\n      m = 0\n      e = eMax\n    } else if (e + eBias >= 1) {\n      m = ((value * c) - 1) * Math.pow(2, mLen)\n      e = e + eBias\n    } else {\n      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)\n      e = 0\n    }\n  }\n\n  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}\n\n  e = (e << mLen) | m\n  eLen += mLen\n  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}\n\n  buffer[offset + i - d] |= s * 128\n}\n\n\n//# sourceURL=webpack://PizZip/./node_modules/ieee754/index.js?");

                    /***/
                }),

      /***/ "./node_modules/isarray/index.js":
      /*!***************************************!*\
        !*** ./node_modules/isarray/index.js ***!
        \***************************************/
      /*! no static exports found */
      /***/ (function (module, exports) {

                    eval("var toString = {}.toString;\n\nmodule.exports = Array.isArray || function (arr) {\n  return toString.call(arr) == '[object Array]';\n};\n\n\n//# sourceURL=webpack://PizZip/./node_modules/isarray/index.js?");

                    /***/
                }),

      /***/ "./node_modules/pako/dist/pako.es5.js":
      /*!********************************************!*\
        !*** ./node_modules/pako/dist/pako.es5.js ***!
        \********************************************/
      /*! no static exports found */
      /***/ (function (module, exports, __webpack_require__) {

                    eval("\n/*! pako 2.0.4 https://github.com/nodeca/pako @license (MIT AND Zlib) */\n(function (global, factory) {\n   true ? factory(exports) :\n  undefined;\n}(this, (function (exports) { 'use strict';\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n  /* eslint-disable space-unary-ops */\n\n  /* Public constants ==========================================================*/\n\n  /* ===========================================================================*/\n  //const Z_FILTERED          = 1;\n  //const Z_HUFFMAN_ONLY      = 2;\n  //const Z_RLE               = 3;\n\n  var Z_FIXED$1 = 4; //const Z_DEFAULT_STRATEGY  = 0;\n\n  /* Possible values of the data_type field (though see inflate()) */\n\n  var Z_BINARY = 0;\n  var Z_TEXT = 1; //const Z_ASCII             = 1; // = Z_TEXT\n\n  var Z_UNKNOWN$1 = 2;\n  /*============================================================================*/\n\n  function zero$1(buf) {\n    var len = buf.length;\n\n    while (--len >= 0) {\n      buf[len] = 0;\n    }\n  } // From zutil.h\n\n\n  var STORED_BLOCK = 0;\n  var STATIC_TREES = 1;\n  var DYN_TREES = 2;\n  /* The three kinds of block type */\n\n  var MIN_MATCH$1 = 3;\n  var MAX_MATCH$1 = 258;\n  /* The minimum and maximum match lengths */\n  // From deflate.h\n\n  /* ===========================================================================\n   * Internal compression state.\n   */\n\n  var LENGTH_CODES$1 = 29;\n  /* number of length codes, not counting the special END_BLOCK code */\n\n  var LITERALS$1 = 256;\n  /* number of literal bytes 0..255 */\n\n  var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;\n  /* number of Literal or Length codes, including the END_BLOCK code */\n\n  var D_CODES$1 = 30;\n  /* number of distance codes */\n\n  var BL_CODES$1 = 19;\n  /* number of codes used to transfer the bit lengths */\n\n  var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;\n  /* maximum heap size */\n\n  var MAX_BITS$1 = 15;\n  /* All codes must not exceed MAX_BITS bits */\n\n  var Buf_size = 16;\n  /* size of bit buffer in bi_buf */\n\n  /* ===========================================================================\n   * Constants\n   */\n\n  var MAX_BL_BITS = 7;\n  /* Bit length codes must not exceed MAX_BL_BITS bits */\n\n  var END_BLOCK = 256;\n  /* end of block literal code */\n\n  var REP_3_6 = 16;\n  /* repeat previous bit length 3-6 times (2 bits of repeat count) */\n\n  var REPZ_3_10 = 17;\n  /* repeat a zero length 3-10 times  (3 bits of repeat count) */\n\n  var REPZ_11_138 = 18;\n  /* repeat a zero length 11-138 times  (7 bits of repeat count) */\n\n  /* eslint-disable comma-spacing,array-bracket-spacing */\n\n  var extra_lbits =\n  /* extra bits for each length code */\n  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]);\n  var extra_dbits =\n  /* extra bits for each distance code */\n  new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]);\n  var extra_blbits =\n  /* extra bits for each bit length code */\n  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]);\n  var bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);\n  /* eslint-enable comma-spacing,array-bracket-spacing */\n\n  /* The lengths of the bit length codes are sent in order of decreasing\n   * probability, to avoid transmitting the lengths for unused bit length codes.\n   */\n\n  /* ===========================================================================\n   * Local data. These are initialized only once.\n   */\n  // We pre-fill arrays with 0 to avoid uninitialized gaps\n\n  var DIST_CODE_LEN = 512;\n  /* see definition of array dist_code below */\n  // !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1\n\n  var static_ltree = new Array((L_CODES$1 + 2) * 2);\n  zero$1(static_ltree);\n  /* The static literal tree. Since the bit lengths are imposed, there is no\n   * need for the L_CODES extra codes used during heap construction. However\n   * The codes 286 and 287 are needed to build a canonical tree (see _tr_init\n   * below).\n   */\n\n  var static_dtree = new Array(D_CODES$1 * 2);\n  zero$1(static_dtree);\n  /* The static distance tree. (Actually a trivial tree since all codes use\n   * 5 bits.)\n   */\n\n  var _dist_code = new Array(DIST_CODE_LEN);\n\n  zero$1(_dist_code);\n  /* Distance codes. The first 256 values correspond to the distances\n   * 3 .. 258, the last 256 values correspond to the top 8 bits of\n   * the 15 bit distances.\n   */\n\n  var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);\n\n  zero$1(_length_code);\n  /* length code for each normalized match length (0 == MIN_MATCH) */\n\n  var base_length = new Array(LENGTH_CODES$1);\n  zero$1(base_length);\n  /* First normalized length for each code (0 = MIN_MATCH) */\n\n  var base_dist = new Array(D_CODES$1);\n  zero$1(base_dist);\n  /* First normalized distance for each code (0 = distance of 1) */\n\n  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {\n    this.static_tree = static_tree;\n    /* static tree or NULL */\n\n    this.extra_bits = extra_bits;\n    /* extra bits for each code or NULL */\n\n    this.extra_base = extra_base;\n    /* base index for extra_bits */\n\n    this.elems = elems;\n    /* max number of elements in the tree */\n\n    this.max_length = max_length;\n    /* max bit length for the codes */\n    // show if `static_tree` has data or dummy - needed for monomorphic objects\n\n    this.has_stree = static_tree && static_tree.length;\n  }\n\n  var static_l_desc;\n  var static_d_desc;\n  var static_bl_desc;\n\n  function TreeDesc(dyn_tree, stat_desc) {\n    this.dyn_tree = dyn_tree;\n    /* the dynamic tree */\n\n    this.max_code = 0;\n    /* largest code with non zero frequency */\n\n    this.stat_desc = stat_desc;\n    /* the corresponding static tree */\n  }\n\n  var d_code = function d_code(dist) {\n    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];\n  };\n  /* ===========================================================================\n   * Output a short LSB first on the stream.\n   * IN assertion: there is enough room in pendingBuf.\n   */\n\n\n  var put_short = function put_short(s, w) {\n    //    put_byte(s, (uch)((w) & 0xff));\n    //    put_byte(s, (uch)((ush)(w) >> 8));\n    s.pending_buf[s.pending++] = w & 0xff;\n    s.pending_buf[s.pending++] = w >>> 8 & 0xff;\n  };\n  /* ===========================================================================\n   * Send a value on a given number of bits.\n   * IN assertion: length <= 16 and value fits in length bits.\n   */\n\n\n  var send_bits = function send_bits(s, value, length) {\n    if (s.bi_valid > Buf_size - length) {\n      s.bi_buf |= value << s.bi_valid & 0xffff;\n      put_short(s, s.bi_buf);\n      s.bi_buf = value >> Buf_size - s.bi_valid;\n      s.bi_valid += length - Buf_size;\n    } else {\n      s.bi_buf |= value << s.bi_valid & 0xffff;\n      s.bi_valid += length;\n    }\n  };\n\n  var send_code = function send_code(s, c, tree) {\n    send_bits(s, tree[c * 2]\n    /*.Code*/\n    , tree[c * 2 + 1]\n    /*.Len*/\n    );\n  };\n  /* ===========================================================================\n   * Reverse the first len bits of a code, using straightforward code (a faster\n   * method would use a table)\n   * IN assertion: 1 <= len <= 15\n   */\n\n\n  var bi_reverse = function bi_reverse(code, len) {\n    var res = 0;\n\n    do {\n      res |= code & 1;\n      code >>>= 1;\n      res <<= 1;\n    } while (--len > 0);\n\n    return res >>> 1;\n  };\n  /* ===========================================================================\n   * Flush the bit buffer, keeping at most 7 bits in it.\n   */\n\n\n  var bi_flush = function bi_flush(s) {\n    if (s.bi_valid === 16) {\n      put_short(s, s.bi_buf);\n      s.bi_buf = 0;\n      s.bi_valid = 0;\n    } else if (s.bi_valid >= 8) {\n      s.pending_buf[s.pending++] = s.bi_buf & 0xff;\n      s.bi_buf >>= 8;\n      s.bi_valid -= 8;\n    }\n  };\n  /* ===========================================================================\n   * Compute the optimal bit lengths for a tree and update the total bit length\n   * for the current block.\n   * IN assertion: the fields freq and dad are set, heap[heap_max] and\n   *    above are the tree nodes sorted by increasing frequency.\n   * OUT assertions: the field len is set to the optimal bit length, the\n   *     array bl_count contains the frequencies for each bit length.\n   *     The length opt_len is updated; static_len is also updated if stree is\n   *     not null.\n   */\n\n\n  var gen_bitlen = function gen_bitlen(s, desc) //    deflate_state *s;\n  //    tree_desc *desc;    /* the tree descriptor */\n  {\n    var tree = desc.dyn_tree;\n    var max_code = desc.max_code;\n    var stree = desc.stat_desc.static_tree;\n    var has_stree = desc.stat_desc.has_stree;\n    var extra = desc.stat_desc.extra_bits;\n    var base = desc.stat_desc.extra_base;\n    var max_length = desc.stat_desc.max_length;\n    var h;\n    /* heap index */\n\n    var n, m;\n    /* iterate over the tree elements */\n\n    var bits;\n    /* bit length */\n\n    var xbits;\n    /* extra bits */\n\n    var f;\n    /* frequency */\n\n    var overflow = 0;\n    /* number of elements with bit length too large */\n\n    for (bits = 0; bits <= MAX_BITS$1; bits++) {\n      s.bl_count[bits] = 0;\n    }\n    /* In a first pass, compute the optimal bit lengths (which may\n     * overflow in the case of the bit length tree).\n     */\n\n\n    tree[s.heap[s.heap_max] * 2 + 1]\n    /*.Len*/\n    = 0;\n    /* root of the heap */\n\n    for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {\n      n = s.heap[h];\n      bits = tree[tree[n * 2 + 1]\n      /*.Dad*/\n      * 2 + 1]\n      /*.Len*/\n      + 1;\n\n      if (bits > max_length) {\n        bits = max_length;\n        overflow++;\n      }\n\n      tree[n * 2 + 1]\n      /*.Len*/\n      = bits;\n      /* We overwrite tree[n].Dad which is no longer needed */\n\n      if (n > max_code) {\n        continue;\n      }\n      /* not a leaf node */\n\n\n      s.bl_count[bits]++;\n      xbits = 0;\n\n      if (n >= base) {\n        xbits = extra[n - base];\n      }\n\n      f = tree[n * 2]\n      /*.Freq*/\n      ;\n      s.opt_len += f * (bits + xbits);\n\n      if (has_stree) {\n        s.static_len += f * (stree[n * 2 + 1]\n        /*.Len*/\n        + xbits);\n      }\n    }\n\n    if (overflow === 0) {\n      return;\n    } // Trace((stderr,\"\\nbit length overflow\\n\"));\n\n    /* This happens for example on obj2 and pic of the Calgary corpus */\n\n    /* Find the first bit length which could increase: */\n\n\n    do {\n      bits = max_length - 1;\n\n      while (s.bl_count[bits] === 0) {\n        bits--;\n      }\n\n      s.bl_count[bits]--;\n      /* move one leaf down the tree */\n\n      s.bl_count[bits + 1] += 2;\n      /* move one overflow item as its brother */\n\n      s.bl_count[max_length]--;\n      /* The brother of the overflow item also moves one step up,\n       * but this does not affect bl_count[max_length]\n       */\n\n      overflow -= 2;\n    } while (overflow > 0);\n    /* Now recompute all bit lengths, scanning in increasing frequency.\n     * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all\n     * lengths instead of fixing only the wrong ones. This idea is taken\n     * from 'ar' written by Haruhiko Okumura.)\n     */\n\n\n    for (bits = max_length; bits !== 0; bits--) {\n      n = s.bl_count[bits];\n\n      while (n !== 0) {\n        m = s.heap[--h];\n\n        if (m > max_code) {\n          continue;\n        }\n\n        if (tree[m * 2 + 1]\n        /*.Len*/\n        !== bits) {\n          // Trace((stderr,\"code %d bits %d->%d\\n\", m, tree[m].Len, bits));\n          s.opt_len += (bits - tree[m * 2 + 1]\n          /*.Len*/\n          ) * tree[m * 2]\n          /*.Freq*/\n          ;\n          tree[m * 2 + 1]\n          /*.Len*/\n          = bits;\n        }\n\n        n--;\n      }\n    }\n  };\n  /* ===========================================================================\n   * Generate the codes for a given tree and bit counts (which need not be\n   * optimal).\n   * IN assertion: the array bl_count contains the bit length statistics for\n   * the given tree and the field len is set for all tree elements.\n   * OUT assertion: the field code is set for all tree elements of non\n   *     zero code length.\n   */\n\n\n  var gen_codes = function gen_codes(tree, max_code, bl_count) //    ct_data *tree;             /* the tree to decorate */\n  //    int max_code;              /* largest code with non zero frequency */\n  //    ushf *bl_count;            /* number of codes at each bit length */\n  {\n    var next_code = new Array(MAX_BITS$1 + 1);\n    /* next code value for each bit length */\n\n    var code = 0;\n    /* running code value */\n\n    var bits;\n    /* bit index */\n\n    var n;\n    /* code index */\n\n    /* The distribution counts are first used to generate the code values\n     * without bit reversal.\n     */\n\n    for (bits = 1; bits <= MAX_BITS$1; bits++) {\n      next_code[bits] = code = code + bl_count[bits - 1] << 1;\n    }\n    /* Check that the bit counts in bl_count are consistent. The last code\n     * must be all ones.\n     */\n    //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,\n    //        \"inconsistent bit counts\");\n    //Tracev((stderr,\"\\ngen_codes: max_code %d \", max_code));\n\n\n    for (n = 0; n <= max_code; n++) {\n      var len = tree[n * 2 + 1]\n      /*.Len*/\n      ;\n\n      if (len === 0) {\n        continue;\n      }\n      /* Now reverse the bits */\n\n\n      tree[n * 2]\n      /*.Code*/\n      = bi_reverse(next_code[len]++, len); //Tracecv(tree != static_ltree, (stderr,\"\\nn %3d %c l %2d c %4x (%x) \",\n      //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));\n    }\n  };\n  /* ===========================================================================\n   * Initialize the various 'constant' tables.\n   */\n\n\n  var tr_static_init = function tr_static_init() {\n    var n;\n    /* iterates over tree elements */\n\n    var bits;\n    /* bit counter */\n\n    var length;\n    /* length value */\n\n    var code;\n    /* code value */\n\n    var dist;\n    /* distance index */\n\n    var bl_count = new Array(MAX_BITS$1 + 1);\n    /* number of codes at each bit length for an optimal tree */\n    // do check in _tr_init()\n    //if (static_init_done) return;\n\n    /* For some embedded targets, global variables are not initialized: */\n\n    /*#ifdef NO_INIT_GLOBAL_POINTERS\n      static_l_desc.static_tree = static_ltree;\n      static_l_desc.extra_bits = extra_lbits;\n      static_d_desc.static_tree = static_dtree;\n      static_d_desc.extra_bits = extra_dbits;\n      static_bl_desc.extra_bits = extra_blbits;\n    #endif*/\n\n    /* Initialize the mapping length (0..255) -> length code (0..28) */\n\n    length = 0;\n\n    for (code = 0; code < LENGTH_CODES$1 - 1; code++) {\n      base_length[code] = length;\n\n      for (n = 0; n < 1 << extra_lbits[code]; n++) {\n        _length_code[length++] = code;\n      }\n    } //Assert (length == 256, \"tr_static_init: length != 256\");\n\n    /* Note that the length 255 (match length 258) can be represented\n     * in two different ways: code 284 + 5 bits or code 285, so we\n     * overwrite length_code[255] to use the best encoding:\n     */\n\n\n    _length_code[length - 1] = code;\n    /* Initialize the mapping dist (0..32K) -> dist code (0..29) */\n\n    dist = 0;\n\n    for (code = 0; code < 16; code++) {\n      base_dist[code] = dist;\n\n      for (n = 0; n < 1 << extra_dbits[code]; n++) {\n        _dist_code[dist++] = code;\n      }\n    } //Assert (dist == 256, \"tr_static_init: dist != 256\");\n\n\n    dist >>= 7;\n    /* from now on, all distances are divided by 128 */\n\n    for (; code < D_CODES$1; code++) {\n      base_dist[code] = dist << 7;\n\n      for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {\n        _dist_code[256 + dist++] = code;\n      }\n    } //Assert (dist == 256, \"tr_static_init: 256+dist != 512\");\n\n    /* Construct the codes of the static literal tree */\n\n\n    for (bits = 0; bits <= MAX_BITS$1; bits++) {\n      bl_count[bits] = 0;\n    }\n\n    n = 0;\n\n    while (n <= 143) {\n      static_ltree[n * 2 + 1]\n      /*.Len*/\n      = 8;\n      n++;\n      bl_count[8]++;\n    }\n\n    while (n <= 255) {\n      static_ltree[n * 2 + 1]\n      /*.Len*/\n      = 9;\n      n++;\n      bl_count[9]++;\n    }\n\n    while (n <= 279) {\n      static_ltree[n * 2 + 1]\n      /*.Len*/\n      = 7;\n      n++;\n      bl_count[7]++;\n    }\n\n    while (n <= 287) {\n      static_ltree[n * 2 + 1]\n      /*.Len*/\n      = 8;\n      n++;\n      bl_count[8]++;\n    }\n    /* Codes 286 and 287 do not exist, but we must include them in the\n     * tree construction to get a canonical Huffman tree (longest code\n     * all ones)\n     */\n\n\n    gen_codes(static_ltree, L_CODES$1 + 1, bl_count);\n    /* The static distance tree is trivial: */\n\n    for (n = 0; n < D_CODES$1; n++) {\n      static_dtree[n * 2 + 1]\n      /*.Len*/\n      = 5;\n      static_dtree[n * 2]\n      /*.Code*/\n      = bi_reverse(n, 5);\n    } // Now data ready and we can init static trees\n\n\n    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);\n    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);\n    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS); //static_init_done = true;\n  };\n  /* ===========================================================================\n   * Initialize a new block.\n   */\n\n\n  var init_block = function init_block(s) {\n    var n;\n    /* iterates over tree elements */\n\n    /* Initialize the trees. */\n\n    for (n = 0; n < L_CODES$1; n++) {\n      s.dyn_ltree[n * 2]\n      /*.Freq*/\n      = 0;\n    }\n\n    for (n = 0; n < D_CODES$1; n++) {\n      s.dyn_dtree[n * 2]\n      /*.Freq*/\n      = 0;\n    }\n\n    for (n = 0; n < BL_CODES$1; n++) {\n      s.bl_tree[n * 2]\n      /*.Freq*/\n      = 0;\n    }\n\n    s.dyn_ltree[END_BLOCK * 2]\n    /*.Freq*/\n    = 1;\n    s.opt_len = s.static_len = 0;\n    s.last_lit = s.matches = 0;\n  };\n  /* ===========================================================================\n   * Flush the bit buffer and align the output on a byte boundary\n   */\n\n\n  var bi_windup = function bi_windup(s) {\n    if (s.bi_valid > 8) {\n      put_short(s, s.bi_buf);\n    } else if (s.bi_valid > 0) {\n      //put_byte(s, (Byte)s->bi_buf);\n      s.pending_buf[s.pending++] = s.bi_buf;\n    }\n\n    s.bi_buf = 0;\n    s.bi_valid = 0;\n  };\n  /* ===========================================================================\n   * Copy a stored block, storing first the length and its\n   * one's complement if requested.\n   */\n\n\n  var copy_block = function copy_block(s, buf, len, header) //DeflateState *s;\n  //charf    *buf;    /* the input data */\n  //unsigned len;     /* its length */\n  //int      header;  /* true if block header must be written */\n  {\n    bi_windup(s);\n    /* align on byte boundary */\n\n    if (header) {\n      put_short(s, len);\n      put_short(s, ~len);\n    } //  while (len--) {\n    //    put_byte(s, *buf++);\n    //  }\n\n\n    s.pending_buf.set(s.window.subarray(buf, buf + len), s.pending);\n    s.pending += len;\n  };\n  /* ===========================================================================\n   * Compares to subtrees, using the tree depth as tie breaker when\n   * the subtrees have equal frequency. This minimizes the worst case length.\n   */\n\n\n  var smaller = function smaller(tree, n, m, depth) {\n    var _n2 = n * 2;\n\n    var _m2 = m * 2;\n\n    return tree[_n2]\n    /*.Freq*/\n    < tree[_m2]\n    /*.Freq*/\n    || tree[_n2]\n    /*.Freq*/\n    === tree[_m2]\n    /*.Freq*/\n    && depth[n] <= depth[m];\n  };\n  /* ===========================================================================\n   * Restore the heap property by moving down the tree starting at node k,\n   * exchanging a node with the smallest of its two sons if necessary, stopping\n   * when the heap property is re-established (each father smaller than its\n   * two sons).\n   */\n\n\n  var pqdownheap = function pqdownheap(s, tree, k) //    deflate_state *s;\n  //    ct_data *tree;  /* the tree to restore */\n  //    int k;               /* node to move down */\n  {\n    var v = s.heap[k];\n    var j = k << 1;\n    /* left son of k */\n\n    while (j <= s.heap_len) {\n      /* Set j to the smallest of the two sons: */\n      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {\n        j++;\n      }\n      /* Exit if v is smaller than both sons */\n\n\n      if (smaller(tree, v, s.heap[j], s.depth)) {\n        break;\n      }\n      /* Exchange v with the smallest son */\n\n\n      s.heap[k] = s.heap[j];\n      k = j;\n      /* And continue down the tree, setting j to the left son of k */\n\n      j <<= 1;\n    }\n\n    s.heap[k] = v;\n  }; // inlined manually\n  // const SMALLEST = 1;\n\n  /* ===========================================================================\n   * Send the block data compressed using the given Huffman trees\n   */\n\n\n  var compress_block = function compress_block(s, ltree, dtree) //    deflate_state *s;\n  //    const ct_data *ltree; /* literal tree */\n  //    const ct_data *dtree; /* distance tree */\n  {\n    var dist;\n    /* distance of matched string */\n\n    var lc;\n    /* match length or unmatched char (if dist == 0) */\n\n    var lx = 0;\n    /* running index in l_buf */\n\n    var code;\n    /* the code to send */\n\n    var extra;\n    /* number of extra bits to send */\n\n    if (s.last_lit !== 0) {\n      do {\n        dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];\n        lc = s.pending_buf[s.l_buf + lx];\n        lx++;\n\n        if (dist === 0) {\n          send_code(s, lc, ltree);\n          /* send a literal byte */\n          //Tracecv(isgraph(lc), (stderr,\" '%c' \", lc));\n        } else {\n          /* Here, lc is the match length - MIN_MATCH */\n          code = _length_code[lc];\n          send_code(s, code + LITERALS$1 + 1, ltree);\n          /* send the length code */\n\n          extra = extra_lbits[code];\n\n          if (extra !== 0) {\n            lc -= base_length[code];\n            send_bits(s, lc, extra);\n            /* send the extra length bits */\n          }\n\n          dist--;\n          /* dist is now the match distance - 1 */\n\n          code = d_code(dist); //Assert (code < D_CODES, \"bad d_code\");\n\n          send_code(s, code, dtree);\n          /* send the distance code */\n\n          extra = extra_dbits[code];\n\n          if (extra !== 0) {\n            dist -= base_dist[code];\n            send_bits(s, dist, extra);\n            /* send the extra distance bits */\n          }\n        }\n        /* literal or match pair ? */\n\n        /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */\n        //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,\n        //       \"pendingBuf overflow\");\n\n      } while (lx < s.last_lit);\n    }\n\n    send_code(s, END_BLOCK, ltree);\n  };\n  /* ===========================================================================\n   * Construct one Huffman tree and assigns the code bit strings and lengths.\n   * Update the total bit length for the current block.\n   * IN assertion: the field freq is set for all tree elements.\n   * OUT assertions: the fields len and code are set to the optimal bit length\n   *     and corresponding code. The length opt_len is updated; static_len is\n   *     also updated if stree is not null. The field max_code is set.\n   */\n\n\n  var build_tree = function build_tree(s, desc) //    deflate_state *s;\n  //    tree_desc *desc; /* the tree descriptor */\n  {\n    var tree = desc.dyn_tree;\n    var stree = desc.stat_desc.static_tree;\n    var has_stree = desc.stat_desc.has_stree;\n    var elems = desc.stat_desc.elems;\n    var n, m;\n    /* iterate over heap elements */\n\n    var max_code = -1;\n    /* largest code with non zero frequency */\n\n    var node;\n    /* new node being created */\n\n    /* Construct the initial heap, with least frequent element in\n     * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].\n     * heap[0] is not used.\n     */\n\n    s.heap_len = 0;\n    s.heap_max = HEAP_SIZE$1;\n\n    for (n = 0; n < elems; n++) {\n      if (tree[n * 2]\n      /*.Freq*/\n      !== 0) {\n        s.heap[++s.heap_len] = max_code = n;\n        s.depth[n] = 0;\n      } else {\n        tree[n * 2 + 1]\n        /*.Len*/\n        = 0;\n      }\n    }\n    /* The pkzip format requires that at least one distance code exists,\n     * and that at least one bit should be sent even if there is only one\n     * possible code. So to avoid special checks later on we force at least\n     * two codes of non zero frequency.\n     */\n\n\n    while (s.heap_len < 2) {\n      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;\n      tree[node * 2]\n      /*.Freq*/\n      = 1;\n      s.depth[node] = 0;\n      s.opt_len--;\n\n      if (has_stree) {\n        s.static_len -= stree[node * 2 + 1]\n        /*.Len*/\n        ;\n      }\n      /* node is 0 or 1 so it does not have extra bits */\n\n    }\n\n    desc.max_code = max_code;\n    /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,\n     * establish sub-heaps of increasing lengths:\n     */\n\n    for (n = s.heap_len >> 1\n    /*int /2*/\n    ; n >= 1; n--) {\n      pqdownheap(s, tree, n);\n    }\n    /* Construct the Huffman tree by repeatedly combining the least two\n     * frequent nodes.\n     */\n\n\n    node = elems;\n    /* next internal node of the tree */\n\n    do {\n      //pqremove(s, tree, n);  /* n = node of least frequency */\n\n      /*** pqremove ***/\n      n = s.heap[1\n      /*SMALLEST*/\n      ];\n      s.heap[1\n      /*SMALLEST*/\n      ] = s.heap[s.heap_len--];\n      pqdownheap(s, tree, 1\n      /*SMALLEST*/\n      );\n      /***/\n\n      m = s.heap[1\n      /*SMALLEST*/\n      ];\n      /* m = node of next least frequency */\n\n      s.heap[--s.heap_max] = n;\n      /* keep the nodes sorted by frequency */\n\n      s.heap[--s.heap_max] = m;\n      /* Create a new node father of n and m */\n\n      tree[node * 2]\n      /*.Freq*/\n      = tree[n * 2]\n      /*.Freq*/\n      + tree[m * 2]\n      /*.Freq*/\n      ;\n      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;\n      tree[n * 2 + 1]\n      /*.Dad*/\n      = tree[m * 2 + 1]\n      /*.Dad*/\n      = node;\n      /* and insert the new node in the heap */\n\n      s.heap[1\n      /*SMALLEST*/\n      ] = node++;\n      pqdownheap(s, tree, 1\n      /*SMALLEST*/\n      );\n    } while (s.heap_len >= 2);\n\n    s.heap[--s.heap_max] = s.heap[1\n    /*SMALLEST*/\n    ];\n    /* At this point, the fields freq and dad are set. We can now\n     * generate the bit lengths.\n     */\n\n    gen_bitlen(s, desc);\n    /* The field len is now set, we can generate the bit codes */\n\n    gen_codes(tree, max_code, s.bl_count);\n  };\n  /* ===========================================================================\n   * Scan a literal or distance tree to determine the frequencies of the codes\n   * in the bit length tree.\n   */\n\n\n  var scan_tree = function scan_tree(s, tree, max_code) //    deflate_state *s;\n  //    ct_data *tree;   /* the tree to be scanned */\n  //    int max_code;    /* and its largest code of non zero frequency */\n  {\n    var n;\n    /* iterates over all tree elements */\n\n    var prevlen = -1;\n    /* last emitted length */\n\n    var curlen;\n    /* length of current code */\n\n    var nextlen = tree[0 * 2 + 1]\n    /*.Len*/\n    ;\n    /* length of next code */\n\n    var count = 0;\n    /* repeat count of the current code */\n\n    var max_count = 7;\n    /* max repeat count */\n\n    var min_count = 4;\n    /* min repeat count */\n\n    if (nextlen === 0) {\n      max_count = 138;\n      min_count = 3;\n    }\n\n    tree[(max_code + 1) * 2 + 1]\n    /*.Len*/\n    = 0xffff;\n    /* guard */\n\n    for (n = 0; n <= max_code; n++) {\n      curlen = nextlen;\n      nextlen = tree[(n + 1) * 2 + 1]\n      /*.Len*/\n      ;\n\n      if (++count < max_count && curlen === nextlen) {\n        continue;\n      } else if (count < min_count) {\n        s.bl_tree[curlen * 2]\n        /*.Freq*/\n        += count;\n      } else if (curlen !== 0) {\n        if (curlen !== prevlen) {\n          s.bl_tree[curlen * 2] /*.Freq*/++;\n        }\n\n        s.bl_tree[REP_3_6 * 2] /*.Freq*/++;\n      } else if (count <= 10) {\n        s.bl_tree[REPZ_3_10 * 2] /*.Freq*/++;\n      } else {\n        s.bl_tree[REPZ_11_138 * 2] /*.Freq*/++;\n      }\n\n      count = 0;\n      prevlen = curlen;\n\n      if (nextlen === 0) {\n        max_count = 138;\n        min_count = 3;\n      } else if (curlen === nextlen) {\n        max_count = 6;\n        min_count = 3;\n      } else {\n        max_count = 7;\n        min_count = 4;\n      }\n    }\n  };\n  /* ===========================================================================\n   * Send a literal or distance tree in compressed form, using the codes in\n   * bl_tree.\n   */\n\n\n  var send_tree = function send_tree(s, tree, max_code) //    deflate_state *s;\n  //    ct_data *tree; /* the tree to be scanned */\n  //    int max_code;       /* and its largest code of non zero frequency */\n  {\n    var n;\n    /* iterates over all tree elements */\n\n    var prevlen = -1;\n    /* last emitted length */\n\n    var curlen;\n    /* length of current code */\n\n    var nextlen = tree[0 * 2 + 1]\n    /*.Len*/\n    ;\n    /* length of next code */\n\n    var count = 0;\n    /* repeat count of the current code */\n\n    var max_count = 7;\n    /* max repeat count */\n\n    var min_count = 4;\n    /* min repeat count */\n\n    /* tree[max_code+1].Len = -1; */\n\n    /* guard already set */\n\n    if (nextlen === 0) {\n      max_count = 138;\n      min_count = 3;\n    }\n\n    for (n = 0; n <= max_code; n++) {\n      curlen = nextlen;\n      nextlen = tree[(n + 1) * 2 + 1]\n      /*.Len*/\n      ;\n\n      if (++count < max_count && curlen === nextlen) {\n        continue;\n      } else if (count < min_count) {\n        do {\n          send_code(s, curlen, s.bl_tree);\n        } while (--count !== 0);\n      } else if (curlen !== 0) {\n        if (curlen !== prevlen) {\n          send_code(s, curlen, s.bl_tree);\n          count--;\n        } //Assert(count >= 3 && count <= 6, \" 3_6?\");\n\n\n        send_code(s, REP_3_6, s.bl_tree);\n        send_bits(s, count - 3, 2);\n      } else if (count <= 10) {\n        send_code(s, REPZ_3_10, s.bl_tree);\n        send_bits(s, count - 3, 3);\n      } else {\n        send_code(s, REPZ_11_138, s.bl_tree);\n        send_bits(s, count - 11, 7);\n      }\n\n      count = 0;\n      prevlen = curlen;\n\n      if (nextlen === 0) {\n        max_count = 138;\n        min_count = 3;\n      } else if (curlen === nextlen) {\n        max_count = 6;\n        min_count = 3;\n      } else {\n        max_count = 7;\n        min_count = 4;\n      }\n    }\n  };\n  /* ===========================================================================\n   * Construct the Huffman tree for the bit lengths and return the index in\n   * bl_order of the last bit length code to send.\n   */\n\n\n  var build_bl_tree = function build_bl_tree(s) {\n    var max_blindex;\n    /* index of last bit length code of non zero freq */\n\n    /* Determine the bit length frequencies for literal and distance trees */\n\n    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);\n    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);\n    /* Build the bit length tree: */\n\n    build_tree(s, s.bl_desc);\n    /* opt_len now includes the length of the tree representations, except\n     * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.\n     */\n\n    /* Determine the number of bit length codes to send. The pkzip format\n     * requires that at least 4 bit length codes be sent. (appnote.txt says\n     * 3 but the actual value used is 4.)\n     */\n\n    for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {\n      if (s.bl_tree[bl_order[max_blindex] * 2 + 1]\n      /*.Len*/\n      !== 0) {\n        break;\n      }\n    }\n    /* Update opt_len to include the bit length tree and counts */\n\n\n    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4; //Tracev((stderr, \"\\ndyn trees: dyn %ld, stat %ld\",\n    //        s->opt_len, s->static_len));\n\n    return max_blindex;\n  };\n  /* ===========================================================================\n   * Send the header for a block using dynamic Huffman trees: the counts, the\n   * lengths of the bit length codes, the literal tree and the distance tree.\n   * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.\n   */\n\n\n  var send_all_trees = function send_all_trees(s, lcodes, dcodes, blcodes) //    deflate_state *s;\n  //    int lcodes, dcodes, blcodes; /* number of codes for each tree */\n  {\n    var rank;\n    /* index in bl_order */\n    //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, \"not enough codes\");\n    //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,\n    //        \"too many codes\");\n    //Tracev((stderr, \"\\nbl counts: \"));\n\n    send_bits(s, lcodes - 257, 5);\n    /* not +255 as stated in appnote.txt */\n\n    send_bits(s, dcodes - 1, 5);\n    send_bits(s, blcodes - 4, 4);\n    /* not -3 as stated in appnote.txt */\n\n    for (rank = 0; rank < blcodes; rank++) {\n      //Tracev((stderr, \"\\nbl code %2d \", bl_order[rank]));\n      send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]\n      /*.Len*/\n      , 3);\n    } //Tracev((stderr, \"\\nbl tree: sent %ld\", s->bits_sent));\n\n\n    send_tree(s, s.dyn_ltree, lcodes - 1);\n    /* literal tree */\n    //Tracev((stderr, \"\\nlit tree: sent %ld\", s->bits_sent));\n\n    send_tree(s, s.dyn_dtree, dcodes - 1);\n    /* distance tree */\n    //Tracev((stderr, \"\\ndist tree: sent %ld\", s->bits_sent));\n  };\n  /* ===========================================================================\n   * Check if the data type is TEXT or BINARY, using the following algorithm:\n   * - TEXT if the two conditions below are satisfied:\n   *    a) There are no non-portable control characters belonging to the\n   *       \"black list\" (0..6, 14..25, 28..31).\n   *    b) There is at least one printable character belonging to the\n   *       \"white list\" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).\n   * - BINARY otherwise.\n   * - The following partially-portable control characters form a\n   *   \"gray list\" that is ignored in this detection algorithm:\n   *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).\n   * IN assertion: the fields Freq of dyn_ltree are set.\n   */\n\n\n  var detect_data_type = function detect_data_type(s) {\n    /* black_mask is the bit mask of black-listed bytes\n     * set bits 0..6, 14..25, and 28..31\n     * 0xf3ffc07f = binary 11110011111111111100000001111111\n     */\n    var black_mask = 0xf3ffc07f;\n    var n;\n    /* Check for non-textual (\"black-listed\") bytes. */\n\n    for (n = 0; n <= 31; n++, black_mask >>>= 1) {\n      if (black_mask & 1 && s.dyn_ltree[n * 2]\n      /*.Freq*/\n      !== 0) {\n        return Z_BINARY;\n      }\n    }\n    /* Check for textual (\"white-listed\") bytes. */\n\n\n    if (s.dyn_ltree[9 * 2]\n    /*.Freq*/\n    !== 0 || s.dyn_ltree[10 * 2]\n    /*.Freq*/\n    !== 0 || s.dyn_ltree[13 * 2]\n    /*.Freq*/\n    !== 0) {\n      return Z_TEXT;\n    }\n\n    for (n = 32; n < LITERALS$1; n++) {\n      if (s.dyn_ltree[n * 2]\n      /*.Freq*/\n      !== 0) {\n        return Z_TEXT;\n      }\n    }\n    /* There are no \"black-listed\" or \"white-listed\" bytes:\n     * this stream either is empty or has tolerated (\"gray-listed\") bytes only.\n     */\n\n\n    return Z_BINARY;\n  };\n\n  var static_init_done = false;\n  /* ===========================================================================\n   * Initialize the tree data structures for a new zlib stream.\n   */\n\n  var _tr_init$1 = function _tr_init(s) {\n    if (!static_init_done) {\n      tr_static_init();\n      static_init_done = true;\n    }\n\n    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);\n    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);\n    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);\n    s.bi_buf = 0;\n    s.bi_valid = 0;\n    /* Initialize the first block of the first file: */\n\n    init_block(s);\n  };\n  /* ===========================================================================\n   * Send a stored block\n   */\n\n\n  var _tr_stored_block$1 = function _tr_stored_block(s, buf, stored_len, last) //DeflateState *s;\n  //charf *buf;       /* input block */\n  //ulg stored_len;   /* length of input block */\n  //int last;         /* one if this is the last block for a file */\n  {\n    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);\n    /* send block type */\n\n    copy_block(s, buf, stored_len, true);\n    /* with header */\n  };\n  /* ===========================================================================\n   * Send one empty static block to give enough lookahead for inflate.\n   * This takes 10 bits, of which 7 may remain in the bit buffer.\n   */\n\n\n  var _tr_align$1 = function _tr_align(s) {\n    send_bits(s, STATIC_TREES << 1, 3);\n    send_code(s, END_BLOCK, static_ltree);\n    bi_flush(s);\n  };\n  /* ===========================================================================\n   * Determine the best encoding for the current block: dynamic trees, static\n   * trees or store, and output the encoded block to the zip file.\n   */\n\n\n  var _tr_flush_block$1 = function _tr_flush_block(s, buf, stored_len, last) //DeflateState *s;\n  //charf *buf;       /* input block, or NULL if too old */\n  //ulg stored_len;   /* length of input block */\n  //int last;         /* one if this is the last block for a file */\n  {\n    var opt_lenb, static_lenb;\n    /* opt_len and static_len in bytes */\n\n    var max_blindex = 0;\n    /* index of last bit length code of non zero freq */\n\n    /* Build the Huffman trees unless a stored block is forced */\n\n    if (s.level > 0) {\n      /* Check if the file is binary or text */\n      if (s.strm.data_type === Z_UNKNOWN$1) {\n        s.strm.data_type = detect_data_type(s);\n      }\n      /* Construct the literal and distance trees */\n\n\n      build_tree(s, s.l_desc); // Tracev((stderr, \"\\nlit data: dyn %ld, stat %ld\", s->opt_len,\n      //        s->static_len));\n\n      build_tree(s, s.d_desc); // Tracev((stderr, \"\\ndist data: dyn %ld, stat %ld\", s->opt_len,\n      //        s->static_len));\n\n      /* At this point, opt_len and static_len are the total bit lengths of\n       * the compressed block data, excluding the tree representations.\n       */\n\n      /* Build the bit length tree for the above two trees, and get the index\n       * in bl_order of the last bit length code to send.\n       */\n\n      max_blindex = build_bl_tree(s);\n      /* Determine the best encoding. Compute the block lengths in bytes. */\n\n      opt_lenb = s.opt_len + 3 + 7 >>> 3;\n      static_lenb = s.static_len + 3 + 7 >>> 3; // Tracev((stderr, \"\\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u \",\n      //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,\n      //        s->last_lit));\n\n      if (static_lenb <= opt_lenb) {\n        opt_lenb = static_lenb;\n      }\n    } else {\n      // Assert(buf != (char*)0, \"lost buf\");\n      opt_lenb = static_lenb = stored_len + 5;\n      /* force a stored block */\n    }\n\n    if (stored_len + 4 <= opt_lenb && buf !== -1) {\n      /* 4: two words for the lengths */\n\n      /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.\n       * Otherwise we can't have processed more than WSIZE input bytes since\n       * the last block flush, because compression would have been\n       * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to\n       * transform a block into a stored block.\n       */\n      _tr_stored_block$1(s, buf, stored_len, last);\n    } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {\n      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);\n      compress_block(s, static_ltree, static_dtree);\n    } else {\n      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);\n      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);\n      compress_block(s, s.dyn_ltree, s.dyn_dtree);\n    } // Assert (s->compressed_len == s->bits_sent, \"bad compressed size\");\n\n    /* The above check is made mod 2^32, for files larger than 512 MB\n     * and uLong implemented on 32 bits.\n     */\n\n\n    init_block(s);\n\n    if (last) {\n      bi_windup(s);\n    } // Tracev((stderr,\"\\ncomprlen %lu(%lu) \", s->compressed_len>>3,\n    //       s->compressed_len-7*last));\n\n  };\n  /* ===========================================================================\n   * Save the match info and tally the frequency counts. Return true if\n   * the current block must be flushed.\n   */\n\n\n  var _tr_tally$1 = function _tr_tally(s, dist, lc) //    deflate_state *s;\n  //    unsigned dist;  /* distance of matched string */\n  //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */\n  {\n    //let out_length, in_length, dcode;\n    s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 0xff;\n    s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;\n    s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;\n    s.last_lit++;\n\n    if (dist === 0) {\n      /* lc is the unmatched char */\n      s.dyn_ltree[lc * 2] /*.Freq*/++;\n    } else {\n      s.matches++;\n      /* Here, lc is the match length - MIN_MATCH */\n\n      dist--;\n      /* dist = match distance - 1 */\n      //Assert((ush)dist < (ush)MAX_DIST(s) &&\n      //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&\n      //       (ush)d_code(dist) < (ush)D_CODES,  \"_tr_tally: bad match\");\n\n      s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2] /*.Freq*/++;\n      s.dyn_dtree[d_code(dist) * 2] /*.Freq*/++;\n    } // (!) This block is disabled in zlib defaults,\n    // don't enable it for binary compatibility\n    //#ifdef TRUNCATE_BLOCK\n    //  /* Try to guess if it is profitable to stop the current block here */\n    //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {\n    //    /* Compute an upper bound for the compressed length */\n    //    out_length = s.last_lit*8;\n    //    in_length = s.strstart - s.block_start;\n    //\n    //    for (dcode = 0; dcode < D_CODES; dcode++) {\n    //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);\n    //    }\n    //    out_length >>>= 3;\n    //    //Tracev((stderr,\"\\nlast_lit %u, in %ld, out ~%ld(%ld%%) \",\n    //    //       s->last_lit, in_length, out_length,\n    //    //       100L - out_length*100L/in_length));\n    //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {\n    //      return true;\n    //    }\n    //  }\n    //#endif\n\n\n    return s.last_lit === s.lit_bufsize - 1;\n    /* We avoid equality with lit_bufsize because of wraparound at 64K\n     * on 16 bit machines and because stored blocks are restricted to\n     * 64K-1 bytes.\n     */\n  };\n\n  var _tr_init_1 = _tr_init$1;\n  var _tr_stored_block_1 = _tr_stored_block$1;\n  var _tr_flush_block_1 = _tr_flush_block$1;\n  var _tr_tally_1 = _tr_tally$1;\n  var _tr_align_1 = _tr_align$1;\n  var trees = {\n    _tr_init: _tr_init_1,\n    _tr_stored_block: _tr_stored_block_1,\n    _tr_flush_block: _tr_flush_block_1,\n    _tr_tally: _tr_tally_1,\n    _tr_align: _tr_align_1\n  };\n\n  // It isn't worth it to make additional optimizations as in original.\n  // Small size is preferable.\n  // (C) 1995-2013 Jean-loup Gailly and Mark Adler\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n  var adler32 = function adler32(adler, buf, len, pos) {\n    var s1 = adler & 0xffff | 0,\n        s2 = adler >>> 16 & 0xffff | 0,\n        n = 0;\n\n    while (len !== 0) {\n      // Set limit ~ twice less than 5552, to keep\n      // s2 in 31-bits, because we force signed ints.\n      // in other case %= will fail.\n      n = len > 2000 ? 2000 : len;\n      len -= n;\n\n      do {\n        s1 = s1 + buf[pos++] | 0;\n        s2 = s2 + s1 | 0;\n      } while (--n);\n\n      s1 %= 65521;\n      s2 %= 65521;\n    }\n\n    return s1 | s2 << 16 | 0;\n  };\n\n  var adler32_1 = adler32;\n\n  // So write code to minimize size - no pregenerated tables\n  // and array tools dependencies.\n  // (C) 1995-2013 Jean-loup Gailly and Mark Adler\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n  // Use ordinary array, since untyped makes no boost here\n\n  var makeTable = function makeTable() {\n    var c,\n        table = [];\n\n    for (var n = 0; n < 256; n++) {\n      c = n;\n\n      for (var k = 0; k < 8; k++) {\n        c = c & 1 ? 0xEDB88320 ^ c >>> 1 : c >>> 1;\n      }\n\n      table[n] = c;\n    }\n\n    return table;\n  }; // Create table on load. Just 255 signed longs. Not a problem.\n\n\n  var crcTable = new Uint32Array(makeTable());\n\n  var crc32 = function crc32(crc, buf, len, pos) {\n    var t = crcTable;\n    var end = pos + len;\n    crc ^= -1;\n\n    for (var i = pos; i < end; i++) {\n      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 0xFF];\n    }\n\n    return crc ^ -1; // >>> 0;\n  };\n\n  var crc32_1 = crc32;\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n  var messages = {\n    2: 'need dictionary',\n\n    /* Z_NEED_DICT       2  */\n    1: 'stream end',\n\n    /* Z_STREAM_END      1  */\n    0: '',\n\n    /* Z_OK              0  */\n    '-1': 'file error',\n\n    /* Z_ERRNO         (-1) */\n    '-2': 'stream error',\n\n    /* Z_STREAM_ERROR  (-2) */\n    '-3': 'data error',\n\n    /* Z_DATA_ERROR    (-3) */\n    '-4': 'insufficient memory',\n\n    /* Z_MEM_ERROR     (-4) */\n    '-5': 'buffer error',\n\n    /* Z_BUF_ERROR     (-5) */\n    '-6': 'incompatible version'\n    /* Z_VERSION_ERROR (-6) */\n\n  };\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n  var constants$2 = {\n    /* Allowed flush values; see deflate() and inflate() below for details */\n    Z_NO_FLUSH: 0,\n    Z_PARTIAL_FLUSH: 1,\n    Z_SYNC_FLUSH: 2,\n    Z_FULL_FLUSH: 3,\n    Z_FINISH: 4,\n    Z_BLOCK: 5,\n    Z_TREES: 6,\n\n    /* Return codes for the compression/decompression functions. Negative values\n    * are errors, positive values are used for special but normal events.\n    */\n    Z_OK: 0,\n    Z_STREAM_END: 1,\n    Z_NEED_DICT: 2,\n    Z_ERRNO: -1,\n    Z_STREAM_ERROR: -2,\n    Z_DATA_ERROR: -3,\n    Z_MEM_ERROR: -4,\n    Z_BUF_ERROR: -5,\n    //Z_VERSION_ERROR: -6,\n\n    /* compression levels */\n    Z_NO_COMPRESSION: 0,\n    Z_BEST_SPEED: 1,\n    Z_BEST_COMPRESSION: 9,\n    Z_DEFAULT_COMPRESSION: -1,\n    Z_FILTERED: 1,\n    Z_HUFFMAN_ONLY: 2,\n    Z_RLE: 3,\n    Z_FIXED: 4,\n    Z_DEFAULT_STRATEGY: 0,\n\n    /* Possible values of the data_type field (though see inflate()) */\n    Z_BINARY: 0,\n    Z_TEXT: 1,\n    //Z_ASCII:                1, // = Z_TEXT (deprecated)\n    Z_UNKNOWN: 2,\n\n    /* The deflate compression method */\n    Z_DEFLATED: 8 //Z_NULL:                 null // Use -1 or null inline, depending on var type\n\n  };\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n\n  var _tr_init = trees._tr_init,\n      _tr_stored_block = trees._tr_stored_block,\n      _tr_flush_block = trees._tr_flush_block,\n      _tr_tally = trees._tr_tally,\n      _tr_align = trees._tr_align;\n  /* Public constants ==========================================================*/\n\n  /* ===========================================================================*/\n\n  var Z_NO_FLUSH$2 = constants$2.Z_NO_FLUSH,\n      Z_PARTIAL_FLUSH = constants$2.Z_PARTIAL_FLUSH,\n      Z_FULL_FLUSH$1 = constants$2.Z_FULL_FLUSH,\n      Z_FINISH$3 = constants$2.Z_FINISH,\n      Z_BLOCK$1 = constants$2.Z_BLOCK,\n      Z_OK$3 = constants$2.Z_OK,\n      Z_STREAM_END$3 = constants$2.Z_STREAM_END,\n      Z_STREAM_ERROR$2 = constants$2.Z_STREAM_ERROR,\n      Z_DATA_ERROR$2 = constants$2.Z_DATA_ERROR,\n      Z_BUF_ERROR$1 = constants$2.Z_BUF_ERROR,\n      Z_DEFAULT_COMPRESSION$1 = constants$2.Z_DEFAULT_COMPRESSION,\n      Z_FILTERED = constants$2.Z_FILTERED,\n      Z_HUFFMAN_ONLY = constants$2.Z_HUFFMAN_ONLY,\n      Z_RLE = constants$2.Z_RLE,\n      Z_FIXED = constants$2.Z_FIXED,\n      Z_DEFAULT_STRATEGY$1 = constants$2.Z_DEFAULT_STRATEGY,\n      Z_UNKNOWN = constants$2.Z_UNKNOWN,\n      Z_DEFLATED$2 = constants$2.Z_DEFLATED;\n  /*============================================================================*/\n\n  var MAX_MEM_LEVEL = 9;\n  /* Maximum value for memLevel in deflateInit2 */\n\n  var MAX_WBITS$1 = 15;\n  /* 32K LZ77 window */\n\n  var DEF_MEM_LEVEL = 8;\n  var LENGTH_CODES = 29;\n  /* number of length codes, not counting the special END_BLOCK code */\n\n  var LITERALS = 256;\n  /* number of literal bytes 0..255 */\n\n  var L_CODES = LITERALS + 1 + LENGTH_CODES;\n  /* number of Literal or Length codes, including the END_BLOCK code */\n\n  var D_CODES = 30;\n  /* number of distance codes */\n\n  var BL_CODES = 19;\n  /* number of codes used to transfer the bit lengths */\n\n  var HEAP_SIZE = 2 * L_CODES + 1;\n  /* maximum heap size */\n\n  var MAX_BITS = 15;\n  /* All codes must not exceed MAX_BITS bits */\n\n  var MIN_MATCH = 3;\n  var MAX_MATCH = 258;\n  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;\n  var PRESET_DICT = 0x20;\n  var INIT_STATE = 42;\n  var EXTRA_STATE = 69;\n  var NAME_STATE = 73;\n  var COMMENT_STATE = 91;\n  var HCRC_STATE = 103;\n  var BUSY_STATE = 113;\n  var FINISH_STATE = 666;\n  var BS_NEED_MORE = 1;\n  /* block not completed, need more input or more output */\n\n  var BS_BLOCK_DONE = 2;\n  /* block flush performed */\n\n  var BS_FINISH_STARTED = 3;\n  /* finish started, need only more output at next deflate */\n\n  var BS_FINISH_DONE = 4;\n  /* finish done, accept no more input or output */\n\n  var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.\n\n  var err = function err(strm, errorCode) {\n    strm.msg = messages[errorCode];\n    return errorCode;\n  };\n\n  var rank = function rank(f) {\n    return (f << 1) - (f > 4 ? 9 : 0);\n  };\n\n  var zero = function zero(buf) {\n    var len = buf.length;\n\n    while (--len >= 0) {\n      buf[len] = 0;\n    }\n  };\n  /* eslint-disable new-cap */\n\n\n  var HASH_ZLIB = function HASH_ZLIB(s, prev, data) {\n    return (prev << s.hash_shift ^ data) & s.hash_mask;\n  }; // This hash causes less collisions, https://github.com/nodeca/pako/issues/135\n  // But breaks binary compatibility\n  //let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;\n\n\n  var HASH = HASH_ZLIB;\n  /* =========================================================================\n   * Flush as much pending output as possible. All deflate() output goes\n   * through this function so some applications may wish to modify it\n   * to avoid allocating a large strm->output buffer and copying into it.\n   * (See also read_buf()).\n   */\n\n  var flush_pending = function flush_pending(strm) {\n    var s = strm.state; //_tr_flush_bits(s);\n\n    var len = s.pending;\n\n    if (len > strm.avail_out) {\n      len = strm.avail_out;\n    }\n\n    if (len === 0) {\n      return;\n    }\n\n    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);\n    strm.next_out += len;\n    s.pending_out += len;\n    strm.total_out += len;\n    strm.avail_out -= len;\n    s.pending -= len;\n\n    if (s.pending === 0) {\n      s.pending_out = 0;\n    }\n  };\n\n  var flush_block_only = function flush_block_only(s, last) {\n    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);\n\n    s.block_start = s.strstart;\n    flush_pending(s.strm);\n  };\n\n  var put_byte = function put_byte(s, b) {\n    s.pending_buf[s.pending++] = b;\n  };\n  /* =========================================================================\n   * Put a short in the pending buffer. The 16-bit value is put in MSB order.\n   * IN assertion: the stream state is correct and there is enough room in\n   * pending_buf.\n   */\n\n\n  var putShortMSB = function putShortMSB(s, b) {\n    //  put_byte(s, (Byte)(b >> 8));\n    //  put_byte(s, (Byte)(b & 0xff));\n    s.pending_buf[s.pending++] = b >>> 8 & 0xff;\n    s.pending_buf[s.pending++] = b & 0xff;\n  };\n  /* ===========================================================================\n   * Read a new buffer from the current input stream, update the adler32\n   * and total number of bytes read.  All deflate() input goes through\n   * this function so some applications may wish to modify it to avoid\n   * allocating a large strm->input buffer and copying from it.\n   * (See also flush_pending()).\n   */\n\n\n  var read_buf = function read_buf(strm, buf, start, size) {\n    var len = strm.avail_in;\n\n    if (len > size) {\n      len = size;\n    }\n\n    if (len === 0) {\n      return 0;\n    }\n\n    strm.avail_in -= len; // zmemcpy(buf, strm->next_in, len);\n\n    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);\n\n    if (strm.state.wrap === 1) {\n      strm.adler = adler32_1(strm.adler, buf, len, start);\n    } else if (strm.state.wrap === 2) {\n      strm.adler = crc32_1(strm.adler, buf, len, start);\n    }\n\n    strm.next_in += len;\n    strm.total_in += len;\n    return len;\n  };\n  /* ===========================================================================\n   * Set match_start to the longest match starting at the given string and\n   * return its length. Matches shorter or equal to prev_length are discarded,\n   * in which case the result is equal to prev_length and match_start is\n   * garbage.\n   * IN assertions: cur_match is the head of the hash chain for the current\n   *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1\n   * OUT assertion: the match length is not greater than s->lookahead.\n   */\n\n\n  var longest_match = function longest_match(s, cur_match) {\n    var chain_length = s.max_chain_length;\n    /* max hash chain length */\n\n    var scan = s.strstart;\n    /* current string */\n\n    var match;\n    /* matched string */\n\n    var len;\n    /* length of current match */\n\n    var best_len = s.prev_length;\n    /* best match length so far */\n\n    var nice_match = s.nice_match;\n    /* stop if match long enough */\n\n    var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0\n    /*NIL*/\n    ;\n    var _win = s.window; // shortcut\n\n    var wmask = s.w_mask;\n    var prev = s.prev;\n    /* Stop when cur_match becomes <= limit. To simplify the code,\n     * we prevent matches with the string of window index 0.\n     */\n\n    var strend = s.strstart + MAX_MATCH;\n    var scan_end1 = _win[scan + best_len - 1];\n    var scan_end = _win[scan + best_len];\n    /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.\n     * It is easy to get rid of this optimization if necessary.\n     */\n    // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, \"Code too clever\");\n\n    /* Do not waste too much time if we already have a good match: */\n\n    if (s.prev_length >= s.good_match) {\n      chain_length >>= 2;\n    }\n    /* Do not look for matches beyond the end of the input. This is necessary\n     * to make deflate deterministic.\n     */\n\n\n    if (nice_match > s.lookahead) {\n      nice_match = s.lookahead;\n    } // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, \"need lookahead\");\n\n\n    do {\n      // Assert(cur_match < s->strstart, \"no future\");\n      match = cur_match;\n      /* Skip to next match if the match length cannot increase\n       * or if the match length is less than 2.  Note that the checks below\n       * for insufficient lookahead only occur occasionally for performance\n       * reasons.  Therefore uninitialized memory will be accessed, and\n       * conditional jumps will be made that depend on those values.\n       * However the length of the match is limited to the lookahead, so\n       * the output of deflate is not affected by the uninitialized values.\n       */\n\n      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {\n        continue;\n      }\n      /* The check at best_len-1 can be removed because it will be made\n       * again later. (This heuristic is not always a win.)\n       * It is not necessary to compare scan[2] and match[2] since they\n       * are always equal when the other bytes match, given that\n       * the hash keys are equal and that HASH_BITS >= 8.\n       */\n\n\n      scan += 2;\n      match++; // Assert(*scan == *match, \"match[2]?\");\n\n      /* We check for insufficient lookahead only every 8th comparison;\n       * the 256th check will be made at strstart+258.\n       */\n\n      do {\n        /*jshint noempty:false*/\n      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend); // Assert(scan <= s->window+(unsigned)(s->window_size-1), \"wild scan\");\n\n\n      len = MAX_MATCH - (strend - scan);\n      scan = strend - MAX_MATCH;\n\n      if (len > best_len) {\n        s.match_start = cur_match;\n        best_len = len;\n\n        if (len >= nice_match) {\n          break;\n        }\n\n        scan_end1 = _win[scan + best_len - 1];\n        scan_end = _win[scan + best_len];\n      }\n    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);\n\n    if (best_len <= s.lookahead) {\n      return best_len;\n    }\n\n    return s.lookahead;\n  };\n  /* ===========================================================================\n   * Fill the window when the lookahead becomes insufficient.\n   * Updates strstart and lookahead.\n   *\n   * IN assertion: lookahead < MIN_LOOKAHEAD\n   * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD\n   *    At least one byte has been read, or avail_in == 0; reads are\n   *    performed for at least two bytes (required for the zip translate_eol\n   *    option -- not supported here).\n   */\n\n\n  var fill_window = function fill_window(s) {\n    var _w_size = s.w_size;\n    var p, n, m, more, str; //Assert(s->lookahead < MIN_LOOKAHEAD, \"already enough lookahead\");\n\n    do {\n      more = s.window_size - s.lookahead - s.strstart; // JS ints have 32 bit, block below not needed\n\n      /* Deal with !@#$% 64K limit: */\n      //if (sizeof(int) <= 2) {\n      //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {\n      //        more = wsize;\n      //\n      //  } else if (more == (unsigned)(-1)) {\n      //        /* Very unlikely, but possible on 16 bit machine if\n      //         * strstart == 0 && lookahead == 1 (input done a byte at time)\n      //         */\n      //        more--;\n      //    }\n      //}\n\n      /* If the window is almost full and there is insufficient lookahead,\n       * move the upper half to the lower one to make room in the upper half.\n       */\n\n      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {\n        s.window.set(s.window.subarray(_w_size, _w_size + _w_size), 0);\n        s.match_start -= _w_size;\n        s.strstart -= _w_size;\n        /* we now have strstart >= MAX_DIST */\n\n        s.block_start -= _w_size;\n        /* Slide the hash table (could be avoided with 32 bit values\n         at the expense of memory usage). We slide even when level == 0\n         to keep the hash table consistent if we switch back to level > 0\n         later. (Using level 0 permanently is not an optimal usage of\n         zlib, so we don't care about this pathological case.)\n         */\n\n        n = s.hash_size;\n        p = n;\n\n        do {\n          m = s.head[--p];\n          s.head[p] = m >= _w_size ? m - _w_size : 0;\n        } while (--n);\n\n        n = _w_size;\n        p = n;\n\n        do {\n          m = s.prev[--p];\n          s.prev[p] = m >= _w_size ? m - _w_size : 0;\n          /* If n is not on any hash chain, prev[n] is garbage but\n           * its value will never be used.\n           */\n        } while (--n);\n\n        more += _w_size;\n      }\n\n      if (s.strm.avail_in === 0) {\n        break;\n      }\n      /* If there was no sliding:\n       *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&\n       *    more == window_size - lookahead - strstart\n       * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)\n       * => more >= window_size - 2*WSIZE + 2\n       * In the BIG_MEM or MMAP case (not yet supported),\n       *   window_size == input_size + MIN_LOOKAHEAD  &&\n       *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.\n       * Otherwise, window_size == 2*WSIZE so more >= 2.\n       * If there was sliding, more >= WSIZE. So in all cases, more >= 2.\n       */\n      //Assert(more >= 2, \"more < 2\");\n\n\n      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);\n      s.lookahead += n;\n      /* Initialize the hash value now that we have some input: */\n\n      if (s.lookahead + s.insert >= MIN_MATCH) {\n        str = s.strstart - s.insert;\n        s.ins_h = s.window[str];\n        /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */\n\n        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]); //#if MIN_MATCH != 3\n        //        Call update_hash() MIN_MATCH-3 more times\n        //#endif\n\n        while (s.insert) {\n          /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */\n          s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);\n          s.prev[str & s.w_mask] = s.head[s.ins_h];\n          s.head[s.ins_h] = str;\n          str++;\n          s.insert--;\n\n          if (s.lookahead + s.insert < MIN_MATCH) {\n            break;\n          }\n        }\n      }\n      /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,\n       * but this is not important since only literal bytes will be emitted.\n       */\n\n    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);\n    /* If the WIN_INIT bytes after the end of the current data have never been\n     * written, then zero those bytes in order to avoid memory check reports of\n     * the use of uninitialized (or uninitialised as Julian writes) bytes by\n     * the longest match routines.  Update the high water mark for the next\n     * time through here.  WIN_INIT is set to MAX_MATCH since the longest match\n     * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.\n     */\n    //  if (s.high_water < s.window_size) {\n    //    const curr = s.strstart + s.lookahead;\n    //    let init = 0;\n    //\n    //    if (s.high_water < curr) {\n    //      /* Previous high water mark below current data -- zero WIN_INIT\n    //       * bytes or up to end of window, whichever is less.\n    //       */\n    //      init = s.window_size - curr;\n    //      if (init > WIN_INIT)\n    //        init = WIN_INIT;\n    //      zmemzero(s->window + curr, (unsigned)init);\n    //      s->high_water = curr + init;\n    //    }\n    //    else if (s->high_water < (ulg)curr + WIN_INIT) {\n    //      /* High water mark at or above current data, but below current data\n    //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up\n    //       * to end of window, whichever is less.\n    //       */\n    //      init = (ulg)curr + WIN_INIT - s->high_water;\n    //      if (init > s->window_size - s->high_water)\n    //        init = s->window_size - s->high_water;\n    //      zmemzero(s->window + s->high_water, (unsigned)init);\n    //      s->high_water += init;\n    //    }\n    //  }\n    //\n    //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,\n    //    \"not enough room for search\");\n\n  };\n  /* ===========================================================================\n   * Copy without compression as much as possible from the input stream, return\n   * the current block state.\n   * This function does not insert new strings in the dictionary since\n   * uncompressible data is probably not useful. This function is used\n   * only for the level=0 compression option.\n   * NOTE: this function should be optimized to avoid extra copying from\n   * window to pending_buf.\n   */\n\n\n  var deflate_stored = function deflate_stored(s, flush) {\n    /* Stored blocks are limited to 0xffff bytes, pending_buf is limited\n     * to pending_buf_size, and each stored block has a 5 byte header:\n     */\n    var max_block_size = 0xffff;\n\n    if (max_block_size > s.pending_buf_size - 5) {\n      max_block_size = s.pending_buf_size - 5;\n    }\n    /* Copy as much as possible from input to output: */\n\n\n    for (;;) {\n      /* Fill the window as much as possible: */\n      if (s.lookahead <= 1) {\n        //Assert(s->strstart < s->w_size+MAX_DIST(s) ||\n        //  s->block_start >= (long)s->w_size, \"slide too late\");\n        //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||\n        //        s.block_start >= s.w_size)) {\n        //        throw  new Error(\"slide too late\");\n        //      }\n        fill_window(s);\n\n        if (s.lookahead === 0 && flush === Z_NO_FLUSH$2) {\n          return BS_NEED_MORE;\n        }\n\n        if (s.lookahead === 0) {\n          break;\n        }\n        /* flush the current block */\n\n      } //Assert(s->block_start >= 0L, \"block gone\");\n      //    if (s.block_start < 0) throw new Error(\"block gone\");\n\n\n      s.strstart += s.lookahead;\n      s.lookahead = 0;\n      /* Emit a stored block if pending_buf will be full: */\n\n      var max_start = s.block_start + max_block_size;\n\n      if (s.strstart === 0 || s.strstart >= max_start) {\n        /* strstart == 0 is possible when wraparound on 16-bit machine */\n        s.lookahead = s.strstart - max_start;\n        s.strstart = max_start;\n        /*** FLUSH_BLOCK(s, 0); ***/\n\n        flush_block_only(s, false);\n\n        if (s.strm.avail_out === 0) {\n          return BS_NEED_MORE;\n        }\n        /***/\n\n      }\n      /* Flush if we may have to slide, otherwise block_start may become\n       * negative and the data will be gone:\n       */\n\n\n      if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {\n        /*** FLUSH_BLOCK(s, 0); ***/\n        flush_block_only(s, false);\n\n        if (s.strm.avail_out === 0) {\n          return BS_NEED_MORE;\n        }\n        /***/\n\n      }\n    }\n\n    s.insert = 0;\n\n    if (flush === Z_FINISH$3) {\n      /*** FLUSH_BLOCK(s, 1); ***/\n      flush_block_only(s, true);\n\n      if (s.strm.avail_out === 0) {\n        return BS_FINISH_STARTED;\n      }\n      /***/\n\n\n      return BS_FINISH_DONE;\n    }\n\n    if (s.strstart > s.block_start) {\n      /*** FLUSH_BLOCK(s, 0); ***/\n      flush_block_only(s, false);\n\n      if (s.strm.avail_out === 0) {\n        return BS_NEED_MORE;\n      }\n      /***/\n\n    }\n\n    return BS_NEED_MORE;\n  };\n  /* ===========================================================================\n   * Compress as much as possible from the input stream, return the current\n   * block state.\n   * This function does not perform lazy evaluation of matches and inserts\n   * new strings in the dictionary only for unmatched strings or for short\n   * matches. It is used only for the fast compression options.\n   */\n\n\n  var deflate_fast = function deflate_fast(s, flush) {\n    var hash_head;\n    /* head of the hash chain */\n\n    var bflush;\n    /* set if current block must be flushed */\n\n    for (;;) {\n      /* Make sure that we always have enough lookahead, except\n       * at the end of the input file. We need MAX_MATCH bytes\n       * for the next match, plus MIN_MATCH bytes to insert the\n       * string following the next match.\n       */\n      if (s.lookahead < MIN_LOOKAHEAD) {\n        fill_window(s);\n\n        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {\n          return BS_NEED_MORE;\n        }\n\n        if (s.lookahead === 0) {\n          break;\n          /* flush the current block */\n        }\n      }\n      /* Insert the string window[strstart .. strstart+2] in the\n       * dictionary, and set hash_head to the head of the hash chain:\n       */\n\n\n      hash_head = 0\n      /*NIL*/\n      ;\n\n      if (s.lookahead >= MIN_MATCH) {\n        /*** INSERT_STRING(s, s.strstart, hash_head); ***/\n        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);\n        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];\n        s.head[s.ins_h] = s.strstart;\n        /***/\n      }\n      /* Find the longest match, discarding those <= prev_length.\n       * At this point we have always match_length < MIN_MATCH\n       */\n\n\n      if (hash_head !== 0\n      /*NIL*/\n      && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {\n        /* To simplify the code, we prevent matches with the string\n         * of window index 0 (in particular we have to avoid a match\n         * of the string with itself at the start of the input file).\n         */\n        s.match_length = longest_match(s, hash_head);\n        /* longest_match() sets match_start */\n      }\n\n      if (s.match_length >= MIN_MATCH) {\n        // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only\n\n        /*** _tr_tally_dist(s, s.strstart - s.match_start,\n                       s.match_length - MIN_MATCH, bflush); ***/\n        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);\n        s.lookahead -= s.match_length;\n        /* Insert new strings in the hash table only if the match length\n         * is not too large. This saves time but degrades compression.\n         */\n\n        if (s.match_length <= s.max_lazy_match\n        /*max_insert_length*/\n        && s.lookahead >= MIN_MATCH) {\n          s.match_length--;\n          /* string at strstart already in table */\n\n          do {\n            s.strstart++;\n            /*** INSERT_STRING(s, s.strstart, hash_head); ***/\n\n            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);\n            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];\n            s.head[s.ins_h] = s.strstart;\n            /***/\n\n            /* strstart never exceeds WSIZE-MAX_MATCH, so there are\n             * always MIN_MATCH bytes ahead.\n             */\n          } while (--s.match_length !== 0);\n\n          s.strstart++;\n        } else {\n          s.strstart += s.match_length;\n          s.match_length = 0;\n          s.ins_h = s.window[s.strstart];\n          /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */\n\n          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]); //#if MIN_MATCH != 3\n          //                Call UPDATE_HASH() MIN_MATCH-3 more times\n          //#endif\n\n          /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not\n           * matter since it will be recomputed at next deflate call.\n           */\n        }\n      } else {\n        /* No match, output a literal byte */\n        //Tracevv((stderr,\"%c\", s.window[s.strstart]));\n\n        /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/\n        bflush = _tr_tally(s, 0, s.window[s.strstart]);\n        s.lookahead--;\n        s.strstart++;\n      }\n\n      if (bflush) {\n        /*** FLUSH_BLOCK(s, 0); ***/\n        flush_block_only(s, false);\n\n        if (s.strm.avail_out === 0) {\n          return BS_NEED_MORE;\n        }\n        /***/\n\n      }\n    }\n\n    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;\n\n    if (flush === Z_FINISH$3) {\n      /*** FLUSH_BLOCK(s, 1); ***/\n      flush_block_only(s, true);\n\n      if (s.strm.avail_out === 0) {\n        return BS_FINISH_STARTED;\n      }\n      /***/\n\n\n      return BS_FINISH_DONE;\n    }\n\n    if (s.last_lit) {\n      /*** FLUSH_BLOCK(s, 0); ***/\n      flush_block_only(s, false);\n\n      if (s.strm.avail_out === 0) {\n        return BS_NEED_MORE;\n      }\n      /***/\n\n    }\n\n    return BS_BLOCK_DONE;\n  };\n  /* ===========================================================================\n   * Same as above, but achieves better compression. We use a lazy\n   * evaluation for matches: a match is finally adopted only if there is\n   * no better match at the next window position.\n   */\n\n\n  var deflate_slow = function deflate_slow(s, flush) {\n    var hash_head;\n    /* head of hash chain */\n\n    var bflush;\n    /* set if current block must be flushed */\n\n    var max_insert;\n    /* Process the input block. */\n\n    for (;;) {\n      /* Make sure that we always have enough lookahead, except\n       * at the end of the input file. We need MAX_MATCH bytes\n       * for the next match, plus MIN_MATCH bytes to insert the\n       * string following the next match.\n       */\n      if (s.lookahead < MIN_LOOKAHEAD) {\n        fill_window(s);\n\n        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {\n          return BS_NEED_MORE;\n        }\n\n        if (s.lookahead === 0) {\n          break;\n        }\n        /* flush the current block */\n\n      }\n      /* Insert the string window[strstart .. strstart+2] in the\n       * dictionary, and set hash_head to the head of the hash chain:\n       */\n\n\n      hash_head = 0\n      /*NIL*/\n      ;\n\n      if (s.lookahead >= MIN_MATCH) {\n        /*** INSERT_STRING(s, s.strstart, hash_head); ***/\n        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);\n        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];\n        s.head[s.ins_h] = s.strstart;\n        /***/\n      }\n      /* Find the longest match, discarding those <= prev_length.\n       */\n\n\n      s.prev_length = s.match_length;\n      s.prev_match = s.match_start;\n      s.match_length = MIN_MATCH - 1;\n\n      if (hash_head !== 0\n      /*NIL*/\n      && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD\n      /*MAX_DIST(s)*/\n      ) {\n        /* To simplify the code, we prevent matches with the string\n         * of window index 0 (in particular we have to avoid a match\n         * of the string with itself at the start of the input file).\n         */\n        s.match_length = longest_match(s, hash_head);\n        /* longest_match() sets match_start */\n\n        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096\n        /*TOO_FAR*/\n        )) {\n          /* If prev_match is also MIN_MATCH, match_start is garbage\n           * but we will ignore the current match anyway.\n           */\n          s.match_length = MIN_MATCH - 1;\n        }\n      }\n      /* If there was a match at the previous step and the current\n       * match is not better, output the previous match:\n       */\n\n\n      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {\n        max_insert = s.strstart + s.lookahead - MIN_MATCH;\n        /* Do not insert strings in hash table beyond this. */\n        //check_match(s, s.strstart-1, s.prev_match, s.prev_length);\n\n        /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,\n                       s.prev_length - MIN_MATCH, bflush);***/\n\n        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);\n        /* Insert in hash table all strings up to the end of the match.\n         * strstart-1 and strstart are already inserted. If there is not\n         * enough lookahead, the last two strings are not inserted in\n         * the hash table.\n         */\n\n        s.lookahead -= s.prev_length - 1;\n        s.prev_length -= 2;\n\n        do {\n          if (++s.strstart <= max_insert) {\n            /*** INSERT_STRING(s, s.strstart, hash_head); ***/\n            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);\n            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];\n            s.head[s.ins_h] = s.strstart;\n            /***/\n          }\n        } while (--s.prev_length !== 0);\n\n        s.match_available = 0;\n        s.match_length = MIN_MATCH - 1;\n        s.strstart++;\n\n        if (bflush) {\n          /*** FLUSH_BLOCK(s, 0); ***/\n          flush_block_only(s, false);\n\n          if (s.strm.avail_out === 0) {\n            return BS_NEED_MORE;\n          }\n          /***/\n\n        }\n      } else if (s.match_available) {\n        /* If there was no match at the previous position, output a\n         * single literal. If there was a match but the current match\n         * is longer, truncate the previous match to a single literal.\n         */\n        //Tracevv((stderr,\"%c\", s->window[s->strstart-1]));\n\n        /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/\n        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);\n\n        if (bflush) {\n          /*** FLUSH_BLOCK_ONLY(s, 0) ***/\n          flush_block_only(s, false);\n          /***/\n        }\n\n        s.strstart++;\n        s.lookahead--;\n\n        if (s.strm.avail_out === 0) {\n          return BS_NEED_MORE;\n        }\n      } else {\n        /* There is no previous match to compare with, wait for\n         * the next step to decide.\n         */\n        s.match_available = 1;\n        s.strstart++;\n        s.lookahead--;\n      }\n    } //Assert (flush != Z_NO_FLUSH, \"no flush?\");\n\n\n    if (s.match_available) {\n      //Tracevv((stderr,\"%c\", s->window[s->strstart-1]));\n\n      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/\n      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);\n      s.match_available = 0;\n    }\n\n    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;\n\n    if (flush === Z_FINISH$3) {\n      /*** FLUSH_BLOCK(s, 1); ***/\n      flush_block_only(s, true);\n\n      if (s.strm.avail_out === 0) {\n        return BS_FINISH_STARTED;\n      }\n      /***/\n\n\n      return BS_FINISH_DONE;\n    }\n\n    if (s.last_lit) {\n      /*** FLUSH_BLOCK(s, 0); ***/\n      flush_block_only(s, false);\n\n      if (s.strm.avail_out === 0) {\n        return BS_NEED_MORE;\n      }\n      /***/\n\n    }\n\n    return BS_BLOCK_DONE;\n  };\n  /* ===========================================================================\n   * For Z_RLE, simply look for runs of bytes, generate matches only of distance\n   * one.  Do not maintain a hash table.  (It will be regenerated if this run of\n   * deflate switches away from Z_RLE.)\n   */\n\n\n  var deflate_rle = function deflate_rle(s, flush) {\n    var bflush;\n    /* set if current block must be flushed */\n\n    var prev;\n    /* byte at distance one to match */\n\n    var scan, strend;\n    /* scan goes up to strend for length of run */\n\n    var _win = s.window;\n\n    for (;;) {\n      /* Make sure that we always have enough lookahead, except\n       * at the end of the input file. We need MAX_MATCH bytes\n       * for the longest run, plus one for the unrolled loop.\n       */\n      if (s.lookahead <= MAX_MATCH) {\n        fill_window(s);\n\n        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {\n          return BS_NEED_MORE;\n        }\n\n        if (s.lookahead === 0) {\n          break;\n        }\n        /* flush the current block */\n\n      }\n      /* See how many times the previous byte repeats */\n\n\n      s.match_length = 0;\n\n      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {\n        scan = s.strstart - 1;\n        prev = _win[scan];\n\n        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {\n          strend = s.strstart + MAX_MATCH;\n\n          do {\n            /*jshint noempty:false*/\n          } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);\n\n          s.match_length = MAX_MATCH - (strend - scan);\n\n          if (s.match_length > s.lookahead) {\n            s.match_length = s.lookahead;\n          }\n        } //Assert(scan <= s->window+(uInt)(s->window_size-1), \"wild scan\");\n\n      }\n      /* Emit match if have run of MIN_MATCH or longer, else emit literal */\n\n\n      if (s.match_length >= MIN_MATCH) {\n        //check_match(s, s.strstart, s.strstart - 1, s.match_length);\n\n        /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/\n        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);\n        s.lookahead -= s.match_length;\n        s.strstart += s.match_length;\n        s.match_length = 0;\n      } else {\n        /* No match, output a literal byte */\n        //Tracevv((stderr,\"%c\", s->window[s->strstart]));\n\n        /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/\n        bflush = _tr_tally(s, 0, s.window[s.strstart]);\n        s.lookahead--;\n        s.strstart++;\n      }\n\n      if (bflush) {\n        /*** FLUSH_BLOCK(s, 0); ***/\n        flush_block_only(s, false);\n\n        if (s.strm.avail_out === 0) {\n          return BS_NEED_MORE;\n        }\n        /***/\n\n      }\n    }\n\n    s.insert = 0;\n\n    if (flush === Z_FINISH$3) {\n      /*** FLUSH_BLOCK(s, 1); ***/\n      flush_block_only(s, true);\n\n      if (s.strm.avail_out === 0) {\n        return BS_FINISH_STARTED;\n      }\n      /***/\n\n\n      return BS_FINISH_DONE;\n    }\n\n    if (s.last_lit) {\n      /*** FLUSH_BLOCK(s, 0); ***/\n      flush_block_only(s, false);\n\n      if (s.strm.avail_out === 0) {\n        return BS_NEED_MORE;\n      }\n      /***/\n\n    }\n\n    return BS_BLOCK_DONE;\n  };\n  /* ===========================================================================\n   * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.\n   * (It will be regenerated if this run of deflate switches away from Huffman.)\n   */\n\n\n  var deflate_huff = function deflate_huff(s, flush) {\n    var bflush;\n    /* set if current block must be flushed */\n\n    for (;;) {\n      /* Make sure that we have a literal to write. */\n      if (s.lookahead === 0) {\n        fill_window(s);\n\n        if (s.lookahead === 0) {\n          if (flush === Z_NO_FLUSH$2) {\n            return BS_NEED_MORE;\n          }\n\n          break;\n          /* flush the current block */\n        }\n      }\n      /* Output a literal byte */\n\n\n      s.match_length = 0; //Tracevv((stderr,\"%c\", s->window[s->strstart]));\n\n      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/\n\n      bflush = _tr_tally(s, 0, s.window[s.strstart]);\n      s.lookahead--;\n      s.strstart++;\n\n      if (bflush) {\n        /*** FLUSH_BLOCK(s, 0); ***/\n        flush_block_only(s, false);\n\n        if (s.strm.avail_out === 0) {\n          return BS_NEED_MORE;\n        }\n        /***/\n\n      }\n    }\n\n    s.insert = 0;\n\n    if (flush === Z_FINISH$3) {\n      /*** FLUSH_BLOCK(s, 1); ***/\n      flush_block_only(s, true);\n\n      if (s.strm.avail_out === 0) {\n        return BS_FINISH_STARTED;\n      }\n      /***/\n\n\n      return BS_FINISH_DONE;\n    }\n\n    if (s.last_lit) {\n      /*** FLUSH_BLOCK(s, 0); ***/\n      flush_block_only(s, false);\n\n      if (s.strm.avail_out === 0) {\n        return BS_NEED_MORE;\n      }\n      /***/\n\n    }\n\n    return BS_BLOCK_DONE;\n  };\n  /* Values for max_lazy_match, good_match and max_chain_length, depending on\n   * the desired pack level (0..9). The values given below have been tuned to\n   * exclude worst case performance for pathological files. Better values may be\n   * found for specific files.\n   */\n\n\n  function Config(good_length, max_lazy, nice_length, max_chain, func) {\n    this.good_length = good_length;\n    this.max_lazy = max_lazy;\n    this.nice_length = nice_length;\n    this.max_chain = max_chain;\n    this.func = func;\n  }\n\n  var configuration_table = [\n  /*      good lazy nice chain */\n  new Config(0, 0, 0, 0, deflate_stored),\n  /* 0 store only */\n  new Config(4, 4, 8, 4, deflate_fast),\n  /* 1 max speed, no lazy matches */\n  new Config(4, 5, 16, 8, deflate_fast),\n  /* 2 */\n  new Config(4, 6, 32, 32, deflate_fast),\n  /* 3 */\n  new Config(4, 4, 16, 16, deflate_slow),\n  /* 4 lazy matches */\n  new Config(8, 16, 32, 32, deflate_slow),\n  /* 5 */\n  new Config(8, 16, 128, 128, deflate_slow),\n  /* 6 */\n  new Config(8, 32, 128, 256, deflate_slow),\n  /* 7 */\n  new Config(32, 128, 258, 1024, deflate_slow),\n  /* 8 */\n  new Config(32, 258, 258, 4096, deflate_slow)\n  /* 9 max compression */\n  ];\n  /* ===========================================================================\n   * Initialize the \"longest match\" routines for a new zlib stream\n   */\n\n  var lm_init = function lm_init(s) {\n    s.window_size = 2 * s.w_size;\n    /*** CLEAR_HASH(s); ***/\n\n    zero(s.head); // Fill with NIL (= 0);\n\n    /* Set the default configuration parameters:\n     */\n\n    s.max_lazy_match = configuration_table[s.level].max_lazy;\n    s.good_match = configuration_table[s.level].good_length;\n    s.nice_match = configuration_table[s.level].nice_length;\n    s.max_chain_length = configuration_table[s.level].max_chain;\n    s.strstart = 0;\n    s.block_start = 0;\n    s.lookahead = 0;\n    s.insert = 0;\n    s.match_length = s.prev_length = MIN_MATCH - 1;\n    s.match_available = 0;\n    s.ins_h = 0;\n  };\n\n  function DeflateState() {\n    this.strm = null;\n    /* pointer back to this zlib stream */\n\n    this.status = 0;\n    /* as the name implies */\n\n    this.pending_buf = null;\n    /* output still pending */\n\n    this.pending_buf_size = 0;\n    /* size of pending_buf */\n\n    this.pending_out = 0;\n    /* next pending byte to output to the stream */\n\n    this.pending = 0;\n    /* nb of bytes in the pending buffer */\n\n    this.wrap = 0;\n    /* bit 0 true for zlib, bit 1 true for gzip */\n\n    this.gzhead = null;\n    /* gzip header information to write */\n\n    this.gzindex = 0;\n    /* where in extra, name, or comment */\n\n    this.method = Z_DEFLATED$2;\n    /* can only be DEFLATED */\n\n    this.last_flush = -1;\n    /* value of flush param for previous deflate call */\n\n    this.w_size = 0;\n    /* LZ77 window size (32K by default) */\n\n    this.w_bits = 0;\n    /* log2(w_size)  (8..16) */\n\n    this.w_mask = 0;\n    /* w_size - 1 */\n\n    this.window = null;\n    /* Sliding window. Input bytes are read into the second half of the window,\n     * and move to the first half later to keep a dictionary of at least wSize\n     * bytes. With this organization, matches are limited to a distance of\n     * wSize-MAX_MATCH bytes, but this ensures that IO is always\n     * performed with a length multiple of the block size.\n     */\n\n    this.window_size = 0;\n    /* Actual size of window: 2*wSize, except when the user input buffer\n     * is directly used as sliding window.\n     */\n\n    this.prev = null;\n    /* Link to older string with same hash index. To limit the size of this\n     * array to 64K, this link is maintained only for the last 32K strings.\n     * An index in this array is thus a window index modulo 32K.\n     */\n\n    this.head = null;\n    /* Heads of the hash chains or NIL. */\n\n    this.ins_h = 0;\n    /* hash index of string to be inserted */\n\n    this.hash_size = 0;\n    /* number of elements in hash table */\n\n    this.hash_bits = 0;\n    /* log2(hash_size) */\n\n    this.hash_mask = 0;\n    /* hash_size-1 */\n\n    this.hash_shift = 0;\n    /* Number of bits by which ins_h must be shifted at each input\n     * step. It must be such that after MIN_MATCH steps, the oldest\n     * byte no longer takes part in the hash key, that is:\n     *   hash_shift * MIN_MATCH >= hash_bits\n     */\n\n    this.block_start = 0;\n    /* Window position at the beginning of the current output block. Gets\n     * negative when the window is moved backwards.\n     */\n\n    this.match_length = 0;\n    /* length of best match */\n\n    this.prev_match = 0;\n    /* previous match */\n\n    this.match_available = 0;\n    /* set if previous match exists */\n\n    this.strstart = 0;\n    /* start of string to insert */\n\n    this.match_start = 0;\n    /* start of matching string */\n\n    this.lookahead = 0;\n    /* number of valid bytes ahead in window */\n\n    this.prev_length = 0;\n    /* Length of the best match at previous step. Matches not greater than this\n     * are discarded. This is used in the lazy match evaluation.\n     */\n\n    this.max_chain_length = 0;\n    /* To speed up deflation, hash chains are never searched beyond this\n     * length.  A higher limit improves compression ratio but degrades the\n     * speed.\n     */\n\n    this.max_lazy_match = 0;\n    /* Attempt to find a better match only when the current match is strictly\n     * smaller than this value. This mechanism is used only for compression\n     * levels >= 4.\n     */\n    // That's alias to max_lazy_match, don't use directly\n    //this.max_insert_length = 0;\n\n    /* Insert new strings in the hash table only if the match length is not\n     * greater than this length. This saves time but degrades compression.\n     * max_insert_length is used only for compression levels <= 3.\n     */\n\n    this.level = 0;\n    /* compression level (1..9) */\n\n    this.strategy = 0;\n    /* favor or force Huffman coding*/\n\n    this.good_match = 0;\n    /* Use a faster search when the previous match is longer than this */\n\n    this.nice_match = 0;\n    /* Stop searching when current match exceeds this */\n\n    /* used by trees.c: */\n\n    /* Didn't use ct_data typedef below to suppress compiler warning */\n    // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */\n    // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */\n    // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */\n    // Use flat array of DOUBLE size, with interleaved fata,\n    // because JS does not support effective\n\n    this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);\n    this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);\n    this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);\n    zero(this.dyn_ltree);\n    zero(this.dyn_dtree);\n    zero(this.bl_tree);\n    this.l_desc = null;\n    /* desc. for literal tree */\n\n    this.d_desc = null;\n    /* desc. for distance tree */\n\n    this.bl_desc = null;\n    /* desc. for bit length tree */\n    //ush bl_count[MAX_BITS+1];\n\n    this.bl_count = new Uint16Array(MAX_BITS + 1);\n    /* number of codes at each bit length for an optimal tree */\n    //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */\n\n    this.heap = new Uint16Array(2 * L_CODES + 1);\n    /* heap used to build the Huffman trees */\n\n    zero(this.heap);\n    this.heap_len = 0;\n    /* number of elements in the heap */\n\n    this.heap_max = 0;\n    /* element of largest frequency */\n\n    /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.\n     * The same heap array is used to build all trees.\n     */\n\n    this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];\n\n    zero(this.depth);\n    /* Depth of each subtree used as tie breaker for trees of equal frequency\n     */\n\n    this.l_buf = 0;\n    /* buffer index for literals or lengths */\n\n    this.lit_bufsize = 0;\n    /* Size of match buffer for literals/lengths.  There are 4 reasons for\n     * limiting lit_bufsize to 64K:\n     *   - frequencies can be kept in 16 bit counters\n     *   - if compression is not successful for the first block, all input\n     *     data is still in the window so we can still emit a stored block even\n     *     when input comes from standard input.  (This can also be done for\n     *     all blocks if lit_bufsize is not greater than 32K.)\n     *   - if compression is not successful for a file smaller than 64K, we can\n     *     even emit a stored file instead of a stored block (saving 5 bytes).\n     *     This is applicable only for zip (not gzip or zlib).\n     *   - creating new Huffman trees less frequently may not provide fast\n     *     adaptation to changes in the input data statistics. (Take for\n     *     example a binary file with poorly compressible code followed by\n     *     a highly compressible string table.) Smaller buffer sizes give\n     *     fast adaptation but have of course the overhead of transmitting\n     *     trees more frequently.\n     *   - I can't count above 4\n     */\n\n    this.last_lit = 0;\n    /* running index in l_buf */\n\n    this.d_buf = 0;\n    /* Buffer index for distances. To simplify the code, d_buf and l_buf have\n     * the same number of elements. To use different lengths, an extra flag\n     * array would be necessary.\n     */\n\n    this.opt_len = 0;\n    /* bit length of current block with optimal trees */\n\n    this.static_len = 0;\n    /* bit length of current block with static trees */\n\n    this.matches = 0;\n    /* number of string matches in current block */\n\n    this.insert = 0;\n    /* bytes at end of window left to insert */\n\n    this.bi_buf = 0;\n    /* Output buffer. bits are inserted starting at the bottom (least\n     * significant bits).\n     */\n\n    this.bi_valid = 0;\n    /* Number of valid bits in bi_buf.  All bits above the last valid bit\n     * are always zero.\n     */\n    // Used for window memory init. We safely ignore it for JS. That makes\n    // sense only for pointers and memory check tools.\n    //this.high_water = 0;\n\n    /* High water mark offset in window for initialized bytes -- bytes above\n     * this are set to zero in order to avoid memory check warnings when\n     * longest match routines access bytes past the input.  This is then\n     * updated to the new high water mark.\n     */\n  }\n\n  var deflateResetKeep = function deflateResetKeep(strm) {\n    if (!strm || !strm.state) {\n      return err(strm, Z_STREAM_ERROR$2);\n    }\n\n    strm.total_in = strm.total_out = 0;\n    strm.data_type = Z_UNKNOWN;\n    var s = strm.state;\n    s.pending = 0;\n    s.pending_out = 0;\n\n    if (s.wrap < 0) {\n      s.wrap = -s.wrap;\n      /* was made negative by deflate(..., Z_FINISH); */\n    }\n\n    s.status = s.wrap ? INIT_STATE : BUSY_STATE;\n    strm.adler = s.wrap === 2 ? 0 // crc32(0, Z_NULL, 0)\n    : 1; // adler32(0, Z_NULL, 0)\n\n    s.last_flush = Z_NO_FLUSH$2;\n\n    _tr_init(s);\n\n    return Z_OK$3;\n  };\n\n  var deflateReset = function deflateReset(strm) {\n    var ret = deflateResetKeep(strm);\n\n    if (ret === Z_OK$3) {\n      lm_init(strm.state);\n    }\n\n    return ret;\n  };\n\n  var deflateSetHeader = function deflateSetHeader(strm, head) {\n    if (!strm || !strm.state) {\n      return Z_STREAM_ERROR$2;\n    }\n\n    if (strm.state.wrap !== 2) {\n      return Z_STREAM_ERROR$2;\n    }\n\n    strm.state.gzhead = head;\n    return Z_OK$3;\n  };\n\n  var deflateInit2 = function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {\n    if (!strm) {\n      // === Z_NULL\n      return Z_STREAM_ERROR$2;\n    }\n\n    var wrap = 1;\n\n    if (level === Z_DEFAULT_COMPRESSION$1) {\n      level = 6;\n    }\n\n    if (windowBits < 0) {\n      /* suppress zlib wrapper */\n      wrap = 0;\n      windowBits = -windowBits;\n    } else if (windowBits > 15) {\n      wrap = 2;\n      /* write gzip wrapper instead */\n\n      windowBits -= 16;\n    }\n\n    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {\n      return err(strm, Z_STREAM_ERROR$2);\n    }\n\n    if (windowBits === 8) {\n      windowBits = 9;\n    }\n    /* until 256-byte window bug fixed */\n\n\n    var s = new DeflateState();\n    strm.state = s;\n    s.strm = strm;\n    s.wrap = wrap;\n    s.gzhead = null;\n    s.w_bits = windowBits;\n    s.w_size = 1 << s.w_bits;\n    s.w_mask = s.w_size - 1;\n    s.hash_bits = memLevel + 7;\n    s.hash_size = 1 << s.hash_bits;\n    s.hash_mask = s.hash_size - 1;\n    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);\n    s.window = new Uint8Array(s.w_size * 2);\n    s.head = new Uint16Array(s.hash_size);\n    s.prev = new Uint16Array(s.w_size); // Don't need mem init magic for JS.\n    //s.high_water = 0;  /* nothing written to s->window yet */\n\n    s.lit_bufsize = 1 << memLevel + 6;\n    /* 16K elements by default */\n\n    s.pending_buf_size = s.lit_bufsize * 4; //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);\n    //s->pending_buf = (uchf *) overlay;\n\n    s.pending_buf = new Uint8Array(s.pending_buf_size); // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)\n    //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);\n\n    s.d_buf = 1 * s.lit_bufsize; //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;\n\n    s.l_buf = (1 + 2) * s.lit_bufsize;\n    s.level = level;\n    s.strategy = strategy;\n    s.method = method;\n    return deflateReset(strm);\n  };\n\n  var deflateInit = function deflateInit(strm, level) {\n    return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);\n  };\n\n  var deflate$2 = function deflate(strm, flush) {\n    var beg, val; // for gzip header write only\n\n    if (!strm || !strm.state || flush > Z_BLOCK$1 || flush < 0) {\n      return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;\n    }\n\n    var s = strm.state;\n\n    if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH$3) {\n      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);\n    }\n\n    s.strm = strm;\n    /* just in case */\n\n    var old_flush = s.last_flush;\n    s.last_flush = flush;\n    /* Write the header */\n\n    if (s.status === INIT_STATE) {\n      if (s.wrap === 2) {\n        // GZIP header\n        strm.adler = 0; //crc32(0L, Z_NULL, 0);\n\n        put_byte(s, 31);\n        put_byte(s, 139);\n        put_byte(s, 8);\n\n        if (!s.gzhead) {\n          // s->gzhead == Z_NULL\n          put_byte(s, 0);\n          put_byte(s, 0);\n          put_byte(s, 0);\n          put_byte(s, 0);\n          put_byte(s, 0);\n          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);\n          put_byte(s, OS_CODE);\n          s.status = BUSY_STATE;\n        } else {\n          put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));\n          put_byte(s, s.gzhead.time & 0xff);\n          put_byte(s, s.gzhead.time >> 8 & 0xff);\n          put_byte(s, s.gzhead.time >> 16 & 0xff);\n          put_byte(s, s.gzhead.time >> 24 & 0xff);\n          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);\n          put_byte(s, s.gzhead.os & 0xff);\n\n          if (s.gzhead.extra && s.gzhead.extra.length) {\n            put_byte(s, s.gzhead.extra.length & 0xff);\n            put_byte(s, s.gzhead.extra.length >> 8 & 0xff);\n          }\n\n          if (s.gzhead.hcrc) {\n            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);\n          }\n\n          s.gzindex = 0;\n          s.status = EXTRA_STATE;\n        }\n      } else // DEFLATE header\n        {\n          var header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;\n          var level_flags = -1;\n\n          if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {\n            level_flags = 0;\n          } else if (s.level < 6) {\n            level_flags = 1;\n          } else if (s.level === 6) {\n            level_flags = 2;\n          } else {\n            level_flags = 3;\n          }\n\n          header |= level_flags << 6;\n\n          if (s.strstart !== 0) {\n            header |= PRESET_DICT;\n          }\n\n          header += 31 - header % 31;\n          s.status = BUSY_STATE;\n          putShortMSB(s, header);\n          /* Save the adler32 of the preset dictionary: */\n\n          if (s.strstart !== 0) {\n            putShortMSB(s, strm.adler >>> 16);\n            putShortMSB(s, strm.adler & 0xffff);\n          }\n\n          strm.adler = 1; // adler32(0L, Z_NULL, 0);\n        }\n    } //#ifdef GZIP\n\n\n    if (s.status === EXTRA_STATE) {\n      if (s.gzhead.extra\n      /* != Z_NULL*/\n      ) {\n        beg = s.pending;\n        /* start of bytes to update crc */\n\n        while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {\n          if (s.pending === s.pending_buf_size) {\n            if (s.gzhead.hcrc && s.pending > beg) {\n              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);\n            }\n\n            flush_pending(strm);\n            beg = s.pending;\n\n            if (s.pending === s.pending_buf_size) {\n              break;\n            }\n          }\n\n          put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);\n          s.gzindex++;\n        }\n\n        if (s.gzhead.hcrc && s.pending > beg) {\n          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);\n        }\n\n        if (s.gzindex === s.gzhead.extra.length) {\n          s.gzindex = 0;\n          s.status = NAME_STATE;\n        }\n      } else {\n        s.status = NAME_STATE;\n      }\n    }\n\n    if (s.status === NAME_STATE) {\n      if (s.gzhead.name\n      /* != Z_NULL*/\n      ) {\n        beg = s.pending;\n        /* start of bytes to update crc */\n        //int val;\n\n        do {\n          if (s.pending === s.pending_buf_size) {\n            if (s.gzhead.hcrc && s.pending > beg) {\n              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);\n            }\n\n            flush_pending(strm);\n            beg = s.pending;\n\n            if (s.pending === s.pending_buf_size) {\n              val = 1;\n              break;\n            }\n          } // JS specific: little magic to add zero terminator to end of string\n\n\n          if (s.gzindex < s.gzhead.name.length) {\n            val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;\n          } else {\n            val = 0;\n          }\n\n          put_byte(s, val);\n        } while (val !== 0);\n\n        if (s.gzhead.hcrc && s.pending > beg) {\n          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);\n        }\n\n        if (val === 0) {\n          s.gzindex = 0;\n          s.status = COMMENT_STATE;\n        }\n      } else {\n        s.status = COMMENT_STATE;\n      }\n    }\n\n    if (s.status === COMMENT_STATE) {\n      if (s.gzhead.comment\n      /* != Z_NULL*/\n      ) {\n        beg = s.pending;\n        /* start of bytes to update crc */\n        //int val;\n\n        do {\n          if (s.pending === s.pending_buf_size) {\n            if (s.gzhead.hcrc && s.pending > beg) {\n              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);\n            }\n\n            flush_pending(strm);\n            beg = s.pending;\n\n            if (s.pending === s.pending_buf_size) {\n              val = 1;\n              break;\n            }\n          } // JS specific: little magic to add zero terminator to end of string\n\n\n          if (s.gzindex < s.gzhead.comment.length) {\n            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;\n          } else {\n            val = 0;\n          }\n\n          put_byte(s, val);\n        } while (val !== 0);\n\n        if (s.gzhead.hcrc && s.pending > beg) {\n          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);\n        }\n\n        if (val === 0) {\n          s.status = HCRC_STATE;\n        }\n      } else {\n        s.status = HCRC_STATE;\n      }\n    }\n\n    if (s.status === HCRC_STATE) {\n      if (s.gzhead.hcrc) {\n        if (s.pending + 2 > s.pending_buf_size) {\n          flush_pending(strm);\n        }\n\n        if (s.pending + 2 <= s.pending_buf_size) {\n          put_byte(s, strm.adler & 0xff);\n          put_byte(s, strm.adler >> 8 & 0xff);\n          strm.adler = 0; //crc32(0L, Z_NULL, 0);\n\n          s.status = BUSY_STATE;\n        }\n      } else {\n        s.status = BUSY_STATE;\n      }\n    } //#endif\n\n    /* Flush as much pending output as possible */\n\n\n    if (s.pending !== 0) {\n      flush_pending(strm);\n\n      if (strm.avail_out === 0) {\n        /* Since avail_out is 0, deflate will be called again with\n         * more output space, but possibly with both pending and\n         * avail_in equal to zero. There won't be anything to do,\n         * but this is not an error situation so make sure we\n         * return OK instead of BUF_ERROR at next call of deflate:\n         */\n        s.last_flush = -1;\n        return Z_OK$3;\n      }\n      /* Make sure there is something to do and avoid duplicate consecutive\n       * flushes. For repeated and useless calls with Z_FINISH, we keep\n       * returning Z_STREAM_END instead of Z_BUF_ERROR.\n       */\n\n    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {\n      return err(strm, Z_BUF_ERROR$1);\n    }\n    /* User must not provide more input after the first FINISH: */\n\n\n    if (s.status === FINISH_STATE && strm.avail_in !== 0) {\n      return err(strm, Z_BUF_ERROR$1);\n    }\n    /* Start a new block or continue the current one.\n     */\n\n\n    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {\n      var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);\n\n      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {\n        s.status = FINISH_STATE;\n      }\n\n      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {\n        if (strm.avail_out === 0) {\n          s.last_flush = -1;\n          /* avoid BUF_ERROR next call, see above */\n        }\n\n        return Z_OK$3;\n        /* If flush != Z_NO_FLUSH && avail_out == 0, the next call\n         * of deflate should use the same flush parameter to make sure\n         * that the flush is complete. So we don't have to output an\n         * empty block here, this will be done at next call. This also\n         * ensures that for a very small output buffer, we emit at most\n         * one empty block.\n         */\n      }\n\n      if (bstate === BS_BLOCK_DONE) {\n        if (flush === Z_PARTIAL_FLUSH) {\n          _tr_align(s);\n        } else if (flush !== Z_BLOCK$1) {\n          /* FULL_FLUSH or SYNC_FLUSH */\n          _tr_stored_block(s, 0, 0, false);\n          /* For a full flush, this empty block will be recognized\n           * as a special marker by inflate_sync().\n           */\n\n\n          if (flush === Z_FULL_FLUSH$1) {\n            /*** CLEAR_HASH(s); ***/\n\n            /* forget history */\n            zero(s.head); // Fill with NIL (= 0);\n\n            if (s.lookahead === 0) {\n              s.strstart = 0;\n              s.block_start = 0;\n              s.insert = 0;\n            }\n          }\n        }\n\n        flush_pending(strm);\n\n        if (strm.avail_out === 0) {\n          s.last_flush = -1;\n          /* avoid BUF_ERROR at next call, see above */\n\n          return Z_OK$3;\n        }\n      }\n    } //Assert(strm->avail_out > 0, \"bug2\");\n    //if (strm.avail_out <= 0) { throw new Error(\"bug2\");}\n\n\n    if (flush !== Z_FINISH$3) {\n      return Z_OK$3;\n    }\n\n    if (s.wrap <= 0) {\n      return Z_STREAM_END$3;\n    }\n    /* Write the trailer */\n\n\n    if (s.wrap === 2) {\n      put_byte(s, strm.adler & 0xff);\n      put_byte(s, strm.adler >> 8 & 0xff);\n      put_byte(s, strm.adler >> 16 & 0xff);\n      put_byte(s, strm.adler >> 24 & 0xff);\n      put_byte(s, strm.total_in & 0xff);\n      put_byte(s, strm.total_in >> 8 & 0xff);\n      put_byte(s, strm.total_in >> 16 & 0xff);\n      put_byte(s, strm.total_in >> 24 & 0xff);\n    } else {\n      putShortMSB(s, strm.adler >>> 16);\n      putShortMSB(s, strm.adler & 0xffff);\n    }\n\n    flush_pending(strm);\n    /* If avail_out is zero, the application will call deflate again\n     * to flush the rest.\n     */\n\n    if (s.wrap > 0) {\n      s.wrap = -s.wrap;\n    }\n    /* write the trailer only once! */\n\n\n    return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;\n  };\n\n  var deflateEnd = function deflateEnd(strm) {\n    if (!strm\n    /*== Z_NULL*/\n    || !strm.state\n    /*== Z_NULL*/\n    ) {\n      return Z_STREAM_ERROR$2;\n    }\n\n    var status = strm.state.status;\n\n    if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {\n      return err(strm, Z_STREAM_ERROR$2);\n    }\n\n    strm.state = null;\n    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;\n  };\n  /* =========================================================================\n   * Initializes the compression dictionary from the given byte\n   * sequence without producing any compressed output.\n   */\n\n\n  var deflateSetDictionary = function deflateSetDictionary(strm, dictionary) {\n    var dictLength = dictionary.length;\n\n    if (!strm\n    /*== Z_NULL*/\n    || !strm.state\n    /*== Z_NULL*/\n    ) {\n      return Z_STREAM_ERROR$2;\n    }\n\n    var s = strm.state;\n    var wrap = s.wrap;\n\n    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {\n      return Z_STREAM_ERROR$2;\n    }\n    /* when using zlib wrappers, compute Adler-32 for provided dictionary */\n\n\n    if (wrap === 1) {\n      /* adler32(strm->adler, dictionary, dictLength); */\n      strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);\n    }\n\n    s.wrap = 0;\n    /* avoid computing Adler-32 in read_buf */\n\n    /* if dictionary would fill window, just replace the history */\n\n    if (dictLength >= s.w_size) {\n      if (wrap === 0) {\n        /* already empty otherwise */\n\n        /*** CLEAR_HASH(s); ***/\n        zero(s.head); // Fill with NIL (= 0);\n\n        s.strstart = 0;\n        s.block_start = 0;\n        s.insert = 0;\n      }\n      /* use the tail */\n      // dictionary = dictionary.slice(dictLength - s.w_size);\n\n\n      var tmpDict = new Uint8Array(s.w_size);\n      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);\n      dictionary = tmpDict;\n      dictLength = s.w_size;\n    }\n    /* insert dictionary into window and hash */\n\n\n    var avail = strm.avail_in;\n    var next = strm.next_in;\n    var input = strm.input;\n    strm.avail_in = dictLength;\n    strm.next_in = 0;\n    strm.input = dictionary;\n    fill_window(s);\n\n    while (s.lookahead >= MIN_MATCH) {\n      var str = s.strstart;\n      var n = s.lookahead - (MIN_MATCH - 1);\n\n      do {\n        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */\n        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);\n        s.prev[str & s.w_mask] = s.head[s.ins_h];\n        s.head[s.ins_h] = str;\n        str++;\n      } while (--n);\n\n      s.strstart = str;\n      s.lookahead = MIN_MATCH - 1;\n      fill_window(s);\n    }\n\n    s.strstart += s.lookahead;\n    s.block_start = s.strstart;\n    s.insert = s.lookahead;\n    s.lookahead = 0;\n    s.match_length = s.prev_length = MIN_MATCH - 1;\n    s.match_available = 0;\n    strm.next_in = next;\n    strm.input = input;\n    strm.avail_in = avail;\n    s.wrap = wrap;\n    return Z_OK$3;\n  };\n\n  var deflateInit_1 = deflateInit;\n  var deflateInit2_1 = deflateInit2;\n  var deflateReset_1 = deflateReset;\n  var deflateResetKeep_1 = deflateResetKeep;\n  var deflateSetHeader_1 = deflateSetHeader;\n  var deflate_2$1 = deflate$2;\n  var deflateEnd_1 = deflateEnd;\n  var deflateSetDictionary_1 = deflateSetDictionary;\n  var deflateInfo = 'pako deflate (from Nodeca project)';\n  /* Not implemented\n  module.exports.deflateBound = deflateBound;\n  module.exports.deflateCopy = deflateCopy;\n  module.exports.deflateParams = deflateParams;\n  module.exports.deflatePending = deflatePending;\n  module.exports.deflatePrime = deflatePrime;\n  module.exports.deflateTune = deflateTune;\n  */\n\n  var deflate_1$2 = {\n    deflateInit: deflateInit_1,\n    deflateInit2: deflateInit2_1,\n    deflateReset: deflateReset_1,\n    deflateResetKeep: deflateResetKeep_1,\n    deflateSetHeader: deflateSetHeader_1,\n    deflate: deflate_2$1,\n    deflateEnd: deflateEnd_1,\n    deflateSetDictionary: deflateSetDictionary_1,\n    deflateInfo: deflateInfo\n  };\n\n  function _typeof(obj) {\n    \"@babel/helpers - typeof\";\n\n    if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") {\n      _typeof = function (obj) {\n        return typeof obj;\n      };\n    } else {\n      _typeof = function (obj) {\n        return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n      };\n    }\n\n    return _typeof(obj);\n  }\n\n  var _has = function _has(obj, key) {\n    return Object.prototype.hasOwnProperty.call(obj, key);\n  };\n\n  var assign = function assign(obj\n  /*from1, from2, from3, ...*/\n  ) {\n    var sources = Array.prototype.slice.call(arguments, 1);\n\n    while (sources.length) {\n      var source = sources.shift();\n\n      if (!source) {\n        continue;\n      }\n\n      if (_typeof(source) !== 'object') {\n        throw new TypeError(source + 'must be non-object');\n      }\n\n      for (var p in source) {\n        if (_has(source, p)) {\n          obj[p] = source[p];\n        }\n      }\n    }\n\n    return obj;\n  }; // Join array of chunks to single array.\n\n\n  var flattenChunks = function flattenChunks(chunks) {\n    // calculate data length\n    var len = 0;\n\n    for (var i = 0, l = chunks.length; i < l; i++) {\n      len += chunks[i].length;\n    } // join chunks\n\n\n    var result = new Uint8Array(len);\n\n    for (var _i = 0, pos = 0, _l = chunks.length; _i < _l; _i++) {\n      var chunk = chunks[_i];\n      result.set(chunk, pos);\n      pos += chunk.length;\n    }\n\n    return result;\n  };\n\n  var common = {\n    assign: assign,\n    flattenChunks: flattenChunks\n  };\n\n  // String encode/decode helpers\n  //\n  // - apply(Array) can fail on Android 2.2\n  // - apply(Uint8Array) can fail on iOS 5.1 Safari\n  //\n\n  var STR_APPLY_UIA_OK = true;\n\n  try {\n    String.fromCharCode.apply(null, new Uint8Array(1));\n  } catch (__) {\n    STR_APPLY_UIA_OK = false;\n  } // Table with utf8 lengths (calculated by first byte of sequence)\n  // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,\n  // because max possible codepoint is 0x10ffff\n\n\n  var _utf8len = new Uint8Array(256);\n\n  for (var q = 0; q < 256; q++) {\n    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;\n  }\n\n  _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start\n  // convert string to array (typed, when possible)\n\n  var string2buf = function string2buf(str) {\n    if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {\n      return new TextEncoder().encode(str);\n    }\n\n    var buf,\n        c,\n        c2,\n        m_pos,\n        i,\n        str_len = str.length,\n        buf_len = 0; // count binary size\n\n    for (m_pos = 0; m_pos < str_len; m_pos++) {\n      c = str.charCodeAt(m_pos);\n\n      if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {\n        c2 = str.charCodeAt(m_pos + 1);\n\n        if ((c2 & 0xfc00) === 0xdc00) {\n          c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);\n          m_pos++;\n        }\n      }\n\n      buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;\n    } // allocate buffer\n\n\n    buf = new Uint8Array(buf_len); // convert\n\n    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {\n      c = str.charCodeAt(m_pos);\n\n      if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {\n        c2 = str.charCodeAt(m_pos + 1);\n\n        if ((c2 & 0xfc00) === 0xdc00) {\n          c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);\n          m_pos++;\n        }\n      }\n\n      if (c < 0x80) {\n        /* one byte */\n        buf[i++] = c;\n      } else if (c < 0x800) {\n        /* two bytes */\n        buf[i++] = 0xC0 | c >>> 6;\n        buf[i++] = 0x80 | c & 0x3f;\n      } else if (c < 0x10000) {\n        /* three bytes */\n        buf[i++] = 0xE0 | c >>> 12;\n        buf[i++] = 0x80 | c >>> 6 & 0x3f;\n        buf[i++] = 0x80 | c & 0x3f;\n      } else {\n        /* four bytes */\n        buf[i++] = 0xf0 | c >>> 18;\n        buf[i++] = 0x80 | c >>> 12 & 0x3f;\n        buf[i++] = 0x80 | c >>> 6 & 0x3f;\n        buf[i++] = 0x80 | c & 0x3f;\n      }\n    }\n\n    return buf;\n  }; // Helper\n\n\n  var buf2binstring = function buf2binstring(buf, len) {\n    // On Chrome, the arguments in a function call that are allowed is `65534`.\n    // If the length of the buffer is smaller than that, we can use this optimization,\n    // otherwise we will take a slower path.\n    if (len < 65534) {\n      if (buf.subarray && STR_APPLY_UIA_OK) {\n        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));\n      }\n    }\n\n    var result = '';\n\n    for (var i = 0; i < len; i++) {\n      result += String.fromCharCode(buf[i]);\n    }\n\n    return result;\n  }; // convert array to string\n\n\n  var buf2string = function buf2string(buf, max) {\n    var len = max || buf.length;\n\n    if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {\n      return new TextDecoder().decode(buf.subarray(0, max));\n    }\n\n    var i, out; // Reserve max possible length (2 words per char)\n    // NB: by unknown reasons, Array is significantly faster for\n    //     String.fromCharCode.apply than Uint16Array.\n\n    var utf16buf = new Array(len * 2);\n\n    for (out = 0, i = 0; i < len;) {\n      var c = buf[i++]; // quick process ascii\n\n      if (c < 0x80) {\n        utf16buf[out++] = c;\n        continue;\n      }\n\n      var c_len = _utf8len[c]; // skip 5 & 6 byte codes\n\n      if (c_len > 4) {\n        utf16buf[out++] = 0xfffd;\n        i += c_len - 1;\n        continue;\n      } // apply mask on first byte\n\n\n      c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07; // join the rest\n\n      while (c_len > 1 && i < len) {\n        c = c << 6 | buf[i++] & 0x3f;\n        c_len--;\n      } // terminated by end of string?\n\n\n      if (c_len > 1) {\n        utf16buf[out++] = 0xfffd;\n        continue;\n      }\n\n      if (c < 0x10000) {\n        utf16buf[out++] = c;\n      } else {\n        c -= 0x10000;\n        utf16buf[out++] = 0xd800 | c >> 10 & 0x3ff;\n        utf16buf[out++] = 0xdc00 | c & 0x3ff;\n      }\n    }\n\n    return buf2binstring(utf16buf, out);\n  }; // Calculate max possible position in utf8 buffer,\n  // that will not break sequence. If that's not possible\n  // - (very small limits) return max size as is.\n  //\n  // buf[] - utf8 bytes array\n  // max   - length limit (mandatory);\n\n\n  var utf8border = function utf8border(buf, max) {\n    max = max || buf.length;\n\n    if (max > buf.length) {\n      max = buf.length;\n    } // go back from last position, until start of sequence found\n\n\n    var pos = max - 1;\n\n    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) {\n      pos--;\n    } // Very small and broken sequence,\n    // return max, because we should return something anyway.\n\n\n    if (pos < 0) {\n      return max;\n    } // If we came to start of buffer - that means buffer is too small,\n    // return max too.\n\n\n    if (pos === 0) {\n      return max;\n    }\n\n    return pos + _utf8len[buf[pos]] > max ? pos : max;\n  };\n\n  var strings = {\n    string2buf: string2buf,\n    buf2string: buf2string,\n    utf8border: utf8border\n  };\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n  function ZStream() {\n    /* next input byte */\n    this.input = null; // JS specific, because we have no pointers\n\n    this.next_in = 0;\n    /* number of bytes available at input */\n\n    this.avail_in = 0;\n    /* total number of input bytes read so far */\n\n    this.total_in = 0;\n    /* next output byte should be put there */\n\n    this.output = null; // JS specific, because we have no pointers\n\n    this.next_out = 0;\n    /* remaining free space at output */\n\n    this.avail_out = 0;\n    /* total number of bytes output so far */\n\n    this.total_out = 0;\n    /* last error message, NULL if no error */\n\n    this.msg = ''\n    /*Z_NULL*/\n    ;\n    /* not visible by applications */\n\n    this.state = null;\n    /* best guess about the data type: binary or text */\n\n    this.data_type = 2\n    /*Z_UNKNOWN*/\n    ;\n    /* adler32 value of the uncompressed data */\n\n    this.adler = 0;\n  }\n\n  var zstream = ZStream;\n\n  var toString$1 = Object.prototype.toString;\n  /* Public constants ==========================================================*/\n\n  /* ===========================================================================*/\n\n  var Z_NO_FLUSH$1 = constants$2.Z_NO_FLUSH,\n      Z_SYNC_FLUSH = constants$2.Z_SYNC_FLUSH,\n      Z_FULL_FLUSH = constants$2.Z_FULL_FLUSH,\n      Z_FINISH$2 = constants$2.Z_FINISH,\n      Z_OK$2 = constants$2.Z_OK,\n      Z_STREAM_END$2 = constants$2.Z_STREAM_END,\n      Z_DEFAULT_COMPRESSION = constants$2.Z_DEFAULT_COMPRESSION,\n      Z_DEFAULT_STRATEGY = constants$2.Z_DEFAULT_STRATEGY,\n      Z_DEFLATED$1 = constants$2.Z_DEFLATED;\n  /* ===========================================================================*/\n\n  /**\n   * class Deflate\n   *\n   * Generic JS-style wrapper for zlib calls. If you don't need\n   * streaming behaviour - use more simple functions: [[deflate]],\n   * [[deflateRaw]] and [[gzip]].\n   **/\n\n  /* internal\n   * Deflate.chunks -> Array\n   *\n   * Chunks of output data, if [[Deflate#onData]] not overridden.\n   **/\n\n  /**\n   * Deflate.result -> Uint8Array\n   *\n   * Compressed result, generated by default [[Deflate#onData]]\n   * and [[Deflate#onEnd]] handlers. Filled after you push last chunk\n   * (call [[Deflate#push]] with `Z_FINISH` / `true` param).\n   **/\n\n  /**\n   * Deflate.err -> Number\n   *\n   * Error code after deflate finished. 0 (Z_OK) on success.\n   * You will not need it in real life, because deflate errors\n   * are possible only on wrong options or bad `onData` / `onEnd`\n   * custom handlers.\n   **/\n\n  /**\n   * Deflate.msg -> String\n   *\n   * Error message, if [[Deflate.err]] != 0\n   **/\n\n  /**\n   * new Deflate(options)\n   * - options (Object): zlib deflate options.\n   *\n   * Creates new deflator instance with specified params. Throws exception\n   * on bad params. Supported options:\n   *\n   * - `level`\n   * - `windowBits`\n   * - `memLevel`\n   * - `strategy`\n   * - `dictionary`\n   *\n   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)\n   * for more information on these.\n   *\n   * Additional options, for internal needs:\n   *\n   * - `chunkSize` - size of generated data chunks (16K by default)\n   * - `raw` (Boolean) - do raw deflate\n   * - `gzip` (Boolean) - create gzip wrapper\n   * - `header` (Object) - custom header for gzip\n   *   - `text` (Boolean) - true if compressed data believed to be text\n   *   - `time` (Number) - modification time, unix timestamp\n   *   - `os` (Number) - operation system code\n   *   - `extra` (Array) - array of bytes with extra data (max 65536)\n   *   - `name` (String) - file name (binary string)\n   *   - `comment` (String) - comment (binary string)\n   *   - `hcrc` (Boolean) - true if header crc should be added\n   *\n   * ##### Example:\n   *\n   * ```javascript\n   * const pako = require('pako')\n   *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])\n   *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);\n   *\n   * const deflate = new pako.Deflate({ level: 3});\n   *\n   * deflate.push(chunk1, false);\n   * deflate.push(chunk2, true);  // true -> last chunk\n   *\n   * if (deflate.err) { throw new Error(deflate.err); }\n   *\n   * console.log(deflate.result);\n   * ```\n   **/\n\n  function Deflate$1(options) {\n    this.options = common.assign({\n      level: Z_DEFAULT_COMPRESSION,\n      method: Z_DEFLATED$1,\n      chunkSize: 16384,\n      windowBits: 15,\n      memLevel: 8,\n      strategy: Z_DEFAULT_STRATEGY\n    }, options || {});\n    var opt = this.options;\n\n    if (opt.raw && opt.windowBits > 0) {\n      opt.windowBits = -opt.windowBits;\n    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {\n      opt.windowBits += 16;\n    }\n\n    this.err = 0; // error code, if happens (0 = Z_OK)\n\n    this.msg = ''; // error message\n\n    this.ended = false; // used to avoid multiple onEnd() calls\n\n    this.chunks = []; // chunks of compressed data\n\n    this.strm = new zstream();\n    this.strm.avail_out = 0;\n    var status = deflate_1$2.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);\n\n    if (status !== Z_OK$2) {\n      throw new Error(messages[status]);\n    }\n\n    if (opt.header) {\n      deflate_1$2.deflateSetHeader(this.strm, opt.header);\n    }\n\n    if (opt.dictionary) {\n      var dict; // Convert data if needed\n\n      if (typeof opt.dictionary === 'string') {\n        // If we need to compress text, change encoding to utf8.\n        dict = strings.string2buf(opt.dictionary);\n      } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {\n        dict = new Uint8Array(opt.dictionary);\n      } else {\n        dict = opt.dictionary;\n      }\n\n      status = deflate_1$2.deflateSetDictionary(this.strm, dict);\n\n      if (status !== Z_OK$2) {\n        throw new Error(messages[status]);\n      }\n\n      this._dict_set = true;\n    }\n  }\n  /**\n   * Deflate#push(data[, flush_mode]) -> Boolean\n   * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be\n   *   converted to utf8 byte sequence.\n   * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.\n   *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.\n   *\n   * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with\n   * new compressed chunks. Returns `true` on success. The last data block must\n   * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending\n   * buffers and call [[Deflate#onEnd]].\n   *\n   * On fail call [[Deflate#onEnd]] with error code and return false.\n   *\n   * ##### Example\n   *\n   * ```javascript\n   * push(chunk, false); // push one of data chunks\n   * ...\n   * push(chunk, true);  // push last chunk\n   * ```\n   **/\n\n\n  Deflate$1.prototype.push = function (data, flush_mode) {\n    var strm = this.strm;\n    var chunkSize = this.options.chunkSize;\n\n    var status, _flush_mode;\n\n    if (this.ended) {\n      return false;\n    }\n\n    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1; // Convert data if needed\n\n    if (typeof data === 'string') {\n      // If we need to compress text, change encoding to utf8.\n      strm.input = strings.string2buf(data);\n    } else if (toString$1.call(data) === '[object ArrayBuffer]') {\n      strm.input = new Uint8Array(data);\n    } else {\n      strm.input = data;\n    }\n\n    strm.next_in = 0;\n    strm.avail_in = strm.input.length;\n\n    for (;;) {\n      if (strm.avail_out === 0) {\n        strm.output = new Uint8Array(chunkSize);\n        strm.next_out = 0;\n        strm.avail_out = chunkSize;\n      } // Make sure avail_out > 6 to avoid repeating markers\n\n\n      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {\n        this.onData(strm.output.subarray(0, strm.next_out));\n        strm.avail_out = 0;\n        continue;\n      }\n\n      status = deflate_1$2.deflate(strm, _flush_mode); // Ended => flush and finish\n\n      if (status === Z_STREAM_END$2) {\n        if (strm.next_out > 0) {\n          this.onData(strm.output.subarray(0, strm.next_out));\n        }\n\n        status = deflate_1$2.deflateEnd(this.strm);\n        this.onEnd(status);\n        this.ended = true;\n        return status === Z_OK$2;\n      } // Flush if out buffer full\n\n\n      if (strm.avail_out === 0) {\n        this.onData(strm.output);\n        continue;\n      } // Flush if requested and has data\n\n\n      if (_flush_mode > 0 && strm.next_out > 0) {\n        this.onData(strm.output.subarray(0, strm.next_out));\n        strm.avail_out = 0;\n        continue;\n      }\n\n      if (strm.avail_in === 0) break;\n    }\n\n    return true;\n  };\n  /**\n   * Deflate#onData(chunk) -> Void\n   * - chunk (Uint8Array): output data.\n   *\n   * By default, stores data blocks in `chunks[]` property and glue\n   * those in `onEnd`. Override this handler, if you need another behaviour.\n   **/\n\n\n  Deflate$1.prototype.onData = function (chunk) {\n    this.chunks.push(chunk);\n  };\n  /**\n   * Deflate#onEnd(status) -> Void\n   * - status (Number): deflate status. 0 (Z_OK) on success,\n   *   other if not.\n   *\n   * Called once after you tell deflate that the input stream is\n   * complete (Z_FINISH). By default - join collected chunks,\n   * free memory and fill `results` / `err` properties.\n   **/\n\n\n  Deflate$1.prototype.onEnd = function (status) {\n    // On success - join\n    if (status === Z_OK$2) {\n      this.result = common.flattenChunks(this.chunks);\n    }\n\n    this.chunks = [];\n    this.err = status;\n    this.msg = this.strm.msg;\n  };\n  /**\n   * deflate(data[, options]) -> Uint8Array\n   * - data (Uint8Array|String): input data to compress.\n   * - options (Object): zlib deflate options.\n   *\n   * Compress `data` with deflate algorithm and `options`.\n   *\n   * Supported options are:\n   *\n   * - level\n   * - windowBits\n   * - memLevel\n   * - strategy\n   * - dictionary\n   *\n   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)\n   * for more information on these.\n   *\n   * Sugar (options):\n   *\n   * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify\n   *   negative windowBits implicitly.\n   *\n   * ##### Example:\n   *\n   * ```javascript\n   * const pako = require('pako')\n   * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);\n   *\n   * console.log(pako.deflate(data));\n   * ```\n   **/\n\n\n  function deflate$1(input, options) {\n    var deflator = new Deflate$1(options);\n    deflator.push(input, true); // That will never happens, if you don't cheat with options :)\n\n    if (deflator.err) {\n      throw deflator.msg || messages[deflator.err];\n    }\n\n    return deflator.result;\n  }\n  /**\n   * deflateRaw(data[, options]) -> Uint8Array\n   * - data (Uint8Array|String): input data to compress.\n   * - options (Object): zlib deflate options.\n   *\n   * The same as [[deflate]], but creates raw data, without wrapper\n   * (header and adler32 crc).\n   **/\n\n\n  function deflateRaw$1(input, options) {\n    options = options || {};\n    options.raw = true;\n    return deflate$1(input, options);\n  }\n  /**\n   * gzip(data[, options]) -> Uint8Array\n   * - data (Uint8Array|String): input data to compress.\n   * - options (Object): zlib deflate options.\n   *\n   * The same as [[deflate]], but create gzip wrapper instead of\n   * deflate one.\n   **/\n\n\n  function gzip$1(input, options) {\n    options = options || {};\n    options.gzip = true;\n    return deflate$1(input, options);\n  }\n\n  var Deflate_1$1 = Deflate$1;\n  var deflate_2 = deflate$1;\n  var deflateRaw_1$1 = deflateRaw$1;\n  var gzip_1$1 = gzip$1;\n  var constants$1 = constants$2;\n  var deflate_1$1 = {\n    Deflate: Deflate_1$1,\n    deflate: deflate_2,\n    deflateRaw: deflateRaw_1$1,\n    gzip: gzip_1$1,\n    constants: constants$1\n  };\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n  // See state defs from inflate.js\n\n  var BAD$1 = 30;\n  /* got a data error -- remain here until reset */\n\n  var TYPE$1 = 12;\n  /* i: waiting for type bits, including last-flag bit */\n\n  /*\n     Decode literal, length, and distance codes and write out the resulting\n     literal and match bytes until either not enough input or output is\n     available, an end-of-block is encountered, or a data error is encountered.\n     When large enough input and output buffers are supplied to inflate(), for\n     example, a 16K input buffer and a 64K output buffer, more than 95% of the\n     inflate execution time is spent in this routine.\n\n     Entry assumptions:\n\n          state.mode === LEN\n          strm.avail_in >= 6\n          strm.avail_out >= 258\n          start >= strm.avail_out\n          state.bits < 8\n\n     On return, state.mode is one of:\n\n          LEN -- ran out of enough output space or enough available input\n          TYPE -- reached end of block code, inflate() to interpret next block\n          BAD -- error in block data\n\n     Notes:\n\n      - The maximum input bits used by a length/distance pair is 15 bits for the\n        length code, 5 bits for the length extra, 15 bits for the distance code,\n        and 13 bits for the distance extra.  This totals 48 bits, or six bytes.\n        Therefore if strm.avail_in >= 6, then there is enough input to avoid\n        checking for available input while decoding.\n\n      - The maximum bytes that a single length/distance pair can output is 258\n        bytes, which is the maximum length that can be coded.  inflate_fast()\n        requires strm.avail_out >= 258 for each loop to avoid checking for\n        output space.\n   */\n\n  var inffast = function inflate_fast(strm, start) {\n    var _in;\n    /* local strm.input */\n\n\n    var last;\n    /* have enough input while in < last */\n\n    var _out;\n    /* local strm.output */\n\n\n    var beg;\n    /* inflate()'s initial strm.output */\n\n    var end;\n    /* while out < end, enough space available */\n    //#ifdef INFLATE_STRICT\n\n    var dmax;\n    /* maximum distance from zlib header */\n    //#endif\n\n    var wsize;\n    /* window size or zero if not using window */\n\n    var whave;\n    /* valid bytes in the window */\n\n    var wnext;\n    /* window write index */\n    // Use `s_window` instead `window`, avoid conflict with instrumentation tools\n\n    var s_window;\n    /* allocated sliding window, if wsize != 0 */\n\n    var hold;\n    /* local strm.hold */\n\n    var bits;\n    /* local strm.bits */\n\n    var lcode;\n    /* local strm.lencode */\n\n    var dcode;\n    /* local strm.distcode */\n\n    var lmask;\n    /* mask for first level of length codes */\n\n    var dmask;\n    /* mask for first level of distance codes */\n\n    var here;\n    /* retrieved table entry */\n\n    var op;\n    /* code bits, operation, extra bits, or */\n\n    /*  window position, window bytes to copy */\n\n    var len;\n    /* match length, unused bytes */\n\n    var dist;\n    /* match distance */\n\n    var from;\n    /* where to copy match from */\n\n    var from_source;\n    var input, output; // JS specific, because we have no pointers\n\n    /* copy state to local variables */\n\n    var state = strm.state; //here = state.here;\n\n    _in = strm.next_in;\n    input = strm.input;\n    last = _in + (strm.avail_in - 5);\n    _out = strm.next_out;\n    output = strm.output;\n    beg = _out - (start - strm.avail_out);\n    end = _out + (strm.avail_out - 257); //#ifdef INFLATE_STRICT\n\n    dmax = state.dmax; //#endif\n\n    wsize = state.wsize;\n    whave = state.whave;\n    wnext = state.wnext;\n    s_window = state.window;\n    hold = state.hold;\n    bits = state.bits;\n    lcode = state.lencode;\n    dcode = state.distcode;\n    lmask = (1 << state.lenbits) - 1;\n    dmask = (1 << state.distbits) - 1;\n    /* decode literals and length/distances until end-of-block or not enough\n       input data or output space */\n\n    top: do {\n      if (bits < 15) {\n        hold += input[_in++] << bits;\n        bits += 8;\n        hold += input[_in++] << bits;\n        bits += 8;\n      }\n\n      here = lcode[hold & lmask];\n\n      dolen: for (;;) {\n        // Goto emulation\n        op = here >>> 24\n        /*here.bits*/\n        ;\n        hold >>>= op;\n        bits -= op;\n        op = here >>> 16 & 0xff\n        /*here.op*/\n        ;\n\n        if (op === 0) {\n          /* literal */\n          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?\n          //        \"inflate:         literal '%c'\\n\" :\n          //        \"inflate:         literal 0x%02x\\n\", here.val));\n          output[_out++] = here & 0xffff\n          /*here.val*/\n          ;\n        } else if (op & 16) {\n          /* length base */\n          len = here & 0xffff\n          /*here.val*/\n          ;\n          op &= 15;\n          /* number of extra bits */\n\n          if (op) {\n            if (bits < op) {\n              hold += input[_in++] << bits;\n              bits += 8;\n            }\n\n            len += hold & (1 << op) - 1;\n            hold >>>= op;\n            bits -= op;\n          } //Tracevv((stderr, \"inflate:         length %u\\n\", len));\n\n\n          if (bits < 15) {\n            hold += input[_in++] << bits;\n            bits += 8;\n            hold += input[_in++] << bits;\n            bits += 8;\n          }\n\n          here = dcode[hold & dmask];\n\n          dodist: for (;;) {\n            // goto emulation\n            op = here >>> 24\n            /*here.bits*/\n            ;\n            hold >>>= op;\n            bits -= op;\n            op = here >>> 16 & 0xff\n            /*here.op*/\n            ;\n\n            if (op & 16) {\n              /* distance base */\n              dist = here & 0xffff\n              /*here.val*/\n              ;\n              op &= 15;\n              /* number of extra bits */\n\n              if (bits < op) {\n                hold += input[_in++] << bits;\n                bits += 8;\n\n                if (bits < op) {\n                  hold += input[_in++] << bits;\n                  bits += 8;\n                }\n              }\n\n              dist += hold & (1 << op) - 1; //#ifdef INFLATE_STRICT\n\n              if (dist > dmax) {\n                strm.msg = 'invalid distance too far back';\n                state.mode = BAD$1;\n                break top;\n              } //#endif\n\n\n              hold >>>= op;\n              bits -= op; //Tracevv((stderr, \"inflate:         distance %u\\n\", dist));\n\n              op = _out - beg;\n              /* max distance in output */\n\n              if (dist > op) {\n                /* see if copy from window */\n                op = dist - op;\n                /* distance back in window */\n\n                if (op > whave) {\n                  if (state.sane) {\n                    strm.msg = 'invalid distance too far back';\n                    state.mode = BAD$1;\n                    break top;\n                  } // (!) This block is disabled in zlib defaults,\n                  // don't enable it for binary compatibility\n                  //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR\n                  //                if (len <= op - whave) {\n                  //                  do {\n                  //                    output[_out++] = 0;\n                  //                  } while (--len);\n                  //                  continue top;\n                  //                }\n                  //                len -= op - whave;\n                  //                do {\n                  //                  output[_out++] = 0;\n                  //                } while (--op > whave);\n                  //                if (op === 0) {\n                  //                  from = _out - dist;\n                  //                  do {\n                  //                    output[_out++] = output[from++];\n                  //                  } while (--len);\n                  //                  continue top;\n                  //                }\n                  //#endif\n\n                }\n\n                from = 0; // window index\n\n                from_source = s_window;\n\n                if (wnext === 0) {\n                  /* very common case */\n                  from += wsize - op;\n\n                  if (op < len) {\n                    /* some from window */\n                    len -= op;\n\n                    do {\n                      output[_out++] = s_window[from++];\n                    } while (--op);\n\n                    from = _out - dist;\n                    /* rest from output */\n\n                    from_source = output;\n                  }\n                } else if (wnext < op) {\n                  /* wrap around window */\n                  from += wsize + wnext - op;\n                  op -= wnext;\n\n                  if (op < len) {\n                    /* some from end of window */\n                    len -= op;\n\n                    do {\n                      output[_out++] = s_window[from++];\n                    } while (--op);\n\n                    from = 0;\n\n                    if (wnext < len) {\n                      /* some from start of window */\n                      op = wnext;\n                      len -= op;\n\n                      do {\n                        output[_out++] = s_window[from++];\n                      } while (--op);\n\n                      from = _out - dist;\n                      /* rest from output */\n\n                      from_source = output;\n                    }\n                  }\n                } else {\n                  /* contiguous in window */\n                  from += wnext - op;\n\n                  if (op < len) {\n                    /* some from window */\n                    len -= op;\n\n                    do {\n                      output[_out++] = s_window[from++];\n                    } while (--op);\n\n                    from = _out - dist;\n                    /* rest from output */\n\n                    from_source = output;\n                  }\n                }\n\n                while (len > 2) {\n                  output[_out++] = from_source[from++];\n                  output[_out++] = from_source[from++];\n                  output[_out++] = from_source[from++];\n                  len -= 3;\n                }\n\n                if (len) {\n                  output[_out++] = from_source[from++];\n\n                  if (len > 1) {\n                    output[_out++] = from_source[from++];\n                  }\n                }\n              } else {\n                from = _out - dist;\n                /* copy direct from output */\n\n                do {\n                  /* minimum length is three */\n                  output[_out++] = output[from++];\n                  output[_out++] = output[from++];\n                  output[_out++] = output[from++];\n                  len -= 3;\n                } while (len > 2);\n\n                if (len) {\n                  output[_out++] = output[from++];\n\n                  if (len > 1) {\n                    output[_out++] = output[from++];\n                  }\n                }\n              }\n            } else if ((op & 64) === 0) {\n              /* 2nd level distance code */\n              here = dcode[(here & 0xffff) + (hold & (1 << op) - 1)];\n              continue dodist;\n            } else {\n              strm.msg = 'invalid distance code';\n              state.mode = BAD$1;\n              break top;\n            }\n\n            break; // need to emulate goto via \"continue\"\n          }\n        } else if ((op & 64) === 0) {\n          /* 2nd level length code */\n          here = lcode[(here & 0xffff) + (hold & (1 << op) - 1)];\n          continue dolen;\n        } else if (op & 32) {\n          /* end-of-block */\n          //Tracevv((stderr, \"inflate:         end of block\\n\"));\n          state.mode = TYPE$1;\n          break top;\n        } else {\n          strm.msg = 'invalid literal/length code';\n          state.mode = BAD$1;\n          break top;\n        }\n\n        break; // need to emulate goto via \"continue\"\n      }\n    } while (_in < last && _out < end);\n    /* return unused bytes (on entry, bits < 8, so in won't go too far back) */\n\n\n    len = bits >> 3;\n    _in -= len;\n    bits -= len << 3;\n    hold &= (1 << bits) - 1;\n    /* update state and return */\n\n    strm.next_in = _in;\n    strm.next_out = _out;\n    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);\n    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);\n    state.hold = hold;\n    state.bits = bits;\n    return;\n  };\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n  var MAXBITS = 15;\n  var ENOUGH_LENS$1 = 852;\n  var ENOUGH_DISTS$1 = 592; //const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);\n\n  var CODES$1 = 0;\n  var LENS$1 = 1;\n  var DISTS$1 = 2;\n  var lbase = new Uint16Array([\n  /* Length codes 257..285 base */\n  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]);\n  var lext = new Uint8Array([\n  /* Length codes 257..285 extra */\n  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]);\n  var dbase = new Uint16Array([\n  /* Distance codes 0..29 base */\n  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]);\n  var dext = new Uint8Array([\n  /* Distance codes 0..29 extra */\n  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);\n\n  var inflate_table = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {\n    var bits = opts.bits; //here = opts.here; /* table entry for duplication */\n\n    var len = 0;\n    /* a code's length in bits */\n\n    var sym = 0;\n    /* index of code symbols */\n\n    var min = 0,\n        max = 0;\n    /* minimum and maximum code lengths */\n\n    var root = 0;\n    /* number of index bits for root table */\n\n    var curr = 0;\n    /* number of index bits for current table */\n\n    var drop = 0;\n    /* code bits to drop for sub-table */\n\n    var left = 0;\n    /* number of prefix codes available */\n\n    var used = 0;\n    /* code entries in table used */\n\n    var huff = 0;\n    /* Huffman code */\n\n    var incr;\n    /* for incrementing code, index */\n\n    var fill;\n    /* index for replicating entries */\n\n    var low;\n    /* low bits for current root entry */\n\n    var mask;\n    /* mask for low root bits */\n\n    var next;\n    /* next available space in table */\n\n    var base = null;\n    /* base value table to use */\n\n    var base_index = 0; //  let shoextra;    /* extra bits table to use */\n\n    var end;\n    /* use base and extra for symbol > end */\n\n    var count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */\n\n    var offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */\n\n    var extra = null;\n    var extra_index = 0;\n    var here_bits, here_op, here_val;\n    /*\n     Process a set of code lengths to create a canonical Huffman code.  The\n     code lengths are lens[0..codes-1].  Each length corresponds to the\n     symbols 0..codes-1.  The Huffman code is generated by first sorting the\n     symbols by length from short to long, and retaining the symbol order\n     for codes with equal lengths.  Then the code starts with all zero bits\n     for the first code of the shortest length, and the codes are integer\n     increments for the same length, and zeros are appended as the length\n     increases.  For the deflate format, these bits are stored backwards\n     from their more natural integer increment ordering, and so when the\n     decoding tables are built in the large loop below, the integer codes\n     are incremented backwards.\n      This routine assumes, but does not check, that all of the entries in\n     lens[] are in the range 0..MAXBITS.  The caller must assure this.\n     1..MAXBITS is interpreted as that code length.  zero means that that\n     symbol does not occur in this code.\n      The codes are sorted by computing a count of codes for each length,\n     creating from that a table of starting indices for each length in the\n     sorted table, and then entering the symbols in order in the sorted\n     table.  The sorted table is work[], with that space being provided by\n     the caller.\n      The length counts are used for other purposes as well, i.e. finding\n     the minimum and maximum length codes, determining if there are any\n     codes at all, checking for a valid set of lengths, and looking ahead\n     at length counts to determine sub-table sizes when building the\n     decoding tables.\n     */\n\n    /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */\n\n    for (len = 0; len <= MAXBITS; len++) {\n      count[len] = 0;\n    }\n\n    for (sym = 0; sym < codes; sym++) {\n      count[lens[lens_index + sym]]++;\n    }\n    /* bound code lengths, force root to be within code lengths */\n\n\n    root = bits;\n\n    for (max = MAXBITS; max >= 1; max--) {\n      if (count[max] !== 0) {\n        break;\n      }\n    }\n\n    if (root > max) {\n      root = max;\n    }\n\n    if (max === 0) {\n      /* no symbols to code at all */\n      //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */\n      //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;\n      //table.val[opts.table_index++] = 0;   //here.val = (var short)0;\n      table[table_index++] = 1 << 24 | 64 << 16 | 0; //table.op[opts.table_index] = 64;\n      //table.bits[opts.table_index] = 1;\n      //table.val[opts.table_index++] = 0;\n\n      table[table_index++] = 1 << 24 | 64 << 16 | 0;\n      opts.bits = 1;\n      return 0;\n      /* no symbols, but wait for decoding to report error */\n    }\n\n    for (min = 1; min < max; min++) {\n      if (count[min] !== 0) {\n        break;\n      }\n    }\n\n    if (root < min) {\n      root = min;\n    }\n    /* check for an over-subscribed or incomplete set of lengths */\n\n\n    left = 1;\n\n    for (len = 1; len <= MAXBITS; len++) {\n      left <<= 1;\n      left -= count[len];\n\n      if (left < 0) {\n        return -1;\n      }\n      /* over-subscribed */\n\n    }\n\n    if (left > 0 && (type === CODES$1 || max !== 1)) {\n      return -1;\n      /* incomplete set */\n    }\n    /* generate offsets into symbol table for each length for sorting */\n\n\n    offs[1] = 0;\n\n    for (len = 1; len < MAXBITS; len++) {\n      offs[len + 1] = offs[len] + count[len];\n    }\n    /* sort symbols by length, by symbol order within each length */\n\n\n    for (sym = 0; sym < codes; sym++) {\n      if (lens[lens_index + sym] !== 0) {\n        work[offs[lens[lens_index + sym]]++] = sym;\n      }\n    }\n    /*\n     Create and fill in decoding tables.  In this loop, the table being\n     filled is at next and has curr index bits.  The code being used is huff\n     with length len.  That code is converted to an index by dropping drop\n     bits off of the bottom.  For codes where len is less than drop + curr,\n     those top drop + curr - len bits are incremented through all values to\n     fill the table with replicated entries.\n      root is the number of index bits for the root table.  When len exceeds\n     root, sub-tables are created pointed to by the root entry with an index\n     of the low root bits of huff.  This is saved in low to check for when a\n     new sub-table should be started.  drop is zero when the root table is\n     being filled, and drop is root when sub-tables are being filled.\n      When a new sub-table is needed, it is necessary to look ahead in the\n     code lengths to determine what size sub-table is needed.  The length\n     counts are used for this, and so count[] is decremented as codes are\n     entered in the tables.\n      used keeps track of how many table entries have been allocated from the\n     provided *table space.  It is checked for LENS and DIST tables against\n     the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in\n     the initial root table size constants.  See the comments in inftrees.h\n     for more information.\n      sym increments through all symbols, and the loop terminates when\n     all codes of length max, i.e. all codes, have been processed.  This\n     routine permits incomplete codes, so another loop after this one fills\n     in the rest of the decoding tables with invalid code markers.\n     */\n\n    /* set up for code type */\n    // poor man optimization - use if-else instead of switch,\n    // to avoid deopts in old v8\n\n\n    if (type === CODES$1) {\n      base = extra = work;\n      /* dummy value--not used */\n\n      end = 19;\n    } else if (type === LENS$1) {\n      base = lbase;\n      base_index -= 257;\n      extra = lext;\n      extra_index -= 257;\n      end = 256;\n    } else {\n      /* DISTS */\n      base = dbase;\n      extra = dext;\n      end = -1;\n    }\n    /* initialize opts for loop */\n\n\n    huff = 0;\n    /* starting code */\n\n    sym = 0;\n    /* starting code symbol */\n\n    len = min;\n    /* starting code length */\n\n    next = table_index;\n    /* current table to fill in */\n\n    curr = root;\n    /* current table index bits */\n\n    drop = 0;\n    /* current bits to drop from code for index */\n\n    low = -1;\n    /* trigger new sub-table when len > root */\n\n    used = 1 << root;\n    /* use root table entries */\n\n    mask = used - 1;\n    /* mask for comparing low */\n\n    /* check available table space */\n\n    if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {\n      return 1;\n    }\n    /* process all codes and make table entries */\n\n\n    for (;;) {\n      /* create table entry */\n      here_bits = len - drop;\n\n      if (work[sym] < end) {\n        here_op = 0;\n        here_val = work[sym];\n      } else if (work[sym] > end) {\n        here_op = extra[extra_index + work[sym]];\n        here_val = base[base_index + work[sym]];\n      } else {\n        here_op = 32 + 64;\n        /* end of block */\n\n        here_val = 0;\n      }\n      /* replicate for those indices with low len bits equal to huff */\n\n\n      incr = 1 << len - drop;\n      fill = 1 << curr;\n      min = fill;\n      /* save offset to next table */\n\n      do {\n        fill -= incr;\n        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;\n      } while (fill !== 0);\n      /* backwards increment the len-bit code huff */\n\n\n      incr = 1 << len - 1;\n\n      while (huff & incr) {\n        incr >>= 1;\n      }\n\n      if (incr !== 0) {\n        huff &= incr - 1;\n        huff += incr;\n      } else {\n        huff = 0;\n      }\n      /* go to next symbol, update count, len */\n\n\n      sym++;\n\n      if (--count[len] === 0) {\n        if (len === max) {\n          break;\n        }\n\n        len = lens[lens_index + work[sym]];\n      }\n      /* create new sub-table if needed */\n\n\n      if (len > root && (huff & mask) !== low) {\n        /* if first time, transition to sub-tables */\n        if (drop === 0) {\n          drop = root;\n        }\n        /* increment past last table */\n\n\n        next += min;\n        /* here min is 1 << curr */\n\n        /* determine length of next table */\n\n        curr = len - drop;\n        left = 1 << curr;\n\n        while (curr + drop < max) {\n          left -= count[curr + drop];\n\n          if (left <= 0) {\n            break;\n          }\n\n          curr++;\n          left <<= 1;\n        }\n        /* check for enough space */\n\n\n        used += 1 << curr;\n\n        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {\n          return 1;\n        }\n        /* point entry in root table to sub-table */\n\n\n        low = huff & mask;\n        /*table.op[low] = curr;\n        table.bits[low] = root;\n        table.val[low] = next - opts.table_index;*/\n\n        table[low] = root << 24 | curr << 16 | next - table_index | 0;\n      }\n    }\n    /* fill in remaining table entry if code is incomplete (guaranteed to have\n     at most one remaining entry, since if the code is incomplete, the\n     maximum code length that was allowed to get this far is one bit) */\n\n\n    if (huff !== 0) {\n      //table.op[next + huff] = 64;            /* invalid code marker */\n      //table.bits[next + huff] = len - drop;\n      //table.val[next + huff] = 0;\n      table[next + huff] = len - drop << 24 | 64 << 16 | 0;\n    }\n    /* set return parameters */\n    //opts.table_index += used;\n\n\n    opts.bits = root;\n    return 0;\n  };\n\n  var inftrees = inflate_table;\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n\n  var CODES = 0;\n  var LENS = 1;\n  var DISTS = 2;\n  /* Public constants ==========================================================*/\n\n  /* ===========================================================================*/\n\n  var Z_FINISH$1 = constants$2.Z_FINISH,\n      Z_BLOCK = constants$2.Z_BLOCK,\n      Z_TREES = constants$2.Z_TREES,\n      Z_OK$1 = constants$2.Z_OK,\n      Z_STREAM_END$1 = constants$2.Z_STREAM_END,\n      Z_NEED_DICT$1 = constants$2.Z_NEED_DICT,\n      Z_STREAM_ERROR$1 = constants$2.Z_STREAM_ERROR,\n      Z_DATA_ERROR$1 = constants$2.Z_DATA_ERROR,\n      Z_MEM_ERROR$1 = constants$2.Z_MEM_ERROR,\n      Z_BUF_ERROR = constants$2.Z_BUF_ERROR,\n      Z_DEFLATED = constants$2.Z_DEFLATED;\n  /* STATES ====================================================================*/\n\n  /* ===========================================================================*/\n\n  var HEAD = 1;\n  /* i: waiting for magic header */\n\n  var FLAGS = 2;\n  /* i: waiting for method and flags (gzip) */\n\n  var TIME = 3;\n  /* i: waiting for modification time (gzip) */\n\n  var OS = 4;\n  /* i: waiting for extra flags and operating system (gzip) */\n\n  var EXLEN = 5;\n  /* i: waiting for extra length (gzip) */\n\n  var EXTRA = 6;\n  /* i: waiting for extra bytes (gzip) */\n\n  var NAME = 7;\n  /* i: waiting for end of file name (gzip) */\n\n  var COMMENT = 8;\n  /* i: waiting for end of comment (gzip) */\n\n  var HCRC = 9;\n  /* i: waiting for header crc (gzip) */\n\n  var DICTID = 10;\n  /* i: waiting for dictionary check value */\n\n  var DICT = 11;\n  /* waiting for inflateSetDictionary() call */\n\n  var TYPE = 12;\n  /* i: waiting for type bits, including last-flag bit */\n\n  var TYPEDO = 13;\n  /* i: same, but skip check to exit inflate on new block */\n\n  var STORED = 14;\n  /* i: waiting for stored size (length and complement) */\n\n  var COPY_ = 15;\n  /* i/o: same as COPY below, but only first time in */\n\n  var COPY = 16;\n  /* i/o: waiting for input or output to copy stored block */\n\n  var TABLE = 17;\n  /* i: waiting for dynamic block table lengths */\n\n  var LENLENS = 18;\n  /* i: waiting for code length code lengths */\n\n  var CODELENS = 19;\n  /* i: waiting for length/lit and distance code lengths */\n\n  var LEN_ = 20;\n  /* i: same as LEN below, but only first time in */\n\n  var LEN = 21;\n  /* i: waiting for length/lit/eob code */\n\n  var LENEXT = 22;\n  /* i: waiting for length extra bits */\n\n  var DIST = 23;\n  /* i: waiting for distance code */\n\n  var DISTEXT = 24;\n  /* i: waiting for distance extra bits */\n\n  var MATCH = 25;\n  /* o: waiting for output space to copy string */\n\n  var LIT = 26;\n  /* o: waiting for output space to write literal */\n\n  var CHECK = 27;\n  /* i: waiting for 32-bit check value */\n\n  var LENGTH = 28;\n  /* i: waiting for 32-bit length (gzip) */\n\n  var DONE = 29;\n  /* finished check, done -- remain here until reset */\n\n  var BAD = 30;\n  /* got a data error -- remain here until reset */\n\n  var MEM = 31;\n  /* got an inflate() memory error -- remain here until reset */\n\n  var SYNC = 32;\n  /* looking for synchronization bytes to restart inflate() */\n\n  /* ===========================================================================*/\n\n  var ENOUGH_LENS = 852;\n  var ENOUGH_DISTS = 592; //const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);\n\n  var MAX_WBITS = 15;\n  /* 32K LZ77 window */\n\n  var DEF_WBITS = MAX_WBITS;\n\n  var zswap32 = function zswap32(q) {\n    return (q >>> 24 & 0xff) + (q >>> 8 & 0xff00) + ((q & 0xff00) << 8) + ((q & 0xff) << 24);\n  };\n\n  function InflateState() {\n    this.mode = 0;\n    /* current inflate mode */\n\n    this.last = false;\n    /* true if processing last block */\n\n    this.wrap = 0;\n    /* bit 0 true for zlib, bit 1 true for gzip */\n\n    this.havedict = false;\n    /* true if dictionary provided */\n\n    this.flags = 0;\n    /* gzip header method and flags (0 if zlib) */\n\n    this.dmax = 0;\n    /* zlib header max distance (INFLATE_STRICT) */\n\n    this.check = 0;\n    /* protected copy of check value */\n\n    this.total = 0;\n    /* protected copy of output count */\n    // TODO: may be {}\n\n    this.head = null;\n    /* where to save gzip header information */\n\n    /* sliding window */\n\n    this.wbits = 0;\n    /* log base 2 of requested window size */\n\n    this.wsize = 0;\n    /* window size or zero if not using window */\n\n    this.whave = 0;\n    /* valid bytes in the window */\n\n    this.wnext = 0;\n    /* window write index */\n\n    this.window = null;\n    /* allocated sliding window, if needed */\n\n    /* bit accumulator */\n\n    this.hold = 0;\n    /* input bit accumulator */\n\n    this.bits = 0;\n    /* number of bits in \"in\" */\n\n    /* for string and stored block copying */\n\n    this.length = 0;\n    /* literal or length of data to copy */\n\n    this.offset = 0;\n    /* distance back to copy string from */\n\n    /* for table and code decoding */\n\n    this.extra = 0;\n    /* extra bits needed */\n\n    /* fixed and dynamic code tables */\n\n    this.lencode = null;\n    /* starting table for length/literal codes */\n\n    this.distcode = null;\n    /* starting table for distance codes */\n\n    this.lenbits = 0;\n    /* index bits for lencode */\n\n    this.distbits = 0;\n    /* index bits for distcode */\n\n    /* dynamic table building */\n\n    this.ncode = 0;\n    /* number of code length code lengths */\n\n    this.nlen = 0;\n    /* number of length code lengths */\n\n    this.ndist = 0;\n    /* number of distance code lengths */\n\n    this.have = 0;\n    /* number of code lengths in lens[] */\n\n    this.next = null;\n    /* next available space in codes[] */\n\n    this.lens = new Uint16Array(320);\n    /* temporary storage for code lengths */\n\n    this.work = new Uint16Array(288);\n    /* work area for code table building */\n\n    /*\n     because we don't have pointers in js, we use lencode and distcode directly\n     as buffers so we don't need codes\n    */\n    //this.codes = new Int32Array(ENOUGH);       /* space for code tables */\n\n    this.lendyn = null;\n    /* dynamic table for length/literal codes (JS specific) */\n\n    this.distdyn = null;\n    /* dynamic table for distance codes (JS specific) */\n\n    this.sane = 0;\n    /* if false, allow invalid distance too far */\n\n    this.back = 0;\n    /* bits back of last unprocessed length/lit */\n\n    this.was = 0;\n    /* initial length of match */\n  }\n\n  var inflateResetKeep = function inflateResetKeep(strm) {\n    if (!strm || !strm.state) {\n      return Z_STREAM_ERROR$1;\n    }\n\n    var state = strm.state;\n    strm.total_in = strm.total_out = state.total = 0;\n    strm.msg = '';\n    /*Z_NULL*/\n\n    if (state.wrap) {\n      /* to support ill-conceived Java test suite */\n      strm.adler = state.wrap & 1;\n    }\n\n    state.mode = HEAD;\n    state.last = 0;\n    state.havedict = 0;\n    state.dmax = 32768;\n    state.head = null\n    /*Z_NULL*/\n    ;\n    state.hold = 0;\n    state.bits = 0; //state.lencode = state.distcode = state.next = state.codes;\n\n    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);\n    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);\n    state.sane = 1;\n    state.back = -1; //Tracev((stderr, \"inflate: reset\\n\"));\n\n    return Z_OK$1;\n  };\n\n  var inflateReset = function inflateReset(strm) {\n    if (!strm || !strm.state) {\n      return Z_STREAM_ERROR$1;\n    }\n\n    var state = strm.state;\n    state.wsize = 0;\n    state.whave = 0;\n    state.wnext = 0;\n    return inflateResetKeep(strm);\n  };\n\n  var inflateReset2 = function inflateReset2(strm, windowBits) {\n    var wrap;\n    /* get the state */\n\n    if (!strm || !strm.state) {\n      return Z_STREAM_ERROR$1;\n    }\n\n    var state = strm.state;\n    /* extract wrap request from windowBits parameter */\n\n    if (windowBits < 0) {\n      wrap = 0;\n      windowBits = -windowBits;\n    } else {\n      wrap = (windowBits >> 4) + 1;\n\n      if (windowBits < 48) {\n        windowBits &= 15;\n      }\n    }\n    /* set number of window bits, free window if different */\n\n\n    if (windowBits && (windowBits < 8 || windowBits > 15)) {\n      return Z_STREAM_ERROR$1;\n    }\n\n    if (state.window !== null && state.wbits !== windowBits) {\n      state.window = null;\n    }\n    /* update state and reset the rest of it */\n\n\n    state.wrap = wrap;\n    state.wbits = windowBits;\n    return inflateReset(strm);\n  };\n\n  var inflateInit2 = function inflateInit2(strm, windowBits) {\n    if (!strm) {\n      return Z_STREAM_ERROR$1;\n    } //strm.msg = Z_NULL;                 /* in case we return an error */\n\n\n    var state = new InflateState(); //if (state === Z_NULL) return Z_MEM_ERROR;\n    //Tracev((stderr, \"inflate: allocated\\n\"));\n\n    strm.state = state;\n    state.window = null\n    /*Z_NULL*/\n    ;\n    var ret = inflateReset2(strm, windowBits);\n\n    if (ret !== Z_OK$1) {\n      strm.state = null\n      /*Z_NULL*/\n      ;\n    }\n\n    return ret;\n  };\n\n  var inflateInit = function inflateInit(strm) {\n    return inflateInit2(strm, DEF_WBITS);\n  };\n  /*\n   Return state with length and distance decoding tables and index sizes set to\n   fixed code decoding.  Normally this returns fixed tables from inffixed.h.\n   If BUILDFIXED is defined, then instead this routine builds the tables the\n   first time it's called, and returns those tables the first time and\n   thereafter.  This reduces the size of the code by about 2K bytes, in\n   exchange for a little execution time.  However, BUILDFIXED should not be\n   used for threaded applications, since the rewriting of the tables and virgin\n   may not be thread-safe.\n   */\n\n\n  var virgin = true;\n  var lenfix, distfix; // We have no pointers in JS, so keep tables separate\n\n  var fixedtables = function fixedtables(state) {\n    /* build fixed huffman tables if first call (may not be thread safe) */\n    if (virgin) {\n      lenfix = new Int32Array(512);\n      distfix = new Int32Array(32);\n      /* literal/length table */\n\n      var sym = 0;\n\n      while (sym < 144) {\n        state.lens[sym++] = 8;\n      }\n\n      while (sym < 256) {\n        state.lens[sym++] = 9;\n      }\n\n      while (sym < 280) {\n        state.lens[sym++] = 7;\n      }\n\n      while (sym < 288) {\n        state.lens[sym++] = 8;\n      }\n\n      inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, {\n        bits: 9\n      });\n      /* distance table */\n\n      sym = 0;\n\n      while (sym < 32) {\n        state.lens[sym++] = 5;\n      }\n\n      inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, {\n        bits: 5\n      });\n      /* do this just once */\n\n      virgin = false;\n    }\n\n    state.lencode = lenfix;\n    state.lenbits = 9;\n    state.distcode = distfix;\n    state.distbits = 5;\n  };\n  /*\n   Update the window with the last wsize (normally 32K) bytes written before\n   returning.  If window does not exist yet, create it.  This is only called\n   when a window is already in use, or when output has been written during this\n   inflate call, but the end of the deflate stream has not been reached yet.\n   It is also called to create a window for dictionary data when a dictionary\n   is loaded.\n\n   Providing output buffers larger than 32K to inflate() should provide a speed\n   advantage, since only the last 32K of output is copied to the sliding window\n   upon return from inflate(), and since all distances after the first 32K of\n   output will fall in the output data, making match copies simpler and faster.\n   The advantage may be dependent on the size of the processor's data caches.\n   */\n\n\n  var updatewindow = function updatewindow(strm, src, end, copy) {\n    var dist;\n    var state = strm.state;\n    /* if it hasn't been done already, allocate space for the window */\n\n    if (state.window === null) {\n      state.wsize = 1 << state.wbits;\n      state.wnext = 0;\n      state.whave = 0;\n      state.window = new Uint8Array(state.wsize);\n    }\n    /* copy state->wsize or less output bytes into the circular window */\n\n\n    if (copy >= state.wsize) {\n      state.window.set(src.subarray(end - state.wsize, end), 0);\n      state.wnext = 0;\n      state.whave = state.wsize;\n    } else {\n      dist = state.wsize - state.wnext;\n\n      if (dist > copy) {\n        dist = copy;\n      } //zmemcpy(state->window + state->wnext, end - copy, dist);\n\n\n      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);\n      copy -= dist;\n\n      if (copy) {\n        //zmemcpy(state->window, end - copy, copy);\n        state.window.set(src.subarray(end - copy, end), 0);\n        state.wnext = copy;\n        state.whave = state.wsize;\n      } else {\n        state.wnext += dist;\n\n        if (state.wnext === state.wsize) {\n          state.wnext = 0;\n        }\n\n        if (state.whave < state.wsize) {\n          state.whave += dist;\n        }\n      }\n    }\n\n    return 0;\n  };\n\n  var inflate$2 = function inflate(strm, flush) {\n    var state;\n    var input, output; // input/output buffers\n\n    var next;\n    /* next input INDEX */\n\n    var put;\n    /* next output INDEX */\n\n    var have, left;\n    /* available input and output */\n\n    var hold;\n    /* bit buffer */\n\n    var bits;\n    /* bits in bit buffer */\n\n    var _in, _out;\n    /* save starting available input and output */\n\n\n    var copy;\n    /* number of stored or match bytes to copy */\n\n    var from;\n    /* where to copy match bytes from */\n\n    var from_source;\n    var here = 0;\n    /* current decoding table entry */\n\n    var here_bits, here_op, here_val; // paked \"here\" denormalized (JS specific)\n    //let last;                   /* parent table entry */\n\n    var last_bits, last_op, last_val; // paked \"last\" denormalized (JS specific)\n\n    var len;\n    /* length to copy for repeats, bits to drop */\n\n    var ret;\n    /* return code */\n\n    var hbuf = new Uint8Array(4);\n    /* buffer for gzip header crc calculation */\n\n    var opts;\n    var n; // temporary variable for NEED_BITS\n\n    var order =\n    /* permutation of code lengths */\n    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);\n\n    if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {\n      return Z_STREAM_ERROR$1;\n    }\n\n    state = strm.state;\n\n    if (state.mode === TYPE) {\n      state.mode = TYPEDO;\n    }\n    /* skip check */\n    //--- LOAD() ---\n\n\n    put = strm.next_out;\n    output = strm.output;\n    left = strm.avail_out;\n    next = strm.next_in;\n    input = strm.input;\n    have = strm.avail_in;\n    hold = state.hold;\n    bits = state.bits; //---\n\n    _in = have;\n    _out = left;\n    ret = Z_OK$1;\n\n    inf_leave: // goto emulation\n    for (;;) {\n      switch (state.mode) {\n        case HEAD:\n          if (state.wrap === 0) {\n            state.mode = TYPEDO;\n            break;\n          } //=== NEEDBITS(16);\n\n\n          while (bits < 16) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8;\n          } //===//\n\n\n          if (state.wrap & 2 && hold === 0x8b1f) {\n            /* gzip header */\n            state.check = 0\n            /*crc32(0L, Z_NULL, 0)*/\n            ; //=== CRC2(state.check, hold);\n\n            hbuf[0] = hold & 0xff;\n            hbuf[1] = hold >>> 8 & 0xff;\n            state.check = crc32_1(state.check, hbuf, 2, 0); //===//\n            //=== INITBITS();\n\n            hold = 0;\n            bits = 0; //===//\n\n            state.mode = FLAGS;\n            break;\n          }\n\n          state.flags = 0;\n          /* expect zlib header */\n\n          if (state.head) {\n            state.head.done = false;\n          }\n\n          if (!(state.wrap & 1) ||\n          /* check if zlib header allowed */\n          (((hold & 0xff) << 8) + (hold >> 8)) % 31) {\n            strm.msg = 'incorrect header check';\n            state.mode = BAD;\n            break;\n          }\n\n          if ((hold & 0x0f) !== Z_DEFLATED) {\n            strm.msg = 'unknown compression method';\n            state.mode = BAD;\n            break;\n          } //--- DROPBITS(4) ---//\n\n\n          hold >>>= 4;\n          bits -= 4; //---//\n\n          len = (hold & 0x0f) + 8;\n\n          if (state.wbits === 0) {\n            state.wbits = len;\n          } else if (len > state.wbits) {\n            strm.msg = 'invalid window size';\n            state.mode = BAD;\n            break;\n          } // !!! pako patch. Force use `options.windowBits` if passed.\n          // Required to always use max window size by default.\n\n\n          state.dmax = 1 << state.wbits; //state.dmax = 1 << len;\n          //Tracev((stderr, \"inflate:   zlib header ok\\n\"));\n\n          strm.adler = state.check = 1\n          /*adler32(0L, Z_NULL, 0)*/\n          ;\n          state.mode = hold & 0x200 ? DICTID : TYPE; //=== INITBITS();\n\n          hold = 0;\n          bits = 0; //===//\n\n          break;\n\n        case FLAGS:\n          //=== NEEDBITS(16); */\n          while (bits < 16) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8;\n          } //===//\n\n\n          state.flags = hold;\n\n          if ((state.flags & 0xff) !== Z_DEFLATED) {\n            strm.msg = 'unknown compression method';\n            state.mode = BAD;\n            break;\n          }\n\n          if (state.flags & 0xe000) {\n            strm.msg = 'unknown header flags set';\n            state.mode = BAD;\n            break;\n          }\n\n          if (state.head) {\n            state.head.text = hold >> 8 & 1;\n          }\n\n          if (state.flags & 0x0200) {\n            //=== CRC2(state.check, hold);\n            hbuf[0] = hold & 0xff;\n            hbuf[1] = hold >>> 8 & 0xff;\n            state.check = crc32_1(state.check, hbuf, 2, 0); //===//\n          } //=== INITBITS();\n\n\n          hold = 0;\n          bits = 0; //===//\n\n          state.mode = TIME;\n\n        /* falls through */\n\n        case TIME:\n          //=== NEEDBITS(32); */\n          while (bits < 32) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8;\n          } //===//\n\n\n          if (state.head) {\n            state.head.time = hold;\n          }\n\n          if (state.flags & 0x0200) {\n            //=== CRC4(state.check, hold)\n            hbuf[0] = hold & 0xff;\n            hbuf[1] = hold >>> 8 & 0xff;\n            hbuf[2] = hold >>> 16 & 0xff;\n            hbuf[3] = hold >>> 24 & 0xff;\n            state.check = crc32_1(state.check, hbuf, 4, 0); //===\n          } //=== INITBITS();\n\n\n          hold = 0;\n          bits = 0; //===//\n\n          state.mode = OS;\n\n        /* falls through */\n\n        case OS:\n          //=== NEEDBITS(16); */\n          while (bits < 16) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8;\n          } //===//\n\n\n          if (state.head) {\n            state.head.xflags = hold & 0xff;\n            state.head.os = hold >> 8;\n          }\n\n          if (state.flags & 0x0200) {\n            //=== CRC2(state.check, hold);\n            hbuf[0] = hold & 0xff;\n            hbuf[1] = hold >>> 8 & 0xff;\n            state.check = crc32_1(state.check, hbuf, 2, 0); //===//\n          } //=== INITBITS();\n\n\n          hold = 0;\n          bits = 0; //===//\n\n          state.mode = EXLEN;\n\n        /* falls through */\n\n        case EXLEN:\n          if (state.flags & 0x0400) {\n            //=== NEEDBITS(16); */\n            while (bits < 16) {\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8;\n            } //===//\n\n\n            state.length = hold;\n\n            if (state.head) {\n              state.head.extra_len = hold;\n            }\n\n            if (state.flags & 0x0200) {\n              //=== CRC2(state.check, hold);\n              hbuf[0] = hold & 0xff;\n              hbuf[1] = hold >>> 8 & 0xff;\n              state.check = crc32_1(state.check, hbuf, 2, 0); //===//\n            } //=== INITBITS();\n\n\n            hold = 0;\n            bits = 0; //===//\n          } else if (state.head) {\n            state.head.extra = null\n            /*Z_NULL*/\n            ;\n          }\n\n          state.mode = EXTRA;\n\n        /* falls through */\n\n        case EXTRA:\n          if (state.flags & 0x0400) {\n            copy = state.length;\n\n            if (copy > have) {\n              copy = have;\n            }\n\n            if (copy) {\n              if (state.head) {\n                len = state.head.extra_len - state.length;\n\n                if (!state.head.extra) {\n                  // Use untyped array for more convenient processing later\n                  state.head.extra = new Uint8Array(state.head.extra_len);\n                }\n\n                state.head.extra.set(input.subarray(next, // extra field is limited to 65536 bytes\n                // - no need for additional size check\n                next + copy),\n                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/\n                len); //zmemcpy(state.head.extra + len, next,\n                //        len + copy > state.head.extra_max ?\n                //        state.head.extra_max - len : copy);\n              }\n\n              if (state.flags & 0x0200) {\n                state.check = crc32_1(state.check, input, copy, next);\n              }\n\n              have -= copy;\n              next += copy;\n              state.length -= copy;\n            }\n\n            if (state.length) {\n              break inf_leave;\n            }\n          }\n\n          state.length = 0;\n          state.mode = NAME;\n\n        /* falls through */\n\n        case NAME:\n          if (state.flags & 0x0800) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            copy = 0;\n\n            do {\n              // TODO: 2 or 1 bytes?\n              len = input[next + copy++];\n              /* use constant limit because in js we should not preallocate memory */\n\n              if (state.head && len && state.length < 65536\n              /*state.head.name_max*/\n              ) {\n                state.head.name += String.fromCharCode(len);\n              }\n            } while (len && copy < have);\n\n            if (state.flags & 0x0200) {\n              state.check = crc32_1(state.check, input, copy, next);\n            }\n\n            have -= copy;\n            next += copy;\n\n            if (len) {\n              break inf_leave;\n            }\n          } else if (state.head) {\n            state.head.name = null;\n          }\n\n          state.length = 0;\n          state.mode = COMMENT;\n\n        /* falls through */\n\n        case COMMENT:\n          if (state.flags & 0x1000) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            copy = 0;\n\n            do {\n              len = input[next + copy++];\n              /* use constant limit because in js we should not preallocate memory */\n\n              if (state.head && len && state.length < 65536\n              /*state.head.comm_max*/\n              ) {\n                state.head.comment += String.fromCharCode(len);\n              }\n            } while (len && copy < have);\n\n            if (state.flags & 0x0200) {\n              state.check = crc32_1(state.check, input, copy, next);\n            }\n\n            have -= copy;\n            next += copy;\n\n            if (len) {\n              break inf_leave;\n            }\n          } else if (state.head) {\n            state.head.comment = null;\n          }\n\n          state.mode = HCRC;\n\n        /* falls through */\n\n        case HCRC:\n          if (state.flags & 0x0200) {\n            //=== NEEDBITS(16); */\n            while (bits < 16) {\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8;\n            } //===//\n\n\n            if (hold !== (state.check & 0xffff)) {\n              strm.msg = 'header crc mismatch';\n              state.mode = BAD;\n              break;\n            } //=== INITBITS();\n\n\n            hold = 0;\n            bits = 0; //===//\n          }\n\n          if (state.head) {\n            state.head.hcrc = state.flags >> 9 & 1;\n            state.head.done = true;\n          }\n\n          strm.adler = state.check = 0;\n          state.mode = TYPE;\n          break;\n\n        case DICTID:\n          //=== NEEDBITS(32); */\n          while (bits < 32) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8;\n          } //===//\n\n\n          strm.adler = state.check = zswap32(hold); //=== INITBITS();\n\n          hold = 0;\n          bits = 0; //===//\n\n          state.mode = DICT;\n\n        /* falls through */\n\n        case DICT:\n          if (state.havedict === 0) {\n            //--- RESTORE() ---\n            strm.next_out = put;\n            strm.avail_out = left;\n            strm.next_in = next;\n            strm.avail_in = have;\n            state.hold = hold;\n            state.bits = bits; //---\n\n            return Z_NEED_DICT$1;\n          }\n\n          strm.adler = state.check = 1\n          /*adler32(0L, Z_NULL, 0)*/\n          ;\n          state.mode = TYPE;\n\n        /* falls through */\n\n        case TYPE:\n          if (flush === Z_BLOCK || flush === Z_TREES) {\n            break inf_leave;\n          }\n\n        /* falls through */\n\n        case TYPEDO:\n          if (state.last) {\n            //--- BYTEBITS() ---//\n            hold >>>= bits & 7;\n            bits -= bits & 7; //---//\n\n            state.mode = CHECK;\n            break;\n          } //=== NEEDBITS(3); */\n\n\n          while (bits < 3) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8;\n          } //===//\n\n\n          state.last = hold & 0x01\n          /*BITS(1)*/\n          ; //--- DROPBITS(1) ---//\n\n          hold >>>= 1;\n          bits -= 1; //---//\n\n          switch (hold & 0x03) {\n            case 0:\n              /* stored block */\n              //Tracev((stderr, \"inflate:     stored block%s\\n\",\n              //        state.last ? \" (last)\" : \"\"));\n              state.mode = STORED;\n              break;\n\n            case 1:\n              /* fixed block */\n              fixedtables(state); //Tracev((stderr, \"inflate:     fixed codes block%s\\n\",\n              //        state.last ? \" (last)\" : \"\"));\n\n              state.mode = LEN_;\n              /* decode codes */\n\n              if (flush === Z_TREES) {\n                //--- DROPBITS(2) ---//\n                hold >>>= 2;\n                bits -= 2; //---//\n\n                break inf_leave;\n              }\n\n              break;\n\n            case 2:\n              /* dynamic block */\n              //Tracev((stderr, \"inflate:     dynamic codes block%s\\n\",\n              //        state.last ? \" (last)\" : \"\"));\n              state.mode = TABLE;\n              break;\n\n            case 3:\n              strm.msg = 'invalid block type';\n              state.mode = BAD;\n          } //--- DROPBITS(2) ---//\n\n\n          hold >>>= 2;\n          bits -= 2; //---//\n\n          break;\n\n        case STORED:\n          //--- BYTEBITS() ---// /* go to byte boundary */\n          hold >>>= bits & 7;\n          bits -= bits & 7; //---//\n          //=== NEEDBITS(32); */\n\n          while (bits < 32) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8;\n          } //===//\n\n\n          if ((hold & 0xffff) !== (hold >>> 16 ^ 0xffff)) {\n            strm.msg = 'invalid stored block lengths';\n            state.mode = BAD;\n            break;\n          }\n\n          state.length = hold & 0xffff; //Tracev((stderr, \"inflate:       stored length %u\\n\",\n          //        state.length));\n          //=== INITBITS();\n\n          hold = 0;\n          bits = 0; //===//\n\n          state.mode = COPY_;\n\n          if (flush === Z_TREES) {\n            break inf_leave;\n          }\n\n        /* falls through */\n\n        case COPY_:\n          state.mode = COPY;\n\n        /* falls through */\n\n        case COPY:\n          copy = state.length;\n\n          if (copy) {\n            if (copy > have) {\n              copy = have;\n            }\n\n            if (copy > left) {\n              copy = left;\n            }\n\n            if (copy === 0) {\n              break inf_leave;\n            } //--- zmemcpy(put, next, copy); ---\n\n\n            output.set(input.subarray(next, next + copy), put); //---//\n\n            have -= copy;\n            next += copy;\n            left -= copy;\n            put += copy;\n            state.length -= copy;\n            break;\n          } //Tracev((stderr, \"inflate:       stored end\\n\"));\n\n\n          state.mode = TYPE;\n          break;\n\n        case TABLE:\n          //=== NEEDBITS(14); */\n          while (bits < 14) {\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8;\n          } //===//\n\n\n          state.nlen = (hold & 0x1f) + 257; //--- DROPBITS(5) ---//\n\n          hold >>>= 5;\n          bits -= 5; //---//\n\n          state.ndist = (hold & 0x1f) + 1; //--- DROPBITS(5) ---//\n\n          hold >>>= 5;\n          bits -= 5; //---//\n\n          state.ncode = (hold & 0x0f) + 4; //--- DROPBITS(4) ---//\n\n          hold >>>= 4;\n          bits -= 4; //---//\n          //#ifndef PKZIP_BUG_WORKAROUND\n\n          if (state.nlen > 286 || state.ndist > 30) {\n            strm.msg = 'too many length or distance symbols';\n            state.mode = BAD;\n            break;\n          } //#endif\n          //Tracev((stderr, \"inflate:       table sizes ok\\n\"));\n\n\n          state.have = 0;\n          state.mode = LENLENS;\n\n        /* falls through */\n\n        case LENLENS:\n          while (state.have < state.ncode) {\n            //=== NEEDBITS(3);\n            while (bits < 3) {\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8;\n            } //===//\n\n\n            state.lens[order[state.have++]] = hold & 0x07; //BITS(3);\n            //--- DROPBITS(3) ---//\n\n            hold >>>= 3;\n            bits -= 3; //---//\n          }\n\n          while (state.have < 19) {\n            state.lens[order[state.have++]] = 0;\n          } // We have separate tables & no pointers. 2 commented lines below not needed.\n          //state.next = state.codes;\n          //state.lencode = state.next;\n          // Switch to use dynamic table\n\n\n          state.lencode = state.lendyn;\n          state.lenbits = 7;\n          opts = {\n            bits: state.lenbits\n          };\n          ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);\n          state.lenbits = opts.bits;\n\n          if (ret) {\n            strm.msg = 'invalid code lengths set';\n            state.mode = BAD;\n            break;\n          } //Tracev((stderr, \"inflate:       code lengths ok\\n\"));\n\n\n          state.have = 0;\n          state.mode = CODELENS;\n\n        /* falls through */\n\n        case CODELENS:\n          while (state.have < state.nlen + state.ndist) {\n            for (;;) {\n              here = state.lencode[hold & (1 << state.lenbits) - 1];\n              /*BITS(state.lenbits)*/\n\n              here_bits = here >>> 24;\n              here_op = here >>> 16 & 0xff;\n              here_val = here & 0xffff;\n\n              if (here_bits <= bits) {\n                break;\n              } //--- PULLBYTE() ---//\n\n\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8; //---//\n            }\n\n            if (here_val < 16) {\n              //--- DROPBITS(here.bits) ---//\n              hold >>>= here_bits;\n              bits -= here_bits; //---//\n\n              state.lens[state.have++] = here_val;\n            } else {\n              if (here_val === 16) {\n                //=== NEEDBITS(here.bits + 2);\n                n = here_bits + 2;\n\n                while (bits < n) {\n                  if (have === 0) {\n                    break inf_leave;\n                  }\n\n                  have--;\n                  hold += input[next++] << bits;\n                  bits += 8;\n                } //===//\n                //--- DROPBITS(here.bits) ---//\n\n\n                hold >>>= here_bits;\n                bits -= here_bits; //---//\n\n                if (state.have === 0) {\n                  strm.msg = 'invalid bit length repeat';\n                  state.mode = BAD;\n                  break;\n                }\n\n                len = state.lens[state.have - 1];\n                copy = 3 + (hold & 0x03); //BITS(2);\n                //--- DROPBITS(2) ---//\n\n                hold >>>= 2;\n                bits -= 2; //---//\n              } else if (here_val === 17) {\n                //=== NEEDBITS(here.bits + 3);\n                n = here_bits + 3;\n\n                while (bits < n) {\n                  if (have === 0) {\n                    break inf_leave;\n                  }\n\n                  have--;\n                  hold += input[next++] << bits;\n                  bits += 8;\n                } //===//\n                //--- DROPBITS(here.bits) ---//\n\n\n                hold >>>= here_bits;\n                bits -= here_bits; //---//\n\n                len = 0;\n                copy = 3 + (hold & 0x07); //BITS(3);\n                //--- DROPBITS(3) ---//\n\n                hold >>>= 3;\n                bits -= 3; //---//\n              } else {\n                //=== NEEDBITS(here.bits + 7);\n                n = here_bits + 7;\n\n                while (bits < n) {\n                  if (have === 0) {\n                    break inf_leave;\n                  }\n\n                  have--;\n                  hold += input[next++] << bits;\n                  bits += 8;\n                } //===//\n                //--- DROPBITS(here.bits) ---//\n\n\n                hold >>>= here_bits;\n                bits -= here_bits; //---//\n\n                len = 0;\n                copy = 11 + (hold & 0x7f); //BITS(7);\n                //--- DROPBITS(7) ---//\n\n                hold >>>= 7;\n                bits -= 7; //---//\n              }\n\n              if (state.have + copy > state.nlen + state.ndist) {\n                strm.msg = 'invalid bit length repeat';\n                state.mode = BAD;\n                break;\n              }\n\n              while (copy--) {\n                state.lens[state.have++] = len;\n              }\n            }\n          }\n          /* handle error breaks in while */\n\n\n          if (state.mode === BAD) {\n            break;\n          }\n          /* check for end-of-block code (better have one) */\n\n\n          if (state.lens[256] === 0) {\n            strm.msg = 'invalid code -- missing end-of-block';\n            state.mode = BAD;\n            break;\n          }\n          /* build code tables -- note: do not change the lenbits or distbits\n             values here (9 and 6) without reading the comments in inftrees.h\n             concerning the ENOUGH constants, which depend on those values */\n\n\n          state.lenbits = 9;\n          opts = {\n            bits: state.lenbits\n          };\n          ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts); // We have separate tables & no pointers. 2 commented lines below not needed.\n          // state.next_index = opts.table_index;\n\n          state.lenbits = opts.bits; // state.lencode = state.next;\n\n          if (ret) {\n            strm.msg = 'invalid literal/lengths set';\n            state.mode = BAD;\n            break;\n          }\n\n          state.distbits = 6; //state.distcode.copy(state.codes);\n          // Switch to use dynamic table\n\n          state.distcode = state.distdyn;\n          opts = {\n            bits: state.distbits\n          };\n          ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts); // We have separate tables & no pointers. 2 commented lines below not needed.\n          // state.next_index = opts.table_index;\n\n          state.distbits = opts.bits; // state.distcode = state.next;\n\n          if (ret) {\n            strm.msg = 'invalid distances set';\n            state.mode = BAD;\n            break;\n          } //Tracev((stderr, 'inflate:       codes ok\\n'));\n\n\n          state.mode = LEN_;\n\n          if (flush === Z_TREES) {\n            break inf_leave;\n          }\n\n        /* falls through */\n\n        case LEN_:\n          state.mode = LEN;\n\n        /* falls through */\n\n        case LEN:\n          if (have >= 6 && left >= 258) {\n            //--- RESTORE() ---\n            strm.next_out = put;\n            strm.avail_out = left;\n            strm.next_in = next;\n            strm.avail_in = have;\n            state.hold = hold;\n            state.bits = bits; //---\n\n            inffast(strm, _out); //--- LOAD() ---\n\n            put = strm.next_out;\n            output = strm.output;\n            left = strm.avail_out;\n            next = strm.next_in;\n            input = strm.input;\n            have = strm.avail_in;\n            hold = state.hold;\n            bits = state.bits; //---\n\n            if (state.mode === TYPE) {\n              state.back = -1;\n            }\n\n            break;\n          }\n\n          state.back = 0;\n\n          for (;;) {\n            here = state.lencode[hold & (1 << state.lenbits) - 1];\n            /*BITS(state.lenbits)*/\n\n            here_bits = here >>> 24;\n            here_op = here >>> 16 & 0xff;\n            here_val = here & 0xffff;\n\n            if (here_bits <= bits) {\n              break;\n            } //--- PULLBYTE() ---//\n\n\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8; //---//\n          }\n\n          if (here_op && (here_op & 0xf0) === 0) {\n            last_bits = here_bits;\n            last_op = here_op;\n            last_val = here_val;\n\n            for (;;) {\n              here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];\n              here_bits = here >>> 24;\n              here_op = here >>> 16 & 0xff;\n              here_val = here & 0xffff;\n\n              if (last_bits + here_bits <= bits) {\n                break;\n              } //--- PULLBYTE() ---//\n\n\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8; //---//\n            } //--- DROPBITS(last.bits) ---//\n\n\n            hold >>>= last_bits;\n            bits -= last_bits; //---//\n\n            state.back += last_bits;\n          } //--- DROPBITS(here.bits) ---//\n\n\n          hold >>>= here_bits;\n          bits -= here_bits; //---//\n\n          state.back += here_bits;\n          state.length = here_val;\n\n          if (here_op === 0) {\n            //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?\n            //        \"inflate:         literal '%c'\\n\" :\n            //        \"inflate:         literal 0x%02x\\n\", here.val));\n            state.mode = LIT;\n            break;\n          }\n\n          if (here_op & 32) {\n            //Tracevv((stderr, \"inflate:         end of block\\n\"));\n            state.back = -1;\n            state.mode = TYPE;\n            break;\n          }\n\n          if (here_op & 64) {\n            strm.msg = 'invalid literal/length code';\n            state.mode = BAD;\n            break;\n          }\n\n          state.extra = here_op & 15;\n          state.mode = LENEXT;\n\n        /* falls through */\n\n        case LENEXT:\n          if (state.extra) {\n            //=== NEEDBITS(state.extra);\n            n = state.extra;\n\n            while (bits < n) {\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8;\n            } //===//\n\n\n            state.length += hold & (1 << state.extra) - 1\n            /*BITS(state.extra)*/\n            ; //--- DROPBITS(state.extra) ---//\n\n            hold >>>= state.extra;\n            bits -= state.extra; //---//\n\n            state.back += state.extra;\n          } //Tracevv((stderr, \"inflate:         length %u\\n\", state.length));\n\n\n          state.was = state.length;\n          state.mode = DIST;\n\n        /* falls through */\n\n        case DIST:\n          for (;;) {\n            here = state.distcode[hold & (1 << state.distbits) - 1];\n            /*BITS(state.distbits)*/\n\n            here_bits = here >>> 24;\n            here_op = here >>> 16 & 0xff;\n            here_val = here & 0xffff;\n\n            if (here_bits <= bits) {\n              break;\n            } //--- PULLBYTE() ---//\n\n\n            if (have === 0) {\n              break inf_leave;\n            }\n\n            have--;\n            hold += input[next++] << bits;\n            bits += 8; //---//\n          }\n\n          if ((here_op & 0xf0) === 0) {\n            last_bits = here_bits;\n            last_op = here_op;\n            last_val = here_val;\n\n            for (;;) {\n              here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];\n              here_bits = here >>> 24;\n              here_op = here >>> 16 & 0xff;\n              here_val = here & 0xffff;\n\n              if (last_bits + here_bits <= bits) {\n                break;\n              } //--- PULLBYTE() ---//\n\n\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8; //---//\n            } //--- DROPBITS(last.bits) ---//\n\n\n            hold >>>= last_bits;\n            bits -= last_bits; //---//\n\n            state.back += last_bits;\n          } //--- DROPBITS(here.bits) ---//\n\n\n          hold >>>= here_bits;\n          bits -= here_bits; //---//\n\n          state.back += here_bits;\n\n          if (here_op & 64) {\n            strm.msg = 'invalid distance code';\n            state.mode = BAD;\n            break;\n          }\n\n          state.offset = here_val;\n          state.extra = here_op & 15;\n          state.mode = DISTEXT;\n\n        /* falls through */\n\n        case DISTEXT:\n          if (state.extra) {\n            //=== NEEDBITS(state.extra);\n            n = state.extra;\n\n            while (bits < n) {\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8;\n            } //===//\n\n\n            state.offset += hold & (1 << state.extra) - 1\n            /*BITS(state.extra)*/\n            ; //--- DROPBITS(state.extra) ---//\n\n            hold >>>= state.extra;\n            bits -= state.extra; //---//\n\n            state.back += state.extra;\n          } //#ifdef INFLATE_STRICT\n\n\n          if (state.offset > state.dmax) {\n            strm.msg = 'invalid distance too far back';\n            state.mode = BAD;\n            break;\n          } //#endif\n          //Tracevv((stderr, \"inflate:         distance %u\\n\", state.offset));\n\n\n          state.mode = MATCH;\n\n        /* falls through */\n\n        case MATCH:\n          if (left === 0) {\n            break inf_leave;\n          }\n\n          copy = _out - left;\n\n          if (state.offset > copy) {\n            /* copy from window */\n            copy = state.offset - copy;\n\n            if (copy > state.whave) {\n              if (state.sane) {\n                strm.msg = 'invalid distance too far back';\n                state.mode = BAD;\n                break;\n              } // (!) This block is disabled in zlib defaults,\n              // don't enable it for binary compatibility\n              //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR\n              //          Trace((stderr, \"inflate.c too far\\n\"));\n              //          copy -= state.whave;\n              //          if (copy > state.length) { copy = state.length; }\n              //          if (copy > left) { copy = left; }\n              //          left -= copy;\n              //          state.length -= copy;\n              //          do {\n              //            output[put++] = 0;\n              //          } while (--copy);\n              //          if (state.length === 0) { state.mode = LEN; }\n              //          break;\n              //#endif\n\n            }\n\n            if (copy > state.wnext) {\n              copy -= state.wnext;\n              from = state.wsize - copy;\n            } else {\n              from = state.wnext - copy;\n            }\n\n            if (copy > state.length) {\n              copy = state.length;\n            }\n\n            from_source = state.window;\n          } else {\n            /* copy from output */\n            from_source = output;\n            from = put - state.offset;\n            copy = state.length;\n          }\n\n          if (copy > left) {\n            copy = left;\n          }\n\n          left -= copy;\n          state.length -= copy;\n\n          do {\n            output[put++] = from_source[from++];\n          } while (--copy);\n\n          if (state.length === 0) {\n            state.mode = LEN;\n          }\n\n          break;\n\n        case LIT:\n          if (left === 0) {\n            break inf_leave;\n          }\n\n          output[put++] = state.length;\n          left--;\n          state.mode = LEN;\n          break;\n\n        case CHECK:\n          if (state.wrap) {\n            //=== NEEDBITS(32);\n            while (bits < 32) {\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--; // Use '|' instead of '+' to make sure that result is signed\n\n              hold |= input[next++] << bits;\n              bits += 8;\n            } //===//\n\n\n            _out -= left;\n            strm.total_out += _out;\n            state.total += _out;\n\n            if (_out) {\n              strm.adler = state.check = state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);\n            }\n\n            _out = left; // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too\n\n            if ((state.flags ? hold : zswap32(hold)) !== state.check) {\n              strm.msg = 'incorrect data check';\n              state.mode = BAD;\n              break;\n            } //=== INITBITS();\n\n\n            hold = 0;\n            bits = 0; //===//\n            //Tracev((stderr, \"inflate:   check matches trailer\\n\"));\n          }\n\n          state.mode = LENGTH;\n\n        /* falls through */\n\n        case LENGTH:\n          if (state.wrap && state.flags) {\n            //=== NEEDBITS(32);\n            while (bits < 32) {\n              if (have === 0) {\n                break inf_leave;\n              }\n\n              have--;\n              hold += input[next++] << bits;\n              bits += 8;\n            } //===//\n\n\n            if (hold !== (state.total & 0xffffffff)) {\n              strm.msg = 'incorrect length check';\n              state.mode = BAD;\n              break;\n            } //=== INITBITS();\n\n\n            hold = 0;\n            bits = 0; //===//\n            //Tracev((stderr, \"inflate:   length matches trailer\\n\"));\n          }\n\n          state.mode = DONE;\n\n        /* falls through */\n\n        case DONE:\n          ret = Z_STREAM_END$1;\n          break inf_leave;\n\n        case BAD:\n          ret = Z_DATA_ERROR$1;\n          break inf_leave;\n\n        case MEM:\n          return Z_MEM_ERROR$1;\n\n        case SYNC:\n        /* falls through */\n\n        default:\n          return Z_STREAM_ERROR$1;\n      }\n    } // inf_leave <- here is real place for \"goto inf_leave\", emulated via \"break inf_leave\"\n\n    /*\n       Return from inflate(), updating the total counts and the check value.\n       If there was no progress during the inflate() call, return a buffer\n       error.  Call updatewindow() to create and/or update the window state.\n       Note: a memory error from inflate() is non-recoverable.\n     */\n    //--- RESTORE() ---\n\n\n    strm.next_out = put;\n    strm.avail_out = left;\n    strm.next_in = next;\n    strm.avail_in = have;\n    state.hold = hold;\n    state.bits = bits; //---\n\n    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {\n      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;\n    }\n\n    _in -= strm.avail_in;\n    _out -= strm.avail_out;\n    strm.total_in += _in;\n    strm.total_out += _out;\n    state.total += _out;\n\n    if (state.wrap && _out) {\n      strm.adler = state.check = state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);\n    }\n\n    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);\n\n    if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {\n      ret = Z_BUF_ERROR;\n    }\n\n    return ret;\n  };\n\n  var inflateEnd = function inflateEnd(strm) {\n    if (!strm || !strm.state\n    /*|| strm->zfree == (free_func)0*/\n    ) {\n      return Z_STREAM_ERROR$1;\n    }\n\n    var state = strm.state;\n\n    if (state.window) {\n      state.window = null;\n    }\n\n    strm.state = null;\n    return Z_OK$1;\n  };\n\n  var inflateGetHeader = function inflateGetHeader(strm, head) {\n    /* check state */\n    if (!strm || !strm.state) {\n      return Z_STREAM_ERROR$1;\n    }\n\n    var state = strm.state;\n\n    if ((state.wrap & 2) === 0) {\n      return Z_STREAM_ERROR$1;\n    }\n    /* save header structure */\n\n\n    state.head = head;\n    head.done = false;\n    return Z_OK$1;\n  };\n\n  var inflateSetDictionary = function inflateSetDictionary(strm, dictionary) {\n    var dictLength = dictionary.length;\n    var state;\n    var dictid;\n    var ret;\n    /* check state */\n\n    if (!strm\n    /* == Z_NULL */\n    || !strm.state\n    /* == Z_NULL */\n    ) {\n      return Z_STREAM_ERROR$1;\n    }\n\n    state = strm.state;\n\n    if (state.wrap !== 0 && state.mode !== DICT) {\n      return Z_STREAM_ERROR$1;\n    }\n    /* check for correct dictionary identifier */\n\n\n    if (state.mode === DICT) {\n      dictid = 1;\n      /* adler32(0, null, 0)*/\n\n      /* dictid = adler32(dictid, dictionary, dictLength); */\n\n      dictid = adler32_1(dictid, dictionary, dictLength, 0);\n\n      if (dictid !== state.check) {\n        return Z_DATA_ERROR$1;\n      }\n    }\n    /* copy dictionary to window using updatewindow(), which will amend the\n     existing dictionary if appropriate */\n\n\n    ret = updatewindow(strm, dictionary, dictLength, dictLength);\n\n    if (ret) {\n      state.mode = MEM;\n      return Z_MEM_ERROR$1;\n    }\n\n    state.havedict = 1; // Tracev((stderr, \"inflate:   dictionary set\\n\"));\n\n    return Z_OK$1;\n  };\n\n  var inflateReset_1 = inflateReset;\n  var inflateReset2_1 = inflateReset2;\n  var inflateResetKeep_1 = inflateResetKeep;\n  var inflateInit_1 = inflateInit;\n  var inflateInit2_1 = inflateInit2;\n  var inflate_2$1 = inflate$2;\n  var inflateEnd_1 = inflateEnd;\n  var inflateGetHeader_1 = inflateGetHeader;\n  var inflateSetDictionary_1 = inflateSetDictionary;\n  var inflateInfo = 'pako inflate (from Nodeca project)';\n  /* Not implemented\n  module.exports.inflateCopy = inflateCopy;\n  module.exports.inflateGetDictionary = inflateGetDictionary;\n  module.exports.inflateMark = inflateMark;\n  module.exports.inflatePrime = inflatePrime;\n  module.exports.inflateSync = inflateSync;\n  module.exports.inflateSyncPoint = inflateSyncPoint;\n  module.exports.inflateUndermine = inflateUndermine;\n  */\n\n  var inflate_1$2 = {\n    inflateReset: inflateReset_1,\n    inflateReset2: inflateReset2_1,\n    inflateResetKeep: inflateResetKeep_1,\n    inflateInit: inflateInit_1,\n    inflateInit2: inflateInit2_1,\n    inflate: inflate_2$1,\n    inflateEnd: inflateEnd_1,\n    inflateGetHeader: inflateGetHeader_1,\n    inflateSetDictionary: inflateSetDictionary_1,\n    inflateInfo: inflateInfo\n  };\n\n  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n  //\n  // This software is provided 'as-is', without any express or implied\n  // warranty. In no event will the authors be held liable for any damages\n  // arising from the use of this software.\n  //\n  // Permission is granted to anyone to use this software for any purpose,\n  // including commercial applications, and to alter it and redistribute it\n  // freely, subject to the following restrictions:\n  //\n  // 1. The origin of this software must not be misrepresented; you must not\n  //   claim that you wrote the original software. If you use this software\n  //   in a product, an acknowledgment in the product documentation would be\n  //   appreciated but is not required.\n  // 2. Altered source versions must be plainly marked as such, and must not be\n  //   misrepresented as being the original software.\n  // 3. This notice may not be removed or altered from any source distribution.\n\n  function GZheader() {\n    /* true if compressed data believed to be text */\n    this.text = 0;\n    /* modification time */\n\n    this.time = 0;\n    /* extra flags (not used when writing a gzip file) */\n\n    this.xflags = 0;\n    /* operating system */\n\n    this.os = 0;\n    /* pointer to extra field or Z_NULL if none */\n\n    this.extra = null;\n    /* extra field length (valid if extra != Z_NULL) */\n\n    this.extra_len = 0; // Actually, we don't need it in JS,\n    // but leave for few code modifications\n    //\n    // Setup limits is not necessary because in js we should not preallocate memory\n    // for inflate use constant limit in 65536 bytes\n    //\n\n    /* space at extra (only when reading header) */\n    // this.extra_max  = 0;\n\n    /* pointer to zero-terminated file name or Z_NULL */\n\n    this.name = '';\n    /* space at name (only when reading header) */\n    // this.name_max   = 0;\n\n    /* pointer to zero-terminated comment or Z_NULL */\n\n    this.comment = '';\n    /* space at comment (only when reading header) */\n    // this.comm_max   = 0;\n\n    /* true if there was or will be a header crc */\n\n    this.hcrc = 0;\n    /* true when done reading gzip header (not used when writing a gzip file) */\n\n    this.done = false;\n  }\n\n  var gzheader = GZheader;\n\n  var toString = Object.prototype.toString;\n  /* Public constants ==========================================================*/\n\n  /* ===========================================================================*/\n\n  var Z_NO_FLUSH = constants$2.Z_NO_FLUSH,\n      Z_FINISH = constants$2.Z_FINISH,\n      Z_OK = constants$2.Z_OK,\n      Z_STREAM_END = constants$2.Z_STREAM_END,\n      Z_NEED_DICT = constants$2.Z_NEED_DICT,\n      Z_STREAM_ERROR = constants$2.Z_STREAM_ERROR,\n      Z_DATA_ERROR = constants$2.Z_DATA_ERROR,\n      Z_MEM_ERROR = constants$2.Z_MEM_ERROR;\n  /* ===========================================================================*/\n\n  /**\n   * class Inflate\n   *\n   * Generic JS-style wrapper for zlib calls. If you don't need\n   * streaming behaviour - use more simple functions: [[inflate]]\n   * and [[inflateRaw]].\n   **/\n\n  /* internal\n   * inflate.chunks -> Array\n   *\n   * Chunks of output data, if [[Inflate#onData]] not overridden.\n   **/\n\n  /**\n   * Inflate.result -> Uint8Array|String\n   *\n   * Uncompressed result, generated by default [[Inflate#onData]]\n   * and [[Inflate#onEnd]] handlers. Filled after you push last chunk\n   * (call [[Inflate#push]] with `Z_FINISH` / `true` param).\n   **/\n\n  /**\n   * Inflate.err -> Number\n   *\n   * Error code after inflate finished. 0 (Z_OK) on success.\n   * Should be checked if broken data possible.\n   **/\n\n  /**\n   * Inflate.msg -> String\n   *\n   * Error message, if [[Inflate.err]] != 0\n   **/\n\n  /**\n   * new Inflate(options)\n   * - options (Object): zlib inflate options.\n   *\n   * Creates new inflator instance with specified params. Throws exception\n   * on bad params. Supported options:\n   *\n   * - `windowBits`\n   * - `dictionary`\n   *\n   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)\n   * for more information on these.\n   *\n   * Additional options, for internal needs:\n   *\n   * - `chunkSize` - size of generated data chunks (16K by default)\n   * - `raw` (Boolean) - do raw inflate\n   * - `to` (String) - if equal to 'string', then result will be converted\n   *   from utf8 to utf16 (javascript) string. When string output requested,\n   *   chunk length can differ from `chunkSize`, depending on content.\n   *\n   * By default, when no options set, autodetect deflate/gzip data format via\n   * wrapper header.\n   *\n   * ##### Example:\n   *\n   * ```javascript\n   * const pako = require('pako')\n   * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])\n   * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);\n   *\n   * const inflate = new pako.Inflate({ level: 3});\n   *\n   * inflate.push(chunk1, false);\n   * inflate.push(chunk2, true);  // true -> last chunk\n   *\n   * if (inflate.err) { throw new Error(inflate.err); }\n   *\n   * console.log(inflate.result);\n   * ```\n   **/\n\n  function Inflate$1(options) {\n    this.options = common.assign({\n      chunkSize: 1024 * 64,\n      windowBits: 15,\n      to: ''\n    }, options || {});\n    var opt = this.options; // Force window size for `raw` data, if not set directly,\n    // because we have no header for autodetect.\n\n    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {\n      opt.windowBits = -opt.windowBits;\n\n      if (opt.windowBits === 0) {\n        opt.windowBits = -15;\n      }\n    } // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate\n\n\n    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {\n      opt.windowBits += 32;\n    } // Gzip header has no info about windows size, we can do autodetect only\n    // for deflate. So, if window size not set, force it to max when gzip possible\n\n\n    if (opt.windowBits > 15 && opt.windowBits < 48) {\n      // bit 3 (16) -> gzipped data\n      // bit 4 (32) -> autodetect gzip/deflate\n      if ((opt.windowBits & 15) === 0) {\n        opt.windowBits |= 15;\n      }\n    }\n\n    this.err = 0; // error code, if happens (0 = Z_OK)\n\n    this.msg = ''; // error message\n\n    this.ended = false; // used to avoid multiple onEnd() calls\n\n    this.chunks = []; // chunks of compressed data\n\n    this.strm = new zstream();\n    this.strm.avail_out = 0;\n    var status = inflate_1$2.inflateInit2(this.strm, opt.windowBits);\n\n    if (status !== Z_OK) {\n      throw new Error(messages[status]);\n    }\n\n    this.header = new gzheader();\n    inflate_1$2.inflateGetHeader(this.strm, this.header); // Setup dictionary\n\n    if (opt.dictionary) {\n      // Convert data if needed\n      if (typeof opt.dictionary === 'string') {\n        opt.dictionary = strings.string2buf(opt.dictionary);\n      } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {\n        opt.dictionary = new Uint8Array(opt.dictionary);\n      }\n\n      if (opt.raw) {\n        //In raw mode we need to set the dictionary early\n        status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);\n\n        if (status !== Z_OK) {\n          throw new Error(messages[status]);\n        }\n      }\n    }\n  }\n  /**\n   * Inflate#push(data[, flush_mode]) -> Boolean\n   * - data (Uint8Array|ArrayBuffer): input data\n   * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE\n   *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,\n   *   `true` means Z_FINISH.\n   *\n   * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with\n   * new output chunks. Returns `true` on success. If end of stream detected,\n   * [[Inflate#onEnd]] will be called.\n   *\n   * `flush_mode` is not needed for normal operation, because end of stream\n   * detected automatically. You may try to use it for advanced things, but\n   * this functionality was not tested.\n   *\n   * On fail call [[Inflate#onEnd]] with error code and return false.\n   *\n   * ##### Example\n   *\n   * ```javascript\n   * push(chunk, false); // push one of data chunks\n   * ...\n   * push(chunk, true);  // push last chunk\n   * ```\n   **/\n\n\n  Inflate$1.prototype.push = function (data, flush_mode) {\n    var strm = this.strm;\n    var chunkSize = this.options.chunkSize;\n    var dictionary = this.options.dictionary;\n\n    var status, _flush_mode, last_avail_out;\n\n    if (this.ended) return false;\n    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH; // Convert data if needed\n\n    if (toString.call(data) === '[object ArrayBuffer]') {\n      strm.input = new Uint8Array(data);\n    } else {\n      strm.input = data;\n    }\n\n    strm.next_in = 0;\n    strm.avail_in = strm.input.length;\n\n    for (;;) {\n      if (strm.avail_out === 0) {\n        strm.output = new Uint8Array(chunkSize);\n        strm.next_out = 0;\n        strm.avail_out = chunkSize;\n      }\n\n      status = inflate_1$2.inflate(strm, _flush_mode);\n\n      if (status === Z_NEED_DICT && dictionary) {\n        status = inflate_1$2.inflateSetDictionary(strm, dictionary);\n\n        if (status === Z_OK) {\n          status = inflate_1$2.inflate(strm, _flush_mode);\n        } else if (status === Z_DATA_ERROR) {\n          // Replace code with more verbose\n          status = Z_NEED_DICT;\n        }\n      } // Skip snyc markers if more data follows and not raw mode\n\n\n      while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {\n        inflate_1$2.inflateReset(strm);\n        status = inflate_1$2.inflate(strm, _flush_mode);\n      }\n\n      switch (status) {\n        case Z_STREAM_ERROR:\n        case Z_DATA_ERROR:\n        case Z_NEED_DICT:\n        case Z_MEM_ERROR:\n          this.onEnd(status);\n          this.ended = true;\n          return false;\n      } // Remember real `avail_out` value, because we may patch out buffer content\n      // to align utf8 strings boundaries.\n\n\n      last_avail_out = strm.avail_out;\n\n      if (strm.next_out) {\n        if (strm.avail_out === 0 || status === Z_STREAM_END) {\n          if (this.options.to === 'string') {\n            var next_out_utf8 = strings.utf8border(strm.output, strm.next_out);\n            var tail = strm.next_out - next_out_utf8;\n            var utf8str = strings.buf2string(strm.output, next_out_utf8); // move tail & realign counters\n\n            strm.next_out = tail;\n            strm.avail_out = chunkSize - tail;\n            if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);\n            this.onData(utf8str);\n          } else {\n            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));\n          }\n        }\n      } // Must repeat iteration if out buffer is full\n\n\n      if (status === Z_OK && last_avail_out === 0) continue; // Finalize if end of stream reached.\n\n      if (status === Z_STREAM_END) {\n        status = inflate_1$2.inflateEnd(this.strm);\n        this.onEnd(status);\n        this.ended = true;\n        return true;\n      }\n\n      if (strm.avail_in === 0) break;\n    }\n\n    return true;\n  };\n  /**\n   * Inflate#onData(chunk) -> Void\n   * - chunk (Uint8Array|String): output data. When string output requested,\n   *   each chunk will be string.\n   *\n   * By default, stores data blocks in `chunks[]` property and glue\n   * those in `onEnd`. Override this handler, if you need another behaviour.\n   **/\n\n\n  Inflate$1.prototype.onData = function (chunk) {\n    this.chunks.push(chunk);\n  };\n  /**\n   * Inflate#onEnd(status) -> Void\n   * - status (Number): inflate status. 0 (Z_OK) on success,\n   *   other if not.\n   *\n   * Called either after you tell inflate that the input stream is\n   * complete (Z_FINISH). By default - join collected chunks,\n   * free memory and fill `results` / `err` properties.\n   **/\n\n\n  Inflate$1.prototype.onEnd = function (status) {\n    // On success - join\n    if (status === Z_OK) {\n      if (this.options.to === 'string') {\n        this.result = this.chunks.join('');\n      } else {\n        this.result = common.flattenChunks(this.chunks);\n      }\n    }\n\n    this.chunks = [];\n    this.err = status;\n    this.msg = this.strm.msg;\n  };\n  /**\n   * inflate(data[, options]) -> Uint8Array|String\n   * - data (Uint8Array): input data to decompress.\n   * - options (Object): zlib inflate options.\n   *\n   * Decompress `data` with inflate/ungzip and `options`. Autodetect\n   * format via wrapper header by default. That's why we don't provide\n   * separate `ungzip` method.\n   *\n   * Supported options are:\n   *\n   * - windowBits\n   *\n   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)\n   * for more information.\n   *\n   * Sugar (options):\n   *\n   * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify\n   *   negative windowBits implicitly.\n   * - `to` (String) - if equal to 'string', then result will be converted\n   *   from utf8 to utf16 (javascript) string. When string output requested,\n   *   chunk length can differ from `chunkSize`, depending on content.\n   *\n   *\n   * ##### Example:\n   *\n   * ```javascript\n   * const pako = require('pako');\n   * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));\n   * let output;\n   *\n   * try {\n   *   output = pako.inflate(input);\n   * } catch (err) {\n   *   console.log(err);\n   * }\n   * ```\n   **/\n\n\n  function inflate$1(input, options) {\n    var inflator = new Inflate$1(options);\n    inflator.push(input); // That will never happens, if you don't cheat with options :)\n\n    if (inflator.err) throw inflator.msg || messages[inflator.err];\n    return inflator.result;\n  }\n  /**\n   * inflateRaw(data[, options]) -> Uint8Array|String\n   * - data (Uint8Array): input data to decompress.\n   * - options (Object): zlib inflate options.\n   *\n   * The same as [[inflate]], but creates raw data, without wrapper\n   * (header and adler32 crc).\n   **/\n\n\n  function inflateRaw$1(input, options) {\n    options = options || {};\n    options.raw = true;\n    return inflate$1(input, options);\n  }\n  /**\n   * ungzip(data[, options]) -> Uint8Array|String\n   * - data (Uint8Array): input data to decompress.\n   * - options (Object): zlib inflate options.\n   *\n   * Just shortcut to [[inflate]], because it autodetects format\n   * by header.content. Done for convenience.\n   **/\n\n\n  var Inflate_1$1 = Inflate$1;\n  var inflate_2 = inflate$1;\n  var inflateRaw_1$1 = inflateRaw$1;\n  var ungzip$1 = inflate$1;\n  var constants = constants$2;\n  var inflate_1$1 = {\n    Inflate: Inflate_1$1,\n    inflate: inflate_2,\n    inflateRaw: inflateRaw_1$1,\n    ungzip: ungzip$1,\n    constants: constants\n  };\n\n  var Deflate = deflate_1$1.Deflate,\n      deflate = deflate_1$1.deflate,\n      deflateRaw = deflate_1$1.deflateRaw,\n      gzip = deflate_1$1.gzip;\n  var Inflate = inflate_1$1.Inflate,\n      inflate = inflate_1$1.inflate,\n      inflateRaw = inflate_1$1.inflateRaw,\n      ungzip = inflate_1$1.ungzip;\n  var Deflate_1 = Deflate;\n  var deflate_1 = deflate;\n  var deflateRaw_1 = deflateRaw;\n  var gzip_1 = gzip;\n  var Inflate_1 = Inflate;\n  var inflate_1 = inflate;\n  var inflateRaw_1 = inflateRaw;\n  var ungzip_1 = ungzip;\n  var constants_1 = constants$2;\n  var pako = {\n    Deflate: Deflate_1,\n    deflate: deflate_1,\n    deflateRaw: deflateRaw_1,\n    gzip: gzip_1,\n    Inflate: Inflate_1,\n    inflate: inflate_1,\n    inflateRaw: inflateRaw_1,\n    ungzip: ungzip_1,\n    constants: constants_1\n  };\n\n  exports.Deflate = Deflate_1;\n  exports.Inflate = Inflate_1;\n  exports.constants = constants_1;\n  exports['default'] = pako;\n  exports.deflate = deflate_1;\n  exports.deflateRaw = deflateRaw_1;\n  exports.gzip = gzip_1;\n  exports.inflate = inflate_1;\n  exports.inflateRaw = inflateRaw_1;\n  exports.ungzip = ungzip_1;\n\n  Object.defineProperty(exports, '__esModule', { value: true });\n\n})));\n\n\n//# sourceURL=webpack://PizZip/./node_modules/pako/dist/pako.es5.js?");

                    /***/
                }),

      /***/ "./node_modules/webpack/buildin/global.js":
      /*!***********************************!*\
        !*** (webpack)/buildin/global.js ***!
        \***********************************/
      /*! no static exports found */
      /***/ (function (module, exports) {

                    eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack://PizZip/(webpack)/buildin/global.js?");

                    /***/
                })

            /******/
        });/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function (view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
        doc = view.document
        // only get URL when necessary in case Blob.js hasn't overridden it yet
        , get_URL = function () {
            return view.URL || view.webkitURL || view;
        }
        , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
        , can_use_save_link = "download" in save_link
        , click = function (node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event);
        }
        , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
        , is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent)
        , throw_outside = function (ex) {
            (view.setImmediate || view.setTimeout)(function () {
                throw ex;
            }, 0);
        }
        , force_saveable_type = "application/octet-stream"
        // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
        , arbitrary_revoke_timeout = 1000 * 40 // in ms
        , revoke = function (file) {
            var revoker = function () {
                if (typeof file === "string") { // file is an object URL
                    get_URL().revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            };
            setTimeout(revoker, arbitrary_revoke_timeout);
        }
        , dispatch = function (filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        }
        , auto_bom = function (blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
            }
            return blob;
        }
        , FileSaver = function (blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            // First try a.download, then web filesystem, then object URLs
            var
                filesaver = this
                , type = blob.type
                , force = type === force_saveable_type
                , object_url
                , dispatch_all = function () {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                // on any filesys errors revert to saving with object URLs
                , fs_error = function () {
                    if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                        // Safari doesn't allow downloading of blob urls
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                            var popup = view.open(url, '_blank');
                            if (!popup) view.location.href = url;
                            url = undefined; // release reference before dispatching
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                        };
                        reader.readAsDataURL(blob);
                        filesaver.readyState = filesaver.INIT;
                        return;
                    }
                    // don't create more object URLs than needed
                    if (!object_url) {
                        object_url = get_URL().createObjectURL(blob);
                    }
                    if (force) {
                        view.location.href = object_url;
                    } else {
                        var opened = view.open(object_url, "_blank");
                        if (!opened) {
                            // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                            view.location.href = object_url;
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                }
                ;
            filesaver.readyState = filesaver.INIT;

            if (can_use_save_link) {
                object_url = get_URL().createObjectURL(blob);
                setTimeout(function () {
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    dispatch_all();
                    revoke(object_url);
                    filesaver.readyState = filesaver.DONE;
                });
                return;
            }

            fs_error();
        }
        , FS_proto = FileSaver.prototype
        , saveAs = function (blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        }
        ;
    // IE 10+ (native saveAs)
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function (blob, name, no_auto_bom) {
            name = name || blob.name || "download";

            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            return navigator.msSaveOrOpenBlob(blob, name);
        };
    }

    FS_proto.abort = function () { };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
        FS_proto.onwritestart =
        FS_proto.onprogress =
        FS_proto.onwrite =
        FS_proto.onabort =
        FS_proto.onerror =
        FS_proto.onwriteend =
        null;

    return saveAs;
}(
    typeof self !== "undefined" && self
    || typeof window !== "undefined" && window
    || this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
    define("FileSaver.js", function () {
        return saveAs;
    });
}
window["PizZipUtils"] =
/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
                /******/
            }
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
                /******/
            };
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
            /******/
        }
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function (exports, name, getter) {
/******/ 		if (!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
                /******/
            }
            /******/
        };
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function (exports) {
/******/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /******/
            }
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
            /******/
        };
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function (value, mode) {
/******/ 		if (mode & 1) value = __webpack_require__(value);
/******/ 		if (mode & 8) return value;
/******/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
            /******/
        };
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function (module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
            /******/
        };
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./es6/index.js");
        /******/
    })
/************************************************************************/
/******/({

/***/ "./es6/index.js":
/*!**********************!*\
  !*** ./es6/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function (module, exports, __webpack_require__) {

                "use strict";
                eval("\n\nvar PizZipUtils = {}; // just use the responseText with xhr1, response with xhr2.\n// The transformation doesn't throw away high-order byte (with responseText)\n// because PizZip handles that case. If not used with PizZip, you may need to\n// do it, see https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data\n\nPizZipUtils._getBinaryFromXHR = function (xhr) {\n  // for xhr.responseText, the 0xFF mask is applied by PizZip\n  return xhr.response || xhr.responseText;\n}; // taken from jQuery\n\n\nfunction createStandardXHR() {\n  try {\n    return new window.XMLHttpRequest();\n  } catch (e) {}\n}\n\nfunction createActiveXHR() {\n  try {\n    return new window.ActiveXObject(\"Microsoft.XMLHTTP\");\n  } catch (e) {}\n} // Create the request object\n\n\nvar createXHR = window.ActiveXObject ?\n/* Microsoft failed to properly\n * implement the XMLHttpRequest in IE7 (can't request local files),\n * so we use the ActiveXObject when it is available\n * Additionally XMLHttpRequest can be disabled in IE7/IE8 so\n * we need a fallback.\n */\nfunction () {\n  return createStandardXHR() || createActiveXHR();\n} : // For all other browsers, use the standard XMLHttpRequest object\ncreateStandardXHR;\n\nPizZipUtils.getBinaryContent = function (path, callback) {\n  /*\n   * Here is the tricky part : getting the data.\n   * In firefox/chrome/opera/... setting the mimeType to 'text/plain; charset=x-user-defined'\n   * is enough, the result is in the standard xhr.responseText.\n   * cf https://developer.mozilla.org/En/XMLHttpRequest/Using_XMLHttpRequest#Receiving_binary_data_in_older_browsers\n   * In IE <= 9, we must use (the IE only) attribute responseBody\n   * (for binary data, its content is different from responseText).\n   * In IE 10, the 'charset=x-user-defined' trick doesn't work, only the\n   * responseType will work :\n   * http://msdn.microsoft.com/en-us/library/ie/hh673569%28v=vs.85%29.aspx#Binary_Object_upload_and_download\n   *\n   * I'd like to use jQuery to avoid this XHR madness, but it doesn't support\n   * the responseType attribute : http://bugs.jquery.com/ticket/11461\n   */\n  try {\n    var xhr = createXHR();\n    xhr.open(\"GET\", path, true); // recent browsers\n\n    if (\"responseType\" in xhr) {\n      xhr.responseType = \"arraybuffer\";\n    } // older browser\n\n\n    if (xhr.overrideMimeType) {\n      xhr.overrideMimeType(\"text/plain; charset=x-user-defined\");\n    }\n\n    xhr.onreadystatechange = function (evt) {\n      var file, err; // use `xhr` and not `this`... thanks IE\n\n      if (xhr.readyState === 4) {\n        if (xhr.status === 200 || xhr.status === 0) {\n          file = null;\n          err = null;\n\n          try {\n            file = PizZipUtils._getBinaryFromXHR(xhr);\n          } catch (e) {\n            err = new Error(e);\n          }\n\n          callback(err, file);\n        } else {\n          callback(new Error(\"Ajax error for \" + path + \" : \" + this.status + \" \" + this.statusText), null);\n        }\n      }\n    };\n\n    xhr.send();\n  } catch (e) {\n    callback(new Error(e), null);\n  }\n};\n\nmodule.exports = PizZipUtils;\n\n//# sourceURL=webpack://PizZipUtils/./es6/index.js?");

                /***/
            })

        /******/
    });