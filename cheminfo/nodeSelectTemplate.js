// Get the names of the rows selected
let names = API.getData("rowsSelected").resurrect().map(x => x.name);

// Initialise the template (as temporary)
let tmp = "name\tcolour\tsize\n";

// Map over the names and make an empty row
names.map(n => tmp += `${n}\t\t\t\n`);

// Make the file to download
let file = new File([tmp], {type: "text/tab-separated-values;charset=utf-8"});

// Initialise the button and apply styles
let button = document.createElement("button");
button.style.fontFamily = "monospace";
button.style.display = "block";
button.style.borderRadius = 0;

// Apply innerHTML and onclick function
button.innerHTML = "Download visualisation parameter template";
button.onclick = (() => saveAs(file, "nodeVisTemplate.tsv"));

// Get the div sink for the button
let sink = document.getElementById("rowVisTempSink");

// Empty the sink before another run
sink.innerHTML = '';

// Append the button
sink.appendChild(button);
