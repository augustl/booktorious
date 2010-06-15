this.booktorious = new Mediocre.Application({
    __init__: function () {
        new this.views.chooseFile().renderIn("#wrapper");
    }
});