
let translateShowing = false;

$("#translate").on("click", function() {
    let $translateBox = $(".translateBox");
    if (translateShowing){

    $translateBox.empty();
    translateShowing = false;

    }else if(!translateShowing){
        $translateBox.empty();
        translateShowing = true;
    let languages = [
        "English",
        "Spanish",
        "French",
        "Chinese",
        "Japanese"
    ];
    let languageCodes = [
        "en",
        "es",
        "fr",
        "zh",
        "ja"
    ];
    let $contentBox = $("<div>").addClass("contentBox");
    let $translated = $("<div>").addClass("translatedBox");
    let $dropDown = $("<select class= 'form-control language' id='exampleFormControlSelect1'></select>");
    for (i = 0; i < languages.length; i++){
        let $option = $("<option>" + languages[i] + "</option>").val(languageCodes[i]);
        $dropDown.append($option);
    }
    let $translate = $("<button>Translate</button>").addClass("btn translateButton");

    $contentBox.append($dropDown, $translated, $translate);
    $translateBox.append($contentBox);

    }
$(".translateButton").on("click", function(){
    var source = "auto";
    var target = $(".language").val().trim();
    var input = $(".userInput").val().trim();
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
                    $(".translatedBox").text(data.outputs[0].output);
                } catch (exp) {

                }
        },
        error: function(xhr, status, err) {
        }
    });
});

});







