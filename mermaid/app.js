import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.3.0/+esm';

async function initMermaid(){
    mermaid.initialize({ startOnLoad: false });
}

async function runMermaid(graphDefinition) {
    await initMermaid();
    const { svg } = await mermaid.render('graphDiv', graphDefinition);
    return svg;
};

async function initGrist(){
    grist.ready({ requiredAccess: 'read table', columns: ["mermaid"] });
    grist.onRecord(function (record) {
        const mapped = grist.mapColumnNames(record);
        const graphDefinition = mapped.mermaid;
        runMermaid(graphDefinition).then((svg) => {
            document.getElementById("mermaid-svg").innerHTML = svg;
        })
    });
}

document.addEventListener("DOMContentLoaded", initGrist)
