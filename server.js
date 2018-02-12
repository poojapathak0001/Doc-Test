/* required libraries */
var textract = require("textract");
var Wordpos = require("wordpos");
var natural = require("natural");
var fs = require("fs");
var tokenizer = new natural.WordTokenizer();
wordpos = new Wordpos();

/* global variables */
var noun = [], wordCount = [], spell = [], incorrect = [];
var index = 0 , wordPer , nounPer, token, obj, spellMist, remark, i = 0;

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
					wordCount[index] = token.length;
					wordpos.getNouns(text,function(res)	{
						noun[index] = new Set(res);
						console.log("Total nouns: "+noun[index].size);
						if(index == 1 && wordCount[1] < 1500 && wordCount[1] > 3500) {
							reject("Word count not in range.");		
							remark = "Word count not in range!"	
						}
						else
							remark = "Word count acceptable."
						resolve();
					});
				}				
			}
		});
	});
}
/* end of promise function */

/* function to calculate ratios */
let calRatio = function() {
	wordPer = (wordCount[1]/wordCount[0])*100;
	nounPer = (noun[1].size/noun[0].size)*100;
}
/* end of calRatio function */

/* function to check spellings and find incorrect words */
let spellCheck = function() {
	let wrong = 0;
	var spellcheck = new natural.Spellcheck(spell);
	token.map(function(word){
		if(!spellcheck.isCorrect(word)) {
			wrong += 1;
			incorrect[i++] = word;
		}
	});
	spellMist = (wrong/token.length)*100;
	console.log(wrong);
}
/* end of spellCheck function */

/* function to create json object */
var createOutput = function() {
	obj={
			output : {
				baseWC : wordCount[0],
				targetWC : wordCount[1],
				wc_ratio : wordPer,
				remarks : remark,

				baseNouns : noun[0].size,
				targetNouns : noun[1].size,
				nouns_ratio : nounPer,

				spelling_mistakes : spellMist,
				incorrect_words : incorrect
		}
	};
	let json = JSON.stringify(obj,null,2);
	fs.writeFile("data.json",json,"utf8",(err)=>{
		if(err)
			console.log(err);
		else {
			console.log("Success in writing JSON");
		}
	})
}
/* end of createOutput function */

/* calling functions */
readFile("demo.docx").then(function(result){ // base file
	console.log("Base file:" + wordCount[index]);
	index = 1;
	return readFile("demo.docx"); // target file
}).then(function(result){
	console.log("Target file:" + wordCount[index]);
	index = 2;
	return readFile("dictionary.txt");
}).then(function(result){
	calRatio();
	return spellCheck();
}).then(function(){
	console.log("Wrong Words: "+spellMist);
	return createOutput();
}).then(function(){
	console.log(obj);
}).catch(function(error){
	console.log(error);
});