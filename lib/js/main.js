// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

if (typeof DEBUG === "undefined")
  window.DEBUG = true;

var Vue = require("vue");
var _ = require("lodash");

var animate = require("./animate")
var gid = require("./gid");

var INITIAL_MESSAGE = "Fetching validation";
var INITIAL_DESCRIPTION = "fa fa-refresh fa-spin validating"

function cssDescription(description) {
    if (description === "invalid") {
        return "fa fa-exclamation-triangle invalid";
    }
    else if (description === "valid-suggested-name") {
        return "fa fa-exchange";
    }
    else if (description === "valid-with-warning") {
        return "fa fa-meh-o warning";
    }
    else if (description === "valid") {
        return "fa fa-check valid";
    }
}

var app = new Vue({
    el: "#app-view",
    // lazy: true,
    data: {
        currentKey: 0,
        players: [],
    },
    computed: {
        numberErrors: function() {
            return this.players.reduce(function(sum, p) {
                return sum + (p.valid ? 0 : 1);
            }, 0);
        }
    },
    ready: function() {
        this.$on("add-names", this.addNames);
        this.$on("validate-player", this.validatePlayer);
        this.$on("remove-players", this.removePlayers);
        this.$on("move-to-anchor", this.moveToAnchor);
    },
    methods: {
        addNames: function(userLevel, names) {
            var xs = names.map(function(name, index) {
                return {
                    name: name,
                    userLevel: userLevel,
                    valid: false,
                    message: INITIAL_MESSAGE,
                    description: INITIAL_DESCRIPTION,
                    key: this.currentKey++
                };
            }, this);
            this.players = this.players.concat(xs);
            xs.forEach(function(entry) { this.validatePlayer(entry); }, this);
        },
        validatePlayer: function(entry) {
            entry.message = INITIAL_MESSAGE;
            entry.description = INITIAL_DESCRIPTION;
            gid.validateName(entry.name, function(name, newName, valid, message, description) {
                entry.name = newName;
                entry.valid = valid;
                entry.message = message;
                entry.description = cssDescription(description);
                this.removeDuplicateNames(newName);
            }.bind(this));
        },
        removePlayers: function(players) {
            var keys = _.pluck(players, "key");
            Vue.nextTick(function() {
                this.players = this.players.filter(function(p) { return !_.contains(keys, p.key) });
            }.bind(this));
        },
        moveToAnchor: function(anchor) {
            // document.getElementById(anchor).scrollIntoView();
            animate.scrollTo(document.getElementById(anchor).offsetTop, 500);
        },
        removeDuplicateNames: function(name) {
            var dups = _.filter(this.players, {name: name});
            if (dups.length > 1) {
                // Keep most elevated user level
                var sortedDups = _.sortBy(dups, "userLevel");
                var toRemove = _.rest(sortedDups);
                this.removePlayers(toRemove);
            }
        }
    },
    components: {
        "extract": require("./component/extract"),
        "navigation": require("./component/navigation"),
        "publish": require("./component/publish"),
        "user-level": require("./component/user-level"),
        "verify": require("./component/verify")
    }
});

if (DEBUG) {
    window.app = app;
    window._ = _;
}
