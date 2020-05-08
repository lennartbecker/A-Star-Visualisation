import { astar, astep } from './pathfinding.js';
let controlmode = 0;
let fieldSize = 30;

let mazeHeight = calculateMazeDimensions().height;
let mazeWidth = calculateMazeDimensions().width;
let stepResults;
// let mazeHeight = 5;
// let mazeWidth = 5;
let start, end;

let mazecontainer = document.getElementById('mazeContainer');

let maze = generateMaze(mazeHeight, mazeWidth);
let dommaze = generateDomMaze(maze);

function generateMaze(height, width) {
    let maze = [];
    let row = new Array(width).fill(0);
    for (let i = 0; i < height; i++) {
        maze.push([...row]);
    }
    return maze;
}

function generateDomMaze(maze) {
    mazecontainer.innerHTML = "";
    let dommaze = [];
    for (let i = 0; i < maze.length; i++) {  //Height
        let domrow = [];
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        rowDiv.id = `row-${i}`
        rowDiv.draggable = false;
        for (let j = 0; j < maze[i].length; j++) { //Width
            let field = document.createElement("div");
            field.dataset.x = j;
            field.dataset.y = i;
            // field.innerHTML = `X:${j}, Y:${i}`;
            field.classList.add("field");
            field.draggable = false;
            let fieldBackground = document.createElement("div");
            fieldBackground.classList.add("fieldBackground");
            field.appendChild(fieldBackground)
            field.addEventListener("mousedown", () => {
                if (controlmode == 0) {
                    controlmode = 1;
                }
                handleEdit(field)
            })
            field.addEventListener("mouseup", () => {
                controlmode = 0;
            })
            field.addEventListener("mouseover", (ev) => {
                if (controlmode == 1) {
                    handleEdit(field)
                }
            })
            rowDiv.appendChild(field);
            domrow.push(field);
        }
        dommaze.push(domrow);
        mazecontainer.appendChild(rowDiv);
    }
    return dommaze;
}

function handleEdit(field) {
    let position = {
        x: parseInt(field.dataset.x),
        y: parseInt(field.dataset.y)
    }
    if (controlmode == 1) {
        field.classList.remove("path");

        if (maze[position.y][position.x] == 0) {
            field.classList.add("obstacle");
            maze[position.y][position.x] = 1;
        } else {
            field.classList.remove("obstacle");
            maze[position.y][position.x] = 0;
        }
    }

    if (controlmode == 2) { //Set Start
        removeClassFromAll("start");
        field.classList.add("start");
        start = [position.y, position.x];
        controlmode = 0;
    }
    if (controlmode == 3) { //Set End
        removeClassFromAll("end");
        field.classList.add("end");
        end = [position.y, position.x];
        controlmode = 0;
    }
}

document.querySelectorAll('.mode-button').forEach(button => {
    button.addEventListener("click", (ev) => {
        controlmode = ev.target.dataset.mode;
    })
})

document.querySelector('#start').addEventListener('click', displayPath);
document.querySelector('#clear').addEventListener('click', clearMaze);
function displayPath() {
    if (start && end) {
        removeClassFromAll("path");
        if (stepResults) {
            stepResults = astep(maze, start, end, stepResults.waitingList);
        } else {
            stepResults = astep(maze, start, end);
        }
        stepResults.waitingList.forEach(field => {
            let y = field.position[0];
            let x = field.position[1];
            dommaze[y][x].classList.add("waiting");
        })
        // while(stepResults.waitingList.length != 0 || stepResults.foundPath == false) {
        //     // console.log(stepResults.closedList)
        //     stepResults = astep(maze, start, end, stepResults.waitingList)
        // }
        console.log(stepResults)
        // let route = astar(maze, start, end);
        // route.splice(0, 1);
        // route.reverse().forEach((field, index) => {
        //     let y = field[0];
        //     let x = field[1];
        //     setTimeout(() => {
        //         dommaze[y][x].classList.add("path");
        //     }, 50 * index);
        // })
    } else {
        Toastify({
            text: "Please set the start & endpoint",
            duration: 2000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();
    }
}
function removeClassFromAll(className) {
    dommaze.forEach(row => {
        row.forEach(field => {
            field.classList.remove(className)
        })
    })
}

function clearMaze() {
    console.log("Clearmaze")
    maze.forEach(row => {
        row.forEach((field, index) => {
            row[index] = 0;
        })
    })
    removeClassFromAll("start");
    removeClassFromAll("end");
    removeClassFromAll("path");
    removeClassFromAll("obstacle");
}

function calculateMazeDimensions() {
    let height = Math.round((window.innerHeight - (window.innerHeight / 100 * 6)) / fieldSize);
    console.log(height)
    let width = Math.round(window.innerWidth / fieldSize);
    return { height, width }
}

function saveMaze() {
    console.log("save")
    localStorage.setItem("maze", JSON.stringify(maze));
    localStorage.setItem("start", JSON.stringify(start));
    localStorage.setItem("end", JSON.stringify(end));
}

function loadMaze() {
    console.log("Load")
    maze = JSON.parse(localStorage.getItem("maze"));
    start = JSON.parse(localStorage.getItem("start"))
    end = JSON.parse(localStorage.getItem("end"))
    dommaze = generateDomMaze(maze);
    console.log(maze)
}

document.querySelector("#save").addEventListener("click", saveMaze);
document.querySelector("#load").addEventListener("click", loadMaze);