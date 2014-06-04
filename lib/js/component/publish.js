// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

var Vue = require("vue");
var configFile = require("../config-file");

module.exports = Vue.extend({
    template: require("../../template/publish.html"),
    data: {
        heading: "",
        includeAd: true,
    },
    computed: {
        styledHeading: function() {
            if (this.heading)
                return configFile.banner(this.heading) + "\n";
            return "";
        },
        styledFooter: function() {
            if (this.includeAd)
                return "\n" + "# Created at http://auth-gen.gridstats.com";
            return "";
        },
        configFile: function() {
            var cfg = this.styledHeading;
            cfg += configFile.buildConfig(this.players);
            var footer = this.styledFooter;
            if (cfg)
                cfg += footer;
            return cfg;
        },
        errorDescription: function() {
            var n = this.numberErrors;
            if (n == 1)
                return "one Global ID";
            return n + " Global IDs";
        }
    }
});
