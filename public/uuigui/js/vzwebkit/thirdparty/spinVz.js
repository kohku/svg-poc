var Spinner = (function() {
    /**
     * Fills in default values.
     */
    function merge(obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i];
            for (var n in def)
                if (obj[n] === undefined)
                    obj[n] = def[n];
        }
        return obj;
    }

    /**
     * Returns the absolute page-offset of the given element.
     */
    function pos(el) {
        var o = {x: el.offsetLeft, y: el.offsetTop};
        while ((el = el.offsetParent))
            o.x += el.offsetLeft, o.y += el.offsetTop;

        return o;
    }

    var defaults = {
        zIndex: 2e9, // Use a high z-index by default
        top: 'auto', // center vertically
        left: 'auto', // center horizontally
        position: 'absolute'  // element position
    };

    function Spinner(o) {
        this.opts = merge(o || {}, Spinner.defaults, defaults);
    }

    // Global defaults that override the built-ins:
    Spinner.defaults = {};

    Spinner.prototype.spin = function(container) {
        this.div = $("<img src='" + CONTEXT_PATH + "/css/vzwebkit/images/loader_red_64x64.gif'>");
        this.div.css({
            position: this.opts.position,
            zIndex: this.opts.zIndex,
            left: 0,
            top:0
        });
        $(container).append(this.div);
        var tp = pos(container), ep = pos(this.div.get(0));
        
        this.div.css({
            left: (this.opts.left == 'auto' ? tp.x - ep.x + (container.offsetWidth >> 1) : parseInt(this.opts.left, 10)) + 'px',
            top: (this.opts.top == 'auto' ? tp.y - ep.y + (container.offsetHeight >> 1) : parseInt(this.opts.top, 10)) + 'px'
        });
        
        return this;
    };

    Spinner.prototype.stop = function() {
        if (this.div) {
            this.div.remove();
            this.div = null;
        }
    };

    return Spinner;

})();
