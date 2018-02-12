function getData() {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://localhost:3000/db";

	xmlhttp.open("GET", url, true);
 	xmlhttp.send(); 

	xmlhttp.onreadystatechange = function()  {
    if (this.readyState == 4 && this.status == 200) {
         var myObj =  JSON.parse(this.responseText);
        document.getElementById("baseWC").innerHTML= myObj.output.baseWC;
        document.getElementById("targetWC").innerHTML= myObj.output.targetWC;
        document.getElementById("length_ratio").innerHTML = myObj.output.wc_ratio;
        document.getElementById("length_ratio").style["width"] = myObj.output.wc_ratio+"%";
        document.getElementById("remark").innerHTML= myObj.output.remarks;

        document.getElementById("baseNC").innerHTML= myObj.output.baseNouns;
        document.getElementById("targetNC").innerHTML= myObj.output.targetNouns;
        document.getElementById("noun_ratio").innerHTML = myObj.output.nouns_ratio;
        document.getElementById("noun_ratio").style["width"] = myObj.output.nouns_ratio+"%";

        document.getElementById("spelling_mistakes").innerHTML = myObj.output.spelling_mistakes;
        document.getElementById("spelling_mistakes").style["width"] = myObj.output.spelling_mistakes+"%";
        document.getElementById("incorrect_word").innerHTML = myObj.output.incorrect_words;

    }
};
}