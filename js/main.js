$(document).ready(function () {
    var _url = "https://my-json-server.typicode.com/yogamahhendra/coba-api-pwa/products"

    var dataResults = ''
    var catResults = ''
    var categories = []

    function renderPage(data) {
        $.each(data, function (key, items) {
            _cat = items.category
            dataResults += "<div>"
                + "<h3>" + items.name + "</h3>"
                + "<p>" + _cat + "</p>"
            "</div>";
            if ($.inArray(_cat, categories) == -1) {
                categories.push(_cat)
                catResults += "<option value'" + _cat + "'>" + _cat + "</option>"
            }
        })


        $('#products').html(dataResults)
        $('#cat_select').html("<option value='all'>semua</option>" + catResults)

    }
    var networkDataReceived = false

    // fresh data from online
    var networkUpdate = fetch(_url).then(function (response) {
        return response.json()
    }).then(function(data){
        networkDataReceived = true
        renderPage(data)
    })

    // return data from cache
    caches.match(_url).then(function(response){
        if(!response) throw Error('No data on cache')
        return response.json()
    }).then(function(data){
        if(!networkDataReceived){
            renderPage(data)
            console.log('render data from cache')
        }
    }).catch(function(){
        return networkUpdate
    })

    // filter
    $("#cat_select").on('change', function () {
        updateProduct($(this).val())
    })

    function updateProduct(cat) {
        var dataResults = ''
        var _newUrl = _url
        if (cat != 'all')
            _newUrl = _url + "?category=" + cat

        $.get(_newUrl, function (data) {
            $.each(data, function (key, items) {
                _cat = items.category
                dataResults += "<div>"
                    + "<h3>" + items.name + "</h3>"
                    + "<p>" + _cat + "</p>"
                "</div>";
            })


            $('#products').html(dataResults)


        })
    }
})

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        this.navigator.serviceWorker.register('/serviceworker.js').then(function (registration) {
            // register
            console.log('ServiceWorker Registration Succesful with scope:', registration.scope);
        }, function (err) {
            // regis fail
            console.log('ServiceWorker Registration Failed', err);
        });
    });
}
