import { GraphSimple } from './graph.js'; //importar la clase del grafo

const graph = new GraphSimple();

const edges = [ // Definición de las aristas del grafo con peso
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

//agregamos las aristas al grafo
edges.forEach(([u, v, w]) => graph.addEdge(u, v, w));

console.log("Grafo cargado:", graph.getAdjList());

let origin = null;
let destination = null;

//seleccionar nodos como origen y destino
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
            // Reiniciar selección si hay dos nodos seleccionados
            document.querySelectorAll('.node').forEach(n => {
                n.classList.remove('origin', 'destination');
            });
            origin = id;
            destination = null;
            node.classList.add('origin');
            
        }
        //mostrar los nodos seleccionados
        document.getElementById("selected-nodes").textContent = `Origen: ${origin} | Destino: ${destination}`;

    });
});
// BOTÓN CALCULAR RUTA
document.getElementById("calculateBtn").addEventListener("click", () => {
    if (origin === null || destination === null) {
        alert("Selecciona origen y destino primero.");
        return;
    }

    // Ejecutar Dijkstra
    const { distances, previous } = dijkstra(graph, origin);

    // Obtener la ruta más corta hasta el destino
    const path = getShortestPath(previous, destination);
    console.log("Ruta más corta:", path);
    let rutaDetallada = '';
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const edge = graph.getAdjList().get(from).find(n => n.node === to);
        const peso = edge.weight;
        rutaDetallada += `${from} → ${to} (${peso}s)${i < path.length - 2 ? ' → ' : ''}`;
    }
    document.getElementById("ruta-calculada").textContent = `Ruta: ${rutaDetallada}`;


    // Animar la ruta paso a paso
    animatePath(path, graph);
});

// ALGORITMO DE DIJKSTRA SIMPLE
function dijkstra(graph, start) {
    const distances = {};
    const previous = {};
    const visited = new Set();
    const adj = graph.getAdjList();

    // Inicializamos distancias
    for (let node of adj.keys()) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;

    while (visited.size < adj.size) {
        let current = null;
        let minDist = Infinity;

        // Seleccionar el nodo no visitado con menor distancia
        for (let [node, dist] of Object.entries(distances)) {
            if (!visited.has(node) && dist < minDist) {
                minDist = dist;
                current = node;
            }
        }

        if (current === null) break;
        visited.add(current);

        // Relajación de vecinos
        for (let neighbor of adj.get(Number(current))) {
            const alt = distances[current] + neighbor.weight;
            if (alt < distances[neighbor.node]) {
                distances[neighbor.node] = alt;
                previous[neighbor.node] = Number(current);
            }
        }
    }

    return { distances, previous };
}

// RECONSTRUCCIÓN DE LA RUTA MÍNIMA
function getShortestPath(prev, dest) {
    const path = [];
    let current = dest;

    while (current !== null) {
        path.unshift(current);
        current = prev[current];
    }

    return path;
}

// ANIMAR LA RUTA PASO A PASO
function animatePath(path, graph) {
    let i = 0;

    function highlightNext() {
        if (i < path.length - 1) {
            const from = path[i];
            const to = path[i + 1];

            // Buscar el peso (tiempo) entre nodos
            const edge = graph.getAdjList().get(from).find(n => n.node === to);
            const weight = edge ? edge.weight : 1;

            // Destacar el nodo actual
            const nodeEl = document.querySelector(`.node[data-id="${to}"]`);
            nodeEl.classList.add('highlight');

            setTimeout(() => {
                i++;
                highlightNext(); // Siguiente paso
            }, weight * 1000); // tiempo en milisegundos
        } else {
            showTripCost(path, graph); // Al final, mostrar costo
        }
    }

    highlightNext();
}

// MOSTRAR TIEMPO TOTAL Y COSTO
function showTripCost(path, graph) {
    let totalTime = 0;

    // Sumar todos los pesos entre los nodos del camino
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const edge = graph.getAdjList().get(from).find(n => n.node === to);
        totalTime += edge.weight;
    }

    const tarifa = 0.5; // Tarifa por segundo
    const costo = totalTime * tarifa;

    alert(`Tiempo total: ${totalTime}s\nCosto del viaje: $${costo.toFixed(2)}`);

    // Reiniciar mapa para una nueva consulta
    document.querySelectorAll('.node').forEach(n => {
        n.classList.remove('origin', 'destination', 'highlight');
    });

    origin = null;
    destination = null;
    document.getElementById("selected-nodes").textContent = `Origen: - | Destino: -`;
    document.getElementById("ruta-calculada").textContent = "Ruta: -";

}

// DIBUJAR LÍNEAS ENTRE NODOS con svg
function drawLine(x1, y1, x2, y2, weight) {
    const svg = document.getElementById("graph-lines");

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#ccc");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", (x1 + x2) / 2);
    text.setAttribute("y", (y1 + y2) / 2);
    text.setAttribute("fill", "#333");
    text.setAttribute("font-size", "12");
    text.setAttribute("text-anchor", "middle");
    text.textContent = weight + "s";
    svg.appendChild(text);
}
// Cargar el grafo en memoria
edges.forEach(([u, v, w]) => graph.addEdge(u, v, w));

// Dibujar los nodos y las aristas en el mapa
window.addEventListener('DOMContentLoaded', () => {
    edges.forEach(([u, v, w]) => {
        const nodeU = document.querySelector(`.node[data-id="${u}"]`);
        const nodeV = document.querySelector(`.node[data-id="${v}"]`);

        const rectU = nodeU.getBoundingClientRect();
        const rectV = nodeV.getBoundingClientRect();
        const mapRect = document.getElementById("map").getBoundingClientRect();

        const x1 = rectU.left + rectU.width / 2 - mapRect.left;
        const y1 = rectU.top + rectU.height / 2 - mapRect.top;
        const x2 = rectV.left + rectV.width / 2 - mapRect.left;
        const y2 = rectV.top + rectV.height / 2 - mapRect.top;

        drawLine(x1, y1, x2, y2, w);
    });
});

