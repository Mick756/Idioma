const languages = ["English", "Spanish", "French", "Chinese", "Japanese", "Korean"];
const languageCodes = ["en", "es", "fr", "zh", "ja", "ko"];

/**
 * EVENTS
 */

$("#define").on("click", function () {
    let input = $(".userInput").val().trim();

    if (input.length) {
        let $defineBox = $(".defineBox");
        $defineBox.empty();

        define(input);
    }
});

$("#connotation").on("click", function () {
    let input = $(".userInput").val().trim();

    if (input.length) {
        let $slangBox = $(".slangBox");
        $slangBox.empty();

        connote(input);
    }
});

$("#translate").on("click", function() {
    let input = $(".userInput").val().trim();

    if (input.length) {
        displayTranslationBox();
    }
});

$(document).on("click", ".translateButton", function () {
    console.log("TRANS");

    let input = $(".userInput").val().trim();
    let lang = $(".language").val().trim();

    if (input.length) {
        translate(lang, input);
    }
});

$("#clear").on("click", function() {
    clear();
});

$("#all").on("click", function() {
    let input = $(".userInput").val().trim();

    let modal = $createModal("birthdayModal");
    $(modal).modal('show');

    if (input.length) {
        displayTranslationBox();
        define(input);
        connote(input);
    }
});


/**
 * FUNCTIONS
 */

function displayTranslationBox() {
    let $translateBox = $(".translateBox");
    $translateBox.empty();

    let $button = $("<button class ='btn searchButton transSpeech fas fa-volume-up'></button>");
    let $contentBox = $("<div>").addClass("contentBox");
    let $translated = $("<div>").addClass("translationBox");
    let $dropDown = $("<select class= 'form-control language' id='dropdown'></select>");
    for (let i = 0; i < languages.length; i++) {
        let $option = $("<option>" + languages[i] + "</option>").val(languageCodes[i]);
        $dropDown.append($option);
    }
    let $translate = $("<button>Translate</button>").addClass("btn translateButton");
    $contentBox.append($dropDown, $translated, $translate, $button);
    $translateBox.append($contentBox);
}

function clear(){
    let $defineBox = $(".defineBox");
    $defineBox.empty();
    let $slangBox = $(".slangBox");
    $slangBox.empty();
    let $translateBox = $(".translateBox");
    $translateBox.empty();
    $(".userInput").val("");
}

function translate(target, input) {
    $.ajax({
        method:'GET',
        url: 'https://api-platform.systran.net/translation/text/translate?key=c32c69a2-91b3-4499-9142-418f24c81096',
        dataType: 'text',
        data: {
            source: "auto",
            target: target,
            input: input
        },
        success: function(data) {
            if (typeof data === 'string')
                try {
                    data = JSON.parse(data);
                    $(".translationBox").text(data.outputs[0].output);
                } catch (exp) {}
        },
        error: function(xhr, status, err) {
        }
    });
}

function connote(search) {
    let $slangBox = $(".slangBox");

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

function define(search) {
    let $defineBox = $(".defineBox");

    $.ajax({
        url: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + search + '?key=1ccbabf4-d641-4494-b993-00f868b41a2c',
        method: 'GET',
    }).then(response => {

        if ($defineBox.children().length === 0) {

            let $contentBox = $("<div>").addClass("contentBox");
            let $button = $("<button class = 'btn searchButton speech fas fa-volume-up'></button>");
            let $header = $("<h2 id = 'defined'>").text(search.charAt(0).toUpperCase() + search.slice(1) + " (" + response[0].hwi.prs[0].mw + ")"); // word
            let $defList = $("<ol>");
            for (let i = 0; i < response[0].shortdef.length; i++) {
                let $listItem = $("<li>").text(response[0].shortdef[i]);
                $defList.append($listItem);
            }
            let part = response[0].fl;
            let $partOfSpeech = $("<div>").text("Part of Speech: " + part.charAt(0).toUpperCase() + part.slice(1));
            let $offensive = $("<div>").text("Offensive: " + (response[0].meta.offensive ? "Yes" : "No"));
            $header.append($button);
            $contentBox.append($header, $defList, $partOfSpeech, $offensive);
            $defineBox.append($contentBox);

        }

    });
}
// Text to Speech

let speechCodes = ["en-us", "es-mx", "fr-fr", "zh-cn", "ja-jp", "ko-kr"];

$(document).on("click", ".speech", function () {
    $.speech({
        key: 'eff34443a77f4306a983822100a53171',
        src: $("#defined").text().split(" ")[0],
        hl: 'en-us',
        r: -1,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
});

$(document).on("click", ".transSpeech", function () {
    let langs = [];
    for (let i = 0; i < languages.length; i++) {
        let  $lang =  $("<div>").attr("id", languages[i]);
        $lang.val(speechCodes[i]);
        langs.push($lang);
    }
    let language = "";
    langs.forEach(lang => {
        if (lang.val().includes($(".language").val())) {
            language = lang.val();
        }
    });


    $.speech({
        key: 'eff34443a77f4306a983822100a53171',
        src: $(".translationBox").text(),
        hl: language,
        r: -1,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
});
