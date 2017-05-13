define(function() {
    /**
     * [[1,...],[2,...]].merge()
     *      Merge an array of sorted arrays.
     *
     * [1,...].merge([2,...],...)
     *      Merge a sorted array with other sorted arrays.
     *
     * Does not modify its arguments - the returned array is a new reference.
     */
    Array.prototype.merge = Array.prototype.merge || function () {
            var args = Array.prototype.slice.call(arguments,0),
                arrays = ( args.length > 0 ?  [this].extend(args) : this )
                    .filter(function(e) { return e.length > 0 });

            if (0 === arrays.length) { return arrays }
            if (1 === arrays.length) { return arrays[0] }

            var count = arrays.length,
                length = arrays.map(function (a) {
                    return a.length;
                }).reduce(function (a,b) {
                    return a + b;
                }),
                merged = new Array(length),
                cmp = function (a,b) {
                    return a.array[a.index] < b.array[b.index];
                },
                idxs = arrays
                    .map(function(a) { return {array: a, index: 0} })
                    .heapify(cmp);

            for (var i = 0; i < length; i++) {
                merged[i] = idxs[0].array[(idxs[0].index)++];
                if (idxs[0].index >= idxs[0].array.length) {
                    idxs[0] = idxs.pop();
                }
                downHeap.call(idxs,0,cmp);
            }

            return merged;
        };

    /**
     * In-place swap of values at the indices.
     */
    Array.prototype.swap = Array.prototype.swap || function (a, b) {
            rangeCheck("a", a, this.length - 1);
            rangeCheck("b", b, this.length - 1);

            var tmp = this[a];
            this[a] = this[b];
            this[b] = tmp;
            return this;
        };

    function rangeCheck(which, index, max) {
        if (index < 0) {
            throw new RangeError("Index [" + which + "] < 0: " + index);
        }

        if (index > max) {
            throw new RangeError("Index [" + which + "] > " + max + ": " + index);
        }
    }

    /**
     * In-place conversion to make this array satisfy the heap property.
     *
     * The optional comparator should return true if the first argument should be
     * the parent of the second argument and false otherwise. (Return whether the
     * two elements should be swapped.)
     */
    Array.prototype.heapify = Array.prototype.heapify || function (cmp) {
            if ('function' !== typeof cmp) {
                cmp = function(a,b) { return a < b };
            }
            for (var i = Math.floor(this.length/2); i >= 0; i--) {
                downHeap.call(this,i,cmp);
            }
            return this;
        };

    /**
     * Make the heap satisfy the heap property from this index down. Both arguments
     * are required. The comparator is the same as the comparator from
     * Array.prototype.heapify/1.
     */
    function downHeap(i,cmp) {
            var least = i,
                left = 2*i + 1,
                right = 2*i + 2;

            if (left < this.length && cmp(this[left],this[least])) {
                least = left;
            }
            if (right < this.length && cmp(this[right],this[least])) {
                least = right;
            }
            if (least !== i) {
                this.swap(i,least);
                downHeap.call(this,least,cmp);
            }
            return this;
        };

    /**
     * Subtract an ordered set (sorted array) from this ordered set. Does not
     * modify its arguments - the returned array is a new reference.
     */
    Array.prototype.subtract = Array.prototype.subtract || function (list) {
            // TODO: Handle duplicate elements
            var len = this.length,
                ret = [],
                j = 0;

            for (var i = 0; i < len; i++) {
                if (this[i] === list[j]) { continue; }
                if (this[i] > list[j]) { i--; j++; continue; }
                ret.push(this[i]);
            }

            return ret;
        };

    /**
     * Convenience wrapper.
     */
    Array.prototype.extend = Array.prototype.extend || function () {
            return this.concat.apply(this,Array.prototype.slice.call(arguments,0));
        };

    /**
     * Exactly what it says on the tin. Returns the index of the element or
     * `false` if the element is not found.
     */
    Array.prototype.binarySearch = Array.prototype.binarySearch || function (element) {
            var min = 0,
                max = this.length,
                mid = Math.floor((min+max)/2);

            if (element === this[min]) {
                return min;
            }

            while(min < mid) {
                if (element === this[mid]) {
                    return mid;
                }
                if (element < this[mid]) {
                    max = mid;
                } else {
                    min = mid;
                }
                mid = Math.floor((min+max)/2);
            }
            return false;
        };

    /**
     * Exactly what it says on the tin. The underlying array is not modified - the
     * returned array is a new reference.
     */
    Array.prototype.mergeSort = Array.prototype.mergeSort || function () {
            var len = this.length;
            if (2 > len) { return this; }
            return this.slice(0,len/2).mergeSort().merge(this.slice(len/2).mergeSort());
        };

    return Array;
});
