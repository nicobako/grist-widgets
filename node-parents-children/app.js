/**
 * @typedef {Node}
 * @type {object}
 * @property {Number} id
 */

/**
 * @returns {void}
 */
function initGrist() {
    grist.ready({
        requiredAccess: 'read table', columns: [
            {
                title: "Title",
                description: "The column with the title.",
                name: "title",
                type: "String",
            },
            {
                title: "Data",
                name: "data",
                description: "Column with the data, a dictionary with {name:str, children: list[dict[name, id]], parents: list[dict[name, id]]}."
            }
        ],
        allowSelectBy: true,
    });

    grist.onRecord(function (record) {
        console.log("record", record);
        const mapped = grist.mapColumnNames(record);
        // First check if all columns were mapped.
        console.log("mapped", mapped);
        if (mapped) {
            renderPage(mapped);
        } else {
            // Helper returned a null value. It means that not all
            // required columns were mapped.
            console.error("Please map all columns");
        }
    });

}

function renderPage(mapped) {
    const node = parseNode(mapped);
    const nodeElement = document.getElementById("node");
    renderList(nodeElement, [node])

    const parents = mapped.parents.map((parent=>parseNode(parent)))
    const parentsElement = document.getElementById("parents");
    renderList(parentsElement, parents);
    
    
    const children = mapped.children.map((child=>parseNode(child)));
    const childrenElement = document.getElementById("children");
    renderList(childrenElement, children);
}

function renderList(listElement, nodes) {
    console.log("list element", listElement);
    clearList(listElement);
    console.log("nodes", nodes);
    addNodesToList(listElement, nodes);
}

function clearList(listElement) {
    while (listElement?.firstChild) {
        listElement.removeChild(listElement.firstChild);
    }
}
function addNodesToList(listElement, nodes) {
    // Add items to the list
    nodes.forEach(node => {
        const listItem = document.createElement('li');
        console.log("DEBUG", "node being added to list", node)
        nodeTextItem = renderNode(node);
        listItem.appendChild(nodeTextItem);
        // listItem.textContent = node;
        listElement.appendChild(listItem);
    });
}


/**
 * 
 * @param {object} data 
 * @returns {Node}
 */
function parseNode(data) {
    return {
        title: String(data.title),
        id: Number(data.id)
    }
}

function renderNode(node) {
    nodeElement = document.createElement("span");
    nodeElement.innerText = node;
    nodeElement.addEventListener("click", function (ev) {
        console.log("node clicked", node, ev);
        grist.setCursorPos({ "Node": node }).resolve();
    });
    return nodeElement;
}

document.addEventListener("DOMContentLoaded", initGrist);
