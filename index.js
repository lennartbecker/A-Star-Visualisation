import astar from './pathfinding';

let controlmode = 0;
let mazeHeight = 20;
let mazeWidth = 20;

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
        field.classList.remove("obstacle");
        field.classList.remove("start");
        field.classList.remove("end");

    }
    if (controlmode == 1) {
        field.classList.add("obstacle");
        maze[position.y][position.x] = 1;
    }
    if (controlmode == 2) { //Set Start
        removeClassFromAll("start");
        field.classList.add("start");
        start = [position.y, position.x];
    }
    if (controlmode == 3) { //Set End
        removeClassFromAll("end");
        field.classList.add("end");
        end = [position.y, position.x];
    }
}

document.querySelectorAll('.mode-button').forEach(button => {
    button.addEventListener("click", (ev) => {
        console.log(ev.target)
        controlmode = ev.target.dataset.mode;
    })
})

function removeClassFromAll(className) {
    dommaze.forEach(row => {
        row.forEach(field => {
            field.classList.remove(className)
        })
    })
}