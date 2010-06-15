booktorious.view("reader", {
    __init__: function (epub) {
        this.epub = epub;
    },

    didRenderFirstTime: function () {
        var self = this;
        this.bookContent = sarge(this.html).find("#book_content");
        this.spineEntries = [];
        var resizer = function () { self.resize() }
        for (var i = 0, il = this.epub.opf.spine.length; i < il; i++) {
            var spineEntryView = new booktorious.views.spineEntry(this.epub, i);
            spineEntryView.renderIframe(this.bookContent);
            this.spineEntries.push(spineEntryView);
        }
    }
});