// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

function validationURL(name) {
    return "lib/php/armaauth.php?action=validate&name=" + encodeURIComponent(name);
}

function debugURL(name) {
    return "lib/php/armaauth.php?action=debug_authority_response&name=" + encodeURIComponent(name);
}

/**
 * @callback validationCallback
 * @param {String} name - The GID being validated
 * @param {String} newName - The name suggested from the validation
 * @param {Boolean} valid - Is the name valid?
 * @param {String} message - The warning or error message from the validation
 * @param {String} description - A one-word description of the validation result
 */

/**
 * @param {String} name - The GID to validate
 * @param {validationCallback} callback - A callback that runs after the validation is complete
 */
function validateName(name, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var data = JSON.parse(this.responseText);
            callback(name, data.names[0], data.valid, data.message, _describeValidation(name, data));
        }
    };
    request.open("GET", validationURL(name));
    request.send();
}

function _describeValidation(name, data) {
    if (!data.valid)
        return "invalid";
    else if (data.valid && data.names[0] !== name)
        return "valid-suggested-name";
    else if (data.valid && data.message !== "")
        return "valid-with-warning";
    return "valid";
}

/**
 * @param {String} text - The block of text that will be searched for GIDs
 * @returns {String[]} A unique array of GIDs
 */
function findAuthenticatedNames(text) {
    var matches = text.match(/([^\n@():,\/]*@[^\s,)]*)/g);
    if (!matches)
        return [];
    var filteredMatches = [];
    var namesSeen = {};
    for (var i = 0; i < matches.length; i++) {
        var name = matches[i].replace(/^(USER_LEVEL)?\s+/i, "");
        if (!namesSeen[name])
            filteredMatches.push(name);
        namesSeen[name] = true;
    }
    return filteredMatches;
}

module.exports = {
    validationURL: validationURL,
    debugURL: debugURL,
    validateName: validateName,
    _describeValidation: _describeValidation,
    findAuthenticatedNames: findAuthenticatedNames,
};
