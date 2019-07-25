'use strict';
setInterval(function() {
    chrome.storage.sync.get(['stocks'], function(items) {
        console.log(items.stocks);
    })
}, 5000);

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ stocks: [] }, function () {
        console.log('hello world!');
    });

    chrome.browserAction.setPopup({ popup: 'popup.html' }, function () {
        console.log('popup has been set up');
    })
});

function getPrices() {
    chrome.storage.sync.get(['tickers'], function (items) {
        let tickers = items.tickers
        tickers.forEach(function (element) {
            element.price = makeStockDataRequest(element.ticker);
            chrome.storage.sync.set({tickers: tickers})
        });
    });
}

function makeStockDataRequest(stockName) {
    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', 'https://sandbox.iexapis.com/stable/stock/' + stockName + '/quote?token=Tpk_fb93bef773284e5c84796dafe7f621df');
    stockRequest.onreadystatechange = () => {
        if (stockRequest.readyState === 4) {
            let data = JSON.parse(stockRequest.responseText);
            return data.latestPrice
        }
    }
    stockRequest.send();
}

function priceHigh(list) {
    list.forEach(function (element) {
        if (element.price > element.high) {
            showNotification(1, element.name);
        }
    });
}

function priceLow(list) {
    list.forEach(function (element) {
        if (element.price < element.low) {
            showNotification(2, element.name);
        }
    });
}

function showNotification(num, ticker) {
    if (num == 1) {
        serviceWorkerRegistration.showNotification("${ticker} has reached your high price", { "body": "${ticker} is priced at ${num}" })
    }
    if (num == 2) {
        serviceWorkerRegistration.showNotification("${ticker} has reached your low price", { "body": "${ticker} is priced at ${num}" })
    }
}

chrome.notifications.create('', {
    type: "basic",
    iconUrl: "public/images/logo128.png",
    title: "test notification",
    message: "testing message"
});