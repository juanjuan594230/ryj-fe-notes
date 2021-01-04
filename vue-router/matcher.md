# Matcher

## RouteConfig

```javascript
interface RouteConfig: {
    path: string,
    name?: string,
    component?: any,
    components?: Dictionary<any>,
    redirect?: RedirectOption,
    alias?: string | Array<string>,
    children?: Array<RouteConfig>,
    beforeEnter?: NavigationGuard,
    meta?: any,
    props: boolean | Object | Function,
    caseSensitive?: boolean,
    pathToRegexpOptions?: PathToRegexpOptions
}
```

## Class Matcher

- 生成路由映射表
- 匹配路由
- 添加路由

```javascript
class VueRouter {
    constructor(options) {
        // ...
        this.matcher = createMatcher(options.routes, this);
        // ...
    }
}
function createMatcher(routes, router) {
    // create路由映射表 闭包中变量
    const { pathList, pathMap, nameMap } = createRouteMap(routes);

    function match() {}

    function addRoutes(routes) {}

    return {
        match,
        addRoutes
    }
}
```

### createRouteMap

生成路由映射表

```javascript
// new VueRouter instance: 只有routes一个参数
// addRoutes: 动态添加路由时，其他三个参数也会传入
function createRouteMap(
    routes,
    oldPathList?: Array<string>,
    oldPathMap?: Dictionary<RouteRecord>,
    oldNameMap?: Dictionary<RouteRecord>
) {
    // variable definition
    const pathList: Array<string> = oldPathList || [];
    const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null);
    const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null);

    // loop routes execute addRouteRecord
    routes.forEach(route => {
        addRouteRecord(pathList, pathMap, nameMap, route);
    })

    return {
        pathList,
        pathMap,
        nameMap
    }
}

function addRouteRecord(
    pathList?: Array<string>,
    pathMap?: Dictionary<RouteRecord>,
    nameMap?: Dictionary<RouteRecord>,
    route: RouteConfig,
    parent?: RouteRecord, // iterate route.children 会传入 parent
    matchAs?: string // 是否匹配到别名
) {

}
```