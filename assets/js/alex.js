
let translateShowing = false;
let defineShowing = false;
let slangShowing = false;

$("#define").on("click", function () {
    let $defineBox = $(".defineBox");
    if (defineShowing) {
        $defineBox.empty();
        defineShowing = false;
    } else {
        defineShowing = true;
        $defineBox.empty();
        let search = $(".userInput").val().trim();
        $.ajax({
            url: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + search + '?key=1ccbabf4-d641-4494-b993-00f868b41a2c',
            method: 'GET',
        }).then(response => {

            if ($defineBox.children().length === 0) {

                let $contentBox = $("<div>").addClass("contentBox");
                let $header = $("<h2>").text(search.charAt(0).toUpperCase() + search.slice(1) + " (" + response[0].hwi.prs[0].mw + ")"); // word
                let $defList = $("<ol>");
                for (let i = 0; i < response[0].shortdef.length; i++) {
                    let $listItem = $("<li>").text(response[0].shortdef[i]);
                    $defList.append($listItem);
                }
                let part = response[0].fl;
                let $partOfSpeech = $("<div>").text("Part of Speech: " + part.charAt(0).toUpperCase() + part.slice(1));
                let $offensive = $("<div>").text("Offensive: " + (response[0].meta.offensive ? "Yes" : "No"));

                $contentBox.append($header, $defList, $partOfSpeech, $offensive);
                $defineBox.append($contentBox);

            }

        });
    }
});

$("#connotation").on("click", function () {
    let $slangBox = $(".slangBox");
    if (slangShowing) {
        $slangBox.empty();
        slangShowing = false;
    } else {
            slangShowing = true;
            let search = $(".userInput").val().trim();
            $.ajax({
                url: "https://api.urbandictionary.com/v0/define?term=" + search,
                method: "GET"
            }).then(response => {

                if ($slangBox.children().length === 0) {

                    let $contentBox = $("<div>").addClass("contentBox");
                    let $header = $("<h2>").text(search.charAt(0).toUpperCase() + search.slice(1));
                    let $defList = $("<ol>");
                    let queryLimit = Math.round(response.list.length / 2);
                    for (let i = 0; i < queryLimit; i++) {
                        let $listItem = $("<li>").text(response.list[i].definition);
                        $defList.append($listItem);
                    }

                    $contentBox.append($header, $defList);
                    $slangBox.append($contentBox);

                }
            });
     
   }
});

$("#translate").on("click", function () {
    let $translateBox = $(".translateBox");
    if (translateShowing) {

            $translateBox.empty();
            translateShowing = false;

    } else if (!translateShowing) {
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
            for (i = 0; i < languages.length;  i++){
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
                met hod:'GET',
                url: 'https://api-platform.systran.net/translation/text/translate?key=948fb53e-0398-41b8-9b8b-5adad715d36a',
                dataType: 'text',
                data: {
                    source: source,
                    target: target,
                    input: input
                },
                success: func tion(data) {
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

function clear(){
    let $defineBox = $(".defineBox");
    $defineBox.empty();
    let $slangBox = $(".slangBox");
    $slangBox.empty();
    let $translateBox = $(".translateBox");
    $translateBox.empty();
    $(".userInput").val("");
    defineShowing = false;
    slangShowing = false;
    translateShowing = false;
}
$("#clear").on("click", function(){
    clear();
});






