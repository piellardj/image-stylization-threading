var Page;
(function (Page) {
    var Demopage;
    (function (Demopage) {
        var errorsBlockId = "error-messages";
        var errorsBlock = document.getElementById(errorsBlockId);
        if (!errorsBlock) {
            throw new Error("Cannot find element '" + errorsBlockId + "'.");
        }
        function getErrorById(id) {
            if (errorsBlock) {
                return errorsBlock.querySelector("span[id=error-message-" + id + "]");
            }
            return null;
        }
        function setErrorMessage(id, message) {
            if (errorsBlock) {
                var existingSpan = getErrorById(id);
                if (existingSpan) {
                    existingSpan.innerHTML = message;
                    return;
                }
                else {
                    var newSpan = document.createElement("span");
                    newSpan.id = "error-message-" + id;
                    newSpan.innerText = message;
                    errorsBlock.appendChild(newSpan);
                    errorsBlock.appendChild(document.createElement("br"));
                }
            }
        }
        Demopage.setErrorMessage = setErrorMessage;
        function removeErrorMessage(id) {
            if (errorsBlock) {
                var span = getErrorById(id);
                if (span) {
                    var br = span.nextElementSibling;
                    if (br) {
                        errorsBlock.removeChild(br);
                    }
                    errorsBlock.removeChild(span);
                }
            }
        }
        Demopage.removeErrorMessage = removeErrorMessage;
    })(Demopage = Page.Demopage || (Page.Demopage = {}));
})(Page || (Page = {}));

var Page;
(function (Page) {
    var Helpers;
    (function (Helpers) {
        var Utils;
        (function (Utils) {
            function selectorAll(base, selector) {
                var elements = base.querySelectorAll(selector);
                var result = [];
                for (var i = 0; i < elements.length; i++) {
                    result.push(elements[i]);
                }
                return result;
            }
            Utils.selectorAll = selectorAll;
            /** @throws if no element was found */
            function selector(base, selector) {
                var element = base.querySelector(selector);
                if (!element) {
                    throw new Error("No element matching '".concat(selector, "'."));
                }
                return element;
            }
            Utils.selector = selector;
            function touchArray(touchList) {
                var result = [];
                for (var i = 0; i < touchList.length; i++) {
                    result.push(touchList[i]);
                }
                return result;
            }
            Utils.touchArray = touchArray;
            function findFirst(array, predicate) {
                if (typeof Array.prototype.findIndex === "function") {
                    return array.findIndex(predicate);
                }
                else {
                    for (var i = 0; i < array.length; i++) {
                        if (predicate(array[i])) {
                            return i;
                        }
                    }
                    return -1;
                }
            }
            Utils.findFirst = findFirst;
        })(Utils = Helpers.Utils || (Helpers.Utils = {}));
        var URL;
        (function (URL) {
            var PARAMETERS_PREFIX = "page";
            var URLBuilder = /** @class */ (function () {
                function URLBuilder(url) {
                    this.queryParameters = {};
                    var queryStringDelimiterIndex = url.indexOf(URLBuilder.queryDelimiter);
                    if (queryStringDelimiterIndex < 0) {
                        this.baseUrl = url;
                    }
                    else {
                        this.baseUrl = url.substring(0, queryStringDelimiterIndex);
                        var queryString = url.substring(queryStringDelimiterIndex + URLBuilder.queryDelimiter.length);
                        var splitParameters = queryString.split(URLBuilder.parameterDelimiter);
                        for (var _i = 0, splitParameters_1 = splitParameters; _i < splitParameters_1.length; _i++) {
                            var parameter = splitParameters_1[_i];
                            var keyValue = parameter.split(URLBuilder.keyValueDelimiter);
                            if (keyValue.length === 2) {
                                var key = decodeURIComponent(keyValue[0]);
                                var value = decodeURIComponent(keyValue[1]);
                                this.queryParameters[key] = value;
                            }
                            else {
                                console.log("Unable to parse query string parameter '" + parameter + "'.");
                            }
                        }
                    }
                }
                URLBuilder.prototype.setQueryParameter = function (name, value) {
                    if (value === null) {
                        delete this.queryParameters[name];
                    }
                    else {
                        this.queryParameters[name] = value;
                    }
                };
                URLBuilder.prototype.loopOnParameters = function (prefix, callback) {
                    for (var _i = 0, _a = Object.keys(this.queryParameters); _i < _a.length; _i++) {
                        var parameterName = _a[_i];
                        if (parameterName.indexOf(prefix) === 0 && parameterName.length > prefix.length) {
                            var parameterValue = this.queryParameters[parameterName];
                            var shortParameterName = parameterName.substring(prefix.length);
                            callback(shortParameterName, parameterValue);
                        }
                    }
                };
                URLBuilder.prototype.buildUrl = function () {
                    var parameters = [];
                    for (var _i = 0, _a = Object.keys(this.queryParameters); _i < _a.length; _i++) {
                        var parameterName = _a[_i];
                        var parameterValue = this.queryParameters[parameterName];
                        var encodedName = encodeURIComponent(parameterName);
                        var encodedValue = encodeURIComponent(parameterValue);
                        parameters.push(encodedName + URLBuilder.keyValueDelimiter + encodedValue);
                    }
                    var queryString = parameters.join(URLBuilder.parameterDelimiter);
                    if (queryString) {
                        return this.baseUrl + URLBuilder.queryDelimiter + queryString;
                    }
                    else {
                        return this.baseUrl;
                    }
                };
                URLBuilder.queryDelimiter = "?";
                URLBuilder.parameterDelimiter = "&";
                URLBuilder.keyValueDelimiter = "=";
                return URLBuilder;
            }());
            function buildPrefix() {
                var prefixes = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    prefixes[_i] = arguments[_i];
                }
                return prefixes.join(":") + ":";
            }
            function updateUrl(newUrl) {
                window.history.replaceState("", "", newUrl);
            }
            function loopOnParameters(prefix, callback) {
                var urlBuilder = new URLBuilder(window.location.href);
                var fullPrefix = buildPrefix(PARAMETERS_PREFIX, prefix);
                urlBuilder.loopOnParameters(fullPrefix, callback);
            }
            URL.loopOnParameters = loopOnParameters;
            function setQueryParameter(prefix, name, value) {
                var urlBuilder = new URLBuilder(window.location.href);
                var fullPrefix = buildPrefix(PARAMETERS_PREFIX, prefix);
                urlBuilder.setQueryParameter(fullPrefix + name, value);
                updateUrl(urlBuilder.buildUrl());
            }
            URL.setQueryParameter = setQueryParameter;
            function removeQueryParameter(prefix, name) {
                var urlBuilder = new URLBuilder(window.location.href);
                var fullPrefix = buildPrefix(PARAMETERS_PREFIX, prefix);
                urlBuilder.setQueryParameter(fullPrefix + name, null);
                updateUrl(urlBuilder.buildUrl());
            }
            URL.removeQueryParameter = removeQueryParameter;
        })(URL = Helpers.URL || (Helpers.URL = {}));
        var Events;
        (function (Events) {
            function callAfterDOMLoaded(callback) {
                if (document.readyState === "loading") { // Loading hasn't finished yet
                    document.addEventListener("DOMContentLoaded", callback);
                }
                else { // `DOMContentLoaded` has already fired
                    callback();
                }
            }
            Events.callAfterDOMLoaded = callAfterDOMLoaded;
        })(Events = Helpers.Events || (Helpers.Events = {}));
        var Cache = /** @class */ (function () {
            function Cache(objectsName, loadObjectsFunction) {
                this.objectsName = objectsName;
                this.loadObjectsFunction = loadObjectsFunction;
                this.cacheObject = null;
            }
            /** @throws An Error if the ID is unknown */
            Cache.prototype.getById = function (id) {
                var object = this.safeCacheObject[id];
                if (!object) {
                    throw new Error("Invalid '".concat(this.objectsName, "' cache object id '").concat(id, "'."));
                }
                return object;
            };
            /** @returns null if the ID is unknown */
            Cache.prototype.getByIdSafe = function (id) {
                return this.safeCacheObject[id] || null;
            };
            Cache.prototype.load = function () {
                if (!this.cacheObject) {
                    this.cacheObject = this.loadCacheObject();
                }
            };
            Object.defineProperty(Cache.prototype, "safeCacheObject", {
                get: function () {
                    if (!this.cacheObject) {
                        this.load();
                    }
                    return this.cacheObject;
                },
                enumerable: false,
                configurable: true
            });
            Cache.prototype.loadCacheObject = function () {
                var index = {};
                var objects = this.loadObjectsFunction();
                for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
                    var object = objects_1[_i];
                    if (typeof index[object.id] !== "undefined") {
                        throw new Error("Object '".concat(object.id, "' is already in cache."));
                    }
                    index[object.id] = object;
                }
                return index;
            };
            return Cache;
        }());
        Helpers.Cache = Cache;
        var Storage = /** @class */ (function () {
            function Storage(prefix, serialize, tryDeserialize) {
                this.prefix = prefix;
                this.serialize = serialize;
                this.tryDeserialize = tryDeserialize;
            }
            Storage.prototype.storeState = function (control) {
                var valueAsString = this.serialize(control);
                Page.Helpers.URL.setQueryParameter(this.prefix, control.id, valueAsString);
            };
            Storage.prototype.clearStoredState = function (control) {
                Page.Helpers.URL.removeQueryParameter(this.prefix, control.id);
            };
            Storage.prototype.applyStoredState = function () {
                var _this = this;
                Page.Helpers.URL.loopOnParameters(this.prefix, function (controlId, value) {
                    if (!_this.tryDeserialize(controlId, value)) {
                        console.log("Removing invalid query parameter '" + controlId + "=" + value + "'.");
                        Page.Helpers.URL.removeQueryParameter(_this.prefix, controlId);
                    }
                });
            };
            return Storage;
        }());
        Helpers.Storage = Storage;
    })(Helpers = Page.Helpers || (Page.Helpers = {}));
})(Page || (Page = {}));


