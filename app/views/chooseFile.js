booktorious.view("chooseFile", {
    didRenderFirstTime: function () {
        var self = this;
        var html = sarge(this.html);

        if (this.inputFileReadSupported()) {
            var input = html.find("input").element();
            html.find("button").event("click", function () {
                if ("files" in input) {
                    self.handleFiles(input.files)
                }
            });
        }

        sarge(window)
            .event("dragover", function () {
                return false;
            })
            .event("drop", function (e) {
                if ("dataTransfer" in e) {
                    if ("files" in e.dataTransfer) {
                        self.handleFiles(e.dataTransfer.files);
                    }
                }
                return false;
            });
    },

    handleFiles: function (files) {
        var self = this;
        var file = files[0];
        if (file) {
            var reader = new FileReader();
            sarge(reader).event("loadend", function () {
                self.showLoading(reader.result);
            });
            reader.readAsBinaryString(file);
        }
    },

    showLoading: function (blob) {
        new booktorious.views.loadEpub(blob).renderIn("#wrapper");
    },

    inputFileReadSupported: function () {
        return "FileReader" in window;
    }
});