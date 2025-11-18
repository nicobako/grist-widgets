import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.12.1/+esm";

async function initMermaid() {
  mermaid.initialize({ startOnLoad: false });
}

async function runMermaid(graphDefinition) {
  await initMermaid();
  const { svg } = await mermaid.render("graphDiv", graphDefinition);
  return svg;
}

function log(value) {
  console.log("Mermaid-Plugin", value);
}

async function initGrist() {
  grist.ready({ requiredAccess: "read table", columns: ["mermaid"] });
  grist.onRecord(function (record) {
    const mapped = grist.mapColumnNames(record);
    const graphDefinition = mapped.mermaid;
    log({ graphDefinition });
    runMermaid(graphDefinition).then((svg) => {
      log({ svg });
      document.getElementById("mermaid-svg").innerHTML = svg;
    });
  });
}

document.addEventListener("DOMContentLoaded", initGrist);

const testing = false;
if (testing) {
  const g = `---
title: "Grades"
---
radar-beta
  axis m["Math"], s["Science"], e["English"]
  axis h["History"], g["Geography"], a["Art"]
  curve a["Alice"]{85, 90, 80, 70, 75, 90}
  curve b["Bob"]{70, 75, 85, 80, 90, 85}

  max 100
  min 0
`;
  const t = await runMermaid(g);
  const el = document.getElementById("mermaid-test");
  el.innerHTML = t;
}
