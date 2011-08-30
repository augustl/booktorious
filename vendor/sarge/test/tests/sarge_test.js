TestCase("SargeTest", {
    tearDown: function() {
        sarge.api = {}; 
    },

    "test passing string calls cssSelect": function () {
        sarge.api.cssSelect = sinon.spy();

        sarge("foo");
        sarge("bar");

        assertTrue(sarge.api.cssSelect.calledTwice);
        assertTrue(sarge.api.cssSelect.getCall(0).calledWithExactly("foo"))
        assertTrue(sarge.api.cssSelect.getCall(1).calledWithExactly("bar"))
    },

    "test passing string stores in elements": function () {
        sarge.api.cssSelect = function () { return [1, 2] };
        var s = sarge("foo");
        assertEquals([1, 2], s.elements);
    },

    "test passing object stores in elements": function () {
        var obj = {};
        var s = sarge(obj);
        assertEquals([obj], s.elements);
    },

    "test passing array stores it as elements directly": function () {
        var s = sarge([1, 2]);
        assertEquals([1, 2], s.elements);
    },

    "test passing sarge objects returns the sarge object": function () {
        sarge.api.cssSelect = sinon.stub();
        var s = sarge("foo");
        assertSame(s, sarge(s));
    },

    "test withElement": function () {
        sarge.api.hide = sinon.stub();
        var s = sarge(["abc", "123"]);
        s.withElement("hide");

        assertTrue(sarge.api.hide.calledOnce);
        assertTrue(sarge.api.hide.getCall(0).calledWithExactly("abc"));
    },

    "test with elements": function () {
        var s = sarge([]);
        s.elements = ["foo", "bar", "baz"];
        sarge.api.goWild = sinon.spy();
        s.withElements("goWild", 123, "abc");

        assertTrue(sarge.api.goWild.calledThrice);
        assertTrue(sarge.api.goWild.getCall(0).calledWithExactly("foo",123,"abc"));
        assertTrue(sarge.api.goWild.getCall(1).calledWithExactly("bar",123,"abc"));
        assertTrue(sarge.api.goWild.getCall(2).calledWithExactly("baz",123,"abc"));
    },

    "test calling none existing api function": function () {
        expectAsserts(1);

        var s = sarge({});
        try {
            s.callApiFunction("doesNotExist");
        } catch (e) {
            assertTrue(true);
        }
    },

    "test find": function () {
        sarge.api.cssSelect = function () { return [1, 2] };
        var s = sarge({}).find("stubbed");
        assertEquals([1, 2], s.elements);
    },

    "test element with elements": function () {
        var s = sarge(["abc", "123"]);
        assertEquals("abc", s.element());
    },

    "test element without elements": function () {
        expectAsserts(1);
        var s = sarge([]);

        try {
            s.element()
        } catch(e) {
            assertTrue(true);
        }
    },

    "test dollar and noConflict": function () {
        // TODO: Figure out how to test this properly.
    }
});

