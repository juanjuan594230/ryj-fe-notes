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

interface RouteRecord: {
    path: string,
    regex: RouteRegExp,
    components: Dictionary<any>,
    instances: Dictionary<any>,
    parent: ?RouteRecord,
    redirect: ?RedirectOption,
    matchAs: ?string,
    beforeEnter: ?NavigationGuard,
    meta: any,
    props: boolean | Object | Function | Dictionary<boolean | Object | Function>
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
    // pathList: Array<string>
    // pathMap: Dictionary<RouteRecord>
    // nameMap: Dictionary<RouteRecord>
    const { pathList, pathMap, nameMap } = createRouteMap(routes);

    // find route record and createRoute
    function match() {}

    function addRoutes(routes) {}

    return {
        match,
        addRoutes
    }
}
```

### createRouteMap

生成路由映射表 `pathList` `pathMap` `nameMap`

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

// 1 生成record
// 2 遍历route.children 递归调用addRouteRecord 生成chidRouteRecord
// 3 添加到pathList pathMap
// 4 route.alias 为别名生成aliasRouteRecord
// 5 添加到nameMap
function addRouteRecord(
    pathList?: Array<string>,
    pathMap?: Dictionary<RouteRecord>,
    nameMap?: Dictionary<RouteRecord>,
    route: RouteConfig,
    parent?: RouteRecord, // iterate route.children 会传入 parent
    matchAs?: string // 是否匹配到别名 route.alias存在，为aliasRoute生成record时，会传入该参数
) {
    const { name, path } = route;
    const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict); // pathToRegexpOptions = route.pathToRegexpOptions || {}

    // regex components props ???
    const record: RouteRecord = {
        path: normalizedPath,
        regex: compileRouteRegex(normalizedPath, pathToRegexOptions), // ??? Turn a path string such as /user/:name into a regular expression
        components: route.components || { default: route.component}, // ??? components: { key: value } 若值传入了component 则key为default
        instances: {},
        name,
        parent,
        matchAs,
        redirect: route.redirect,
        beforeEnter: route.beforeEnter,
        meta: route.meta || {},
        props:
            route.props === null
                ? {}
                : route.components
                    ? route.props
                    : { default: route.props } // ???

    }

    // loop route.children generate routeRecord
    if (route.children) {
        const childMatchAs = matchAs ? cleanPath(`${matchAs}/${child.path}`) : undefined; // aliasRoute -> addRouteRecord child path拼接
        route.children.forEach(child => {
            addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs); // record 为 当前 childRouteRecord 的 parent
        });
    }

    // 将生成的record 添加到pathList pathMap nameMap
    if (!pathMap[record.path]) {
        pathList.push(record);
        pathMap[record.path] = record;
    }

    // route.alias 设置了别名
    if (route.alias) {
        const aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
        for (let i = 0; i < aliases.length; i++) {
            const alias = aliases[i];
            const aliasRoute = {
                path: alias,
                children: route.children
            };
            addRouteRecord(pathList, pathMap, nameMap, aliasRoute, record.path || '/');
        }
    }

    if (name) {
        if (!nameMap[name]) {
            nameMap[name] = record;
        } else {
            warn('Duplicate named routes definition'); // 包含了重复的name
        }
    }
}
```

### match

**find route record and create route**

```javascript
// 类型定义
interface RawLocation = string | Location;
interface Location: {
    _normalized?: boolean,
    name?: string,
    path?: string,
    hash?: string,
    query?: Dictionary<string>,
    params?: Dictionary<string>,
    append?: boolean,
    replace?: boolean
}
interface Route: {
    path: string;
    name: ?string;
    hash: string;
    query: Dictionary<string>;
    params: Dictionary<string>;
    fullPath: string;
    matched: Array<RouteRecord>;
    redirectedFrom?: string;
    meta?: any;
}

function match(
    raw: RawLocation,
    currentRoute?: Route,
    redirectFrom?: Location
):Route {
    // location格式化
    const location: Location = normalizeLocation(raw, currentRoute, false, router);
    const { name } = location.name;

    // find route record and create route
    if (name) { // 命名路由
        // 1 find route record
        const record = nameMap[name];
        // 2 location.params & location.path handle
        // 暂时先放下一下

        // 3 create route and return
        return _createRoute(record, location, redirectFrom);
    } else if (location.path) { // 非命名路由
        location.params = {};
        for (let i = 0; i < PathList.length; i++) { // 顺序遍历pathList find record
            const path = pathList[i];
            const record = pathMap[path];
            if (matchRoute(record.regex, location.path, location.params)) { // 匹配record
                return _createRoute(record, location, redirectFrom);
            }
        }
    }
    return _createRoute(null, location);

}

// create route
function _createRoute(
    record: ?RouteRecord,
    location: Location,
    redirectFrom?: Location
):Route {
    if (record && record.redirect) { return redirect()} // redirect
    if (record && record.alias) { return alias()} // alias
    return createRoute(record, location, redirectFrom, router);
}

function createRoute(
    record: ?RouteRecord,
    location: Location,
    redirectFrom?: Location,
    router?: VueRouter
):Route {
    const stringifyQuery = router && router.options.stringifyQuery
    let query: any = location.query || {}

    const route: Route = {
        name: location.name || (record && record.name),
        meta: (record && record.meta) || {},
        path: location.path || '/',
        hash: location.hash || '',
        query,
        params: location.params || {},
        fullPath: getFullPath(location, stringifyQuery),
        matched: record ? formatMatch(record) : [] // important 通过record，循环向上找parentRecord， 所有匹配到的record都将push到数组中（matched）
    }

    if (redirectedFrom) {
        route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
    }
    // Object.freeze()冻结对象，冻结的对象不能被修改，原型对象也不能被修改
    return Object.freeze(route);
}
```

