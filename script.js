const sudokuTableContainer = document.getElementsByClassName('sudoku-table');
const x = 9;

function basic_grid() {
    const container = document.createElement("div");
    container.classList.add("sudoku-table");

    // Loop to create 3 rows (each containing 3 mini-tables)
    for (let i = 0; i < 3; i++) {
        const sudokuTableRow = document.createElement('div');
        sudokuTableRow.classList.add('sudoku-row'); // Optional class for styling

        // Each sudokuTableRow contains 3 mini-tables
        for (let j = 0; j < 3; j++) {
            const miniTable = document.createElement('table');
            miniTable.classList.add('mini-table');
            const tableBody = document.createElement('tbody');
            miniTable.appendChild(tableBody);

            // Each mini-table is 3x3
            for (let k = 0; k < 3; k++) {
                const tableRow = document.createElement('tr');
                for (let l = 0; l < 3; l++) {
                    const tableColumn = document.createElement('td');
                    const inputCell = document.createElement('input');
                    inputCell.classList.add('editor');
                    inputCell.type = 'number';
                    // inputCell.min = '1';
                    // inputCell.max = '9';    
                    // inputCell.maxlength = '1';    
                    inputCell.min = "1";
                    inputCell.max = "9";                      
                    inputCell.id = `${i*3+k} ${j*3+l}`;
                    //console.log(inputCell.id);
                    tableColumn.appendChild(inputCell);
                    tableRow.appendChild(tableColumn);
                }
                tableBody.appendChild(tableRow);
            }
            sudokuTableRow.appendChild(miniTable);
        }
        container.appendChild(sudokuTableRow);
    }
    return container;
}

class Sudoku {
    answer_arr;
    visible_grid;

    BoxMap = Array(9).fill(9);
    RowMap = Array(9).fill(4);
    ColMap = Array(9).fill(4);
    hintsGiven = 0;
    id = "";

    constructor() {
        this.gridContainer = basic_grid();
        this.answer_arr = this.renderValidSudoku();
        this.visible_grid = this.renderVisGrid();
        this.generateUUID();
        console.log(this.id);
        // console.log(this.answer_arr);
    }

    generateUUID() {
            let str = "";

            for(let i = 0 ;i<12 ; i++){
                let x = Math.floor(Math.random()*16) ;
                    
                switch(x) {
                    case 10 : x = 'a'; break;
                    case 11 : x = 'b';break;
                    case 12 : x = 'c'; break;
                    case 13 : x = 'd'; break;
                    case 14 : x = 'e'; break;
                    case 15 : x = 'f'; break;                    
                }

                str += x.toString();
            }

            str += "4";

            for(let i = 0 ;i<3 ; i++){                    
                let x = Math.floor(Math.random()*16);
                    
                switch(x) {
                    case 10 : x = 'a'; break;
                    case 11 : x = 'b';break;
                    case 12 : x = 'c'; break;                        
                    case 13 : x = 'd'; break;
                    case 14 : x = 'e'; break;
                    case 15 : x = 'f'; break;
                }
                str += x.toString();
            }

            let y = Math.floor(Math.random()*4) + 1;

            switch(y) {
                case 1 : y = '8'; break;
                    case 2 : y = '9';break;
                    case 3 : y = 'a'; break;
                    case 4 : y = 'b'; break;
                }
                str += y;

                for(let i = 0 ;i<15 ; i++){
                    let x = Math.floor(Math.random()*16);
                    
                    switch(x) {
                        case 10 : x = 'a'; break;
                        case 11 : x = 'b';break;
                        case 12 : x = 'c'; break;
                        case 13 : x = 'd'; break;
                        case 14 : x = 'e'; break;
                        case 15 : x = 'f'; break;
                    }

                    str += x.toString();
                }

                this.id = str;
    }
    
    isSafe(arr, x, y, num) {
            num = parseInt(num, 10);
            // Check the columx
            for (let i = 0; i < 9; i++) {
            if (arr[i][y] === num) return false;
            }
            // Check the row
            for (let j = 0; j < 9; j++) {
            if (arr[x][j] === num) return false;
            }
            // Check the 3x3 subgrid
            const subgridRowStart = x - (x % 3);
            const subgridColStart = y - (y % 3);
            for (let i = subgridRowStart; i < subgridRowStart + 3; i++) {
            for (let j = subgridColStart; j < subgridColStart + 3; j++) {
                if (arr[i][j] === num) return false;
            }
            }
            return true;
    }
    
