const fs = require('fs');

const thunk = function(pathName, codeType) {
  return function(callback) {
    fs.readFile(pathName, codeType, callback);
  }
}

// const readFileChunk = thunk('')

function* gen() {
  const f1 = yield thunk('./index.js');
  console.log(f1);
  const f2 = yield thunk('./README.md');
  console.log(f2);
}

/* const g = gen();

g.next().value((err, data1) => {
  g.next(data1).value((err, data2) => {
    g.next(data2);
  });
}) */

// 自驱动流程
function co(generator) {
  const g = generator();
  function next(err, data) {
    const result = g.next(data);
    if (result.done) {
      return;
    }
    result.value(next);
  }
  next();
}

co(gen);