// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

var Vue = require("vue");

module.exports = Vue.extend({
    template: require("../../template/navigation.html"),
    replace: true,
    data: {
        sectionNumber: 0,
        sections: [
            {el: "extract", text: "Extract Global IDs"},
            {el: "verify", text: "Verify & Edit"},
            {el: "publish", text: "Publish"},
            {el: "about", text: "About"}
        ]
    },
    ready: function() {
        this.sectionNumber = this.$el.getAttribute("data-section");
    },
    methods: {
        moveTo: function(anchor) {
            this.$dispatch("move-to-anchor", anchor);
        }
    }
});