    giveAnswerGrid(arr) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (arr[row][col] === 0) {
                    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
                    // Shuffle numbers (Fisher-Yates)
                    for (let i = numbers.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                    }
                    for (const num of numbers) {
                        if (this.isSafe(arr, row, col, num)) {
                        arr[row][col] = parseInt(num, 10);
                        if (this.giveAnswerGrid(arr)) {
                            return true;
                        } else {
                            arr[row][col] = 0; // Backtrack
                        }
                        }
                    }
                    return false;
                    }
                }
            }
            return true;
    }

    renderValidSudoku() {
        const arr = Array(9).fill(null).map(() => Array(9).fill(0));
           /// console.log(this.giveAnswerGrid(arr));
       if (this.giveAnswerGrid(arr)) {
            console.log(arr);
            return arr;
        } else {
            throw new Error("Failed to generate a valid Sudoku grid.");
        }
    }


    populateInitialValues() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.visible_grid[i][j] !== 0) {
                    const cell = document.getElementById(`${i} ${j}`);
                    if (cell) { // Check if element exists
                        cell.value = this.visible_grid[i][j];
                        cell.style.background = "lightgrey";
                        cell.readOnly = true;
                    }                    
                }
            }
        }
    }
    
    renderVisGrid() {
            this.visible_grid = Array(9).fill(null).map(() => Array(9).fill(0));
            //  console.log(this.visible_grid);
            
            let cluesPlaced = 0; // Keep track of how many clues are actually placed

            while (cluesPlaced < 25) { // Loop until 25 clues are placed
                const x = Math.floor(Math.random() * 9);
                const y = Math.floor(Math.random() * 9);

                let box;

                if (x < 3 && y < 3) box = 0;
                else if (x < 3 && y < 6) box = 1;
                else if (x < 3 && y < 9) box = 2;
                else if (x < 6 && y < 3) box = 3;
                else if (x < 6 && y < 6) box = 4;
                else if (x < 6 && y < 9) box = 5;
                else if (x < 9 && y < 3) box = 6;
                else if (x < 9 && y < 6) box = 7;
                else {
                    box = 8;
                }

                // Check if cell is empty AND box has available slots
                if (this.visible_grid[x][y] === 0 && this.BoxMap[box] > 6 && this.RowMap[x] > 0  && this.ColMap[y] > 0) { // Correct condition
                    this.visible_grid[x][y] = this.answer_arr[x][y];

                    this.BoxMap[box]--; // Decrement count for the box
                    this.RowMap[x]--;
                    this.ColMap[y]--;
                    cluesPlaced++; // Increment total clue count
                }
            }
            return this.visible_grid;
    }
    

    

    renderMain() {
        return this.gridContainer;
    }

    FillHints(){
            if(this.hintsGiven >4){
                let errorMsg = document.getElementById("HintsError");
                errorMsg.style.display = "block";
                
                let cells = document.getElementsByClassName("editor");
                cells.readonly = true;
                

                let newgamebtn = document.getElementById("NewGame_Error_1");
                // console.log(newgamebtn);
                newgamebtn.onclick = () => {
                    errorMsg.style.display = "none";
                    cells.readonly = false;

                    let container = document.getElementsByClassName('sudoku-table')[0];
                    container.innerHTML = "";
                }
                return;
            }
            console.log(this.answer_arr);
            let minBox = -1;
            let minNos = Number.MIN_SAFE_INTEGER;

            for(let i = 0; i<9 ; i++){
                if(minNos < this.BoxMap[i]){
                    minBox = i;
                    minNos = this.BoxMap[i];
                }
            }
            if (minBox === -1 || minNos === 0) {
                console.log("All hints placed, no more boxes left to fill.");
                return;
            }

            let row , col;

            switch (minBox) {
                case 0: row = 0, col = 0; break;
                case 1: row = 0, col = 3; break;
                case 2: row = 0, col = 6; break;
                case 3: row = 3, col = 0; break;
                case 4: row = 3, col = 3; break;
                case 5: row = 3, col = 6; break;
                case 6: row = 6, col = 0; break;
                case 7: row = 6, col = 3; break;
                case 8: row = 6, col = 6; break;
            }

            for(let i = row ; i<row+3 ; i++){
                for(let j = col ; j<col+3 ; j++){
                    const cell = document.getElementById(`${i} ${j}`);
                    if (cell && (cell.value === 0 || cell.value === "")) {
                            cell.value = this.answer_arr[i][j];
                            cell.style.background = "lightgrey";
                            cell.readOnly = true;

                            this.BoxMap[minBox]--;  // Decrease the count of the box
                            this.RowMap[i]--;            // Decrease the count for the row
                            this.ColMap[j]--;            // Decrease the count for the column
                    }
                }
            }
            this.hintsGiven++;
            return;
    }

    validateInput(cell){
            console.log('cakke');
            let [row , col] = cell.id.split(" ");
            // console.log(cell.value);
            let x = cell.value;
            // console.log(x);

            if(this.answer_arr[row][col] === parseInt(x)){
                cell.style.background = "lightgrey";
                cell.readonly = true;
                return;
            } 
            else{
                let errorMsg = document.getElementById("WrongInputError");
                errorMsg.style.display = "block";

                cell.style.background = "red";

                const goBackBtn = document.getElementById('Go-Back');
                const newgamebtn = document.getElementById("NewGame_Error_2");
                let cells = document.getElementsByClassName("editor");
                // Array.from(cells).forEach(cell => {
                //     cell.readOnly = true;
                // });
                cells.readOnly = true;

                for(let i = 0 ; i<9 ; i++){
                    if(i != row){
                        let block = document.getElementById(`${i} ${col}`);
                        block.style.background = "#eda0a0";
                    }
                }

                for(let j = 0 ; j<9 ; j++){
                    if(j != col){
                        let block = document.getElementById(`${row} ${j}`);
                        block.style.background = "#eda0a0";
                    }
                }

                goBackBtn.onclick = () => {
                    cell.value = "";
                    Array.from(cells).forEach(cell => {
                        cell.readOnly = false;
                    });
                    
                    errorMsg.style.display = "none";

                    cell.style.background = "white";

                    for(let i = 0 ; i<9 ; i++){
                        if(i != row){
                            let block = document.getElementById(`${i} ${col}`);
                            
                            if(block.value != 0 )block.style.background = "lightgrey";
                            else block.style.background = "white";
                        }
                    }
    
                    for(let j = 0 ; j<9 ; j++){
                        if(j != col){
                            let block = document.getElementById(`${row} ${j}`);
                            
                            if(block.value != 0 )block.style.background = "lightgrey";
                            else block.style.background = "white";
                        }
                    }
                }

                newgamebtn.onclick = () => {
                    errorMsg.style.display = "none";
                    cells.readonly = false;

                    let container = document.getElementsByClassName('sudoku-table')[0];
                    container.innerHTML = "";
                    console.log("hello");
                    
                }
                //newgamebtn.style.backgroundColor="black";

                console.log(newgamebtn);
                return;

            }
    }

    EndGame() {
        let flag = true;
        const cells = document.getElementsByClassName("editor");

        Array.from(cells).forEach((cell) => {
            let [row , col] = cell.id.split(" ");
            let x = parseInt(cell.value) || 0;
            console.log(`${row} ${col}`);
            if(x != this.answer_arr[row][col]) flag = false;
        })

        const successmsg = document.getElementById("SuccessMsg");

        if(flag === false) {
            let errorMsg = document.getElementById("SuccessError");
            errorMsg.style.display = "block";

            const goBackBtn = document.getElementById('Go-Back-1');
            const newgamebtn = document.getElementById("NewGame_Error_3");

            goBackBtn.onclick = () => {
                errorMsg.style.display = "none";
            }

            newgamebtn.onclick = () => {
                errorMsg.style.display = "none";
                cells.readonly = false;

                let container = document.getElementsByClassName('sudoku-table')[0];
                container.innerHTML = "";
                console.log("hello");
                
            }
        } else {
            successmsg.style.display = "block";
            const newgamebtn = document.getElementById("NewGame_Success");
            newgamebtn.onclick = () => {
                successmsg.style.display = "none";

                let container = document.getElementsByClassName('sudoku-table')[0];
                container.innerHTML = "";
            }
        }
        
        
        
    }
}

let url = (window.location.href);
let user = url.substring(url.lastIndexOf('=') + 1);
console.log(user);

let fname = document.getElementById("fname");
fname.innerHTML = `${user}`;

const Newgame = document.getElementById("NewGame");
const Hints = document.getElementById("Hint");
const cells = document.getElementsByClassName("editor");
const EndGamebtn = document.getElementById("End-Game");


Newgame.onclick = () => {
    let container = document.getElementsByClassName('sudoku-table')[0];
    container.innerHTML = ""; // Clear old board
    const sudoku = new Sudoku();

    container.appendChild(sudoku.renderMain()); // Append the grid first
    sudoku.populateInitialValues(); // Now safely populate values
    Array.from(cells).forEach((cell) => {;
        if(cell.readonly != true){
            
            cell.oninput=(e)=>{
                if(e.target.value >= 1 && e.target.value <= 9){
                    cell.value=e.target.value;
                     sudoku.validateInput(cell);
                }
               
            }
        }
        
    });

    Hints.onclick = () => {
        // console.log(Hints);
        sudoku.FillHints();
    }

    EndGamebtn.onclick = () => {
        sudoku.EndGame();
    }

    
};







