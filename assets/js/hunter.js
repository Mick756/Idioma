// 

//Create an AJAX call for the definition(etc.).  This will be the original information that comes up when the word is searched.

// a box containing the defintion(etc.)will append underneath the search box. 

// at that time other options that the user can select such as translator, urban dictionary, text to voice, and thesaurus will appear under the search box but above the definition.  

// under an onclick function for each button there needs to be an AJAX call pulling the information that we select from those sites.  when those button are selected the information will prepend in the results section below.  

// boolean/ or if/even to make sure the user does not display the same information more than once.  

// 


/* <div class="row col-md-6">

<label for="exampleFormControlSelect1"></label>
<select class="form-control" id="exampleFormControlSelect1">
    <option>English</option>
    <optio>Spanish</option>
    <option>German</option>
    <option>French</option>
    <option>Italian</option>
</select>
</div>
<div class="row col-md-6">

<label for="exampleFormControlSelect1"></label>
<select class="form-control" id="exampleFormControlSelect1">
    <option>English</option>
    <option>Spanish</option>
    <option>German</option>
    <option>French</option>
    <option>Italian</option>
</select> */



// dynammically created dropdown menu??

// $("#trans").on("click", function () {
//   console.log("test")
//   let menu = $("<div>").addClass("dropdown-menu")
//   let languages = ["english", "spanish", "italian"];


//   for (var i = 0; i < languages.length; i++) {
//     let dropdowns = $("<div>").addClass("dropdown-item")
//     $(dropdowns).text(languages[i]);
//     menu.append(dropdowns);

//       console.log(dropdowns)
//   }
// $(".dropdown").append(menu);

// }) 

let defineShowing = false;
let slangShowing = false;

$("#define").on("click", function () {
    let $defineBox = $(".defineBox");
     if (!defineShowing) {
    
    defineShowing = true;
    
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

    });} else {
      $defineBox.empty();
      defineShowing = false;

    }
});

$("#connotation").on("click", function () {
    let $slangBox = $(".slangBox");
   if(!slangShowing) {
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
    });} else {
      $slangBox.empty();
      slangShowing = false;
    }
});
