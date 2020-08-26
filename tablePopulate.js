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

var restPalette = 
    [['#ED1B24','#FAF600'],
    ['#FFC72C','#DA291C'],
    ['#702082','#A77BCA'],
    ['#DA291C','#0033A0','#F2A900'],
    ['#CF0A2B','#dd536a'],
    ['#A3080C','#F5D4B7'],
    ['#E51636','#Ef7386'],
    ['#066A36','#69A586'],
    ['#ff770f','#FFAD6F'],
    ['#E4011A','#B50A37'],
    ['#EF3B44','#FCDD2A','#97A8D3']];

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
    allRestaurants[restNum].sort(function (a, b) {
        return parseFloat(a.fitnessRatio) - parseFloat(b.fitnessRatio);
    })

    palColorLength = restPalette[restNum].length;

    backgroundInput = 'linear-gradient(-45deg,';

    for (var col = 0; col<palColorLength; col++){
        backgroundInput += restPalette[restNum][col];
        if(col<palColorLength -1){
            backgroundInput += ','
        }
        else{
            backgroundInput += ')';
        }
    }
    document.body.style.background = backgroundInput;

    document.getElementById("restName").innerHTML = allRestaurants[restNum][1].brand;

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