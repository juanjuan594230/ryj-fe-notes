/* JS执行机制-事件循环（event-loop） */

/* eg1：写下下一段程序的执行结果 */
/* setTimeout(function(){
  console.log('定时器开始啦')
});

new Promise(function(resolve){
  console.log('马上执行for循环啦');
  for(var i = 0; i < 10000; i++){
      i == 99 && resolve();
  }
}).then(function(){
  console.log('执行then函数啦')
});

console.log('代码执行结束'); */

/* 
  执行结果：
  马上执行for循环啦
  代码执行结束
  执行then函数啦
  定时器开始啦
*/


/* setTimeout */
/* const task = function() {
  console.log('callback exec');
}

setTimeout(() => {
  task()
},3000)

for (let i = 0; i < 100; i++) {
  console.log(i);
} */


/* 宏任务 & 微任务 */
// 1,7,6,8,2,4,9,11,3,10,5,12
/* console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
}) */


