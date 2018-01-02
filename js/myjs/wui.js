(function(global, factory) {

    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {
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
    var array = []
    var getProto = Object.getPrototypeOf;
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);

    function Spring() {

    }
    Spring.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        // 默认false , true深拷贝
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && !this.isFunction(target)) {
            target = {};
        }
        // 是有一个参数时, 挂载到框架上
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

                    if (deep && copy && (this.isPlainObject(copy) ||
                            (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];

                        } else {
                            clone = src && this.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = this.extend(deep, clone, copy);

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
    Spring.extend({
        each: function(obj, callback) {
            var length, i = 0;

            if (this.isArrayLike(obj)) {
                length = obj.length;
                for (; i < length; i++) {
                    if (callback.call(obj[i], obj[i], i) === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], obj[i], i) === false) {
                        break;
                    }
                }
            }

            return obj;
        },
        isArrayLike: function(obj) {
            var length = !!obj && "length" in obj && obj.length,
                type = this.type(obj);

            if (type === "function" || this.isWindow(obj)) {
                return false;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
        },
        isWindow: function(obj) {
            return obj != null && obj === obj.window;
        },
        type: function(obj) {
            if (obj == null) {
                return obj + "";
            }

            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        },
    })
    Spring.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(name, i) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

    Spring.prototype = {
        constructor: Spring,
        /**
         * @param obj  要检测的数据
         * return boolean
         */
        type: function(obj) {
            return Spring.type.call(this, obj)
        },
        isFunction: function(obj) {
            return this.type(obj) === "function";
        },

        isWindow: function(obj) {
            return Spring.isWindow.call(this, obj)
        },

        isNumeric: function(obj) {

            // As of jQuery 3.0, isNumeric is limited to
            // strings and numbers (primitives or objects)
            // that can be coerced to finite numbers (gh-2662)
            var type = this.type(obj);
            return (type === "number" || type === "string") &&

                // parseFloat NaNs numeric-cast false positives ("")
                // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
                // subtraction forces infinities to NaN
                !isNaN(obj - parseFloat(obj));
        },

        /**
         * @params 判断一个对象是否直接继承自Object
         */
        isPlainObject: function(obj) {
            return this.isObject(obj) && !this.isWindow(obj) && getProto(obj) === Object.prototype
        },
        isObject: function(obj) {
            return this.type(obj) === 'object'
        },
        /**
         * @param 是否可迭代
         */
        isArrayLike: function(obj) {
            return Spring.isArrayLike.call(this, obj)
        },
        /**
         * @params String 要检测对象的构造函数,如'Function'或者'Array'
         */
        _checkObj: function(type) {
            return function(obj) {
                return Object.prototype.toString.call(obj) === '[object ' + type + ']'
            }
        },
        toArray: function(obj) {
            if (this.isArrayLike(obj)) {
                return array.slice.call(obj)
            }
        },
        each: function(obj, callback) {
            Spring.each.call(this, obj, callback)
        },
        /**
         * @params 深拷贝和浅拷贝,参数的格式为(boolean,target,src1,src2...)
         * 只有一个参数对象时,会给spring扩展一个属性
         */
        extend: function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;
            // 默认false , true深拷贝
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[i] || {};
                i++;
            }

            if (typeof target !== "object" && !this.isFunction(target)) {
                target = {};
            }
            // 是有一个参数时, 挂载到框架上
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

                        if (deep && copy && (this.isPlainObject(copy) ||
                                (copyIsArray = Array.isArray(copy)))) {

                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && Array.isArray(src) ? src : [];

                            } else {
                                clone = src && this.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = this.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },
        trim: function(text) {
            return text == null ?
                "" :
                (text + "").replace(rtrim, "");
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