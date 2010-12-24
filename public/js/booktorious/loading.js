booktorious.loading = {
    initialize: function (blob) {
        var self = this;
        booktorious.loadTemplate("loading");
        this.blob = blob;
        this.messageTarget = sarge("#message");
        this.epub = new JSEpub(this.blob);
        this.epub.processInSteps(function (step, extras) {
            self.step(step, extras);
        });
    },

    step: function (stepId, extras) {
        if (stepId === 1) {
            this.addMessage("Unarchiving");
        } else if (stepId === 2) {
            this.addMessage("Uncompressing " + extras);
        } else if (stepId === 3 || stepId === 4) {
            this.addMessage("Post processing")
        } else if (stepId === 5) {
            booktorious
                .create(booktorious.reader)
                .initialize(this.epub);
        } else if (stepId === -1) {
            this.addMessage("The file does not seem to be an EPUB.");
        } else if (stepId < 0) {
            this.addMessage("An unknown error occured.");
        } else {
            // Wtf.
        }
    },

    addMessage: function (msg) {
        this.messageTarget.html(msg);
    }
};