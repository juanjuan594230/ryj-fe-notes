# fiber

> Its headline feature is incremental rendering

主要能力: 增量渲染。一种将渲染工作划分为多个块，并将其散发到多个帧中的能力。
其他能力：随着更新的到来，暂停、中止、重用 work；为不同类型的更新分配优先级；==新的并发原语==

**reconciliation** 一种算法，react用来将一棵树与另一颗树做diff，来确定哪一部分需要更新。

**update** 渲染react应用的数据发生了变化。通常是setState的结果，导致了重新渲染。

每次改变就重新渲染整个APP，就性能而言，是非常昂贵的。react做了优化，在保持出色性能的同时，创建整个应用程序重新呈现的外观。这一过程叫做reconciliation（协调）

react中协调与渲染时相互独立的两部分。协调器负责计算出tree中改变的部分，渲染器利用这些信息去完成渲染。

协调器：react core
渲染器：reactDOM reactNative

`Fiber`重新实现了协调器。

调度：确定合适执行work的过程
work：任何必须被执行的计算，通常是更新的结果

## what is a fiber

`fiber`的主要目标是让`react`可以利用调度。

- 暂停work，并在之后可以继续
- 不同类型的work，可以设置优先级
- 重用之前已经完成的工作 ？
- 中止work

为了实现上述功能，需要一种方式，可以将work分解为多个执行单元，从某种意义上来说，这就是`fiber`。`fiber`代表work的一个单元。

`requestIdleCallback` requestIdleCallback will schedule work when there is free time at the end of a frame, or when the user is inactive. 低优先级任务 闲置期执行
`requestAnimationFrame` 高优先级任务 下一个动画帧执行。

为了使用以上API，需要一种方式来讲渲染工作分解为增量单元。如果我们可以定制调用堆栈的行为来优化UI渲染，是不是很好呢？如果可以随意中断调用堆栈，并手动操作调用堆栈？