var Page;
(function (Page) {
    var Controls;
    (function (Controls) {
        function getElementBySelector(selector) {
            var elt = document.querySelector(selector);
            if (!elt) {
                console.error("Cannot find control '" + selector + "'.");
            }
            return elt;
        }
        function setVisibility(id, visible) {
            var control = getElementBySelector("div#control-" + id);
            if (control) {
                control.style.display = visible ? "" : "none";
            }
        }
        Controls.setVisibility = setVisibility;
    })(Controls = Page.Controls || (Page.Controls = {}));
})(Page || (Page = {}));
(function (Page) {
    var Sections;
    (function (Sections) {
        function getElementBySelector(selector) {
            var elt = document.querySelector(selector);
            if (!elt) {
                console.error("Cannot find section '" + selector + "'.");
            }
            return elt;
        }
        function reevaluateSeparatorsVisibility(controlsBlockElement) {
            function isHr(element) {
                return element.tagName.toLowerCase() === "hr";
            }
            function isVisible(element) {
                return element.style.display !== "none";
            }
            var sectionsOrHr = Page.Helpers.Utils.selectorAll(controlsBlockElement, "section, hr");
            //remove duplicate HRs
            var lastWasHr = false;
            for (var _i = 0, sectionsOrHr_1 = sectionsOrHr; _i < sectionsOrHr_1.length; _i++) {
                var sectionOrHr = sectionsOrHr_1[_i];
                if (isHr(sectionOrHr)) {
                    sectionOrHr.style.display = lastWasHr ? "none" : "";
                    lastWasHr = true;
                }
                else if (isVisible(sectionOrHr)) {
                    lastWasHr = false;
                }
            }
            // remove leading HRs
            for (var _a = 0, sectionsOrHr_2 = sectionsOrHr; _a < sectionsOrHr_2.length; _a++) {
                var sectionOrHr = sectionsOrHr_2[_a];
                if (isHr(sectionOrHr)) {
                    sectionOrHr.style.display = "none";
                }
                else if (isVisible(sectionOrHr)) {
                    break;
                }
            }
            // remove trailing HRs
            for (var i = sectionsOrHr.length - 1; i >= 0; i--) {
                var sectionOrHr = sectionsOrHr[i];
                if (isHr(sectionOrHr)) {
                    sectionOrHr.style.display = "none";
                }
                else if (isVisible(sectionOrHr)) {
                    break;
                }
            }
        }
        function setVisibility(id, visible) {
            var section = getElementBySelector("section#section-" + id);
            if (section && section.parentElement) {
                section.style.display = visible ? "" : "none";
                reevaluateSeparatorsVisibility(section.parentElement);
            }
        }
        Sections.setVisibility = setVisibility;
    })(Sections = Page.Sections || (Page.Sections = {}));
})(Page || (Page = {}));

