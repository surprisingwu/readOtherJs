(function(global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("requires a window with a document");
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
        // 一些属性和方法,可以把一些私有的属性挂到类上
    }
    // 一些工具类的方法
    Spring.prototype = {
        constructor: Spring,
        vision: '0.0.1',
        // 检测数据的类型
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
        // 判断一个对象是否是一个原生的对象(直接继承自Object)
        isPlainObject: function(obj) {
            return this.isObject(obj) && !this.isWindow(obj) && getProto(obj) === Object.prototype
        },
        isObject: function(obj) {
            return this.type(obj) === 'object'
        },
        // 是否可迭代
        isArrayLike: function(obj) {
            var length = !!obj && "length" in obj && obj.length,
                type = this.type(obj);

            if (type === "function" || this.isWindow(obj)) {
                return false;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
        },
        isEmptyObject: function(obj) {
            /* eslint-disable no-unused-vars */
            var name;

            for (name in obj) {
                return false;
            }
            return true;
        },
        /**
         * @params String 要检测对象的构造函数,如'Function'或者'Array'
         */
        _checkObj: function(type) {
            return function(obj) {
                return Object.prototype.toString.call(obj) === '[object ' + type + ']'
            }
        },
        // 转化成数据
        toArray: function(obj) {
            if (this.isArrayLike(obj)) {
                return array.slice.call(obj)
            }
        },
        // 遍历可迭代对象(数组,伪数组,set,map)
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
        // 找到满足条件的某一项
        find: function(arrLike, callback) {
            var ret = '',
                flag = true
            if (this.isArrayLike(arrLike)) {
                arrLike.forEach(function(item, index) {
                    if (callback(item) && flag) {
                        ret = item
                        flag = false
                    }
                })
            }
            return ret
        },
        findIndex: function(arrLike, callback) {
            var ret = -1,
                flag = true
            if (this.isArrayLike(arrLike)) {
                arrLike.forEach(function(item, index) {
                    if (callback(item) && flag) {
                        ret = index
                        flag = false
                    }
                })
            }
            return ret
        }
    }
    Spring.prototype.extend = function() {
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
    Spring.prototype.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(name, i) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });
    Spring.prototype.extend({
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
    Spring.prototype.prefixStyle = function(style) {
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


    //  向外暴露接口
    var spring = new Spring()
    window.spring = spring
    if (typeof define === "function" && define.amd) {
        define("spring", [], function() {
            return spring;
        });
    }
    return spring
})