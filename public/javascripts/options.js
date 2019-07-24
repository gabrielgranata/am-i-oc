let form = document.getElementById('stocks');

form.onsubmit = function() {
    chrome.storage.sync.set({ stock: 'WEED' });
    chrome.storage.sync.get(['stock'], function(val) {
        console.log(val);
    })
}