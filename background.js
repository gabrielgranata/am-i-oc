'use strict';
setInterval(function () {
    chrome.storage.sync.get(['stocks'], function (items) {
        let stocks = items.stocks;
        console.log(stocks);
        stocks.forEach(async function (stock) {
            let latestPrice = await makeStockDataRequest(stock.ticker);
            console.log(latestPrice);
            if (stock.high) {
                await checkHigh(latestPrice, stock.high, stock.ticker);
            } else if (stock.low) {
                await checkLow(latestPrice, stock.low, stock.ticker);
            }
            stock.latestPrice = latestPrice;
        });

        chrome.storage.sync.set({stocks: stocks});
    })
}, 5000);

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ stocks: [] }, function () {
        console.log('hello world!');
    });

});

function getPrices() {
    chrome.storage.sync.get(['tickers'], function (items) {
        let tickers = items.tickers
        tickers.forEach(function (element) {
            element.price = makeStockDataRequest(element.ticker);
            chrome.storage.sync.set({ tickers: tickers })
        });
    });
}

async function makeStockDataRequest(stockName) {
    let latestPrice;
    let done;
    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', 'https://sandbox.iexapis.com/stable/stock/' + stockName + '/quote?token=Tpk_fb93bef773284e5c84796dafe7f621df');
    stockRequest.onreadystatechange = () => {
        if (stockRequest.readyState === 4) {
            let data = JSON.parse(stockRequest.responseText);
            latestPrice = data.latestPrice;
            done = true;
        }
    }

    await setTimeout(function() {
        console.log('hi');
    }, 5000);

    stockRequest.send();

    return latestPrice;

}

function checkHigh(latestPrice, setPrice, ticker) {
    if (latestPrice >= setPrice) {
        showNotification('high', ticker)
    }
}

function checkLow(latestPrice, setPrice, ticker) {

    if (latestPrice <= setPrice) {
        showNotification('low', ticker);
    }

}

function showNotification(priceLevel, ticker) {

    let stockIcon = 'empty'
    if (priceLevel === 'high') {
        stockIcon = 'public/images/upward.png'
    } else if (priceLevel === 'low') {
        stockIcon = 'public/images/downward.png'
    }

    var options = {
        type: 'basic',
        title: `${ticker} has reached your set ${priceLevel} of ${num}`,
        message: 'happy trading',
        iconUrl: stockIcon
    };

    chrome.notifications.create(options, callback)

    function callback() {
        console.log('Notification done!');
    }
}
