function binarySearch(arr, val) {
    if (!arr || arr.length === 0 || typeof val !== 'number') {
        return -1;
    }
    let startIndex = 0,
        endIndex = arr.length - 1;
    while (startIndex <= endIndex) {
        const midIndex = Math.floor((startIndex + endIndex) / 2);
        const midVal = arr[midIndex];
        if (midVal > val) {
            endIndex = midIndex - 1;
        } else if (midVal < val) {
            startIndex = midIndex + 1;
        } else {
            return midIndex;
        }
    }
    return -1;
}

/* 改进：数组中可能有重复的元素，如果有重复元素，则返回最小的index */
function binarySearch_plus(arr, val) {
    let minIndex = -1;
    if (!arr || arr.length === 0 || typeof val !== 'number') {
        return minIndex;
    }
    let startIndex = 0,
        endIndex = arr.length - 1;
    while (startIndex <= endIndex) {
        const midIndex = Math.floor((startIndex + endIndex) / 2);
        const midVal = arr[midIndex];
        if (midVal > val) {
            endIndex = midIndex - 1;
        } else if (midVal < val) {
            startIndex = midIndex + 1;
        } else {
            minIndex = midIndex;
            endIndex = midIndex - 1;
        }
    }
    return minIndex;
}

module.exports = {
    binarySearch,
    binarySearch_plus
}