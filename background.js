'use strict';

const extensionId = 'aompemfgpnekdfaeohbeffbimnnbeiod';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ enabled: true }, function () {
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

chrome.pageAction.onClicked.addListener(click => {

    chrome.storage.sync.get(['enabled'], result => {

        let enabled = result.enabled;

        if (enabled) {
            console.log('The app is on, turning it off');
            chrome.storage.sync.set({ enabled: false });
            chrome.windows.getAll(windows => {
                windows.forEach(window => {
                    chrome.tabs.getAllInWindow(window.id, tabs => {
                        tabs.forEach(tab => {
                            chrome.pageAction.hide(tab.id, function() {
                                console.log('hidden page action in tab ' + tab.id);
                            })
                        })
                    });
                });
            });
            // chrome.pageAction.hide(extensionId, function(res){
            //     console.log(res);
            // })
        } else {
            console.log('The app is off, turning it on');
            chrome.storage.sync.set({ enabled: true });
            chrome.windows.getAll(windows => {
                windows.forEach(window => {
                    chrome.tabs.getAllInWindow(window.id, tabs => {
                        tabs.forEach(tab => {
                            chrome.pageAction.show(tab.id, function() {
                                console.log('showing page action in tab ' + tab.id);
                            })
                        })
                    })
                })
            })
        };
    });


    
    
});

