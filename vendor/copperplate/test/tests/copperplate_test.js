TestCase("CopperplateControlFlowTest", {
    "test basic if": function () {
        var t = '<if someCondition>this</if>';

        assertEquals("this", new Copperplate(t).html({someCondition: true}));
        assertEquals("", new Copperplate(t).html({someCondition: false}));
    },

    "test basic if with falsey value": function () {
        var t = '<if someCondition>this</if>';

        assertEquals("this", new Copperplate(t).html({someCondition: true}));
        assertEquals("", new Copperplate(t).html({}));
    },

    "test with function as condition": function () {
        var t = new Copperplate('<if a>a</if>');

        assertEquals("a", t.html({a: function () { return true }}));
        assertEquals("", t.html({a: function () { return false }}));
        assertEquals("", t.html({a: function () { }}));
    },

    "test with function as condition it sets the scope": function () {
        var t = new Copperplate('<if a>a</if>');
        obj = {
            a: function () {
                return this.shouldRender;
            }
        }

        obj.shouldRender = true;
        assertEquals("a", t.html(obj));

        obj.shouldRender = false;
        assertEquals("", t.html(obj));
    },

    "test two ifs": function () {
        var t = '<if a>this</if><if b>that</if>';

        assertEquals("this", new Copperplate(t).html({a: true, b: false}));
        assertEquals("thisthat", new Copperplate(t).html({a: true, b: true}));
        assertEquals("that", new Copperplate(t).html({a: false, b: true}));
        assertEquals("", new Copperplate(t).html({a: false, b: false}));
    },

    "test basic if/else": function () {
        var t = '<if someCondition>this</if><else>that</else>';

        assertEquals("this", new Copperplate(t).html({someCondition: true}));
        assertEquals("that", new Copperplate(t).html({someCondition: false}));
    },

    "test basic if/else with whitespace": function () {
        var t = '<if someCondition>this</if>  <else>that</else>';

        assertEquals("this  ", new Copperplate(t).html({someCondition: true}));
        assertEquals("  that", new Copperplate(t).html({someCondition: false}));
    },

    "test basic if/elseif": function () {
        var t = '<if a>this</if><elseif b>that</elseif>';

        assertEquals("this", new Copperplate(t).html({a: true, b: false}));
        assertEquals("this", new Copperplate(t).html({a: true, b: true}));
        assertEquals("that", new Copperplate(t).html({a: false, b: true}));
        assertEquals("", new Copperplate(t).html({a: false, b: false}));
    },

    "test if/elseif/else": function() {
        var t = '<if a>foo</if><elseif b>bar</elseif><else>baz</else>';
        
        assertEquals("foo", new Copperplate(t).html({a: true, b: false}));
        assertEquals("bar", new Copperplate(t).html({a:false, b: true}));
        assertEquals("baz", new Copperplate(t).html({a: false, b: false}));
    },

    "test nested ifs": function () {
        var t = '<if something><if other>hello</if><if last>world</if></if>';
        assertEquals("world", new Copperplate(t).html({
            something: true,
            last: true,
            other: false
        }));
    },

    "test nesting hell": function() {
        var t = 
              '<if a>a</if>'
            + '<elseif b>b'
              + '<if c>c</if>'
              + '<elseif d>d</elseif>'
            + '</elseif>'
            + '<else>x<if e>e</if><if f>f</if><else>g</else></else>';

        assertEquals("a", new Copperplate(t).html({
            a: true, b: false, c: false, d:false, e: false, f: false
        }));

        assertEquals("bc", new Copperplate(t).html({
            a: false, b: true, c: true, d:false, e: false, f: false
        }));

        assertEquals("bd", new Copperplate(t).html({
            a: false, b: true, c: false, d:true, e: false, f: false
        }));

        assertEquals("b", new Copperplate(t).html({
            a: false, b: true, c: false, d:false, e: false, f: false
        }));

        assertEquals("xg", new Copperplate(t).html({
            a: false, b: false, c: false, d:false, e: false, f: false
        }));

        assertEquals("xg", new Copperplate(t).html({
            a: false, b: false, c: false, d:false, e: false, f: false
        }));

        assertEquals("xeg", new Copperplate(t).html({
            a: false, b: false, c: false, d:false, e: true, f: false
        }));

        assertEquals("xef", new Copperplate(t).html({
            a: false, b: false, c: false, d:false, e: true, f: true
        }));

        assertEquals("xf", new Copperplate(t).html({
            a: false, b: false, c: false, d:false, e: false, f: true
        }));
    },

    "test if with other content": function () {
        var t = '<p> foo <if a>a</if> </p><em><if b><strong>b</strong></if></em>';

        assertEquals("<p> foo a </p><em></em>", new Copperplate(t).html({
            a: true, b: false
        }));

        assertEquals("<p> foo a </p><em><strong>b</strong></em>", new Copperplate(t).html({
            a: true, b: true
        }));

        assertEquals("<p> foo  </p><em><strong>b</strong></em>", new Copperplate(t).html({
            a: false, b: true
        }));

        assertEquals("<p> foo  </p><em></em>", new Copperplate(t).html({
            a: false, b: false
        }));

        var t = '<if a>a</if><p>hi</p>';

        assertEquals('a<p>hi</p>', new Copperplate(t).html({a: true}));
        assertEquals('<p>hi</p>', new Copperplate(t).html({a: false}));
    },

    "test if and else with other content": function () {
        var t = '<h1>hi</h1> <if a>a</if><else>b</else><p>hi</p>';

        assertEquals('<h1>hi</h1> a<p>hi</p>', new Copperplate(t).html({a: true}));
        assertEquals('<h1>hi</h1> b<p>hi</p>', new Copperplate(t).html({a: false}));

        var t = '<h1>hi</h1> <if a>a</if><else>b</else> hi';
        assertEquals('<h1>hi</h1> a hi', new Copperplate(t).html({a: true}));
        assertEquals('<h1>hi</h1> b hi', new Copperplate(t).html({a: false}));

        var t = '<h1>hi</h1> <if a>a</if><else><strong>b</strong></else> hi';
        assertEquals('<h1>hi</h1> <strong>b</strong> hi', new Copperplate(t).html({a: false}));
    },

    "test if, else and elseif with other content": function () {
        var t = '<p>hi</p><if a><span>a</span><elseif b>arf</elseif> a';

        assertEquals("<p>hi</p><span>a</span> a", new Copperplate(t).html({
            a: true, b: false
        }));

        assertEquals("<p>hi</p>arf a", new Copperplate(t).html({
            a: false, b: true
        }));

        assertEquals("<p>hi</p> a", new Copperplate(t).html({
            a: false, b: false
        }));

        var t = '<p>hi</p><if a><span>a</span><elseif b>arf</elseif><p>hi</p>';

        assertEquals("<p>hi</p><span>a</span><p>hi</p>", new Copperplate(t).html({
            a: true, b: false
        }));

        assertEquals("<p>hi</p>arf<p>hi</p>", new Copperplate(t).html({
            a: false, b: true
        }));

        assertEquals("<p>hi</p><p>hi</p>", new Copperplate(t).html({
            a: false, b: false
        }));
    }
});

