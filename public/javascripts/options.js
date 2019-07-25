chrome.storage.sync.get(['tickers'], function(items) {
    const tickers = items.tickers;

    tickers.forEach(function(ticker) {
        $('ul').append(`<li class='pl-3'>${ticker}</li>`)
    })
})

$('ul').on('click', 'span', function (event) {
    $(this).parent().fadeOut(500, function () {
        $(this).remove();
    });
    event.stopPropagation();
});

$("input[type='text']").keypress(async function (event) {
    if (event.which === 13) {

        const ticker = $(this).val();
        addTicker(ticker);

    }
});

function addTicker(ticker) {

    const requestUrl = `https://sandbox.iexapis.com/stable/stock/${ticker}/quote?token=Tpk_fb93bef773284e5c84796dafe7f621df`;
    $('input').val('');

    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', requestUrl);
    stockRequest.onreadystatechange = () => {
        if (stockRequest.readyState === 4) {
            if (stockRequest.status === 200) {
                chrome.storage.sync.get(['tickers'], function(items) {
                    const tickers = items.tickers;
                    console.log(tickers);
                    if (tickers.includes(ticker)) {
                        alert('Ticker already tracked! Please try again.');
                        return;
                    } else {
                        $('ul').append("<li class='pl-3'>" + ticker + '</li>');
                        tickers.push(ticker);
                        chrome.storage.sync.set({ tickers: tickers });
                    }
                })
                chrome.storage.sync.get(['tickers'], function(items) {
                    console.log(items);
                })
            } else {
                alert('Not a valid ticker! Please try again.');
            }
            
        }
    }

    stockRequest.send();
}