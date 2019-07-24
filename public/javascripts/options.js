$("input[type='text']").keypress(function(event) {
	if (event.which === 13){
		//grab new todo text from input
		var toDoText = $(this).val();
		//create a new li to add to ul
		$('ul').append("<li><span><i class='fas fa-trash-alt'></i></span> " + toDoText + '</li>');
		$(this).val('');
	} 
})

let list = $('#tickers');

chrome.storage.sync.set({ tickers: [] }, function() {
    console.log('set');
})

