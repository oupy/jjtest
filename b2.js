window['PP.wg.jdSmartbox.time'] && window['PP.wg.jdSmartbox.time'].push(new Date());
function $addClass(ids, cName) {
    $setClass(ids, cName, "add");
};
function $addEvent(obj, type, handle) {
    if (!obj || !type || !handle) {
        return;
    }
    if (obj instanceof Array) {
        for (var i = 0, l = obj.length; i < l; i++) {
            $addEvent(obj[i], type, handle);
        }
        return;
    }
    if (type instanceof Array) {
        for (var i = 0, l = type.length; i < l; i++) {
            $addEvent(obj, type[i], handle);
        }
        return;
    }
    window.__allHandlers = window.__allHandlers || {};
    window.__Hcounter = window.__Hcounter || 1;
    function setHandler(obj, type, handler, wrapper) {
        obj.__hids = obj.__hids || [];
        var hid = 'h' + window.__Hcounter++;
        obj.__hids.push(hid);
        window.__allHandlers[hid] = {type: type, handler: handler, wrapper: wrapper}
    }

    function createDelegate(handle, context) {
        return function () {
            return handle.apply(context, arguments);
        };
    }

    if (window.addEventListener) {
        var wrapper = createDelegate(handle, obj);
        setHandler(obj, type, handle, wrapper)
        obj.addEventListener(type, wrapper, false);
    }
    else if (window.attachEvent) {
        var wrapper = createDelegate(handle, obj);
        setHandler(obj, type, handle, wrapper)
        obj.attachEvent("on" + type, wrapper);
    }
    else {
        obj["on" + type] = handle;
    }
};
function $addToken(url, type, skey) {
    var token = $getToken(skey);
    if (url == "" || (url.indexOf("://") < 0 ? location.href : url).indexOf("http") != 0) {
        return url;
    }
    if (url.indexOf("#") != -1) {
        var f1 = url.match(/\?.+\#/);
        if (f1) {
            var t = f1[0].split("#"), newPara = [t[0], "&g_tk=", token, "&g_ty=", type, "#", t[1]].join("");
            return url.replace(f1[0], newPara);
        } else {
            var t = url.split("#");
            return[t[0], "?g_tk=", token, "&g_ty=", type, "#", t[1]].join("");
        }
    }
    return token == "" ? (url + (url.indexOf("?") != -1 ? "&" : "?") + "g_ty=" + type) : (url + (url.indexOf("?") != -1 ? "&" : "?") + "g_tk=" + token + "&g_ty=" + type);
};
function $delClass(ids, cName) {
    $setClass(ids, cName, "remove");
};
function $delCookie(name, path, domain, secure) {
    var value = $getCookie(name);
    if (value != null) {
        var exp = new Date();
        exp.setMinutes(exp.getMinutes() - 1000);
        path = path || "/";
        document.cookie = name + '=;expires=' + exp.toGMTString() + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    }
};
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
};
function $getCookie(name) {
    var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
    return val ? (val[2] ? unescape(val[2]) : "") : null;
};
function $getScrollPosition() {
    var _docElement = document.documentElement, _body = document.body, scrollLeft = (_docElement && _docElement.scrollLeft) || (_body && _body.scrollLeft) || window.pageXOffset || 0, scrollTop = (_docElement && _docElement.scrollTop) || (_body && _body.scrollTop) || window.pageYOffset || 0;
    return[scrollLeft, scrollTop];
};
function $getToken(skey) {
    var skey = skey ? skey : $getCookie("skey");
    return skey ? $time33(skey) : "";
};
function $hasClass(old, cur) {
    if (!old || !cur)return null;
    var arr = (typeof old == 'object' ? old.className : old).split(' ');
    for (var i = 0, len = arr.length; i < len; i++) {
        if (cur == arr[i]) {
            return cur;
        }
    }
    ;
    return null;
};
function $id(id) {
    return typeof(id) == "string" ? document.getElementById(id) : id;
};
function $inArray(t, arr) {
    if (arr.indexOf) {
        return arr.indexOf(t);
    }
    for (var i = arr.length; i--;) {
        if (arr[i] === t) {
            return i * 1;
        }
    }
    ;
    return-1;
};
function $itilReport(option) {
    var opt = {bid: "1", mid: "01", res: [], onBeforeReport: null, delay: 5000}
    for (var k in option) {
        opt[k] = option[k];
    }
    if (opt.res.length > 0) {
        window.reportWebInfo = function (json) {
        };
        window.setTimeout(function () {
            opt.onBeforeReport && opt.onBeforeReport(opt);
            var pstr = opt.bid + opt.mid + "-" + opt.res.join("|");
            var url = "http://focus.paipai.com/webreport/ReportWebInfo?report=" + pstr + "&t=" + new Date() / 1000;
            $loadUrl({url: url});
        }, opt.delay);
    }
};
function $loadCss(path, callback) {
    if (!path) {
        return;
    }
    var l;
    if (!window["_loadCss"] || window["_loadCss"].indexOf(path) < 0) {
        l = document.createElement('link');
        l.setAttribute('type', 'text/css');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', path);
        l.setAttribute("id", "loadCss" + Math.random());
        document.getElementsByTagName("head")[0].appendChild(l);
        window["_loadCss"] ? (window["_loadCss"] += "|" + path) : (window["_loadCss"] = "|" + path);
    }
    l && (typeof callback == "function") && (l.onload = callback);
    return true;
};
function $loadScript(obj) {
    if (!$loadScript.counter) {
        $loadScript.counter = 1;
    }
    var isObj = typeof(obj) == "object", url = isObj ? obj.url : arguments[0], id = isObj ? obj.id : arguments[1], obj = isObj ? obj : arguments[2], _head = document.head || document.getElementsByTagName("head")[0] || document.documentElement, _script = document.createElement("script"), D = new Date(), _time = D.getTime(), _isCleared = false, _timer = null, o = obj || {}, data = o.data || '', charset = o.charset || "gb2312", isToken = o.isToken, skey = o.skey, timeout = o.timeout, isAutoReport = o.isAutoReport || false, reportOptions = o.reportOptions || {}, reportType = o.reportType || 'current', reportRetCodeName = o.reportRetCodeName, reportSuccessCode = typeof(o.reportSuccessCode) == "undefined" ? 200 : o.reportSuccessCode, reportErrorCode = typeof(o.reportErrorCode) == "undefined" ? 500 : o.reportErrorCode, reportTimeoutCode = typeof(o.reportTimeoutCode) == "undefined" ? 600 : o.reportTimeoutCode, onload = o.onload, onsucc = o.onsucc, callbackName = o.callbackName || '', callback = o.callback, errorback = o.errorback, _jsonpLoadState = 'uninitialized';
    var complete = function (errCode) {
        if (!_script || _isCleared) {
            return;
        }
        _isCleared = true;
        if (_timer) {
            clearTimeout(_timer);
            _timer = null;
        }
        _script.onload = _script.onreadystatechange = _script.onerror = null;
        if (_head && _script.parentNode) {
            _head.removeChild(_script);
        }
        _script = null;
        if (callbackName) {
            if (callbackName.indexOf('.') == -1) {
                window[callbackName] = null;
                try {
                    delete window[callbackName];
                }
                catch (e) {
                }
            }
            else {
                var arrJ = callbackName.split("."), p = {};
                for (var j = 0, jLen = arrJ.length; j < jLen; j++) {
                    var n = arrJ[j];
                    if (j == 0) {
                        p = window[n];
                    }
                    else {
                        if (j == jLen - 1) {
                            try {
                                delete p[n];
                            }
                            catch (e) {
                            }
                        }
                        else {
                            p = p[n];
                        }
                    }
                }
            }
        }
        if (_jsonpLoadState != "loaded" && typeof errorback == "function") {
            errorback(errCode);
        }
        if (isAutoReport && reportType != 'cross') {
            _retCoder.report(_jsonpLoadState == "loaded", errCode);
        }
    };
    var jsontostr = function (d) {
        var a = [];
        for (var k in d) {
            a.push(k + '=' + d[k]);
        }
        return a.join('&');
    };
    if (isAutoReport && reportOptions) {
        if (reportType == 'cross') {
            $returnCode(reportOptions).reg();
        }
        else {
            reportOptions.url = reportOptions.url || url.substr(0, url.indexOf('?') == -1 ? url.length : url.indexOf('?'));
            var _retCoder = $returnCode(reportOptions);
        }
    }
    if (data) {
        url += (url.indexOf("?") != -1 ? "&" : "?") + (typeof data == 'string' ? data : jsontostr(data));
    }
    if (callbackName && typeof callback == "function") {
        var oldName = callbackName;
        if (callbackName.indexOf('.') == -1) {
            callbackName = window[callbackName] ? callbackName + $loadScript.counter++ : callbackName;
            window[callbackName] = function (jsonData) {
                _jsonpLoadState = 'loaded';
                if (isAutoReport && reportRetCodeName) {
                    reportSuccessCode = jsonData[reportRetCodeName];
                }
                callback.apply(null, arguments);
                onsucc && (onsucc());
            };
        }
        else {
            var arrJ = callbackName.split("."), p = {}, arrF = [];
            for (var j = 0, jLen = arrJ.length; j < jLen; j++) {
                var n = arrJ[j];
                if (j == 0) {
                    p = window[n];
                }
                else {
                    if (j == jLen - 1) {
                        p[n] ? (n = n + $loadScript.counter++) : '';
                        p[n] = function (jsonData) {
                            _jsonpLoadState = 'loaded';
                            if (isAutoReport && reportRetCodeName) {
                                reportSuccessCode = jsonData[reportRetCodeName];
                            }
                            callback.apply(null, arguments);
                            onsucc && (onsucc());
                        };
                    }
                    else {
                        p = p[n];
                    }
                }
                arrF.push(n);
            }
            callbackName = arrF.join('.');
        }
        url = url.replace('=' + oldName, '=' + callbackName);
    }
    _jsonpLoadState = 'loading';
    id = id ? (id + _time) : _time;
    url = (isToken !== false ? $addToken(url, "ls", skey) : url);
    _script.charset = charset;
    _script.id = id;
    _script.onload = _script.onreadystatechange = function () {
        var uA = navigator.userAgent.toLowerCase();
        if (!(!(uA.indexOf("opera") != -1) && uA.indexOf("msie") != -1) || /loaded|complete/i.test(this.readyState)) {
            if (typeof onload == "function") {
                onload();
            }
            complete(_jsonpLoadState == "loaded" ? reportSuccessCode : reportErrorCode);
        }
    };
    _script.onerror = function () {
        complete(reportErrorCode);
    };
    if (timeout) {
        _timer = setTimeout(function () {
            complete(reportTimeoutCode);
        }, parseInt(timeout, 10));
    }
    setTimeout(function () {
        _script.src = url;
        try {
            _head.insertBefore(_script, _head.lastChild);
        } catch (e) {
        }
    }, 0);
};
function $loadUrl(o) {
    o.element = o.element || 'script';
    var el = document.createElement(o.element);
    el.charset = o.charset || 'utf-8';
    o.onBeforeSend && o.onBeforeSend(el);
    el.onload = el.onreadystatechange = function () {
        if (/loaded|complete/i.test(this.readyState) || navigator.userAgent.toLowerCase().indexOf("msie") == -1) {
            o.onLoad && o.onLoad();
            clear();
        }
    };
    el.onerror = function () {
        clear();
    };
    el.src = o.url;
    document.getElementsByTagName('head')[0].appendChild(el);
    function clear() {
        if (!el) {
            return;
        }
        el.onload = el.onreadystatechange = el.onerror = null;
        el.parentNode && (el.parentNode.removeChild(el));
        el = null;
    }
};
function $namespace(name) {
    for (var arr = name.split(','), r = 0, len = arr.length; r < len; r++) {
        for (var i = 0, k, name = arr[r].split('.'), parent = {}; k = name[i]; i++) {
            i === 0 ? eval('(typeof ' + k + ')==="undefined"?(' + k + '={}):"";parent=' + k) : (parent = parent[k] = parent[k] || {});
        }
    }
};
function $report(url) {
    $loadUrl({'url': url + ((url.indexOf('?') == -1) ? '?' : '&') + Math.random(), 'element': 'img'});
};
function $returnCode(opt) {
    var option = {url: "", action: "", sTime: "", eTime: "", retCode: "", errCode: "", frequence: 1, refer: "", uin: "", domain: "paipai.com", from: 1, report: report, isReport: false, timeout: 3000, timeoutCode: 444, formatUrl: true, reg: reg};
    try {
        option['refer'] = location.href;
    } catch (e) {
    }
    for (var i in opt) {
        option[i] = opt[i];
    }
    if (option.url) {
        option.sTime = new Date();
    }
    if (option.timeout) {
        setTimeout(function () {
            if (!option.isReport) {
                option.report(false, option.timeoutCode);
            }
        }, option.timeout);
    }
    function reg() {
        this.sTime = new Date();
        if (!this.action) {
            return;
        }
        var rcookie = $getCookie("retcode"), cookie2 = [];
        rcookie = rcookie ? rcookie.split("|") : [];
        for (var i = 0; i < rcookie.length; i++) {
            if (rcookie[i].split(",")[0] != this.action) {
                cookie2.push(rcookie[i]);
            }
        }
        cookie2.push(this.action + "," + this.sTime.getTime());
        $setCookie("retcode", cookie2.join("|"), 60, "/", this.domain);
    }

    function report(ret, errid) {
        if (this.isReport == true) {
            return;
        }
        this.isReport = true;
        this.eTime = new Date();
        this.retCode = ret ? 1 : 2;
        this.errCode = isNaN(parseInt(errid)) ? "0" : parseInt(errid);
        if (this.action) {
            this.url = "http://retcode.paipai.com/" + this.action;
            var rcookie = $getCookie("retcode"), ret = "", ncookie = [];
            rcookie = rcookie ? rcookie.split("|") : [];
            for (var i = 0; i < rcookie.length; i++) {
                if (rcookie[i].split(",")[0] == this.action) {
                    ret = rcookie[i].split(",");
                }
                else {
                    ncookie.push(rcookie[i]);
                }
            }
            $setCookie("retcode", ncookie.join("|"), 60, "/", this.domain);
            if (!ret) {
                return;
            }
            this.sTime = new Date(parseInt(ret[1]));
        }
        if (!this.url) {
            return;
        }
        var domain = this.url.replace(/^.*\/\//, '').replace(/\/.*/, ''), timer = this.eTime - this.sTime, cgi = encodeURIComponent(this.formatUrl ? this.url.match(/^[\w|/|.|:|-]*/)[0] : this.url);
        this.reportUrl = "http://c.isdspeed.qq.com/code.cgi?domain=" + domain + "&cgi=" + cgi + "&type=" + this.retCode + "&code=" + this.errCode + "&time=" + timer + "&rate=" + this.frequence + (this.uin ? ("&uin=" + this.uin) : "");
        if (this.reportUrl && Math.random() < (1 / this.frequence) && this.url) {
            $report(this.reportUrl);
        }
    }

    return option;
};
function $setClass(ids, cName, kind) {
    if (!ids) {
        return;
    }
    var set = function (obj, cName, kind) {
        if (!obj) {
            return;
        }
        var oldName = obj.className, arrName = oldName ? oldName.split(' ') : [];
        if (kind == "add") {
            if (!$hasClass(oldName, cName)) {
                arrName.push(cName);
                obj.className = arrName.join(' ');
            }
        }
        else if (kind == "remove") {
            var newName = [];
            for (var i = 0, l = arrName.length; i < l; i++) {
                if (cName != arrName[i] && ' ' != arrName[i]) {
                    newName.push(arrName[i]);
                }
            }
            obj.className = newName.join(' ');
        }
    };
    if (typeof(ids) == "string") {
        var arrDom = ids.split(",");
        for (var i = 0, l = arrDom.length; i < l; i++) {
            if (arrDom[i]) {
                set($id(arrDom[i]), cName, kind);
            }
        }
    }
    else if (ids instanceof Array) {
        for (var i = 0, l = ids.length; i < l; i++) {
            if (ids[i]) {
                set(ids[i], cName, kind);
            }
        }
    }
    else {
        set(ids, cName, kind);
    }
};
function $setCookie(name, value, expires, path, domain, secure) {
    var exp = new Date(), expires = arguments[2] || null, path = arguments[3] || "/", domain = arguments[4] || null, secure = arguments[5] || false;
    expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
    document.cookie = name + '=' + escape(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
};
function $strTrim(str, code) {
    var argus = code || "\\s";
    var temp = new RegExp("(^" + argus + "*)|(" + argus + "*$)", "g");
    return str.replace(temp, "");
};
function $time33(str) {
    for (var i = 0, len = str.length, hash = 5381; i < len; ++i) {
        hash += (hash << 5) + str.charAt(i).charCodeAt();
    }
    ;
    return hash & 0x7fffffff;
};
$namespace("PP.wg.jdSmartbox");
PP.wg.jdSmartbox = {oldKey: '', hotwords: null, isFucus: false, curTab: 1, firstLoad: true, onShow: false, cgi: 'http://dd.search.jd.com/?key={#key#}&callback=ddSearchCb', cgiMonitor: {smartboxTimer: null, timeout: 5000}, opt: {deley: 500, empMode: 1, scene: 1, css: 'http://static.paipaiimg.com/wx/css/mall/search_panel.s.min.css?t=201407301111', kwObj: 'keyWord', searchBtn: 'searchBtn', clearBtn: 'searchClearBtn', cancelBtn: 'cancelBtn', smartboxBlock: 'smartboxBlock', searchUrl: 'http://mm.wanggou.com/search/index.shtml?key={#key#}&sf={#sf#}', showCb: null, hideCb: null, keyInput: null, searchRd: '', wxHotUrl: 'http://static.paipaiimg.com/sinclude/keyword/project/mpj114.js', qqHotUrl: 'http://static.paipaiimg.com/sinclude/keyword/project/mpj120.js'}};
PP.wg.jdSmartbox.init = function (option) {
    this.initParam(option);
    this.initTpl();
    this.bindEvent();
    this.reportEccClick();
};
PP.wg.jdSmartbox.initParam = function (option) {
    option && $extend(this.opt, option);
    this.opt.kwObj = this.smartQuery('#' + this.opt.kwObj);
    this.opt.searchBtn = this.smartQuery('#' + this.opt.searchBtn);
    this.opt.clearBtn = this.smartQuery('#' + this.opt.clearBtn);
    this.opt.cancelBtn = this.smartQuery('#' + this.opt.cancelBtn);
    this.opt.smartboxBlock = this.smartQuery('#' + this.opt.smartboxBlock);
    this.oldKey = $strTrim(this.opt.kwObj.value);
    this.opt.css && $loadCss(this.opt.css);
}
PP.wg.jdSmartbox.initTpl = function () {
    this.opt.smartboxBlock.innerHTML = this.child_indextpl();
    this.opt.sTab = this.smartQuery('div[dtab="s-tab"]', this.opt.smartboxBlock);
    this.opt.sRow = this.smartQuery('div[dtab="s-row"]', this.opt.smartboxBlock);
    this.opt.sBtn = this.smartQuery('div[dtab="s-btn"]', this.opt.smartboxBlock);
    this.opt.sTag = this.smartQuery('div[dtab="s-tag"]', this.opt.smartboxBlock);
    this.opt.cBtn = this.smartQuery('div[dtab="c-btn"]', this.opt.smartboxBlock);
    this.opt.smartWrap = this.smartQuery('div[dtab="smartWrap"]', this.opt.smartboxBlock);
}
PP.wg.jdSmartbox.bindEvent = function () {
    var that = this;
    that.addEvent(this.opt.kwObj, 'focus', function () {
        that.isFucus = true;
        that.loadSuggest();
        var kw = $strTrim(that.opt.kwObj.value);
        if (kw == '') {
            that.opt.empMode === 1 && that.showHisAndHot();
        } else {
            that.opt.clearBtn && (that.opt.clearBtn.style.display = '');
        }
        that.smartShow(that.opt.smartboxBlock, '');
    });
    that.addEvent(that.opt.kwObj, 'blur', function () {
        that.isFucus = false;
        var kw = $strTrim(that.opt.kwObj.value);
        if (kw != '') {
            $addClass(that.opt.kwObj, 'hd_search_txt_null');
        }
    });
    that.addEvent(this.opt.kwObj, 'touchstart', function () {
        that.reportEccMul('1-1-2');
    });
    that.addEvent(that.opt.kwObj, 'keydown', function (e) {
        if (e.keyCode == 13) {
            var kw = $strTrim(that.opt.kwObj.value);
            that.reportEccMul('1-1-5', {inputKeyword: encodeURIComponent(kw)});
            if (kw == '') {
                return;
            }
            var url = that.genSearchUrl(kw, '', '', that.opt.searchRd);
            if (url) {
                window.setTimeout(function () {
                    location.href = url;
                }, 0);
            }
        }
    });
    if (that.opt.searchBtn) {
        that.addEvent(that.opt.searchBtn, 'touchstart', function () {
            var kw = $strTrim(that.opt.kwObj.value);
            that.reportEccMul('1-1-4', {inputKeyword: encodeURIComponent(kw)});
            if (kw == '') {
                return;
            }
            var url = that.genSearchUrl(kw, '', '', that.opt.searchRd);
            if (url) {
                window.setTimeout(function () {
                    location.href = url;
                }, 0);
            }
        });
    }
    if (that.opt.clearBtn) {
        that.addEvent(that.opt.clearBtn, 'touchstart', function (e) {
            that.opt.kwObj.value = '';
            that.opt.kwObj.focus();
            that.opt.keyInput && that.opt.keyInput('');
            that.reportEccMul('1-1-3');
            e.preventDefault();
        });
    }
    if (that.opt.cancelBtn) {
        that.addEvent(that.opt.cancelBtn, 'touchstart', function (e) {
            that.hideWrap();
            that.reportEccMul('1-15-1');
        });
    }
    that.addEvent(that.opt.smartWrap, 'touchstart', function (e) {
        var tar = e.target;
        if (tar.tagName.toLocaleLowerCase() == 'span') {
            tar = tar.parentNode;
        }
        var key = tar.getAttribute('key'), cid = tar.getAttribute('cid'), level = tar.getAttribute('level');
        var url = that.genSearchUrl(key, cid, level, that.opt.searchRd);
        if (url) {
            $addClass(tar, 'active');
            window.setTimeout(function () {
                location.href = url;
            }, 0);
        }
        e.preventDefault();
    });
    that.setSuggestTimer();
    that.bindHisEvent();
    that.addEvent(window, 'scroll', function () {
        if (document.activeElement && document.activeElement === that.opt.kwObj && $getScrollPosition()[1] > 0) {
            that.opt.kwObj.blur();
        }
    });
}
PP.wg.jdSmartbox.bindHisEvent = function () {
    var that = this;
    that.addEvent(that.opt.sTab, 'touchstart', function (e) {
        var tar = e.target;
        if (tar.tagName.toLocaleLowerCase() != 'a') {
            return;
        }
        var ind = tar.getAttribute('ind');
        if (that.curTab == ind)return;
        $delClass(that.smartQuery('a.cur', that.opt.sTab), 'cur');
        if (ind == 1) {
            that.curTab = 1;
            that.smartShow(that.opt.sRow, '')
            that.smartShow(that.opt.sBtn, '')
            that.smartShow(that.opt.sTag, 'none')
            that.smartShow(that.opt.cBtn, 'none')
            that.initHistory();
        } else {
            that.curTab = 2;
            that.smartShow(that.opt.sRow, 'none')
            that.smartShow(that.opt.sBtn, 'none')
            that.smartShow(that.opt.sTag, '')
            that.smartShow(that.opt.cBtn, '')
            that.loadHotList();
        }
        $addClass(tar, 'cur');
    });
    that.addEvent(that.opt.sRow, 'touchstart', function (e) {
        var tar = e.target;
        if (tar.tagName.toLocaleLowerCase() != 'a') {
            return;
        }
        var key = tar.getAttribute('key');
        if (key) {
            var url = that.genSearchUrl(key, '', '', that.opt.searchRd);
            if (url) {
                window.setTimeout(function () {
                    location.href = url;
                }, 0);
            }
        }
    });
    that.addEvent(that.opt.sBtn, 'touchstart', function () {
        that.saveStorage("search_kw_history", [], true);
        $delCookie('sk_history', '/', 'wanggou.com');
        that.opt.sRow.innerHTML = '最近没有搜索';
        $addClass(that.opt.sRow, 's_empty');
        that.smartShow(that.opt.sBtn, 'none')
    });
    that.addEvent(that.opt.sTag, 'touchstart', function (e) {
        var tar = e.target;
        if (tar.tagName.toLocaleLowerCase() != 'a') {
            return;
        }
        var key = tar.getAttribute('key'), tarHref = tar.getAttribute('tarHref');
        if (key) {
            that.savekwLocalStorge(key);
        }
        if (tarHref) {
            window.setTimeout(function () {
                location.href = tarHref;
            }, 0);
        }
    });
    that.addEvent(that.opt.cBtn, 'touchstart', function () {
        that.showHotList();
    });
}
PP.wg.jdSmartbox.setSuggestTimer = function () {
    var that = PP.wg.jdSmartbox;
    if (that.isFucus) {
        var kw = $strTrim(that.opt.kwObj.value);
        if (kw != that.oldKey) {
            that.oldKey = kw;
            that.loadSuggest();
            that.opt.keyInput && that.opt.keyInput(kw);
        }
        if (kw != '') {
            if (that.onShow) {
                that.smartShow(that.opt.clearBtn, '')
                that.onShow && that.opt.empMode === 1 && that.hideHisAndHot();
            }
        } else {
            if (!that.onShow) {
                that.smartShow(that.opt.clearBtn, 'none')
                that.opt.empMode === 1 && that.showHisAndHot();
            }
        }
    }
    window.setTimeout(arguments.callee, that.opt.deley);
}
PP.wg.jdSmartbox.loadSuggest = function () {
    var that = this;
    var kw = $strTrim(that.opt.kwObj.value);
    if (!kw || !that.isFucus) {
        return;
    }
    var url = that.cgi.replace(/{#key#}/, encodeURIComponent(kw));
    that.cgiMonitor.smartboxTimer = window.setTimeout(function () {
        try {
            $itilReport({bid: "8", mid: "10", res: ["4:1"], delay: 0});
        } catch (e) {
        }
    }, that.cgiMonitor.timeout);
    $loadScript({url: url});
}
window.ddSearchCb = function (list) {
    var that = PP.wg.jdSmartbox;
    that.cgiMonitor.smartboxTimer && window.clearTimeout(that.cgiMonitor.smartboxTimer);
    var repres = ["3:1"];
    if (!list || list.length == 0) {
        repres.push("5:1");
    }
    try {
        $itilReport({bid: "8", mid: "10", res: repres, delay: 0});
    } catch (e) {
    }
    var kw = $strTrim(that.opt.kwObj.value);
    if (list.length <= 0 || !kw)return;
    var html = [], rok = true;
    for (var i = 0, len = list.length; i < len; ++i) {
        var row = list[i];
        row.cg = '1-15-' + (i + 2);
        if (row.level) {
            if (rok) {
                rok = false;
                html.push(that.child_seltpl(row));
            }
            html.push(that.child_cstpl(row));
        } else {
            html.push(that.child_seltpl(row));
        }
    }
    that.opt.smartWrap.innerHTML = html.join('');
    that.showWrap();
};
PP.wg.jdSmartbox.genSearchUrl = function (kw, cid, level, ptag) {
    var that = this;
    var url = '';
    if (typeof that.opt.searchUrl == 'function') {
        that.opt.searchUrl(kw, cid, level, ptag);
    } else {
        url = that.opt.searchUrl.replace(/{#key#}/g, encodeURIComponent(kw)).replace(/{#sf#}/g, that.opt.scene);
        if (cid && level) {
            var ctr = level == 1 ? 'cid1' : level == 2 ? 'cid2' : 'catid';
            url += '&filt_type=' + ctr + ',L' + cid + 'M' + cid;
        }
        if (ptag) {
            url += '&PTAG=' + ptag;
        }
    }
    that.opt.kwObj.value = kw;
    that.savekwLocalStorge(kw);
    return url;
}
PP.wg.jdSmartbox.showHisAndHot = function () {
    var that = this;
    that.onShow = true;
    $delClass(that.smartQuery('a.cur', that.opt.sTab), 'cur');
    if (that.curTab == 1) {
        if (that.initHistory()) {
            that.smartShow(that.opt.sRow, '')
            that.smartShow(that.opt.sBtn, '')
            that.smartShow(that.opt.sTag, 'none')
            that.smartShow(that.opt.cBtn, 'none')
            $addClass(that.smartQuery('a[ind="1"]', that.opt.sTab), 'cur');
        }
    } else {
        that.loadHotList();
        that.smartShow(that.opt.sRow, 'none')
        that.smartShow(that.opt.sBtn, 'none')
        that.smartShow(that.opt.sTag, '')
        that.smartShow(that.opt.cBtn, '')
        $addClass(that.smartQuery('a[ind="2"]', that.opt.sTab), 'cur');
    }
    that.smartShow(that.opt.sTab, '')
    that.smartShow(that.opt.smartWrap, 'none')
    that.opt.showCb && that.opt.showCb();
}
PP.wg.jdSmartbox.hideHisAndHot = function () {
    var that = this;
    that.onShow = false;
    that.smartShow(that.opt.sRow, 'none')
    that.smartShow(that.opt.sBtn, 'none')
    that.smartShow(that.opt.sTag, 'none')
    that.smartShow(that.opt.cBtn, 'none')
    that.smartShow(that.opt.sTab, 'none')
}
PP.wg.jdSmartbox.initHistory = function () {
    var that = this;
    var kwHistory = that.getStorage('search_kw_history');
    if (kwHistory && kwHistory !== '[]') {
        kwHistory = JSON.parse(kwHistory);
    } else {
        var cokHistory = $getCookie('sk_history');
        if (cokHistory) {
            kwHistory = cokHistory.split('|');
        } else {
            kwHistory = [];
        }
    }
    that.smartShow(that.opt.sTab, '')
    if (!kwHistory || kwHistory.length <= 0) {
        if (that.firstLoad) {
            that.curTab = 2;
            that.smartShow(that.opt.sRow, 'none')
            that.smartShow(that.opt.sBtn, 'none')
            that.smartShow(that.opt.sTag, '')
            that.smartShow(that.opt.cBtn, '')
            $delClass(that.smartQuery('a[ind="1"]', that.opt.sTab), 'cur');
            $addClass(that.smartQuery('a[ind="2"]', that.opt.sTab), 'cur');
            that.loadHotList();
        } else {
            that.opt.sRow.innerHTML = '最近没有搜索';
            $addClass(that.opt.sRow, 's_empty');
            that.smartShow(that.opt.sBtn, 'none')
        }
    } else {
        var html = [], klen = kwHistory.length;
        for (var i = klen - 1; i >= 0; --i) {
            html.push(that.child_historytpl({key: kwHistory[i], cg: '1-6-' + (klen - i + 2)}));
        }
        $delClass(that.opt.sRow, 's_empty');
        that.opt.sRow.innerHTML = html.join('');
    }
    that.firstLoad = false;
    return kwHistory && kwHistory.length > 0;
}
PP.wg.jdSmartbox.loadHotList = function () {
    var that = this;
    if (that.hotwords != null) {
        that.showHotList();
        return;
    }
    var url = isMQQUserAgent() && that.opt.qqHotUrl ? that.opt.qqHotUrl : that.opt.wxHotUrl, cbName = url.match(/\/m?([^\/]*)\.js/);
    if (!cbName || !cbName[1])return;
    window[cbName[1]] = function (json) {
        if (json.errCode != 0) {
            return;
        }
        if (json.keywordAreas && json.keywordAreas[0]) {
            var words = json.keywordAreas[0];
            if (words && words.level1words && words.level1words[0]) {
                that.hotwords = words.level1words[0].level2words;
            }
        }
        that.showHotList();
    };
    $loadScript(url);
}
PP.wg.jdSmartbox.showHotList = function () {
    var that = this;
    that.hotwords.sort(function (a, b) {
        return parseInt(Math.random() * 10 - 5, 10);
    });
    var list = that.hotwords.slice(0, 15);
    var html = [], reg = /[?&]key=([^&#]+)/;
    for (var i = 0, len = list.length; i < len; ++i) {
        var li = list[i], mat = li.url.match(reg);
        li.key = '';
        if (mat && mat[1]) {
            li.key = decodeURIComponent(mat[1]);
            li.cg = '1-7-' + (i + 2);
        }
        html.push(that.child_hottpl(li));
    }
    that.opt.sTag.innerHTML = html.join('');
}
PP.wg.jdSmartbox.showWrap = function () {
    this.smartShow(this.opt.smartWrap, '')
    this.opt.showCb && this.opt.showCb();
}
PP.wg.jdSmartbox.hideWrap = function () {
    this.smartShow(this.opt.smartboxBlock, 'none');
    this.smartShow(this.opt.smartWrap, 'none');
    this.opt.keyInput && this.opt.keyInput('');
    this.opt.hideCb && this.opt.hideCb();
}
PP.wg.jdSmartbox.savekwLocalStorge = function (kw) {
    var that = this;
    var kwHistory = that.getStorage('search_kw_history');
    if (kwHistory && kwHistory !== '[]') {
        kwHistory = JSON.parse(kwHistory);
    } else {
        var cokHistory = $getCookie('sk_history');
        if (cokHistory) {
            kwHistory = cokHistory.split('|');
        } else {
            kwHistory = [];
        }
    }
    var ind = $inArray(kw, kwHistory);
    if (ind > -1) {
        kwHistory.splice(ind, 1);
    }
    if (kwHistory.length >= 10) {
        kwHistory.shift();
    }
    kwHistory.push(kw);
    that.saveStorage("search_kw_history", kwHistory, true);
    $setCookie('sk_history', kwHistory.join('|'), 525600, '/', 'wanggou.com');
}
PP.wg.jdSmartbox.removeStorage = function (key) {
    window.localStorage.removeItem(key);
}
PP.wg.jdSmartbox.saveStorage = function (key, value, isJson) {
    window.localStorage.setItem(key, isJson ? JSON.stringify(value) : value);
}
PP.wg.jdSmartbox.getStorage = function (key) {
    return window.localStorage.getItem(key);
}
PP.wg.jdSmartbox.smartQuery = function (selector, tar) {
    return tar ? tar.querySelector(selector) : document.querySelector(selector);
}
PP.wg.jdSmartbox.smartQueryAll = function (selector, tar) {
    return tar ? tar.querySelectorAll(selector) : document.querySelectorAll(selector);
}
PP.wg.jdSmartbox.smartShow = function (tar, mark) {
    if (tar) {
        tar.style.display = mark;
    }
}
PP.wg.jdSmartbox.addEvent = function (tar, type, fun) {
    if ((typeof $ !== 'undefined') && $) {
        if (type === 'touchstart') {
            $(tar).on('tap', fun);
        } else {
            $(tar).on(type, fun);
        }
    } else {
        if (type === 'touchstart') {
            $addEvent(tar, 'click', fun);
        } else {
            $addEvent(tar, type, fun);
        }
    }
}
PP.wg.jdSmartbox.reportEccClick = function () {
    var that = this;
    var parFunMap = {'1': getLocationParams, '6': getParams6, '7': getParams6, '15': getParams15};
    this.addEvent(this.opt.smartboxBlock, 'touchstart', function (e) {
        var tar = e.target, cg = tar.getAttribute('cg');
        if (!cg)return;
        var pars = cg.split('-');
        if (!pars[1] || !parFunMap[pars[1]])return;
        var cObj = parFunMap[pars[1]](pars, tar);
        try {
            ECC.cloud.report.trace(cObj);
        } catch (e) {
        }
    });
    function getLocationParams(pList) {
        var obj = {locid1: '1', locid2: pList[1] || '', locid3: pList[2] || ''};
        return $extend(obj, getCommParam());
    }

    function getParams6(pList, tar) {
        var obj = getLocationParams(pList);
        obj.clickKeyword = encodeURIComponent(tar.getAttribute('key') || '');
        return obj;
    }

    function getParams15(pList, tar) {
        var obj = getLocationParams(pList);
        obj.clickKeyword = encodeURIComponent(tar.getAttribute('key') || '');
        obj.navid = tar.getAttribute('cid') || '';
        return obj;
    }

    function getCommParam() {
        var commObj = {p: 's.wanggou.com', ssId: '618', searchSource: that.opt.scene || ''};
        return commObj;
    };
};
PP.wg.jdSmartbox.reportEccMul = function (cg, obj) {
    var pars = cg.split('-');
    var cObj = $extend({p: 's.wanggou.com', ssId: '618', searchSource: this.opt.scene || '', locid1: pars[0] || '', locid2: pars[1] || '', locid3: pars[2] || ''}, obj || {});
    try {
        ECC.cloud.report.trace(cObj);
    } catch (e) {
    }
};
PP.wg.jdSmartbox.child_cstpl = function (it) {
    var out = '<a href="javascript:" data-type="jump" key="' + (it.keyword) + '" level="' + (it.level) + '" cid="' + (it.cid) + '" style="padding-left:20px;" cg="' + (it.cg) + '"><span cg="' + (it.cg) + '" key="' + (it.keyword) + '" cid="' + (it.cid) + '">在' + (it.cname) + '</span>分类中搜索</a>';
    return out;
}
PP.wg.jdSmartbox.child_seltpl = function (it) {
    var out = '<a href="javascript:" data-type="jump" key="' + (it.keyword) + '" cg="' + (it.cg) + '">' + (it.keyword) + '</a>';
    return out;
}
PP.wg.jdSmartbox.child_historytpl = function (it) {
    var out = '<a href="javascript:" key="' + (it.key) + '" cg="' + (it.cg) + '">' + (it.key) + '</a>';
    return out;
}
PP.wg.jdSmartbox.child_hottpl = function (it) {
    var out = '<a href="javascript:" tarHref="' + (it.url) + '" key="' + (it.key) + '" cg="' + (it.cg) + '">' + (it.keyword) + '</a>';
    return out;
}
PP.wg.jdSmartbox.child_indextpl = function (it) {
    var out = '<div> <div class="s_tab" dtab="s-tab" style="display:none;"> <a href="javascript:" ind="1" cg="1-6-1">最近搜索</a> <a href="javascript:" ind="2" cg="1-6-2">热门搜索</a> </div> <div class="s_row" dtab="s-row" style="display:none;"> </div> <div class="s_btn" dtab="s-btn" style="display:none;" cg="1-6-13">清除搜索历史</div> <div class="s_tag" dtab="s-tag" style="display:none;"> </div> <div class="s_btn" dtab="c-btn" style="display:none;" cg="1-7-1">换一批</div> <div class="s_row" dtab="smartWrap" style="display:none;"> </div></div>';
    return out;
}
function isMQQUserAgent() {
    if (/qq\/([\d\.]+)*/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}
window['PP.wg.jdSmartbox'] = '22156:20140605:20140806143013';
window['PP.wg.jdSmartbox.time'] && window['PP.wg.jdSmartbox.time'].push(new Date());