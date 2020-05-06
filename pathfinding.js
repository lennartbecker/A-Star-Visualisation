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
            console.log("End")
            foundPath = true;
            endnode = currentNode;
            break;
        }
        waitingList.splice(waitingList.indexOf(currentNode), 1); //Entferne es aus der warteliste
        closedList.push(currentNode); //Füge es zur Closedliste hinzu

        let neighbors = getNeighborPositions(currentNode);
        neighbors.forEach(neighbor => { //Für jedes der Angrenzenden Quadrate
            if (closedList.find(listnode => listnode.position[0] == neighbor[0] && listnode.position[1] == neighbor[1])) {
                // console.log("In closed list")
                return; //Wenn nicht begehbar, oder bereits geschlossen, ignoriere es
            }
            if (maze[neighbor[0]][neighbor[1]] == 1) {
                return;
            }
            let neighBorNode = new MazeNode(neighbor, currentNode);
            neighBorNode.g = currentNode.g + 1;
            neighBorNode.h = Math.pow(neighBorNode.position[0] - end[0], 2) + Math.pow(neighBorNode.position[1] - end[1], 2);
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

function getNeighborPositions(node) {
    const neighbors = [
        [node.position[0] + 1, node.position[1]],
        [node.position[0] - 1, node.position[1]],
        [node.position[0], node.position[1] + 1],
        [node.position[0], node.position[1] - 1],
    ]
    return neighbors.filter(nb => nb[0] >= 0 && nb[1] >= 0 && nb[0] < maze.length && nb[1] < maze[0].length);
}

export { astar };
