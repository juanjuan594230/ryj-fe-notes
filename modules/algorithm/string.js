'use strict'

/* 实现一个函数，把字符串中的每个空格替换成“%20” */

const str1 = 'i am a confident girl.'

function ReplaceBlank(str) {
    if (!str || str === '') {
        return;
    }
    const _arr = str.split('');
    for (let i = 0, len = _arr.length; i < len; i++) {
        if (_arr[i] === ' ') {
            _arr[i] = '%20'
        }
    }
    return _arr.join('');
}

console.log(ReplaceBlank(str1));