const words = ['c','d','f','f','e','g','g','g','l'];

// 手写代码，输入一个已排序的数组（如[a,c,f]至少两个不同字母），一个字符（如b, c），找出大于所给字符的最小字母，如果没有，则返回第一个字母
// 循环 o(n) o(1)
function gtX(arr, x) {
    for (const v of arr) {
        if (v > x) {
            return v;
        }
    }
    return arr[0];
}

console.log(gtX(words, 'i'));
console.log(gtX(words, 'o'));

// 二分
function gtX2(arr, x) {
    const len = arr.length;
    if (x > arr[len - 1]) {
        return arr[0];
    }
    let start = 0;
    let end = len - 1;
    while (start < end) {
        // let mid = Math.floor((end + start) / 2);
        let mid = Math.floor(start + (end - start) / 2);
        if (arr[mid] <= x) {
            start = mid + 1;
        } else if (arr[mid] > x) {
            end = mid;
        }
    }
    return arr[end];
}

console.log(gtX2(words, 'i'));
console.log(gtX2(words, 'o'));
console.log(gtX2(words, 'a'));
console.log(gtX2(words, 'c'));