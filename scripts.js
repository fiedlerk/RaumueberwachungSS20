/* 
Rooms are read from TOP LEFT to BOTTOM RIGHT
Rooms exist in a table with 5 ROWS & 8 COLUMNS
Not all cells of the table are a room

There are 40 cells in the table with the following room layout

00 01 XX 02 03 XX 04 05
06 GG GG GG GG GG GG 07
08 09 XX 10 11 XX 12 13
14 15 XX 16 17 XX 18 19
20 21 XX 22 23 XX 24 25

XX = Table cell which is an empty space & not part of the building
GG = Hallway that goes between the 3 main buildings, "Gang"

The <td> tags are mapped with the above ids as a result of the above room layout

*/

//Static JSON test data
var testData = {
    "value": [
        {
            "PartitionKey": "device01",
            "RowKey": "al_illuminance",
            "Timestamp": "2020-05-25T10:56:29.2835352Z",
            "Device_Id": "device01",
            "Sensor_Id": "al_illuminance",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 212.63
        },
        {
            "PartitionKey": "device01",
            "RowKey": "aq_air_pressure",
            "Timestamp": "2020-05-25T10:56:29.4376445Z",
            "Device_Id": "device01",
            "Sensor_Id": "aq_air_pressure",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 968.04
        },
        {
            "PartitionKey": "device01",
            "RowKey": "aq_humidity",
            "Timestamp": "2020-05-25T10:56:29.3465797Z",
            "Device_Id": "device01",
            "Sensor_Id": "aq_humidity",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 39.1
        },
        {
            "PartitionKey": "device01",
            "RowKey": "aq_iaq_accuracy",
            "Timestamp": "2020-05-25T10:56:29.6507972Z",
            "Device_Id": "device01",
            "Sensor_Id": "aq_iaq_accuracy",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 3
        },
        {
            "PartitionKey": "device01",
            "RowKey": "aq_iaq_index",
            "Timestamp": "2020-05-25T10:56:29.3155579Z",
            "Device_Id": "device01",
            "Sensor_Id": "aq_iaq_index",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 94
        },
        {
            "PartitionKey": "device01",
            "RowKey": "aq_temperature",
            "Timestamp": "2020-05-25T10:56:29.5457216Z",
            "Device_Id": "device01",
            "Sensor_Id": "aq_temperature",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 24.62
        },
        {
            "PartitionKey": "device01",
            "RowKey": "baro_airpressure",
            "Timestamp": "2020-05-25T10:56:29.5747419Z",
            "Device_Id": "device01",
            "Sensor_Id": "baro_airpressure",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 970.027
        },
        {
            "PartitionKey": "device01",
            "RowKey": "baro_altitude",
            "Timestamp": "2020-05-25T10:56:29.4056222Z",
            "Device_Id": "device01",
            "Sensor_Id": "baro_altitude",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 500.929
        },
        {
            "PartitionKey": "device01",
            "RowKey": "baro_temperature",
            "Timestamp": "2020-05-25T10:56:29.4916828Z",
            "Device_Id": "device01",
            "Sensor_Id": "baro_temperature",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 25.6
        },
        {
            "PartitionKey": "device01",
            "RowKey": "hum_humidity",
            "Timestamp": "2020-05-25T10:56:29.4646634Z",
            "Device_Id": "device01",
            "Sensor_Id": "hum_humidity",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 39.41
        },
        {
            "PartitionKey": "device01",
            "RowKey": "hum_temperature",
            "Timestamp": "2020-05-25T10:56:29.5167008Z",
            "Device_Id": "device01",
            "Sensor_Id": "hum_temperature",
            "TimeStamp": "2020-05-25T10:56:28Z",
            "Value": 25.43
        }
    ]
}




/**
 * Function that updates a room Element attribute by a new value
 * @param {*} roomHTML - The HTML tag id of the room 
 * @param {*} type - the type of data (temperature, infrared) to be changed
 * @param {*} value - the new value
 */
