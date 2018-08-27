/* 快速排序 */
const arr = [72, 6, 57, 88, 60, 42, 83, 73, 48, 85];

function swap(arr, index1, index2) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}

function partition(arr, start, end) {
    const len = arr.length;
    if (!arr || len === 0 || start < 0 || end > len - 1) {
        return;
    }
    const val = arr[end];
    let small = start - 1;
    for (let index = start; index < end; index++) {
        if (arr[index] < val) {
            small++;
            if (index !== small) {
                swap(arr, small, index);
            }
        }
    }
    small++;
    swap(arr, small, end);
    console.log(arr);
    return small;
}

function quickSort(arr, start, end) {
    if (start >= end) {
        return;
    }
    const index = partition(arr, start, end);
    quickSort(arr, start, index -1);
    quickSort(arr, index + 1, end);
}

// quickSort(arr, 0, arr.length-1);

/* 
    冒泡排序
*/

function bubbleSort(arr) {
    if (!arr || arr.length <= 1) {
        return;
    }
    for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                const _temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = _temp;
            }
        }
    }
}

/* 
    如果某一轮没有交换的话，就证明数组已经是有序的了 
*/
function bubbleSortPlus1(arr) {
    if (!arr || arr.length <= 1) {
        return;
    }
    let sortBorder = arr.length - 1,
        lastExchangeIndex = 0;
    for (let i = 0, len = arr.length; i < len; i++) {
        let isSwap = false;
        for (let j = 0; j < sortBorder; j++) {
            if (arr[j] > arr[j + 1]) {
                const _temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = _temp;
                isSwap = true;
                lastExchangeIndex = j;
            }
        }
        sortBorder = lastExchangeIndex;
        if (!isSwap) {
            break;
        }
    }
}

bubbleSort(arr);
console.log(arr);