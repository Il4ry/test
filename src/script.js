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
    //NON VA UN CAZZO DI NIENTEEEEEEEEE!!!!!!!!!!
    ruotaFaccia(matrice){
        return [
            [matrice[2][0], matrice[1][0], matrice[0][0]],
            [matrice[2][1], matrice[1][1], matrice[0][1]],
            [matrice[2][2], matrice[1][2], matrice[0][2]]
        ];
        console.log("DIOJS");
    }
    aggiorna() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                const colore = this.stato.R[i][j];

                // Esempio: aggiorni il materiale
                this.meshFacce.R[i][j].material.color.set(colore);
                console.log("DIOJ");
            }
        }
    }



    // Placeholder per le mosse - da implementare
    Right() { //NON FUNZIONA
        const faccia = this.stato.R;
        this.stato.R= this.ruotaFaccia(faccia);

    }


    Left() {
        let faccia = this.stato.L;
        this.ruotaFaccia(faccia);
    }

    Up() {
        let faccia = this.stato.U;
        this.ruotaFaccia(faccia);
    }

    Down() {
        let faccia = this.stato.D;
        this.ruotaFaccia(faccia);

    }

    Front() {
        let faccia = this.stato.F;
        this.ruotaFaccia(faccia);
    }

    Back() {
        let faccia = this.stato.B;
        this.ruotaFaccia(faccia);
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

    // Crea i 27 cubetti
    creaCubetti();

    //permette di vedere il cubo 3D sullo schermo
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

    // adatta l'immagine allo schermo
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

function creaCubetti() {
    const size = 1;
    const gap = 0.05;

    const coloriMap = {
        'x1': 0xff0000,   // Rosso (Right)
        'x-1': 0xff4500,  // Arancione (Left)
        'y1': 0xffffff,   // Bianco (Up)
        'y-1': 0xfdfd00,  // Giallo (Down)
        'z1': 0x00ff00,   // Verde (Front)
        'z-1': 0x0000ff   // Blu (Back)
    };
    this.meshFacce = { U: [], D: [], L: [], R: [], F: [], B: [] };

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const geometry = new THREE.BoxGeometry(size, size, size);

                // Materiali per le 6 facce
                const materials = [
                    new THREE.MeshBasicMaterial({
                        color: x === 1 ? coloriMap['x1'] : 0x000000
                    }), // destra
                    new THREE.MeshBasicMaterial({
                        color: x === -1 ? coloriMap['x-1'] : 0x000000
                    }), // sinistra
                    new THREE.MeshBasicMaterial({
                        color: y === 1 ? coloriMap['y1'] : 0x000000
                    }), // su
                    new THREE.MeshBasicMaterial({
                        color: y === -1 ? coloriMap['y-1'] : 0x000000
                    }), // giù
                    new THREE.MeshBasicMaterial({
                        color: z === 1 ? coloriMap['z1'] : 0x000000
                    }), // fronte
                    new THREE.MeshBasicMaterial({
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
                const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
                cubetto.add(line);

                cubetti.push({ mesh: cubetto, x, y, z });
                scene.add(cubetto);

                if (y === 1) this.meshFacce.U.push(cubetto);
                if (y === -1) this.meshFacce.D.push(cubetto);
                if (x === 1) this.meshFacce.R.push(cubetto);
                if (x === -1) this.meshFacce.L.push(cubetto);
                if (z === 1) this.meshFacce.F.push(cubetto);
                if (z === -1) this.meshFacce.B.push(cubetto);
            }
        }
    }
}

// ========== CONTROLLI ==========

document.getElementById('btn-mischia').addEventListener('click', () => {

    // Placeholder - da implementare con mosse casuali
});

document.getElementById('btn-risolvi').addEventListener('click', () => {
    // Placeholder - da implementare con algoritmo
});

document.getElementById('btn-reset').addEventListener('click', () => {
    cubo.reset();

});

// ========== INIZIALIZZAZIONE ==========

window.addEventListener('DOMContentLoaded', () => {
    inizializzaCubo3D();
});