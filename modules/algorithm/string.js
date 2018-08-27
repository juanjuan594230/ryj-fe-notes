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


/* 
    给定一个url和key，从该url中找出key对应的值
*/
const path = "https://www.panda.tv/login?a=134";
function getValue(path, key) {
    let value = '';
    if (!path || !key) {
        return value;
    }
    const startIndex = path.indexOf(`${key}=`);
    if (startIndex === -1) {
        return value;
    }
    const endIndex = path.indexOf('&', startIndex);
    const valueStart = startIndex + `${key}=`.length;
    if (endIndex === -1) {
        value = path.slice(valueStart);
    } else {
        value = path.slice(valueStart, endIndex);
    }
    return value;
}

// console.log(getValue(path, 'a'));

// 思路2: 正则表达式

function getValueReg(path, key) {
    let value = '';
    const str = '(^|&)' + key + '=([^&]*)(&|$)';
    const exp = new RegExp(str, 'i');
    const paramIndex = path.lastIndexOf('?');
    if (paramIndex === -1) {
        return value;
    }
    const params = path.slice(paramIndex + 1);
    const r = params.match(exp);
    console.log(r);
    if (r) {
        value = r[2];
    }
    return value
}

// console.log(getValueReg(path, 'a'));