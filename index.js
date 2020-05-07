import { astar } from './pathfinding.js';
let controlmode = 0;
let fieldSize = 30;

let mazeHeight = calculateMazeDimensions().height;
let mazeWidth = calculateMazeDimensions().width;

let start = [0, 0];
let end = [12, 12];
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
    let dommaze = [];
    for (let i = 0; i < maze.length; i++) {  //Height
        let domrow = [];
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        rowDiv.id = `row-${i}`
        for (let j = 0; j < maze[i].length; j++) { //Width
            let field = document.createElement("div");
            field.dataset.x = j;
            field.dataset.y = i;
            field.classList.add("field");
            field.addEventListener("click", () => {
                handleEdit(field)
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
    console.log(field)
    let position = {
        x: parseInt(field.dataset.x),
        y: parseInt(field.dataset.y)
    }
    if (controlmode == 0) {
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

document.querySelector('#start').addEventListener('click', displayPath)

function displayPath() {
    removeClassFromAll("path");
    let route = astar(maze, start, end);
    route.forEach(field => {
        let y = field[0];
        let x = field[1];
        dommaze[y][x].classList.add("path");
    })
}
function removeClassFromAll(className) {
    dommaze.forEach(row => {
        row.forEach(field => {
            field.classList.remove(className)
        })
    })
}

function calculateMazeDimensions() {
    let height = Math.round((window.innerHeight - (window.innerHeight / 100 * 6)) / fieldSize);
    console.log(height)
    let width = Math.round(window.innerWidth / fieldSize);
    return { height, width }
}
