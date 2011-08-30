sarge.api.bindEvent = function(element, event, handler) {
    var wrappedHandler = function (e) {
        if (handler.call(this, e) === false) {
            if (e.stopPropagation && e.preventDefault) {
                e.stopPropagation();
                e.preventDefault();
            } else { // Assuming IE
                e.cancelBubble = true;
                e.returnValue = false;
            }
        }
    }

    if (element.attachEvent) {
        element.attachEvent("on" + event, wrappedHandler);
    } else if (element.addEventListener) {
        element.addEventListener(event, wrappedHandler, false);
    }
};

sarge.api.triggerEvent = function(element, eventName) {
    if (document.createEvent) {
        var event = document.createEvent("HTMLEvents");

        // Type, can bubble, cancelable.
        event.initEvent(eventName, true, true);

        element.dispatchEvent(event);
    } else if (element.fireEvent) {
        element.fireEvent("on" + eventName);
    }
};