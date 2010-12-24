sarge(window).event("load", function () {
    var fileReaderSupported = ("FileReader" in window);

    function showLoading(blob) {
        booktorious.create(booktorious.loading).initialize(blob);
    };

    function handleFiles(files) {
        var file = files[0];
        if (file) {
            var reader = new FileReader();
            reader.onloadend = function () {
                showLoading(reader.result);
            };            
            reader.onerror = function (event) {
                alert("An error occurred while reading the file. Error code: " + event.target.error.code);
            };
            reader.readAsBinaryString(file);
        } else {
            alert("No file chosen.");
        }
    };
    
    booktorious.loadTemplate("choose_file", {
        inputFileReadSupported: fileReaderSupported
    });

    if (!fileReaderSupported) { return; }

    var fileInput = sarge("input[type=file]").element();
    sarge("button").event("click", function () {
        if ("files" in fileInput) {
            handleFiles(fileInput.files);
        }
    });

    sarge(window)
        .event("dragover", function () {
            return false;
        })
        .event("drop", function (e) {
            if ("dataTransfer" in e) {
                if ("files" in e.dataTransfer) {
                    handleFiles(e.dataTransfer.files);
                }
            }
            return false;
        });
});