'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ on: true }, function () {
        console.log('hello world!');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'www.reddit.com', schemes: ['https'] },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});