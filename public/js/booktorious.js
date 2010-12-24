this.booktorious = {
    loadTemplate: function (name, data) {
        var element = sarge("#templates script[data-template-name=" + name + "]");
        var template = new Copperplate(element.html());

        if (!this.hasOwnProperty("wrapper")) {
            this.wrapper = sarge("#wrapper");
        }

        this.wrapper.html(template.html(data || {}));
    },

    create: (function () {
        function F(){};
        return function (proto) {
            F.prototype = proto;
            return new F();
        };
    }())
};