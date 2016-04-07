# Example Project: Unscramble sentence using a dictionary of possible words
## How is sentence scrambled?

```
let dict = ['London','Paris','Berlin'];
let shuffledSentence = dict.map(word => shuffle(word.split('')));
let finalSentence = shuffledSentence.join('');
```

Shuffle is a helper function to return the input array in random order
```
/* return shuffled array with random order */
function shuffle(array) {
  return array.sort(function() { return 0.5 - Math.random() });
}
```

## How to run the project?

```
node ./unscrambleSentence
```
