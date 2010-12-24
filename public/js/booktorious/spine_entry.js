booktorious.spineEntry = {
    initialize: function (epub, i) {
        this.epub = epub;
        this.href = this.epub.opf.manifest[this.epub.opf.spine[i]]["href"];
        this.doc = this.epub.files[this.href];
        this.iframe = document.createElement("iframe");
    },

    renderIframe: function (target) {
        var self = this;

        target.append(this.iframe);

        this.iframe.contentDocument.open();
        var html = new XMLSerializer().serializeToString(this.doc);
        this.iframe.contentDocument.write(html);
        this.contentResizeIframe();
        this.iframe.contentDocument.close();

        sarge(this.iframe.contentDocument).find("img").event("load", function () {
            self.contentResizeIframe();
        });

        var links = sarge(this.iframe.contentDocument).find("a");
        links.event("mouseover", function (e) {});
        links.event("mouseout", function (e) {});
        links.event("click", function (e) {
            // self.didClickAnchor(sarge(this).attr("href"));
            // alert("Internal linking doesn't work yet.");
            return false;
        });
    },

    contentResizeIframe: function () {
        sarge(this.iframe)
            .attr("height", this.iframe.contentDocument.height)
            .attr("height", this.iframe.contentDocument.documentElement.scrollHeight);
    }
};