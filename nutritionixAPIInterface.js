//Takes restaurant name and stores all data to CSV file
function extractData(restaurant) {
    //HTML passes in string of restaurant name
    //ex: Wendy's, McDonalds, Taco Bell, KFC, Chik Fila

    //information to pass into Nutritionix API
    var params = {
        "appId": "YOUR ID",
        "appKey": "YOUR KEY",
        "query": "NULL",
        "fields": ["item_name", "brand_name", "nf_calories", "nf_protein"],
        "sort": {
            "field": "_score",
            "order": "desc"
        },
        "filters": {
            "item_type": "1"
        },
        "limit": 50,
        "offset": 0
    }

    params.query = restaurant;

    //Header for CSV
    var restHeader = ['Brand', 'Item', 'Calories', 'Protein (g)', 'Fitness Ratio'];
    var restArray = [];

    var total;

    //initial fetch to pull total amount of search results for restaurant
    //can only pull up to 50 items per access to API in order to set iteration count for for loop
    fetch('https://api.nutritionix.com/v1_1/search', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params),
    })
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data2) {
            total = data2.total;
            storeToExcel();
        })

    function storeToExcel() {
        let accessCount = Math.ceil(total / params.limit);
        console.log(accessCount);
        if (accessCount > 10) {
            accessCount = 10;
        }

        for (let k = 0; k < accessCount; k++) {
            params.offset = k * 50;

            fetch('https://api.nutritionix.com/v1_1/search', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(params),
            })
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    for (i = 0; i < data.hits.length; i++) {
                        restArray.push([]);

                        //remove ',' from item names
                        var itemName = data.hits[i].fields.item_name;
                        var newItemName = itemName.replace(/,/g, '-');

                        //calculate fitness ratio: calories / protein
                        var fitnessRatio = data.hits[i].fields.nf_calories / data.hits[i].fields.nf_protein;
                        restArray[restArray.length - 1].push(data.hits[i].fields.brand_name, newItemName, data.hits[i].fields.nf_calories, data.hits[i].fields.nf_protein, fitnessRatio);
                    }
                    for (i = 0; i < restArray.length; i++) {
                        //remove items that have 0 calories, 0 grams of protein, and items not under restaurant of interest
                        if ((restArray[i][2] == 0) || (restArray[i][3] == 0) || (restArray[i][0] != params.query)) {
                            restArray.splice(i, 1);
                            i--;
                        }
                    }
                    //export csv excel file on last iteration of 'accessCount' for loop
                    if (k == (accessCount - 1)) {
                        export_csv(restHeader, restArray, ',', params.query)
                    }
                }
                )
        }
    }
    //takes in restaurant array to csv excel file to be downloaded
    function export_csv(arrayHeader, arrayData, delimiter, fileName) {
        let header = arrayHeader.join(delimiter) + '\n';
        let csv = header;
        arrayData.forEach(obj => {
            let row = [];
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    row.push(obj[key]);
                }
            }
            csv += row.join(delimiter) + "\n";
        });

        let csvData = new Blob([csv], { type: 'text/csv' });
        let csvUrl = URL.createObjectURL(csvData);

        let hiddenElement = document.createElement('a');
        hiddenElement.href = csvUrl;
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName + '.csv';
        hiddenElement.click();
    }
}