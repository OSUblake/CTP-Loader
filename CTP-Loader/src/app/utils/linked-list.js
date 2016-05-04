var CTP;
(function (CTP) {
    var utils;
    (function (utils) {
        var module = utils.getModule();
        var LinkedList = (function () {
            function LinkedList() {
                this.add = this.append; // Alias
                this.size = 0;
            }
            Object.defineProperty(LinkedList.prototype, "isEmpty", {
                get: function () { return !this.size && !this.first && !this.last; },
                enumerable: true,
                configurable: true
            });
            LinkedList.fromArray = function (array) {
                var list = new LinkedList();
                var size = array.length;
                while (size--) {
                    list.prepend(array[size]);
                }
                return list;
            };
            LinkedList.prototype.clear = function () {
                this.size = 0;
                this.first = null;
                this.last = null;
                this.next = null;
                this.prev = null;
                return this;
            };
            LinkedList.prototype.get = function (i) {
                if (this.isEmpty)
                    return null;
                var node = this.first;
                var size = i % this.size;
                while (size--)
                    node = node.next;
                return node;
            };
            LinkedList.prototype.random = function () {
                var n = Math.random() * this.size >> 0;
                return this.get(n);
            };
            LinkedList.prototype.toArray = function () {
                var array = [];
                var node = this.first;
                var size = this.size;
                while (size--) {
                    array.push(node);
                    node = node.next;
                }
                return array;
            };
            LinkedList.prototype.forEach = function (callback, scope) {
                var node = this.first;
                var size = this.size;
                for (var i = 0; i < size; i++) {
                    callback.call(scope, node, i);
                    node = node.next;
                }
            };
            LinkedList.prototype.append = function (node) {
                if (this.first === null) {
                    node.prev = node;
                    node.next = node;
                    this.first = node;
                    this.last = node;
                    this.next = node;
                }
                else {
                    node.prev = this.last;
                    node.next = this.first;
                    this.last.next = node;
                    this.last = node;
                }
                this.size++;
                return node;
            };
            LinkedList.prototype.prepend = function (node) {
                if (this.first === null) {
                    return this.append(node);
                }
                else {
                    node.prev = this.last;
                    node.next = this.first;
                    this.first.prev = node;
                    this.last.next = node;
                    this.first = node;
                }
                this.size++;
                return node;
            };
            LinkedList.prototype.remove = function (node) {
                if (this.size > 1) {
                    node.prev.next = node.next;
                    node.next.prev = node.prev;
                    if (node === this.first)
                        this.first = node.next;
                    if (node === this.last)
                        this.last = node.prev;
                }
                else {
                    this.first = null;
                    this.last = null;
                }
                node.prev = null;
                node.next = null;
                this.size--;
                return node;
            };
            LinkedList.prototype.insertBefore = function (node, newNode) {
                newNode.prev = node.prev;
                newNode.next = node;
                node.prev.next = newNode;
                node.prev = newNode;
                if (newNode.next === this.first)
                    this.first = newNode;
                this.size++;
                return newNode;
            };
            LinkedList.prototype.insertAfter = function (node, newNode) {
                newNode.prev = node;
                newNode.next = node.next;
                node.next.prev = newNode;
                node.next = newNode;
                if (newNode.prev === this.last)
                    this.last = newNode;
                this.size++;
                return newNode;
            };
            return LinkedList;
        }());
        utils.LinkedList = LinkedList;
    })(utils = CTP.utils || (CTP.utils = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=linked-list.js.map