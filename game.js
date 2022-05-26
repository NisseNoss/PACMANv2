class GridSystem { //TODO fortsette
    // TODO Legge til Pinky
    // TODO legge til Clyde
    // TODO legge til Inky
    // TODO Gjøre koden mer dynamisk for å redusere mengde linjer kode
    // TODO Gjøre umulig å stoppe i en vegg
    // TODO Kanskje ta noe kode ut av classen?
    constructor(matrix, pacmanX, pacmanY, blinkyX, blinkyY, pinkyX, pinkyY, inkyX, inkyY) { //Lager mange lag som ligger oppå hverandre for å vise siden og definerer disse.
        this.matrix = matrix;
        this.uiContext = this.#makeCanvas(850, 850, "#000");
        this.outlineContext = this.#makeCanvas(0, 0, "#000");
        //this.coinContext = this.#makeCanvas(0, 0, "#000", true);
        //this.topContext = this.#makeCanvas(0, 0, "#000", true);
        //maze størelse
        this.cellSize = 24;
        this.padding = 1;
        //Pacman
        this.pacman = {x: pacmanX, y: pacmanY, color: "orange"};
        this.matrix [pacmanY][pacmanX] = 3;
        this.rotation = 0;

        //Blinky
        this.blinky = {x: blinkyX, y: blinkyY, color: "red"};
        this.matrix [blinkyY][blinkyX] = 5;
        this.rotationB = 0;
        this.bTile = 4;

        //Pinky
        this.pinky = {x: pinkyX, y: blinkyY, color: "#FFB9FF"};
        this.matrix [pinkyY][pinkyX] = 6;
        this.rotationP = 0;
        this.pTile = 4;

        //Inky
        this.inky = {x:inkyX, y:inkyY, color: "#00FFFF"}
        this.matrix [inkyY][inkyX] = 7;
        this.rotationI = 0;
        this.iTile = 4;

        //Clyde
        this.rotationC = 0
        this.cTile = 4

        //game variabler
        this.FPS = 5;
        this.play = false;
        this.dotCount = null; //Setter dotCount til NULL istede for 0, fordi dotCount === 0 vil slutte av programmet lengre nede

        document.addEventListener("keydown", this.#rotatePacman); //Koden hører alltid etter et innput fra tasturet til brukeren
    }

    /*#fps() {
        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++
        return false;
    }*/

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
            //time++;
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
            this.rotation = 0;
            console.log("a pressed");
        }
        else if (keyCode === 68 ||keyCode === 39) { // Flytter høyre når "D" blir trykket
            this.rotation = 180;
            console.log("d pressed");
        }
        else if (keyCode === 87 ||keyCode === 38) { // Flytter oppover når "W" blir trykket
            this.rotation = 90;
            console.log("w pressed");
        }
        else if (keyCode === 83 ||keyCode === 40) { // Flytter nedover når "S" blir trykket
            this.rotation = 270;
            console.log("s pressed");
        }
    }

    isValidGhost(x, y, ghostX, ghostY) { //Sjekker om Blinky kan bevege seg i valgt rettning
        if (this.matrix[ghostY + y][ghostX + x] === 0) { //Flytter dersom neste posisjon er tom
            return true;
        }
        else if (this.matrix[ghostY + y][ghostX + x] === 4) { //Flytter dersom neste posisjon er en coin
            return true;
        }
        else if (this.matrix[ghostY + y][ghostX + x] === 3) { //Flytter dersom neste posisjon er pacman
            return true;
        }
        return false; // Hvis ingen av if påstandene er sanne returner vi false
    }

    #findOffset(ghost) {
        if (ghost === 3) {
            if (this.rotation === 90) {
                return {
                    x: 0,
                    y: -2
                };
            }
            if (this.rotation === 180) {
                return {
                    x: 2,
                    y: 0
                };
            }
            if (this.rotation === 270) {
                return {
                    x: 0,
                    y: 2
                };
            }
            if (this.rotation === 0) {
                return {
                    x: -2,
                    y: 0
                };
            }
        }
        else if (ghost === 2) {
            if (this.rotation === 90) {
                return {
                    x: 0,
                    y: -4
                };
            }
            if (this.rotation === 180) {
                return {
                    x: 4,
                    y: 0
                };
            }
            if (this.rotation === 270) {
                return {
                    x: 0,
                    y: 4
                };
            }
            if (this.rotation === 0) {
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

    makeValueBlinky(x, y) { // Vi bruker pytagoras' læresetning for å finne den korteste avstanden
        this.bPosX = this.blinky.x + x - this.pacman.x; // Side a
        this.bPosY = this.blinky.y + y - this.pacman.y; // side b
    }

    makeValueGhost(x, y, ghost) {
        if (ghost === 1) {
            this.posX = this.blinky.x + x - this.pacman.x; // Side a
            this.posY = this.blinky.y + y - this.pacman.y; // side b
        }
        if (ghost === 2) {
            let offset = this.#findOffset(2)
            this.posX = this.pinky.x + x - this.pacman.x - offset.x;
            this.posY = this.pinky.y + y - this.pacman.y - offset.y;
        }
        if (ghost === 3) {
            this.findTargetInky()
            this.posX = this.inky.x + x - this.targetx;
            this.posY = this.inky.x + y - this.targety;
        }
        if (ghost === 4) {

        }

    }

    #whichGhost(GhostID) {
        if (GhostID === 1) {
            return this.rotationB;
        }
        if (GhostID === 2) {
            return this.rotationP;
        }
        if (GhostID === 3) {
            return this.rotationI;
        }
        if (GhostID === 4) {
            return this.rotationC;
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
                this.svar1 = Math.sqrt(this.posX * this.posX + this.posY * this.posY); // gir avstanden til pacmen og spøkelse i luft linje
            }

            if (this.isValidGhost(1, 0, this.blinky.x, this.blinky.y)) { // Sjekker høyre
                this.makeValueGhost(1, 0, GhostID);
                this.svar2 = Math.sqrt(this.posX * this.posX + this.posY * this.posY); // --||--
            }

            if (this.isValidGhost(-1, 0, this.blinky.x, this.blinky.y)) { // Sjekker venstre
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
                    this.rotationB = 90;
                } else if (this.key === "svar2") { // Høyre
                    this.rotationB = 180;
                } else if (this.key === "svar3") { // Venstre
                    this.rotationB = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationB = 90;
                }
            }
            else if (GhostID === 2) {
                if (this.key === "svar1") { // opp
                    this.rotationP = 90;
                } else if (this.key === "svar2") { // Høyre
                    this.rotationP = 180;
                } else if (this.key === "svar3") { // Venstre
                    this.rotationP = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationP = 90;
                }
            }
            else if (GhostID === 3) {
                if (this.key === "svar1") { // opp
                    this.rotationI = 90;
                } else if (this.key === "svar2") { // Høyre
                    this.rotationI = 180;
                } else if (this.key === "svar3") { // Venstre
                    this.rotationI = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationI = 90;
                }
            }
            else if (GhostID === 4) {
                if (this.key === "svar1") { // opp
                    this.rotationC = 90;
                } else if (this.key === "svar2") { // Høyre
                    this.rotationC = 180;
                } else if (this.key === "svar3") { // Venstre
                    this.rotationC = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationC = 90;
                }
            }
        }
        else if(this.#whichGhost(GhostID) === 180) {//høyre
            if (this.isValidGhost(0, -1, this.blinky.x, this.blinky.y)) { // Sjekker Opp
                this.makeValueGhost(0, -1, GhostID);
                this.svar1 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(1, 0, this.blinky.x, this.blinky.y)) { //Sjekker høyre
                this.makeValueGhost(1, 0, GhostID);
                this.svar2 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(0, 1, this.blinky.x, this.blinky.y)) {  //Sjekker ned
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
                    this.rotationB = 90;
                } else if (this.key === "svar2") {
                    this.rotationB = 180;
                } else if (this.key === "svar3") {
                    this.rotationB = 270;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationB = 180;
                }
            }
            else if (GhostID === 2) {
                if (this.key === "svar1") {
                    this.rotationP = 90;
                } else if (this.key === "svar2") {
                    this.rotationP = 180;
                } else if (this.key === "svar3") {
                    this.rotationP = 270;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationP = 180;
                }
            }
            else if (GhostID === 3) {
                if (this.key === "svar1") {
                    this.rotationI = 90;
                } else if (this.key === "svar2") {
                    this.rotationI = 180;
                } else if (this.key === "svar3") {
                    this.rotationI = 270;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationI = 180;
                }
            }
            else if (GhostID === 4) {
                if (this.key === "svar1") {
                    this.rotationC = 90;
                } else if (this.key === "svar2") {
                    this.rotationC = 180;
                } else if (this.key === "svar3") {
                    this.rotationC= 270;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationC = 180;
                }
            }
        }
        else if (this.#whichGhost(GhostID) === 270) {//ned
            if (this.isValidGhost(1, 0, this.blinky.x, this.blinky.y)) {
                this.makeValueGhost(1, 0, GhostID); //Sjekker høyre
                this.svar1 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(0, 1, this.blinky.x, this.blinky.y)) {  //Sjekker ned
                this.makeValueGhost(0, 1, GhostID);
                this.svar2 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(-1, 0, this.blinky.x, this.blinky.y)) { // Sjekker venstre
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
                    this.rotationB = 180;
                } else if (this.key === "svar2") {
                    this.rotationB = 270;
                } else if (this.key === "svar3") {
                    this.rotationB = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationB = 270;
                }
            }
            else if (GhostID === 2) {
                if (this.key === "svar1") {
                    this.rotationP = 180;
                } else if (this.key === "svar2") {
                    this.rotationP = 270;
                } else if (this.key === "svar3") {
                    this.rotationP = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationP = 270;
                }
            }
            else if (GhostID === 3) {
                if (this.key === "svar1") {
                    this.rotationI = 180;
                } else if (this.key === "svar2") {
                    this.rotationI = 270;
                } else if (this.key === "svar3") {
                    this.rotationI = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationI = 270;
                }
            }
            else if (GhostID === 4) {
                if (this.key === "svar1") {
                    this.rotationC = 180;
                } else if (this.key === "svar2") {
                    this.rotationC = 270;
                } else if (this.key === "svar3") {
                    this.rotationC = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationC = 270;
                }
            }
        }
        else if (this.#whichGhost(GhostID) === 0) {//venstre
            if (this.isValidGhost(0, -1, this.blinky.x, this.blinky.y)) { // Sjekker Opp
                this.makeValueGhost(0, -1, GhostID);
                this.svar1 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(0, 1, this.blinky.x, this.blinky.y)) {  //Sjekker ned
                this.makeValueGhost(0, 1, GhostID);
                this.svar2 = Math.sqrt(this.posX * this.posX + this.posY * this.posY);
            }
            if (this.isValidGhost(-1, 0, this.blinky.x, this.blinky.y)) { // Sjekker venstre
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
                    this.rotationB = 90;
                } else if (this.key === "svar2") {
                    this.rotationB = 270;
                } else if (this.key === "svar3") {
                    this.rotationB = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationB = 0;
                }
            }
            if (GhostID === 2) {
                if (this.key === "svar1") {
                    this.rotationP = 90;
                } else if (this.key === "svar2") {
                    this.rotationP = 270;
                } else if (this.key === "svar3") {
                    this.rotationP = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationP = 0;
                }
            }
            if (GhostID === 3) {
                if (this.key === "svar1") {
                    this.rotationI = 90;
                } else if (this.key === "svar2") {
                    this.rotationI = 270;
                } else if (this.key === "svar3") {
                    this.rotationI = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationI = 0;
                }
            }
            if (GhostID === 4) {
                if (this.key === "svar1") {
                    this.rotationC = 90;
                } else if (this.key === "svar2") {
                    this.rotationC = 270;
                } else if (this.key === "svar3") {
                    this.rotationC = 0;
                }
                if (this.svar1 === 100 && this.svar2 === 100 && this.svar3 === 100) {
                    this.rotationC = 0;
                }
            }
        }
    }

    /*findDir() {
        this.value = this.findLogic(), this.min = Infinity, this.key;
        for (let i in this.value) {
            if (this.value[i] < this.min) {
                this.min = this.value[i]
                this.key = i;
            }
        }
        console.log(this.key)
    }*/

    moveBlinky() {

        this.findDirGhost(this.blinky.x, this.blinky.y, 1)
        if (this.rotationB === 0) { // Venstre
            //console.log("Venstre")
            if (this.isValidGhost(-1, 0, this.blinky.x, this.blinky.y)) { // sjekker om det er en lovlig move

                this.updateMatrix(this.blinky.y, this.blinky.x, this.bTile); // sletter seg selv og bytter den ut med verdien til som var der
                this.bTile = this.matrix[this.blinky.y][this.blinky.x - 1]; // husker verdien til blocken foran spøkelse så vi kan bruke den senere
                this.updateMatrix(this.blinky.y, this.blinky.x - 1, 5); // endre verdien foran seg selv
                this.blinky.x--; // oppdatere sin faktiske posisjon i matrixen

            }

        }
        if (this.rotationB === 180) { // Høyre
            //console.log("Høyre")
            if (this.isValidGhost(1, 0, this.blinky.x, this.blinky.y)) {

                this.updateMatrix(this.blinky.y, this.blinky.x, this.bTile);
                this.bTile = this.matrix[this.blinky.y][this.blinky.x + 1];
                this.updateMatrix(this.blinky.y, this.blinky.x + 1, 5);
                this.blinky.x++;

            }

        }
        if (this.rotationB === 90) { // Opp
            //console.log("Opp")
            if (this.isValidGhost(0, -1, this.blinky.x, this.blinky.y)) {

                this.updateMatrix(this.blinky.y, this.blinky.x, this.bTile);
                this.bTile = this.matrix[this.blinky.y - 1][this.blinky.x];
                this.updateMatrix(this.blinky.y - 1, this.blinky.x, 5);
                this.blinky.y--;

            }
        }
        if (this.rotationB === 270) { // Ned
            //console.log("Ned")
            if (this.isValidGhost(0, 1, this.blinky.x, this.blinky.y)) {

                this.updateMatrix(this.blinky.y, this.blinky.x, this.bTile);
                this.bTile = this.matrix[this.blinky.y + 1][this.blinky.x];
                this.updateMatrix(this.blinky.y + 1, this.blinky.x, 5);
                this.blinky.y++;

            }
        }
    }

    moveInky() {
        this.findDirGhost(this.inky.x, this.inky.y, 3)
        if (this.rotationI === 0) { // Venstre
            //console.log("Venstre")
            if (this.isValidGhost(-1, 0, this.inky.x, this.inky.y)) { // sjekker om det er en lovlig move

                this.updateMatrix(this.inky.y, this.inky.x, this.iTile); // sletter seg selv og bytter den ut med verdien til som var der
                this.iTile = this.matrix[this.inky.y][this.inky.x - 1]; // husker verdien til blocken foran spøkelse så vi kan bruke den senere
                this.updateMatrix(this.inky.y, this.inky.x - 1, 7); // endre verdien foran seg selv
                this.inky.x--; // oppdatere sin faktiske posisjon i matrixen

            }

        }
        if (this.rotationI === 180) { // Høyre
            //console.log("Høyre")
            if (this.isValidGhost(1, 0, this.inky.x, this.inky.y)) {

                this.updateMatrix(this.inky.y, this.inky.x, this.iTile);
                this.iTile = this.matrix[this.inky.y][this.inky.x + 1];
                this.updateMatrix(this.inky.y, this.inky.x + 1, 7);
                this.inky.x++;

            }

        }
        if (this.rotationI === 90) { // Opp
            //console.log("Opp")
            if (this.isValidGhost(0, -1, this.inky.x, this.inky.y)) {

                this.updateMatrix(this.inky.y, this.inky.x, this.iTile);
                this.iTile = this.matrix[this.inky.y - 1][this.inky.x];
                this.updateMatrix(this.inky.y - 1, this.inky.x, 7);
                this.inky.y--;

            }
        }
        if (this.rotationI === 270) { // Ned
            //console.log("Ned")
            if (this.isValidGhost(0, 1, this.inky.x, this.inky.y)) {

                this.updateMatrix(this.inky.y, this.inky.x, this.iTile);
                this.iTile = this.matrix[this.inky.y + 1][this.inky.x];
                this.updateMatrix(this.inky.y + 1, this.inky.x, 7);
                this.inky.y++;

            }
        }
    }


    movePacman() { //Sjekker om rotasjon kan føre til et gyldig flytt med #isValidMove
        if (this.rotation === 0) { // Sjekker venstre rotasjon
            if (this.#isValidMove(-1, 0)) {
                this.updateMatrix(this.pacman.y, this.pacman.x, 0); // sletter pacman visuelt
                this.updateMatrix(this.pacman.y, this.pacman.x - 1, 3); // plasserer pacman en block til venstre visuelt
                this.pacman.x--; //Dersom flyttet er gyldig, flyttes pacman en gang mot venstre i matrixen
            }
        }
        if (this.rotation === 180) { // Sjekker høyre rotasjon
            if (this.#isValidMove(1, 0)) {
                this.updateMatrix(this.pacman.y, this.pacman.x, 0);
                this.updateMatrix(this.pacman.y, this.pacman.x + 1, 3);
                this.pacman.x++; //Dersom flyttet er gyldig, flyttes pacman en gang mot høyre i matrixen
            }
        }
        if (this.rotation === 90) { // Sjekker oppover rotasjon
            if (this.#isValidMove(0, -1)) {
                this.updateMatrix(this.pacman.y, this.pacman.x, 0);
                this.updateMatrix(this.pacman.y - 1, this.pacman.x, 3);
                this.pacman.y--; //Dersom flyttet er gyldig, flyttes pacman en gang mot oppover i matrixen
            }
        }
        if (this.rotation === 270) { // Sjekker nedover rotasjon
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

        const center = this.#getCenter(w, h); //TODO Finn ut av dette i 20/11
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
                }if (cellVal !== 4) {
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
let highscore = 0;

let lives = 3;
let score = 0; //Setter start score
let level = 0; //Setter start level
let hschange = 0;//Used if change is detected
//let time = 100; //Setter start tiden
let gridSystem;
gridSystem = new GridSystem(gridMatrix,14, 23, 26, 1, 1, 1, 26, 29); //Setter start posisjonen til pacman og lager alt du ser og mer
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
        console.log(gridSystem.rotationI)
        updateHighScore();
        gridSystem.movePacman();
        gridSystem.moveBlinky();
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
        gridSystem = new GridSystem(gridMatrix,14, 23, 26, 1, 1, 1, 26, 29); //Plasserer pacman på start posisjon
        gridSystem.render();
        console.log(score); //Skriver ut scoren i consolen
    }
    if(gridSystem.matrix[gridSystem.pacman.y][gridSystem.pacman.x] === gridSystem.matrix[gridSystem.blinky.y][gridSystem.blinky.x]) { //Dette skjer når tiden går ut
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

        gridSystem.updateMatrix(gridSystem.pacman.y, gridSystem.pacman.x, 0);
        gridSystem.updateMatrix(gridSystem.blinky.y, gridSystem.blinky.x, 0);
        gridSystem.updateMatrix(gridSystem.inky.y, gridSystem.inky.x, 0);
        gridSystem = new GridSystem(gridMatrix,14, 23, 26, 1, 1, 1, 26, 29); //Plasserer pacman på start posisjon
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
