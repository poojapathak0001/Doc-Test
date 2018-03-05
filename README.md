# Doc-Test
Doc-Test is a website which offers to compare two .docx documents and tell how close those documents are on the fronts of word count and keywords used.

#Technologies used:
HTML5
CSS3
Bootstrap4
JavaScript
nodejs (APIs : natural)

#File structre
index.html          //the main html file
css/style.css       //style sheet for index.html
client.js           //client side js file
server.js           //server side scripting file
node_modules        //contains preinstalled required modules of nodejs

#Prerequisite:
Download nodejs from here https://nodejs.org/en/download/
Install all the APIs 
 $npm install natural

Install the json server
 $ npm install -g json-server

#How to use:
Open the server.js file and give the path for base and target file.
Run the server.js file on command prompt using command $node server.js
Now run the json server using command
 json-server --watch data.json
Now run the index.html file on browser
Click the result button and you have your result
