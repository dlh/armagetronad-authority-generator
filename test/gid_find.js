"use strict";

var assert = require("assert");
var gid = require("../lib/js/gid");
var deepEqual = assert.deepEqual;

describe("GID find", function() {
    it("no authenticated names", function() {
        deepEqual(gid.findAuthenticatedNames(""), []);
        deepEqual(gid.findAuthenticatedNames("Lorem ipsum dolor sit amet, ..."), []);
    });

    it("basic name with authority", function() {
        deepEqual(gid.findAuthenticatedNames("a@b"), ["a@b"]);
        deepEqual(gid.findAuthenticatedNames("ab@cd"), ["ab@cd"]);
    });

    it("basic name with no authority", function() {
        deepEqual(gid.findAuthenticatedNames("a@"), ["a@"]);
        deepEqual(gid.findAuthenticatedNames("ab@"), ["ab@"]);
    });

    it("long authority name", function() {
        deepEqual(gid.findAuthenticatedNames("a@example.com"), ["a@example.com"]);
    });

    it("authority subgroup", function() {
        deepEqual(gid.findAuthenticatedNames("foo@a/b"), ["foo@a/b"]);
        deepEqual(gid.findAuthenticatedNames("foo@example.com/b"), ["foo@example.com/b"]);
    });

    it("name with spaces", function() {
        deepEqual(gid.findAuthenticatedNames("name with spaces@a"), ["name with spaces@a"]);
        deepEqual(gid.findAuthenticatedNames("name with spaces@"), ["name with spaces@"]);
    });

    it("name with special characters", function() {
        deepEqual(gid.findAuthenticatedNames("dumb@name@a"), ["dumb@name@a"]);
        deepEqual(gid.findAuthenticatedNames("dumb@name@"), ["dumb@name@"]);

        deepEqual(gid.findAuthenticatedNames("blah.foo@a"), ["blah.foo@a"]);
        deepEqual(gid.findAuthenticatedNames("blah.foo@"), ["blah.foo@"]);

        deepEqual(gid.findAuthenticatedNames("fööbar@a"), ["fööbar@a"]);
        deepEqual(gid.findAuthenticatedNames("fööbar@"), ["fööbar@"]);
    });

    it("user_level command", function() {
        deepEqual(gid.findAuthenticatedNames("USER_LEVEL foo@a 7"), ["foo@a"]);
    })

    it("multiple basic names", function() {
        deepEqual(gid.findAuthenticatedNames("foo@a bar@a baz@a"), ["foo@a", "bar@a", "baz@a"]);
        deepEqual(gid.findAuthenticatedNames("foo@a, bar@a,baz@a"), ["foo@a", "bar@a", "baz@a"]);
    });

    it("multiple basic names with newlines", function() {
        deepEqual(gid.findAuthenticatedNames("foo@a\nbar@a"), ["foo@a", "bar@a"]);
    });

    it("seperators" ,function() {
        deepEqual(gid.findAuthenticatedNames("1) foo@a\n2) bar@a"), ["foo@a", "bar@a"]);
        deepEqual(gid.findAuthenticatedNames("1: foo@a\n2: bar@a"), ["foo@a", "bar@a"]);
    });

    it("duplicate names", function() {
        deepEqual(gid.findAuthenticatedNames("foo@a bar@a foo@a foo@a"), ["foo@a", "bar@a"]);
    });

    it("ladle team", function() {
        deepEqual(gid.findAuthenticatedNames("Blah (a (a@forums), p1, p2, p3)"), ["a@forums"]);
        deepEqual(gid.findAuthenticatedNames("Blah (a, b (a@forums, b.asdf@forums ), p1, p2, p3)"), ["a@forums", "b.asdf@forums"]);
        deepEqual(gid.findAuthenticatedNames("Blah (a, b (a@forums / b.asdf@forums ), p1, p2, p3)"), ["a@forums", "b.asdf@forums"]);
        deepEqual(gid.findAuthenticatedNames("Blah (a, b (a@forums / b.asdf@forums / c@forums ), p1, p2, p3)"), ["a@forums", "b.asdf@forums", "c@forums"]);
        deepEqual(gid.findAuthenticatedNames("Blah (a, b (a@forums b.asdf@forums / c@forums ), p1, p2, p3)"), ["a@forums", "b.asdf@forums", "c@forums"]);
    });

    it("ladle teams (multiple lines)", function() {
        var multiple_teams = "Blah (a (a@forums), p1, p2, p3)\bBlah2 (b (b@forums c@forums), p4, p5, p6)\n";
        deepEqual(gid.findAuthenticatedNames(multiple_teams), ["a@forums", "b@forums", "c@forums"]);
    });

    it("WST team", function() {
        deepEqual(gid.findAuthenticatedNames("Blah | A (a@forums) | B (b@forums) | c (. name with spaces@forums) | d | e"), ["a@forums", "b@forums", ". name with spaces@forums"]);
    });

    it("empty username", function() {
        deepEqual(gid.findAuthenticatedNames("@a"), ["@a"]);
        deepEqual(gid.findAuthenticatedNames("@a, foo@a)"), ["@a", "foo@a"]);
        deepEqual(gid.findAuthenticatedNames("Blah (@a, foo@a), p1, p2)"), ["@a", "foo@a"]);
    });
});
