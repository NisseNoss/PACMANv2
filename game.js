class GridSystem { //TODO fortsette
    // TODO Kommentere!!
    // TODO Lage chase og scatter modus
    // TODO legge til Clyde
    // TODO Legge til power pellet
    // TODO få spøkelsene til å starte i spøkelsehuset og la de komme ut på forskjellige tider
    // TODO Gjøre umulig å stoppe i en vegg
    // TODO fikse canvas bug
    // TODO Ha en høyre FPS så vi kan legge forskjellige "speeds" og lage animation til bevegelse
    constructor(matrix, coinMatrix, pacmanX, pacmanY, blinkyX, blinkyY, pinkyX, pinkyY, inkyX, inkyY, clydeX, clydeY) { //Lager mange lag som ligger oppå hverandre for å vise siden og definerer disse.
        this.matrix = matrix;
        this.coinMatrix = coinMatrix
        this.uiContext = this.#makeCanvas(850, 850, "#000");
        this.outlineContext = this.#makeCanvas(0, 0, "#000");
        //maze størelse
        this.cellSize = 24;
        this.padding = 1;
        //Pacman
        this.pacman = {x: pacmanX, y: pacmanY, color: "yellow", dir: 0};
        this.matrix [pacmanY][pacmanX] = 3;

        //Blinky
        this.blinky = {x: blinkyX, y: blinkyY, color: "#FF0000", dir: 270};
        this.matrix [blinkyY][blinkyX] = 5;
        this.bTile = this.coinMatrix[this.blinky.y][this.blinky.x];

        //Pinky
        this.pinky = {x: pinkyX, y: blinkyY, color: "#FFB9FF", dir: 270};
        this.matrix [pinkyY][pinkyX] = 6;
        this.pTile = this.coinMatrix[this.pinky.y][this.pinky.x];;

        //Inky
        this.inky = {x:inkyX, y:inkyY, color: "#00FFFF", dir: 90};
        this.matrix [inkyY][inkyX] = 7;
        this.iTile = this.iTile = this.coinMatrix[this.inky.y][this.inky.x];

        //Clyde
        this.clyde = {x: clydeX, y: clydeY, color: "#FFB852", dir: 90}
        this.matrix [clydeY][clydeX] = 8;
        this.cTile = 4

        //game variabler
        this.FPS = 5;
        this.play = false;
        this.dotCount = null; //SettCer dotCount til NULL istede for 0, fordi dotount === 0 vil slutte av programmet lengre nede

        document.addEventListener("keydown", this.#rotatePacman); //Koden hører alltid etter et innput fra tasturet til brukeren
    }

    uiUpdate() { //Oppdaterer UI laget der score og tid er vist
        this.uiContext.font = "20px Courier";
        this.uiContext.fillStyle = "#fff";
        this.uiContext.clearRect(0,0,850,850) //Sletter vekk alt på laget, slik at ny up-to-date kan bli plassert under.
        this.uiContext.fillText("Score: " + score, 20, 30); //Skriver opp igjen Score
        this.uiContext.fillText("Lives: " + lives, 740, 30);
        if (lives === 0) { //Dersom du går tom for liv, så vises game over skjermen
            this.uiContext.fillText("Game Over!", 369, 30);
        } else {
            this.uiContext.fillText("Level " + (level+1), 390, 30);
        }

    }

    #isValidMove(x, y) { //Sjekker om pacman kan bevege seg i valgt rettning
        if (this.matrix[this.pacman.y + y][this.pacman.x + x] === 0) { //Flytter dersom neste posisjon er tom
            return true;
        }
        else if (this.matrix[this.pacman.y + y][this.pacman.x + x] === 4) { //Flytter dersom neste posisjon er en coin
            score = score + 10; //Pacman har plukket opp en coin og score øker med 10
            this.coinMatrix[this.pacman.y][this.pacman.x] = 0;
            return true;
        }
        return false;
    }

    updateMatrix(y, x, val) { //Oppdaterer posisjonene i matrixen
        this.matrix[y][x] = val;
    }

    #rotatePacman = ({keyCode}) =>{
        this.play = true;

        if (keyCode === 65 || keyCode === 37) { // Flytter venstre når "A" blir trykket
            this.pacman.dir = 0;
            console.log("a pressed");
        }
        else if (keyCode === 68 ||keyCode === 39) { // Flytter høyre når "D" blir trykket
            this.pacman.dir = 180;
            console.log("d pressed");
        }
        else if (keyCode === 87 ||keyCode === 38) { // Flytter oppover når "W" blir trykket
            this.pacman.dir = 90;
            console.log("w pressed");
        }
        else if (keyCode === 83 ||keyCode === 40) { // Flytter nedover når "S" blir trykket
            this.pacman.dir = 270;
            console.log("s pressed");
        }
    }

    isValidGhost(x, y, ghostX, ghostY) { //Sjekker om Blinky kan bevege seg i valgt rettning
        if (this.matrix[ghostY + y][ghostX + x] === 0) { //Flytter dersom neste posisjon er tom
            this.trueCalls++;
            return true;
        }
        else if (this.matrix[ghostY + y][ghostX + x] === 4) { //Flytter dersom neste posisjon er en coin
            this.trueCalls++;
            return true;
        }
        else if (this.matrix[ghostY + y][ghostX + x] === 3) { //Flytter dersom neste posisjon er pacman
            this.trueCalls++
            return true;
        }
        // ghosts
        else if (this.matrix[ghostY + y][ghostX + x] === 5) { // Blinky
            this.trueCalls++
            return true;
        }
        else if (this.matrix[ghostY + y][ghostX + x] === 6) { // Pinky
            this.trueCalls++
            return true;
        }
        else if (this.matrix[ghostY + y][ghostX + x] === 7) { // Inky
            this.trueCalls++
            return true;
        }
        else if (this.matrix[ghostY + y][ghostX + x] === 8) { // Clyde
            this.trueCalls++
            return true;
        }
        return false; // Hvis ingen av if påstandene er sanne returner vi false
    }

    #findOffset(ghost) {
        if (ghost === 3) {
            if (this.pacman.dir === 90) {
                return {
                    x: 0,
                    y: -2
                };
            }
            else if (this.pacman.dir === 180) {
                return {
                    x: 2,
                    y: 0
                };
            }
            else if (this.pacman.dir === 270) {
                return {
                    x: 0,
                    y: 2
                };
            }
            else if (this.pacman.dir === 0) {
                return {
                    x: -2,
                    y: 0
                };
            }
        }
        else if (ghost === 2) {
            if (this.pacman.dir === 90) {
                return {
                    x: 0,
                    y: -4
                };
            }
            else if (this.pacman.dir === 180) {
                return {
                    x: 4,
                    y: 0
                };
            }
            else if (this.pacman.dir === 270) {
                return {
                    x: 0,
                    y: 4
                };
            }
            else if (this.pacman.dir === 0) {
                return {
                    x: -4,
                    y: 0
                };
            }
        }
    }

    findTargetInky() {
        let offset = this.#findOffset(3)
        this.diffx = this.blinky.x - (this.pacman.x + offset.x);
        this.diffy = this.blinky.y - (this.pacman.y + offset.y);

        this.targetx = (this.pacman.x + offset.x) - this.diffx;
        this.targety = (this.pacman.y + offset.y) - this.diffy;
        //this.targetI = {x: this.targetx, y: this.targety};
    }

    makeValueGhost(x, y, ghost) {
        if (ghost === 1) {
            this.posX = this.blinky.x + x - this.pacman.x; // Side a
            this.posY = this.blinky.y + y - this.pacman.y; // side b
        }
        else if (ghost === 2) {
            let offset = this.#findOffset(2)
            this.posX = this.pinky.x + x - this.pacman.x - offset.x;
            this.posY = this.pinky.y + y - this.pacman.y - offset.y;
        }
        else if (ghost === 3) {
            this.findTargetInky()
            this.posX = this.inky.x + x - this.targetx;
            this.posY = this.inky.x + y - this.targety;
        }
        else if (ghost === 4) {

        }

    }

    #whichGhost(GhostID) {
        if (GhostID === 1) {
            return this.blinky.dir ;
        }
        else if (GhostID === 2) {
            return this.pinky.dir ;
        }
        else if (GhostID === 3) {
            return this.inky.dir ;
        }
        else if (GhostID === 4) {
            return this.clyde.dir;
        }
    }

    findDirGhost(GhostX, GhostY, GhostID) {
        // Ghost logic
        // Spøkelsene skal sjekke hvilken vei som er kortest å gå for å komme seg til pacman. De skjekker bare veier som er lov å gå.
        // De kan ikke sjekke bak seg eller snu 180 rundt
        this.svar1 = 100; // hvis en retning kan bli sjekket må vi ha en verdi som er for høy til å påvirke
        this.svar2 = 100;
        this.svar3 = 100;
        if (this.#whichGhost(GhostID) === 90) {//Opp
            if (this.isValidGhost(0, -1, GhostX, GhostY)) { // Sjekker Opp
                this.makeValueGhost(0, -1, GhostID);
                this.svar1 = Math.sqrt(this.posX * this.posX + this.posY * this.posY); // finner avstanden til pacmen og spøkelse i luft linje
            }

            if (this.isValidGhost(1, 0, GhostX, GhostY)) { // Sjekker høyre
                this.makeValueGhost(1, 0, GhostID);
                this.svar2 = Math.sqrt(this.posX * this.posX + this.posY * this.posY); // --||--
            }

            if (this.isValidGhost(-1, 0, GhostX, GhostY)) { // Sjekker venstre
                this.makeValueGhost(-1, 0, GhostID);
                this.svar3 = Math.sqrt(this.posX * this.posX + this.posY * this.posY); // --||--
            }
            // Her finner vi laveste verdien
            this.value = {svar1: this.svar1, svar2: this.svar2, svar3: this.svar3}, this.min = Infinity, this.key;
            for (let i in this.value) { // looper antall ganger this.value har objekter
                if (this.value[i] < this.min) {
                    this.min = this.value[i]; // hvis verdien var lavere en this.min så setter vi verdien til en ny this.min
                    this.key = i; // setter this.key til laveste veriden
                } // Bruke dette til å skjekke om Clad
            }
            //console.log("Opp"+this.key);
            // keyen returner et tekst svar
            if (GhostID === 1) {
                if (this.key === "svar1") { // opp
                    this.blinky.dir  = 90;
                } else if (this.key === "svar2") { // Høyre
                    this.blinky.dir  = 180;
                } else if (this.key === "svar3") { // Venstre
                    this.blinky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.blinky.dir  = 90;
                }
            }
            else if (GhostID === 2) {
                if (this.key === "svar1") { // opp
                    this.pinky.dir  = 90;
                } else if (this.key === "svar2") { // Høyre
                    this.pinky.dir  = 180;
                } else if (this.key === "svar3") { // Venstre
                    this.pinky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.pinky.dir  = 90;
                }
            }
            else if (GhostID === 3) {
                if (this.key === "svar1") { // opp
                    this.inky.dir  = 90;
                } else if (this.key === "svar2") { // Høyre
                    this.inky.dir  = 180;
                } else if (this.key === "svar3") { // Venstre
                    this.inky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.inky.dir  = 90;
                }
            }
            else if (GhostID === 4) {
                if (this.key === "svar1") { // opp
                    this.clyde.dir = 90;
                } else if (this.key === "svar2") { // Høyre
                    this.clyde.dir = 180;
                } else if (this.key === "svar3") { // Venstre
                    this.clyde.dir = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.clyde.dir = 90;
                }
            }
        }
        else if(this.#whichGhost(GhostID) === 180) {//høyre
            if (this.isValidGhost(0, -1, GhostX, GhostY)) { // Sjekker Opp
                this.makeValueGhost(0, -1, GhostID);
                this.svar1 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(1, 0, GhostX, GhostY)) { //Sjekker høyre
                this.makeValueGhost(1, 0, GhostID);
                this.svar2 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(0, 1, GhostX, GhostY)) {  //Sjekker ned
                this.makeValueGhost(0, 1, GhostID);
                this.svar3 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            this.value = {svar1: this.svar1, svar2: this.svar2, svar3: this.svar3}, this.min = Infinity, this.key;
            for (let i in this.value) {
                if (this.value[i] < this.min) {
                    this.min = this.value[i];
                    this.key = i;
                }
            }
            //console.log("Høyre "+this.key);
            if (GhostID === 1) {
                if (this.key === "svar1") {
                    this.blinky.dir  = 90;
                } else if (this.key === "svar2") {
                    this.blinky.dir  = 180;
                } else if (this.key === "svar3") {
                    this.blinky.dir  = 270;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.blinky.dir  = 180;
                }
            }
            else if (GhostID === 2) {
                if (this.key === "svar1") {
                    this.pinky.dir  = 90;
                } else if (this.key === "svar2") {
                    this.pinky.dir  = 180;
                } else if (this.key === "svar3") {
                    this.pinky.dir  = 270;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.pinky.dir  = 180;
                }
            }
            else if (GhostID === 3) {
                if (this.key === "svar1") {
                    this.inky.dir  = 90;
                } else if (this.key === "svar2") {
                    this.inky.dir  = 180;
                } else if (this.key === "svar3") {
                    this.inky.dir  = 270;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.inky.dir  = 180;
                }
            }
            else if (GhostID === 4) {
                if (this.key === "svar1") {
                    this.clyde.dir = 90;
                } else if (this.key === "svar2") {
                    this.clyde.dir = 180;
                } else if (this.key === "svar3") {
                    this.clyde.dir= 270;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.clyde.dir = 180;
                }
            }
        }
        else if (this.#whichGhost(GhostID) === 270) {//ned
            if (this.isValidGhost(1, 0, GhostX, GhostY)) {
                this.makeValueGhost(1, 0, GhostID); //Sjekker høyre
                this.svar1 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(0, 1, GhostX, GhostY)) {  //Sjekker ned
                this.makeValueGhost(0, 1, GhostID);
                this.svar2 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(-1, 0, GhostX, GhostY)) { // Sjekker venstre
                this.makeValueGhost(-1, 0, GhostID);
                this.svar3 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            this.value = {svar1: this.svar1, svar2: this.svar2, svar3: this.svar3}, this.min = Infinity, this.key;
            for (let i in this.value) {
                if (this.value[i] < this.min) {
                    this.min = this.value[i];
                    this.key = i;
                }
            }
            //console.log("Ned" +this.key);
            if (GhostID === 1) {
                if (this.key === "svar1") {
                    this.blinky.dir  = 180;
                } else if (this.key === "svar2") {
                    this.blinky.dir  = 270;
                } else if (this.key === "svar3") {
                    this.blinky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.blinky.dir  = 270;
                }
            }
            else if (GhostID === 2) {
                if (this.key === "svar1") {
                    this.pinky.dir  = 180;
                } else if (this.key === "svar2") {
                    this.pinky.dir  = 270;
                } else if (this.key === "svar3") {
                    this.pinky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.pinky.dir  = 270;
                }
            }
            else if (GhostID === 3) {
                if (this.key === "svar1") {
                    this.inky.dir  = 180;
                } else if (this.key === "svar2") {
                    this.inky.dir  = 270;
                } else if (this.key === "svar3") {
                    this.inky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.inky.dir  = 270;
                }
            }
            else if (GhostID === 4) {
                if (this.key === "svar1") {
                    this.clyde.dir = 180;
                } else if (this.key === "svar2") {
                    this.clyde.dir = 270;
                } else if (this.key === "svar3") {
                    this.clyde.dir = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.clyde.dir = 270;
                }
            }
        }
        else if (this.#whichGhost(GhostID) === 0) {//venstre
            if (this.isValidGhost(0, -1, GhostX, GhostY)) { // Sjekker Opp
                this.makeValueGhost(0, -1, GhostID);
                this.svar1 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(0, 1, GhostX, GhostY)) {  //Sjekker ned
                this.makeValueGhost(0, 1, GhostID);
                this.svar2 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(-1, 0, GhostX, GhostY)) { // Sjekker venstre
                this.makeValueGhost(-1, 0, GhostID);
                this.svar3 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            this.value = {svar1: this.svar1, svar2: this.svar2, svar3: this.svar3}, this.min = Infinity, this.key;
            for (let i in this.value) {
                if (this.value[i] < this.min) {
                    this.min = this.value[i];
                    this.key = i;
                }
            }
            //console.log("Venstre "+this.key);
            if (GhostID === 1) {
                if (this.key === "svar1") {
                    this.blinky.dir  = 90;
                } else if (this.key === "svar2") {
                    this.blinky.dir  = 270;
                } else if (this.key === "svar3") {
                    this.blinky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.blinky.dir  = 0;
                }
            }
            if (GhostID === 2) {
                if (this.key === "svar1") {
                    this.pinky.dir  = 90;
                } else if (this.key === "svar2") {
                    this.pinky.dir  = 270;
                } else if (this.key === "svar3") {
                    this.pinky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.pinky.dir  = 0;
                }
            }
            if (GhostID === 3) {
                if (this.key === "svar1") {
                    this.inky.dir  = 90;
                } else if (this.key === "svar2") {
                    this.inky.dir  = 270;
                } else if (this.key === "svar3") {
                    this.inky.dir  = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.inky.dir  = 0;
                }
            }
            if (GhostID === 4) {
                if (this.key === "svar1") {
                    this.clyde.dir = 90;
                } else if (this.key === "svar2") {
                    this.clyde.dir = 270;
                } else if (this.key === "svar3") {
                    this.clyde.dir = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.clyde.dir = 0;
                }
            }
        }
    }

    #checkIntersection(ghostX, ghostY, ghostDir) {
        this.trueCalls = 0;
        if (ghostDir === 0) { // Venstre
            this.isValidGhost(0, -1, ghostX, ghostY); // Opp
            this.isValidGhost(0, 1, ghostX, ghostY); // Ned
        }
        else if (ghostDir === 90) { // Opp
            this.isValidGhost(-1, 0, ghostX, ghostY); // Venstre
            this.isValidGhost(1, 0, ghostX, ghostY); // Høyre
        }
        else if (ghostDir === 180) { // Høyre
            this.isValidGhost(0, -1, ghostX, ghostY); // Opp
            this.isValidGhost(0, 1, ghostX, ghostY); // Ned
        }
        else if (ghostDir === 270) { // Ned
            this.isValidGhost(-1, 0, ghostX, ghostY); // Venstre
            this.isValidGhost(1, 0, ghostX, ghostY); // Høyre
        }
        //console.log(this.trueCalls)
        return this.trueCalls > 0;
    }

    moveBlinky() {
        this.bTile = this.coinMatrix[this.blinky.y][this.blinky.x]; // Henter verdien underseg fra coinMatrix for senere bruk
        if (this.#checkIntersection(this.blinky.x, this.blinky.y, this.blinky.dir)) {
            this.findDirGhost(this.blinky.x, this.blinky.y, 1)
        }

        if (this.blinky.dir  === 0) { // Venstre
            //console.log("Venstre")
            if (this.isValidGhost(-1, 0, this.blinky.x, this.blinky.y)) { // sjekker om det er en lovlig move

                this.updateMatrix(this.blinky.y, this.blinky.x, this.bTile);// sletter seg selv og bytter den ut med verdien til som var der
                this.updateMatrix(this.blinky.y, this.blinky.x - 1, 5); // endrer posisjonen sin grafisk
                this.blinky.x--; // oppdatere sin faktiske posisjon i matrixen
            }
        }
        if (this.blinky.dir  === 90) { // Opp
            //console.log("Opp")
            if (this.isValidGhost(0, -1, this.blinky.x, this.blinky.y)) {

                this.updateMatrix(this.blinky.y, this.blinky.x, this.bTile);
                this.updateMatrix(this.blinky.y - 1, this.blinky.x, 5);
                this.blinky.y--;
            }
        }
        if (this.blinky.dir  === 180) { // Høyre
            //console.log("Høyre")
            if (this.isValidGhost(1, 0, this.blinky.x, this.blinky.y)) {

                this.updateMatrix(this.blinky.y, this.blinky.x, this.bTile);
                this.updateMatrix(this.blinky.y, this.blinky.x + 1, 5);
                this.blinky.x++;
            }
        }
        if (this.blinky.dir  === 270) { // Ned
            //console.log("Ned")
            if (this.isValidGhost(0, 1, this.blinky.x, this.blinky.y)) {

                this.updateMatrix(this.blinky.y, this.blinky.x, this.bTile);
                this.updateMatrix(this.blinky.y + 1, this.blinky.x, 5);
                this.blinky.y++;
            }
        }
    }

    movePinky() {
        this.pTile = this.coinMatrix[this.pinky.y][this.pinky.x];
        if (this.#checkIntersection(this.pinky.x, this.pinky.y, this.inky.dir )) {
            this.findDirGhost(this.pinky.x, this.pinky.y, 2)
        }

        if (this.pinky.dir === 0) { // Venstre
            if (this.isValidGhost(-1, 0, this.pinky.x, this.pinky.y)) { // sjekker om det er en lovlig move

                this.updateMatrix(this.pinky.y, this.pinky.x, this.pTile); // sletter seg selv og bytter den ut med verdien til som var der.
                this.updateMatrix(this.pinky.y, this.pinky.x - 1, 6); // endre verdien foran seg selv
                this.pinky.x--; // oppdatere sin faktiske posisjon i matrixen
            }
        }
        if (this.pinky.dir  === 90) { // Opp
            //console.log("Opp")
            if (this.isValidGhost(0, -1, this.pinky.x, this.pinky.y)) {

                this.updateMatrix(this.pinky.y, this.pinky.x, this.pTile);
                this.updateMatrix(this.pinky.y - 1, this.pinky.x, 6);
                this.pinky.y--;
            }
        }
        if (this.pinky.dir  === 180) { // Høyre
            //console.log("Høyre")
            if (this.isValidGhost(1, 0, this.pinky.x, this.pinky.y)) {

                this.updateMatrix(this.pinky.y, this.pinky.x, this.pTile);
                this.updateMatrix(this.pinky.y, this.pinky.x + 1, 6);
                this.pinky.x++;
            }
        }
        if (this.pinky.dir  === 270) { // Ned
            //console.log("Ned")
            if (this.isValidGhost(0, 1, this.pinky.x, this.pinky.y)) {

                this.updateMatrix(this.pinky.y, this.pinky.x, this.pTile);
                this.updateMatrix(this.pinky.y + 1, this.pinky.x, 6);
                this.pinky.y++;
            }
        }
    }

    moveInky() {
                this.iTile = this.coinMatrix[this.inky.y][this.inky.x];
        if (this.#checkIntersection(this.inky.x, this.inky.y, this.inky.dir )) {
            this.findDirGhost(this.inky.x, this.inky.y, 3)
        }

        if (this.inky.dir  === 0) { // Venstre
            //console.log("Venstre")
            if (this.isValidGhost(-1, 0, this.inky.x, this.inky.y)) { // sjekker om det er en lovlig move

                this.updateMatrix(this.inky.y, this.inky.x, this.iTile); // sletter seg selv og bytter den ut med verdien til som var der
                this.updateMatrix(this.inky.y, this.inky.x - 1, 7); // endre verdien foran seg selv
                this.inky.x--; // oppdatere sin faktiske posisjon i matrixen
            }
        }
        else if (this.inky.dir  === 180) { // Høyre
            //console.log("Høyre")
            if (this.isValidGhost(1, 0, this.inky.x, this.inky.y)) {

                this.updateMatrix(this.inky.y, this.inky.x, this.iTile);
                this.updateMatrix(this.inky.y, this.inky.x + 1, 7);
                this.inky.x++;
            }
        }
        else if (this.inky.dir  === 90) { // Opp
            //console.log("Opp")
            if (this.isValidGhost(0, -1, this.inky.x, this.inky.y)) {

                this.updateMatrix(this.inky.y, this.inky.x, this.iTile);
                this.updateMatrix(this.inky.y - 1, this.inky.x, 7);
                this.inky.y--;
            }
        }
        else if (this.inky.dir === 270) { // Ned
            //console.log("Ned")
            if (this.isValidGhost(0, 1, this.inky.x, this.inky.y)) {

                this.updateMatrix(this.inky.y, this.inky.x, this.iTile);
                this.updateMatrix(this.inky.y + 1, this.inky.x, 7);
                this.inky.y++;
            }
        }
    }

    movePacman() { //Sjekker om rotasjon kan føre til et gyldig flytt med #isValidMove
        if (this.pacman.dir === 0) { // Sjekker venstre rotasjon
            if (this.#isValidMove(-1, 0)) {
                this.updateMatrix(this.pacman.y, this.pacman.x, 0); // sletter pacman visuelt
                this.updateMatrix(this.pacman.y, this.pacman.x - 1, 3); // plasserer pacman en block til venstre visuelt
                this.pacman.x--; //Dersom flyttet er gyldig, flyttes pacman en gang mot venstre i matrixen
            }
        }
        if (this.pacman.dir === 180) { // Sjekker høyre rotasjon
            if (this.#isValidMove(1, 0)) {
                this.updateMatrix(this.pacman.y, this.pacman.x, 0);
                this.updateMatrix(this.pacman.y, this.pacman.x + 1, 3);
                this.pacman.x++; //Dersom flyttet er gyldig, flyttes pacman en gang mot høyre i matrixen
            }
        }
        if (this.pacman.dir === 90) { // Sjekker oppover rotasjon
            if (this.#isValidMove(0, -1)) {
                this.updateMatrix(this.pacman.y, this.pacman.x, 0);
                this.updateMatrix(this.pacman.y - 1, this.pacman.x, 3);
                this.pacman.y--; //Dersom flyttet er gyldig, flyttes pacman en gang mot oppover i matrixen
            }
        }
        if (this.pacman.dir === 270) { // Sjekker nedover rotasjon
            if (this.#isValidMove(0, 1)) {
                this.updateMatrix(this.pacman.y, this.pacman.x, 0);
                this.updateMatrix(this.pacman.y + 1, this.pacman.x, 3);
                this.pacman.y++; //Dersom flyttet er gyldig, flyttes pacman en gang mot nedover i matrixen
            }
        }
    }

    #getCenter(w, h) { // Sentrerer banen etter skjermstørrelse
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 + "px"
        };
    }

    #makeCanvas(w, h, color = "#111", isTransparent = false) { //Hvordan canvas skal se ut og posisjoneres
        this.canvas = document.createElement("canvas");
        this.context = this.#getContext()
        //this.context = this.canvas.getContext("2d");
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvas.style.position = "absolute";
        this.canvas.style.background = color;
        if (isTransparent) {
            this.canvas.style.backgroundColor = "transparent";
        }
        const center = this.#getCenter(w, h);
        this.canvas.style.marginLeft = center.x;
        this.canvas.style.marginTop = center.y;
        document.body.appendChild(this.canvas); //CRITICAL. AVOID ALTERATION

        return this.context;
    }

    #getContext() {
        this.context = this.canvas.getContext("2d");
        return this.context;
    }

    render() { // Render Maze
        this.dotCount = 0;
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding)
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding)

        this.outlineContext.canvas.width = w;
        this.outlineContext.canvas.height = h;

        const center = this.#getCenter(w, h);
        this.outlineContext.canvas.style.marginTop = center.y;
        this.outlineContext.canvas.style.marginLeft = center.x;

        for (let row = 0; row < this.matrix.length; row++) { //Renderer mazen grid firkant for grid firkant fra venstre til høyre, neste row, repeat
            for (let col = 0; col < this.matrix[row].length; col++) {
                const cellVal = this.matrix[row][col];
                let color = "#111";

                if (cellVal === 1) {
                    color = "#4488FF";
                } else if (cellVal === 2) {
                    color = "#FFCBFF";
                } else if (cellVal === 3) {
                    color = this.pacman.color;
                } else if (cellVal === 4) {
                    this.dotCount++
                    this.outlineContext.fillStyle = "#ecc400";
                    this.outlineContext.fillRect(col * (this.cellSize + this.padding) + 7.5,
                        row * (this.cellSize + this.padding) + 7.5,
                        this.cellSize-15, this.cellSize - 15 );
                } else if (cellVal === 5) {
                    color = this.blinky.color;
                } else if (cellVal === 6) {
                    color = this.pinky.color;
                } else if (cellVal === 7) {
                    color = this.inky.color;
                } else if (cellVal === 8) {
                    color = this.clyde.color;
                }
                if (cellVal !== 4) {
                    this.outlineContext.fillStyle = color;
                    this.outlineContext.fillRect(col * (this.cellSize + this.padding),
                        row * (this.cellSize + this.padding),
                        this.cellSize, this.cellSize);
                }
            }
        }
    }

    loadCoins() {
        this.dotCount = 0;
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);

        this.coinContext.canvas.width = w;
        this.coinContext.canvas.height = h;

        const center = this.#getCenter(w, h);
        this.coinContext.canvas.style.marginLeft = center.x;
        this.coinContext.canvas.style.marginTop = center.y;

        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                const cellVal = this.matrix[row][col];


                if (cellVal === 4) {
                    this.dotCount++;
                    this.coinContext.fillStyle = "#ecc400";
                    this.coinContext.fillRect(col * (this.cellSize + this.padding) + 7.5,
                        row * (this.cellSize + this.padding) + 7.5,
                        this.cellSize-15, this.cellSize - 15 );
                }
            }
        }
    }

    loadPosition() { // Renders Pacman and enemies
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);

        this.topContext.canvas.width = w;
        this.topContext.canvas.height = h;

        const center = this.#getCenter(w, h);
        this.topContext.canvas.style.marginLeft = center.x;
        this.topContext.canvas.style.marginTop = center.y;

        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                const cellVal = this.matrix[row][col];

                this.topContext.globalCompositeOperation = 'destination-out';

                if (cellVal === 3) {
                    this.loadcolor = this.pacman.color;
                    this.topContext.globalCompositeOperation = "source-over";
                }
                if (cellVal === 5) {
                    this.topContext.globalCompositeOperation = "source-over";
                    this.loadcolor = this.blinky.color;
                }

                this.topContext.fillStyle = this.loadcolor;
                this.topContext.fillRect(col * (this.cellSize + this.padding),
                    row * (this.cellSize + this.padding),
                    this.cellSize, this.cellSize);

            }
        }
    }
}