TestCase("CopperplateVariablesTest", {
    "test variable": function () {
        var t = new Copperplate('Hello, {{thing}}!');
        assertEquals("Hello, World!", t.html({thing: "World"}));
        assertEquals("Hello, Moon!", t.html({thing: "Moon"}));
    },

    "test none existing variable": function () {
        var t = new Copperplate('Hello, {{thing}}!');
        assertEquals("Hello, !", t.html({not: "here"}));
    },

    "test false-y variable": function () {
        var t = new Copperplate('Hello, {{thing}}!');
        assertEquals("Hello, !", t.html({thing: null}));
        assertEquals("Hello, !", t.html({thing: undefined}));
        assertEquals("Hello, !", t.html({thing: false}));
    },

    "test variable in contidional": function () {
        var t = new Copperplate('<if a>{{b}}</if>');
        assertEquals("foo", t.html({a: true, b: "foo"}));
        assertEquals("", t.html({a: false, b: "foo"}));
        assertEquals("", t.html({a: true, b: ""}));
    },

    "test variable in attribute": function () {
        var t = new Copperplate('<a href="{{href}}">{{title}}</a>');
        assertEquals('<a href="foo">yo</a>', t.html({href: "foo", title: "yo"}));
    }
});

TestCase("CopperplateVariousTest", {
    "test getTag": function () {
        var gt = Copperplate.prototype.getTag;
        assertEquals("if", gt('<if>')[0]);
        assertEquals([], gt('<if>')[1]);

        assertEquals("if", gt('<if something>')[0]);
        assertEquals([["something", null]], gt('<if something>')[1]);

        assertEquals([["something","other"]], gt('<if something="other">')[1]);
        assertEquals("if", gt('</if>')[0]);

        assertEquals("test", gt('<test test>')[0]);
        assertEquals([["test", null]], gt('<test test>')[1]);

        assertEquals([
            ["something", null],
            ["other", "this"],
            ["baz", null],
            ["maz", null],
            ["foo", "bar"]
        ], gt('<foo something other=\'this\' baz    maz foo="bar"')[1]);
    }
});