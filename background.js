'use strict';

const extensionId = 'aompemfgpnekdfaeohbeffbimnnbeiod';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ enabled: true }, function () {
        console.log('hello world!');
    });
    
    chrome.browserAction.setPopup({ popup: 'popup.html' }, function() {
        console.log('popup has been set up');
    })
});
