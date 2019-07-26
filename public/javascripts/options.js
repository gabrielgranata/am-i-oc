chrome.storage.sync.get(['stocks'], function (items) {
    const stocks = items.stocks;

    if (stocks.length > 0) {
        stocks.forEach(function (stock) {
            $('ul').append(`<li class='align-items-center'>
                                <span id='delete' class='ml-0'><img scr='../images/trashcan.png'></span>
                                    ${(stock.ticker).toUpperCase()}
                                <input class='low' type='number'>
                                <input class='high' type='number'>
                            </li>`);
            
            
            addHighInputKeypressListener();
            addLowInputKeypressListener();

        })
    }
})

$('ul').on('click', 'span', function (event) {

    let targetTicker = $(this).parent().text().slice(1);

    chrome.storage.sync.get(['stocks'], function (items) {

        const stocks = items.stocks;


        if (stocks) {
            let targetIndex = 0;
            stocks.forEach(function (stock, index) {
                if (stock.ticker == targetTicker) {
                    targetIndex = index;
                }
            });

            stocks.splice(targetIndex, 1);

            chrome.storage.sync.set({ stocks: stocks });
        }

    });

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

    const requestUrl = `https://sandbox.iexapis.com/stable/stock/${ticker}/quote?token=Tpk_fb93bef773284e5c84796dafe7f621df`;
    $('input').val('');

    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', requestUrl);
    stockRequest.onreadystatechange = () => {
        if (stockRequest.readyState === 4) {
            if (stockRequest.status === 200) {
                chrome.storage.sync.get(['stocks'], function (items) {

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
                        $('ul').append(`<li class='align-items-center'>
                                <span id='delete' class='ml-0'><img scr='../images/trashcan.png'></span>
                                    ${(ticker).toUpperCase()}
                                <input class='low' type='number' placeholder='low'>
                                <input class='high' type='number' placeholder='high'>
                            </li>`);
                        let newStock = {
                            ticker: ticker
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
        } else if (input.hasClass('high')) {
            stocks[targetIndex].high = input.val();
        }

        chrome.storage.sync.set({ stocks: stocks });
    })
}
