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

quickSort(arr, 0, arr.length-1);