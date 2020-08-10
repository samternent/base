<template>

</template>
<script>
// const letters = ‘abcdefghijklmnopqrstuvwxyz’;
// How many ways to decode the message
// given a mapping of letters (alphabet) to numbers (1-26)
// and a message, a number.
// How many combinations of messages could there be.

const testCase = 12;
const testCaseResult = 2;

const matchResults = (data, l, memo) => {
  if (!l) {
    return 1;
  }

  const index = data.length - l;
  if (data[l] === 0) {
    return 0;
  }

  if (memo[l]) {
    return memo[l];
  }

  let result = matchResults(data, l - 1, memo);
  if (l >= 2 && parseInt(data[l] + data[l + 1]) <= 26) {
    result += matchResults(data, l - 2, memo);
  }
  memo[l] = result;
  return result;
}

const decode = (data) => {
  const memo = [];
  const phrase = data.toString().split('');
  const results =  matchResults(phrase, phrase.length, memo);

  console.log(results);
  return results;
};

decode(testCase);




import { union, roots } from '@core/union-find.js'

let M = [
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
  [0,1,0,0,0,1,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,1,1,0,0],
  [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,1,1,0,0,1],
  [0,0,0,0,1,1,0,1,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
];

let i;
let j;
let table = {};

for (i = 0; i < M.length; i++) {
  for (j = 0; j < M.length; j++) {
    if (M[i][j]) {
      table = union(table, i, j)
    }
  }
}

</script>
