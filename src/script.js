class CuboRubik {
    constructor() {
        this.reset();
    }

    reset() {
        this.stato = {
            U: [['W','W','W'], ['W','W','W'], ['W','W','W']],
            D: [['Y','Y','Y'], ['Y','Y','Y'], ['Y','Y','Y']],
            F: [['G','G','G'], ['G','G','G'], ['G','G','G']],
            B: [['B','B','B'], ['B','B','B'], ['B','B','B']],
            L: [['O','O','O'], ['O','O','O'], ['O','O','O']],
            R: [['R','R','R'], ['R','R','R'], ['R','R','R']]
        };
    }

    // Placeholder per le mosse - da implementare
    Right() { //NON FUNZIONA
        // 1. Seleziona e raggruppa
        const cubettiFacciaR = cubetti.filter(c => Math.abs(c.x - 1) < 0.01);
        const gruppo = new THREE.Group();
        scene.add(gruppo);

        cubettiFacciaR.forEach(c => {
            scene.remove(c.mesh);
            gruppo.add(c.mesh);
        });
        animating = true;

        // 2. Anima con GSAP
        gsap.to(gruppo.rotation, {
            x: Math.PI / 2,
            duration: durata,
            ease: "power2.out",
            onComplete: () => {
                finalizzaRotazione(gruppo, cubettiFacciaR);
            }
        });
    }
    Left() {

    }
    Up() {

    }
    Down() {

    }
    Front() {

    }
    Back() {

    }
}

// Istanza del cubo
let cubo = new CuboRubik();

// ========== VISUALIZZAZIONE 3D ==========

let scene, camera, renderer, cubetti = [];
let animating = false;

function inizializzaCubo3D() {
    const container = document.getElementById('cubo-3d-container');

    // Scena (contenitore per gli oggetti creati, la visuale e le luci)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera (visuale sull'oggetto)
    camera = new THREE.PerspectiveCamera(50,container.clientWidth / container.clientHeight,0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Renderer (quello che rende visibile a schermo l'elemento 3D)
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    //luce diretta sull'oggetto
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Crea i 27 cubetti
    creaCubetti();

    // Animazione quando il cubo è fermo
    renderer.render(scene, camera);
    // Rotazione col mouse
    let isMouseDown = false;
    let prevX = 0;
    let prevY = 0;

    window.addEventListener('mousedown', e => {
        isMouseDown = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });
    window.addEventListener('mouseup', () => isMouseDown = false);

    window.addEventListener('mousemove', e => {
        if (!isMouseDown) return;
        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;
        scene.rotation.y += deltaX * 0.01;
        scene.rotation.x += deltaY * 0.01;
        prevX = e.clientX;
        prevY = e.clientY;
        renderer.render(scene, camera);
    });

    // Responsive
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

function creaCubetti() {
    const size = 0.9;
    const gap = 0.05;

    const coloriMap = {
        'x1': 0xff0000,   // Rosso (Right)
        'x-1': 0xff4500,  // Arancione (Left)
        'y1': 0xffffff,   // Bianco (Up)
        'y-1': 0xfdfd00,  // Giallo (Down)
        'z1': 0x00ff00,   // Verde (Front)
        'z-1': 0x0000ff   // Blu (Back)
    };

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const geometry = new THREE.BoxGeometry(size, size, size);

                // Materiali per le 6 facce
                const materials = [
                    new THREE.MeshLambertMaterial({
                        color: x === 1 ? coloriMap['x1'] : 0x000000
                    }), // destra
                    new THREE.MeshLambertMaterial({
                        color: x === -1 ? coloriMap['x-1'] : 0x000000
                    }), // sinistra
                    new THREE.MeshLambertMaterial({
                        color: y === 1 ? coloriMap['y1'] : 0x000000
                    }), // su
                    new THREE.MeshLambertMaterial({
                        color: y === -1 ? coloriMap['y-1'] : 0x000000
                    }), // giù
                    new THREE.MeshLambertMaterial({
                        color: z === 1 ? coloriMap['z1'] : 0x000000
                    }), // fronte
                    new THREE.MeshLambertMaterial({
                        color: z === -1 ? coloriMap['z-1'] : 0x000000
                    })  // retro
                ];

                const cubetto = new THREE.Mesh(geometry, materials);

                cubetto.position.set(
                    x * (size + gap),
                    y * (size + gap),
                    z * (size + gap)
                );

                // Bordi neri
                const edges = new THREE.EdgesGeometry(geometry);
                const line = new THREE.LineSegments(
                    edges,
                    new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
                );
                cubetto.add(line);

                cubetti.push({ mesh: cubetto, x, y, z });
                scene.add(cubetto);
            }
        }
    }
}

// ========== CONTROLLI ==========

document.getElementById('btn-mischia').addEventListener('click', () => {
    aggiornaMesaggio('Mischiando il cubo...', '#fff3e0', '#e65100');
    contatoreMosse = 0;

    // Placeholder - da implementare con mosse casuali
    setTimeout(() => {
        aggiornaMesaggio('Cubo mischiato!', '#e8f5e9', '#2e7d32');
    }, 1000);
});

document.getElementById('btn-risolvi').addEventListener('click', () => {
    aggiornaMesaggio('Risolvendo il cubo...', '#e3f2fd', '#1565c0');
    document.getElementById('fase-corrente').textContent = 'In corso...';

    // Placeholder - da implementare con algoritmo
    setTimeout(() => {
        aggiornaMesaggio('Cubo risolto!', '#e8f5e9', '#2e7d32');
        document.getElementById('fase-corrente').textContent = 'Risolto';
    }, 2000);
});

document.getElementById('btn-reset').addEventListener('click', () => {
    cubo.reset();
    aggiornaMesaggio('Cubo resettato!', '#e8f5e9', '#2e7d32');
});

function aggiornaMesaggio(testo, bgColor, textColor) {
    const messaggio = document.getElementById('stato-messaggio');
    messaggio.textContent = testo;
    messaggio.style.backgroundColor = bgColor;
    messaggio.style.color = textColor;
}

// ========== INIZIALIZZAZIONE ==========

window.addEventListener('DOMContentLoaded', () => {
    inizializzaCubo3D();
    console.log('✅ Cubo di Rubik inizializzato!');
});