// Copyright (c) 2014, DLH
// See LICENSE.txt for license info.

"use strict";

//t = current time
//b = start value
//c = change in value
//d = duration
function easeInOutQuad(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
}

var rootElement = document.body;

module.exports.scrollTo = function(to, duration, finishedCallback) {
    var start = rootElement.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function() {
        currentTime += increment;
        var val = easeInOutQuad(currentTime, start, change, duration);
        rootElement.scrollTop = val;

        // Firefox uses documentElement
        if (rootElement.scrollTop == 0 && rootElement.scrollTop != val) {
            rootElement = document.documentElement;
            rootElement.scrollTop = val;
        }

        if(currentTime < duration && rootElement.scrollTop != to) {
            setTimeout(animateScroll, increment);
        }
        else {
            finishedCallback();
        }
    };
    animateScroll();
};
