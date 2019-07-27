'use strict';

setInterval(checkTime, 60000);

function checkTime() {
    let today = new Date();
    let hours = today.getUTCHours() - 4;
    let minutes = today.getUTCMinutes();
    let day = today.getUTCDay();

    if ((day != 0 && day != 6) && ((hours === 9 && minutes >= 30) || (hours >= 10 && hours <= 16))) {
        checkStocks();
    }
}

function checkStocks() {
    chrome.storage.sync.get(['stocks'], function (items) {
        let stocks = items.stocks;
        console.log(stocks);
        stocks.forEach(async function (stock) {
            let stockRequest = await retriveStockData(stock.ticker);
            console.log(stockRequest);
            let data = JSON.parse(stockRequest.responseText);
            let latestPrice = data.latestPrice;
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
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ stocks: [] }, function () {
        checkTime();
    });
});

async function retriveStockData(stockName) {

    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', 'https://cloud.iexapis.com/stable/stock/' + stockName + '/quote?token=sk_a782c113953f4b6b8469903c93b1714f', false);
    stockRequest.send();
    return stockRequest;
    
}

function checkHigh(latestPrice, setPrice, ticker) {
    if (latestPrice >= setPrice) {
        showNotification('high', ticker, setPrice)
    }
}

function checkLow(latestPrice, setPrice, ticker) {

    if (latestPrice <= setPrice) {
        showNotification('low', ticker, setPrice);
    }

}

function showNotification(priceLevel, ticker, setPrice) {

    let stockIcon = 'empty'
    if (priceLevel === 'high') {
        stockIcon = 'public/images/upward.png'
    } else if (priceLevel === 'low') {
        stockIcon = 'public/images/downward.png'
    }

    var options = {
        type: 'basic',
        title: `${ticker} has reached your set ${priceLevel} of ${setPrice}`,
        message: 'happy trading',
        iconUrl: stockIcon
    };

    chrome.notifications.create(options, callback)

    function callback() {
        console.log('Notification done!');
    }
}
