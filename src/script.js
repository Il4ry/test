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

    //(non è vero)funzione che ruota una faccia del cubo
    ruotaFaccia(matrice){
        return [
            [matrice[2][0], matrice[1][0], matrice[0][0]],
            [matrice[2][1], matrice[1][1], matrice[0][1]],
            [matrice[2][2], matrice[1][2], matrice[0][2]]
        ];
    }
    getCol(faccia, indice) { //prende la colonna della faccia che cambia
        return this.stato[faccia].map(row => row[indice]);
    }

    // Imposta la colonna 'indice' della faccia specificata
    setCol(faccia, indice, col) {
        this.stato[faccia].forEach((row, i) => row[indice] = col[i]);
    }

    aggiorna (matrice){
        switch (matrice){
            case 'R': //fa i cambi giusti
                const temp = this.getCol('U', 2);//variabile temporanea per salvare la colonna destra della faccia superiore(U)
                const colB = this.getCol('B', 0);
                const colD = this.getCol('D', 2);
                const colF = this.getCol('F', 2);
                this.setCol('D', 2, [colB[2], colB[1], colB[0]]);//B su D
                this.setCol('F', 2, [colD[2], colD[1], colD[0]]); //salva D su F (giusto)
                this.setCol('U', 2, colF); //salva la colonna di F su U(giusto)
                this.setCol('B', 0, temp);//salva la colonna di U su B
                break;
        }
    }
    //manca come mostrarlo a schermo
    Right() { //NON FUNZIONA
        this.stato.R= this.ruotaFaccia(this.stato.R);
        this.aggiorna('R');
        aggiornaColoriCubo3D();
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
                cubetto.userData = { x, y, z };

                console.log(cubetto.userData);
                // Bordi neri
                const edges = new THREE.EdgesGeometry(geometry);
                const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
                cubetto.add(line);

                cubetti.push(cubetto);
                scene.add(cubetto);
            }
        }
    }
}
function aggiornaColoriCubo3D() {
    console.log("Aggiornamento");
    // Per ogni cubetto nella scena
    console.log('Materiali primo cubetto:', cubetti[0].material);
    console.log('cubetti PRIMA del loop:', cubetti)
    cubetti.forEach(cubetto => {
        console.log("cio");
        const { x, y, z } = cubetto.userData;
        console.log(cubetto.userData);
        console.log(cubetto.material);

        // Determina quale cella dello stato corrisponde a questo cubetto per ogni faccia

        // Faccia Right (x = 1): mappiamo (y, z) su R[riga][colonna]
        if (x === -1) {
            console.log("faccia dentra");
            const riga = 1 - y;    // y=1 -> riga 0, y=0 -> riga 1, y=-1 -> riga 2
            const col = z + 1;      // z=-1 -> col 0, z=0 -> col 1, z=1 -> col 2
            const coloreLetter = cubo.stato.R[riga][col];
            cubetto.material[0].color.setHex(cubo.getColoreHex(coloreLetter)); //problema qui!!!!!!

        } else {
            cubetto.material[0].color.setHex(0x000000);
            console.log("destra");

        }

        // Faccia Left (x = -1)
        if (x === 1) {
            const riga = 1 - y;
            const col = 1 - z;  // Invertito perché guardiamo da sinistra
            const coloreLetter = cubo.stato.L[riga][col];
            cubetto.material[1].color.setHex(cubo.getColoreHex(coloreLetter));
            console.log("faccia sinistra");
        } else {
            cubetto.material[1].color.setHex(0x000000);
        }

        // Faccia Up (y = 1)
        if (y === 1) {
            const riga = 1 - z;
            const col = x + 1;
            const coloreLetter = cubo.stato.U[riga][col];
            cubetto.material[2].color.setHex(cubo.getColoreHex(coloreLetter));
            console.log("faccia su");
        } else {
            cubetto.material[2].color.setHex(0x000000);
        }

        // Faccia Down (y = -1)
        if (y === -1) {
            const riga = z + 1;
            const col = x + 1;
            const coloreLetter = cubo.stato.D[riga][col];
            cubetto.material[3].color.setHex(cubo.getColoreHex(coloreLetter));
            console.log("faccia giu");
        } else {
            cubetto.material[3].color.setHex(0x000000);
        }

        // Faccia Front (z = 1)
        if (z === 1) {
            const riga = 1 - y;
            const col = x + 1;
            const coloreLetter = cubo.stato.F[riga][col];
            cubetto.material[4].color.setHex(cubo.getColoreHex(coloreLetter));
            console.log("faccia davanti");
        } else {
            cubetto.material[4].color.setHex(0x000000);
        }

        // Faccia Back (z = -1)
        if (z === -1) {
            const riga = 1 - y;
            const col = 1 - x;  // Invertito perché guardiamo da dietro
            const coloreLetter = cubo.stato.B[riga][col];
            cubetto.material[5].color.setHex(cubo.getColoreHex(coloreLetter));
            console.log("faccia dietro");
        } else {
            cubetto.material[5].color.setHex(0x000000);
        }
    });

    // Renderizza per mostrare i cambiamenti
    renderer.render(scene, camera);
    console.log("fatto");
}

// ========== CONTROLLI ==========

document.getElementById('btn-reset').addEventListener('click', () => {
    cubo.reset();

});

// ========== INIZIALIZZAZIONE ==========

window.addEventListener('DOMContentLoaded', () => {
    inizializzaCubo3D();
});
