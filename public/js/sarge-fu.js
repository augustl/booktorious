/* A custom Firefox/Chrome compatible API implementation for sarge. */
sarge.api.getAttribute = function (element, attribute) {
    return element.getAttribute(attribute);
};

sarge.api.setAttribute = function (element, attribute, value) {
    element.setAttribute(attribute, value);
};

sarge.api.getHtml = function (element) {
    return element.innerHTML;
};

sarge.api.setHtml = function (element, html) {
    if (html instanceof sarge) {
        sarge(element).clear().append(html);
    } else {
        element.innerHTML = html;
    }
};


sarge.api.clear = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

sarge.api.append = function (element, html) {
    if (html instanceof sarge) {
        element.appendChild(html.element());
    } else if (typeof html === "string") {
        element.innerHTML = element.innerHTML + html;
    } else {
        element.appendChild(html);
    }
};


sarge.api.hide = function (element) {
    element.style.display = "none";
};

sarge.api.show = function (element) {
    element.style.display = "inherit";
};


(function () {
    var regexpSpecials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g");
    var regexpEscape = function (string) {
        return string.replace(regexpSpecials, "\\$&");
    };
    var classRegexp = function (cssClass) {
        return new RegExp("\\s?\\b" + regexpEscape(cssClass) + "\\b\\s?");
    };

    sarge.api.addClass = function (element, cssClass) {
        var s = sarge(element);
        if (!s.hasClass(cssClass)) {
            var current = s.attr("class");
            if (current) {
                s.attr("class", current  + " " + cssClass);
            } else {
                s.attr("class", cssClass);
            }
        }
    };

    sarge.api.removeClass = function (element, cssClass) {
        var s = sarge(element);
        var r = classRegexp(cssClass);
        if (s.hasClass(cssClass)) {
            s.attr("class", s.attr("class").replace(r, ""));
        }
    };

    sarge.api.hasClass = function (element, cssClass) {
        var r = classRegexp(cssClass);
        return r.test(sarge(element).attr("class"));
    };
}());