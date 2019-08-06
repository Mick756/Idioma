const languages = ["English", "Spanish", "French", "Chinese", "Japanese", "Korean", "German"];
const languageCodes = ["en", "es", "fr", "zh", "ja", "ko", "de"];
let speechCodes = ["en-us", "es-mx", "fr-fr", "zh-cn", "ja-jp", "ko-kr", "de-de"];
let oldEnough = null;
let defineBoxShowing = false;
let translateBoxShowing = false;
let connotationBoxShowing = false;

$("#define").on("click", function () {
    let $defineBox = $(".defineBox");
    if (!defineBoxShowing) {
        defineBoxShowing = true;
        let input = $(".userInput").val().trim();

        if (input.length) {
            $defineBox.empty();

            if ($defineBox.children().length === 0) {
                define(input);
            }
        }
    } else {
        defineBoxShowing = false;
        $defineBox.empty();
    }
});

$("#connotation").on("click", function () {
    let $slangBox = $(".slangBox");

    if (!connotationBoxShowing) {
        connotationBoxShowing = true;
        let input = $(".userInput").val().trim();

        if (input.length) {
            $slangBox.empty();

            if (oldEnough !== null) {
                if (oldEnough) {
                    connote(input);
                }
            } else {
                let modal = $createModal("birthdayModal");
                $(modal).modal('show');
            }
        }
    } else {
        connotationBoxShowing = false;
        $slangBox.empty();
    }
});

$("#translate").on("click", function() {
    let $translateBox = $(".translateBox");

    if (!translateBoxShowing) {
        translateBoxShowing = true;
        let input = $(".userInput").val().trim();

        if (input.length) {
            displayTranslationBox();
        }
    } else {
        translateBoxShowing = false;
        $translateBox.empty();
    }
});

$(document).on("click", ".translateButton", function () {

    let input = $(".userInput").val().trim();
    let lang = $(".language").val();

    console.log(lang);

    if (input.length) {
        translate(lang, input);
    }
});

$("#clear").on("click", function() {
    clear();
});

$("#all").on("click", function() {
    let input = $(".userInput").val().trim();

    if (input.length) {
        displayTranslationBox();
        define(input);
        if (oldEnough !== null) {
            if (oldEnough) {
                connote(input);
            }
        } else {
            let modal = $createModal("birthdayModal");
            $(modal).modal('show');
        }
    }
});

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

$(document).on("click", ".ageButton", function() {
    let birthday = $(".birthdayInput").val().trim();
    if (!birthday.length || !birthday.includes("/")) {
        oldEnough = null;
    } else {
        let splitBirthday = birthday.split("/");
        let secondsLived = (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay()).getTime() - new Date(parseInt(splitBirthday[2]), parseInt(splitBirthday[0]) - 1, parseInt(splitBirthday[1])).getTime()) / 1000;
        let daysLived = (secondsLived / 60 / 60 / 24);
        oldEnough = (daysLived >= 6570);
        if (oldEnough !== null && oldEnough) {
            connote($(".userInput").val().trim());
        }
    }
    $("#birthdayModal").modal('hide');
});

function $createModal(id) {
    let $modal =  $("<div>").addClass("modal").attr("id", id);
    let $dialog = $("<div>").addClass("modal-dialog");
    let $content = $("<div>").addClass("modal-content");
    let $modalHeader = $("<div>").addClass("modal-header").text("Restricted Content! (18+)");
    let $birthdayInput = $("<input>").addClass("birthdayInput");
    let $info = $("<br> <div>").addClass("centerText").text("Enter date of birth (MM/DD/YYYY):");
    let $enterButton = $("<button>").addClass("btn ageButton").text("Enter");
    $content.append($modalHeader, $info, $birthdayInput, $enterButton);
    $modal.append($dialog.append($content));
    return $modal;
}

function displayTranslationBox() {
    let $translateBox = $(".translateBox");
    $translateBox.empty();

    let $contentBox = $("<div>").addClass("contentBox");
    let $button = $("<button class = 'btn voiceButton transSpeech fas fa-volume-up'></button>");
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
        url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190806T172206Z.e66e4ed64c1faa9b.213e793f362a69c14c4da343834d983813ae6c70&lang=' + target + '&text=' + input,
    }).then(response => {
        $(".translationBox").text(response.text[0]);
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

                let $listItem = $("<li>").text(response.list[i].definition.replace("[", "").replace("]", ""));
                $defList.append($listItem);
            }

            $contentBox.append($header, $defList);
            $slangBox.append($contentBox);

        }
    });
}

function define(search) {
    let $defineBox = $(".defineBox");

    if (search.includes(" ")) {

        if ($defineBox.children().length !== 0) {

            $defineBox.clear();
        }

        if ($defineBox.children().length === 0) {

            let splitSearch = search.split(" ");
            let searchedWords = [];

            for (let searchQ = 0; searchQ < splitSearch.length; searchQ++) {

                if (!searchedWords.includes(splitSearch[searchQ]) && splitSearch[searchQ] !== "is" && splitSearch[searchQ] !== "a" && splitSearch[searchQ] !== "an" && splitSearch[searchQ] !== "to") {

                    appendDefineSearch(splitSearch[searchQ], true, splitSearch.length);
                    searchedWords.push(splitSearch[searchQ]);
                }
            }
        }
    } else {

        if ($defineBox.children().length !== 0) {

            $defineBox.clear();
        }

        if ($defineBox.children().length === 0) {

            appendDefineSearch(search, false, -1);
        }
    }
}

function appendDefineSearch(search, phrase, size) {
    let $defineBox = $(".defineBox");

    $.ajax({
        url: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + search + '?key=1ccbabf4-d641-4494-b993-00f868b41a2c',
        method: 'GET',
    }).then(response => {

            let $contentBox = $("<div>").addClass("contentBox");
            let $button = $("<button class = 'btn voiceButton speech fas fa-volume-up'></button>");
            let $header = $("<h2 id = 'defined'>").text(search.charAt(0).toUpperCase() + search.slice(1) + " (" + response[0].hwi.prs[0].mw + ")");
            let $defList = $("<ol>");

            for (let i = 0; i < response[0].shortdef.length; i++) {

                let $listItem = $("<li>").text(response[0].shortdef[i]);
                $defList.append($listItem);
            }

            let part = response[0].fl;
            let $partOfSpeech = $("<div>").text("Part of Speech: " + part.charAt(0).toUpperCase() + part.slice(1));
            let $offensive = $("<div>").text("Offensive: " + (response[0].meta.offensive ? "Yes" : "No"));

            if (phrase && $defineBox.children().length < size) {

                $contentBox.append($header.append($button), $defList, $partOfSpeech, $offensive);
                $defineBox.append($contentBox);

            } else if ($defineBox.children().length === 0) {

                $contentBox.append($header.append($button), $defList, $partOfSpeech, $offensive);
                $defineBox.append($contentBox);
            }
    });
}