chrome.storage.sync.get(['stocks'], function (items) {
    const stocks = items.stocks;

    if (stocks.length > 0) {
        stocks.forEach(function (stock) {
            $('ul').append(`<li class='align-items-center'>
                                <span id='delete' class='ml-0'><img scr='../images/trashcan.png'></span>
                                    ${(stock.ticker).toUpperCase()}
                                <input id='low' type='text'>
                                <input id='high' type='text'>
                            </li>`);
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
        const ticker = $(this).val();
        console.log(ticker);
        addTicker(ticker);
    }

});

$('li').on('keypress', 'input', function (event) {
    console.log(event);
})

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
                                <input class='low' type='text' placeholder='low'>
                                <input class='low' type='text'>
                            </li>`);
                        let newStock = {
                            ticker: ticker
                        }
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