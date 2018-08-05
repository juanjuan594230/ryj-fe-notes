class LinkList {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }

    reverse() {
        let head = this;
        if (!head || !head.next) {
            return head;
        }
        let previousNode = null,
              nextNode = null;
        while (head) {
            nextNode = head.next;
            head.next = previousNode;
            previousNode = head;
            head = nextNode;
        }
        return previousNode;
    }
}

module.exports = LinkList;