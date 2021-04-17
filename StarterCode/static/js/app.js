console.log("app.js is loaded");

// Initial code was given in office hours walkthrough by Dom

function DrawBargraph(sampleID) {
    console.log(`DrawBargraph(${sampleID})`);

    d3.json("../data/samples.json").then(data => {
        console.log(data);

        var samples = data.samples;
        var resultArray = samples.filter(sample => sample.id == sampleID);
        console.log(resultArray);

        var result = resultArray[0];
        console.log(result);

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        yticks = otu_ids.slice(0, 10)
            .map(otuID => `OTU ${otuID}`); //TBD

        var barData = {
            x: sample_values.slice(0, 10).reverse(), //TBD
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0, 10).reverse(), // TBD
            orientation: "h"
        }

        var barArray = [barData];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        }

        Plotly.newPlot("bar", barArray, barLayout);
    })
}

function DrawBubblechart(sampleID) {
    console.log(`DrawBubblechart(${sampleID})`);
}

function ShowMetadata(sampleID) {
    console.log(`ShowMetadata(${sampleID})`);
}

function optionChanged(newSampleID) {
    console.log(`User selected ${newSampleID}`);

    DrawBargraph(newSampleID);
    DrawBubblechart(newSampleID);
    ShowMetadata(newSampleID);
}

function InitDashboard() {
    console.log("InitDashboard");

    var selector = d3.select("#selDataset");

    d3.json("../data/samples.json").then(function(data) {
        console.log(data);

        var sampleNames = data.names;

        sampleNames.forEach(sampleID => {
            selector.append("option")
            .text(sampleID)
            .property("value", sampleID);
        });

        var id = sampleNames[0];

        DrawBargraph(id);
        DrawBubblechart(id);
        ShowMetadata(id);
    });
}

InitDashboard();