var Page;
(function (Page) {
    var FileControl;
    (function (FileControl) {
        var FileUpload = /** @class */ (function () {
            function FileUpload(container) {
                var _this = this;
                this.observers = [];
                this.inputElement = Page.Helpers.Utils.selector(container, "input");
                this.labelSpanElement = Page.Helpers.Utils.selector(container, "label > span");
                this.id = this.inputElement.id;
                this.inputElement.addEventListener("change", function (event) {
                    event.stopPropagation();
                    var files = _this.inputElement.files;
                    if (files && files.length === 1) {
                        _this.labelSpanElement.innerText = FileUpload.truncate(files[0].name);
                        for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                            var observer = _a[_i];
                            observer(files);
                        }
                    }
                }, false);
            }
            FileUpload.prototype.clear = function () {
                this.inputElement.value = "";
                this.labelSpanElement.innerText = this.labelSpanElement.dataset["placeholder"] || "Upload";
            };
            FileUpload.truncate = function (name) {
                if (name.length > FileUpload.filenameMaxSize) {
                    return name.substring(0, FileUpload.filenameMaxSize - 1) + "..." +
                        name.substring(name.length - (FileUpload.filenameMaxSize - 1));
                }
                return name;
            };
            FileUpload.filenameMaxSize = 16;
            return FileUpload;
        }());
        var FileDownload = /** @class */ (function () {
            function FileDownload(container) {
                var _this = this;
                this.observers = [];
                this.buttonElement = Page.Helpers.Utils.selector(container, "input");
                this.id = this.buttonElement.id;
                this.buttonElement.addEventListener("click", function (event) {
                    event.stopPropagation();
                    for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                        var observer = _a[_i];
                        observer();
                    }
                }, false);
            }
            return FileDownload;
        }());
        var fileUploadsCache = new Page.Helpers.Cache("FileUpload", function () {
            var selector = ".file-control.upload > input[id]";
            var fileUploadInputsElements = Page.Helpers.Utils.selectorAll(document, selector);
            return fileUploadInputsElements.map(function (fileUploadInputsElement) {
                var container = fileUploadInputsElement.parentElement;
                var fileUpload = new FileUpload(container);
                return fileUpload;
            });
        });
        var fileDownloadsCache = new Page.Helpers.Cache("FileDownload", function () {
            var selector = ".file-control.download > input[id]";
            var fileDownloadInputsElements = Page.Helpers.Utils.selectorAll(document, selector);
            return fileDownloadInputsElements.map(function (fileDownloadInputsElement) {
                var container = fileDownloadInputsElement.parentElement;
                return new FileDownload(container);
            });
        });
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            fileUploadsCache.load();
            fileUploadsCache.load();
        });
        function addDownloadObserver(id, observer) {
            var fileDownload = fileDownloadsCache.getById(id);
            fileDownload.observers.push(observer);
        }
        FileControl.addDownloadObserver = addDownloadObserver;
        function addUploadObserver(id, observer) {
            var fileUpload = fileUploadsCache.getById(id);
            fileUpload.observers.push(observer);
        }
        FileControl.addUploadObserver = addUploadObserver;
        function clearFileUpload(id) {
            var fileUpload = fileUploadsCache.getById(id);
            fileUpload.clear();
        }
        FileControl.clearFileUpload = clearFileUpload;
    })(FileControl = Page.FileControl || (Page.FileControl = {}));
})(Page || (Page = {}));


