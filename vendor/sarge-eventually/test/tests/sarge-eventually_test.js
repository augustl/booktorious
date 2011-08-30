TestCase("SargeEventuallyTest", {
    setUp: function () {
        /*:DOC element = <div></div> */
        this.e = sarge(this.element);
    },

    "test binding and triggering event": function () {
        var timesCalled = 0;

        this.e.event("click", function () {
            timesCalled++;
        });

        this.e.event("click");
        this.e.event("click");

        assertEquals(2, timesCalled);
    },


    "test returning false to stop propagation and default": function () {
        /*:DOC+=<div id="foo"><div id="bar"></div></div>*/

        var calls = [];
        var foo = sarge(document.getElementById("foo"));
        var bar = sarge(document.getElementById("bar"));

        foo.event("click", function () {
            calls.push("foo");
            return false;
        });

        bar.event("click", function () {
            calls.push("bar");
            return false;
        });
        
        bar.event("click");

        assertEquals(["bar"], calls);
    }
});