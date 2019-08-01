// 

//Create an AJAX call for the definition(etc.).  This will be the original information that comes up when the word is searched.

// a box containing the defintion(etc.)will append underneath the search box. 

// at that time other options that the user can select such as translator, urban dictionary, text to voice, and thesaurus will appear under the search box but above the definition.  

// under an onclick function for each button there needs to be an AJAX call pulling the information that we select from those sites.  when those button are selected the information will prepend in the results section below.  

// boolean/ or if/even to make sure the user does not display the same information more than once.  

// 


{/* <div class="row col-md-6">

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
</select> */}

$("#trans").on("click", function () {
    console.log("test")
    let menu = $("<div>").addClass("dropdown-menu")
    let languages = ["english", "spanish", "italian"];


    for (var i = 0; i < languages.length; i++) {
      let dropdowns = $("<div>").addClass("dropdown-item")
      $(dropdowns).text(languages[i]);
      menu.append(dropdowns);

        console.log(dropdowns)
    }
  $(".dropdown").append(menu);
 
  }) 
