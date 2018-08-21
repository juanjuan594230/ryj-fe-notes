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

// console.log(ReplaceBlank(str1));

/* 
    给定一个英文句子，每个单词之间由一个或者多个空格隔开，请反转句子中单词顺序（包含空格），但不翻转单词内的字符。
    eg: www google com   ->   com google www
*/