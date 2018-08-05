const subscribe = {
    topics: {},
    // 订阅
    subscribe(topic, callback) {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        this.topics[topic].push({
            callback
        });
    },
    // 发布
    publish(topic, args) {
        const callbacks = this.topics[topic];
        const _this = this;
        if (!callbacks || callbacks.length === 0) {
            return;
        }
        callbacks.forEach((item) => {
            item.callback(topic, args);
        });
    },
    // 取消订阅
    remove(topic, fn) {
        const callbacks = this.topics[topic];
        if (!callbacks || callbacks.length === 0) {
            return;
        }
        const index = callbacks.forEach((item, index) => {
            if (item.callback === fn) {
                return index;
            }
        });
        callbacks.splice(index, 1);
    }
}

module.exports = subscribe;