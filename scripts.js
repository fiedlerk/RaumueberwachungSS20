/* 
Rooms are read from TOP LEFT to BOTTOM RIGHT
Rooms exist in a table with 4 ROWS & 8 COLUMNS
Not all cells of the table are a room

There are 48 cells in the table with the following room layout & 24 Rooms

00 01 XX 02 03 XX 04 05
06 GG GG GG GG GG GG 07
08 09 XX 10 11 XX 12 13
14 15 XX 16 17 XX 18 19
XX XX XX XX XX XX XX XX
20 21 22 23 XX XX XX XX


XX = Table cell which is an empty space & not part of the building
GG = Hallway that goes between the 3 main buildings, "Gang"

The <td> tags are mapped with the above ids as a result of the above room layout

*/
// Number of Rooms must always be set to a new number if the number of rooms in the HTML layout change, default mode is infrared
var numberOfRooms = 24;
var currentMode = "infrared";

//Static JSON test data to locally test the website
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


// POSTMAN Code
function updateSensorData() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json;odata=nometadata");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        credentials: 'omit',
        redirect: 'follow',
        mode: 'cors'
    };

    fetch("https://getfromtable.azurewebsites.net/api/getfromtable", requestOptions)
        .then(response => response.text())
        .then(result => updatePageData(result))
        .catch(error => console.log('error', error));

}


/**
 * Function that updates a room Element data attribute by a new value
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
        case "motion_detector":
            document.getElementById(roomHTML).setAttribute("data-infrared", value);
            break;
    }

}

/**
 * Function that updates the background colour of a room Element based on its infrared attribute
 * @param {*} roomHTML - The HTML tag id of the room 
 */
function updateRoomElementColour(roomHTML) {
    var infrared = parseInt(document.getElementById(roomHTML).getAttribute("data-infrared"));
    if (infrared > 0) {
        document.getElementById(roomHTML).style = "background-color: #ea9999";
    } else {
        document.getElementById(roomHTML).style = "background-color: #b6d7a8";
    }

}

/**
 * Function that updates the colour of a text Element & boldness based on the sensor data ranges
 * This only applies for the cases of temperature, illuminance & airquality
 * @param {*} roomHTML - The HTML tag id of the room 
 */
function updateTextElementColour(roomHTML, mode) {
    // Extract date and store into variables for readability
    var temperature = document.getElementById(roomHTML).getAttribute("data-temperature");
    var illuminance = document.getElementById(roomHTML).getAttribute("data-illuminance");
    var airquality = document.getElementById(roomHTML).getAttribute("data-airquality");
    var innerHTML = document.getElementById(roomHTML).innerHTML;

    // Parse data into integers as they are stored as strings
    var temperature = parseInt(temperature);
    var illuminance = parseInt(illuminance);
    var airquality = parseInt(airquality);

    // Temperature Warning Visualisation
    if (mode == "temperature" && temperature > 22) {
        document.getElementById(roomHTML).style.fontWeight = "bold";
        document.getElementById(roomHTML).style.color = "#cc4125";
        console.log("ja also funktioniert doch");

    } else if (mode == "temperature" && temperature < 10) {
        document.getElementById(roomHTML).style.color = "#0b5394";
    } else {
        document.getElementById(roomHTML).style.color = "#000000";
    }

    // Illuminance Warning Visualisation
    if (mode == "illuminance" && illuminance > 500) {
        document.getElementById(roomHTML).style.color = "#ffffff";
        document.getElementById(roomHTML).style.fontWeight = "bold";
    } else if (mode == "illuminance") {
        document.getElementById(roomHTML).style.color = "#000000";
    }

    // Air Quality Warning Visualisation
    if (mode == "airquality" && airquality > 100) {
        document.getElementById(roomHTML).style = "color: #783f04; font-weight: bold";
    } else if (currentMode == "airquality") {
        document.getElementById(roomHTML).style = "color: #000000";
    }
}

/**
 * Updates page HTML elements by going through the JSON array, and changing Room HTML attributes according to sensor type & value
 * @param {*} json - the json data recieved by the API call
 */
