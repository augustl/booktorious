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
    var classRegexp = function (class) {
        return new RegExp("\\s?\\b" + regexpEscape(class) + "\\b\\s?");
    };

    sarge.api.addClass = function (element, class) {
        var s = sarge(element);
        if (!s.hasClass(class)) {
            var current = s.attr("class");
            if (current) {
                s.attr("class", current  + " " + class);
            } else {
                s.attr("class", class);
            }
        }
    };

    sarge.api.removeClass = function (element, class) {
        var s = sarge(element);
        var r = classRegexp(class);
        if (s.hasClass(class)) {
            s.attr("class", s.attr("class").replace(r, ""));
        }
    }

    sarge.api.hasClass = function (element, class) {
        var r = classRegexp(class);
        return r.test(sarge(element).attr("class"));
    }
}());