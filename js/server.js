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
  name:"HTML.txt",
  wordCount: 0,
  nounCount: 0,
  verbCount: 0,
  adjCount: 0,
};

var targetFileAttributes = {
  name:"demo.txt",
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
var wordCountTar = 0, nounLenTar = 0, adjLenTar = 0, verbLenTar = 0;
var isReady = false;
var taskCount = 0;
var index = 0 ;

var basetoken, targettoken;

var baseFileRead= fs.readFileSync("../assets/HTML.txt",  'utf-8');
 basetoken = tokenizer.tokenize(baseFileRead);
 
   // get tagger pairs from array
              var taggerJSON=tagger.tag(basetoken);
               baseText = baseFileRead;
                            baseFileAttributes.wordCount = basetoken.length;
                            for(var pair of taggerJSON){
                              if(pair[1] == "NN" || pair[1] == "NNP" || pair[1] == "NNPS"){
                                baseFileAttributes.nounCount++;
                              } else if(pair[1] == "VB" || pair[1] == "VBD" || pair[1] == "VBG" || pair[1] == "VBN" || pair[1] == "VBP" || pair[1] == "VBZ"){
                                baseFileAttributes.verbCount++;
                              } else if(pair[1] == "JJ" || pair[1] == "JJR" || pair[1] == "JJS"){
                                baseFileAttributes.adjCount++;
                              }
                            }
                          

var targetFileRead = fs.readFileSync("../assets/demo.txt",  'utf-8');
  targettoken = tokenizer.tokenize(targetFileRead);
 
            // get tagger pairs from array
              var taggerJSON=tagger.tag(targettoken);

              // save text for global function use
              targetText = targetFileRead;
                          targetFileAttributes.wordCount = targettoken.length;
                          for(var pair of taggerJSON){
                            if(pair[1] == "NN" || pair[1] == "NNP" || pair[1] == "NNPS"){
                              targetFileAttributes.nounCount++;
                            } else if(pair[1] == "VB" || pair[1] == "VBD" || pair[1] == "VBG" || pair[1] == "VBN" || pair[1] == "VBP" || pair[1] == "VBZ"){
                              targetFileAttributes.verbCount++;
                            } else if(pair[1] == "JJ" || pair[1] == "JJR" || pair[1] == "JJS"){
                              targetFileAttributes.adjCount++;
                            }
                          }


//generating result

var points = 100;
  
  // reject file if the number of words are not within specific range
  if(targetFileAttributes.wordCount < 1000 || targetFileAttributes.wordCount > 2500){
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
        result.remarks="good";
      } else if(((points+similarity*100)/4) < 75){
          result.remarks="can be better";
      } else {
          result.remarks="not worth it";
      }
  }
/* function to create json object */

let data = {output:[baseFileAttributes, targetFileAttributes, result]};
  let json = JSON.stringify(data,null,2);
  fs.writeFile("../data.json",json,"utf8",(err)=>{
    if(err)
      console.log(err);
    else {
      console.log("Success in writing JSON");
    }
  })
/* end of createOutput function */
