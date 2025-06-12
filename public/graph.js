export class GraphSimple {
    constructor() {
        this.adjList = new Map();
    }

    addEdge(u, v, w) {
        if (!this.adjList.has(u)) this.adjList.set(u, []);
        if (!this.adjList.has(v)) this.adjList.set(v, []);
        this.adjList.get(u).push({ node: v, weight: w });
        this.adjList.get(v).push({ node: u, weight: w }); // Bidireccional
    }

    getAdjList() {
        return this.adjList;
    }

}
