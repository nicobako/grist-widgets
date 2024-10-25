function initGrist(){
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

function renderPage(mapped){
    const node = mapped.node;
    console.log("node", node);
    document.getElementById("node").innerText = node;
}

document.addEventListener("DOMContentLoaded", initGrist);
