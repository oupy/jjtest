define('mobileSlider', function (require, exports, module) {
    var _cacheThisModule_;
    var $ = require('mobile.zepto');
    var scroll = function (o) {
        this.opt = {tp: 'text', sp: null, min: 0, minp: 0, step: 0, len: 1, index: 1, offset: 0, loadImg: false, image: [], loopScroll: false, lockScrY: false, autoTime: 0, viewDom: null, moveId: '', moveDom: null, moveChild: [], tab: [], tabClass: 'cur', transition: 0.3, fun: function () {
        }};
        var autoScrollTag;
        $.extend(this, this.opt, o);
        this.len = this.moveChild.length;
        this.min = this.min || {'text': 100, 'img': 30}[this.tp];
        this.minp = this.minp || this.min;
        if (!this.viewDom)this.viewDom = $(window);
        if (this.len > 1)this.startEvent();
        if (this.loadImg)this.image = this.moveDom.find('img');
        this.resize(this.step || this.moveChild.eq(0).width());
        this.startAuto();
    };
    $.extend(scroll.prototype, {autoScrollTag: null, startAuto: function () {
        if (this.autoTime) {
            var obj = this;
            this.autoScrollTag = setInterval(function () {
                obj.stepMove(obj.index + 1);
            }, this.autoTime);
        }
    }, stopAuto: function () {
        clearInterval(this.autoScrollTag);
    }, resize: function (step) {
        this.step = step || this.step;
        var harf = (this.viewDom.width() - this.step) / 2;
        this.offset = this.loopScroll ? this.step - harf : harf;
        if (this.len == 1)this.offset = -harf;
        this.stepMove(this.index, true);
    }, addChild: function (dom, tabDom) {
        if (!this.loopScroll)return;
        this.moveChild.eq(0).after(dom);
        this.len += 1;
        this.tab.eq(this.len - 2).after(tabDom);
        this.tab = this.tab.parent().children();
        if (this.len == 2) {
            this.moveChild = this.moveDom.children();
            this.startEvent();
        }
        else {
            this.stepMove(2);
        }
    }, startEvent: function () {
        var obj = this, dom = this.moveDom.get(0);
        dom.addEventListener("touchstart", this, false);
        dom.addEventListener("touchmove", this, false);
        dom.addEventListener("touchend", this, false);
        dom.addEventListener("touchcancel", this, false);
        dom.addEventListener("webkitTransitionEnd", this, false);
        this.tab.each(function (i, em) {
            $(em).attr('no', i + 1);
            $(em).click(function () {
                obj.stepMove($(this).attr('no'));
            });
        });
        if (this.loopScroll) {
            this.moveDom.append(this.moveChild.eq(0).clone());
            var last = this.moveChild.eq(this.len - 1).clone();
            this.moveDom.prepend(last);
        }
    }, handleEvent: function (e) {
        switch (e.type) {
            case"touchstart":
                this.sp = this.getPosition(e);
                this.stopAuto();
                break;
            case"touchmove":
                this.touchmove(e);
                break;
            case"touchend":
            case"touchcancel":
                this.move(e);
                this.startAuto();
                break;
            case"webkitTransitionEnd":
                e.preventDefault();
                break;
        }
    }, getPosition: function (e) {
        var touch = e.changedTouches ? e.changedTouches[0] : e;
        return{x: touch.pageX, y: touch.pageY};
    }, touchmove: function (e) {
        var mp = this.getPosition(e), x = mp.x - this.sp.x, y = mp.y - this.sp.y;
        if (Math.abs(x) - Math.abs(y) > this.min) {
            e.preventDefault();
            var offset = x - this.step * (this.index - 1) - this.offset;
            this.moveDom.css({"-webkit-backface-visibility": "hidden", "-webkit-transform": "translate3D(" + offset + "px,0,0)", "-webkit-transition": "0"});
        } else {
            if (!this.lockScrY)e.preventDefault();
        }
    }, move: function (e) {
        var mp = this.getPosition(e), x = mp.x - this.sp.x, y = mp.y - this.sp.y;
        if (Math.abs(x) < Math.abs(y) || Math.abs(x) < this.minp) {
            this.stepMove(this.index);
            return;
        }
        if (x > 0) {
            e.preventDefault();
            this.stepMove(this.index - 1);
        } else {
            e.preventDefault();
            this.stepMove(this.index + 1);
        }
    }, loadImage: function (no) {
        var img = this.image;
        var setImg = function (i) {
            if (img[i] && $(img[i]).attr('back_src')) {
                img[i].src = $(img[i]).attr('back_src');
                $(img[i]).removeAttr('back_src');
            }
        };
        setImg(no);
        setImg(no - 1);
        setImg(no + 1);
    }, stepMove: function (no, isSetOffsetIndex) {
        this.index = no > this.len ? this.len : no < 1 ? 1 : no;
        this.tab.removeClass(this.tabClass);
        this.tab.eq(this.index - 1).addClass(this.tabClass);
        var tran = -this.step * ((this.loopScroll ? no : this.index) - 1) - this.offset;
        this.moveDom.css({"-webkit-transform": "translate3D(" + tran + "px,0,0)", "-webkit-transition": isSetOffsetIndex ? "0ms" : "all " + this.transition + "s ease"});
        if (this.loadImg)this.loadImage(this.index);
        this.fun(this.index);
        if (this.loopScroll && !isSetOffsetIndex) {
            var obj = this, cindex = no;
            if (no <= 0)cindex = this.len;
            if (no > this.len)cindex = 1;
            if (cindex != no)
                setTimeout(function () {
                    obj.stepMove(cindex, true);
                }, this.transition * 1000);
        }
    }});
    exports.init = function (opt) {
        return new scroll(opt);
    }
});