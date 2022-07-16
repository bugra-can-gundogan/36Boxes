var boxes = document.getElementsByClassName("box-of");
console.log(boxes.length);
console.log(boxes[0]);

for (let box of boxes) {
    box.addEventListener("click", function () {
        if (box.className == "box-of") {
            box.className = "box-of wall";
        } else if (box.className == "box-of wall") {
            box.className = "box-of start";
        } else if (box.className == "box-of start") {
            box.className = "box-of end";
        } else if (box.className == "box-of end") {
            box.className = "box-of";
        }
    });
}





var boxdict = [];
function checkIfValidTable() {
    var x = true;
    var startcounter = 0;
    var endcounter = 0;
    boxdict = [];

    for (let box of boxes) {
        if (box.className == "box-of wall") {
            boxdict.push({
                key: box.id,
                value: "wall"
            });
        } else if (box.className == "box-of start") {
            boxdict.push({
                key: box.id,
                value: "start"
            });
            startcounter++;
        } else if (box.className == "box-of end") {
            boxdict.push({
                key: box.id,
                value: "end"
            });
            endcounter++;
        } else {
            boxdict.push({
                key: box.id,
                value: "empty"
            });
        }
    }

    if (startcounter == 0) {
        alert("You didn't set a start block.");
        return false;
    }
    if (endcounter == 0) {
        alert("You didn't set a end block.");
        return false;
    }

    if (endcounter > 1) {
        alert("There can be only one end position.");
        return false;
    }
    if (startcounter > 1) {
        alert("There can be only one start position.");
        return false;
    }
    return x;
}


function startOperation(a) {
    if (!checkIfValidTable()) {
        return;
    }

    if (a == "dfs") {
        var maze = new Maze("DFS");
        maze.print();
        console.log("solvin");
        maze.solve();
        console.log("solv finished.");
        maze.print();


    } else if (a == "bfs") {
        var maze = new Maze("BFS");
        maze.print();
        console.log("solvin");
        maze.solve();
        console.log("solv finished.");
        maze.print();

    }
}

function reset() {
    var gametable = document.getElementsByClassName("game-table")[0];
    var buxes = gametable.children;

    for (let box of buxes) {
        box.className = "box-of";
    }

}

class Node {
    constructor(state, parent, action) {
        this.state = state;
        this.parent = parent;
        this.action = action;
    }
}

class StackFrontier {
    constructor() {
        this.frontier = [];
    }

    add(node) {
        this.frontier.push(node);
    }

    containsState(state) {
        //return any(node.state == state for node in self.frontier)
        for (let node of this.frontier) {
            if (node.state === state) {
                console.log(state + " | " + node.state);
                return true;
            }
        }
        return false;
    }

    containsStateMyWay(state) {
        //return any(node.state == state for node in self.frontier)
        for (let node of this.frontier) {
            //console.log(typeof(state) + " | " +typeof(node.state));
            console.log(state[0] == node.state[0] + " | " + state[0] + "--" + node.state[0]);
            if (node.state == [0, 5]) {
                if (node.state === state) {
                    console.log(state + " truee " + node.state);
                    return true;
                } else {
                    console.log(node.state + " != " + state);
                }
            }
        }
        return false;
    }
    //    def empty(self):
    //       return len(self.frontier) == 0
    empty() {
        return this.frontier.length == 0;
    }

    /*      node = self.frontier[-1]
            self.frontier = self.frontier[:-1]
            return node 
    */
    remove() {
        if (this.empty()) {
            console.log("its empty bitch");
        } else {
            var node = this.frontier[this.frontier.length - 1];
            this.frontier.splice(-1, 1);
            return node;
        }
    }
}

/* 
    class QueueFrontier(StackFrontier):

    def remove(self):
        if self.empty():
            raise Exception("empty frontier")
        else:
            node = self.frontier[0]
            self.frontier = self.frontier[1:]
            return node

*/

class QueueFrontier extends StackFrontier {
    remove() {
        if (this.empty()) {
            throw "frontier empty";
        } else {
            var node = this.frontier[0];
            this.frontier.splice(0, 1);
            return node;
        }
    }
}

