sarge.api.cssSelect = function (selector, rootNode) {
    var nodes = (rootNode || document).querySelectorAll(selector);
    return Array.prototype.slice.call(nodes);
};