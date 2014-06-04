// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

var Vue = require("vue");
var gid = require("../gid")

module.exports = Vue.extend({
    template: require("../../template/extract.html"),
    data: {
        text: "",
        userLevelGeneral: 7,
        userLevelZMan: 1,
        shouldAddZMan: true,
    },
    methods: {
        extract: function(event) {
            if (this.shouldAddZMan) {
                this.shouldAddZMan = false;
                this.$dispatch("add-names", this.userLevelZMan, ["Z-Man@forums"]);
            }

            var names = gid.findAuthenticatedNames(this.text);
            this.text = "";
            if (names.length > 0)
                this.$dispatch("add-names", this.userLevelGeneral, names);

            this.$dispatch("move-to-anchor", "verify");
        }
    }
});
