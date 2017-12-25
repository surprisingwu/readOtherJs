(function(global, factory) {

    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {

        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function(window) {

    var arr = [];

    var document = window.document;

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var concat = arr.concat;

    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var fnToString = hasOwn.toString;

    var ObjectFunctionString = fnToString.call(Object);

    function Spring() {

    }
    Spring.prototype = {
        constructor: Spring,
        /**
         * @param obj  要检测的数据
         * return boolean
         */
        type: function(obj) {
            if (obj == null) {
                return obj + "";
            }

            // Support: Android <=2.3 only (functionish RegExp)
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        },
        // 是否直接继承自 OBject
        isPlainObject: function(obj) {
            // 首先排除DOM对象和BOM对象
            if (this.type(obj) !== "object" || obj.nodeType || this.isWindow(obj)) {
                return false;
            }

            if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
            return true
        },
        _checkObj: function(type) {
            return function(obj) {
                return Object.prototype.toString.call(obj) === '[object ' + type + ']'
            }
        },
        extend: function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            if (typeof target === "boolean") {
                deep = target;

                target = arguments[i] || {};
                i++;
            }

            if (typeof target !== "object" && !jQuery.isFunction(target)) {
                target = {};
            }

            if (i === length) {
                target = this;
                i--;
            }

            for (; i < length; i++) {

                if ((options = arguments[i]) != null) {

                    for (name in options) {
                        src = target[name];
                        copy = options[name];


                        if (target === copy) {
                            continue;
                        }

                        if (deep && copy && (jQuery.isPlainObject(copy) ||
                                (copyIsArray = Array.isArray(copy)))) {

                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && Array.isArray(src) ? src : [];

                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = jQuery.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        }
    }




    var spring = function() {
        if (this instanceof Spring) {
            return this
        } else {
            return new Spring()
        }
    }()
    window.spring = spring
    if (typeof define === "function" && define.amd) {
        define("spring", [], function() {
            return spring;
        });
    }
    return spring
})