//Setter opp hvordan Matrix gridden skal være
let gridMatrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 1, 0, 0, 1, 4, 1, 0, 0, 0, 1, 4, 1, 1, 4, 1, 0, 0, 0, 1, 4, 1, 0, 0, 1, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1],
    [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 1],
    [1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1],
    [1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1],
    [1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
    [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const coinMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0],
    [0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0],
    [0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 4, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 4, 0],
    [0, 4, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 4, 0],
    [0, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0],
    [0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0],
    [0, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 0],
    [0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0],
    [0, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let highscore = 0;

let lives = 3;
let score = 0; //Setter start score
let level = 0; //Setter start level
let hschange = 0;//Used if change is detected
//let time = 100; //Setter start tiden
let gridSystem;
gridSystem = new GridSystem(gridMatrix, coinMatrix,14, 23, 26, 1, 1, 1, 26, 29, 1, 29); //Setter start posisjonen til pacman og lager alt du ser og mer
gridSystem.render(); //

function sendHighScore() {
    $("#p1").val(name);
    $("#p2").val(highscore);
    $("#p3").val("send");
    $("#f1").submit();
}

//Updates the highscore
function updateHighScore() {
    if (score > highscore) {
        highscore = score;
        localStorage['highscore'] = score;
        hschange = 1;
    }
    //console.log(highscore)
}

function gameLoop() { // Tatt fra https://github.com/KristianHelland/worm som tok det fra https://github.com/AndreasVJ/snake
    if (gridSystem.play) {
        updateHighScore();
        gridSystem.movePacman();
        gridSystem.moveBlinky();
        gridSystem.movePinky();
        gridSystem.moveInky();
        //time = time - 1;
        //console.log(time)
    }
    if (gridSystem.dotCount === 0) { //Når antall dots i gridden blir lik 0, så blir gridden og pacman resatt, men med litt mindre tid for hver gang, til tiden går ut
        level++; //Øker level med 1
        //time = 100 - level*10; //setter at tiden er 100 minus level gange 10
        gridMatrix.length = 0; //tømmer gridden

        //Tegner opp gridden på nytt
        gridMatrix = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 1, 0, 0, 1, 4, 1, 0, 0, 0, 1, 4, 1, 1, 4, 1, 0, 0, 0, 1, 4, 1, 0, 0, 1, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1],
            [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 1],
            [1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1],
            [1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1],
            [1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
            [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        gridSystem = new GridSystem(gridMatrix, coinMatrix,14, 23, 26, 1, 1, 1, 26, 29, 1, 29); //Plasserer pacman på start posisjon
        gridSystem.render();
        console.log(score); //Skriver ut scoren i consolen
    }
    if(gridSystem.matrix[gridSystem.pacman.y][gridSystem.pacman.x] === gridSystem.matrix[gridSystem.blinky.y][gridSystem.blinky.x]
        || gridSystem.matrix[gridSystem.pacman.y][gridSystem.pacman.x] === gridSystem.matrix[gridSystem.pinky.y][gridSystem.pinky.x]
        || gridSystem.matrix[gridSystem.pacman.y][gridSystem.pacman.x] === gridSystem.matrix[gridSystem.inky.y][gridSystem.inky.x]) { //Dette skjer når tiden går ut
        lives--
        if (lives === 0) {
            console.log("Game over"); //Logger "game over" i console
            console.log(score); //Logger så scoren i console
            gridSystem.uiUpdate(); //Oppdaterer ui en siste gang
            if (hschange === 1 && score > 0) {
                setTimeout(sendHighScore, 3000);
            }
            return; //Går ut av gameloopen som betyr at spillet stopper

        }
        gridSystem.outlineContext.canvas.parentNode.removeChild(gridSystem.outlineContext.canvas) // sletter gammel canvas
        gridSystem.uiContext.canvas.parentNode.removeChild(gridSystem.uiContext.canvas)
        gridSystem.updateMatrix(gridSystem.pacman.y, gridSystem.pacman.x, 0);
        gridSystem.updateMatrix(gridSystem.blinky.y, gridSystem.blinky.x, gridSystem.bTile);
        gridSystem.updateMatrix(gridSystem.pinky.y, gridSystem.pinky.x, gridSystem.pTile)
        gridSystem.updateMatrix(gridSystem.inky.y, gridSystem.inky.x, gridSystem.iTile);
        gridSystem = new GridSystem(gridMatrix, coinMatrix,14, 23, 26, 1, 1, 1, 26, 29, 1, 29); //Plasserer pacman på start posisjon
        gridSystem.render();

    }

    gridSystem.render(); // Alt ligger på samme canvaset
    //gridSystem.loadCoins(); //Loader inn nye coins
    //gridSystem.loadPosition(); //Loader posisjon til pacman på nytt
    gridSystem.uiUpdate(); //Oppdaterer ui
    setTimeout(gameLoop, 1000/gridSystem.FPS); //'1000 millisekund delt på 5fps'- sekunders pause før gameloop kjøres igjen.
}
gameLoop();
//console.log(gridSystem.dotCount);
//console.log(score);