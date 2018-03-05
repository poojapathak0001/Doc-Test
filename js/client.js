function getData() {
  alert(1);
	var xmlhttp = new XMLHttpRequest();
	var url = "http://localhost:3001/db";
alert(5);
	xmlhttp.open("GET", url, true);
 	xmlhttp.send(); 
alert(7);
	xmlhttp.onreadystatechange = function()  {
    if (this.readyState == 4 && this.status == 200) {
         alert(8);
         var myObj =  JSON.parse(this.responseText);

         alert(6);
            var htmlText = '<div class="pt-5"> <div class="container"> <div class="row"> <div class="col-md-12"> <h2>Sections</h2>'
                            + ' <hr class="mb-4"> </div> </div> </div> </div>';
            
            htmlText += '<div class="container">';
            var baseHtml = '<div class="card my-4">'
                        +'<div class="card-header bg-primary">'
                         +' <h5 class="mb-0 text-center">Base Document</h5>'
                        +'</div>'
                        +'<div class="card-body">'
                        +'<div class="col-md-6 p-3">'
                        +'  <table class="table table-hover table-striped table-bordered">'
                        +'    <thead class="thead-inverse">'
                        +'      <tr>'
                        +'     <th scope="col">#</th>'
                          +'      <th scope="col">Parameter</th>'
                          +'      <th scope="col">Value</th>'
                          +'    </tr>'
                           +' </thead>'
                            +'<tbody>'
                             +' <tr>'
                               +' <th scope="row">1</th>'
                                +'<td>Document Name</td>'
                                +'<td>'+myObj.output[0].name+'</td>'
                              +'</tr>'
                              +'<tr>'
                                +'<th scope="row">2</th>'
                                +'<td>Word Count</td>'
                                +'<td>'+myObj.output[0].wordCount+'</td>'
                              +'</tr>'
                              +'<tr >'
                               +' <th scope="row">3</th>'
                                +'<td>Noun Count</td>'
                                +'<td>'+myObj.output[0].nounCount+'</td>'
                              +'</tr>'
                              +'<tr >'
                               +' <th scope="row">4</th>'
                                +'<td>Verb Count</td>'
                                +'<td>'+myObj.output[0].verbCount+'</td>'
                              +'</tr>'
                              +'<tr >'
                               +' <th scope="row">5</th>'
                                +'<td>Adjective Count</td>'
                                +'<td>'+myObj.output[0].adjCount+'</td>'
                              +'</tr>'
                            +'</tbody>'
                          +'</table>'
                        +'</div>'
                        +'</div>';

            var targetHtml = '<div class="card my-4">'
                        +'<div class="card-header bg-primary">'
                         +' <h5 class="mb-0 text-center">Target Document</h5>'
                        +'</div>'
                        +'<div class="card-body">'
                        +'<div class="col-md-6 p-3">'
                        +'  <table class="table table-hover table-striped table-bordered">'
                        +'    <thead class="thead-inverse">'
                        +'      <tr>'
                        +'     <th scope="col">#</th>'
                          +'      <th scope="col">Parameter</th>'
                          +'      <th scope="col">Value</th>'
                          +'    </tr>'
                           +' </thead>'
                            +'<tbody>'
                             +' <tr>'
                               +' <th scope="row">1</th>'
                                +'<td>Document Name</td>'
                                +'<td>'+myObj.output[1].name+'</td>'
                              +'</tr>'
                              +'<tr>'
                                +'<th scope="row">2</th>'
                                +'<td>Word Count</td>'
                                +'<td>'+myObj.output[1].wordCount+'</td>'
                              +'</tr>'
                              +'<tr >'
                               +' <th scope="row">3</th>'
                                +'<td>Noun Count</td>'
                                +'<td>'+myObj.output[1].nounCount+'</td>'
                              +'</tr>'
                              +'<tr >'
                               +' <th scope="row">4</th>'
                                +'<td>Verb Count</td>'
                                +'<td>'+myObj.output[1].verbCount+'</td>'
                              +'</tr>'
                              +'<tr >'
                               +' <th scope="row">5</th>'
                                +'<td>Adjective Count</td>'
                                +'<td>'+myObj.output[1].adjCount+'</td>'
                              +'</tr>'
                            +'</tbody>'
                          +'</table>'
                        +'</div>'
                        +'</div>';

            htmlText += baseHtml + targetHtml + '</div>';

            var resultHtml = '<div class="card my-4">'
                        +'<div class="card-header bg-primary">'
                         +' <h5 class="mb-0 text-center">Result</h5>'
                        +'</div>'
                        +'<div class="card-body">'
                        +'<div class="col-md-6 p-3">'
                        +'<ul class="list-group">'
                        +'<li class="list-group-item">Status: '+myObj.output[2].status+'</li>'
                        +'<li class="list-group-item active"> Similarity: '+myObj.output[2].similarity+'%'+'</li>'
                        +'<li class="list-group-item">Points: '+myObj.output[2].points+'</li>'
                        +'<li class="list-group-item active">Remarks: '+myObj.output[2].remarks+'</li>'
                        +'</ul>'
                        +'</div>'
                        +'</div>'
                        +'<div class="card-footer">footrr</div>'
                        +'</div>';

            htmlText += resultHtml;

            document.getElementById("marker").insertAdjacentHTML('beforeend',htmlText);     

    }
};
}