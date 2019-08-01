// --------------------------------------------------------------------------------------------------------------------------





//Main search button that calls the definition
$("#search-button").on("click", function(){
let search = $("#search-input").val().trim();
$.ajax({
    url: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + search + '?key=1ccbabf4-d641-4494-b993-00f868b41a2c',
    method: 'GET',
}).then(response => {
    let definition = response[0].shortdef[0];
    console.log(definition);
    $("#definitionDiv").append(definition);

});
});


//Opens things
let box1 = false;
$div = $("<div>");
$("#button1").on("click", function(){
    if(box1 === false){
        box1 = true;
        $("#boxy").append(

        )
    }
})

$(document).on("click", "#but1", function (){
 // SYSTRAN.IO ajax call
var source = $("#dropDown1").val();
var target = $("#dropDown2").val();
var input = $("#search-input").val().trim();
$.ajax({
    method:'GET',
    url: 'https://api-platform.systran.net/translation/text/translate?key=948fb53e-0398-41b8-9b8b-5adad715d36a',
    dataType: 'text',
    data: {
        source: source,
        target: target,
        input: input
    },
    success: function(data) {
        if (typeof data === 'string')
            try {
                data = JSON.parse(data);
                console.log(data.outputs[0].output);
                    $("#translateBox").append(data.outputs[0].output);
            } catch (exp) {

            }
    },
    error: function(xhr, status, err) {
    }
});

});
$(document).on("click", "#but2", function (){
// Urban Dictionary ajax call

    let search = $("#search-input").val().trim();
    $.ajax({
       url: "http://api.urbandictionary.com/v0/define?term=" + search,
       method: "GET"
    }).then(response => {
        for (let i = 0; i < response.list.length; i++) {
            console.log(response.list[i]);
         $("#urbDictDiv").append(response.list[i]);
        }
    });
});
