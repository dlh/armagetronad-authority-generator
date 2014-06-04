"use strict";

var assert = require("assert"),
       gid = require("../lib/js/gid"),
     equal = assert.equal;

function createDescription(names, valid, message) {
    var lastName = names[names.length - 1];
    return gid._describeValidation(lastName, {
        names: names,
        valid: valid,
        message: message
    });
}

describe("GID validate", function() {
    it("invalid name", function() {
        equal(createDescription(["a"], false, ""), "invalid");
    });

    it("valid with warning", function() {
        equal(createDescription(["a"], true, "warning"), "valid-with-warning");
    });

    it("valid suggested name", function() {
        equal(createDescription(["suggested", "original"], true, "suggested name"), "valid-suggested-name");
    });

    it("valid name", function() {
        equal(createDescription(["a"], true, ""), "valid");
    });
});
