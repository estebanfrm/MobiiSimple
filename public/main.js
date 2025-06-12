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

let origin = null;
let destination = null;

document.querySelectorAll('.node').forEach(node => {
    node.addEventListener('click', () => {
        const id = parseInt(node.dataset.id);

        if (origin === null) {
            origin = id;
            node.classList.add('origin');
        } else if (destination === null && id !== origin) {
            destination = id;
            node.classList.add('destination');
            console.log(`Origen: ${origin}, Destino: ${destination}`);
        } else {
            // Reiniciar selección
            document.querySelectorAll('.node').forEach(n => {
                n.classList.remove('origin', 'destination');
            });
            origin = id;
            destination = null;
            node.classList.add('origin');
            
        }
        document.getElementById("selected-nodes").textContent = `Origen: ${origin} | Destino: ${destination}`;

    });
});
