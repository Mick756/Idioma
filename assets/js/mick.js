let defineShowing = false;
let slangShowing = false;

$("#define").on("click", function () {
    let $defineBox = $(".defineBox");
    if (defineShowing) {
        $defineBox.empty();
        defineShowing = false;
    }
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
});

$("#connotation").on("click", function () {
    let $slangBox = $(".slangBox");
    if (slangShowing) {
        $slangBox.empty();
        slangShowing = false;
    }
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
});
