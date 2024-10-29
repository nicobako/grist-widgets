//@ts-check

/**
 * @interface
 */
function Item() {
    /** @type {Number | null} */
    this.id;

    /**@type {String} */
    this.title;

    /** @type {Item[]} */
    this.items;
}


/**
 * @returns {void}
 */
function initGrist() {
    grist.ready({
        requiredAccess: 'read table', columns: [
            {
                title: "Data",
                name: "data",
                description: "Column with the data, a dictionary with {children: list[dict[title, id]], parents: list[dict[title, id]]}."
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
            renderPage(mapped.data);
        } else {
            // Helper returned a null value. It means that not all
            // required columns were mapped.
            console.error("Please map all columns");
        }
    });

}

/**
 *
 * @param {any[]} data
 */
function renderPage(data) {
    console.log("rendering page", "data", data);
    const items = data.map((d)=>parseItem(d));
    const contentElement = document.getElementById("content");
    if (contentElement instanceof HTMLElement) {
        clearElement(contentElement);
        renderList(contentElement, items);
    }

}

/**
 *
 * @param {HTMLElement} element
 * @param {Item[]} items
 */
function renderList(element, items) {
    console.log("render list", element, items);
    const listElement = createUlElement()
    element.appendChild(listElement);
    addItemsToList(listElement, items);
}

/**
 *
 * @param {HTMLUListElement} listElement
 * @param {Item[]} items
*/
function addItemsToList(listElement, items) {
    items.forEach(item => {
        const listItem = document.createElement('li');
        console.log("item being added to list", item);
        const itemTextItem = renderItem(item);
        listItem.appendChild(itemTextItem);
        // listItem.textContent = item;
        listElement.appendChild(listItem);
        const childUlElement = createUlElement();
        listElement.appendChild(childUlElement);
        item.items.forEach((i)=>renderList(childUlElement, [i]))
    });
}

/**
 *
 * @returns {HTMLUListElement}
 */
function createUlElement(){
    return document.createElement("ul");
}

/**
 *
 * @param {HTMLElement} element
 */
function clearElement(element) {
    while (element?.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 *
 * @param {object} data
 * @returns {Item}
 */
function parseItem(data) {
    console.log("Parsing item", data)
    const item = {
        title: String(data.title),
        id: null,
        items: [],
    };
    if (data?.item){
        item.id = Number(data.id);
    }
    if (data.items){
        item.items=data.items.map((d)=>parseItem(d));
    }
    return item;
}

/**
 *
 * @param {Item} item
 * @returns
 */
function renderItem(item) {
    // const itemElement = document.createElement("button")
    // itemElement.classList.add("secondary");
    const itemElement = document.createElement("mark");
    itemElement.innerText = item.title;
    itemElement.addEventListener("click", function (ev) {
        console.log("item clicked", item, ev);
        grist.setCursorPos({ "rowId": item.id });
    });
    return itemElement;
}

/** @typedef {Object[]} */
const sampleData = [
    {
        title: "Sample Data",
        id: 1,
        items: [
            {
                title: "Children (no id)",
                items: [
                    {
                        title: "First Child",
                        id: 2,
                    },
                    {
                        title: "Second Child",
                        id:3,
                    },
                ]
            },
            {
                title: "Parents (no id)",
                items: [
                    {
                        title: "First Parent",
                        id:4,
                    }
                ]
            }
        ]
    },
    {
        title: "Other List",
        id: 5,
    }
]

document.addEventListener("DOMContentLoaded", initGrist);
// document.addEventListener("DOMContentLoaded", (ev)=>renderPage(sampleData));
