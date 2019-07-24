$('ul').on('click', 'span', function (event) {
    $(this).parent().fadeOut(500, function () {
        $(this).remove();
    });
    event.stopPropagation();
});

$("input[type='text']").keypress(async function (event) {
    if (event.which === 13) {
        
        const ticker = $(this).val();
        addStock(ticker);

    }
});

let list = $('#tickers');

function addStock(ticker) {

    const requestUrl = `https://sandbox.iexapis.com/stable/stock/${ticker}/quote?token=Tpk_fb93bef773284e5c84796dafe7f621df`;
    $('input').val('');

    const stockRequest = new XMLHttpRequest();
    stockRequest.open('GET', requestUrl);
    stockRequest.onreadystatechange = () => {
        if (stockRequest.readyState === 4) {
            if (stockRequest.status === 200) {
                $('ul').append("<li class='pl-3'>" + ticker + '</li>');
            } else {
                alert('Not a valid ticker! Please try again');
            }
            
        }
    }

    stockRequest.send();
}