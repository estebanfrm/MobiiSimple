// public/main.js
import { GraphSimple } from './graph.js';

const graph = new GraphSimple();

const edges = [
    [0, 1, 5],
    [0, 2, 2],
    [1, 2, 8],
    [1, 3, 3],
    [2, 3, 1],
    [2, 4, 4],
    [3, 4, 6],
    [3, 5, 7],
    [4, 5, 2]
];

edges.forEach(([u, v, w]) => graph.addEdge(u, v, w));

console.log("Grafo cargado:", graph.getAdjList());
