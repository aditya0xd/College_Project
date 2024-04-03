// Importing necessary modules
const { Heap } = require('./Heap');


class Pair {
    constructor(vname, psf, min_dis, min_time) {
        this.vname = vname;
        this.psf = psf;
        this.min_dis = min_dis;
        this.min_time = min_time;
    }
}

class Vertex {
    constructor() {
        this.nbrs = new Map();
    }
}

class Graph_M {
    constructor() {
        this.vtces = new Map();
    }

    containsVertex(vname) {
        return this.vtces.has(vname);
    }

    numVertex() {
        return this.vtces.size;
    }

    addVertex(vname) {
        const vtx = new Vertex();
        this.vtces.set(vname, vtx);
    }

    removeVertex(vname) {
        if (this.vtces.has(vname)) {
            const vtx = this.vtces.get(vname);
            for (let [key, _] of vtx.nbrs) {
                const nbrVtx = this.vtces.get(key);
                nbrVtx.nbrs.delete(vname);
            }
            this.vtces.delete(vname);
        }
    }

    numEdges() {
        let count = 0;
        for (let [, vertex] of this.vtces) {
            count += vertex.nbrs.size;
        }
        return count / 2;
    }

    containsEdge(vname1, vname2) {
        const vtx1 = this.vtces.get(vname1);
        const vtx2 = this.vtces.get(vname2);

        if (!vtx1 || !vtx2 || !vtx1.nbrs.has(vname2)) {
            return false;
        }

        return true;
    }

    addEdge(vname1, vname2, value) {
        const vtx1 = this.vtces.get(vname1); 
        const vtx2 = this.vtces.get(vname2); 

        if (!vtx1 || !vtx2 || vtx1.nbrs.has(vname2)) {
            return;
        }

        vtx1.nbrs.set(vname2, value);
        vtx2.nbrs.set(vname1, value);
    }

    removeEdge(vname1, vname2) {
        const vtx1 = this.vtces.get(vname1);
        const vtx2 = this.vtces.get(vname2);
        
        // Check if the vertices or the edge between them exist
        if (!vtx1 || !vtx2 || !vtx1.nbrs.has(vname2)) {
            return;
        }

        // Remove the edge from both vertices
        vtx1.nbrs.delete(vname2);
        vtx2.nbrs.delete(vname1);
    }

    display_Map() {
        console.log("\t Delhi Metro Map");
        console.log("\t------------------");
        console.log("----------------------------------------------------\n");

        this.vtces.forEach((vertex, key) => {
            let str = key + " =>\n";
            vertex.nbrs.forEach((value, nbr) => {
                str += "\t" + nbr + "\t";
                if (nbr.length < 16) str += "\t";
                if (nbr.length < 8) str += "\t";
                str += value + "\n";
            });
            console.log(str);
        });

        console.log("\t------------------");
        console.log("---------------------------------------------------\n");
    }

