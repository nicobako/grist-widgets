function initGrist(){
    grist.ready({ requiredAccess: 'read table', columns: ["node", "children", "parents"] });
    grist.onRecord(function (record) {
        console.log("record", record);
    });
}

function renderPage(mapped){
    const node = mapped.node;
    document.getElementById("node").innerHTML = node;
}

document.addEventListener("DOMContentLoaded", initGrist);
