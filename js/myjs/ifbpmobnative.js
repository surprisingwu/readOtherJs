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
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    var arr = [];
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
    var AJAX_TIME_OUT = 20000; // 单位毫秒

    // 直接使用_,可以使用一些工具类的方法,传参时,可以使用一些组件
    var _ = function(obj) {
        // @todo 待修改
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Current version.
    var VERSION = '0.0.1';
    _.version = VERSION
    _.prototype = {
        constructor: _,
        version: _.version,
    }
    /**
     * @param [*boolean] 可传可不传,默认的false
     * @param [*obj] 要添加的静态的方法(对象的形式)
     */
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
        isPlainObject: function(obj) {
            var proto, Ctor;
            if (!obj || toString.call(obj) !== "[object Object]") {
                return false;
            }
            proto = getProto(obj);
            if (!proto) {
                return true;
            }
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
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
                return slice.call(obj)
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
        },
        // 深拷贝 上面的extend也具有深拷贝的作用
        deepCopy: function(source, target) {
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
    })
    _.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(name, i) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

    // var _checkObj = function(type) {
    //     return function(obj) {
    //         return Object.prototype.toString.call(obj) === '[object ' + type + ']'
    //     }
    // }
    // var extend = function(Child, Parent) {
    //     var F = function() {};　　　　
    //     F.prototype = Parent.prototype;　　　　
    //     Child.prototype = new F();　　　　
    //     Child.prototype.constructor = Child;　　　　
    //     Child.uber = Parent.prototype;
    // }

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
        // ajax模块
    var ajax = (function() {
        function ajax(options) {
            var methods = ['get', 'post', 'put', 'delete']
            options = options || {}
            options.baseUrl = options.baseUrl || ''
            if (options.method && options.url) {
                return xhrConnection(
                    options.method,
                    options.baseUrl + options.url,
                    maybeData(options.data),
                    options
                )
            }
            return methods.reduce(function(acc, method) {
                acc[method] = function(url, data) {
                    return xhrConnection(
                        method,
                        options.baseUrl + url,
                        maybeData(data),
                        options
                    )
                }
                return acc
            }, {})
        }

        function maybeData(data) {
            return data || null
        }

        function xhrConnection(type, url, data, options) {
            var returnMethods = ['then', 'catch', 'always']
            var promiseMethods = returnMethods.reduce(function(promise, method) {
                promise[method] = function(callback) {
                    promise[method] = callback
                    return promise
                }
                return promise
            }, {})
            var xhr = new XMLHttpRequest()
            var featuredUrl = getUrlWithData(url, data, type)
            xhr.open(type, featuredUrl, true)
            xhr.timeout = options.timeout || AJAX_TIME_OUT
            xhr.withCredentials = options.hasOwnProperty('withCredentials')
            setHeaders(xhr, options.headers)
            xhr.addEventListener('readystatechange', ready(promiseMethods, xhr), false)
            xhr.send(objectToQueryString(data))
            promiseMethods.abort = function() {
                return xhr.abort()
            }
            return promiseMethods
        }

        function getUrlWithData(url, data, type) {
            if (type.toLowerCase() !== 'get' || !data) {
                return url
            }
            var dataAsQueryString = objectToQueryString(data)
            var queryStringSeparator = url.indexOf('?') > -1 ? '&' : '?'
            return url + queryStringSeparator + dataAsQueryString
        }

        function setHeaders(xhr, headers) {
            headers = headers || {}
            if (!hasContentType(headers)) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            Object.keys(headers).forEach(function(name) {
                (headers[name] && xhr.setRequestHeader(name, headers[name]))
            })
        }

        function hasContentType(headers) {
            return Object.keys(headers).some(function(name) {
                return name.toLowerCase() === 'content-type'
            })
        }

        function ready(promiseMethods, xhr) {
            return function handleReady() {
                if (xhr.readyState === xhr.DONE) {
                    xhr.removeEventListener('readystatechange', handleReady, false)
                    promiseMethods.always.apply(promiseMethods, parseResponse(xhr))

                    if (xhr.status >= 200 && xhr.status < 300) {
                        promiseMethods.then.apply(promiseMethods, parseResponse(xhr))
                    } else {
                        promiseMethods.catch.apply(promiseMethods, parseResponse(xhr))
                    }
                }
            }
        }

        function parseResponse(xhr) {
            var result
            try {
                result = JSON.parse(xhr.responseText)
            } catch (e) {
                result = xhr.responseText
            }
            return [result, xhr]
        }

        function objectToQueryString(data) {
            return isObject(data) ? getQueryString(data) : data
        }

        function isObject(data) {
            return Object.prototype.toString.call(data) === '[object Object]'
        }

        function getQueryString(object) {
            return Object.keys(object).reduce(function(acc, item) {
                var prefix = !acc ? '' : acc + '&'
                return prefix + encode(item) + '=' + encode(object[item])
            }, '')
        }

        function encode(value) {
            return encodeURIComponent(value)
        }

        return ajax
    })()

    // JSBridge 和原生进行交互 
    var WebViewJavascriptBridge = (function(window) {
        if (window.WebViewJavascriptBridge) {
            return;
        }

        var messagingIframe;
        var sendMessageQueue = [];
        var receiveMessageQueue = [];
        var messageHandlers = {};

        var CUSTOM_PROTOCOL_SCHEME = 'yy';
        var QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/';

        var responseCallbacks = {};
        var uniqueId = 1;

        // 创建队列iframe
        function _createQueueReadyIframe(doc) {
            messagingIframe = doc.createElement('iframe');
            messagingIframe.style.display = 'none';
            doc.documentElement.appendChild(messagingIframe);
        }

        // set default messageHandler  初始化默认的消息线程
        function init(messageHandler) {
            if (WebViewJavascriptBridge._messageHandler) {
                throw new Error('WebViewJavascriptBridge.init called twice');
            }
            WebViewJavascriptBridge._messageHandler = messageHandler;
            var receivedMessages = receiveMessageQueue;
            receiveMessageQueue = null;
            for (var i = 0; i < receivedMessages.length; i++) {
                _dispatchMessageFromNative(receivedMessages[i]);
            }
        }

        // 发送
        function send(data, responseCallback) {
            _doSend({
                data: data
            }, responseCallback);
        }

        // 注册线程 往数组里面添加值
        function registerHandler(handlerName, handler) {
            messageHandlers[handlerName] = handler;
        }
        // 调用线程
        function callHandler(handlerName, data, responseCallback) {
            _doSend({
                handlerName: handlerName,
                data: data
            }, responseCallback);
        }

        // sendMessage add message, 触发native处理 sendMessage
        function _doSend(message, responseCallback) {
            if (responseCallback) {
                var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
                responseCallbacks[callbackId] = responseCallback;
                message.callbackId = callbackId;
            }

            sendMessageQueue.push(message);
            messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
        }

        // 提供给native调用,该函数作用:获取sendMessageQueue返回给native,由于android不能直接获取返回的内容,所以使用url shouldOverrideUrlLoading 的方式返回内容
        function _fetchQueue() {
            var messageQueueString = JSON.stringify(sendMessageQueue);
            sendMessageQueue = [];
            //android can't read directly the return data, so we can reload iframe src to communicate with java
            messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString);
        }

        //提供给native使用,
        function _dispatchMessageFromNative(messageJSON) {
            setTimeout(function() {
                var message = JSON.parse(messageJSON);
                var responseCallback;
                //java call finished, now need to call js callback function
                if (message.responseId) {
                    responseCallback = responseCallbacks[message.responseId];
                    if (!responseCallback) {
                        return;
                    }
                    responseCallback(message.responseData);
                    delete responseCallbacks[message.responseId];
                } else {
                    //直接发送
                    if (message.callbackId) {
                        var callbackResponseId = message.callbackId;
                        responseCallback = function(responseData) {
                            _doSend({
                                responseId: callbackResponseId,
                                responseData: responseData
                            });
                        };
                    }

                    var handler = WebViewJavascriptBridge._messageHandler;
                    if (message.handlerName) {
                        handler = messageHandlers[message.handlerName];
                    }
                    //查找指定handler
                    try {
                        handler(message.data, responseCallback);
                    } catch (exception) {
                        if (typeof console != 'undefined') {
                            console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
                        }
                    }
                }
            });
        }

        // 提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
        function _handleMessageFromNative(messageJSON) {
            console.log(messageJSON);
            if (receiveMessageQueue) {
                receiveMessageQueue.push(messageJSON);
            }
            _dispatchMessageFromNative(messageJSON);

        }

        var WebViewJavascriptBridge = window.WebViewJavascriptBridge = {
            init: init,
            send: send,
            registerHandler: registerHandler,
            callHandler: callHandler,
            _fetchQueue: _fetchQueue,
            _handleMessageFromNative: _handleMessageFromNative
        };

        var doc = document;
        _createQueueReadyIframe(doc);
        var readyEvent = doc.createEvent('Events');
        readyEvent.initEvent('WebViewJavascriptBridgeReady');
        readyEvent.bridge = WebViewJavascriptBridge;
        doc.dispatchEvent(readyEvent);

        return WebViewJavascriptBridge
    })(window);

    // 交互部分
    var ERR_OK = 0;
    // 调取原生的方法
    var callNative = function(type, json, success, error) {
        WebViewJavascriptBridge.callHandler(
            type, json,
            function(responseData) {
                alert('原生成功的执行H5的回调')
                // {code:0,body:{}}
                if (responseData.code === ERR_OK) {
                    sucess(responseData.body)
                } else {
                    if (error) {
                        error(responseData)
                    }              
                }
            }
        );
    }
    // 本地注册一个方法,让原生来调
    var registerListener = function(name,callback){
        WebViewJavascriptBridge.registerHandler(name, function(data, callback) {
           callback(data)
        });
    }

    /**
     * 打开相机和相册
     * @param options: {quality: Number,maxWidth:Number,maxHeight:Number,isSync:Boolean}
     * success: 成功的回调
     * error: 失败的回调(超时也走这个逻辑)
     */
    _.each(['openAlbum', 'openCamara'], function(method, index) {
            _[method] = function(options, success, error) {
                var defaultQuality = 0.85,
                    isCut = false,
                    flag = false;
                if (_.isFunction(options)) {
                    error = success
                    success = options
                    options = {}
                }
                if (!options.quality) {
                    options.quality = defaultQuality
                }
                if (!options.isSync) {
                    options.isSync = flag
                }
                if(!options.isCut) {
                    options.isCut = isCut
                }
                callNative(method, options, success, error)
            }
        })
        /**
         * 获取用户信息、获取当前的地理位置、通过原生调取MA,扫描二维码,退出app,监听物理返回键
         * @param {*json} options 传的参数 
         * @param {*function} callback 回调
         * @param {*function} error 回调
         */
    _.each(['getUserInfo', 'callService', 'getGeolocation', 'dimension','exitApp','onWatchBackButton'], function(item, i) {
            _[item] = function(options, success, error) {
                if (_.isFunction(options)) {
                    error = success
                    success = options
                    options = {}
                }
                callNative(item, options, sucess, error)
            }
        })
    _.selectPeople = function(options, success, error) {
        // 1.是否可以跨部门选人 isCrossDepts
        // 2.同部门下选人上限（>=1） maxNumInSameDept
        // 3.选人是否需要部门信息 needDeptInfo
        // 4.给定特定的部门id(若特定部门id传错或者数据表中没有，那么规则？？登录用户的主部门id？)sepicalDept
        // 5.给定已选的人员列表
        var isCrossDepts = true, // 是否可以跨部门选人
            chooseCaps = 1, // 同部门选人的上限
            needDeptInfo = false, // 是否需要携带部门的信息
            especialDept = ''; // 制定部门
        if (_.isFunction(options)) {
            error = success
            success = options
            options = {}
        }
        callNative('selectPeople', options, callback)
    }
   // @todo 调取原生打开附件
    // 挂载到全局对象上
    window._ = _
    if (!noGlobal) {
        return window._ = _;
    }
    return _
})