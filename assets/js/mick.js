console.log("This is an array that is split".split(" "));
const languages = ["English", "Spanish", "French", "Chinese", "Japanese"];
const languageCodes = ["en", "es", "fr", "zh", "ja"];
let oldEnough = null;

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

$("#translate").on("click", function() {
    let input = $(".userInput").val().trim();

    if (input.length) {
        displayTranslationBox();
    }
});

$(document).on("click", ".translateButton", function () {

    let input = $(".userInput").val().trim();
    let lang = $(".language").val().trim();

    if (input.length) {
        translate(lang, input);
    }
});

$("#clear").on("click", function() {
    clear();
});

function $createModal(id) {
    let $modal =  $("<div>").addClass("modal").attr("id", id);
    let $dialog = $("<div>").addClass("modal-dialog");
    let $content = $("<div>").addClass("modal-content");
    let $modalHeader = $("<div>").addClass("modal-header").text("Restricted Content! (18+)");
    let $birthdayInput = $("<input>").addClass("birthdayInput");
    let $info = $("<br> <div>").addClass("centerText").text("Enter date of birth (MM/DD/YYYY):");
    let $enterButton = $("<button>").addClass("btn bg-primary ageButton").text("Enter");
    $content.append($modalHeader, $info, $birthdayInput, $enterButton);
    $modal.append($dialog.append($content));
    return $modal;
}

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


/**
 * FUNCTIONS
 */

function displayTranslationBox() {
    let $translateBox = $(".translateBox");
    $translateBox.empty();

    let $contentBox = $("<div>").addClass("contentBox");
    let $translated = $("<div>").addClass("translationBox");
    let $dropDown = $("<select class= 'form-control language' id='dropdown'></select>");
    for (let i = 0; i < languages.length; i++) {
        let $option = $("<option>" + languages[i] + "</option>").val(languageCodes[i]);
        $dropDown.append($option);
    }
    let $translate = $("<button>Translate</button>").addClass("btn translateButton");

    $contentBox.append($dropDown, $translated, $translate);
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

    if ($defineBox.children().length !== 0) {
        $defineBox.clear();
    }

    if (search.includes(" ")) {

        let splitSearch = search.split(" ");
        let searchedWords = [];

        for (let searchQ = 0; searchQ < splitSearch.length; searchQ++) {
            if (!searchedWords.includes(splitSearch[searchQ]) && splitSearch[searchQ] !== "is" && splitSearch[searchQ] !== "a" && splitSearch[searchQ] !== "an"&& splitSearch[searchQ] !== "to") {
                appendDefineSearch(splitSearch[searchQ]);
                searchedWords.push(splitSearch[searchQ]);
            }
        }
    } else {
        appendDefineSearch(search);
    }
}

function appendDefineSearch(search) {
    let $defineBox = $(".defineBox");

    $.ajax({
        url: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + search + '?key=1ccbabf4-d641-4494-b993-00f868b41a2c',
        method: 'GET',
    }).then(response => {

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

    });
}
