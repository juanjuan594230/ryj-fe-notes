/* 
    输入数字n，打印从1到最大的n位数的十进制数，如n=3, 1-999
*/ 
function printToMaxOfNDigits_1(n) {
    if (typeof n !== 'number' || n <= 0) {
        return;
    }
    // 先求出n位数的最大数
    let maxNum = '';
    for (let i = 0; i < n; i++) {
        maxNum = maxNum + 9;
    }
    parseInt(maxNum);
    // 如果数越界了
    if (isFinite(maxNum)) {
        for (let i = 1; i <= maxNum; i++) {
            console.log(i);
        }
    } else {
        return '越界了';
    }
}

printToMaxOfNDigits_1(2);