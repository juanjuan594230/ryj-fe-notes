process.nextTick(() => {
    console.log('nextTick延迟执行1');
});

Promise.resolve().then(() => {
    console.log('promise延迟执行1');
});

Promise.resolve().then(() => {
    console.log('promise延迟执行2');
});

process.nextTick(() => {
    console.log('nextTick延迟执行2');
});

setImmediate(() => {
    console.log('immediate延迟')
})

// result
// nextTick延迟执行1
// nextTick延迟执行2
// promise延迟执行1
// promise延迟执行2
// immediate延迟