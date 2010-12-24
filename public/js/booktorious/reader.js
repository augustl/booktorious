booktorious.reader = {
    initialize: function (epub) {
        booktorious.loadTemplate("reader");
        var bookContent = sarge("#book_content");
        for (var i = 0, il = epub.opf.spine.length; i < il; i++) {
            var spineEntry = booktorious
                .create(booktorious.spineEntry);
            spineEntry.initialize(epub, i);
            spineEntry.renderIframe(bookContent);
        }
    }
};