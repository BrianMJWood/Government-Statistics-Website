function getData() {

var data;
fetch("https://api.propublica.org/congress/v1/113/house/members.json", {

    method: "GET",
    headers: {
        'X-API-Key': "4rap2gEepM6ulnocIf4uVHRqYuOmKwMP9IO2MmAm"
    }
}).then(function (response) {

    if (response.ok) {
        return response.json();
    }
    throw new Error(response.statusText);
}).then(function (json) {
    data = json;

    members = data.results[0].members;

    printTable(members);

    var member = members.map(member => member.party);
    
                    localStorage.setItem("houseData", JSON.stringify(members));

                dataAge = Date.now();

                localStorage.setItem("Timestamp", dataAge);
    
function removeLoader() {
    var loader = document.getElementById("loader")
    loader.style.display = "none";
}

removeLoader();


}).catch(function (error) {
    console.log("Request failed: " + error.message);
});
    
}

function filterByState() {

    var stateArray = [];
    var chosenState = document.getElementById("stateFilter");
    var stateValue = chosenState.options[chosenState.selectedIndex].value;


    if (stateValue === ("Filter By State") || stateValue === ("ALL")) {
        filterByParty(members);
        return;

    } else {
        for (var i = 0; i < members.length; i++) {

            if (members[i].state === stateValue) {
                stateArray.push(members[i]);
            }
        }
        filterByParty(stateArray);
    }
}

function filterByParty(newArray) {

    var checkedBoxes = document.querySelectorAll('input[name=party]:checked');
    var filteredArray = [];

    var cb = Array.from(checkedBoxes);

    var partyArray = cb.map(input => input.value);


    if (partyArray.length == 0) {

        printTable(newArray);

    } else {

        for (var i = 0; i < newArray.length; i++) {

            if (partyArray.includes(newArray[i].party)) {

                filteredArray.push(newArray[i]);
            }
        }
        printTable(filteredArray);
    }
}

function printTable(array) {


    var tBody = document.getElementById("senateBody");

    tBody.innerHTML = "";
    
            if (array.length == 0) {
        tBody.innerHTML = "<p class='failState'>No members found.</p>";
            }
    for (i = 0; i < array.length; i++) {

        if (array[i].middle_name == null) {
            array[i].middle_name = " ";
        }

        var fullName = array[i].first_name + " " + array[i].middle_name + " " + array[i].last_name


        if (array[i].url == "") {
            var link = fullName
        } else {
            var link = document.createElement('a');
            link.setAttribute('href', (array[i].url));
            link.innerHTML = fullName;
        }

        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");
        var cell4 = document.createElement("td");
        var cell5 = document.createElement("td");

        cell1.append(link);
        cell2.append(array[i].party);
        cell3.append(array[i].state);
        cell4.append(array[i].seniority);
        cell5.append(array[i].votes_with_party_pct + "%");

        row.append(cell1, cell2, cell3, cell4, cell5);
        tBody.append(row);

    }

}

var timeStampNow = Date.now();

console.log(timeStampNow - localStorage.getItem("Timestamp"));


if (localStorage.getItem("houseData") && timeStampNow - localStorage.getItem("Timestamp") < 1800000) {
    members = JSON.parse(localStorage.getItem("houseData"));
    printTable(members);
    
function removeLoader() {
    var loader = document.getElementById("loader")
    loader.style.display = "none";
}

removeLoader();
    console.log("using local");
} else {
    getData();
    console.log("using fetch");

}