var Page;
(function (Page) {
    var Tabs;
    (function (Tabs_1) {
        var Tabs = /** @class */ (function () {
            function Tabs(container) {
                var _this = this;
                this.observers = [];
                this.id = Tabs.computeShortId(container.id);
                this.inputElements = [];
                var inputElements = Page.Helpers.Utils.selectorAll(container, "input");
                for (var _i = 0, inputElements_1 = inputElements; _i < inputElements_1.length; _i++) {
                    var inputElement = inputElements_1[_i];
                    this.inputElements.push(inputElement);
                    inputElement.addEventListener("change", function (event) {
                        event.stopPropagation();
                        _this.reloadValues();
                        tabsStorage.storeState(_this);
                        _this.callObservers();
                    }, false);
                }
                this.reloadValues();
            }
            Tabs.computeShortId = function (fullId) {
                if (fullId.lastIndexOf(Tabs.ID_SUFFIX) != fullId.length - Tabs.ID_SUFFIX.length) {
                    throw new Error("Invalid tabs container id: '" + fullId + "'.");
                }
                return fullId.substring(0, fullId.length - Tabs.ID_SUFFIX.length);
            };
            Object.defineProperty(Tabs.prototype, "values", {
                get: function () {
                    return this._values;
                },
                set: function (newValues) {
                    for (var _i = 0, _a = this.inputElements; _i < _a.length; _i++) {
                        var inputElement = _a[_i];
                        var isWanted = false;
                        for (var _b = 0, newValues_1 = newValues; _b < newValues_1.length; _b++) {
                            var newValue = newValues_1[_b];
                            if (inputElement.value === newValue) {
                                isWanted = true;
                                break;
                            }
                        }
                        inputElement.checked = isWanted;
                    }
                    this.reloadValues();
                },
                enumerable: false,
                configurable: true
            });
            Tabs.prototype.callObservers = function () {
                for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    observer(this._values);
                }
            };
            Tabs.prototype.reloadValues = function () {
                var values = [];
                for (var _i = 0, _a = this.inputElements; _i < _a.length; _i++) {
                    var inputElement = _a[_i];
                    if (inputElement.checked) {
                        values.push(inputElement.value);
                    }
                }
                this._values = values;
            };
            Tabs.ID_SUFFIX = "-id";
            return Tabs;
        }());
        var tabsCache = new Page.Helpers.Cache("Tabs", function () {
            var containerElements = Page.Helpers.Utils.selectorAll(document, "div.tabs[id]");
            return containerElements.map(function (containerElement) {
                return new Tabs(containerElement);
            });
        });
        var tabsStorage = new Page.Helpers.Storage("tabs", function (tabs) {
            var valuesList = tabs.values;
            return valuesList.join(";");
        }, function (id, serializedValue) {
            var values = serializedValue.split(";");
            var tabs = tabsCache.getByIdSafe(id);
            if (tabs) {
                tabs.values = values;
                tabs.callObservers();
                return true;
            }
            return false;
        });
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            tabsCache.load();
            tabsStorage.applyStoredState();
        });
        function addObserver(tabsId, observer) {
            var tabs = tabsCache.getById(tabsId);
            tabs.observers.push(observer);
        }
        Tabs_1.addObserver = addObserver;
        function getValues(tabsId) {
            var tabs = tabsCache.getById(tabsId);
            return tabs.values;
        }
        Tabs_1.getValues = getValues;
        function setValues(tabsId, values, updateURLStorage) {
            if (updateURLStorage === void 0) { updateURLStorage = false; }
            var tabs = tabsCache.getById(tabsId);
            tabs.values = values;
            if (updateURLStorage) {
                tabsStorage.storeState(tabs);
            }
        }
        Tabs_1.setValues = setValues;
        function storeState(tabsId) {
            var tabs = tabsCache.getById(tabsId);
            tabsStorage.storeState(tabs);
        }
        Tabs_1.storeState = storeState;
        function clearStoredState(tabsIdd) {
            var tabs = tabsCache.getById(tabsIdd);
            tabsStorage.clearStoredState(tabs);
        }
        Tabs_1.clearStoredState = clearStoredState;
    })(Tabs = Page.Tabs || (Page.Tabs = {}));
})(Page || (Page = {}));


var Page;
(function (Page) {
    var Range;
    (function (Range_1) {
        var Range = /** @class */ (function () {
            function Range(container) {
                var _this = this;
                this.onInputObservers = [];
                this.onChangeObservers = [];
                this.inputElement = Page.Helpers.Utils.selector(container, "input[type='range']");
                this.progressLeftElement = Page.Helpers.Utils.selector(container, ".range-progress-left");
                this.tooltipElement = Page.Helpers.Utils.selector(container, "output.range-tooltip");
                this.id = this.inputElement.id;
                var inputMin = +this.inputElement.min;
                var inputMax = +this.inputElement.max;
                var inputStep = +this.inputElement.step;
                this.nbDecimalsToDisplay = Range.getMaxNbDecimals(inputMin, inputMax, inputStep);
                this.inputElement.addEventListener("input", function (event) {
                    event.stopPropagation();
                    _this.reloadValue();
                    _this.callSpecificObservers(_this.onInputObservers);
                });
                this.inputElement.addEventListener("change", function (event) {
                    event.stopPropagation();
                    _this.reloadValue();
                    rangesStorage.storeState(_this);
                    _this.callSpecificObservers(_this.onChangeObservers);
                });
                this.reloadValue();
            }
            Object.defineProperty(Range.prototype, "value", {
                get: function () {
                    return this._value;
                },
                set: function (newValue) {
                    this.inputElement.value = "" + newValue;
                    this.reloadValue();
                },
                enumerable: false,
                configurable: true
            });
            Range.prototype.callObservers = function () {
                this.callSpecificObservers(this.onInputObservers);
                this.callSpecificObservers(this.onChangeObservers);
            };
            Range.prototype.callSpecificObservers = function (observers) {
                for (var _i = 0, observers_1 = observers; _i < observers_1.length; _i++) {
                    var observer = observers_1[_i];
                    observer(this.value);
                }
            };
            Range.prototype.updateAppearance = function () {
                var currentLength = +this.inputElement.value - +this.inputElement.min;
                var totalLength = +this.inputElement.max - +this.inputElement.min;
                var progression = currentLength / totalLength;
                progression = Math.max(0, Math.min(1, progression));
                this.progressLeftElement.style.width = (100 * progression) + "%";
                var text;
                if (this.nbDecimalsToDisplay < 0) {
                    text = this.inputElement.value;
                }
                else {
                    text = (+this.inputElement.value).toFixed(this.nbDecimalsToDisplay);
                }
                this.tooltipElement.textContent = text;
            };
            Range.prototype.reloadValue = function () {
                this._value = +this.inputElement.value;
                this.updateAppearance();
            };
            Range.getMaxNbDecimals = function () {
                var numbers = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    numbers[_i] = arguments[_i];
                }
                var nbDecimals = -1;
                for (var _a = 0, numbers_1 = numbers; _a < numbers_1.length; _a++) {
                    var n = numbers_1[_a];
                    var local = Range.nbDecimals(n);
                    if (n < 0) {
                        return -1;
                    }
                    else if (nbDecimals < local) {
                        nbDecimals = local;
                    }
                }
                return nbDecimals;
            };
            Range.nbDecimals = function (x) {
                var xAsString = x.toString();
                if (/^[0-9]+$/.test(xAsString)) {
                    return 0;
                }
                else if (/^[0-9]+\.[0-9]+$/.test(xAsString)) {
                    return xAsString.length - (xAsString.indexOf(".") + 1);
                }
                return -1; // failed to parse
            };
            return Range;
        }());
        var rangesCache = new Page.Helpers.Cache("Range", function () {
            var selector = ".range-container > input[type='range']";
            var rangeElements = Page.Helpers.Utils.selectorAll(document, selector);
            return rangeElements.map(function (rangeElement) {
                var container = rangeElement.parentElement;
                return new Range(container);
            });
        });
        var rangesStorage = new Page.Helpers.Storage("range", function (range) {
            return "" + range.value;
        }, function (id, serializedValue) {
            var range = rangesCache.getByIdSafe(id);
            if (range) {
                range.value = +serializedValue;
                range.callObservers();
                return true;
            }
            return false;
        });
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            rangesCache.load();
            rangesStorage.applyStoredState();
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        function addObserver(rangeId, observer) {
            var range = rangesCache.getById(rangeId);
            if (isIE11) { // bug in IE 11, input event is never fired
                range.onChangeObservers.push(observer);
            }
            else {
                range.onInputObservers.push(observer);
            }
        }
        Range_1.addObserver = addObserver;
        /**
         * Callback will be called only when the value stops changing.
         */
        function addLazyObserver(rangeId, observer) {
            var range = rangesCache.getById(rangeId);
            range.onChangeObservers.push(observer);
        }
        Range_1.addLazyObserver = addLazyObserver;
        function getValue(rangeId) {
            var range = rangesCache.getById(rangeId);
            return range.value;
        }
        Range_1.getValue = getValue;
        function setValue(rangeId, value) {
            var range = rangesCache.getById(rangeId);
            range.value = value;
        }
        Range_1.setValue = setValue;
        function storeState(rangeId) {
            var range = rangesCache.getById(rangeId);
            rangesStorage.storeState(range);
        }
        Range_1.storeState = storeState;
        function clearStoredState(rangeId) {
            var range = rangesCache.getById(rangeId);
            rangesStorage.clearStoredState(range);
        }
        Range_1.clearStoredState = clearStoredState;
    })(Range = Page.Range || (Page.Range = {}));
})(Page || (Page = {}));


