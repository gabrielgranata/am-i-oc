'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ enabled: true }, function () {
        console.log('hello world!');
    });

    chrome.browserAction.setPopup({ popup: 'popup.html' }, function () {
        console.log('popup has been set up');
    })
});

retriveData();

function retriveData() {

    chrome.storage.sync.get(['enabled'], function (items) {
        if (items.enabled) {
            makeStockDataRequest();
        }
    });
}

function makeStockDataRequest() {
    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', 'https://sandbox.iexapis.com/stable/stock/GOOGL/quote?token=Tpk_fb93bef773284e5c84796dafe7f621df');
    stockRequest.onreadystatechange = () => {
        if (stockRequest.readyState === 4) {
            let data = JSON.parse(stockRequest.responseText);
            console.log(data);
        }
    }
    stockRequest.send()
}