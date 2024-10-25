function initGrist(){
    grist.ready({ requiredAccess: 'read table', columns: ["node", "children", "parents"] });
    grist.onRecord(function (record) {
        console.log("record", record);
        const mapped = grist.mapColumnNames(record);
        console.log("mapped variables", mapped);
    });
}

document.addEventListener("DOMContentLoaded", initGrist)
