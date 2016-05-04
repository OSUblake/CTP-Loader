namespace CTP.utils {

    const module = getModule();

    export interface IListNode {
        prev: IListNode;
        next: IListNode;
    }

    export class LinkedList {
        
        add  = this.append; // Alias
        size = 0;

        first: IListNode;
        last:  IListNode;
        next:  IListNode;
        prev:  IListNode;
        
        constructor() {

        }

        get isEmpty() { return !this.size && !this.first && !this.last; }

        static fromArray(array: any[]): LinkedList {

            var list = new LinkedList();
            var size = array.length;

            while (size--) {
                list.prepend(array[size]);
            }

            return list;
        }

        clear(): this {

            this.size  = 0;
            this.first = null;
            this.last  = null;
            this.next  = null;
            this.prev  = null;

            return this;
        }

        get(i: number): IListNode {

            if (this.isEmpty) return null;

            var node = this.first;
            var size = i % this.size;

            while (size--) node = node.next;

            return node;
        }

        random(): IListNode {
            var n = Math.random() * this.size >> 0;
            return this.get(n);
        }

        toArray(): Array<IListNode> {

            var array = [];
            var node  = this.first;
            var size  = this.size;

            while (size--) {
                array.push(node);
                node = node.next;
            }

            return array;
        }

        forEach(callback: Function, scope?: any) {

            var node = this.first;
            var size = this.size;

            for (var i = 0; i < size; i++) {
                callback.call(scope, node, i);
                node = node.next;
            }
        }

        append(node: IListNode): IListNode {

            if (this.first === null) {

                node.prev  = node;
                node.next  = node;
                this.first = node;
                this.last  = node;
                this.next  = node;

            } else {

                node.prev = this.last;
                node.next = this.first;

                this.last.next = node;
                this.last      = node;
            }

            this.size++;

            return node;
        }

        prepend(node: IListNode): IListNode {

            if (this.first === null) {

                return this.append(node);

            } else {

                node.prev = this.last;
                node.next = this.first;

                this.first.prev = node;
                this.last.next  = node;
                this.first      = node;
            }

            this.size++;

            return node;
        }

        remove(node: IListNode): IListNode {

            if (this.size > 1) {

                node.prev.next = node.next;
                node.next.prev = node.prev;

                if (node === this.first) this.first = node.next;
                if (node === this.last)  this.last = node.prev;

            } else {

                this.first = null;
                this.last  = null;
            }

            node.prev = null;
            node.next = null;

            this.size--;

            return node;
        }

        insertBefore(node: IListNode, newNode: IListNode): IListNode {

            newNode.prev   = node.prev;
            newNode.next   = node;
            node.prev.next = newNode;
            node.prev      = newNode;

            if (newNode.next === this.first) this.first = newNode;

            this.size++;

            return newNode;
        }

        insertAfter(node: IListNode, newNode: IListNode): IListNode {

            newNode.prev   = node;
            newNode.next   = node.next;
            node.next.prev = newNode;
            node.next      = newNode;

            if (newNode.prev === this.last) this.last = newNode;

            this.size++;

            return newNode;
        }
    }

    //module.service("LinkedList", LinkedList);
}