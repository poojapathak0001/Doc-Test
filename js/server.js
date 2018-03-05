/* required libraries */
const path = require('path');
const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

/* global variables */
var baseFileAttributes = {
  name:"",
  wordCount: 0,
  nounCount: 0,
  verbCount: 0,
  adjCount: 0,
};

var targetFileAttributes = {
  name:"",
  wordCount: 0,
  nounCount: 0,
  verbCount: 0,
  adjCount: 0,
};

var result = {
  status: "",
  points: 0,
  similarity: 0,
  remarks: "",
};

var baseText, targetText;
var wordCountBase = 0, nounLenBase = 0, adjLenBase = 0, verbLenBase = 0;
var wordCountTarget = 0, nounLenTarget = 0, adjLenTarget = 0, verbLenTarget = 0;
var isReady = false;
var taskCount = 0;
var index = 0 ;

let oupt=[baseFile, tarFile, result];

let data = {output:oupt};

/* promise function */
let readFile = function(url) {
	return new Promise(function(resolve,reject){
		textract.fromFileWithPath(url,{preserveLineBreaks : true}, function(error,text){
			if(error)
				reject(error);
			else {
				/* working on target file */
				if(index == 2)	{
					spell = tokenizer.tokenize(text);;
					resolve();
				}
				else {
					token = tokenizer.tokenize(text);

					var getLiterals = function(text,function(res)	{
						// get tagger pairs from array
						  var taggerJSON=tagger.tag(token);

						  // save text for global function use
						  switch(index){
						    case 0 :baseText = text;
						                baseFileAttributes.wordCount = token.length;
						                for(var pair of taggerJSON){
						                  if(pair[1] == "NN" || pair[1] == "NNP" || pair[1] == "NNPS"){
						                    baseFileAttributes.nounCount++;
						                  } else if(pair[1] == "VB" || pair[1] == "VBD" || pair[1] == "VBG" || pair[1] == "VBN" || pair[1] == "VBP" || pair[1] == "VBZ"){
						                    baseFileAttributes.verbCount++;
						                  } else if(pair[1] == "JJ" || pair[1] == "JJR" || pair[1] == "JJS"){
						                    baseFileAttributes.adjCount++;
						                  }
						                }
						                break;
						    case 1 :targetText = text;
						              targetFileAttributes.wordCount = tokenText.length;
						              for(var pair of taggerJSON){
						                if(pair[1] == "NN" || pair[1] == "NNP" || pair[1] == "NNPS"){
						                  targetFileAttributes.nounCount++;
						                } else if(pair[1] == "VB" || pair[1] == "VBD" || pair[1] == "VBG" || pair[1] == "VBN" || pair[1] == "VBP" || pair[1] == "VBZ"){
						                  targetFileAttributes.verbCount++;
						                } else if(pair[1] == "JJ" || pair[1] == "JJR" || pair[1] == "JJS"){
						                  targetFileAttributes.adjCount++;
						                }
						              }
						              break;
						    }
						    if(targetFileAttributes.length == 0)
						    	reject();
						else
						resolve();
					});
				}				
			}
		});
	});
}
/* end of promise function */

function generateResult() {
var points = 100;
  
  // reject file if the number of words are not within specific range
  if(targetFileAttributes.wordCount < 1500 || targetFileAttributes.wordCount > 3500){
    result.status = "Rejected";
    result.remarks="Word limit is out of range!";
  } else{
      result.status = "Accepted";

      // compare both text and find the similarity
      var similarity = parseInt((natural.JaroWinklerDistance(baseText,targetText))*100);
      console.log("\nSimilarity: "+(similarity)+"%");
      result.similarity = similarity;

      // calculate points for nouns
      var baseVal = (5/100)*nounLenBase;
      if(!((nounLenTar <= (nounLenBase+baseVal)) && (nounLenTar >= (nounLenBase-baseVal)))){
        if(nounLenTar >= (nounLenBase-baseVal))
          points -= (nounLenBase-nounLenTar);
        else {
            points += (nounLenBase-nounLenTar);
          }
      }

      // calculate points for adjectives
      baseVal = (5/100)*adjLenBase;
      if(!((adjLenTar <= (adjLenBase+baseVal)) && (adjLenTar >= (adjLenBase-baseVal)))){
        if(adjLenTar >= (adjLenBase-baseVal)){
          points -= (adjLenBase-adjLenTar);
        }
        else{
          points += (adjLenBase-adjLenTar);
        }
      }

      // calculate points for verbs
      baseVal = (5/100)*verbLenBase;
      if(!((verbLenTar < (verbLenBase+baseVal)) && (verbLenTar > (verbLenBase-baseVal)))){
        if(verbLenTar > (verbLenBase-baseVal))
          points += (verbLenBase-verbLenTar);
        else
          points -= (verbLenBase-verbLenTar);
      }

      console.log("Points: "+(points+similarity)/2);
	    // result.points = (points+similarity*100)/4;
      result.points = (points+similarity)/2;
      // give remarks based on points calculated
      if(result.points > 75 && result.points < 100){
        result.remarks="Document seems good";
      } else if(((points+similarity*100)/4) < 75){
          result.remarks="You can write a better document";
      } else {
          result.remarks="Document seems to be good but requires some updations to be made";
      }
  }
 }
/* function to create json object */
var createOutput = function() {
	
	let json = JSON.stringify(data,null,2);
	fs.writeFile("data.json",json,"utf8",(err)=>{
		if(err)
			console.log(err);
		else {
			console.log("Success in writing JSON");
		}
	})
}
/* end of createOutput function */

/* calling functions start of program */
readFile("./assests/HTML.txt").then(function(result){ // base file
	console.log("Base file:" + wordCount[index]);
	index = 1;
	return readFile("./assets/demo.txt"); // target file
}).then(function(result){
	console.log("Target file:" + wordCount[index]);
	index = 2;
	return readFile("./assets/dictionary.txt");
}).then(function(result){
	return generateResult();
}).then(function(){
	return createOutput();
}).then(function(){
	console.log(data);
}).catch(function(error){
	console.log(error);
});