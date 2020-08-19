function getUnique(arr, comp) {

    // store the comparison  values in array
    const unique = arr.map(e => e[comp])

        // store the indexes of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the false indexes & return unique objects
        .filter((e) => arr[e]).map(e => arr[e]);

    return unique;
}

var request = new XMLHttpRequest();
var restaurants = [
    "Wendy's.csv",
    "McDonald's.csv",
    "Taco Bell.csv",
    "Burger King.csv",
    "Five Guys.csv",
    "KFC.csv",
    "Chick-fil-A.csv",
    "Wingstop.csv",
    "Whataburger.csv",
    "Jack in the Box.csv",
    "Sonic.csv"
];
var restColors = ['#ED1B24', '#FFC72C', '#702082', "#F2A900"];

var allRestaurants = new Array(restaurants.length);

var obj = {
    'brand': null,
    'item': null,
    'cals': 0,
    'protein': 0,
    'fitnessRatio': 0.0,
}

for (var count = 0; count < restaurants.length; count++) {
    request.open("GET", restaurants[count], false);
    request.send(null);

    var jsonObject = request.responseText.split(/\r?\n|\r/);
    allRestaurants[count] = new Array(jsonObject.length - 1);

    obj = {
        'brand': 'Bodybuilder Staple',
        'item': 'Chicken Breast',
        'cals': 126,
        'protein': 25,
        'fitnessRatio': parseFloat(126 / 25).toFixed(2),
    }
    allRestaurants[count].push(obj);
    for (var i = 1; i < jsonObject.length - 1; i++) {
        var value = jsonObject[i].split(',');
        protein = parseInt(value[3]);

        if (protein > 4) {
            obj = {
                'brand': value[0],
                'item': value[1],
                'cals': parseInt(value[2]),
                'protein': parseInt(value[3]),
                'fitnessRatio': parseFloat(value[4]).toFixed(2),
            }
            allRestaurants[count].push(obj);
        }
    }
    allRestaurants[count] = getUnique(allRestaurants[count], 'item');
}

function populateTable(restNum) {
    //console.log(allRestaurants[restNum]);
    allRestaurants[restNum].sort(function (a, b) {
        return parseFloat(a.fitnessRatio) - parseFloat(b.fitnessRatio);
    })

    var header = document.getElementsByTagName('th');
    for (var z = 0; z < Object.keys(obj).length - 1; z++) {
        header[z].style.backgroundColor = restColors[restNum];
    }

    buildTable(allRestaurants[restNum])

    function buildTable(data) {

        var table = document.getElementById('myTable');
        table.innerHTML = ''
        for (var j = 0; j < data.length - 1; j++) {
            var row = `<tr>
                        <td>${data[j].item}</td>
                        <td>${data[j].cals}</td>
                        <td>${data[j].protein}</td>
                        <td>${data[j].fitnessRatio}</td>
                  </tr>`
            table.innerHTML += row
        }
    }
}