class Maze {
    constructor(methodOfOp) {
        this.height = 6;
        this.width = 6;
        var text = "";
        this.walls = [];
        this.meth = methodOfOp;

        /*for (let i = 0; i < this.height; i++) {
            var row = [];
            for (let j = 0; j < this.width; j++) {
                const box = boxdict[i + j];
                console.log(i+j);
                if (box.value == "empty") {
                    row.push(false);
                } else if (box.value == "start") {
                    this.start = (i, j);
                    row.push(false);
                } else if (box.value == "end") {
                    this.goal = (i, j);
                    row.push(false);
                } else {
                    row.push(true);
                }
            }

            this.walls.push(row);
        }*/
        var row = [];
        for (let index = 0; index < boxdict.length; index++) {
            var box = boxdict[index]; // index 11 = row 1, column 5
            var i, j;
            j = index % 6;
            i = (index - j) / 6;
            if (box.value == "empty") {
                row.push(false);
            } else if (box.value == "start") {
                this.start = [i, j];
                row.push(false);
            } else if (box.value == "end") {
                this.goal = [i, j];
                row.push(false);
            } else {
                row.push(true);
            }

            if ((index + 1) % 6 == 0) {
                this.walls.push(row);
                row = [];
            }
        }
        this.solution = null;
    }

    print() {
        var solution;
        if (this.solution != null) {
            solution = this.solution[1];
        } else {
            solution = null;
        }
        var strToPrint = "";
        var listofroads = [];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                var wall = this.walls[i][j];
                var indexSum = (i * 6) + j;
                listofroads.push(indexSum);
                console.log(wall);
                if ([i] == this.start[0] && [j] == this.start[1]) {
                    strToPrint += "A";
                    boxdict[indexSum].value = "box-of start";
                } else if ([i] == this.goal[0] && [j] == this.goal[1]) {
                    strToPrint += "B";
                    boxdict[indexSum].value = "box-of end";
                } else if (wall == true) {
                    console.log(wall + " | " + i + " : " + j);
                    strToPrint += "█";
                    boxdict[indexSum].value = "box-of wall";
                } else if (solution != null && isInside(solution, [i, j])) {
                    strToPrint += "*";
                    boxdict[indexSum].value = "box-of road";
                } else {
                    strToPrint += " ";
                    boxdict[indexSum].value = "box-of empty";
                }
            }
            strToPrint += "|";
        }
        console.log(strToPrint);
        console.log(listofroads);


        var gametable = document.getElementsByClassName("game-table")[0];
        var buxes = gametable.children;
        console.log(buxes.length);
        for (let index = 0; index < buxes.length; index++) {
            const element = buxes[index];
            element.className = boxdict[index].value;
        }
    }

    neighbours(state) {
        var [row, col] = state;
        var candidates = [
            ["up", [row - 1, col]],
            ["down", [row + 1, col]],
            ["left", [row, col - 1]],
            ["right", [row, col + 1]]
        ]

        var result = [];

        for (let candidate of candidates) {
            var [a, x] = candidate;
            var action = a;
            var r = x[0];
            var c = x[1];

            if (0 <= r && 0 <= c && r < this.height && c < this.width) {
                if (this.walls[r][c] == false) {
                    var newResult = [action, x];
                    result.push(newResult);
                }
            }
        }
        return result;
    }

    solve() {
        this.num_explored = 0;

        var start = new Node(state = this.start, parent = null, action = null)
        var frontier;
        if (this.meth == "DFS") {
            frontier = new StackFrontier();
        } else if (this.meth == "BFS") {
            frontier = new QueueFrontier();
        } else {
            frontier = new StackFrontier();
        }

        frontier.add(start);

        //this.explored = new Set();
        this.explored = [];

        while (true) {

            if (frontier.empty()) {
                throw "no solution";
            }

            var node = frontier.remove();
            this.num_explored++;

            if (node.state[0] == this.goal[0] && node.state[1] == this.goal[1]) {
                var actions = [];
                var cells = [];

                while (node.parent != null) {
                    actions.push(node.action);
                    cells.push(node.state);
                    node = node.parent;
                }
                actions.reverse();
                cells.reverse();
                this.solution = [actions, cells];
                return;
            }
            try {
                if (!isInside(this.explored, node.state)) {
                    this.explored.push(node.state);
                }
            } catch (error) {
                console.log(error);
                return;
            }


            for (let something of this.neighbours(node.state)) {
                var [action, state] = something;
                if (!frontier.containsState(state) && !isInside(this.explored, state)) {
                    var child = new Node(state, node, action);
                    frontier.add(child);
                }
            }
            //console.log(frontier.containsStateMyWay([0,5]));            
        }

    }
}

function isInside(array, searched) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element[0] == searched[0]) {
            if (element[1] == searched[1]) {
                return true;
            }
        }
    }
    return false;
}
