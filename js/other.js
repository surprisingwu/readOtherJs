(function() {
    var root = this;
    var previousUnderscore = root._;
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;

    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;
    var class2type = {};
    var toString = class2type.toString;



    var Ctor = function() {};

    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };


    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '0.0.1';
    _.prototype = {
        constructor: _,
        version: _.VERSION,
    }
    _.extend = function() {
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
                        target[name] = this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
    _.extend({
        type: function(obj) {
            if (obj == null) {
                return obj + "";
            }

            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        },
        isFunction: function(obj) {
            return this.type(obj) === "function";
        },

        isWindow: function(obj) {
            return obj != null && obj === obj.window;
        },

        isNumeric: function(obj) {
            var type = this.type(obj);
            return (type === "number" || type === "string") &&
                !isNaN(obj - parseFloat(obj));
        },
        isPlainObject: function(obj) {
            return this.isObject(obj) && !this.isWindow(obj) && getProto(obj) === Object.prototype
        },
        isObject: function(obj) {
            return this.type(obj) === 'object'
        },
        isEmptyObject: function(obj) {
            /* eslint-disable no-unused-vars */
            var name;

            for (name in obj) {
                return false;
            }
            return true;
        },
        merge: function(first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },
        makeArray: function(arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArrayLike(Object(arr))) {
                    _.merge(ret,
                        typeof arr === "string" ? [arr] : arr
                    );
                } else {
                    push.call(ret, arr);
                }
            }

            return ret;
        },
        // 转化成数组
        toArray: function(obj) {
            if (this.isArrayLike(obj)) {
                return array.slice.call(obj)
            }
        },
        // 遍历可迭代对象(数组,伪数组,set,map)
        each: function(obj, callback) {
            var length, i = 0;

            if (isArrayLike(obj)) {
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
        /**
         * @param date: 日期对象
         * @param fmt: string  格式化的方式 'yyyy-MM-dd'
         */
        formatDate: function(date, fmt) {
            var o = {
                "M+": date.getMonth() + 1, //月份 
                "d+": date.getDate(), //日 
                "h+": date.getHours(), //小时 
                "m+": date.getMinutes(), //分 
                "s+": date.getSeconds(), //秒 
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                "S": date.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        },
        // 存储数据
        setStorage: function(key, value) {
            var saveObj = window.localStorage._saveObj_;
            if (!saveObj) {
                saveObj = {}
            } else {
                saveObj = JSON.parse(saveObj)
            }
            saveObj[key] = value;
            window.localStorage._saveObj_ = JSON.stringify(saveObj);
        },
        // 获取某一个key, 可以传一个默认值
        getStorage: function(key, def) {
            var saveObj = window.localStorage._saveObj_
            if (!saveObj) {
                return def
            }
            saveObj = JSON.parse(saveObj)
            var ret = saveObj[key]
            return ret || def
        },
        // 从存储中移除某一个key
        removeStorageItem: function(key) {
            var saveObj = window.localStorage._saveObj_;
            if (saveObj) {
                saveObj = JSON.parse(saveObj);
                delete saveObj[key]
                window.localStorage._saveObj_ = JSON.stringify(saveObj)
            }
        },
        // 清除所有的存储
        clearStorage: function() {
            window.localStorage.clear()
        },
        // 获取url里面的一些参数
        getQueryByName: function(name) {
            var params = decodeURI(location.search);
            var result = params.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        }
    })
    _.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(name, i) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

    var _checkObj = function(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']'
        }
    }
    var extend = function(Child, Parent) {
            var F = function() {};　　　　
            F.prototype = Parent.prototype;　　　　
            Child.prototype = new F();　　　　
            Child.prototype.constructor = Child;　　　　
            Child.uber = Parent.prototype;
        }
        // 深拷贝
    var deepCopy = function(source, target) {　
        var target = target || {};　　　　
        for (var i in source) {　　　　　　
            if (typeof source[i] === 'object') {　　　　　　　　
                target[i] = (source[i].constructor === Array) ? [] : {};　　　　　　　　
                deepCopy(source[i], target[i]);　　　　　　
            } else {　　　　　　　　　
                target[i] = source[i];　　　　　　
            }　　　　
        }　　　　
        return target;
    }


    //  是否是一个可迭代的类数组
    function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length,
            type = _.type(obj);

        if (type === "function" || _.isWindow(obj)) {
            return false;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    }
    // 确定运行的环境
    var vendor = function() {
        var elementStyle = document.createElement('div').style;
        var transformNames = {
            webkit: 'webkitTransform',
            Moz: 'MozTransform',
            O: 'OTransform',
            ms: 'msTransform',
            standard: 'transform'
        };

        for (var key in transformNames) {
            if (elementStyle[transformNames[key]] !== undefined) {
                return key;
            }
        }
        return false;
    }();
    // 返回对应的兼容样式
    _.prefixStyle = function(style) {
        if (vendor === false) {
            return false;
        }
        if (vendor === 'standard') {
            if (style === 'transitionEnd') {
                return 'transitionend';
            }
            return style;
        }
        return vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }



    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function() {
        return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function() {
        return '' + this._wrapped;
    };
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function() {
            return _;
        });
    }
}.call(this));