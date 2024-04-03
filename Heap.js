class Heap {
    constructor() {
        this.data = [];
        this.map = new Map();
    }

    add(item) {
        this.data.push(item);
        this.map.set(item, this.data.length - 1);
        this.upheapify(this.data.length - 1);
    }

    upheapify(ci) {
        const pi = Math.floor((ci - 1) / 2);
        if (this.isLarger(this.data[ci], this.data[pi]) > 0) {
            this.swap(pi, ci);
            this.upheapify(pi);
        }
    }

    swap(i, j) {
        const ith = this.data[i];
        const jth = this.data[j];

        this.data[i] = jth;
        this.data[j] = ith;
        this.map.set(ith, j);
        this.map.set(jth, i);
    }

    display() {
        console.log(this.data);
    }

    size() {
        return this.data.length;
    }

    isEmpty() {
        return this.size() === 0;
    }

    remove() {
        this.swap(0, this.data.length - 1);
        const rv = this.data.pop();
        this.downheapify(0);

        this.map.delete(rv);
        return rv;
    }

    downheapify(pi) {
        const lci = 2 * pi + 1;
        const rci = 2 * pi + 2;
        let mini = pi;

        if (lci < this.data.length && this.isLarger(this.data[lci], this.data[mini]) > 0) {
            mini = lci;
        }

        if (rci < this.data.length && this.isLarger(this.data[rci], this.data[mini]) > 0) {
            mini = rci;
        }

        if (mini !== pi) {
            this.swap(mini, pi);
            this.downheapify(mini);
        }
    }

    get() {
        return this.data[0];
    }

    isLarger(t, o) {
        return t > o ? 1 : t < o ? -1 : 0;
    }

    updatePriority(pair) {
        const index = this.map.get(pair);
        this.upheapify(index);
    }
}

module.exports = { Heap };