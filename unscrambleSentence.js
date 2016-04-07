"use strict";
try {
 var debug = require('debug')('worker');
}
catch (e) {
 //var debug = function() {console.log.apply(console,arguments)};
 var debug = function(){};
}

/* class Unscrambler
Tries to find a possible sentences
from a scrambled sentence (words are scrambeld and spaces removed)
using a dictionary of possible words */
class Unscrambler {
  /* construct hash table out of given dictionary */
  constructor(dict) {
    this.dictHashTable = this.initializeDict(dict);
  }

  /* return a hash of a word, which is not affected from scrambling */
  hashWord(word) {
    //sort by charaters, then we could count occurences
    let sorted = word.split('').sort();

    //instead of counting occurences, just join string back together
    //and compare them directly
    return sorted.join('');
  }

  /* initialize dict by generating a lookup */
  initializeDict(dict) {
    let dictHashTable = {};
    dict.forEach(word => {
      dictHashTable[this.hashWord(word)] = word;
    })
    return dictHashTable;
  }

  /* unscramble a word and return an array of all possible matches
    can also be used stand alone in order to find any scrambled word
    in a dictionary of possible words */
  unscrambleWord(scrambled) {
    let hash = this.hashWord(scrambled);
    if(hash in this.dictHashTable) {
      //always return array
      return [this.dictHashTable[hash]];
    } else {
      return [];
    }
  }

  /* unscramble an sentence and get all possible matches */
  unscrambleSentence(sentence) {
    //loop over all possible words with different lengths
    let possibleSentences = [];
    for(var i=1;i<=sentence.length;i++) {
      let word = sentence.substr(0,i);
      debug('try word: ',word);
      let possibleWords = this.unscrambleWord(word);
      possibleWords.forEach(word => {
        let endOfSentence = sentence.substr(i);
        //list of possible sentence ends
        let possibleSentenceEnds = this.unscrambleSentence(endOfSentence);
        debug('possible sentence ends are: ',possibleSentenceEnds);
        if(possibleSentenceEnds.length > 0) {
          possibleSentenceEnds.forEach(end => {
            //create new possible sentence out of word and possible ends
            possibleSentences.push([word].concat(end));
          })
        } else {
          possibleSentences.push([word]);
        }
      })
    }

    return possibleSentences;
  }
}

exports.Unscrambler = Unscrambler;


(function runTests() {
    var assert = require('assert');

    console.log('Run several tests');

    let dict = ['ja','jaja','nein','evtl'];
    let UnscramblerDefault = new Unscrambler(dict);
    assert.deepEqual(
      UnscramblerDefault.unscrambleSentence('jaja'),
      [['ja','ja'],['jaja']]
    );

    assert.deepEqual(
      UnscramblerDefault.unscrambleSentence('evtlnee'),
      [['evtl']]
    );

    assert.deepEqual(
      UnscramblerDefault.unscrambleSentence('iennaj'),
      [['nein','ja']]
    );

    assert.deepEqual(
      UnscramblerDefault.unscrambleSentence('ajjaaj'),
      [[ 'ja', 'ja', 'ja' ], [ 'ja', 'jaja' ], [ 'jaja', 'ja' ]]
    );

    /* return shuffled array with random order */
    function shuffle(array) {
      return array.sort(function() { return 0.5 - Math.random() });
    }
    /* return random shuffled sentence */
    function getRandomScrambledSentence(dict) {
      let words = shuffle(dict).slice(0,5);
      let scrambledWords = words.map(word => {
        //split word into charater array, shuffle them and put back together
        return shuffle(word.split('')).join('');
      }).join('');
      return [words,scrambledWords];
    }

    let dict_distinct = [
      'Rom','Wien','Lüneburg','München','Berlin','NY','LA','Beijing',
      'Sao Paolo','Mexico City','Amsterdam','Südafrika','Frankfurt',
      'Silicon Valley','Shanghay','Shenzen'
    ];
    //run some radom tests
    for(var i=0;i<100;i++) {
        let randSentence = getRandomScrambledSentence(dict_distinct);
        let results = new Unscrambler(dict_distinct).unscrambleSentence(randSentence[1])
        assert.deepEqual(results,[randSentence[0]]);
    }

    console.log('tests successful');
}());
