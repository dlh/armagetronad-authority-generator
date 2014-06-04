// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

var Vue = require("vue");
var gid = require("../gid");

module.exports = Vue.extend({
    template: require("../../template/verify.html"),
    data: {
        shouldDisplayRemoveButtons: false,
        shouldDisplayDebugLinks: false,
        editedPlayer: null,
        editedPlayerNameBackup: null
    },
    directives: {
        "wait-to-focus": function(value) {
            if (!value)
                return;
            var el = this.el;
            setTimeout(function() {
                el.focus();
            }, 0);
        }
    },
    methods: {
        remove: function(player) {
            this.$dispatch("remove-players", [player])
        },
        edit: function(player) {
            this.editedPlayer = player;
            this.editedPlayerNameBackup = player.name;
        },
        completeEdit: function(player) {
            if (!this.editedPlayer)
                return;
            this.editedPlayer = null;
            if (this.editedPlayerNameBackup == player.name)
                return;
            this.$dispatch("validate-player", player);
        },
        revertEdit: function(player) {
            player.name = this.editedPlayerNameBackup;
            this.editedPlayer = null;
        },
        moveToNextStep: function() {
            this.$dispatch("move-to-anchor", "publish");
        },
        authorityResponse: function(player) {
            return gid.debugURL(player.name);
        },
        validationResponse: function(player) {
            return gid.validationURL(player.name);
        }
    }
});