function updateRoomElementAttribute(roomHTML, type, value) {
    switch (type) {
        case "aq_temperature":
            document.getElementById(roomHTML).setAttribute("data-temperature", value);
            break;
        case "hum_humidity":
            document.getElementById(roomHTML).setAttribute("data-humidity", value);
            break;
        case "al_illuminance":
            document.getElementById(roomHTML).setAttribute("data-illuminance", value);
            break;
        case "aq_iaq_index":
            document.getElementById(roomHTML).setAttribute("data-airquality", value);
            break;

        default:
        // Error code
    }

}

/**
 * Function that updates the background colour of a room Element based on its infrared attribute
 * @param {*} roomHTML - The HTML tag id of the room 
 */
function updateRoomElementColour(roomHTML) {
    if (document.getElementById(roomHTML).getAttribute("data-temperature") > 0) {
        document.getElementById(roomHTML).style = "background-color: #ea9999";
    } else {
        document.getElementById(roomHTML).style = "background-color: #b6d7a8";
    }

}

/**
 * Updates page HTML elements by going through the JSON array, and changing Room HTML attributes according to sensor type & value
 * @param {*} json - the json data recieved by the API call
 */
function updatePageData(json) {
    console.log(json);
    console.log(json.value);
    console.log(json.value[0]);
    //var data = JSON.parse(json);
    //var values = data.value;
    var values = json.value;
    console.log(values);
    for (i = 0; i < values.length; i++) {
        var room = values[i].Device_Id;                     // Device_Id returns in the format "device01"
        var type = values[i].Sensor_Id;                     // Sensor_Id returns the type of sensor
        var value = values[i].Value;
        console.log("In the room " + room);
        console.log("sensor of type " + type);
        console.log("shows a value of " + value);

        // IF AND ONLY IF DEVICEIDs ARE MAPPED TO ROOM MAPPING, IF NOT CREATE A FUNCTION TO MAP OUT
        // var roomHTML = getRoomElement(room);
        var roomHTML = room;
        console.log("The HTML tag id for this room is " + roomHTML);
        updateRoomElementAttribute(roomHTML, type, value);

    }
}


/**
 * Goes through all room elements & updates their CSS based on their infrared
 */
function updatePageCSS() {
    for (i = 0; i < 25; i++) {
        if (i < 10) {
            // Device ids are double digited i.e 01, 02 up till 09
            updateRoomElementColour("device0" + i);
        } else {
            updateRoomElementColour("device" + i);
        }

    }
}



// Code Flow

setInterval(() => { updateSensorData() }, 10000);
setInterval(() => { updatePageCSS() }, 10000);
setInterval(() => { console.log("10 seconds done") }, 10000);

// POSTMAN Code
function updateSensorData() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json;odata=nometadata");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        credentials: 'same-origin',
        redirect: 'follow',
        mode: 'cors'
    };

    fetch("http://getfromtable.azurewebsites.net/api/getfromtable", requestOptions)
        .then(response => response.text())
        .then(result => updatePageData(result))
        .catch(error => console.log('error', error));
    document.getElementById("test").innerHTML = result;
}

function fetchSensorData() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "text/plain");

    var raw = "{url=\"https://storageraumueberwachung.table.core.windows.net/Last2()?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2023-07-31T22:47:36Z&st=2020-05-13T14:47:36Z&spr=https&sig=4skbsTU9tMlfSqFJhB1rTw16nVRIA6EVzxEkCmrNneE%3D\"}";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        credentials: 'same-origin',
        redirect: 'follow',
        mode: 'no-cors'
    };

    fetch("http://getfromtable.azurewebsites.net/api/getfromtable", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

fetchSensorData();








//Deprecetiated functions

/**
 * Function that takes in the Room ID and returns the mapped HTML table tag id for that room
 * @param room - roomID of the room
 */
function getRoomElement(room) {
    var roomHTML = "td" + room;
    return roomHTML;
}

/*
Page loop where page is updated every 5 minutes
*/

function loopPage() {
    while (true) {

    }
}

/*
Updates Page data & then CSS
*/

function updatePage(json) {
    updatePageData(json);
    updatePageCSS();
}

/**
 * Fetches sensor data from URL
 * @param url - Full URL for API sensor data request
 */
function fetchSensorData(url) {
    var response = fetch(url);
    var json = response.json();
};