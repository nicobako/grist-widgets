function initGrist() {
    grist.ready({ requiredAccess: 'read table', columns: ["node", "children", "parents"] });
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
    nodeElement.innerText = node;

    const parentsElement = document.getElementById("parents");
    const parents = mapped.parents;
    renderList(parentsElement, parents);

    const childrenElement = document.getElementById("children");
    const children = mapped.children;
    renderList(childrenElement, children);


}

function renderList(listElement, nodes){
    console.log("list element", listElement);
    clearList(listElement);
    console.log("nodes", nodes);
}

function clearList(listElement) {
    while (listElement?.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }
  }

document.addEventListener("DOMContentLoaded", initGrist);
