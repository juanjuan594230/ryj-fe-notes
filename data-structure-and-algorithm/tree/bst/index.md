# BST

## class

```javascript
class Node {
  constructor(val) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
class BST {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  size() {
    return this.size();
  }

  add(e) {
    this.root = this._add(this.root, e);
  }

  _add(node, e) {
    if (!node) {
      this.size++;
      return new Node(e);
    }
    if (node.val > e) {
      node.left = _add(node.left, e);
    } else {
      node.right = _add(node.right, e);
    }
    return node;
  }
}
```