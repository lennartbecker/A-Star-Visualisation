function MazeNode(position, parent) {
    this.parent = parent;
    this.position = position;
    this.g = 0;
    this.h = 0;
    this.f = 0;
}

function astar(maze, start, end) {
    let startnode = new MazeNode(start, null);
    let closedList = [];
    let waitingList = [];
    let foundPath = false;
    let endnode;
    let endnodeArray = [];

    waitingList.push(startnode);

    while (waitingList.length != 0 || foundPath == false) {
        let currentNode = waitingList.sort((a, b) => a.f > b.f)[0]; // Suche Node mit geringstem F-Wert
        if (currentNode.position[0] == end[0] && currentNode.position[1] == end[1]) {
            foundPath = true;
            endnode = currentNode;
            break;
        }

        waitingList.splice(waitingList.indexOf(currentNode), 1); //Entferne es aus der warteliste
        closedList.push(currentNode); //Füge es zur Closedliste hinzu

        let neighbors = getNeighborPositions(currentNode, maze);
        neighbors.forEach(neighbor => { //Für jedes der Angrenzenden Quadrate
            if (closedList.find(listnode => listnode.position[0] == neighbor[0] && listnode.position[1] == neighbor[1])) {
                console.log("Bereits in Closedlist")
                return; //Wenn nicht begehbar, oder bereits geschlossen, ignoriere es
            }
            if (maze[neighbor[0]][neighbor[1]] == 1) {
                console.log("Hindernis")
                return;
            }
            let neighBorNode = new MazeNode(neighbor, currentNode);
            neighBorNode.g = currentNode.g + 1;
            neighBorNode.h = Math.abs(neighBorNode.position[0] - end[0]) + Math.abs(neighBorNode.position[1] - end[1])
            neighBorNode.f = neighBorNode.g + neighBorNode.h;

            let inWaitinglist = waitingList.find(listnode => listnode.position[0] == neighbor[0] && listnode.position[1] == neighbor[1])
            if (inWaitinglist) {
                if (inWaitinglist.g > neighBorNode.g) {
                    waitingList.splice(waitingList.indexOf(inWaitinglist), 1);
                    waitingList.push(neighBorNode);
                }
            } else {
                waitingList.push(neighBorNode);
            }
        })
    }
    while (endnode.parent) {
        endnodeArray.push(endnode.position);
        endnode = endnode.parent;
    }
    return endnodeArray;
}

function astep(maze, start, end, previousStep) {
    let startnode = new MazeNode(start, null);
    let closedList = [];
    let waitingList = [];
    if (previousStep) {
        closedList = previousStep.closedList;
        waitingList = previousStep.waitingList;
    } else {
        waitingList.push(startnode);
    }
    let foundPath = false;
    waitingList = waitingList.sort((a, b) => a.f > b.f);
    // let currentNode = waitingList[0]; // Suche Node mit geringstem F-Wert
    let currentNode = waitingList.sort((a, b) => a.f > b.f)[0]; // Suche Node mit geringstem F-Wert
    console.log(JSON.stringify(waitingList))

    waitingList.splice(waitingList.indexOf(currentNode), 1); //Entferne es aus der warteliste
    console.log(waitingList.indexOf(currentNode))
    // waitingList.splice(0, 1); //Entferne es aus der warteliste

    closedList.push(currentNode); //Füge es zur Closedliste hinzu
    if (currentNode.position[0] == end[0] && currentNode.position[1] == end[1]) {
        foundPath = [];
        let endnode = currentNode;
        while (endnode.parent) {
            let y = endnode.position[0];
            let x = endnode.position[1];
            foundPath.push({ x, y });
            endnode = endnode.parent;
        }
        return {
            currentNode,
            waitingList,
            closedList,
            foundPath
        }
    }

    let neighbors = getNeighborPositions(currentNode, maze);
    neighbors.forEach(neighbor => { //Für jedes der Angrenzenden Quadrate
        if (closedList.find(listnode => listnode.position[0] == neighbor[0] && listnode.position[1] == neighbor[1])) {
            return; //Wenn nicht begehbar, oder bereits geschlossen, ignoriere es
        }
        if (maze[neighbor[0]][neighbor[1]] == 1) {
            console.log("Hindernis")
            return;
        }
        let neighBorNode = new MazeNode(neighbor, currentNode);
        neighBorNode.g = currentNode.g + 1;
        neighBorNode.h = Math.abs(neighBorNode.position[0] - end[0]) + Math.abs(neighBorNode.position[1] - end[1])
        neighBorNode.f = neighBorNode.g + neighBorNode.h;

        let inWaitinglist = waitingList.find(listnode => listnode.position[0] == neighbor[0] && listnode.position[1] == neighbor[1])
        if (inWaitinglist) {
            if (inWaitinglist.g > neighBorNode.g) {
                let index = waitingList.map(node => JSON.stringify(node.position)).indexOf(JSON.stringify(neighBorNode));
                console.log("index:", index)
            }
        } else {
            waitingList.push(neighBorNode);
        }
    })

    return {
        currentNode,
        waitingList,
        closedList,
        foundPath
    }
}


function getNeighborPositions(node, maze) {
    const neighbors = [
        [node.position[0] + 1, node.position[1]],
        [node.position[0] - 1, node.position[1]],
        [node.position[0], node.position[1] + 1],
        [node.position[0], node.position[1] - 1],
    ]
    return neighbors.filter(nb => nb[0] >= 0 && nb[1] >= 0 && nb[0] < maze.length && nb[1] < maze[0].length);
}

export { astar, astep };
