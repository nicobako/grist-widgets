import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.12.1/+esm";

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

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

function initGrist() {
  grist.ready({ requiredAccess: "read table", columns: ["mermaid"] });
  grist.onRecord(function (record) {
    log({ record });
    const mapped = grist.mapColumnNames(record);
    log({ mapped });
    const graphDefinition = mapped.mermaid;
    log({ graphDefinition });
    runMermaid(graphDefinition).then((svg) => {
      log({ svg });
      document.getElementById("mermaid-svg").innerHTML = svg;
    });
  });
}

ready(initGrist);

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
