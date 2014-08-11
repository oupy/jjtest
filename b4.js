define("date", function (require, exports, module) {
    var _cacheThisModule_;
    exports.format = function (date, formatStr) {
        var arrWeek = ['日', '一', '二', '三', '四', '五', '六'], str = formatStr.replace(/yyyy|YYYY/, date.getFullYear()).replace(/yy|YY/, $addZero(date.getFullYear() % 100, 2)).replace(/mm|MM/, $addZero(date.getMonth() + 1, 2)).replace(/m|M/g, date.getMonth() + 1).replace(/dd|DD/, $addZero(date.getDate(), 2)).replace(/d|D/g, date.getDate()).replace(/hh|HH/, $addZero(date.getHours(), 2)).replace(/h|H/g, date.getHours()).replace(/ii|II/, $addZero(date.getMinutes(), 2)).replace(/i|I/g, date.getMinutes()).replace(/ss|SS/, $addZero(date.getSeconds(), 2)).replace(/s|S/g, date.getSeconds()).replace(/w/g, date.getDay()).replace(/W/g, arrWeek[date.getDay()]);
        return str;
    }
    exports.getTimeDistance = function (ts) {
        var timeLeft = [0, 0, 0, 0];
        timeLeft[0] = (ts > 86400) ? parseInt(ts / 86400) : 0;
        ts = ts - timeLeft[0] * 86400;
        timeLeft[1] = (ts > 3600) ? parseInt(ts / 3600) : 0;
        ts = ts - timeLeft[1] * 3600;
        timeLeft[2] = (ts > 60) ? parseInt(ts / 60) : 0;
        timeLeft[3] = ts - timeLeft[2] * 60;
        return timeLeft;
    }
    exports.getTimeInterval = function (st, et) {
        var dateLeft = 0;
        var hourLeft = 0;
        var minuteLeft = 0;
        var secondLeft = 0;
        var timeLeft = [0, 0, 0, 0];
        var timeStr = "";
        var ts = (et > st) ? parseInt((et - st) / 1000) : 0;
        timeLeft[0] = (ts > 86400) ? parseInt(ts / 86400) : 0;
        ts = ts - timeLeft[0] * 86400;
        timeLeft[1] = (ts > 3600) ? parseInt(ts / 3600) : 0;
        ts = ts - timeLeft[1] * 3600;
        timeLeft[2] = (ts > 60) ? parseInt(ts / 60) : 0;
        timeLeft[3] = ts - timeLeft[2] * 60;
        timeStr = (timeLeft[0] > 0) ? timeLeft[0] + "天" : "";
        timeStr += (timeLeft[0] <= 0 && timeLeft[1] <= 0) ? "" : (timeLeft[1] + "小时");
        timeStr += (timeLeft[0] <= 0 && timeLeft[1] <= 0 && timeLeft[2] <= 0) ? "" : (timeLeft[2] + "分钟");
        timeStr += (timeLeft[0] <= 0 && timeLeft[1] <= 0 && timeLeft[2] <= 0 && timeLeft[3] <= 0) ? "" : timeLeft[3] + "秒";
        return timeStr;
    }
    function $addZero(v, size) {
        for (var i = 0, len = size - (v + "").length; i < len; i++) {
            v = "0" + v;
        }
        ;
        return v + "";
    }

    exports.getServerTime = function (url) {
        var sysTime = document.getElementById('SYSTIME');
        if (sysTime) {
            var ts = sysTime.value.substring(0, 19).split('-'), dObj = new Date(ts[0], parseInt(ts[1], 10) - 1, ts[2], ts[3], ts[4], ts[5]);
            return dObj;
        }
        var xhr = $xhrMaker(), url = url || "http://" + window.location.hostname + "/favicon.ico";
        try {
            xhr.open("HEAD", url, false);
            xhr.send();
        } catch (e) {
            return new Date();
        }
        return new Date(xhr.getResponseHeader("Date"));
    }
    function $xhrMaker() {
        var xhr;
        try {
            xhr = new XMLHttpRequest();
        } catch (e) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    xhr = null;
                }
            }
        }
        ;
        return xhr;
    }
});
define('extend', function (require, exports, module) {
    var _cacheThisModule_;

    function $extend() {
        var target = arguments[0] || {}, i = 1, length = arguments.length, options;
        if (typeof target != "object" && typeof target != "function")
            target = {};
        for (; i < length; i++)
            if ((options = arguments[i]) != null)
                for (var name in options) {
                    var copy = options[name];
                    if (target === copy)
                        continue;
                    if (copy !== undefined)
                        target[name] = copy;
                }
        return target;
    }

    exports.extend = $extend;
});
define('wg.localcache', function (require, exports, module) {
    var _cacheThisModule_;
    var storage = window.localStorage, prefix = '$lc_', defaultSet = {expires: 1440};
    if (!storage)return;
    for (var k in storage) {
        try {
            if (k.indexOf(prefix) === 0) {
                getStorageObj(k);
            }
        } catch (e) {
        }
    }
    function JsonToStr(o) {
        if (o == undefined) {
            return"";
        }
        if (JSON && JSON.stringify) {
            return JSON.stringify(o);
        } else {
            var r = [];
            if (typeof o == "string")return"\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
            if (typeof o == "object") {
                if (!o.sort) {
                    for (var i in o)
                        r.push("\"" + i + "\":" + JsonToStr(o[i]));
                    if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                        r.push("toString:" + o.toString.toString());
                    }
                    r = "{" + r.join() + "}"
                } else {
                    for (var i = 0; i < o.length; i++)
                        r.push(JsonToStr(o[i]))
                    r = "[" + r.join() + "]";
                }
                return r;
            }
            return o.toString().replace(/\"\:/g, '":""');
        }
    }

    function clearStorage() {
        for (var k in storage) {
            if (k.indexOf(prefix) === 0) {
                storage.removeItem(k);
            }
        }
    }

    function removeStorage(name) {
        storage.removeItem(prefix + name);
    }

    function setStorage(name, value, expires) {
        var timeNow = new Date(), timeNowUnix = timeNow.getTime(), absExpires;
        expires = parseInt(expires ? expires : defaultSet.expires);
        absExpires = timeNow.setMinutes(timeNow.getMinutes() + expires);
        if (name && absExpires > timeNowUnix) {
            storage.removeItem(prefix + name);
            storage.setItem(prefix + name, JsonToStr({name: name, value: value, expires: absExpires}));
        }
    }

    function getStorageObj(name) {
        var storageObj, timeNow = new Date();
        if (JSON && JSON.parse) {
            storageObj = JSON.parse(storage.getItem(name));
        } else {
            storageObj = eval('(' + storage.getItem(name) + ')');
        }
        if (storageObj && timeNow.getTime() < storageObj.expires) {
            return storageObj;
        } else {
            storage.removeItem(name);
            return null;
        }
    }

    function getStorage(name) {
        var storageObj = getStorageObj(prefix + name);
        return storageObj ? storageObj.value : null;
    }

    return{set: function (name, value, expires) {
        try {
            setStorage(name, value, expires);
            return this;
        } catch (e) {
        }
    }, get: function (name) {
        try {
            return getStorage(name);
        } catch (e) {
        }
    }, remove: function (name) {
        try {
            removeStorage(name);
            return this;
        } catch (e) {
        }
    }, clear: function () {
        try {
            clearStorage();
            return this;
        } catch (e) {
        }
    }, setDefault: function (cfg) {
        for (var k in cfg) {
            if (defaultSet[k])defaultSet[k] = cfg[k];
        }
    }}
});
define('wg.returnCode', function (require, exports, module) {
    var _cacheThisModule_;
    var ex = require('extend'), user = require('wg.user'), _guid = (new Date()).getTime(), win = window;
    exports.init = function (cfg) {
        var codeType = {success: 1, error: 2, logicError: 3}, _cfg = {url: '', freq: 1, uin: user.getUin(), timeout: 10000, timeoutCode: '444', formatUrl: true, isReport: false}, sTime = new Date(), task;
        ex.extend(_cfg, cfg);
        function _report(code, type) {
            if (_cfg.isReport) {
                return;
            }
            _cfg.isReport = true;
            var eTime = new Date(), domain = _cfg.url.replace(/^.*\/\//, '').replace(/\/.*/, ''), cgi = encodeURIComponent(_cfg.formatUrl ? _cfg.url.match(/^[\w|/|.|:|-]*/)[0] : _cfg.url), time = eTime - sTime, rate = _cfg.freq, uin = _cfg.uin, reportParam = ['domain=' + domain, 'cgi=' + cgi, 'type=' + type, 'code=' + code, 'time=' + time, 'rate=' + rate, 'uin=' + uin], reportUrl = 'http://c.isdspeed.qq.com/code.cgi?' + reportParam.join('&') + '&t=' + Math.random();
            if (reportUrl && Math.random() < (1 / rate)) {
                try {
                    var _rName = '_RETURNCODE' + _guid++;
                    win[_rName] = new Image();
                    win[_rName].src = reportUrl;
                } catch (e) {
                }
            }
        }

        task = setTimeout(function () {
            _report(_cfg.timeoutCode, codeType.error);
        }, _cfg.timeout);
        return{report: function (code, type) {
            var _type;
            switch (type) {
                case true:
                    _type = codeType.success;
                    break;
                case false:
                    _type = codeType.error;
                    break;
                default:
                    _type = type;
                    break;
            }
            _report(code, _type);
            clearTimeout(task);
        }, success: codeType.success, error: codeType.error, logicError: codeType.logicError};
    };
});
define('wg.user', function (require, exports, module) {
    var _cacheThisModule_;
    var cookie = require('cookie');
    exports.getUin = function () {
        var uin = cookie.get("p_uin") || cookie.get("uin") || cookie.get('uin_cookie') || cookie.get('pt2gguin') || cookie.get('o_cookie') || cookie.get('luin') || cookie.get('buy_uin');
        return uin ? parseInt(uin.replace("o", ""), 10) : "";
    }
});