function updatePageData(json) {
    console.log(json);
    var data = JSON.parse(json);

    console.log(data.value[0]);
    var values = data.value;
    console.log(values);
    console.log("This is the first value:" + values[0]);

    for (i = 0; i < values.length; i++) {
        var room = values[i].Device_Id;                     // Device_Id returns in the format "device01"
        var type = values[i].Sensor_Id;                     // Sensor_Id returns the type of sensor
        var value = values[i].Value;
        console.log("In the room " + room + "with sensor of type " + type + "shows a value of " + value);

        // IF AND ONLY IF DEVICEIDs ARE MAPPED TO ROOM MAPPING, IF NOT CREATE A FUNCTION TO MAP OUT
        // var roomHTML = getRoomElement(room);
        var roomHTML = room;
        console.log("The HTML tag id for this room is " + roomHTML);
        updateRoomElementAttribute(roomHTML, type, value);

    }
}


/**
 * Goes through all room elements & updates their CSS based on their infrared value
 */
function updatePageCSS(mode) {
    for (i = 0; i < numberOfRooms; i++) {
        if (i < 10) {
            // Device ids are double digited i.e 01, 02 up till 09
            updateRoomElementColour("device0" + i);
            updateTextElementColour("device0" + i, mode);
        } else {
            updateRoomElementColour("device" + i);
            updateTextElementColour("device" + i, mode);
        }

    }
}




/**
 * Updates innerHTML of all Room elements depending on the current mode
 */

function updateInnerHTML(mode) {
    switch (mode) {
        case "infrared":
            var roomNames = ["W1.5.06", "W1.5.05", "W1.5.04", "W1.5.03", "W1.5.02", "W1.5.01",
                "W1.4.06", "W1.4.01",
                "W1.3.06", "W1.3.05", "W1.3.04", "W1.3.03", "W1.3.02", "W1.3.01",
                "W1.2.06 PC", "W1.2.05", "W1.2.04", "W1.2.03", "W1.2.02", "W1.2.01",
                "W2.2.24 PC", "W2.2.12 PC", "W2.2.03 PC", "W2.2.02 PC"];
            for (i = 0; i < numberOfRooms; i++) {
                if (i < 10) {
                    // Device ids are double digited i.e 01, 02 up till 09
                    document.getElementById("device0" + i).innerHTML = roomNames[i];
                } else {
                    document.getElementById("device" + i).innerHTML = roomNames[i];
                }
            }
            updatePageCSS(currentMode);
            break;
        case "temperature":
            for (i = 0; i < numberOfRooms; i++) {
                if (i < 10) {
                    // Device ids are double digited i.e 01, 02 up till 09
                    var temperature = document.getElementById("device0" + i).getAttribute("data-temperature");
                    document.getElementById("device0" + i).innerHTML = temperature + " °C";
                } else {
                    var temperature = document.getElementById("device" + i).getAttribute("data-temperature");
                    document.getElementById("device" + i).innerHTML = temperature + " °C";
                }
            }
            updatePageCSS(currentMode);
            break;
        case "airquality":
            for (i = 0; i < numberOfRooms; i++) {
                if (i < 10) {
                    // Device ids are double digited i.e 01, 02 up till 09
                    var airquality = document.getElementById("device0" + i).getAttribute("data-airquality");
                    document.getElementById("device0" + i).innerHTML = airquality + " IAQ";
                } else {
                    var airquality = document.getElementById("device" + i).getAttribute("data-airquality");
                    document.getElementById("device" + i).innerHTML = airquality + " IAQ";
                }
            }
            updatePageCSS(currentMode);
            break;
        case "illuminance":
            for (i = 0; i < numberOfRooms; i++) {
                if (i < 10) {
                    // Device ids are double digited i.e 01, 02 up till 09
                    var illuminance = document.getElementById("device0" + i).getAttribute("data-illuminance");
                    document.getElementById("device0" + i).innerHTML = illuminance + " Lux";
                } else {
                    var illuminance = document.getElementById("device" + i).getAttribute("data-illuminance");
                    document.getElementById("device" + i).innerHTML = illuminance + " Lux";
                }
            }
            updatePageCSS(currentMode);
            break;

    }


}

// Code Flow
//Initialisation when page is first opened
updateSensorData()
// 5 minute interval for every API call
setInterval(() => { updateSensorData() }, 300000);

// CSS & Page Inner HTML updated on a 10 second basis
setInterval(() => { updatePageCSS(currentMode); updateInnerHTML(currentMode); }, 10000);



// Unused Functions

/**
 * Function that changes the mode & updates the page instantly to disply that mode's information
 * @param {*} newMode 
 */
function changeMode(newMode) {
    updatePageCSS(newMode);
    updateInnerHTML(newMode);
}