var Page;
(function (Page) {
    var Checkbox;
    (function (Checkbox_1) {
        var Checkbox = /** @class */ (function () {
            function Checkbox(element) {
                var _this = this;
                this.observers = [];
                this.id = element.id;
                this.element = element;
                this.reloadValue();
                this.element.addEventListener("change", function () {
                    _this.reloadValue();
                    checkboxesStorage.storeState(_this);
                    _this.callObservers();
                });
            }
            Object.defineProperty(Checkbox.prototype, "checked", {
                get: function () {
                    return this._checked;
                },
                set: function (newChecked) {
                    this.element.checked = newChecked;
                    this.reloadValue();
                },
                enumerable: false,
                configurable: true
            });
            Checkbox.prototype.callObservers = function () {
                for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    observer(this.checked);
                }
            };
            Checkbox.prototype.reloadValue = function () {
                this._checked = this.element.checked;
            };
            return Checkbox;
        }());
        var checkboxesCache = new Page.Helpers.Cache("Checkbox", function () {
            var selector = "div.checkbox > input[type=checkbox][id]";
            var elements = Page.Helpers.Utils.selectorAll(document, selector);
            return elements.map(function (element) {
                return new Checkbox(element);
            });
        });
        var checkboxesStorage = new Page.Helpers.Storage("checkbox", function (checkbox) {
            return checkbox.checked ? "true" : "false";
        }, function (id, serializedValue) {
            var checkbox = checkboxesCache.getByIdSafe(id);
            if (checkbox && (serializedValue === "true" || serializedValue === "false")) {
                checkbox.checked = (serializedValue === "true");
                checkbox.callObservers();
                return true;
            }
            return false;
        });
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            checkboxesCache.load();
            checkboxesStorage.applyStoredState();
        });
        function addObserver(checkboxId, observer) {
            var checkbox = checkboxesCache.getById(checkboxId);
            checkbox.observers.push(observer);
        }
        Checkbox_1.addObserver = addObserver;
        function setChecked(checkboxId, value) {
            var checkbox = checkboxesCache.getById(checkboxId);
            checkbox.checked = value;
        }
        Checkbox_1.setChecked = setChecked;
        function isChecked(checkboxId) {
            var checkbox = checkboxesCache.getById(checkboxId);
            return checkbox.checked;
        }
        Checkbox_1.isChecked = isChecked;
        function storeState(checkboxId) {
            var checkbox = checkboxesCache.getById(checkboxId);
            checkboxesStorage.storeState(checkbox);
        }
        Checkbox_1.storeState = storeState;
        function clearStoredState(checkboxId) {
            var checkbox = checkboxesCache.getById(checkboxId);
            checkboxesStorage.clearStoredState(checkbox);
        }
        Checkbox_1.clearStoredState = clearStoredState;
    })(Checkbox = Page.Checkbox || (Page.Checkbox = {}));
})(Page || (Page = {}));



