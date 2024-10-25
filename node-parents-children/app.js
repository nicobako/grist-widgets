function initGrist() {
    grist.ready({
        requiredAccess: 'read table', columns: [
            {
                name: "node",
            },
            {
                name: "children",
                type: "RefList",
            },
            {
                name: "parents",
                type: "RefList",
            },
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
    const node = mapped.node;
    console.log("node", node);

    const nodeElement = document.getElementById("node");
    nodeElement.appendChild(renderNode(node));

    const parentsElement = document.getElementById("parents");
    const parents = mapped.parents;
    renderList(parentsElement, parents);

    const childrenElement = document.getElementById("children");
    const children = mapped.children;
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
function addNodesToList(listElement, nodes){
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

function renderNode(node){
    nodeElement = document.createElement("span");
    nodeElement.innerText = node;
    nodeElement.addEventListener("click", function(ev){
        console.log("node clicked", node, ev);
        grist.setCursorPos({"Node": node}).resolve();
    });
    return nodeElement;
}

document.addEventListener("DOMContentLoaded", initGrist);
