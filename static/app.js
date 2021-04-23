console.log("app.js is loaded");

// Initial code was given in office hours walkthrough by Instructor
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
            orientation: "h",
            marker: {color: "cd4d47"}
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
    console.log(`DrawBubblechart(${sampleID})`);

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



// This is a function to display the metadata values for the sample
function ShowMetadata(sampleID) {
    console.log(`ShowMetadata(${sampleID})`);

    // Remove old data if it exists
    d3.select("#sample-metadata")
        .selectAll("p")
        .remove();

    // Read JSON data
    d3.json("../data/samples.json").then(data => {
        // console.log(data);

        // Filter data by sample id
        var metadata = data.metadata;
        var resultArray = metadata.filter(metadata => metadata.id == sampleID);
        console.log(resultArray);

        var result = resultArray[0];
        console.log(result);

        var resultKeys = Object.keys(result);
        var resultValues = Object.values(result);

        // Select demographic panel
        var panel = d3.select("#sample-metadata");

        for (i in resultKeys) {
            panel.append("p").text(`${resultKeys[i]}: ${resultValues[i]}`);
        };
        // console.log(result.id);
        // panel.append("p").text(`ID: ${result.id}`);
        // panel.append("p").text(`Ethnicity: ${result.ethnicity}`);
        // panel.append("p").text(`Gender: ${result.gender}`);
        // panel.append("p").text(`Age: ${result.age}`);
        // panel.append("p").text(`Location: ${result.location}`);
        // panel.append("p").text(`Belly Button Type: ${result.bbtype}`);
        // panel.append("p").text(`Wash Frequency: ${result.wfreq}`);
          
    });     
}

// This is a function to draw a wash frequency guage
function DrawGuage(sampleID) {
    console.log(`DrawGuage(${sampleID})`);

    // Read JSON data
    d3.json("../data/samples.json").then(data => {
        // console.log(data);

        var metadata = data.metadata;
        var resultArray = metadata.filter(metadata => metadata.id == sampleID);
        // console.log(resultArray);

        var result = resultArray[0];
        // console.log(result);

        var data = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq,
            title: { text: "Washes per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                     steps: [
                         { range: [0, 1], color: "e7e7e7"},
                         { range: [1, 2], color: "e3dcd6"},
                         { range: [2, 3], color: "edd6c5"},
                         { range: [3, 4], color: "f0caae"},
                         { range: [4, 5], color: "f8c5a3"},
                         { range: [5, 6], color: "e49180"},
                         { range: [6, 7], color: "d77270"},
                         { range: [7, 8], color: "ca5659"},
                         { range: [8, 9], color: "cd4d47"}
                        ],
                     bar: { color: "black"}   
                    }
                    
            }
        ];
      
        var layout = { width: 600, height: 400 };
        Plotly.newPlot('gauge', data, layout);
    });
};

// This is a function that describes what to do when the input changes
function optionChanged(newSampleID) {
    console.log(`User selected ${newSampleID}`);

    DrawBargraph(newSampleID);
    DrawBubblechart(newSampleID);
    ShowMetadata(newSampleID);
    DrawGuage(newSampleID);
}

function InitDashboard() {
    console.log("InitDashboard");

    var selector = d3.select("#selDataset");

    d3.json("../data/samples.json").then(function(data) {
        // console.log(data);

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
        DrawGuage(id);
    });
}

InitDashboard();