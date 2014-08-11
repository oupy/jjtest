define('loadscript', function (require, exports, module) {
    exports.loadScript = $loadScript;
    function $loadScript(obj) {
        if (!$loadScript.counter) {
            $loadScript.counter = 1;
        }
        var isObj = typeof(obj) == "object", url = isObj ? obj.url : arguments[0], id = isObj ? obj.id : arguments[1], obj = isObj ? obj : arguments[2], _head = document.head || document.getElementsByTagName("head")[0] || document.documentElement, _script = document.createElement("script"), D = new Date(), _time = D.getTime(), _isCleared = false, _timer = null, o = obj || {}, data = o.data || '', charset = o.charset || "gb2312", isToken = o.isToken, timeout = o.timeout, isAutoReport = o.isAutoReport || false, reportOptions = o.reportOptions || {}, reportType = o.reportType || 'current', reportRetCodeName = o.reportRetCodeName, reportSuccessCode = typeof(o.reportSuccessCode) == "undefined" ? 200 : o.reportSuccessCode, reportErrorCode = typeof(o.reportErrorCode) == "undefined" ? 500 : o.reportErrorCode, reportTimeoutCode = typeof(o.reportTimeoutCode) == "undefined" ? 600 : o.reportTimeoutCode, onload = o.onload, onsucc = o.onsucc, callbackName = o.callbackName || '', callback = o.callback, errorback = o.errorback, _jsonpLoadState = 'uninitialized';
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
        url = (isToken !== false ? $addToken(url, "ls") : url);
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
    }

    function $addToken(url, type) {
        var token = $getToken();
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
    function $getCookie(name) {
        var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
        return val ? (val[2] ? unescape(val[2]) : "") : null;
    };
    function $getToken() {
        var skey = $getCookie("skey"), token = skey == null ? "" : $time33(skey);
        return token;
    };
    function $loadUrl(o) {
        o.element = o.element || 'script';
        var el = document.createElement(o.element);
        el.charset = o.charset || 'utf-8';
        if (o.noCallback == true) {
            el.setAttribute("noCallback", "true");
        }
        el.onload = el.onreadystatechange = function () {
            if (/loaded|complete/i.test(this.readyState) || navigator.userAgent.toLowerCase().indexOf("msie") == -1) {
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
    function $report(url) {
        $loadUrl({'url': url + ((url.indexOf('?') == -1) ? '?' : '&') + "cloud=true&" + Math.random(), 'element': 'img'});
    };
    function $returnCode(opt) {
        var option = {url: "", action: "", sTime: "", eTime: "", retCode: "", errCode: "", frequence: 1, refer: location.href, uin: "", domain: "paipai.com", from: 1, report: report, isReport: false, timeout: 3000, timeoutCode: 444, formatUrl: true, reg: reg};
        for (var i in opt) {
            option[i] = opt[i];
        }
        if (option.url) {
            option.sTime = new Date();
        }
        if (option.timeout) {
            setTimeout(function () {
                if (!option.isReport) {
                    option.report(true, option.timeoutCode);
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
    function $setCookie(name, value, expires, path, domain, secure) {
        var exp = new Date(), expires = arguments[2] || null, path = arguments[3] || "/", domain = arguments[4] || null, secure = arguments[5] || false;
        expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
        document.cookie = name + '=' + escape(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    };
    function $time33(str) {
        for (var i = 0, len = str.length, hash = 5381; i < len; ++i) {
            hash += (hash << 5) + str.charAt(i).charCodeAt();
        }
        ;
        return hash & 0x7fffffff;
    }
});
define('wg.demandLoad', function (require, exports, module) {
    var $ = require('mobile.zepto'), fj = require('formatJson'), scrollCtrl = require('wg.scrollCtrl');

    function demandLoad(opt) {
        !demandLoad.guid && (demandLoad.guid = 100);
        demandLoad.guid++;
        var _opt = $.extend({minpageno: 1, pageno: 1, pagesize: 20, total: 0, preHeight: 0, isLast: null, hasFirst: null, domObj: null, tmplId: null, isDeleteNode: true, siblingPageNum: 99, initScrollTop: 0, IloadData: null, loadCompleteCallback: null, timeout: 5000}, opt), me = this, _contentPrefix = 'datapage' + demandLoad.guid + '_', _tmpl, _scrCtrl, _tempUp, _upLine, _downLine, _maxPageno, _loadingTag;
        _opt.minpageno = _opt.minpageno * 1;
        _opt.pageno = _opt.pageno * 1;
        _opt.pagesize = _opt.pagesize * 1;
        _opt.preHeight = _opt.preHeight * 1;
        _opt.siblingPageNum = _opt.siblingPageNum * 1;
        _opt.initScrollTop = _opt.initScrollTop * 1;
        typeof _opt.domObj === 'string' ? (_opt.domObj = $('#' + _opt.domObj)) : '';
        this.calcDom = function () {
            _opt.hasFirst = (_opt.pageno === 1);
            _upPageno = _opt.pageno;
        }
        this.initPageStructor = function () {
            _tempUp = createDom('DIV', '_tempUp' + demandLoad.guid);
            _upLine = createDom('DIV', '_upLine' + demandLoad.guid);
            _downLine = createDom('DIV', '_downLine' + demandLoad.guid);
            _opt.domObj.before(_tempUp);
            _opt.domObj.before(_upLine);
            _opt.domObj.after(_downLine);
            _tempUp = $('#_tempUp' + demandLoad.guid);
            _upLine = $('#_upLine' + demandLoad.guid);
            _downLine = $('#_downLine' + demandLoad.guid);
            _tempUp.css('height', (_opt.pageno - 1) * _opt.pagesize * _opt.preHeight);
            _tmpl = $('#' + _opt.tmplId).html();
            _scrCtrl = scrollCtrl.init();
        }
        this.renderData = function (datas, pageno, loadtype, total) {
            var pagesize = _opt.pagesize, begin = (pageno - 1) * pagesize, end = pageno * pagesize, contentStr, contentId, contentObj;
            if (datas.length === 0)return false;
            _opt.total = total;
            _opt.isLast = checkIsLast(pageno);
            datas.pageno = pageno;
            datas.pagesize = pagesize;
            contentId = _contentPrefix + pageno;
            contentStr = fj.formatJson(_tmpl, {data: datas});
            contentObj = $('#' + contentId);
            if (contentObj.length > 0) {
                contentObj.html(contentStr);
            } else {
                contentStr = '<div id="' + contentId + '">' + contentStr + '</div>';
                loadtype === 'next' ? _opt.domObj.append(contentStr) : _opt.domObj.prepend(contentStr);
                contentObj = $('#' + contentId);
            }
            if (_opt.initScrollTop !== null) {
                window.scrollTo(0, _opt.initScrollTop);
                _opt.initScrollTop = null;
            }
            _scrCtrl.on(contentObj.find('img[init_src]'), function (obj) {
                var imgUrl = this.getAttribute('init_src');
                if (imgUrl) {
                    this.src = imgUrl;
                    this.removeAttribute('init_src');
                }
            });
            setTimeout(function () {
                initDownBorder();
                initUpBorder();
                clearDoms(pageno);
            }, 500);
        }
        this.next = function () {
            if (_maxPageno >= (_opt.pageno + 1)) {
                ++_opt.pageno;
                _opt.IloadData && _opt.IloadData.apply(this, [_opt.pageno, _opt.pagesize, 'next']);
            }
        }
        this.prev = function () {
            var pageno = _upPageno - 1;
            if (pageno >= _opt.minpageno) {
                _opt.IloadData && _opt.IloadData.apply(this, [pageno, _opt.pagesize, 'prev']);
                --_upPageno;
            }
        }
        this.reset = function (opt) {
            _opt = $.extend(_opt, {pageno: _opt.minpageno, pagesize: 20}, opt);
            _scrCtrl.clear();
            _scrCtrl = null;
            _opt.domObj.html('');
            _tempUp.remove();
            _upLine.remove();
            _downLine.remove();
            this.init();
        }
        function clearDoms(pageno) {
            if (_opt.isDeleteNode) {
                var prevno = pageno - _opt.siblingPageNum, nextno = pageno + _opt.siblingPageNum;
                if (prevno > 0) {
                    var contentObj = $('#' + _contentPrefix + prevno), lis = $('#' + _contentPrefix + prevno).find('li[attr-pageno="' + prevno + '"]');
                    if (lis.length > 0) {
                        contentObj.html('');
                        _tempUp.css('height', prevno * _opt.pagesize * _opt.preHeight);
                        _upPageno = prevno + 1;
                    }
                }
                if (nextno > 0) {
                    var contentObj = $('#' + _contentPrefix + nextno), lis = contentObj.find('li[attr-pageno="' + nextno + '"]');
                    if (lis.length > 0) {
                        contentObj.html('');
                        _opt.pageno = nextno - 1;
                        _maxPageno = (Math.ceil(_opt.total / _opt.pagesize)).toFixed(0) * 1;
                    }
                }
            }
        }

        function initDownBorder() {
            _scrCtrl.on(_downLine[0], function (obj) {
                if (!_opt.isLast) {
                    me.next();
                }
            });
        }

        function initUpBorder() {
            _scrCtrl.on(_upLine[0], 'beforeTop', function (obj) {
                me.prev();
                _tempUp.css('height', (_upPageno - 1) * _opt.pagesize * _opt.preHeight);
            });
        }

        function checkIsLast(pageno) {
            _maxPageno = (Math.ceil(_opt.total / _opt.pagesize)).toFixed(0) * 1;
            var isLast = _maxPageno === pageno;
            if (isLast) {
                _opt.loadCompleteCallback && _opt.loadCompleteCallback();
            }
            return isLast;
        }

        function createDom(tag, id) {
            var dom = document.createElement(tag);
            dom.id = id;
            return dom;
        }

        function log(msg) {
        }

        this.init = function () {
            this.initPageStructor();
            this.calcDom();
            _opt.IloadData && _opt.IloadData.apply(this, [_opt.pageno, _opt.pagesize, 'next']);
        }
        this.init();
    }

    exports.init = function (opt) {
        return new demandLoad(opt);
    }
});
define('wg.juhui.martv3', function (require, exports, module) {
    var $ = require('mobile.zepto'), returnCode = require('wg.returnCode'), speedtime = require('wg.speedtime'), mUrl = require('url'), scrollCtrl = require('wg.scrollCtrl'), demandLoad = require('wg.demandLoad'), ls = require('loadscript'), localcache = require('wg.localcache'), util = require('wg.util'), mCookie = require('cookie'), ch = mUrl.getUrlParam('ch') || 30, checkImgSpeed = false, ua = navigator.userAgent.toLowerCase(), isWX = (ua.indexOf('micromessenger') > -1), cacheTime = 2, timeout = 10000, loadingTag, gStatic = mUrl.getUrlParam('static') || mCookie.get('wxmall_static') || 0, itilConfig = {bid: '8', mid: '14', delay: 0}, gRecovery = gStatic && (gStatic * 1 & 4) !== 0;
    if (gRecovery) {
        $('#clsSwitcher').find('a[attr-sorttype="1"],a[attr-sorttype="2"]').css('visibility', 'hidden').removeAttr('attr-tag');
    }
    function mart(opt) {
        var me = this, _opt = $.extend({reqUrl: 'http://bases.wanggou.com/mcoss/mmart/show?', tmplId: 'martListTmpl', domId: '', pagesize: 10, retUrl: '', pageno: 1, preHeight: 0, initScrollTop: 0, actid: '', areaid: '', sorttype: '0', cgid: '0', ptype: '', ch: ch, callback: 'tuancallback', tag: ''}, opt), _curData = [], _localKey, _domObj = $('#' + _opt.domId), _dl;
        this.initDemandLoader = function () {
            _dl = demandLoad.init({pageno: _opt.pageno, pagesize: _opt.pagesize, preHeight: _opt.preHeight, domObj: _domObj, tmplId: _opt.tmplId, siblingPageNum: 4, initScrollTop: _opt.initScrollTop, IloadData: function (pageno, pagesize, loadtype) {
                var func = arguments.callee, args = arguments, context = this;
                clearTimeout(loadingTag);
                hideMsg();
                showMsg(0, '<div class="wx_loading2"><i class="wx_loading_icon"></i></div>');
                loadingTag = setTimeout(function () {
                    showMsg(0, '<div onclick="martReload();">轻触此处重新加载。</div>');
                    window.martReload = function () {
                        func.apply(context, args);
                    }
                    util.itilReport(setItilConfig({res: ["1:1"]}));
                }, timeout);
                me.getDataList({pageno: pageno, pagesize: pagesize}, (function (demandLoadObj, pageno, loadtype) {
                    return function (datas, total) {
                        clearTimeout(loadingTag);
                        hideMsg();
                        demandLoadObj.renderData(datas, pageno, loadtype, total);
                        if (!checkImgSpeed) {
                            checkImgSpeed = true;
                            setTimeout(function () {
                                speedtime.report(speedTimePoint);
                                if (_domObj.find('li').length === 0) {
                                    util.itilReport(setItilConfig({res: ['2:1']}));
                                }
                            }, 3000);
                        }
                    }
                })(this, pageno, loadtype));
            }});
        }
        this.getDataList = function (req, dataLoaded) {
            var _req = $.extend({actid: _opt.actid, areaid: _opt.areaid, sorttype: _opt.sorttype, cgid: _opt.cgid, ptype: _opt.ptype, pageno: _opt.pageno, pagesize: _opt.pagesize, ch: ch, tag: _opt.tag, callback: _opt.callback}, req), cacheKey, cacheData, reqUrl;
            _req.pi = _req.pageno;
            _req.pc = _req.pagesize;
            delete _req.pageno;
            delete _req.pagesize;
            cacheKey = serializeObj(_req);
            cacheData = getCache(cacheKey);
            if (cacheData) {
                execData(cacheData);
            } else {
                !speedTimePoint[4] && (speedTimePoint[4] = new Date());
                if (gRecovery) {
                    reqUrl = 'http://www.paipai.com/sinclude/tws/tuan/' + _req.plattype + '/' + (_req.seqno != 0 ? 'topic' : 'daily') + '/' + _req.carid + '/' + _req.pi + '/' + _req.subtype + '_' + _req.seqno + '_0_' + _req.carid + '_' + _req.plattype + '_' + _req.searchid + '.js' + '?t=' + Math.random();
                } else {
                    reqUrl = _opt.reqUrl + serializeObj(_req) + '&t=' + Math.random();
                }
                ls.loadScript({url: reqUrl, charset: 'utf-8'});
                window[_req.callback] = function (obj) {
                    clearTimeout(loadingTag);
                    !speedTimePoint[5] && (speedTimePoint[5] = new Date());
                    try {
                        if (obj.errCode === '0') {
                            execData(obj);
                            if (obj.data.list.length > 0) {
                                setCache(cacheKey, obj);
                            } else {
                                showMsg(2);
                            }
                            util.itilReport(setItilConfig({res: ['0:1']}));
                        } else {
                            util.itilReport(setItilConfig({res: ['0:0']}));
                            showMsg(1, obj.msg);
                        }
                    } catch (e) {
                        util.itilReport(setItilConfig({res: ['3:1']}));
                        showMsg(1);
                    }
                }
            }
            function execData(obj) {
                _filterData(obj.data.list);
                dataLoaded(obj.data.list, obj.data.total);
            }
        }
        this.reset = function (opt) {
            _opt = $.extend(_opt, opt);
            _dl.reset();
            return this;
        }
        this.backToTop = function () {
            if (_domObj.find('li[attr-pageno="1"]').length === 0) {
                this.reset();
            }
            window.scrollTo(0, 0);
        }
        function setCache(key, data) {
            localcache.set(key, data, cacheTime);
        }

        function getCache(key) {
            return localcache.get(key);
        }

        function _filterData(datas) {
            var bracketReg = /^(【[^】]+】)/i;
            for (var i = 0; i < datas.length; i++) {
                var cmdtyData = datas[i];
                cmdtyData.sItemName = cmdtyData.sItemName.replace(bracketReg, '<em>$1</em>');
                cmdtyData.clkUrl = getCmdtyDetailUrl(cmdtyData, _opt.urltype);
                if (isWX) {
                    cmdtyData.dwActMinPrice = Math.min(cmdtyData.dwActMinPrice * 1, cmdtyData.dwWeChatPrice * 1).toFixed(2);
                }
            }
        }

        function getCmdtyDetailUrl(cmdtyData, urltype) {
            var cmdtyUrl = cmdtyData.sClickUrl;
            if (!isWX) {
                cmdtyUrl += '&_wv=1';
            }
            return cmdtyUrl + getStaticParams(cmdtyData);
        }

        function getStaticParams(cmdtyData) {
            return'&bf=' + setBF();
        }

        function setBF() {
            if (!setBF.bf) {
                var ua = navigator.userAgent.toLowerCase(), where = (ua.indexOf('micromessenger')) > -1 ? 'weixin' : ((/qq\/([\d\.]+)*/).test(ua) ? 'qq' : 'mobile'), codes = [];
                switch (where) {
                    case'weixin':
                        codes.push(1);
                        break;
                    case'qq':
                        codes.push(2);
                        break;
                    case'mobile':
                        codes.push(3);
                        break;
                    default:
                        codes.push(0);
                }
                codes.push('02');
                setBF.bf = codes.join('');
            }
            return setBF.bf;
        }

        function changePrice(price) {
            return(parseFloat(price) / 100).toFixed(2);
        }

        function serializeObj(obj) {
            var arr = [];
            for (var key in obj) {
                arr.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return arr.join('&');
        }

        function cutDown(time, out, stop) {
            var tag = setTimeout(function () {
                out && out();
            }, time);
            return{stop: function () {
                clearTimeout(tag);
                stop && stop();
            }}
        }

        function setItilConfig(opt) {
            return $.extend(itilConfig, opt);
        }

        function showMsg(type, msg) {
            var errMsg = msg;
            if (!errMsg) {
                if (type === 1) {
                    errMsg = '系统繁忙，请稍后再试';
                } else {
                    errMsg = '当前分类下暂无特惠商品，亲逛逛其他分类吧~';
                }
            }
            $('#emptyTips').html(errMsg).show();
        }

        function hideMsg() {
            $('#emptyTips').html('').hide();
        }

        function log(msg) {
            console.log(msg);
        }

        me.initDemandLoader();
    }

    exports.init = function (opt) {
        return new mart(opt);
    }
});
define('wg.juhuiv2.clsconf', function (require, exports, module) {
    var $ = require('mobile.zepto'), clsConfig = [
        {name: '全部', value: '0'},
        {name: '数码', value: '1'},
        {name: '手机', value: '2'},
        {name: '家电', value: '3'},
        {name: '家居', value: '4'},
        {name: '食品', value: '5'},
        {name: '母婴', value: '6'},
        {name: '美妆', value: '7'},
        {name: '服装', value: '8'},
        {name: '鞋包', value: '9'},
        {name: '运动', value: '10'},
        {name: '手表', value: '11'},
        {name: '配饰', value: '12'},
        {name: '爱好', value: '13'},
        {name: '图书', value: '14'}
    ];
    exports.getClsArrByType = function (type) {
        return clsConfig[type];
    }
    exports.conf = clsConfig;
});
define('wg.juhuiv2.index', function (require, exports, module) {
    var $ = require('mobile.zepto'), mUrl = require('url'), mDate = require('date'), mMart = require('wg.juhui.martv3'), mSort = require('wg.juhuiv2.sort'), mFJ = require('formatJson'), mMobileSlider = require('mobileSlider'), mLocalcache = require('wg.localcache'), gMartObj, gSortObj, gCurDateObj, gCurDateStr, gSorttype, gClstype, gStatic = mUrl.getUrlParam('static'), gUrlParams = {}, gSharePage = mUrl.getUrlParam('_share');
    vmConfig = $.extend(window.defaultVMConfig, window.vmConfig);
    function getParams() {
        var dateObj, dateStr = decodeURIComponent(mUrl.getUrlParam('__date'));
        if (dateStr) {
            dateObj = new Date(dateStr);
        }
        gCurDateObj = dateObj || new Date();
        gCurDateStr = mDate.format(gCurDateObj, 'yyyy-mm-dd hh:ii:ss');
        gUrlParams.ch = mUrl.getUrlParam('ch') || '';
    }

    function initPromote() {
        var themeDatas = themeSchedule, bannerData = [], bigImgData = [], smallImgData = [], timeReg = /\d{2}:\d{2}:\d{2}/ig;
        for (var i = 0; i < themeDatas.length - 1; i++) {
            var themeData = themeDatas[i];
            for (var j = 0; j < themeData.data.length - 1; j++) {
                var item = themeData.data[j], beginDate = item.beginDate, endDate = item.endDate;
                if (!timeReg.test(beginDate)) {
                    beginDate += ' 09:00:00';
                }
                if (!timeReg.test(endDate)) {
                    endDate = new Date(item.endDate.split('-').join('/'));
                    endDate = mDate.format(addDay(endDate, 1), 'yyyy-mm-dd') + ' 08:59:59';
                }
                if (beginDate <= gCurDateStr && endDate >= gCurDateStr) {
                    if (themeData.themeType === 1) {
                        bannerData.push(item);
                    } else if (themeData.themeType === 2) {
                        bigImgData.push(item);
                    } else if (themeData.themeType === 3) {
                        smallImgData.push(item);
                    }
                }
            }
        }
        initSlider(bannerData);
        initSubjectImgs(bigImgData, smallImgData);
    }

    function initSubjectImgs(bigData, smallData) {
        setSubjectUrl(bigData);
        setSubjectUrl(smallData);
        var subjectImgs = $('#subjectImgs'), tmpl = $('#subjectImgsTmpl').html(), result;
        if (subjectImgs.length > 0 && bigData.length > 0 && smallData.length > 0 && tmpl) {
            result = [mFJ.formatJson(tmpl, {data: bigData.slice(0, 1)}), mFJ.formatJson(tmpl, {data: smallData.slice(0, 2)})];
            subjectImgs.html(result.join('')).parent().show();
        }
    }

    function initSlider(bannerData) {
        var len = setSubjectUrl(bannerData).length, sw = document.documentElement.clientWidth, totalW, startX, tabs, sliderList = $('#slideList'), bannerTab, bannerImg, items;
        if (sliderList.length === 0 || bannerData.length === 0)return false;
        sw = sw > 640 ? 640 : sw;
        totalW = sw * len * 2;
        startX = -sw * len;
        sliderList.html(mFJ.formatJson($('#slideTmpl').html(), {data: {sw: sw, totalW: totalW, list: bannerData}})).show();
        bannerImg = $('#bannerImg');
        bannerTab = $('#bannerTab');
        items = bannerImg.find('li');
        if (bannerData.length > 1) {
            var slider = mMobileSlider.init({tp: 'img', loadImg: true, moveDom: bannerImg, moveChild: items, tab: bannerTab.show().find('li'), loopScroll: true, lockScrY: true, autoTime: 4000, viewDom: items, index: 1, fun: function (index) {
            }});
        }
        window.onresize = function () {
            var w = $(window).width();
            bannerImg.find('li').each(function (i, em) {
                em.style.width = w + 'px';
            });
            slider.resize(w);
        };
    }

    function setSubjectUrl(datas) {
        for (var i = 0; i < datas.length; i++) {
            var item = datas[i];
            item.target = (/^\d+$/).test(item.actid) ? (vmConfig.secondUrl + '?actid=' + item.actid + '&area=' + item.areaid + '&PTAG=' + item.subTuanPTAG) : item.clickUrl;
            item.target += '&ch=' + gUrlParams.ch + (gStatic ? ('&static=' + gStatic) : '');
        }
        return datas;
    }

    function renderMartList() {
        var filterData = filterObj.getFilterParams();
        gMartObj = mMart.init({domId: 'martList', actid: '35228', cgid: filterData.clstype, ptype: vmConfig.plattype, sorttype: filterData.sorttype, pageno: (filterData.pageno ? (filterData.pageno * 1) : 1), pagesize: 20, preHeight: 117, initScrollTop: (filterData.scrollTop ? (filterData.scrollTop * 1) : 0)});
    }

    var filterObj = {key: ('juhui_filter@' + location.href.split('#')[0]), getFilterParams: function () {
        var filterObj = $.extend({clstype: (mUrl.getHashParam('clstype') || 0), sorttype: 0, pageno: 1, scrollTop: 0}, mLocalcache.get(this.key));
        gSorttype = filterObj.sorttype;
        gClstype = filterObj.clstype;
        gSortObj.activeSortItem($('#clsSwitcher a[attr-sorttype="' + gSorttype + '"]'));
        gSortObj.activeClsItem($('#clstype_' + gClstype));
        mLocalcache.remove(this.key);
        return filterObj;
    }, setFilterParams: function (pageno) {
        mLocalcache.set(this.key, {clstype: gClstype, sorttype: gSorttype, scrollTop: document.body.scrollTop, pageno: pageno}, 2);
    }, setFilterHash: function () {
        mUrl.setHash('clstype=' + gClstype);
    }};
    window.setFilterParams = function (pageno) {
        filterObj.setFilterParams(pageno);
    }
    function initSort() {
        gSortObj = mSort.init({domId: 'sortDiv', clsFloat: 'categoryFloat', sortCallback: function (sorttype) {
            gSorttype = sorttype;
            gMartObj.reset({sorttype: sorttype});
        }, clsTypeCallback: function (clstype) {
            gClstype = clstype;
            filterObj.setFilterHash();
            gMartObj.reset({cgid: clstype});
        }});
    }

    function initBackBtn() {
        var dBackBtn = $('#backToTopBtn'), dBtn = $('#backTopMain'), sShowCls = 'WX_backtop_active', rParam = /(?:&|\?)_share=\w+(?:&|$)/i;
        $(document).on('scroll', function () {
            var scrollTop = $(document.body).scrollTop(), isShow = document.documentElement.clientHeight / 2 < scrollTop;
            if (isShow && !dBackBtn.hasClass(sShowCls)) {
                dBackBtn.addClass(sShowCls);
            } else if (!isShow && dBackBtn.hasClass(sShowCls)) {
                dBackBtn.removeClass(sShowCls);
            }
        });
        dBackBtn.on('click', function (e) {
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
            gMartObj.backToTop();
        });
        if (rParam.test(location.href) && vmConfig) {
            $('.wx_referrer').show();
            dBtn.attr('href', vmConfig.fisrtUrl + '?PTAG=' + vmConfig.ptags.backBtn + '&ch=' + gUrlParams.ch);
            dBtn.html('返回' + vmConfig.firstName + '首页');
            $("#backToHomePage a").attr('href', 'http://mm.wanggou.com/promote/weixin_index.shtml?PTAG=37047.3.2' + '&ch=' + gUrlParams.ch).show();
        }
    }

    function addDay(d, days) {
        return new Date(d.getTime() + 86400000 * days);
    }

    function init() {
        getParams();
        speedTimePoint[7] = new Date();
        initSort();
        speedTimePoint[8] = new Date();
        renderMartList();
        speedTimePoint[9] = new Date();
        initPromote();
        speedTimePoint[10] = new Date();
        initBackBtn();
    }

    exports.init = init;
});
define('wg.juhuiv2.sort', function (require, exports, module) {
    var $ = require('mobile.zepto'), clickEvent = 'ontouchstart'in window ? 'tap' : 'click', rd = require('wg.countRd'), clsconf = require('wg.juhuiv2.clsconf');
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
    function sortCtrl(opt) {
        var topTabs = $('div.Top_tab'), allTop = 0, _opt, _clsSwitcher, _clsList = $('#categoryFloat'), _expandCls = 'expand', _sortTopLine, _top = 0, _wrapper, _aniStat, me = this;
        topTabs.each(function () {
            allTop += $(this).offset().height - $(this).css('padding-top').replace('px', '') * 1;
        });
        allTop--;
        _opt = $.extend({clsSwitcherId: 'clsSwitcher', clsListId: 'categoryFloat', activeCls: 'select', sortTopLine: 'sortTopLine', fix: topTabs.length > 0 ? allTop : 0, sortCallback: function () {
        }, clsTypeCallback: function () {
        }}, opt);
        if (_opt.clsSwitcherId) {
            _clsSwitcher = $('#' + _opt.clsSwitcherId);
            _wrapper = _clsSwitcher.parent();
        }
        _sortTopLine = $('#sortTopLine');
        _top = _sortTopLine.length > 0 ? $getY(_sortTopLine[0]) : 0;
        this.renderClsList = function () {
            var clsStrs = [];
            for (var i = 0; i < clsconf.conf.length; i++) {
                var ptag = vmConfig.ptags.sortBtns + (i === 0 ? 1 : (i + 4));
                clsStrs.push('<a href="javascript:;" id="clstype_' + clsconf.conf[i].value + '" class="' + (i === 0 ? _opt.activeCls : '') + '" ptag="' + ptag + '">' + clsconf.conf[i].name + '</a>');
            }
            _clsList.html(clsStrs.join(''));
            _clsSwitcher.find('a[attr-tag=sort]').each(function (i) {
                this.setAttribute('ptag', vmConfig.ptags.sortBtns + (i + 2));
            });
        }
        this.bindEvent = function () {
            _clsSwitcher.on('click', function (e) {
                var src = $(e.target), attr = src.attr('attr-tag');
                if (!attr) {
                    src = src.parent();
                    attr = src.attr('attr-tag');
                }
                switch (attr) {
                    case'clsType':
                        me.switchClsList();
                        break;
                    case'sort':
                        me.switchClsList('hide');
                        if (!src.hasClass(_opt.activeCls)) {
                            me.activeSortItem(src);
                            _opt.sortCallback(src.attr('attr-sorttype'));
                            window.scrollTo(0, me.getTopLine() - _opt.fix);
                            _wrapper.removeClass('mod_filter_fixed');
                            _clsSwitcher.css('top', 0);
                        }
                        break;
                }
            });
            _clsList.on('click', function (e) {
                var src = $(e.target);
                if (src.attr('nodeName').toLowerCase() === 'a') {
                    var id = src.attr('id').split('_')[1] * 1;
                    me.activeClsItem(src);
                    _opt.clsTypeCallback(id);
                    window.scrollTo(0, me.getTopLine() - _opt.fix);
                    me.switchClsList('hide');
                    _wrapper.removeClass('mod_filter_fixed');
                    _clsSwitcher.css('top', 0);
                }
            });
            var isSupport = supportSticky();
            var startTy, swipeDirection;
            document.addEventListener('touchstart', function (e) {
                var touches = e.touches[0];
                startTy = touches.clientY;
                swipeDirection = '';
            });
            document.addEventListener('touchmove', function (e) {
                var touches = e.changedTouches[0], endTy = touches.clientY;
                if (endTy - startTy > 0) {
                    swipeDirection = 'up';
                } else if (startTy - endTy > 0) {
                    swipeDirection = 'down';
                } else {
                    swipeDirection = '';
                }
            });
            document.addEventListener('touchend', function (e) {
                setTimeout(function () {
                    showFilterBar(swipeDirection);
                }, 0);
            });
            document.addEventListener('scroll', function (e) {
                setTimeout(function () {
                    showFilterBar(swipeDirection);
                }, 0);
            });
            function showFilterBar(swipeDirection) {
                if (_aniStat === 'doing')return false;
                if (swipeDirection === 'up') {
                    var scrollTop = document.body.scrollTop;
                    _top = me.getTopLine();
                    if (scrollTop > _top + _clsSwitcher.offset().height + 50) {
                        if (!_wrapper.hasClass('mod_filter_fixed')) {
                            _wrapper.addClass('mod_filter_fixed');
                            _clsSwitcher.css('top', _opt.fix - _clsSwitcher.offset().height);
                            me.animation(_clsSwitcher, {top: _opt.fix}, function () {
                            });
                        }
                    } else {
                        _wrapper.removeClass('mod_filter_fixed');
                        _clsSwitcher.css('top', 0);
                    }
                    me.switchClsList('hide');
                } else if (swipeDirection === 'down') {
                    if (_wrapper.hasClass('mod_filter_fixed')) {
                        me.animation(_clsSwitcher, {top: _opt.fix - _clsSwitcher.offset().height}, function () {
                            _wrapper.removeClass('mod_filter_fixed');
                        });
                    }
                    me.switchClsList('hide');
                }
            }
        }
        this.animation = function (obj, cssProp, finish) {
            function _animation() {
                _aniStat = 'doing';
                for (var key in cssProp) {
                    var from = obj.css(key).replace('px', '') * 1, to = cssProp[key];
                    if (from === to) {
                        finish && finish(obj);
                        _aniStat = '';
                        return;
                    }
                    if (from < to) {
                        from += 5;
                        if (from > to)from = to;
                    } else if (from > to) {
                        from -= 5;
                        if (from < to)from = to;
                    }
                    obj.css(key, from);
                    requestAnimFrame(_animation);
                }
            }

            requestAnimFrame(_animation);
        }
        this.switchClsList = function (type) {
            if (type) {
                type === 'expand' ? (_clsSwitcher.addClass(_expandCls)) : (_clsSwitcher.removeClass(_expandCls));
            } else {
                if (_clsSwitcher.hasClass(_expandCls)) {
                    _clsSwitcher.removeClass(_expandCls);
                } else {
                    _clsSwitcher.addClass(_expandCls);
                }
            }
        }
        this.activeClsItem = function (item) {
            var filterClsBtn = $('a.category').find('i');
            _clsList.find('a.' + _opt.activeCls).removeClass(_opt.activeCls);
            item.addClass(_opt.activeCls);
            var id = item.attr('id');
            if (id === 'clstype_0' && filterClsBtn.hasClass('icon_filter_on')) {
                filterClsBtn.removeClass('icon_filter_on');
            } else if (id !== 'clstype_0' && !filterClsBtn.hasClass('icon_filter_on')) {
                filterClsBtn.addClass('icon_filter_on');
            }
        }
        this.activeSortItem = function (item) {
            item.siblings().filter('[attr-tag=sort]').removeClass(_opt.activeCls);
            item.addClass(_opt.activeCls);
        }
        this.getTopLine = function () {
            _top = _sortTopLine.length > 0 ? $getY(_sortTopLine[0]) : 0;
            return _top;
        }
        this.init = function () {
            this.renderClsList();
            this.bindEvent();
        }
        this.init();
    }

    function supportSticky() {
        var t, n = '-webkit-sticky', e = document.createElement("i");
        e.style.position = n;
        t = e.style.position;
        e = null;
        return t === n;
    };
    function $getY(e) {
        var t = e.offsetTop || 0;
        while (e = e.offsetParent) {
            t += e.offsetTop;
        }
        return t;
    }

    exports.init = function (opt) {
        return new sortCtrl(opt);
    }
});
define('wg.scrollCtrl', function (require, exports, module) {
    function throttle(delay, action, tail, debounce) {
        var now = Date.now, last_call = 0, last_exec = 0, timer = null, curr, diff, ctx, args, exec = function () {
            last_exec = now();
            action.apply(ctx, args);
        };
        return function () {
            ctx = this, args = arguments, curr = now(), diff = curr - (debounce ? last_call : last_exec) - delay;
            clearTimeout(timer);
            if (debounce) {
                if (tail) {
                    timer = setTimeout(exec, delay);
                } else if (diff >= 0) {
                    exec();
                }
            } else {
                if (diff >= 0) {
                    exec();
                } else if (tail) {
                    timer = setTimeout(exec, -diff);
                }
            }
            last_call = curr;
        }
    }

    function scrollCtrl(context) {
        var _guid = (new Date()).getTime(), _items = {}, _fix = window.screen.height, _activeTypes = {'beforeTop': 1, 'beforeBottom': 2, 'all': 0}, me = this, isArray = Array.isArray || function (object) {
            return object instanceof Array
        };
        !context && (context = document.body);
        this.on = function (objs, activeType, callback) {
            if (!arguments[2]) {
                callback = arguments[1];
                activeType = null;
            }
            if ($.type(arguments[0]) !== 'array') {
                objs = [arguments[0]];
            }
            if (objs.pos) {
                _items[_guid++] = {target: objs, callback: callback, enable: true, activeType: activeType || 'all'}
            } else {
                for (var i = 0; i < objs.length; i++) {
                    var obj = objs[i], key = obj.id || (_guid++);
                    obj.setAttribute('attr-autoload', 1);
                    _items[key] = {target: obj, callback: callback, enable: true, activeType: activeType || 'all'}
                }
            }
            this.watch();
        };
        this.watch = function () {
            var pageHeight = document.documentElement.clientHeight, pageTop = $(context).scrollTop(), pageBottom = pageHeight + pageTop;
            for (var key in _items) {
                var item = _items[key];
                if (!item || (item.enable !== true))continue;
                var target, offset, itemTop, itemBottom;
                if (item.target.pos) {
                    itemTop = item.target[0];
                    itemBottom = item.target[1];
                } else {
                    target = $(item.target), offset = target.offset(), itemTop = offset.top + (context == document.body ? 0 : pageTop), itemBottom = itemTop + offset.height;
                }
                itemTop -= _fix;
                itemBottom += _fix;
                if (this.checkIsInScreen(itemTop, itemBottom, pageTop, pageBottom, item.activeType)) {
                    if (item.enable === true) {
                        delete _items[key];
                    }
                    item.callback.apply(item.target, [item]);
                    item.target.removeAttribute('attr-autoload');
                }
            }
        };
        this.checkIsInScreen = function (itemTop, itemBottom, pageTop, pageBottom, activeType) {
            if (activeType === 'all') {
                if ((itemTop < pageBottom && itemTop > pageTop) || (itemBottom < pageBottom && itemBottom > pageTop)) {
                    return true;
                } else if (itemTop < pageTop && itemBottom > pageBottom) {
                    return true;
                }
            } else if (activeType === 'beforeTop' && itemBottom > pageTop) {
                return true;
            } else if (activeType === 'beforeBottom' && itemTop < pageBottom) {
                return true;
            }
            return false;
        };
        this.clear = function () {
            _items = {};
        };
        $(!context || context === document.body ? document : context).on('scroll', throttle(80, function () {
            me.watch();
        }, true));
    };
    exports.init = function (context) {
        return new scrollCtrl(context);
    }
});
define('wg.util', function (require, exports, module) {
    var ls = require('loadscript');

    function itilReport(option) {
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
                ls.loadScript({url: url});
            }, opt.delay);
        }
    }

    function getQuery(name, url) {
        var u = arguments[1] || window.location.search, reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"), r = u.substr(u.indexOf("\?") + 1).match(reg);
        return r != null ? r[2] : "";
    }

    function setQuery(json, url) {
        var hash = url ? url.match(/#.*/) && url.match(/#.*/)[0] || "" : location.hash, search = url ? url.replace(/#.*/, "").match(/\?.*/) && url.replace(/#.*/, "").match(/\?.*/)[0] || "" : location.search, path = url ? url.replace(/#.*/, "").replace(/\?.*/, "") : location.protocol + "//" + location.host + location.pathname;
        for (var i in json) {
            var query = i + "=" + json[i], oldValue = getQuery(i, search);
            if (oldValue) {
                search = search.replace(i + "=" + oldValue, i + "=" + json[i]);
            } else {
                search = (search.length > 0) ? search + "&" + query : "?" + query;
            }
        }
        return path + search + hash;
    }

    function getCookie(name) {
        var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
        return val ? (val[2] ? unescape(val[2]).replace(/(^")|("$)/g, "") : "") : null;
    }

    function setCookie(name, value, expires, path, domain, secure) {
        var exp = new Date(), expires = arguments[2] || null, path = arguments[3] || "/", domain = arguments[4] || null, secure = arguments[5] || false;
        expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
        document.cookie = name + '=' + escape(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    }

    function getHash(name) {
        var u = arguments[1] || location.hash;
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = u.substr(u.indexOf("#") + 1).match(reg);
        if (r != null) {
            return r[2];
        }
        return"";
    }

    function htmlDecode(str) {
        return typeof(str) != "string" ? "" : str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    }

    function htmlEncode(str) {
        return typeof(str) != "string" ? "" : str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&apos;").replace(/ /g, "&nbsp;");
    }

    function strSubGB(str, start, len, flag) {
        var total = strLenGB(str);
        if (total > (len - start)) {
            var flag = flag || "";
            var strTemp = str.replace(/[\u00FF-\uFFFF]/g, "@-").substr(start, len);
            var subLen = strTemp.match(/@-/g) ? strTemp.match(/@-/g).length : 0;
            return str.substring(0, len - subLen) + flag;
        }
        return str;
    }

    function strLenGB(v) {
        return v.replace(/[\u00FF-\uFFFF]/g, "  ").length;
    }

    function canWxPay() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.match(/micromessenger\/5/) ? true : false;
    }

    function removeStorage(key) {
        window.localStorage.removeItem(key);
    }

    function saveStorage(key, value, isJson) {
        window.localStorage.setItem(key, isJson ? JSON.stringify(value) : value);
    }

    function getStorage(key) {
        return window.localStorage.getItem(key);
    }

    function isSupportStorage() {
        if (!window.localStorage) {
            return false;
        }
        try {
            window.localStorage.setItem("test", true);
            window.localStorage.removeItem("test");
            return true;
        } catch (e) {
            return false;
        }
    }

    function isMQQUserAgent() {
        if (/qq\/([\d\.]+)*/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    }

    function preventPageScroll(node) {
        node[0].ontouchstart = handleStart;
        function handleStart(e) {
            node[0].ontouchmove = handleMove;
        }

        function handleMove(evt) {
            evt.preventDefault();
            node[0].ontouchend = handleEnd;
        }

        function handleEnd() {
            node[0].ontouchend = null;
            node[0].ontouchmove = null;
        }
    }

    module.exports = {itilReport: itilReport, getQuery: getQuery, setQuery: setQuery, getCookie: getCookie, setCookie: setCookie, getHash: getHash, htmlDecode: htmlDecode, htmlEncode: htmlEncode, strSubGB: strSubGB, strLenGB: strLenGB, canWxPay: canWxPay, isSupportStorage: isSupportStorage, isMQQUserAgent: isMQQUserAgent, saveStorage: saveStorage, getStorage: getStorage, removeStorage: removeStorage, preventPageScroll: preventPageScroll};
});