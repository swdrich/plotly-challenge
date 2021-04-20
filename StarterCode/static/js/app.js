console.log("app.js is loaded");

// Initial code was given in office hours walkthrough by Dom
// This includes the DrawBargraph Function and the InitDashboard Function, as well as tips and tricks for structure

// This is a function to draw a bar chart of the top ten bacterial samples
function DrawBargraph(sampleID) {
    console.log(`DrawBargraph(${sampleID})`);

    // Read JSON data
    d3.json("../data/samples.json").then(data => {
        // console.log(data);
        
        // Filter data by sample id
        var samples = data.samples;
        var resultArray = samples.filter(sample => sample.id == sampleID);
        // console.log(resultArray);

        var result = resultArray[0];
        // console.log(result);
        
        // Assign variables
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Get top ten samples
        yticks = otu_ids.slice(0, 10)
            .map(otuID => `OTU ${otuID}`); //TBD

        // Define parameters for graph
        var barData = {
            x: sample_values.slice(0, 10).reverse(), //TBD
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0, 10).reverse(), // TBD
            orientation: "h"
        };

        var barArray = [barData];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        // Draw chart
        Plotly.newPlot("bar", barArray, barLayout);
    })
}

// This is a function to draw a bubble chart of all the data per sample
function DrawBubblechart(sampleID) {
    // console.log(`DrawBubblechart(${sampleID})`);

    // Read JSON data
    d3.json("../data/samples.json").then(data => {
        // console.log(data);

        // Filter data by sample id
        var samples = data.samples;
        var resultArray = samples.filter(sample => sample.id == sampleID);
        // console.log(resultArray);

        var result = resultArray[0];
        // console.log(result);

        // Assign variables
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Define parameters for chart
        var bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values
            }
        };

        var bubbleArray = [bubbleData];

        var bubbleLayout = {
            title: "Distribution of Bacterial Cultures Found"
        };

        // Draw chart
        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);
    })
}


// This is a helper function to unpack data from the metadata
function unpack(key, value) {
    return key.map(function(key) {
        return key[value];
    });
}

// This is a function to display the metadata values for the sample
function ShowMetadata(sampleID) {
    console.log(`ShowMetadata(${sampleID})`);

    // Read JSON data
    d3.json("../data/samples.json").then(data => {
        console.log(data);

        // Filter data by sample id
        var metadata = data.metadata;
        var resultArray = metadata.filter(metadata => metadata.id == sampleID);
        console.log(resultArray);

        var result = resultArray[0];
        console.log(result);

        // Select demographic panel
        var ul = d3.select("#sample-metadata").append("ul");

        var selection = ul.selectAll("li")
            .data(result)
            .enter()
            .append("li")
            .text(function (d) {
                return d;
            });
            
    })
        // var panelList = panel.select("ul");
        // var prow;
        // for (var i=0; i<7; i++) {
        //     console.log(result.id);
        //     prow = panelList.append("li");
        //     prow.append("li").text(result.id);
        //     prow.append("li").text(result.ethnicity);
        //     prow.append("li").text(result.gender);
        //     prow.append("li").text(result.age);
        //     prow.append("li").text(result.location);
        //     prow.append("li").text(result.bbtype);
        //     prow.append("li").text(result.wfreq);
        
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