TestCase("SargeApiProxiesTest", {
    tearDown: function() {
        sarge.api = {};
    },

    "test binding event": function () {
        var obj = {};
        var listener = function () {};
        sarge.api.bindEvent = sinon.stub();

        var s = sarge(obj);
        assertSame(s, s.event("foo", listener));
        assertTrue(sarge.api.bindEvent.calledOnce);
        assertTrue(sarge.api.bindEvent.getCall(0).calledWithExactly(obj, "foo", listener));
    },

    "test triggering event": function () {
        var obj = {};
        sarge.api.triggerEvent = sinon.stub();

        var s = sarge(obj);
        assertSame(s, s.event("foo"));

        assertTrue(sarge.api.triggerEvent.calledOnce);
        assertTrue(sarge.api.triggerEvent.getCall(0).calledWithExactly(obj, "foo"));
    },

    "test getting html": function () {
        var obj = {};
        var args;
        sarge.api.getHtml = sinon.spy(function (el) { return "foo" });

        var s = sarge(obj);
        
        assertEquals("foo", s.html());
        assertTrue(sarge.api.getHtml.calledOnce);
        assertTrue(sarge.api.getHtml.getCall(0).calledWithExactly(obj))
    },

    "test setting html": function () {
        var obj = {};
        sarge.api.setHtml = sinon.spy();;

        var s = sarge(obj);
        assertSame(s, s.html("foo"));
        assertTrue(sarge.api.setHtml.calledOnce);
        assertTrue(sarge.api.setHtml.getCall(0).calledWithExactly(obj, "foo"));
    },

    "test append": function () {
        var obj = {};
        sarge.api.append = sinon.spy();

        var s = sarge(obj);
        assertSame(s, s.append("foo"));
        assertTrue(sarge.api.append.calledOnce);
        assertTrue(sarge.api.append.getCall(0).calledWithExactly(obj, "foo"))
    },

    "test clear": function () {
        var obj = {};
        sarge.api.clear = sinon.spy();

        var s = sarge(obj);
        assertSame(s, s.clear());
        assertTrue(sarge.api.clear.calledOnce);
        assertTrue(sarge.api.clear.getCall(0).calledWithExactly(obj));
    },

    "test find": function () {
        var obj = {};
        var args;
        sarge.api.cssSelect = sinon.spy(function () { return [] });

        var s = sarge(obj);
        var res = s.find("foo");
        assertNotSame(s, res);
        assertTrue(res instanceof sarge);

        assertTrue(sarge.api.cssSelect.calledOnce)
        assertTrue(sarge.api.cssSelect.getCall(0).calledWithExactly("foo", obj))
    },

    "test hide": function () {
        var obj = {};
        sarge.api.hide = sinon.spy();

        var s = sarge(obj);
        assertSame(s, s.hide());
        assertTrue(sarge.api.hide.calledOnce)
        assertTrue(sarge.api.hide.getCall(0).calledWithExactly(obj));
    },

    "test show": function () {
        var obj = {};
        sarge.api.show = sinon.spy();

        var s = sarge(obj);
        assertSame(s, s.show());
        assertTrue(sarge.api.show.calledOnce);
        assertTrue(sarge.api.show.getCall(0).calledWithExactly(obj));
    },

    "test addClass": function () {
        var obj = {};
        sarge.api.addClass = sinon.spy();

        var s = sarge(obj);
        assertSame(s, s.addClass("foo"));
        assertTrue(sarge.api.addClass.calledOnce);
        assertTrue(sarge.api.addClass.getCall(0).calledWithExactly(obj, "foo"));
    },

    "test removeClass": function () {
        var obj = {};
        sarge.api.removeClass = sinon.spy();

        var s = sarge(obj);
        assertSame(s, s.removeClass("foo"));
        assertTrue(sarge.api.removeClass.calledOnce);
        assertTrue(sarge.api.removeClass.getCall(0).calledWithExactly(obj, "foo"));
    },

    "test hasClass": function () {
        var obj = {};
        var args;
        sarge.api.hasClass = sinon.spy(function () { return true });

        var s = sarge(obj);
        assertTrue(s.hasClass("foo"));
        assertTrue(sarge.api.hasClass.calledOnce);
        assertTrue(sarge.api.hasClass.getCall(0).calledWithExactly(obj, "foo"))
    },

    "test getting attr": function () {
        var obj = {};
        var args;
        sarge.api.getAttribute = sinon.spy(function () { return "foo" });

        var s = sarge(obj);
        assertEquals("foo", s.attr("anything"));
        assertTrue(sarge.api.getAttribute.calledOnce);
        assertTrue(sarge.api.getAttribute.getCall(0).calledWithExactly(obj, "anything"))
    },

    "test setting attr": function () {
        var obj = {};
        sarge.api.setAttribute = sinon.spy();
        
        var s = sarge(obj);
        assertSame(s, s.attr("foo", "bar"));
        assertTrue(sarge.api.setAttribute.calledOnce);
        assertTrue(sarge.api.setAttribute.getCall(0).calledWithExactly(obj, "foo", "bar"))
    }
});