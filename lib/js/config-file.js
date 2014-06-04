// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

function replicate(s, n) {
    return new Array(n + 1).join(s);
}

function banner(textLine) {
    var s = "# " + textLine + " #";
    var banner = replicate("#", s.length);
    return banner + "\n" + s + "\n" + banner + "\n";
}

function toUserLevelCommand(player) {
    var quotedName = player.name.indexOf(" ") == -1 ? player.name : '"' + player.name + '"';
    return "USER_LEVEL " + quotedName + " " + player.userLevel;
}

function buildConfig(players) {
    var groups = [];

    players.forEach(function(player) {
        var group = groups[player.userLevel];
        if (!group)
            group = groups[player.userLevel] = [];
        group.push(player);
    });

    var cfg = [];
    groups.forEach(function(group) {
        if (!group)
            return;

        if (cfg.length > 0)
            cfg.push("");

        var validPlayers = [];
        var invalidPlayers = [];

        group.forEach(function(player) {
            if (player.valid)
                validPlayers.push(player);
            else
                invalidPlayers.push(player);
        });

        var heading = "# " + userLevelNamePlural(group[0].userLevel) + "\n";
        cfg.push(heading);
        validPlayers.forEach(function(player) {
            cfg.push(toUserLevelCommand(player));
        });
        invalidPlayers.forEach(function(player) {
            cfg.push("# " + toUserLevelCommand(player));
        });
    });
    cfg.push("");
    return cfg.join("\n");
}

var USER_LEVEL_NAMES = [
    "Owner",
    "Admin",
    "Moderator",
    "Moderator-2",
    "Moderator-3",
    "Armatrator",
    "Armatrator-2",
    "Team Leader",
    "Team Member",
    "Recruit",
    "Recruit-1",
    "Recruit-2",
    "Local User",
    "OP-ed",
    "OP-ed-2",
    "Remote User",
    "Fallen from Grace",
    "Shunned",
    "OP-ed-5",
    "Authenticated",
    "Program"
];

var USER_LEVEL_NAMES_PLURAL = {
    "Fallen from Grace": true,
    "Shunned": true,
    "Authenticated": true
};


/**
 * @param {Number} userLevel
 * @returns {String}
 */
function userLevelName(userLevel) {
    if (userLevel < 0 || userLevel >= USER_LEVEL_NAMES.length)
        return "Invalid";
    return USER_LEVEL_NAMES[userLevel];
}

/**
 * @param {Number} userLevel
 * @returns {String}
 */
function userLevelNamePlural(userLevel) {
    var name = userLevelName(userLevel);
    if (USER_LEVEL_NAMES_PLURAL[name])
        return name;
    return name + "s";
}

module.exports = {
    buildConfig: buildConfig,
    banner: banner
}
