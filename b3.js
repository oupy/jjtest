try {
    if (window.WeixinJSBridge) {
        WXReadyFn()
    } else {
        window._timeout_WX_regist = setTimeout(function () {
            WXReadyFn()
        }, 1000);
        try {
            document.addEventListener("WeixinJSBridgeReady", function () {
                clearTimeout(window._timeout_WX_regist);
                WXReadyFn()
            })
        } catch (e) {
        }
    }
    function WXReadyFn() {
        if (window.shareConfig) {
            if (window.WeixinJSBridge) {
                if (shareConfig.link && shareConfig.link.indexOf("_share=") === -1) {
                    var ptype = localStorage.getItem("ptype");
                    shareConfig.link += (shareConfig.link.indexOf("?") === -1 ? "?" : "&") + "_share=wx&ptype=" + ptype
                }
                setCookie("cid", 1, 43200, "", "wanggou.com");
                FOOTDETECT.scene = "weixin";
                WeixinJSBridge.call("showOptionMenu");
                WeixinJSBridge.on("menu:share:timeline", function () {
                    if (shareConfig.clkPtag && FOOTDETECT.countRd) {
                        FOOTDETECT.countRd(shareConfig.clkPtag)
                    }
                    WeixinJSBridge.invoke("shareTimeline", shareConfig, function (e) {
                    })
                });
                WeixinJSBridge.on("menu:share:appmessage", function () {
                    if (shareConfig.clkPtag && FOOTDETECT.countRd) {
                        FOOTDETECT.countRd(shareConfig.clkPtag)
                    }
                    WeixinJSBridge.invoke("sendAppMessage", shareConfig, function (e) {
                    })
                });
                shareConfig.url = shareConfig.link;
                shareConfig.content = shareConfig.title + "  " + shareConfig.desc;
                WeixinJSBridge.on("menu:share:weibo", function (argv) {
                    if (shareConfig.clkPtag && FOOTDETECT.countRd) {
                        FOOTDETECT.countRd(shareConfig.clkPtag)
                    }
                    WeixinJSBridge.invoke("shareWeibo", shareConfig, function (e) {
                    })
                });
                WeixinJSBridge.invoke("getNetworkType", {}, function (res) {
                    var nt = res.err_msg.replace("network_type:", "");
                    switch (nt) {
                        case"fail":
                            nt = "none";
                            break;
                        case"edge":
                            nt = "2G";
                            break;
                        case"wwan":
                            nt = "3G";
                            break;
                        case"wifi":
                            nt = "wifi";
                            break
                    }
                    FOOTDETECT.network = nt;
                    var now = new Date();
                    document.cookie = "network=" + nt + ";expires=" + (new Date(now.setMinutes(now.getMinutes() + 5)).toGMTString()) + ";path=/;domain=" + (location.host.indexOf("buy.qq.com") > -1 ? "buy.qq.com" : "wanggou.com");
                    window.$ && $(document).trigger("networkReady", nt)
                })
            }
        }
    }
} catch (e) {
}
;
window['PP.wg.mobilereport.time'] && window['PP.wg.mobilereport.time'].push(new Date());
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
function $delCookie(name, path, domain, secure) {
    var value = $getCookie(name);
    if (value != null) {
        var exp = new Date();
        exp.setMinutes(exp.getMinutes() - 1000);
        path = path || "/";
        document.cookie = name + '=;expires=' + exp.toGMTString() + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    }
};
function $getBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    return window.ActiveXObject ? "IE" + ua.match(/msie ([\d.]+)/)[1] : (ua.indexOf("firefox") != -1) ? "Firefox" + ua.match(/firefox\/([\d.]+)/)[1] : (ua.indexOf("chrome") != -1) ? "Chrome" + ua.match(/chrome\/([\d.]+)/)[1] : window.opera ? "Opera" + ua.match(/opera.([\d.]+)/)[1] : window.openDatabase ? "Safari" + (/version\/([\d.]+)/.test(ua) ? ua.match(/version\/([\d.]+)/)[1] : "weixin") : ua.replace(/\s*/g, "");
};
function $getCookie(name) {
    var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
    return val ? (val[2] ? unescape(val[2]) : "") : null;
};
function $getQuery(name, url) {
    var u = arguments[1] || window.location.search, reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"), r = u.substr(u.indexOf("\?") + 1).match(reg);
    return r != null ? r[2] : "";
};
function $getUin() {
    var uin = $getCookie("uin") || $getCookie('uin_cookie') || $getCookie('pt2gguin') || $getCookie('o_cookie') || $getCookie('luin') || $getCookie('buy_uin');
    return uin ? parseInt(uin.replace("o", ""), 10) : "";
};
function $isPostMessage() {
    return postMessage ? true : false;
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
function $makeUrl(data) {
    var arr = [];
    for (var k in data) {
        arr.push(k + "=" + data[k]);
    }
    ;
    return arr.join("&");
};
function $namespace(name) {
    for (var arr = name.split(','), r = 0, len = arr.length; r < len; r++) {
        for (var i = 0, k, name = arr[r].split('.'), parent = {}; k = name[i]; i++) {
            i === 0 ? eval('(typeof ' + k + ')==="undefined"?(' + k + '={}):"";parent=' + k) : (parent = parent[k] = parent[k] || {});
        }
    }
};
function $randomInt(num1, num2) {
    if (num2 == undefined) {
        num2 = num1;
        num1 = 0;
    }
    return Math.floor(Math.random() * (num2 - num1) + num1);
};
function $report(url) {
    $loadUrl({'url': url + ((url.indexOf('?') == -1) ? '?' : '&') + Math.random(), 'element': 'img'});
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
$namespace("ECC.cloud.report");
;
(function (e) {
    function t() {
        this.json = e.JSON, this.ls = e.localStorage, this.whiteKeys = ["visitkey", "EA", "IA", "CT", "PD"]
    }

    t.prototype.isInWhiteKeys = function (e) {
        return this.whiteKeys.indexOf(e) > -1
    }, t.prototype.getAllKeys = function () {
        var e, t = [], n = this.ls;
        for (e in n)t.push(e);
        return t
    }, t.prototype.setLocCookie = function (t, n, r, i, s) {
        var o = new Date, r = arguments[2] || 5256e4, i = arguments[3] || "/", s = arguments[4] || "paipai.com", u = {};
        if (!this.isInWhiteKeys(t))return!1;
        o.setMinutes(o.getMinutes() + parseInt(r)), u.value = escape(n), u.expires = o.getTime(), u.path = i, u.domain = s, this.ls.setItem(t, this.json.stringify(u));
        try {
            e.$setCookie(t, n, r, i, s)
        } catch (a) {
        }
        return!0
    }, t.prototype.getLocCookie = function (t) {
        var n = "";
        return this.isInWhiteKeys(t) ? (n = this.ls.getItem(t)) ? (n = this.json.parse(n), n.expires && n.expires < Date.now() ? (this.ls.removeItem(t), "") : (e.$getCookie(t) || e.$setCookie(t, n.value, n.expires, n.path, n.domain), unescape(n.value || ""))) : "" : ""
    }, t.prototype.setLoc = function (e, t, n, r, i) {
        var s = new Date, n = arguments[2] || 5256e4, r = arguments[3] || "/", i = arguments[4] || "paipai.com", o = {};
        return this.isInWhiteKeys(e) ? (s.setMinutes(s.getMinutes() + parseInt(n)), o.value = escape(t), o.expires = s.getTime(), o.path = r, o.domain = i, this.ls.setItem(e, this.json.stringify(o)), !0) : !1
    }, t.prototype.getLoc = function (e) {
        var t = "";
        return this.isInWhiteKeys(e) ? (t = this.ls.getItem(e)) ? (t = this.json.parse(t), t.expires && t.expires < Date.now() ? (this.ls.removeItem(e), "") : unescape(t.value || "")) : "" : ""
    }, t.prototype.getVal = function (t) {
        var n = this.getLocCookie(t) || e.$getCookie(t);
        return n
    }, e.LsCookie = t
})(this);
window.jdPvLog = function (pvinfo) {
    function extend(target, source) {
        for (var p in source) {
            target[p] = source[p];
        }
    }

    function getRd() {
        var reg = "", resultArr = [], tmpArr = "";
        var pprd_p = $getCookie("PPRD_P") || "";
        var regs = {EA: /EA\.(\d+)\.(\d+)\.(\d+)/gim, IA: /IA\.(\d+)\.(\d+)\.(\d+)/gim, CT: /CT\.(\d+)\.(\d+)\.(\d+)/gim, PD: /PD\.(\d+)\.(\d+)\.(\d+)/gim};
        if (pprd_p.length) {
            for (var prefix in regs) {
                reg = regs[prefix];
                tmpArr = pprd_p.match(reg);
                tmpArr && tmpArr.length && resultArr.push(tmpArr[0]);
            }
            return resultArr.join('-');
        }
        return"";
    }

    var ua = navigator.userAgent.toLowerCase(), scene = window.FOOTDETECT || window.FOOTDETECT.scene || ((ua.indexOf('micromessenger')) > -1 ? 'weixin' : ((/qq\/([\d\.]+)*/).test(ua) ? 'qq' : 'mobile')), network = window.FOOTDETECT || window.FOOTDETECT.network, params = {chan_type: ({weixin: 1, qq: 2, mobile: 3})[scene] || 3, net_type: ({'wifi': 1, '2G': 2, '3G': 2})[network] || 3, cookie_ptag: getRd(), openid: $getCookie('open_id') || "", wid: $getCookie('wg_uin') || "", screen: window.jdPvLog.envData.screen.size, color: window.jdPvLog.envData.screen.color, os: window.jdPvLog.envData.os, browser: window.jdPvLog.envData.browser.name + '/' + window.jdPvLog.envData.browser.version};
    pvinfo = pvinfo || {};
    if (({}).toString.call(pvinfo) != '[object Object]') {
        return;
    }
    extend(pvinfo, params);
    window.ja && window.ja.log('wg_wx.000000', pvinfo);
    window.ja_data = {};
};
;
(function (W, D) {
    var g = void 0, p = "push", y = "join", s = "split", l = "length", ind = "indexOf", pr = "prototype", t = "toLowerCase", G = {}, enc = encodeURIComponent, dec = decodeURIComponent, writeCookie = function (n, v, d, t) {
        n = n + "=" + v + "; path=/; ";
        t && (n += "expires=" + (new Date(new Date().getTime() + t * 1E3)).toGMTString() + "; ");
        d && (n += "domain=" + d + ";");
        D.cookie = n;
    }, readCookie = function (n) {
        for (var b = n + "=", c = D.cookie.split(";"), d = 0, l = c.length; d < l; d++) {
            for (var e = c[d]; " " == e.charAt(0);)e = e.substring(1, e.length);
            if (0 == e.indexOf(b))return e.substring(b.length, e.length);
        }
        return null;
    }, mergeObj = function (source, target) {
        source = source || {}, target = target || {};
        for (var i in source) {
            target[i] = source[i];
        }
        return target;
    }, log = function (t, vs) {
        var vsstring = "";
        for (var v in vs) {
            vsstring += (v + "=" + vs[v]) + "$";
        }
        vsstring = vsstring.substring(0, vsstring.length - 1);
        var traceurl = ("https:" == D.location.protocol ? "https://mercuryssl" : "http://hermes") + ".jd.com/log.gif" + "?t=" + t + "&m=MO_J2011-2" + "&pin=" + enc(readCookie("jd_pin") || '-') + "&sid=" + readCookie("visitkey") + '|' + G.jda.page_seq + "&fst=" + G.jda.first_session_time + "&pst=" + G.jda.prev_session_time + "&vct=" + G.jda.now_session_time + "&vt=" + G.jda.session_seq + "&v=" + enc(vsstring) + "&url=" + enc(W.location.href) + "&ref=" + enc(D.referrer) + "&rm=" + (new Date).getTime();
        var d = new Image(1, 1);
        d.src = traceurl;
        d.onload = function () {
            d.onload = null;
            d.onerror = null;
        };
        d.onerror = function () {
            d.onload = null;
            d.onerror = null;
        };
        window['_mercury_img'] = d;
    };
    G.now = Math.floor((new Date).getTime() / 1000);
    G.logid = G.now + '.' + Math.round(Math.random() * 2147483647)
    G.domain = (function () {
        r = /\w+.(com\.cn|com|net|cn)/.exec(document.domain[t]());
        if (r.length) {
            return r[0];
        }
        return'wanggou.com';
    })();
    G.jda = (function () {
        var c = readCookie("__jda"), c = c ? c.split('.') : [], rs = {}, session_available = c[0] && G.now - c[0] <= 1800;
        rs.now = G.now;
        rs.now_session_time = session_available && c[1] ? c[1] : rs.now;
        rs.prev_session_time = c[2] ? (session_available ? c[2] : (c[1] ? c[1] : rs.now)) : rs.now;
        rs.first_session_time = c[3] ? c[3] : rs.now;
        rs.page_seq = session_available && c[4] ? c[4] * 1 + 1 : 1;
        rs.session_seq = c[5] ? (session_available ? c[5] : c[5] * 1 + 1) : 1;
        c = rs.now + '.' + rs.now_session_time + '.' + rs.prev_session_time + '.' + rs.first_session_time + '.' + rs.page_seq + '.' + rs.session_seq;
        writeCookie("__jda", c, G.domain, 31536E3);
        return rs;
    })();
    G.screen = (function () {
        var a = {}, c = W.screen;
        a.size = c ? c.width + "x" + c.height : "-";
        a.color = c ? c.colorDepth + "-bit" : "-";
        return a;
    })();
    G.browser = (function () {
        var a = {name: "other", version: "0"}, ua = navigator.userAgent[t](), n = W.navigator;
        browserRegExp = {se360: /360se/, se360_2x: /qihu/, ie: /msie[ ]([\w.]+)/, firefox: /firefox[|\/]([\w.]+)/, chrome: /chrome[|\/]([\w.]+)/, safari: /version[|\/]([\w.]+)(\s\w.+)?\s?safari/, opera: /opera[|\/]([\w.]+)/, webkit: /applewebkit\/([\w.]+)/};
        for (var i in browserRegExp) {
            var match = browserRegExp[i].exec(ua);
            if (match) {
                a.name = i;
                a.version = match[1] || "0";
                break;
            }
        }
        a.language = (n && (n.language || n.browserLanguage) || "-")[t]();
        a.javaEnabled = n && n.javaEnabled() ? 1 : 0;
        a.characterSet = D.characterSet || D.charset || "-";
        return a;
    })();
    G.os = (function () {
        var o = /(win|android|linux|nokia|ipad|iphone|ipod|mac|sunos|solaris)/.exec(navigator.platform.toLowerCase());
        return o == null ? "other" : o[0];
    })();
    ;
    var ja_data = window.ja_data || {};
    if (!ja_data.disable_auto) {
        setTimeout(function () {
            window.$ && ($(document).tap) && $(document).on("tap", function (e) {
                var ja_data_click = window.ja_data || {};
                var targetNode = e.target, targetUrl = "";
                while (!targetUrl && targetNode && targetNode.nodeName != "BODY" && targetNode.getAttribute) {
                    targetUrl = targetNode.getAttribute('href') || "";
                    if (targetUrl && targetUrl[0] == '#' || targetUrl.indexOf('javascript') > -1) {
                        targetUrl = targetNode.getAttribute('ptag') || targetNode.getAttribute('PTAG') || targetNode.getAttribute('tourl') || targetNode.getAttribute('target_href') || '';
                    }
                    if (!targetUrl) {
                        targetNode = targetNode.parentNode;
                    }
                }
                log('wg_wx.000001', mergeObj(ja_data_click, {logid: G.logid, target: targetUrl}));
            });
        }, 80);
    }
    W.ja = {log: log};
    W.jdPvLog.envData = G;
})(window, document);
ECC.cloud.report = {_w: window, _d: document, _r: document.referrer.replace("http://", "").replace("https://", ""), _v: $getCookie("visitkey"), _t: (new Date()).getTime(), _o: true, data: {p: 'buy.qq.com', v: '', m: 'GET', s: '200', r: '', stParam: '', pvid: '', ver: '2.2', time: '', project: '', rt: window.screen.width + "*" + window.screen.height, c: window.screen.colorDepth, deadline: 24, b: $getBrowser()}, locusInfo: '', pvlog: {'stracepvlog': 'http://dmtrack.buy.qq.com/pvlog/stracepvlog?', 'savepvlog': 'http://dmtrack.buy.qq.com/pvlog/savepvlog?'}, uin: $getUin(), isPP: false, is51: false, isJd: false, isWangGou: false, isYixun: false, isWeiGou: false, cref: false, curDomain: 'paipai.com'};
try {
    ECC.cloud.report._lh = document.location.href;
}
catch (e) {
    ECC.cloud.report._lh = document.createElement("a");
    ECC.cloud.report._lh.href = "";
    ECC.cloud.report._lh = ECC.cloud.report._lh.href;
}
ECC.cloud.report._u = ECC.cloud.report._lh.replace("http://", "").replace("https://", "");
ECC.cloud.report._lt = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/.exec(ECC.cloud.report._lh.toLowerCase()) || [];
try {
    ECC.cloud.report._h = document.location.hostname;
}
catch (e) {
    ECC.cloud.report._h = ECC.cloud.report._lt[2];
}
ECC.cloud.report.init = function () {
    var that = this;
    this.setInfo();
    this.analyze();
    this.script();
};
ECC.cloud.report.setInfo = function () {
    this.data.pvid = this._v + this._t + $randomInt(10);
    if (!this.check())
        return;
    this.setCurDomain();
    this.renewVK();
    if (!this._r) {
        var unpPvRefer = $getCookie("unp_pv_refer");
        if (unpPvRefer) {
            this._r = unpPvRefer.replace("http://", "").replace("https://", "");
            this.cref = true;
        }
    }
    $setCookie('unp_pv_refer', ECC.cloud.report._u, '52560000', '', this.curDomain);
    this.data.r = encodeURIComponent(this._r);
    this.data.time = this._t;
    this.data.stParam = "visitkey:" + this._v + "|uin:" + this.uin;
    this._lh.indexOf("error/40x") != -1 && (this.data.s = 400);
    this._lh.indexOf("error/50x") != -1 && (this.data.s = 500);
    if (this.uin) {
        var buyUin = $getCookie('buy_uin');
        if (this.uin != buyUin)
            $setCookie('buy_uin', this.uin, '52560000', '', this.curDomain);
    }
};
ECC.cloud.report.check = function () {
    var host = this._h, isBBC = /^(\w+\.)*buy\.qq\.com$/.test(host), isSP = /^(\w+\.)*shop\.qq\.com$/.test(host), isWeiGou = /^(\w+\.)*weigou\.qq\.com$/.test(host), isInfo = /^paipai\.(((lady|digi)\.qq\.com)|ellechina\.com|pchouse\.com\.cn)$/.test(host), isQQMail = /^(\w+\.)*mail\.qq\.com$/.test(host), isWangGou = /^(\w+\.)*wanggou\.com$/.test(host), isYixun = /^(\w+\.)*yixun\.com$/.test(host), isLvRen = /^(\w+\.)*lvren\.com$/.test(host), isQQ = /^(\w+\.)*qq\.com$/.test(host) && !isBBC && !isSP && !isInfo && !isWeiGou, isPP = /^(\w+\.)*paipai\.com$/.test(host), isTP = /^(\w+\.)*tenpay\.com$/.test(host), is51 = /^(\w+\.)*51buy\.com$/.test(host), isJd = /^(\w+\.)*jd\.com$/.test(host), isQO = /^www\.qolala\.com$/.test(host);
    this.isPP = isPP;
    this.is51 = is51;
    this.isJd = isJd;
    this.isWangGou = isWangGou;
    this.isYixun = isYixun;
    this.isWeiGou = isWeiGou;
    $setCookie('g_pvid', this.data.pvid, '', '', isPP ? 'paipai.com' : 'qq.com');
    if ((!isQQ && !isBBC && !isPP && !isTP && !isSP && !is51 && !isJd && !isYixun && !isInfo && !isQO && !isWangGou && !isLvRen && !isWeiGou) || (isTP && isQQBuy != 1) || (isQQ && !isQQMail && !window['AIOPAGE'])) {
        this._o = false;
    }
    return this._o;
};
ECC.cloud.report.setCurDomain = function () {
    this.is51 && (this.curDomain = '51buy.com');
    this.isYixun && (this.curDomain = 'yixun.com');
    this.isWangGou && (this.curDomain = 'wanggou.com');
    this.isPP && (this.curDomain = 'paipai.com'), this.isWeiGou && (this.curDomain = 'qq.com');
    this.isJd && (this.curDomain = 'jd.com');
};
ECC.cloud.report.renewVK = function () {
    this._v = $getCookie("visitkey");
};
ECC.cloud.report.renewStParam = function () {
    this.renewVK();
    !this.uin && (this.uin = $getUin());
    if (!this.uin) {
        var buyUin = $getCookie('buy_uin');
        this.uin = buyUin;
    }
    this.data.stParam = "visitkey:" + this._v + "|uin:" + this.uin;
};
ECC.cloud.report.pv = function (pvInfo) {
    if (!this._o)return;
    this.data.v = this.parseObj(pvInfo);
    this.doReport('pv');
};
ECC.cloud.report.trace = function (opt, tar) {
    if (!this._o)
        return;
    this.locus(tar);
    if (typeof(opt) == "object") {
        opt.p = opt.p || 'paipai.com';
        opt.weixin = opt.weixin || 1;
        opt.client = opt.client || this.getVP();
        this.data.v = this.parseObj(opt, 'click');
    } else {
        this.data.v = opt;
    }
    this.doReport('click');
};
ECC.cloud.report.doReport = function (type) {
    var that = this;
    this.pvType = type;
    if (!$getCookie("visitkey") || !document.getElementById("syn_vk_iframe")) {
        if (this.isSynPPVisitKey) {
            return;
        }
        this.isSynPPVisitKey = true;
        this.synPPVisitKey();
    } else {
        ECC.cloud.report.renewStParam();
        $report((ECC.cloud.report.pvType == 'pv' ? ECC.cloud.report.pvlog.savepvlog : ECC.cloud.report.pvlog.stracepvlog) + $makeUrl(ECC.cloud.report.data));
    }
};
ECC.cloud.report.pipe = function (url) {
    if (url) {
        if (url.indexOf("?") < 0)url += "?";
        this.renewStParam();
        $report(url + '&' + $makeUrl(this.data));
    }
};
ECC.cloud.report.parseObj = function (obj, type) {
    var report = [];
    if (type == 'click') {
        report.push('locus:' + this.locusInfo);
    }
    this.cref && report.push('cref:1');
    for (var key in obj) {
        if (key == "p") {
            this.data.p = obj.p;
            this.setPvlog(obj.p);
            continue;
        }
        report.push(key + ':' + obj[key]);
    }
    return report.join('|');
};
ECC.cloud.report.setPvlog = function (p) {
    if (p == 'search.51buy.com' || p == '51buy.com') {
        this.pvlog = {'stracepvlog': 'http://dmtrack.buy.qq.com/pvlog/stracepvlog?', 'savepvlog': 'http://dmtrack.buy.qq.com/pvlog/savepvlog?'};
    } else if (p == 'paipai.com' || p == 'aio.com' || p == 's.wanggou.com' || p == 'm.wanggou.com') {
        this.pvlog = {'stracepvlog': 'http://dmtrack.paipai.com/pvlog/stracepvlog?', 'savepvlog': 'http://dmtrack.paipai.com/pvlog/savepvlog?'};
    }
};
ECC.cloud.report.bindTap = function () {
    function reportTap(tar) {
        var oldTar = tar, manualclick = '', toUrl = '', pp = '', wg = '', id = '', name = '', policy = '', stuff = '', material = '';
        while (tar && tar.tagName != "BODY" && tar.tagName != "HTML") {
            if (tar.tagName == 'TBODY' || tar.tagName == 'THEAD') {
                tar = tar.parentNode;
            }
            else {
                !id && (id = tar.id || '');
                !name && (id = tar.name || '');
                if (tar.getAttribute) {
                    !pp && (pp = tar.getAttribute('ptag') || tar.ptag || '');
                    !wg && (wg = tar.getAttribute('wgtag') || tar.wgtag || '');
                    !policy && (policy = tar.getAttribute('policy') || tar.policy || '');
                    !stuff && (stuff = tar.getAttribute('stuff') || tar.stuff || '');
                    !material && (material = tar.getAttribute('material') || tar.material || '');
                    !toUrl && (toUrl = tar.getAttribute('tourl') || tar.tourl || '');
                    !manualclick && (manualclick = tar.getAttribute('manualclick') || tar.manualclick || '');
                }
                if (tar.tagName == 'A') {
                    !toUrl && (toUrl = tar.href);
                    var arr = toUrl.toLowerCase().match(/ptag(=|,|%3d)(\d+\.\d+\.\d+)/);
                    !pp && arr && (pp = arr[2]);
                    var wgarr = toUrl.toLowerCase().match(/wgtag(=|,|%3d)(\d+\.\d+\.\d+\.\d+)/);
                    !wg && wgarr && (wg = wgarr[2]);
                }
                tar = tar.parentNode;
            }
        }
        ;
        var objMsg = window.AIOPAGE ? {p: "aio.com"} : {p: "paipai.com"};
        var clientObj = {weixin: "1001", mqq: "2001", other: "4001"};
        if (document.domain == "pinpai.yixun.com") {
            objMsg.witem = "1";
        } else if (document.domain == "witem.yixun.com") {
            objMsg.witem = "2";
        }
        objMsg.weixin = 1;
        objMsg.client = clientObj[that.getVP()];
        pp && (objMsg.ptag = pp);
        wg && (objMsg.wgtag = wg);
        id && (objMsg.id = id);
        name && (objMsg.name = name);
        policy && (objMsg.policy = policy);
        stuff && (objMsg.stuff = stuff);
        material && (objMsg.material = material);
        tar && !manualclick && that.trace(objMsg, oldTar);
    }

    var that = this;
    if (!that._o)
        return;
    if (!window.GLOBAL_MANUAL_CLICK && window.$ && typeof $(document).tap == 'function') {
        $(document).tap(function (e) {
            reportTap(e.target);
        });
    }
}
ECC.cloud.report.bind = function () {
    var that = this;
    try {
        that.bindTap();
    } catch (ex) {
    }
};
ECC.cloud.report.locus = function (tar) {
    if (!this._o)
        return;
    if (!tar) {
        this.locusInfo = '';
        this.data.project = '';
        return;
    }
    var locus = [], toUrl = '';
    while (tar && tar.tagName != "BODY" && tar.tagName != "HTML") {
        if (tar.tagName == 'TBODY' || tar.tagName == 'THEAD') {
            tar = tar.parentNode;
        }
        else {
            if (tar.getAttribute) {
                !toUrl && (toUrl = tar.getAttribute('tourl') || tar.tourl || '');
            }
            if (tar.tagName == 'A') {
                !toUrl && (toUrl = tar.href);
            }
            if (toUrl) {
                toUrl = $strTrim(toUrl);
                if (toUrl.indexOf('javascript:') == 0) {
                    toUrl = "";
                }
                else {
                    var now = this._u.split('#')[0], cur = toUrl.replace("http://", "").replace("https://", "").split('#')[0];
                    now == cur && (toUrl = "");
                }
            }
            locus.push(tar.tagName + ':' + this.locusIndex(tar));
            tar = tar.parentNode;
        }
    }
    ;
    if (locus.length > 0) {
        var trace = locus.reverse().join('-');
        if (/A|IMG|INPUT|BUTTON|SELECT/.test(trace) && trace.indexOf('CUSTOM:0') !== 0) {
            this.locusInfo = this.locusZip(trace);
            this.data.project = encodeURIComponent(toUrl);
        }
    }
};
ECC.cloud.report.locusIndex = function (lm) {
    var cur = lm, index = 0;
    while (cur = cur.previousSibling) {
        if (lm.tagName == cur.tagName) {
            index++;
        }
    }
    return index;
};
ECC.cloud.report.locusZip = function (trace) {
    return trace.replace(/BUTTON/g, '0').replace(/CUSTOM/g, '1').replace(/DIV/g, '2').replace(/IMG/g, '3').replace(/INPUT/g, '4').replace(/SELECT/g, '5').replace(/SPAN/g, '6').replace(/UL/g, '7').replace(/LI/g, '8').replace(/OL/g, '9');
};
ECC.cloud.report.getVP = function () {
    var that = this;
    if (that._vp) {
        return that._vp;
    }
    var ua = navigator.userAgent.toLowerCase();
    var browsers = {weixin: /micromessenger/, mqq: /qq\/([\d\.]+)*/};
    var temp = "other";
    for (var i in browsers) {
        if (browsers[i].test(ua)) {
            temp = i;
            break;
        }
    }
    that._vp = temp;
    return temp;
}
ECC.cloud.report.analyze = function () {
    if ($getQuery('zxtj') === 'true') {
        $setCookie('g_tj', 'zxtj', '', '', this.isPP ? 'paipai.com' : 'qq.com')
    }
    else if ($getQuery('zxtj') === 'false') {
        $delCookie('g_tj', '', this.isPP ? 'paipai.com' : 'qq.com');
    }
    if ($getCookie('g_tj') === 'zxtj') {
        $loadUrl({url: 'http://static.gtimg.com/js/version/2011/11/bbc.cloud.analyze.20111110.js'})
    }
};
ECC.cloud.report.sampling = function () {
    return true;
};
ECC.cloud.report.setUin = function (info) {
    if (!this._o)
        return;
    if (info.uin) {
        var buyUin = $getCookie('buy_uin');
        if (info.uin != buyUin)
            $setCookie('buy_uin', info.uin, '52560000', '', this.curDomain);
    }
};
ECC.cloud.report.script = function () {
    if (!this._o)
        return;
    try {
        var all = document.body.getElementsByTagName("script");
        for (var i = 0, len = all.length; i < len; i++) {
            var item = all[i];
            if (item.id && item.id.indexOf('legos:') == 0) {
                var name = item.getAttribute('name'), ver = item.getAttribute('ver'), cgi = name, type = 1, code = 0, time = 0;
                if (window[cgi + ".time"] && window[cgi + ".time"].length > 2) {
                    time = window[cgi + ".time"][1] - window[cgi + ".time"][0]
                }
                cgi += '-' + ver;
                if (!window[name]) {
                    type = 2;
                    code = 5;
                } else if (window[name] != ver) {
                    type = 2;
                    code = 1;
                }
                if ((type == 1 && $randomInt(10) < 2) || type == 2) {
                    $report('http://c.isdspeed.qq.com/code.cgi?domain=static.gtimg.com&cgi=' + cgi + '&type=' + type + '&code=' + code + '&time=' + time + '&rate=' + 5);
                }
            }
        }
    } catch (e) {
    }
    ;
};
ECC.cloud.report.loadPaipaiVK = function () {
    var tempIframe;
    var visitkey = $getCookie("visitkey") ? $getCookie("visitkey") : "";
    if ($isPostMessage()) {
        if (!(tempIframe = document.getElementById("load_ppvk_ifr"))) {
            tempIframe = document.createElement("iframe");
            tempIframe.id = "load_ppvk_ifr";
            tempIframe.style.display = "none";
            document.getElementsByTagName("body")[0].appendChild(tempIframe);
        }
        tempIframe.src = "http://www.paipai.com/iframe/vk_iframe.shtml?visitkey=" + visitkey + "&_t=" + Math.random();
    } else {
        $loadUrl({url: 'http://party.paipai.com/tws64/m/pvlog/set_visitkey?visitkey=' + visitkey + '&callback=ECC.cloud.setparams.setUnifyVkCallBack'});
    }
}
ECC.cloud.report.synPPRD_P = function (data) {
    function synLS2PPRD_P() {
        var val = "";
        for (var i = 0, len = pprd_p_arr.length; i < len; i++) {
            val = ls.getLoc(pprd_p_arr[i]);
            if (!!val) {
                synValue2PPRD_P(pprd_p_arr[i], val);
            }
        }
    }

    function synValue2PPRD_P(prefix, val) {
        var pprd_p = $getCookie("PPRD_P") || "";
        var rd = prefix + "." + val;
        var regs = {EA: /EA\.(\d+)\.(\d+)\.(\d+)(\D?)/gim, IA: /IA\.(\d+)\.(\d+)\.(\d+)(\D?)/gim, CT: /CT\.(\d+)\.(\d+)\.(\d+)(\D?)/gim, PD: /PD\.(\d+)\.(\d+)\.(\d+)(\D?)/gim};
        var reg = regs[prefix];
        if (!reg.test(pprd_p)) {
            pprd_p += (0 == pprd_p.length ? rd : "-" + rd);
        } else {
            if ("EA" == prefix || "IA" == prefix || "CT" == prefix || "PD" == prefix) {
                pprd_p = pprd_p.replace(reg, rd + "$4");
            }
        }
        try {
            $setCookie("PPRD_P", pprd_p, 4320, "/", that.getCurDomain());
        } catch (ex) {
        }
    }

    window.getPingDataCallBack = function () {
        synLS2PPRD_P();
    }
    function setPPRD_P(data) {
        var val = "", rd = "", prefix = "", reg = "";
        var regs = {EA: /EA\.(\d+)\.(\d+)\.(\d+)(\D?)/gim, IA: /IA\.(\d+)\.(\d+)\.(\d+)(\D?)/gim, CT: /CT\.(\d+)\.(\d+)\.(\d+)(\D?)/gim, PD: /PD\.(\d+)\.(\d+)\.(\d+)(\D?)/gim};
        var data = window.JSON.parse(data);
        var pprd_p = $getCookie("PPRD_P") || "";
        for (prefix in data) {
            reg = regs[prefix];
            val = data[prefix];
            rd = prefix + "." + val;
            if (!reg.test(pprd_p)) {
                pprd_p += (0 == pprd_p.length ? rd : "-" + rd);
            } else {
                if ("EA" == prefix || "IA" == prefix || "CT" == prefix || "PD" == prefix) {
                    pprd_p = pprd_p.replace(reg, rd + "$4");
                }
            }
            ls.setLoc(prefix, val, 4320, "/", that.getCurDomain());
        }
        $setCookie("PPRD_P", pprd_p, 4320, "/", that.getCurDomain());
    }

    var that = this;
    var ls = new LsCookie();
    var pprd_p_arr = ["EA", "IA", "CT", "PD"];
    setPPRD_P(data);
}
ECC.cloud.report.getCurDomain = function () {
    var curDom, that = this;
    if (!(curDom = that.curDom)) {
        curDom = document.domain;
        that.is51 && (curDom = '51buy.com');
        that.isYixun && (curDom = 'yixun.com');
        that.isWangGou && (curDom = 'wanggou.com');
        that.isPP && (curDom = 'paipai.com');
        that.isJd && (curDom = 'jd.com');
        that.curDom = curDom;
    }
    return curDom;
}
ECC.cloud.report.synPPVisitKey = function () {
    function getPtag() {
        try {
            var pageid, val;
            var newrd_reg = /PTAG[=,](\d+)\.(\d+)\.(\d+)\D?/gim;
            var arr = newrd_reg.exec(location.href.toString());
            if (arr == null || arr.length != 4 || arr[1] < 0 || arr[2] < 0 || arr[3] < 0) {
                return;
            }
            pageid = arr[1];
            val = arr[1] + "." + arr[2] + "." + arr[3];
            if ((pageid >= 17001 && pageid < 20000) || (pageid >= 27001 && pageid < 30000) || (pageid >= 37001 && pageid < 40000) || (pageid >= 47001 && pageid < 50000)) {
                return val;
            }
        } catch (e) {
        }
    }

    function onPPVKMsg(e) {
        var data = e.data || "", origin = e.origin;
        data = data.split("=");
        if (origin.indexOf("paipai.com") > -1 && data[0]) {
            if (data[0] == "visitkey") {
                $setCookie("visitkey", data[1], "52560000", "", that.getCurDomain());
                ECC.cloud.report.renewStParam();
                $report((ECC.cloud.report.pvType == 'pv' ? ECC.cloud.report.pvlog.savepvlog : ECC.cloud.report.pvlog.stracepvlog) + $makeUrl(ECC.cloud.report.data));
                that.isSynPPVisitKey = false;
                typeof window.__footSynIframeCbk == 'function' && window.__footSynIframeCbk();
                window.jdPvLog(window.ja_data);
                if (!that.hasBindOnTouch) {
                    that.hasBindOnTouch = true;
                    that.bind();
                }
            } else if (data[0] == "PPRD_P") {
                data[1] ? that.synPPRD_P(data[1]) : "";
            }
            else if (data[0] == "pprd_p_exp") {
                try {
                    if (!data[1] || !/^(\w+\.|)(wanggou\.com|buy\.qq\.com)$/i.test(window.location.hostname.toLowerCase())) {
                        return;
                    }
                    var parent_pprd = $getCookie('PPRD_P') || '', value = data[1].split('-'), regs = {QZZTC: /QZZTC\.([^\.\-]*)/gim, ETGS: /ETGS\.([^\.\-]*)/gim, CPS: /CPS\.([^\.\-]*)/gim, CPC: /CPC\.([^\.\-]*)/gim};
                    for (var i = 0; i < value.length; ++i) {
                        var param = value[i].split('.'), prefix, reg, rd;
                        if (param.length !== 2) {
                            continue;
                        }
                        prefix = param[0] || '';
                        reg = regs[prefix];
                        rd = value[i];
                        if (!reg) {
                            continue;
                        }
                        if (!reg.test(parent_pprd)) {
                            parent_pprd += (parent_pprd.length == 0 ? rd : '-' + rd);
                        }
                        else {
                            parent_pprd = parent_pprd.replace(reg, rd);
                        }
                    }
                    $setCookie('PPRD_P', parent_pprd, 4320, "/", that.getCurDomain());
                } catch (e) {
                }
            }
        }
    }

    var tempIframe, ptag, url, visitkey = $getQuery("visitkey"), that = this;
    if (!(tempIframe = document.getElementById("syn_vk_iframe"))) {
        ptag = getPtag();
        $addEvent(window, "message", onPPVKMsg);
        tempIframe = document.createElement("iframe");
        tempIframe.id = "syn_vk_iframe";
        tempIframe.style.display = "none";
        url = "http://www.paipai.com/mobile/synvisitkey.shtml" + (visitkey ? "?visitkey=" + visitkey : "");
        url += ptag ? (url.indexOf("?") > -1 ? "&ptag=" + ptag : "?ptag=" + ptag) : "";
        tempIframe.src = url;
        document.getElementsByTagName("body")[0].appendChild(tempIframe);
    }
}
ECC.cloud.report.init();
$namespace("ECC.cloud.setparams");
ECC.cloud.setparams.setUnifyVkCallBack = function (info) {
    if (info.visitkey && info.visitkey != $getCookie("visitkey") && ECC.cloud.report.curDomain != "paipai.com") {
        $setCookie('visitkey', info.visitkey, '52560000', '', ECC.cloud.report.curDomain);
    }
    ECC.cloud.report.renewStParam();
    $report((ECC.cloud.report.pvType == 'pv' ? ECC.cloud.report.pvlog.savepvlog : ECC.cloud.report.pvlog.stracepvlog) + $makeUrl(ECC.cloud.report.data));
};
ECC.cloud.setparams.getUnifyVkCallBack = function (info) {
    if (info.visitkey) {
        $setCookie('visitkey', info.visitkey, '52560000', '', ECC.cloud.report.curDomain);
        var curStamp = parseInt((new Date()).getTime() / 1000);
        $setCookie(ECC.cloud.report.checkTime, curStamp, '52560000', '', ECC.cloud.report.curDomain);
    }
    ECC.cloud.report.loadPaipaiVK();
}
window['PP.wg.mobilereport'] = '21948:20140716:20140806154058';
window['PP.wg.mobilereport.time'] && window['PP.wg.mobilereport.time'].push(new Date());
!function () {
    function a(a) {
        var b = new RegExp("(^| )" + a + "(?:=([^;]*))?(;|$)"), c = document.cookie.match(b);
        return c ? c[2] ? unescape(c[2]) : "" : null
    }

    function b(a) {
        var b = "_SPEEDPOINT" + Math.random();
        window[b] = new Image, window[b].src = a
    }

    FOOTDETECT.setSpeedRpt = function (c) {
        function d(a) {
            "wifi" == a ? e(f[0][1], f[0][2], f[0][3]) : "2G" == a || "3G" == a ? e(f[0][4], f[0][5], f[0][6]) : e(f[0][7], f[0][8], f[0][9])
        }

        function e(a, c, d) {
            setTimeout(function () {
                if (f.length >= 2) {
                    for (var e = [], g = 1; g < f.length; g++)f[g] && e.push(g + "=" + (f[g] - f[0][0]));
                    b("http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=" + a + "&flag2=" + c + "&flag3=" + d + "&" + e.join("&"))
                }
            }, g), f.hasReport = !0
        }

        var f = c || window.speedTimePoint, g = 0;
        if (f && -1 !== f.rptTime && !f.hasReport && !window.MANUAL_SPEED && !f.manualReport)if (f.rptTime > 0 && (g = f.rptTime), f.diffNetwork) {
            var h = a("network");
            h ? d(h) : window.$ && $(document).on("networkReady", function (a, b) {
                d(b)
            })
        } else e(f[0][1], f[0][2], f[0][3])
    }, FOOTDETECT.setTimingRpt = function (a, c, d) {
        var e, f, g, h = window.webkitPerformance || window.performance, i = [], j = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"];
        if (h && (e = h.timing)) {
            f = e[j[0]];
            for (var k = 1, l = j.length; l > k; k++)g = e[j[k]], g = g ? g - f : 0, g > 0 && i.push(k + "=" + g);
            b("http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=" + a + "&flag2=" + c + "&flag3=" + d + "&" + i.join("&"))
        }
    }, FOOTDETECT.checkWebpAsync = function (a) {
        if (void 0 === FOOTDETECT.webp) {
            var b = new Image, c = setTimeout(function () {
                FOOTDETECT.webp = !1, a && a(FOOTDETECT.webp, !0), b.onload = b.onerror = null, b = null
            }, 500);
            b.onload = b.onerror = function () {
                clearTimeout(c), FOOTDETECT.webp = 2 === b.width && 2 === b.height, a && a(FOOTDETECT.webp, !1)
            }, b.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
        } else a && a(FOOTDETECT.webp)
    }, FOOTDETECT.countRd = function (a, c) {
        function d(a, b) {
            var b = b || "http://www.paipai.com/rd.html", c = a.split(".");
            return"http://service.paipai.com/cgi-bin/go?pageId=" + c[0] + "&domainId=" + c[1] + "&linkId=" + c[2] + "&url=" + escape(b) + "&t=" + Math.random()
        }

        var e = a.split("."), f = c || 100, g = "http://service.paipai.com/cgi-bin/ping?u=http://jsrd.paipai.com&fu=http://jsrd.paipai.com%3FPTAG%3D" + a + "&resolution=1024*768";
        g += "&fpageId=" + e[0] + "&fdomainId=" + e[1] + "&flinkId=" + e[2], /paipai.com|buy.qq.com|wanggou.com/.test(document.domain) ? Math.random() <= f / 100 && b(g) : b(d(a))
    }, FOOTDETECT.getClientInfo = function () {
        try {
            var a = navigator.userAgent, b = {}, c = {}, d = {}, e = {}, f = a.match(/Web[kK]it[\/]{0,1}([\d.]+)/), g = a.match(/(Android);?[\s\/]+([\d.]+)?/), h = !!a.match(/\(Macintosh\; Intel /), i = a.match(/(iPad).*OS\s([\d_]+)/), j = a.match(/(iPod)(.*OS\s([\d_]+))?/), k = !i && a.match(/(iPhone\sOS)\s([\d_]+)/), l = a.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), m = a.match(/Windows Phone ([\d.]+)/), n = l && a.match(/TouchPad/), o = a.match(/Kindle\/([\d.]+)/), p = a.match(/Silk\/([\d._]+)/), q = a.match(/(BlackBerry).*Version\/([\d.]+)/), r = a.match(/(BB10).*Version\/([\d.]+)/), s = a.match(/(RIM\sTablet\sOS)\s([\d.]+)/), t = a.match(/PlayBook/), u = a.match(/Chrome\/([\d.]+)/) || a.match(/CriOS\/([\d.]+)/), v = a.match(/Firefox\/([\d.]+)/), w = a.match(/MSIE\s([\d.]+)/) || a.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/), x = !u && a.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/), y = x || a.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
            (d.webkit = !!f) && (d.version = f[1]), g && (b.android = !0, b.version = g[2]), k && !j && (b.ios = e.iphone = !0, b.version = k[2].replace(/_/g, ".")), i && (b.ios = e.ipad = !0, b.version = i[2].replace(/_/g, ".")), j && (b.ios = e.ipod = !0, b.version = j[3] ? j[3].replace(/_/g, ".") : null), m && (b.wp = !0, b.version = m[1]), l && (b.webos = !0, b.version = l[2]), n && (e.touchpad = !0), q && (b.blackberry = !0, b.version = q[2]), r && (b.bb10 = !0, b.version = r[2]), s && (b.rimtabletos = !0, b.version = s[2]), t && (c.playbook = !0), o && (b.kindle = !0, b.version = o[1]), p && (c.silk = !0, c.version = p[1]), !p && b.android && a.match(/Kindle Fire/) && (c.silk = !0), u && (c.chrome = !0, c.version = u[1]), v && (c.firefox = !0, c.version = v[1]), w && (c.ie = !0, c.version = w[1]), y && (h || b.ios) && (c.safari = !0, h && (c.version = y[1]));
            var z = "Unknown", A = "", B = "", C = "", D = /(^\s+)|(\s+$)/g, E = function (a) {
                return a.trim ? a.trim() : a.replace(D, "")
            };
            for (var F in e)z = F;
            for (var F in b)"version" != F && (A = F + " " + (b.version || ""));
            for (var F in c)"version" != F && (B = F + " " + (c.version || ""));
            for (var F in d)"version" != F && (C = F + " " + (d.version || ""));
            return B += " " + C, this.phone = E(z), this.os = E(A), this.browser = E(B).split("  ").join(" "), {os: this.os, browser: this.browser, engine: this.engine, phone: this.device}
        } catch (C) {
        }
    };
    var c = window.objMsgPv || window.objMsg || {};
    try {
        c.p = "paipai.com", c.weixin = 1, c.retina = window.devicePixelRatio >= 2 ? 1 : 0, "qq" === FOOTDETECT.scene ? c.client = 2001 : "weixin" === FOOTDETECT.scene ? c.client = 1001 : (c.client = 4001, FOOTDETECT.network = "Unknown"), FOOTDETECT.getClientInfo.call(c), FOOTDETECT.checkWebpAsync(function () {
            c.webp = arguments[0] ? 1 : 0, FOOTDETECT.rptPvObj = c
        })
    } catch (d) {
    }
    c.network = FOOTDETECT.network || "";
    for (var e in c)c[e] = encodeURIComponent(c[e]);
    if (window.ECC_cloud_report_pv = !0, window.reportPVReady ? window.reportPVReady(c, ECC.cloud.report.pv) : window.MANUAL_PV || ECC.cloud.report.pv(c), FOOTDETECT.objMsgPv = c, FOOTDETECT.setSpeedRpt(), window.performanceTimePoint) {
        var f = window.performanceTimePoint;
        FOOTDETECT.load ? FOOTDETECT.setTimingRpt(f[0], f[1], f[2], f[3]) : window.addEventListener("load", function () {
            FOOTDETECT.setTimingRpt(f[0], f[1], f[2], f[3])
        })
    }
}();
window['PP.mobile.ping.time'] && window['PP.mobile.ping.time'].push(new Date());
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
function $getCookie(name) {
    var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
    return val ? (val[2] ? unescape(val[2]) : "") : null;
};
function $getToken(skey) {
    var skey = skey ? skey : $getCookie("skey");
    return skey ? $time33(skey) : "";
};
function $getUin() {
    var uin = $getCookie("uin") || $getCookie('uin_cookie') || $getCookie('pt2gguin') || $getCookie('o_cookie') || $getCookie('luin') || $getCookie('buy_uin');
    return uin ? parseInt(uin.replace("o", ""), 10) : "";
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
};
$namespace('PP.mobile.ping');
PP.mobile.ping = {req_url: window.document.URL, req_refer: window.document.referrer ? window.document.referrer : '', req_host: window.location.hostname.toLowerCase(), sc: '', old_pageid: 0, old_domainid: 0, old_linkid: 0, new_pageid: 0, new_domainid: 0, new_linkid: 0, se_pageid: 0, se_domainid: 0, se_linkid: 0, handle_old_rd: function () {
    try {
        var oldrd_reg = /[AR]DTAG=(\d+)\.(\d+)\.(\d+)\D?/gim;
        var arr = oldrd_reg.exec(this.req_url);
        if (arr == null || arr.length != 4) {
            return;
        }
        this.old_pageid = parseInt(arr[1]);
        this.old_domainid = parseInt(arr[2]);
        this.old_linkid = parseInt(arr[3]);
        if (this.old_pageid <= 0 || this.old_domainid <= 0 || this.old_linkid <= 0) {
            return;
        }
        switch (this.old_pageid) {
            case 201:
                this.old_pageid = 601;
                break;
            case 202:
                this.old_pageid = 602;
                break;
            case 701:
                this.old_pageid = 380;
                break;
            default:
                break;
        }
    }
    catch (e) {
    }
}, handle_new_rd: function () {
    try {
        var newrd_reg = /PTAG[=,](\d+)\.(\d+)\.(\d+)\D?/gim;
        var arr = newrd_reg.exec(this.req_url);
        if (arr == null || arr.length != 4) {
            return;
        }
        this.new_pageid = parseInt(arr[1]);
        this.new_domainid = parseInt(arr[2]);
        this.new_linkid = parseInt(arr[3]);
        if (this.new_pageid <= 0 || this.new_domainid <= 0 || this.new_linkid <= 0) {
            return;
        }
        switch (this.new_pageid) {
            case 201:
                this.new_pageid = 30018;
                break;
            case 202:
                this.new_pageid = 30019;
                break;
            case 603:
                this.new_pageid = 30020;
                break;
            case 701:
                this.new_pageid = 30025;
                break;
            default:
                break;
        }
    }
    catch (e) {
    }
}, handle_se_refer: function () {
    try {
        if (this.req_refer == null || this.req_refer == '') {
            return;
        }
        var reg = /\.?(\w+)\.(com|cn)/gim;
        var arr = reg.exec(this.req_refer);
        if (arr == null || arr.length < 2) {
            return;
        }
        var se_domain = arr[1].toLowerCase();
        var se_map = {baidu: 1, google: 2, soso: 3, 3721: 4, sogou: 5, msn: 6, yisou: 7, yahoo: 8, live: 9, yodao: 10, iask: 11, zhongsou: 12, qikoo: 13, aol: 14, naver: 15, yandex: 16, ask: 17, vnet: 18};
        if (se_map[se_domain] != null && !(this.new_pageid >= 40001 && this.new_pageid <= 50000)) {
            this.se_pageid = 40007;
            this.se_domainid = 1;
            this.se_linkid = se_map[se_domain];
        }
    }
    catch (e) {
    }
}, set_pprd_p_cookie: function (prefix, val) {
    try {
        var rd = prefix + '.' + val, expires = new Date((new Date()).getTime() + 259200000), cookieName = 'PPRD_P', cookieDomain, domainReg = /^(\w+\.|)(wanggou\.com|buy\.qq\.com|paipai\.com)$/i, pprd_p = $getCookie(cookieName);
        if (!domainReg.test(this.req_host)) {
            return;
        }
        if (pprd_p == null) {
            pprd_p = '';
        }
        var regs = {QZZTC: /QZZTC\.([^\.\-]+)/gim, QZGDT: /QZGDT\.([^\.\-]+)/gim, CTZTC: /CTZTC\.([^\.\-]+)/gim, MART: /MART\.([^\.\-]+)/gim, CPS: /CPS\.([^\.\-]+)/gim, FOCUS: /FOCUS\.([^\.\-]+)/gim, CPC: /CPC\.([^\.\-]+)/gim, QT: /QT\.([^\.\-]+)/gim, JDPOP: /JDPOP\.([^\.\-]+)/gim};
        var reg = regs[prefix];
        if (!reg.test(pprd_p)) {
            pprd_p += (pprd_p.length == 0 ? rd : '-' + rd);
        }
        else {
            pprd_p = pprd_p.replace(reg, rd);
        }
        this.sc = escape(cookieName) + ';' + escape(pprd_p) + ';' + (expires ? parseInt(expires.getTime() / 1000) : '') + ';';
        cookieDomain = domainReg.exec(this.req_host)[2];
        $setCookie(cookieName, pprd_p, 4320, '/', cookieDomain, 0);
    }
    catch (e) {
    }
}, handle_pprd_p_cookie: function (prefix, newrd_reg) {
    try {
        var arr = newrd_reg.exec(this.req_url);
        if (arr != null && arr.length >= 2) {
            if (prefix === 'JDPOP') {
                this.set_pprd_p_cookie(prefix, arr[1].replace(/-/g, ''));
            }
            else {
                this.set_pprd_p_cookie(prefix, arr[1]);
            }
        }
    }
    catch (e) {
    }
}, handle_qzone_ztc: function () {
    var newrd_reg = /[\?&#]qz_express=([^\.\-&#]+)/gim;
    this.handle_pprd_p_cookie('QZZTC', newrd_reg);
}, handle_qzone_gdt: function () {
    var newrd_reg = /[\?&#]qz_gdt=([^\.\-&#]+)/gim;
    this.handle_pprd_p_cookie('QZGDT', newrd_reg);
}, handle_paipai_ct: function () {
    var newrd_reg = /[\?&#]pps=exp\.([^\.\-&#]+)/gim;
    this.handle_pprd_p_cookie('CTZTC', newrd_reg);
}, handle_paipai_mart: function () {
    var newrd_reg = /[\?&#]pps=mart\.([^\.\-&#]+)/gim;
    this.handle_pprd_p_cookie('MART', newrd_reg);
}, handle_paipai_cpc: function () {
    var newrd_reg = /[\?&#]pps=cpc\.([^\.\-&#]+)/gim;
    this.handle_pprd_p_cookie('CPC', newrd_reg);
}, handle_paipai_cps: function () {
    var newrd_reg = /[\?&#]pps=cps\.([^\.\-&#]+)/gi;
    this.handle_pprd_p_cookie('CPS', newrd_reg);
}, handle_paipai_focus: function () {
    var newrd_reg = /[\?&#]pps=focus\.([^\.\-&#]+)/gi;
    this.handle_pprd_p_cookie('FOCUS', newrd_reg);
}, handle_qqtuan_flag: function () {
    var newrd_reg = /[\?&#]tuantg=([^\.\-&#]+)/gim;
    this.handle_pprd_p_cookie('QT', newrd_reg);
}, handle_jdpop_flag: function () {
    var newrd_reg = /[\?&#]jd_pop=([^\.&#]+)/gim;
    this.handle_pprd_p_cookie('JDPOP', newrd_reg);
}, handle_ping_report: function () {
    try {
        var euin = $getUin();
        var url_data = 'r=' + (encodeURIComponent(this.req_refer).substring(0, 512)) + '&u=http://' + this.req_host + '&fu=' + encodeURIComponent(this.req_url) + '&resolution=' + window.screen.width + '*' + window.screen.height + '&color=' + window.screen.colorDepth + '&cookiesup=' + ((typeof(navigator.cookieEnabled) != 'undefined' && navigator.cookieEnabled) ? '1' : '0') + '&pageId=' + this.old_pageid + '&domainId=' + this.old_domainid + '&linkId=' + this.old_linkid + '&fpageId=' + this.new_pageid + '&fdomainId=' + this.new_domainid + '&flinkId=' + this.new_linkid + '&sepageid=' + this.se_pageid + '&sedomainid=' + this.se_domainid + '&selinkid=' + this.se_linkid + '&euin=' + (euin != null ? euin : '') + '&sc=' + this.sc.replace(/(cps|etgs)\.[^-]+(-)?/ig, '');
        if (typeof(pageMess) == 'object') {
            url_data += '&aa=' + pageMess.commodityClassId + ',' + pageMess.userCredit + ',' + pageMess.userAuth + ',' + pageMess.userProprety + ',' + pageMess.userProprety1 + ',' + pageMess.userProprety2 + ',' + parseInt(parseFloat(pageMess.commodityPrice) * 100 + '') + ',' + pageMess.commodityState;
        }
        if (typeof(shopData) == 'object') {
            url_data += '&aa=' + shopData.userCredit + ',' + shopData.userAuth + ',' + shopData.userProprety1 + ',' + shopData.userProprety2 + ',' + shopData.userProprety3 + ',' + (typeof(shopData.shopType) == 'string' ? shopData.shopType : '');
        }
        var url = 'http://service.paipai.com/cgi-bin/ping?rand=' + Math.round(Math.random() * 100000) + '&' + url_data;
        $loadScript(url);
        window.getPingDataCallBack = window.getPingDataCallBack || function (pingData) {
            window.console && window.console.log(url);
        }
    }
    catch (e) {
    }
}, main: function () {
    this.handle_old_rd();
    this.handle_new_rd();
    this.handle_se_refer();
    this.handle_qzone_ztc();
    this.handle_qzone_gdt();
    this.handle_paipai_ct();
    this.handle_paipai_mart();
    this.handle_paipai_cpc();
    this.handle_paipai_cps();
    this.handle_paipai_focus();
    this.handle_qqtuan_flag();
    this.handle_jdpop_flag();
    this.handle_ping_report();
}}
PP.mobile.ping.main();
window['PP.mobile.ping'] = '21922:20140613:20140616100618';
window['PP.mobile.ping.time'] && window['PP.mobile.ping.time'].push(new Date());
!function () {
    function a() {
        WeixinJSBridge.invoke("getInstallState", {packageName: "com.jingdong.app.mall", packageUrl: "openApp.jdMobile://"}, function (a) {
            var b = a.err_msg;
            if (b.indexOf("get_install_state:no") > -1) {
                var c = document.getElementById("jdBtmLogo");
                c.addEventListener("click", function () {
                    window.setTimeout(function () {
                        location.href = "http://app.jd.com/wx/index.html"
                    }, 0)
                })
            }
        })
    }

    var b = '<div class="jd_logo" id="jdBtmLogo"></div>', c = document.createElement("DIV");
    c.className = "wx_footer", c.innerHTML = b, document.body.appendChild(c);
    var d = /MicroMessenger/i.test(navigator.userAgent);
    d && (window.WeixinJSBridge && WeixinJSBridge.invoke ? a() : document.addEventListener("WeixinJSBridgeReady", a, !1))
}();
!function () {
    function a() {
        c.check(function (a, b) {
            var c = document.createElement("div"), d = Math.floor(a / 60);
            c.innerHTML = '<a ptag="37075.2.2" href="' + b.url + '" ><strong>' + (d > 0 ? d + "分钟前" : "刚刚") + "您在浏览：</strong>" + b.title.replace("搜索到", "") + "</a>", c.className = "wx_history", document.body.appendChild(c);
            try {
                ECC.cloud.report.trace({ptag: "37075.2.1"})
            } catch (e) {
            }
            setTimeout(function () {
                c.style.display = "none"
            }, 5e3)
        })
    }

    var b = navigator.userAgent, c = {sDomain: "mm.wanggou.com", sCacheKey: "jdHistory", sProxyUrl: "http://mm.wanggou.com/plugin/cache_proxy.shtml", oItemStruct: {type: "1", key: "", url: "", title: "", desc: "", img: "", time: ""}, isAnroid: b.match(/(Android);?[\s\/]+([\d.]+)?/), oCallbacks: {}, bIsInitMsg: !1, postMessage: function (a, b, c) {
        var d, e = this, f = "cacheProxyIfr", g = {};
        g.cacheData = b, g.cacheKey = this.sCacheKey, g.msgType = a, !this.oCallbacks[a] && (this.oCallbacks[a] = []), c && this.oCallbacks[a].push(c), 2 == this.bIsInitMsg ? (d = document.getElementById(f), d.contentWindow.postMessage(JSON.stringify(g), "http://" + e.sDomain)) : this.bIsInitMsg || (this.bIsInitMsg = 1, d = document.createElement("IFRAME"), d.id = "cacheProxyIfr", d.src = this.sProxyUrl, d.style.cssText = "height:0px;width:0px;visibility:hidden", document.body.appendChild(d), d.onload = function () {
            e.bIsInitMsg = 2, d.contentWindow.postMessage(JSON.stringify(g), "http://" + e.sDomain)
        }, window.addEventListener("message", function (a) {
            if (a.origin == "http://" + e.sDomain)try {
                var b = JSON.parse(a.data), c = b.msgType, d = e.oCallbacks[c];
                if (e.isAnroid && "get" === c && !b.cacheData && (b.cacheData = JSON.parse(e.getCookie(e.sCacheKey))), d) {
                    e.oCallbacks[c] = [];
                    for (var f = 0; f < d.length; f++)d[f].call(e, b.cacheData || {update: 1})
                }
            } catch (g) {
            }
        }))
    }, get: function (a, b) {
        var c = this;
        if (location.host !== this.sDomain)this.postMessage("get", null, b); else if (window.localStorage)try {
            var d = JSON.parse(localStorage.getItem(a) || (c.isAnroid ? c.getCookie(a) : "null"));
            d || (d = {update: 1}), b && b.call(c, d)
        } catch (e) {
            localStorage.removeItem(a)
        }
        return this
    }, set: function (a) {
        var b = (new Date).getTime(), d = this;
        return this.get(this.sCacheKey, function (e) {
            var f = e.arrHisData;
            f || (f = []), a.time = b;
            for (var g in c.oItemStruct)a[g] || (a[g] = c.oItemStruct[g]);
            for (var h = 0; h < f.length; h++) {
                var i = f[h];
                if (a.key === i.key)return a.url || (a.url = a.key), f[h] = a, e.arrHisData = f, c.writeHistory(e, 1), d
            }
            a.url || (a.url = a.key), f.unshift(a), e.arrHisData = f, c.writeHistory(e, 1)
        }), this
    }, writeHistory: function (a, b, d) {
        var e = {};
        try {
            if (!a.arrHisData && (a.arrHisData = []), a.arrHisData.sort(function (a, b) {
                return a.time > b.time ? -1 : a.time < b.time ? 1 : 0
            }), a.arrHisData = a.arrHisData.slice(0, 20), a.update = b || 0, this.isAnroid) {
                for (var f in a)e[f] = a[f];
                e.arrHisData = e.arrHisData.slice(0, 2), this.setCookie(this.sCacheKey, "", -1, "", "wanggou.com")
            }
            location.host !== this.sDomain ? this.postMessage("set", a, d) : window.localStorage && (localStorage.setItem(c.sCacheKey, JSON.stringify(a)), d && d.call(this))
        } catch (g) {
        }
        return this
    }, check: function (a) {
        this.setCookie(this.sCacheKey, "", -1, "", "wanggou.com");
        var b = (new Date).getTime(), d = 600, e = this;
        this.get(this.sCacheKey, function (f) {
            try {
                var g = f.arrHisData;
                if (location.href.indexOf("ptype=") > -1 && 1 === history.length && g && g.length > 0 && 0 != f.update && 1 != window.hideHis) {
                    var h = g[0], i = h.time, j = (b - i) / 1e3;
                    d > j && a && a.call(e, j, h)
                }
            } catch (k) {
            }
            return 0 != f.update ? c.writeHistory(f, 0, function () {
                c.ready()
            }) : c.ready(), this
        })
    }, ready: function () {
        window.wgStorage = c, window.wgStorageReady && window.wgStorageReady(c)
    }, getCookie: function (a) {
        var b = new RegExp("(^| )" + a + "(?:=([^;]*))?(;|$)"), c = document.cookie.match(b);
        return c ? c[2] ? unescape(c[2]) : "" : null
    }, setCookie: function (a, b, c, d, e, f) {
        var g = new Date, c = arguments[2] || null, d = arguments[3] || "/", e = arguments[4] || null, f = arguments[5] || !1;
        c ? g.setMinutes(g.getMinutes() + parseInt(c)) : "", document.cookie = a + "=" + escape(b) + (c ? ";expires=" + g.toGMTString() : "") + (d ? ";path=" + d : "") + (e ? ";domain=" + e : "") + (f ? ";secure" : "")
    }};
    a()
}();
(function () {
    var s, pdebug = getQuery("pdebug") || getHash("pdebug");
    if (!pdebug) {
        return
    }
    s = document.createElement("script");
    s.src = "http://weinre.qq.com/target/target-script-min.js#" + pdebug;
    document.getElementsByTagName("body")[0].appendChild(s);
    function getQuery(name, url) {
        var u = arguments[1] || window.location.search, reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"), r = u.substr(u.indexOf("?") + 1).match(reg);
        return r != null ? r[2] : ""
    }

    function getHash(name, url) {
        var u = arguments[1] || location.hash;
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = u.substr(u.indexOf("#") + 1).match(reg);
        if (r != null) {
            return r[2]
        }
        return""
    }
})();
!function () {
    function a(a) {
        var b = new RegExp("(^| )" + a + "(?:=([^;]*))?(;|$)"), c = document.cookie.match(b);
        return c ? c[2] ? unescape(c[2]).replace(/(^")|("$)/g, "") : "" : null
    }

    function b(a, b, c, d, e, f) {
        var g = new Date, c = arguments[2] || null, d = arguments[3] || "/", e = arguments[4] || null, f = arguments[5] || !1;
        c ? g.setMinutes(g.getMinutes() + parseInt(c)) : "", document.cookie = a + "=" + escape(b) + (c ? ";expires=" + g.toGMTString() : "") + (d ? ";path=" + d : "") + (e ? ";domain=" + e : "") + (f ? ";secure" : "")
    }

    function c(a) {
        var b = arguments[1] || window.location.search, c = new RegExp("(^|&)" + a + "=([^&]*)(&|$)"), d = b.substr(b.indexOf("?") + 1).match(c);
        return null != d ? d[2] : ""
    }

    function d() {
        WeixinJSBridge.invoke("getInstallState", {packageName: "com.jingdong.app.mall", packageUrl: "openApp.jdMobile://"}, function (a) {
            var b = a.err_msg;
            b.indexOf("get_install_state:no") > -1 && e()
        })
    }

    function e() {
        var a = "";
        switch (i) {
            case 1:
                a = '<div class="wx_download" style="display:none;" id="jdappDownloadBlock"><p class="wx_download_text" id="jdappDownloadTips">获取精准物流信息，请下载京东APP。</p><span class="wx_download_close" style="display:none;" id="jdAppDownloadClose">关闭</span><a href="javascript:" class="wx_download_button" id="jdAppDownloadLink"><span>立即下载</span></a></div>';
                break;
            case 2:
                a = '<div class="wx_download_1" style="display:none;" id="jdappDownloadBlock"><p class="wx_download_text" id="jdappDownloadTips">下载京东客户端，<span>首单再返<em>5</em>元券！</span></p><span class="wx_download_close" style="display:none;" id="jdAppDownloadClose">关闭</span><a href="javascript:" class="wx_download_button" id="jdAppDownloadLink"><span>立即下载</span></a></div>';
                break;
            case 3:
                a = '<div class="wx_download_2 fixed" style="display:none;" id="jdappDownloadBlock"><p class="wx_download_text" id="jdappDownloadTips">下载京东客户端，<span>首单再返<em>5</em>元券！</span></p><span class="wx_download_close" style="display:none;" id="jdAppDownloadClose">关闭</span><a href="javascript:" class="wx_download_button" id="jdAppDownloadLink"><span>立即<br>下载</span></a></div>';
                break;
            case 4:
            case 5:
                a = '<div class="jd_dlBar" style="display:none;" id="jdappDownloadBlock"><a href="javascript:" class="jd_dlBar_text" id="jdappDownloadTips">京东APP，查看更精确物流信息！</a><span class="jd_dlBar_btn">立即下载</span><span class="jd_dlBar_close" style="display:none;" id="jdAppDownloadClose">关闭</span></div>';
                break;
            case 6:
                a = '<div class="jd_dlBar jd_dlBar_1" style="display:none;" id="jdappDownloadBlock"><a href="javascript:" class="jd_dlBar_text" id="jdappDownloadTips">京东APP送惊喜！<strong>首次下单送<em>5</em>元券</strong></a><span class="jd_dlBar_btn">去逛逛</span><span class="jd_dlBar_close" style="display:none;" id="jdAppDownloadClose">关闭</span></div>';
                break;
            case 7:
                a = '<div class="jd_dlBar jd_dlBar_2" style="display:none;" id="jdappDownloadBlock"><a href="javascript:" class="jd_dlBar_text" id="jdappDownloadTips">客户端下首单，免费得<em>5</em>元券</a><span class="jd_dlBar_btn">去看看</span><span class="jd_dlBar_close" style="display:none;" id="jdAppDownloadClose">关闭</span></div>';
                break;
            case 8:
                a = '<div class="jd_dlBar jd_dlBar_3" style="display:none;" id="jdappDownloadBlock"><a href="javascript:" class="jd_dlBar_text" id="jdappDownloadTips">客户端下首单，免费得<em>5</em>元券</a><span class="jd_dlBar_btn">下载</span><span class="jd_dlBar_close" style="display:none;" id="jdAppDownloadClose">关闭</span></div>'
        }
        if (a) {
            var b = document.createElement("div");
            if (b.id = "jdappdlOutter", b.innerHTML = a, window._jdApp.initHide === !0 && (b.style.display = "none"), window._jdApp.appdlCon) {
                var c = document.getElementById(window._jdApp.appdlCon);
                c && c.appendChild(b)
            } else document.body.appendChild(b);
            f()
        }
    }

    function f() {
        var c = a("jd_app_dlclose"), d = navigator.userAgent.indexOf("Android") > -1;
        if (!c) {
            var e = document.getElementById("jdAppDownloadLink"), f = document.getElementById("jdappDownloadBlock");
            if (i >= 4 && (e = document.getElementById("jdappDownloadTips")), 5 == i && (f.style.margin = "0 10px"), e && (e.addEventListener("click", function () {
                e.href = d ? window._jdApp.androidUrl || "http://storage.jd.com/jdmobile/jd-wxmall.apk?Expires=1712893108&AccessKey=77a2f170807670c5afd3cccf63deaee9ca2f4714&Signature=uzr0r3qQbLPWGiVMn%2FFi1XR%2F5HA%3D" : window._jdApp.iosUrl || "https://itunes.apple.com/cn/app/jing-dong/id414245413?mt=8"
            }), d ? window._jdApp.androidRd && e.setAttribute("ptag", window._jdApp.androidRd) : window._jdApp.iosRd && e.setAttribute("ptag", window._jdApp.iosRd)), f && (f.style.display = ""), window._jdApp.tips) {
                var g = document.getElementById("jdappDownloadTips");
                g.innerHTML = window._jdApp.tips
            }
            if (window._jdApp.fixed === !0 ? 3 > i && (f.className = f.className + " fixed") : window._jdApp.fixed === !1 && 3 == i && (f.className = f.className.replace("fixed", "")), window._jdApp.closeHide) {
                var h = document.getElementById("jdAppDownloadClose");
                h && h.parentNode.removeChild(h)
            } else {
                var h = document.getElementById("jdAppDownloadClose"), j = 10080;
                h && (h.addEventListener("click", function () {
                    f = document.getElementById("jdappDownloadBlock"), f && (f.style.display = "none"), b("jd_app_dlclose", "1", j, "/", "wanggou.com")
                }), h.style.display = "")
            }
        }
    }

    function g() {
        "1" === j || window._jdApp.ignoreWx === !0 ? e() : h && (window.WeixinJSBridge && WeixinJSBridge.invoke ? d() : document.addEventListener("WeixinJSBridgeReady", d, !1))
    }

    var h = /MicroMessenger/i.test(navigator.userAgent), i = window._jdApp.index || 3, j = c("appdlDebug");
    g()
}();
﻿
(function () {
    var d = false;

    function b(h, j, i) {
        h = h || location.href;
        var g = new RegExp("([\\?&]" + j + "=)[^&#]*", "i");
        if (!h.match(g)) {
            return(h.indexOf("?") == -1) ? (h + "?" + j + "=" + i) : (h + "&" + j + "=" + i)
        }
        return h.replace(g, "$1" + i)
    }

    function c(k, h) {
        for (var j in k) {
            var g = j;
            var l = new RegExp("{#" + g + "#}", "gi");
            h = h.replace(l, k[j])
        }
        return h
    }

    function a(g) {
        return function () {
            var i = Array.prototype.join.call(arguments, "_"), h = localStorage.getItem(i);
            if (false && h && h != "undefined") {
                return h
            } else {
                h = g.apply(this, null);
                return h
            }
        }
    }

    function f() {
        var h = " on", g = '<a href="{#home#}" class="nav_index{#selectedHome#}">购物</a><a href="{#search#}" class="nav_search{#selectedSearch#}">搜索</a><a href="{#cart#}" class="nav_shopcart{#selectedCart#}">购物车</a><a href="{#user#}" class="nav_me{#selectedUser#}">个人中心</a>';
        _navfoot = {index: _navfoot.index, hide: _navfoot.hide, Rd: _navfoot.Rd, search: _navfoot.index == 4 ? "#" : "http://mm.wanggou.com/category_m.shtml?PTAG=" + _navfoot.Rd.search + "&shownav=1", user: _navfoot.index == 6 ? "#" : "http://mm.wanggou.com/my/index.shtml?PTAG=" + _navfoot.Rd.user + "&shownav=1", cart: _navfoot.index == 7 ? "#" : "http://mm.wanggou.com/my/jdshopcart.shtml?PTAG=" + _navfoot.Rd.cart + "&shownav=1", selectedHome: _navfoot.index == 0 ? h : "", selectedSearch: _navfoot.index == 4 ? h : "", selectedUser: _navfoot.index == 6 ? h : "", selectedCart: _navfoot.index == 7 ? h : ""};
        if (d && location.href.indexOf("index_search.shtml") === -1) {
            _navfoot.selectedHome = ""
        }
        return c(_navfoot, g)
    }

    function e() {
        var i, h = document.createElement("div"), k = "#", j = "wg.navfoot_homepage", g = getCookie(j);
        h.className = "wx_nav";
        _navfoot.Rd = {home: _navfoot.Rd.home || "37080.1.1", search: _navfoot.Rd.search || "37080.1.2", user: _navfoot.Rd.user || "37080.1.4", cart: _navfoot.Rd.cart || "37080.1.5", };
        i = a(f)("wg.navfoot", _navfoot.index, "2014070714");
        if (_navfoot.index != 0 && g) {
            k = b(g, "PTAG", _navfoot.Rd.home)
        }
        if (d) {
            k = "http://mm.wanggou.com/search/index_search.shtml?PTAG=17007.3.13"
        }
        i = i.replace("{#home#}", k);
        h.innerHTML = i;
        document.body.appendChild(h);
        if (document.querySelector(".WX_backtop")) {
            document.querySelector(".WX_backtop").style.bottom = "60px"
        }
        if (_navfoot.index == 0) {
            setCookie(j, location.href, 30, "/", "wanggou.com")
        }
    }

    if (_navfoot) {
        _navfoot.index = _navfoot.index || 0;
        _navfoot.Rd = _navfoot.Rd || {};
        _navfoot.hide = _navfoot.hide || 0;
        if (getQuery("PTAG").indexOf("17007.3") !== -1) {
            d = true;
            _navfoot.Rd = {home: "17007.3.13", search: "17007.3.14", user: "17007.3.16", cart: "17007.3.17"}
        }
        if ((_navfoot.index == 0) || (_navfoot.index == 4) || getQuery("shownav")) {
            e()
        }
    }
})();