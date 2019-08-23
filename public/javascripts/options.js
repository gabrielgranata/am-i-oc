chrome.storage.sync.get(['stocks'], function (items) {
    const stocks = items.stocks;

    if (stocks.length > 0) {
        stocks.forEach(function (stock) {
            $('#container ul').append(`<li class='align-items-center'>
                                <span id='delete' class='ml-0'><img scr='../images/trashcan.png'></span>
                                    ${(stock.ticker).toUpperCase()}
                                <input class='low' type='number' min='0' placeholder='${stock.low || 0}'>
                                <input class='high' type='number' min='0' placeholder='${stock.high || 0}'>
                            </li>`);

            addHighInputKeypressListener();
            addLowInputKeypressListener();

        })
    }
})

$('ul').on('click', 'span', function (event) {

    let targetTicker = $(this).parent().text().slice(1);
    let targetTickerPrice;

    chrome.storage.sync.get(['stocks'], function (items) {

        const stocks = items.stocks;

        if (stocks) {
            let targetIndex = 0;
            stocks.forEach(function (stock, index) {
                if (stock.ticker == targetTicker) {
                    targetIndex = index;
                    targetTickerPrice = stock.latestPrice;
                }
            });

            stocks.splice(targetIndex, 1);

            chrome.storage.sync.set({ stocks: stocks });
        }

    });

    let currentPriceElements = $('.prices');

    for (let element of currentPriceElements) {
        console.log(element.textContent.replace(/ /g, ''));
    }

    $(this).parent().fadeOut(500, function () {
        $(this).remove();
    });
    event.stopPropagation();

});

$("#newTicker").keypress(async function (event) {

    if (event.which === 13) {
        let ticker = $(this).val();
        ticker = ticker.replace(/ /g, '').toUpperCase();
        addTicker(ticker);
    }

});

function addLowInputKeypressListener() {
    let lowInput = $('li').last().children().eq(1);

    lowInput.keypress('keypress', async function (event) {
        if (event.which === 13) {
            changeNotificationPrice(lowInput);
        }
    })
}

function addTicker(ticker) {

    const requestUrl = `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=sk_a782c113953f4b6b8469903c93b1714f`;
    $('input').val('');

    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', requestUrl);
    stockRequest.onreadystatechange = () => {
        if (stockRequest.readyState === 4) {
            if (stockRequest.status === 200) {
                chrome.storage.sync.get(['stocks'], function (items) {

                    const response = JSON.parse(stockRequest.responseText)
                    const stocks = items.stocks;
                    let tracked = false;

                    stocks.forEach(function (stock) {
                        if (stock.ticker === ticker) {
                            tracked = true;
                        }
                    });

                    if (tracked) {
                        alert('Ticker already tracked! Please try again.');
                        return;
                    } else {
                        $('#container ul').append(`<li class='align-items-center'>
                                <span id='delete' class='ml-0'><img scr='../images/trashcan.png'></span>
                                    ${(ticker).toUpperCase()}
                                <input class='low' type='number' placeholder='low' min='0'>
                                <input class='high' type='number' placeholder='high' min='0'>
                            </li>`);

                        $('#container2 ul').append(`<li class='prices align-items-center'>
                                ${response.latestPrice}
                            </li>`);

                        let newStock = {
                            ticker: ticker,
                            latestPrice: response.latestPrice,
                            low: 0,
                            high: 0
                        }

                        addLowInputKeypressListener();
                        addHighInputKeypressListener();

                        chrome.storage.sync.get(['stocks'], function (items) {
                            let stocks = items.stocks;
                            stocks.push(newStock);
                            chrome.storage.sync.set({ stocks: stocks });
                        })
                    }
                });
            } else {
                alert('Not a valid ticker! Please try again.');
            }

        }
    }

    stockRequest.send();
}

function addHighInputKeypressListener() {
    let highInput = $('li').last().children().eq(2);
    
    highInput.keypress(async function (event) {
        if (event.which === 13) {
            changeNotificationPrice(highInput);
        }
    })
}

function changeNotificationPrice(input) {

    const tickerText = input.parent().text();
    const expr = /([A-Z])\w+/g

    const ticker = tickerText.match(expr)[0];

    chrome.storage.sync.get(['stocks'], function(items) {
        const stocks = items.stocks;
        let targetIndex = 0;
        stocks.forEach(function (stock, index) {
            if (stock.ticker === ticker) {
                targetIndex = index;
            }
        });

        if (input.hasClass('low')) {
            stocks[targetIndex].low = input.val();
            alert(`Low target price set to ${input.val()}`)
        } else if (input.hasClass('high')) {
            stocks[targetIndex].high = input.val();
            alert(`High target price set to ${input.val()}`)
        }

        chrome.storage.sync.set({ stocks: stocks });
    })
}