var Page;
(function (Page) {
    var Canvas;
    (function (Canvas) {
        function getElementBySelector(selector) {
            var elt = document.querySelector(selector);
            if (!elt) {
                console.error("Cannot find element '" + selector + "'.");
            }
            return elt;
        }
        function getCanvasById(id) {
            return Page.Helpers.Utils.selector(document, "canvas[id=" + id + "]");
        }
        function getCheckboxFromId(id) {
            return Page.Helpers.Utils.selector(document, "input[type=checkbox][id=" + id + "]");
        }
        var canvasContainer = Page.Helpers.Utils.selector(document, "#canvas-container");
        var canvas = getCanvasById("canvas");
        var buttonsColumn = Page.Helpers.Utils.selector(document, "#canvas-buttons-column");
        var fullscreenCheckbox = getCheckboxFromId("fullscreen-checkbox-id");
        var sidePaneCheckbox = getCheckboxFromId("side-pane-checkbox-id");
        var loader = Page.Helpers.Utils.selector(canvasContainer, ".loader");
        var maxWidth = 512;
        var maxHeight = 512;
        function bindCanvasButtons() {
            function hideOverflow(value) {
                document.body.style.overflow = value ? "hidden" : "auto";
            }
            if (fullscreenCheckbox) {
                Page.Helpers.Events.callAfterDOMLoaded(function () {
                    hideOverflow(fullscreenCheckbox.checked);
                    fullscreenCheckbox.addEventListener("change", function () {
                        hideOverflow(fullscreenCheckbox.checked);
                    });
                });
                if (sidePaneCheckbox) {
                    fullscreenCheckbox.addEventListener("change", function () {
                        if (fullscreenCheckbox.checked) {
                            sidePaneCheckbox.checked = false;
                        }
                    }, false);
                }
            }
        }
        bindCanvasButtons();
        function getCanvasSize() {
            var rect = canvas.getBoundingClientRect();
            return [Math.floor(rect.width), Math.floor(rect.height)];
        }
        var lastCanvasSize = [0, 0];
        var canvasResizeObservers = [];
        function inPx(size) {
            return size + "px";
        }
        /**
         * Calls callbacks if needed.
         */
        function updateCanvasSize() {
            canvasContainer.style.width = "100vw";
            var size = getCanvasSize();
            if (fullscreenCheckbox.checked) {
                canvasContainer.style.height = "100%";
                canvasContainer.style.maxWidth = "";
                canvasContainer.style.maxHeight = "";
            }
            else {
                size[1] = size[0] * maxHeight / maxWidth;
                canvasContainer.style.height = inPx(size[1]);
                canvasContainer.style.maxWidth = inPx(maxWidth);
                canvasContainer.style.maxHeight = inPx(maxHeight);
            }
            if (size[0] !== lastCanvasSize[0] || size[1] !== lastCanvasSize[1]) {
                lastCanvasSize = getCanvasSize();
                for (var _i = 0, canvasResizeObservers_1 = canvasResizeObservers; _i < canvasResizeObservers_1.length; _i++) {
                    var observer = canvasResizeObservers_1[_i];
                    observer(lastCanvasSize[0], lastCanvasSize[1]);
                }
            }
        }
        Page.Helpers.Events.callAfterDOMLoaded(updateCanvasSize);
        fullscreenCheckbox.addEventListener("change", updateCanvasSize, false);
        window.addEventListener("resize", updateCanvasSize, false);
        var fullscreenToggleObservers = [updateCanvasSize];
        var mouseDownObservers = [];
        var mouseUpObservers = [];
        var mouseDragObservers = [];
        var mouseMoveObservers = [];
        var mouseEnterObservers = [];
        var mouseLeaveObservers = [];
        var mouseWheelObservers = [];
        /* Bind fullscreen events */
        if (fullscreenCheckbox) {
            fullscreenCheckbox.addEventListener("change", function () {
                var isFullscreen = fullscreenCheckbox.checked;
                for (var _i = 0, fullscreenToggleObservers_1 = fullscreenToggleObservers; _i < fullscreenToggleObservers_1.length; _i++) {
                    var observer = fullscreenToggleObservers_1[_i];
                    observer(isFullscreen);
                }
            }, false);
        }
        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 27) {
                Canvas.toggleFullscreen(false);
            }
        });
        function clientToRelative(clientX, clientY) {
            var rect = canvas.getBoundingClientRect();
            return [
                (clientX - rect.left) / rect.width,
                (clientY - rect.top) / rect.height,
            ];
        }
        var Mouse;
        (function (Mouse) {
            var mousePosition = [0, 0];
            var clientMousePosition = [0, 0];
            var isMouseDownInternal = false;
            function getMousePosition() {
                return [mousePosition[0], mousePosition[1]];
            }
            Mouse.getMousePosition = getMousePosition;
            function setMousePosition(x, y) {
                mousePosition[0] = x;
                mousePosition[1] = y;
            }
            Mouse.setMousePosition = setMousePosition;
            function isMouseDown() {
                return isMouseDownInternal;
            }
            Mouse.isMouseDown = isMouseDown;
            function mouseDown(clientX, clientY) {
                var pos = clientToRelative(clientX, clientY);
                setMousePosition(pos[0], pos[1]);
                isMouseDownInternal = true;
                for (var _i = 0, mouseDownObservers_1 = mouseDownObservers; _i < mouseDownObservers_1.length; _i++) {
                    var observer = mouseDownObservers_1[_i];
                    observer();
                }
            }
            Mouse.mouseDown = mouseDown;
            function mouseUp() {
                if (isMouseDownInternal) {
                    isMouseDownInternal = false;
                    for (var _i = 0, mouseUpObservers_1 = mouseUpObservers; _i < mouseUpObservers_1.length; _i++) {
                        var observer = mouseUpObservers_1[_i];
                        observer();
                    }
                }
            }
            Mouse.mouseUp = mouseUp;
            function mouseMove(clientX, clientY) {
                clientMousePosition[0] = clientX;
                clientMousePosition[1] = clientY;
                var newPos = clientToRelative(clientX, clientY);
                var dX = newPos[0] - mousePosition[0];
                var dY = newPos[1] - mousePosition[1];
                // Update the mousePosition before calling the observers,
                // because they might call getMousePosition() and it needs to be up to date.
                mousePosition[0] = newPos[0];
                mousePosition[1] = newPos[1];
                if (isMouseDownInternal) {
                    for (var _i = 0, mouseDragObservers_1 = mouseDragObservers; _i < mouseDragObservers_1.length; _i++) {
                        var observer = mouseDragObservers_1[_i];
                        observer(dX, dY);
                    }
                }
                for (var _a = 0, mouseMoveObservers_1 = mouseMoveObservers; _a < mouseMoveObservers_1.length; _a++) {
                    var observer = mouseMoveObservers_1[_a];
                    observer(newPos[0], newPos[1]);
                }
            }
            Mouse.mouseMove = mouseMove;
            if (canvas) {
                canvas.addEventListener("mousedown", function (event) {
                    if (event.button === 0) {
                        mouseDown(event.clientX, event.clientY);
                    }
                }, false);
                canvas.addEventListener("mouseenter", function () {
                    for (var _i = 0, mouseEnterObservers_1 = mouseEnterObservers; _i < mouseEnterObservers_1.length; _i++) {
                        var observer = mouseEnterObservers_1[_i];
                        observer();
                    }
                }, false);
                canvas.addEventListener("mouseleave", function () {
                    for (var _i = 0, mouseLeaveObservers_1 = mouseLeaveObservers; _i < mouseLeaveObservers_1.length; _i++) {
                        var observer = mouseLeaveObservers_1[_i];
                        observer();
                    }
                }, false);
                canvas.addEventListener("wheel", function (event) {
                    if (mouseWheelObservers.length > 0) {
                        var delta = (event.deltaY > 0) ? 1 : -1;
                        for (var _i = 0, mouseWheelObservers_1 = mouseWheelObservers; _i < mouseWheelObservers_1.length; _i++) {
                            var observer = mouseWheelObservers_1[_i];
                            observer(delta, mousePosition);
                        }
                        event.preventDefault();
                        return false;
                    }
                    return true;
                }, false);
                window.addEventListener("mousemove", function (event) {
                    mouseMove(event.clientX, event.clientY);
                });
                window.addEventListener("mouseup", function (event) {
                    if (event.button === 0) {
                        mouseUp();
                    }
                });
                canvasResizeObservers.push(function () {
                    mouseMove(clientMousePosition[0], clientMousePosition[1]);
                });
            }
        })(Mouse || (Mouse = {}));
        (function Touch() {
            var currentTouches = [];
            var currentDistance = 0; // for pinching management
            function computeDistance(firstTouch, secondTouch) {
                var dX = firstTouch.clientX - secondTouch.clientX;
                var dY = firstTouch.clientY - secondTouch.clientY;
                return Math.sqrt(dX * dX + dY * dY);
            }
            function handleTouchStart(event) {
                var isFirstTouch = (currentTouches.length === 0);
                var changedTouches = Page.Helpers.Utils.touchArray(event.changedTouches);
                for (var _i = 0, changedTouches_1 = changedTouches; _i < changedTouches_1.length; _i++) {
                    var touch = changedTouches_1[_i];
                    var alreadyRegistered = false;
                    for (var _a = 0, currentTouches_1 = currentTouches; _a < currentTouches_1.length; _a++) {
                        var knownTouch = currentTouches_1[_a];
                        if (touch.identifier === knownTouch.id) {
                            alreadyRegistered = true;
                            break;
                        }
                    }
                    if (!alreadyRegistered) {
                        currentTouches.push({
                            id: touch.identifier,
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                        });
                    }
                }
                if (isFirstTouch && currentTouches.length > 0) {
                    var currentTouch = currentTouches[0];
                    Mouse.mouseDown(currentTouch.clientX, currentTouch.clientY);
                }
                else if (currentTouches.length === 2) {
                    currentDistance = computeDistance(currentTouches[0], currentTouches[1]);
                }
            }
            function handleTouchEnd(event) {
                var knewAtLeastOneTouch = (currentTouches.length > 0);
                var changedTouches = Page.Helpers.Utils.touchArray(event.changedTouches);
                for (var _i = 0, changedTouches_2 = changedTouches; _i < changedTouches_2.length; _i++) {
                    var touch = changedTouches_2[_i];
                    for (var iC = 0; iC < currentTouches.length; ++iC) {
                        if (touch.identifier === currentTouches[iC].id) {
                            currentTouches.splice(iC, 1);
                            iC--;
                        }
                    }
                }
                if (currentTouches.length === 1) {
                    var firstTouch = currentTouches[0];
                    var newPos = clientToRelative(firstTouch.clientX, firstTouch.clientY);
                    Mouse.setMousePosition(newPos[0], newPos[1]);
                }
                else if (knewAtLeastOneTouch && currentTouches.length === 0) {
                    Mouse.mouseUp();
                }
            }
            function handleTouchMove(event) {
                var touches = Page.Helpers.Utils.touchArray(event.changedTouches);
                for (var _i = 0, touches_1 = touches; _i < touches_1.length; _i++) {
                    var touch = touches_1[_i];
                    for (var _a = 0, currentTouches_2 = currentTouches; _a < currentTouches_2.length; _a++) {
                        var knownTouch = currentTouches_2[_a];
                        if (touch.identifier === knownTouch.id) {
                            knownTouch.clientX = touch.clientX;
                            knownTouch.clientY = touch.clientY;
                        }
                    }
                }
                var nbObservers = mouseMoveObservers.length + mouseDragObservers.length;
                if (Mouse.isMouseDown() && nbObservers > 0) {
                    event.preventDefault();
                }
                if (currentTouches.length === 1) {
                    var firstTouch = currentTouches[0];
                    Mouse.mouseMove(firstTouch.clientX, firstTouch.clientY);
                }
                else if (currentTouches.length === 2) {
                    var firstTouch = currentTouches[0];
                    var secondTouch = currentTouches[1];
                    var newDistance = computeDistance(firstTouch, secondTouch);
                    var deltaDistance = (currentDistance - newDistance);
                    var zoomFactor = deltaDistance / currentDistance;
                    currentDistance = newDistance;
                    var zoomCenterXClient = 0.5 * (firstTouch.clientX + secondTouch.clientX);
                    var zoomCenterYClient = 0.5 * (firstTouch.clientY + secondTouch.clientY);
                    var zoomCenter = clientToRelative(zoomCenterXClient, zoomCenterYClient);
                    for (var _b = 0, mouseWheelObservers_2 = mouseWheelObservers; _b < mouseWheelObservers_2.length; _b++) {
                        var observer = mouseWheelObservers_2[_b];
                        observer(5 * zoomFactor, zoomCenter);
                    }
                }
            }
            if (canvas) {
                canvas.addEventListener("touchstart", handleTouchStart, false);
                window.addEventListener("touchend", handleTouchEnd);
                window.addEventListener("touchmove", handleTouchMove, { passive: false });
            }
        })();
        var Indicators;
        (function (Indicators) {
            var indicatorSpansCache = {};
            var suffix = "-indicator-id";
            function getIndicator(id) {
                var element = getElementBySelector("#" + id + suffix);
                if (!element) {
                    throw new Error("Could not find indicator '".concat(id, "'."));
                }
                return element;
            }
            Indicators.getIndicator = getIndicator;
            function getIndicatorSpan(id) {
                if (!indicatorSpansCache[id]) { // not yet in cache
                    var fullId = id + suffix;
                    var element = getElementBySelector("#" + fullId + " span");
                    if (!element) {
                        throw new Error("Could not find indicator span '".concat(id, "'."));
                    }
                    indicatorSpansCache[id] = element;
                }
                return indicatorSpansCache[id];
            }
            Indicators.getIndicatorSpan = getIndicatorSpan;
        })(Indicators || (Indicators = {}));
        var Storage;
        (function (Storage) {
            var PREFIX = "canvas";
            var FULLSCREEN_PARAMETER = "fullscreen";
            var SIDE_PANE_PARAMETER = "sidepane";
            var TRUE = "true";
            var FALSE = "false";
            function updateBooleanParameter(name, checked) {
                var value = checked ? TRUE : FALSE;
                Page.Helpers.URL.setQueryParameter(PREFIX, name, value);
            }
            function attachStorageEvents() {
                if (fullscreenCheckbox) {
                    fullscreenCheckbox.addEventListener("change", function () {
                        updateBooleanParameter(FULLSCREEN_PARAMETER, fullscreenCheckbox.checked);
                        Page.Helpers.URL.removeQueryParameter(PREFIX, SIDE_PANE_PARAMETER);
                    });
                }
                if (sidePaneCheckbox) {
                    sidePaneCheckbox.addEventListener("change", function () {
                        updateBooleanParameter(SIDE_PANE_PARAMETER, sidePaneCheckbox.checked);
                    });
                }
            }
            Storage.attachStorageEvents = attachStorageEvents;
            function applyStoredState() {
                Page.Helpers.URL.loopOnParameters(PREFIX, function (name, value) {
                    if (name === FULLSCREEN_PARAMETER && (value === TRUE || value === FALSE)) {
                        if (fullscreenCheckbox) {
                            fullscreenCheckbox.checked = (value === TRUE);
                        }
                    }
                    else if (name === SIDE_PANE_PARAMETER && (value === TRUE || value === FALSE)) {
                        if (sidePaneCheckbox) {
                            sidePaneCheckbox.checked = (value === TRUE);
                        }
                    }
                    else {
                        console.log("Removing invalid query parameter '" + name + "=" + value + "'.");
                        Page.Helpers.URL.removeQueryParameter(PREFIX, name);
                    }
                });
            }
            Storage.applyStoredState = applyStoredState;
        })(Storage || (Storage = {}));
        Storage.applyStoredState();
        Storage.attachStorageEvents();
        Canvas.Observers = Object.freeze({
            canvasResize: canvasResizeObservers,
            fullscreenToggle: fullscreenToggleObservers,
            mouseDown: mouseDownObservers,
            mouseDrag: mouseDragObservers,
            mouseEnter: mouseEnterObservers,
            mouseLeave: mouseLeaveObservers,
            mouseMove: mouseMoveObservers,
            mouseWheel: mouseWheelObservers,
            mouseUp: mouseUpObservers,
        });
        function getAspectRatio() {
            var size = getCanvasSize();
            return size[0] / size[1];
        }
        Canvas.getAspectRatio = getAspectRatio;
        function getCanvas() {
            return canvas;
        }
        Canvas.getCanvas = getCanvas;
        function getCanvasContainer() {
            return canvasContainer;
        }
        Canvas.getCanvasContainer = getCanvasContainer;
        function getSize() {
            return getCanvasSize();
        }
        Canvas.getSize = getSize;
        function getMousePosition() {
            return Mouse.getMousePosition();
        }
        Canvas.getMousePosition = getMousePosition;
        function isFullScreen() {
            return fullscreenCheckbox && fullscreenCheckbox.checked;
        }
        Canvas.isFullScreen = isFullScreen;
        function isMouseDown() {
            return Mouse.isMouseDown();
        }
        Canvas.isMouseDown = isMouseDown;
        function setIndicatorText(id, text) {
            var indicator = Indicators.getIndicatorSpan(id);
            if (indicator) {
                indicator.innerText = text;
            }
        }
        Canvas.setIndicatorText = setIndicatorText;
        function setIndicatorVisibility(id, visible) {
            var indicator = Indicators.getIndicator(id);
            if (indicator) {
                indicator.style.display = visible ? "" : "none";
            }
        }
        Canvas.setIndicatorVisibility = setIndicatorVisibility;
        function setIndicatorsVisibility(visible) {
            var indicators = document.getElementById("indicators");
            indicators.style.display = visible ? "" : "none";
        }
        Canvas.setIndicatorsVisibility = setIndicatorsVisibility;
        function setMaxSize(newMaxWidth, newMaxHeight) {
            maxWidth = newMaxWidth;
            maxHeight = newMaxHeight;
            updateCanvasSize();
        }
        Canvas.setMaxSize = setMaxSize;
        function setResizable(resizable) {
            buttonsColumn.style.display = resizable ? "" : "none";
        }
        Canvas.setResizable = setResizable;
        function setLoaderText(text) {
            if (loader) {
                loader.querySelector("span").innerText = text;
            }
        }
        Canvas.setLoaderText = setLoaderText;
        function showLoader(show) {
            if (loader) {
                loader.style.display = (show) ? "block" : "";
            }
        }
        Canvas.showLoader = showLoader;
        function toggleFullscreen(fullscreen) {
            if (fullscreenCheckbox) {
                var needToUpdate = fullscreen !== fullscreenCheckbox.checked;
                if (needToUpdate) {
                    fullscreenCheckbox.checked = fullscreen;
                    if (typeof window.CustomEvent === "function") {
                        fullscreenCheckbox.dispatchEvent(new CustomEvent("change"));
                    }
                    else if (typeof CustomEvent.prototype.initCustomEvent === "function") {
                        var changeEvent = document.createEvent("CustomEvent");
                        changeEvent.initCustomEvent("change", false, false, undefined);
                        fullscreenCheckbox.dispatchEvent(changeEvent);
                    }
                }
            }
        }
        Canvas.toggleFullscreen = toggleFullscreen;
    })(Canvas = Page.Canvas || (Page.Canvas = {}));
})(Page || (Page = {}));

Page.Canvas.setMaxSize(512,512);