'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ enabled: true }, function () {
        console.log('hello world!');
    });

    chrome.browserAction.setPopup({ popup: 'popup.html' }, function () {
        console.log('popup has been set up');
    })
});

function checkEnabled() {
    chrome.storage.sync.get(['enabled'], function (items) {
        if (items.enabled) {
            stockList();
        }
    });
}

function stockList() {
    chrome.storage.sync.get.tickers.forEach(function(element) {
    makeStockDataRequest();
});
}

function makeStockDataRequest(stock_name) {
    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', 'https://sandbox.iexapis.com/stable/stock/'+stock_name+'/quote?token=Tpk_fb93bef773284e5c84796dafe7f621df');
    stockRequest.onreadystatechange = () => {
        if (stockRequest.readyState === 4) {
            let data = JSON.parse(stockRequest.responseText);
        }
    }
    stockRequest.send()
}

chrome.notifications.create('', {
    type: "basic",
    iconUrl: "public/images/logo128.png",
    title: "test notification",
    message: "testing message"
});