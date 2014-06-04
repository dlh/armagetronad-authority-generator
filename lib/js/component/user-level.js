// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

var Vue = require("vue");

module.exports = Vue.extend({
    template: require("../../template/user-level.html"),
    replace: true,
    data: {
        userLevel: 7
    },
    computed: {
        userLevelComputed: {
            $get: function() {
                return this.userLevel.toString();
            },
            $set: function(newValue) {
                this.userLevel = parseInt(newValue, 10);
            }
        }
    }
});
