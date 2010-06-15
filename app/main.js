this.booktorious = new Mediocre.Application({
    __init__: function () {
        new this.views.chooseFile().renderIn("#wrapper");
    },

    // renderViewInDrawer: function (view) {
    //     var self = this;
    //     this.hideDrawer(function () {
    //         view.renderInWithoutCallbacks("#drawer_inner");
    //         self.showDrawer(function () {
    //             view.didRenderFirstTime && view.didRenderFirstTime();
    //         });
    //     });
    // },

    // hideDrawer: function (callback) {
    //     var self = this;

    //     var a = this.drawerAnimation(this.drawerTopOffset, window.innerHeight);
    //     a.didCompleteAnimation = function () {
    //         sarge(self.drawer).hide();
    //         callback && callback();
    //     };
    //     a.perform();
    // },

    // showDrawer: function (callback) {
    //     var a = this.drawerAnimation(window.innerHeight, this.drawerTopOffset);
    //     sarge(this.drawer).show();
    //     a.didCompleteAnimation = function (){
    //         callback && callback();
    //     };
    //     a.perform();
    // },

    // drawerAnimation: function (start, end) {
    //     var self = this;
    //     var a = booktorious.lifelike.animation(function (i) {
    //         self.drawer.style.top = i + "px";
    //     }); 

    //     a.curve = "easeOut";
    //     a.start = start;
    //     a.end = end;
    //     a.duration = 300;
    //     a.fps = 40;

    //     return a;
    // }
});