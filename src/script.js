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

        // Dentro la classe CuboRubik
    getColoreHex(lettera) {
        const mappaColori = {
            'W': 0xffffff,  // Bianco (White)
            'Y': 0xfdfd00,  // Giallo (Yellow)
            'G': 0x00ff00,  // Verde (Green)
            'B': 0x0000ff,  // Blu (Blue)
            'O': 0xff7314,  // Arancione (Orange)
            'R': 0xff0000   // Rosso (Red)
        };
        return mappaColori[lettera] || 0x000000;  // Ritorna il colore o nero se non trova
    }



    ruotaFaccia(matrice){
        return [
            [matrice[2][0], matrice[1][0], matrice[0][0]],
            [matrice[2][1], matrice[1][1], matrice[0][1]],
            [matrice[2][2], matrice[1][2], matrice[0][2]]
        ];
    }
    ruotaFaccia2(matrice){
        return [
            [matrice[0][2], matrice[1][2], matrice[2][2]],
            [matrice[0][1], matrice[1][1], matrice[2][1]],
            [matrice[0][0], matrice[1][0], matrice[2][0]]
        ];
    }
    getCol(faccia, indice) { //prende la colonna della faccia che cambia
        return this.stato[faccia].map(row => row[indice]);
    }
    getRow(faccia, indice) {  //prende la riga
        return this.stato[faccia][indice];
    }
    // Imposta la colonna 'indice' della faccia specificata
    setCol(faccia, indice, col) {
        this.stato[faccia].forEach((row, i) => row[indice] = col[i]);
    }
    setRow(faccia, indice, riga) {
        this.stato[faccia][indice] = riga;
    }

    aggiorna (matrice){
        if (matrice=='R'){//ok
            const colU = this.getCol('U', 2);//variabili per salvare i colori delle colonne che cambiano
            const colB = this.getCol('B', 0);
            const colD = this.getCol('D', 2);
            const colF = this.getCol('F', 2);
            this.setCol('D', 2, colB);//B su D
            this.setCol('F', 2, [colD[2], colD[1], colD[0]]); //salva D su F
            this.setCol('U', 2, [colF[2], colF[1], colF[0]]); //salva la colonna di F su U
            this.setCol('B', 0, colU);//salva la colonna di U su B
        }else if(matrice=='L'){//ok
            const colU = this.getCol('U', 0);
            const colB = this.getCol('B', 2);
            const colD = this.getCol('D', 0);
            const colF = this.getCol('F', 0);
            this.setCol('B', 2, colD);
            this.setCol('U', 0, colB);
            this.setCol('F', 0, [colU[2], colU[1], colU[0]]);
            this.setCol('D', 0, [colF[2], colF[1], colF[0]]);
        }else if(matrice=='F'){//ok
            const colR = this.getCol('R', 2);
            const colL = this.getCol('L', 0);
            const rowU = this.getRow('U', 0);
            const rowD = this.getRow('D', 2);
            this.setCol('R', 2, rowU);
            this.setCol('L', 0, rowD);
            this.setRow('U', 0, [colL[2], colL[1], colL[0]]);
            this.setRow('D', 2, [colR[2], colR[1], colR[0]]);
        }else if(matrice=='B'){//ok
            const colR = this.getCol('R', 0);
            const colL = this.getCol('L', 2);
            const rowU = this.getRow('U', 2);
            const rowD = this.getRow('D', 0);
            this.setCol('L', 2, [rowU[2], rowU[1], rowU[0]]);
            this.setCol('R', 0, [rowD[2], rowD[1], rowD[0]]);
            this.setRow('U', 2, colR);
            this.setRow('D', 0, colL);
        }else if(matrice=='U'){// ok
            const rowR = this.getRow('R', 0);
            const rowF = this.getRow('F', 0);
            const rowL = this.getRow('L', 0);
            const rowB = this.getRow('B', 0);
            this.setRow('F', 0, [rowR[2], rowR[1], rowR[0]]);
            this.setRow('L', 0, [rowF[2], rowF[1], rowF[0]]);
            this.setRow('B', 0, [rowL[2], rowL[1], rowL[0]]);
            this.setRow('R', 0, [rowB[2], rowB[1], rowB[0]]);
        } else{
            const rowR = this.getRow('R', 2);
            const rowF = this.getRow('F', 2);
            const rowL = this.getRow('L', 2);
            const rowB = this.getRow('B', 2);
            this.setRow('B', 2, [rowR[2], rowR[1], rowR[0]]);
            this.setRow('R', 2, [rowF[2], rowF[1], rowF[0]]);
            this.setRow('F', 2, [rowL[2], rowL[1], rowL[0]]);
            this.setRow('L', 2, [rowB[2], rowB[1], rowB[0]]);
        }
    }

    red() {
        this.stato.R= this.ruotaFaccia2(this.stato.R);
        this.aggiorna('R');
        aggiornaColoriCubo3D();
    }
    orange(){
        this.stato.L= this.ruotaFaccia2(this.stato.L);
        this.aggiorna('L');
        aggiornaColoriCubo3D();
    }

    green() {
        this.stato.F= this.ruotaFaccia(this.stato.F);
        this.aggiorna('F');
        aggiornaColoriCubo3D();
    }
    blu(){
        this.stato.B= this.ruotaFaccia(this.stato.B);
        this.aggiorna('B');
        aggiornaColoriCubo3D();
    }
    white() {
        this.stato.U= this.ruotaFaccia2(this.stato.U);
        this.aggiorna('U');
        aggiornaColoriCubo3D();
    }
    yellow(){
        this.stato.D= this.ruotaFaccia2(this.stato.D);
        this.aggiorna('D');
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
        'x-1': 0xff7314,  // Arancione (Left)
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
    // Per ogni cubetto nella scena
    cubetti.forEach(cubetto => {
        const { x, y, z } = cubetto.userData;

        // Determina quale cella dello stato corrisponde a questo cubetto per ogni faccia

        // Faccia rossa (x = 1): mappiamo (y, z) su R[riga][colonna]
        if (x === 1) {
            const riga = 1 - y;    // y=1 -> riga 0, y=0 -> riga 1, y=-1 -> riga 2
            const col = z + 1;      // z=-1 -> col 0, z=0 -> col 1, z=1 -> col 2
            const coloreLetter = cubo.stato.R[riga][col];
            cubetto.material[0].color.setHex(cubo.getColoreHex(coloreLetter)); //problema qui!!!!!!

        } else {
            cubetto.material[0].color.setHex(0x000000);

        }

        // Faccia arancione (x = -1)
        if (x === -1) {
            const riga = 1 - y;
            const col = 1 - z;  // Invertito perché guardiamo da sinistra
            const coloreLetter = cubo.stato.L[riga][col];
            cubetto.material[1].color.setHex(cubo.getColoreHex(coloreLetter));
        } else {
            cubetto.material[1].color.setHex(0x000000);
        }

        // Faccia bianca (y = 1)
        if (y === 1) {
            const riga = 1 - z;
            const col = x + 1;
            const coloreLetter = cubo.stato.U[riga][col];
            cubetto.material[2].color.setHex(cubo.getColoreHex(coloreLetter));
        } else {
            cubetto.material[2].color.setHex(0x000000);
        }

        // Faccia gialla (y = -1)
        if (y === -1) {
            const riga = z + 1;
            const col = x + 1;
            const coloreLetter = cubo.stato.D[riga][col];
            cubetto.material[3].color.setHex(cubo.getColoreHex(coloreLetter));
        } else {
            cubetto.material[3].color.setHex(0x000000);
        }

        // Faccia verde (z = 1)
        if (z === 1) {
            const riga = 1 - y;
            const col = x + 1;
            const coloreLetter = cubo.stato.F[riga][col];
            cubetto.material[4].color.setHex(cubo.getColoreHex(coloreLetter));
        } else {
            cubetto.material[4].color.setHex(0x000000);
        }

        // Faccia blu (z = -1)
        if (z === -1) {
            const riga = 1 - y;
            const col = 1 - x;  // Invertito perché guardiamo da dietro
            const coloreLetter = cubo.stato.B[riga][col];
            cubetto.material[5].color.setHex(cubo.getColoreHex(coloreLetter));
        } else {
            cubetto.material[5].color.setHex(0x000000);
        }
    });

    // Renderizza per mostrare i cambiamenti
    renderer.render(scene, camera);
}