    display_Stations() {
        console.log("\n***********************************************************************\n");
        let i = 1;
        this.vtces.forEach((_, key) => {
            console.log(i + ". " + key);
            i++;
        });
        console.log("\n***********************************************************************\n");
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    hasPath(vname1, vname2, processed) {
        // DIRECT EDGE
        if (this.containsEdge(vname1, vname2)) {
            return true;
        }

        // MARK AS DONE
        processed.set(vname1, true);

        const vtx = this.vtces.get(vname1);
        const nbrs = Array.from(vtx.nbrs.keys());

        // TRAVERSE THE NEIGHBORS OF THE VERTEX
        for (const nbr of nbrs) {
            if (!processed.has(nbr) && this.hasPath(nbr, vname2, processed)) {
                return true;
            }
        }

        return false;
    }

        // Nested class DijkstraPair
    static DijkstraPair = class {
        constructor(vname, psf, cost) {
            this.vname = vname;
            this.psf = psf;
            this.cost = cost;
        }

        // Implement the compareTo method
        compareTo(other) {
            return other.cost - this.cost;
        }
    };

    dijkstra(src, des, nan) {
    let val = 0;
    let ans = [];
    let map = new Map();
    let heap = new Heap();

    for (let key of this.vtces.keys()) {
        let np = new this.constructor.DijkstraPair(key);
        np.cost = Number.MAX_VALUE;

        if (key === src) {
            np.cost = 0;
            np.psf = key;
        }

        heap.add(np);
        map.set(key, np);
    }

    while (!heap.isEmpty()) {
        let rp = heap.remove();

        if (rp.vname === des) {
            val = rp.cost;
            break;
        }

        map.delete(rp.vname);
        ans.push(rp.vname);

        let v = this.vtces.get(rp.vname);
        for (let [nbr, cost] of v.nbrs.entries()) {
            if (map.has(nbr)) {
                let oc = map.get(nbr).cost;
                let k = this.vtces.get(rp.vname);
                let nc = nan ? rp.cost + 120 + 40 * k.nbrs.get(nbr) : rp.cost + k.nbrs.get(nbr);

                if (nc < oc) {
                    let gp = map.get(nbr);
                    gp.psf = rp.psf + nbr;
                    gp.cost = nc;

                    heap.updatePriority(gp);
                }
            }
        }
    }
        return val;
    }

        Get_Minimum_Distance(src, dst) {
        let min = Number.MAX_SAFE_INTEGER;
        let ans = "";
        const processed = new Map();
        const stack = [];

        // create a new pair
        const sp = new Pair();
        sp.vname = src;
        sp.psf = src + "  ";
        sp.min_dis = 0;
        sp.min_time = 0;

        // put the new pair in stack
        stack.push(sp);

        // while stack is not empty keep on doing the work
        while (stack.length > 0) {
            // remove a pair from stack
            const rp = stack.shift();

            if (processed.has(rp.vname)) {
                continue;
            }

            // processed put
            processed.set(rp.vname, true);

            // if there exists a direct edge between removed pair and destination vertex
            if (rp.vname === dst) {
                const temp = rp.min_dis;
                if (temp < min) {
                    ans = rp.psf;
                    min = temp;
                }
                continue;
            }

            const rpvtx = this.vtces.get(rp.vname);
            const nbrs = Array.from(rpvtx.nbrs.keys());

            for (const nbr of nbrs) {
                // process only unprocessed nbrs
                if (!processed.has(nbr)) {
                    // make a new pair of nbr and put in stack
                    const np = new Pair();
                    np.vname = nbr;
                    np.psf = rp.psf + nbr + "  ";
                    np.min_dis = rp.min_dis + rpvtx.nbrs.get(nbr);
                    //np.min_time = rp.min_time + 120 + 40 * rpvtx.nbrs.get(nbr);
                    stack.push(np);
                }
            }
        }
        ans = ans + min.toString();
        return ans;
    }

        Get_Minimum_Time(src, dst) {
        let min = Number.MAX_VALUE;
        let ans = "";
        let processed = new Map();
        let stack = [];

        // Create a new pair
        let sp = new Pair();
        sp.vname = src;
        sp.psf = src + "  ";
        sp.min_dis = 0;
        sp.min_time = 0;

        // Put the new pair in the stack
        stack.push(sp);

        // While the stack is not empty, keep on doing the work
        while (stack.length > 0) {
            // Remove a pair from the stack
            let rp = stack.shift();

            if (processed.has(rp.vname)) {
                continue;
            }

            // Mark as processed
            processed.set(rp.vname, true);

            // If there exists a direct edge between the removed pair and the destination vertex
            if (rp.vname === dst) {
                let temp = rp.min_time;
                if (temp < min) {
                    ans = rp.psf;
                    min = temp;
                }
                continue;
            }

            let rpvtx = this.vtces.get(rp.vname);
            let nbrs = Array.from(rpvtx.nbrs.keys());

            for (let nbr of nbrs) {
                // Process only unprocessed neighbors
                if (!processed.has(nbr)) {
                    // Make a new pair of neighbor and put it in the stack
                    let np = new Pair();
                    np.vname = nbr;
                    np.psf = rp.psf + nbr + "  ";
                    np.min_time = rp.min_time + 120 + 40 * rpvtx.nbrs.get(nbr);
                    stack.unshift(np);
                }
            }
        }

        let minutes = Math.ceil(min / 60);
        ans = ans + minutes.toString();
        return ans;
    }

        get_Interchanges(str) {
        let arr = [];
        let res = str.split("  ");
        arr.push(res[0]);
        let count = 0;
        for (let i = 1; i < res.length - 1; i++) {
            let index = res[i].indexOf('~');
            let s = res[i].substring(index + 1);
            if (s.length === 2) {
                let prev = res[i - 1].substring(res[i - 1].indexOf('~') + 1);
                let next = res[i + 1].substring(res[i + 1].indexOf('~') + 1);
                if (prev === next) {
                    arr.push(res[i]);
                } else {
                    arr.push(res[i] + " ==> " + res[i + 1]);
                    i++;
                    count++;
                }
            } else {
                arr.push(res[i]);
            }
        }
        arr.push(count.toString());
        arr.push(res[res.length - 1]);
        return arr;
    }

        static Create_Metro_Map(g) {
        g.addVertex("Noida Sector 62~B");
        g.addVertex("Botanical Garden~B");
        g.addVertex("Yamuna Bank~B");
        g.addVertex("Rajiv Chowk~BY");
        g.addVertex("Vaishali~B");
        g.addVertex("Moti Nagar~B");
        g.addVertex("Janak Puri West~BO");
        g.addVertex("Dwarka Sector 21~B");
        g.addVertex("Huda City Center~Y");
        g.addVertex("Saket~Y");
        g.addVertex("Vishwavidyalaya~Y");
        g.addVertex("Chandni Chowk~Y");
        g.addVertex("New Delhi~YO");
        g.addVertex("AIIMS~Y");
        g.addVertex("Shivaji Stadium~O");
        g.addVertex("DDS Campus~O");
        g.addVertex("IGI Airport~O");
        g.addVertex("Rajouri Garden~BP");
        g.addVertex("Netaji Subhash Place~PR");
        g.addVertex("Punjabi Bagh West~P");

        g.addEdge("Noida Sector 62~B", "Botanical Garden~B", 8);
        g.addEdge("Botanical Garden~B", "Yamuna Bank~B", 10);
        g.addEdge("Yamuna Bank~B", "Vaishali~B", 8);
        g.addEdge("Yamuna Bank~B", "Rajiv Chowk~BY", 6);
        g.addEdge("Rajiv Chowk~BY", "Moti Nagar~B", 9);
        g.addEdge("Moti Nagar~B", "Janak Puri West~BO", 7);
        g.addEdge("Janak Puri West~BO", "Dwarka Sector 21~B", 6);
        g.addEdge("Huda City Center~Y", "Saket~Y", 15);
        g.addEdge("Saket~Y", "AIIMS~Y", 6);
        g.addEdge("AIIMS~Y", "Rajiv Chowk~BY", 7);
        g.addEdge("Rajiv Chowk~BY", "New Delhi~YO", 1);
        g.addEdge("New Delhi~YO", "Chandni Chowk~Y", 2);
        g.addEdge("Chandni Chowk~Y", "Vishwavidyalaya~Y", 5);
        g.addEdge("New Delhi~YO", "Shivaji Stadium~O", 2);
        g.addEdge("Shivaji Stadium~O", "DDS Campus~O", 7);
        g.addEdge("DDS Campus~O", "IGI Airport~O", 8);
        g.addEdge("Moti Nagar~B", "Rajouri Garden~BP", 2);
        g.addEdge("Punjabi Bagh West~P", "Rajouri Garden~BP", 2);
        g.addEdge("Punjabi Bagh West~P", "Netaji Subhash Place~PR", 3);
    }

    printCodelist() {
    console.log("List of station along with their codes:\n");
    let keys = [...this.vtces.keys()];
    let codes = [];
    let i = 1;
    let j = 0;
    let m = 1;
    for (let key of keys) {
        let temp = key.split(" ");
        let code = "";
        for (let word of temp) {
            let c = word[0];
            let k = 0;
            while (c >= '0' && c <= '9') {
                code += c;
                k++;
                c = word[k];
            }
            if ((c < '0' || c > '9') && c < 'a') {
                code += c;
            }
        }
        if (code.length < 2) {
            code += temp[0][1].toUpperCase();
        }
        codes.push(code);
        process.stdout.write(`${i}. ${key}\t`);
        if (key.length < (22 - m)) {
            process.stdout.write("\t");
        }
        if (key.length < (14 - m)) {
            process.stdout.write("\t");
        }
        if (key.length < (6 - m)) {
            process.stdout.write("\t");
        }
        console.log(codes[i - 1]);
        i++;
        if (i === Math.pow(10, m)) {
            m++;
        }
    }
    return codes;
}

}

//! MAIN Section
//! for input
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//! DisplayMenu
function displayMenu() {


  console.log("\t\t\t\t~~LIST OF ACTIONS~~\n\n");
  console.log("1. LIST ALL THE STATIONS IN THE MAP");
  console.log("2. SHOW THE METRO MAP");
  console.log("3. GET SHORTEST DISTANCE FROM A 'SOURCE' STATION TO 'DESTINATION' STATION");
  console.log("4. GET SHORTEST TIME TO REACH FROM A 'SOURCE' STATION TO 'DESTINATION' STATION");
  console.log("5. GET SHORTEST PATH (DISTANCE WISE) TO REACH FROM A 'SOURCE' STATION TO 'DESTINATION' STATION");
  console.log("6. GET SHORTEST PATH (TIME WISE) TO REACH FROM A 'SOURCE' STATION TO 'DESTINATION' STATION");
  console.log("7. EXIT THE MENU");
}


//! askChoice is for validation
async function askChoice() {
  return new Promise((resolve) => {

    rl.question("\nENTER YOUR CHOICE FROM THE ABOVE LIST (1 to 7) : ", (answer) => {
      const choice = parseInt(answer);
      if (isNaN(choice) || choice < 1 || choice > 7) {
        console.log("Invalid choice. Please enter a number between 1 and 7.");
        resolve(askChoice());
      } else {
        resolve(choice);
      }
    });
  });
}

//! Main function
async function main() {

    // Get the keys (station names) from the graph
    const keys = [...g.vtces.keys()];



  console.log("\n\t\t\t****WELCOME TO THE METRO APP*****");

  displayMenu();

  while (true) {
      const choice = await askChoice();
    

console.log("\n***********************************************************\n");
if (choice === 7) {
    console.log("Exiting the menu. Goodbye!");
    process.exit(0);
}

switch (choice) {
    case 1:
        g.display_Stations();
        displayMenu();
        break;

    case 2:
        g.display_Map();
        displayMenu();
        break;
        
    case 3:
        console.log("\n1. TO ENTER SERIAL NO. OF STATIONS\n2. TO ENTER CODE OF STATIONS\n3. TO ENTER NAME OF STATIONS\n");
        // console.log("ENTER YOUR CHOICE:");
        
        rl.question("Enter your choice: ", (ch) => {
            ch = parseInt(ch);
            let st1 = "", st2 = "";
            console.log("ENTER THE SOURCE AND DESTINATION STATIONS");
            if (ch === 1) {
                rl.question("Enter the serial number of the source station: ", (source) => {
                    st1 = keys[parseInt(source) - 1];
                rl.question("Enter the serial number of the destination station: ", (destination) => {
                    st2 = keys[parseInt(destination) - 1];
                    processInput(st1, st2);
                    rl.close();
                });
            });
        } else if (ch === 2) {
            rl.question("Enter the code of the source station: ", (sourceCode) => {
                const sourceStation = sourceCode.toUpperCase();
                const sourceIndex = codes.indexOf(sourceStation);

                if (sourceIndex !== -1) {
                    st1 = keys[sourceIndex];
                    rl.question("Enter the code of the destination station: ", (destCode) => {
                        const destStation = destCode.toUpperCase();
                        const destIndex = codes.indexOf(destStation);
                        if (destIndex !== -1) {
                            st2 = keys[destIndex];
                            processInput(st1, st2);
                        } else {
                            console.log("Invalid destination station code.");
                        }
                        rl.close();
                    });
                } else {
                    console.log("Invalid source station code.");
                    rl.close();
                }
            });
        } else if (ch === 3) {
            rl.question("Enter the name of the source station: ", (source) => {
                st1 = source;
                rl.question("Enter the name of the destination station: ", (destination) => {
                    st2 = destination;
                    processInput(st1, st2);
                    rl.close();
                });
            });
        } else {
            console.log("Invalid choice");
            rl.close();
        }
    });

        function processInput(source, destination) {
            let processed = new Map();
            if (!g.containsVertex(source) || !g.containsVertex(destination) || !g.hasPath(source, destination, processed)) {
                console.log("THE INPUTS ARE INVALID");
            } else {
                console.log("\nSHORTEST DISTANCE FROM " + source + " TO " + destination + " IS " + g.dijkstra(source, destination, false) + "KM\n");
            }
        }
           break;

           case 4:
            console.log("ENTER THE SOURCE STATION: ");
            rl.question("Enter the source station: ", (sat1) => {
                console.log("ENTER THE DESTINATION STATION: ");
                rl.question("Enter the destination station: ", (sat2) => {
                    let processed1 = new Map();
                    let timeInMinutes = g.dijkstra(sat1, sat2, true); // Get the time in minutes
                    if (timeInMinutes === Number.MAX_VALUE) {
                        console.log("There is no path between the source and destination stations.");
                    } else {
                        let hours = Math.floor(timeInMinutes / 60);
                        let minutes = timeInMinutes % 60;
                        console.log("\nSHORTEST TIME FROM (" + sat1 + ") TO (" + sat2 + ") IS " + hours + " hours and " + minutes + " minutes.\n\n");
                    }
                    // Close the readline interface
                    rl.close();
                });
            });
            break;
        

    case 5:
        console.log("ENTER THE SOURCE AND DESTINATION STATIONS");
        let s1 = prompt();
        let s2 = prompt();

        let processed2 = new Map();
        if (!g.containsVertex(s1) || !g.containsVertex(s2) || !g.hasPath(s1, s2, processed2)) {
            console.log("THE INPUTS ARE INVALID");
        } else {
            let str = g.get_Interchanges(g.Get_Minimum_Distance(s1, s2));
            let len = str.length;
            console.log("SOURCE STATION : " + s1);
            console.log("DESTINATION STATION : " + s2);
            console.log("DISTANCE : " + str[len - 1]);
            console.log("NUMBER OF INTERCHANGES : " + str[len - 2]);
            console.log("~~~~~~~~~~~~~");
            console.log("START  ==>  " + str[0]);
            for (let i = 1; i < len - 3; i++) {
                console.log(str[i]);
            }
            console.log(str[len - 3] + "   ==>    END");
            console.log("\n~~~~~~~~~~~~~");
        }
        break;

    case 6:
        console.log("ENTER THE SOURCE STATION: ");
        let ss1 = prompt();
        console.log("ENTER THE DESTINATION STATION: ");
        let ss2 = prompt();

        let processed3 = new Map();
        if (!g.containsVertex(ss1) || !g.containsVertex(ss2) || !g.hasPath(ss1, ss2, processed3)) {
            console.log("THE INPUTS ARE INVALID");
        } else {
            let str = g.get_Interchanges(g.Get_Minimum_Time(ss1, ss2));
            let len = str.length;
            console.log("SOURCE STATION : " + ss1);
            console.log("DESTINATION STATION : " + ss2);
            console.log("TIME : " + str[len - 1] + " MINUTES");
            console.log("NUMBER OF INTERCHANGES : " + str[len - 2]);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log("START  ==>  " + str[0] + " ==>  ");
            for (let i = 1; i < len - 3; i++) {
                console.log(str[i]);
            }
            console.log(str[len - 3] + "   ==>    END");
            console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        }
        break;
    default:
            // If switch expression does not match with any case,
            // default statements are executed by the program.
            // No break is needed in the default case
            console.log("Please enter a valid option! ");
            console.log("The options you can choose are from 1 to 6. ");




}

  }
}
// Create an instance of the Graph_M class
const g = new Graph_M();

// Call the static method to create the metro map
Graph_M.Create_Metro_Map(g);

// Start the main program loop
main();






    
