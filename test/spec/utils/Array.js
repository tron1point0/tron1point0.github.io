describe("Array", function() {
    beforeAll(function(done) {
        require(["utils/Array"], function() {
            done();
        });
    });

    describe("merge", function() {
        it("can merge nothing", function () {
            expect([].merge()).toEqual([]);
        });

        it("can merge an empty array into a populated array", function() {
            expect([1,2,3].merge([])).toEqual([1,2,3]);
        });

        it("can merge multiple empty arrays into a populated array", function() {
            expect([1,2,3].merge([], [])).toEqual([1,2,3]);
        });

        it("can merge multiple empty arrays into an empty array", function() {
            expect([].merge([], [])).toEqual([]);
        });

        it("can merge a populated array into another populated array", function() {
            expect([1,2,3].merge([2,3,4])).toEqual([1,2,2,3,3,4]);
        });

        it("can merge multiple populated arrays into a populated array", function() {
            expect([1,2,3].merge([2,3,4], [3,4,5])).toEqual([1,2,2,3,3,3,4,4,5]);
        });

        it("can merge multiple arrays into an empty array", function () {
            expect([].merge([1,2,3], [2,3,4], [3,4,5])).toEqual([1,2,2,3,3,3,4,4,5]);
        });

        it("preserves partial order when merging unsorted arrays of sortable elements", function() {
            expect([6,5,4].merge([1,2,3])).toEqual([1,2,3,6,5,4]);
        });

        it("preserves total order when merging unsorted arrays of unsortable elements", function() {
            var a = {v: 1},
                b = {v: 2},
                c = {v: 3},
                d = {v: 4},
                e = {v: 5},
                f = {v: 6};

            expect([b,c,a].merge([f,d,e])).toEqual([b,c,a,f,d,e])
        });
    });

    describe("swap", function () {
        var arr;

        beforeEach(function () {
            arr = [1,2,3];
        });

        it("can swap in place", function () {
            expect(arr.swap(0,2)).toBe(arr);
            expect(arr).toEqual([3,2,1]);
        });

        it("can swap with indices reversed", function() {
            expect(arr.swap(2,0)).toBe(arr);
            expect(arr).toEqual([3,2,1]);
        });

        it("throws an error when an index is too small", function () {
            expect(function() {
                arr.swap(-1,2)
            }).toThrowError(RangeError, "Index [a] < 0: -1");

            expect(arr).toEqual([1,2,3]);

            expect(function() {
                arr.swap(0,-1)
            }).toThrowError(RangeError, "Index [b] < 0: -1");

            expect(arr).toEqual([1,2,3]);
        });

        it("throws an error when an index is too large", function() {
            expect(function() {
                arr.swap(3,0)
            }).toThrowError(RangeError, "Index [a] > 2: 3");

            expect(arr).toEqual([1,2,3]);

            expect(function() {
                arr.swap(0,3)
            }).toThrowError(RangeError, "Index [b] > 2: 3");

            expect(arr).toEqual([1,2,3]);
        });
    });

    describe("heapify", function () {
        it("can create a heap from a sorted array", function() {
            var arr = [1,2,3,4,5,6];
            expect(arr.heapify()).toBe(arr);
            expect(arr).toEqual([1,2,3,4,5,6]);
        });

        it("can create a heap from a reverse sorted array", function() {
            var arr = [6,5,4,3,2,1];
            expect(arr.heapify()).toBe(arr);
            expect(arr).toEqual([1,2,4,3,5,6]);
        });

        it("can create a heap from an unsorted array", function() {
            var arr = [2,5,3,4,1,6];
            expect(arr.heapify()).toBe(arr);
            expect(arr).toEqual([1,2,3,4,5,6]);
        });

        it("can heapify with a comparator", function() {
            var a = {v: 1},
                b = {v: 2},
                c = {v: 3},
                d = {v: 4},
                e = {v: 5},
                f = {v: 6};

            var arr = [e,c,b,d,f,a];
            expect(arr.heapify(function(a,b) {
                return a.v < b.v;
            })).toBe(arr);
            expect(arr).toEqual([a,c,b,d,f,e]);
        });
    });

    describe("subtract", function () {
        it("does not modify the original array", function() {
            var arr = [1,2,3],
                ret = arr.subtract([2]);
            expect(ret).not.toBe(arr);
            expect(ret).toEqual([1,3]);
        });

        it("can subtract an empty array from a populated array", function() {
            expect([1,2,3].subtract([])).toEqual([1,2,3]);
        });

        it("can subtract a popluated array from an empty array", function() {
            expect([].subtract([1,2,3])).toEqual([]);
        });

        it("can subtract members that aren't present", function() {
            expect([1,2,3].subtract([-1,3,4])).toEqual([1,2]);
        });

        it("can subtract duplicate members", function() {
            pending("TODO in Array.js");
            expect([1,2,2,3].subtract([2])).toEqual([1,2,3]);
            expect([1,2,2,3].subtract([2,2])).toEqual([1,3]);
            expect([1,2,3].subtract([2,2])).toEqual([1,3]);
        });
    });

    describe("extend", function () {
        it("can extend with nothing", function() {
            expect([1,2,3].extend()).toEqual([1,2,3]);
        });

        it("can extend with an empty array", function() {
            expect([1,2,3].extend([])).toEqual([1,2,3]);
        });

        it("can extend with a populated array", function() {
            expect([1,2,3].extend([4,5,6])).toEqual([1,2,3,4,5,6]);
        });

        it("can extend with multiple populated arrays", function() {
            expect([1,2,3].extend([4], [5], [6])).toEqual([1,2,3,4,5,6]);
        });

        it("can extend with nested arrays", function() {
            expect([1,2,3].extend([[4], [5], [6]])).toEqual([1,2,3,[4],[5],[6]]);
        });
    });

    describe("binary search", function() {
        it("can search", function() {
            pending("TODO");
        });
    });

    describe("merge sort", function() {
        it("can sort", function() {
            pending("TODO");
        });
    });
});
