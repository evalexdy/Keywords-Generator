function addToLog(logTxt) {
	jQuery('#log').css({display:'block'});
	jQuery('#log').html(jQuery('#log').html()+logTxt+'<br />');
}


function getKeywords(sourceText) {

addToLog('Start analyzing...');
addToLog('Start length is: '+sourceText.length);

var start = Date.now();
	
//1. Clear all styles in text
	sourceText = sourceText.replace(/<style([\s\S]*?)\/style>/ig, " ");
//2. Clear all scripts in text
	sourceText = sourceText.replace(/<script([\s\S]*?)\/script>/ig, " ");
//3. Clear all HTML tags in text
	sourceText = sourceText.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, " ");
//4. Clear all special characters in text
	sourceText = sourceText.replace(/&([\s\S]*?);/ig, " ");
//5. Clear all unnecessary symbols in text
	sourceText = sourceText.replace(/<!--([\s\S]*?)-->/ig, " "); //delete HTML comments
	sourceText=sourceText.replace(/[^a-zA-Zа-яА-Я\s]/g, " "); //clear all symbols except russian and latin characters
	sourceText=sourceText.replace(/\s+/g, ' '); //clear all repeated spaces
	sourceText=sourceText.replace(/^\s+/, ''); //clear space from left
	sourceText=sourceText.replace(/\s+$/, ''); //clear space from right
//6. Transform to lowercase
	sourceText=sourceText.toLowerCase();
	
addToLog('Cleared text length is: '+sourceText.length);
	
	txt=sourceText.split(' ');
	
addToLog('Number of words: '+txt.length);
	var wordsArray=[];
	var finalArray=[];

	for (key in txt) {
		if (txt[key].length>=5) {	//if word length more than 5 - let's work on it
//7. Calculate SOUNDEX number
			var SoundexNumber=soundex.calc(txt[key]);
//8. Working with SOUNDEX number
			if (typeof wordsArray[SoundexNumber]!="undefined"){
				//If we already have word with same SOUNDEX number in array - increase counter for this word
				wordsArray[SoundexNumber].count++;
				if(wordsArray[SoundexNumber].string.indexOf(txt[key])==-1&&wordsArray[SoundexNumber].word!=txt[key]){
					wordsArray[SoundexNumber].string.push(txt[key]);
				}
			} else {
				//If we have no word with same SOUNDEX number in array - adding it
				wordsArray[SoundexNumber]={'word':txt[key],'count':1,'string':[]};
			}
			
		}
	}
	txt='';
//9. Sort array by count of words
	for (key in wordsArray) {
		finalArray.push(wordsArray[key]);
	}
	finalArray.sort(function(obj1, obj2) {
		if (obj1.count == obj2.count) {return 0;}
		if (obj1.count > obj2.count) {return -1;} else {return 1;}
	});

//10. Generate keywords string
	keywords='';
	for (key in finalArray) {
addToLog(key+' <strong>'+finalArray[key].word+'</strong> ('+finalArray[key].count+')');
		if(finalArray[key].string.length>0) {
addToLog('  '+finalArray[key].string.join());
		}
		if (keywords!='') {keywords=keywords+',';}
		if ((keywords+finalArray[key].word).length>255) {
			break;
		} else {
			keywords=keywords+finalArray[key].word;
		}
		
	}
	keywords=keywords.replace(/,+$/, ''); //Remove unnecessary commas from right side
var stop = Date.now();
addToLog('Working time: '+(stop-start)+'ms');
	
	return keywords;
}