// ========== CONTROLLI ==========
document.getElementById('btn-mischia').addEventListener('click', () => {
    nMosse= Math.floor(Math.random() * (20 - 4 + 1)) + 4;//math.random prende numeri tra 0 e 1, x alzare il range Math.floor(Math.random() * (max - min + 1)) + min;
    for (i=0; i<nMosse; i++){
        indice= Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        if (indice ==1){
        cubo.white();
        }else if(indice==2){
        cubo.yellow();
        }else if(indice==3){
        cubo.red();
        }else if(indice==4){
        cubo.orange();
        }else if(indice==5){
        cubo.green();
        }else{
        cubo.back();
        }
    }
});


document.getElementById('btn-reset').addEventListener('click', () => {
    cubo.reset();
    cubetti.forEach(cubetto => {
        const { x, y, z } = cubetto.userData;
        const size = 1;
        const gap = 0.05;

        // Ripristina posizione originale
        cubetto.position.set(
            x * (size + gap),
            y * (size + gap),
            z * (size + gap)
        );

        // Ripristina rotazione a zero
        cubetto.rotation.set(0, 0, 0);
    });

    // 3. Aggiorna i colori per corrispondere allo stato iniziale
    aggiornaColoriCubo3D();

});

// ========== INIZIALIZZAZIONE ==========

window.addEventListener('DOMContentLoaded', () => {
    inizializzaCubo3D();
});
