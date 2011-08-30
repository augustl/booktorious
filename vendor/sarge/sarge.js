(function (GLOBAL) {
    /*
     * The core. Does nothing useful by itself. Needs plugins.
     *
     */
    var sarge = function (obj) {
        if (!(this instanceof sarge)) {
            return new sarge(obj);
        }

        var t = typeof(obj);

        if (t === "string") {
            this.elements = this.callApiFunction("cssSelect", obj);
        } else if (obj instanceof sarge) {
            return obj;
        } else if (obj instanceof Array) {
            this.elements = obj;
        } else if (t === "object") {
            this.elements = [obj];
        } else {
            throw new TypeError("Invalid object '" + obj + "' passed to sarge().");
        }
    };

    // API functions lives here.
    sarge.api = {};

    sarge.prototype = {
        event: function (name, listener) {
            if (listener) {
                this.withElements("bindEvent", name, listener);
            } else {
                this.withElements("triggerEvent", name);
            }

            return this;
        },

        html: function (html) {
            if (html === undefined) {
                return this.withElement("getHtml");
            } else {
                this.withElements("setHtml", html);
                return this;
            }
        },

        append: function (html) {
            this.withElements("append", html);
            return this;
        },

        clear: function () {
            this.withElements("clear");
            return this;
        },

        find: function (selector) {
            return sarge(this.callApiFunction("cssSelect", selector, this.element()));
        },

        hide: function () {
            this.withElements("hide");
            return this;
        },

        show: function () {
            this.withElements("show");
            return this;
        },

        addClass: function (className) {
            this.withElements("addClass", className);
            return this;
        },

        removeClass: function (className) {
            this.withElements("removeClass", className);
            return this;
        },

        hasClass: function (className) {
            return this.withElement("hasClass", className);
        },

        attr: function (attribute, value) {
            if (value === undefined) {
                return this.withElement("getAttribute", attribute);
            } else {
                this.withElements("setAttribute", attribute, value);
                return this;
            }
        },

        /*
         * Returns the first element in the list, or throws an error
         * if no elements are in the list.
         */
        element: function () {
            if (this.elements.length === 0) {
                throw "No elements."
            } else {
                return this.elements[0];
            }
        },

        withElement: function () {
            return this.callApiFunctionForElement(this.element(), arguments);
        },

        /*
         * Calls API function once for each element in this.elements.
         *
         * First argument is the name of the API function. The API function
         * will get [theElement, arguments, passed, to, withElements, here]
         * passed to it.
         *
         */
        withElements: function () {
            for (var i = 0, il = this.elements.length; i < il; i++) {
                this.callApiFunctionForElement(this.elements[i], arguments);
            }
        },

        callApiFunctionForElement: function (element, args) {
            var args = Array.prototype.slice.call(args);
            // Add element as 2nd item in array.
            args.splice(1, 0, element);
            return this.callApiFunction.apply(this, args);
        },

        /*
         * Calls an API function. An API function is a function on
         * sarge.Instance.prototype.
         *
         * The first argument is the name of the API function. All successive
         * arguments are passed to that function.
         *
         */
        callApiFunction: function () {
            var args = Array.prototype.slice.call(arguments);
            var apiFunc = args.shift();

            if (typeof(sarge.api[apiFunc]) === "function") {
                return sarge.api[apiFunc].apply(this, args);
            } else {
                throw "Sarge: API for '" + apiFunc + "' has not been loaded.";
            }
        }
    };

    GLOBAL.sarge = sarge;
    sarge.originalDollar = GLOBAL.$;
    GLOBAL.$ = sarge;

    sarge.noConflict = function () {
        GLOBAL.$ = sarge.originalDollar;
    }
    
}(this));