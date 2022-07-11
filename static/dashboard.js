let mouse_x = 0;
let mouse_y = 0;

const labels = [
    {
        id: 'living-room',
        id_primary: undefined,
        sensor_id: 2,
        name: 'Living Room',
        top_left: {
            x: 358,
            y: 148
        },
        bottom_right: {
            x: 632,
            y: 325,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'office',
        id_primary: undefined,
        sensor_id: 1,
        name: 'Office',
        top_left: {
            x: 978,
            y: 149
        },
        bottom_right: {
            x: 1181,
            y: 299,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'lobby',
        id_primary: undefined,
        sensor_id: -1,
        name: 'Lobby',
        top_left: {
            x: 632,
            y: 151
        },
        bottom_right: {
            x: 804,
            y: 328,
        },
        color: 'red',
        selectable: true

    },
    {
        id: 'old-office',
        id_primary: undefined,
        sensor_id: -1,
        name: 'Old Office',
        top_left: {
            x: 806,
            y: 151
        },
        bottom_right: {
            x: 975,
            y: 326,
        },
        color: 'red',
        selectable: true

    },
    {
        id: 'garage',
        id_primary: undefined,
        sensor_id: -1,
        name: 'Garage',
        top_left: {
            x: 1219,
            y: 144
        },
        bottom_right: {
            x: 1459,
            y: 464,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'kitchen',
        id_primary: undefined,
        sensor_id: -1,
        name: 'Kitchen',
        top_left: {
            x: 360,
            y: 326
        },
        bottom_right: {
            x: 564,
            y: 504,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'scullery',
        id_primary: undefined,
        sensor_id: -1,
        name: 'Scullery',
        top_left: {
            x: 564,
            y: 379
        },
        bottom_right: {
            x: 665,
            y: 504,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'tv-room',
        id_primary: undefined,
        sensor_id: -1,
        name: 'TV Room',
        top_left: {
            x: 667,
            y: 381
        },
        bottom_right: {
            x: 976,
            y: 505,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'downstairs-bathroom',
        id_primary: undefined,
        sensor_id: -1,
        name: 'Downstairs Bathroom',
        top_left: {
            x: 1049,
            y: 353
        },
        bottom_right: {
            x: 1216,
            y: 443,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'downstairs-bedroom',
        id_primary: undefined,
        sensor_id: -1,
        name: 'Downstairs Bedroom',
        top_left: {
            x: 1047,
            y: 448
        },
        bottom_right: {
            x: 1218,
            y: 586,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'lucy-bedroom',
        id_primary: undefined,
        sensor_id: -1,
        name: "Lucy's Bedroom",
        top_left: {
            x: 1049,
            y: 587
        },
        bottom_right: {
            x: 1216,
            y: 720,
        },
        color: 'red',
        selectable: true
    },
    {
        id: 'hallway-1',
        id_primary: undefined,
        sensor_id: -1,
        name: "Hallway 1",
        top_left: {
            x: 564,
            y: 330
        },
        bottom_right: {
            x: 975,
            y: 379,
        },
        color: 'blue',
        selectable: false
    },
    {
        id: 'hallway-2',
        id_primary: 'hallway-1',
        sensor_id: -1,
        name: "Hallway 2",
        top_left: {
            x: 979,
            y: 297,
        },
        bottom_right: {
            x: 1046,
            y: 586,
        },
        color: 'blue',
        selectable: false
    },
    {
        id: 'hallway-3',
        id_primary: 'hallway-1',
        sensor_id: -1,
        name: "Hallway 3",
        top_left: {
            x: 1047,
            y: 303,
        },
        bottom_right: {
            x: 1216,
            y: 349,
        },
        color: 'blue',
        selectable: false
    },
    {
        id: 'hallway-4',
        id_primary: 'hallway-1',
        sensor_id: -1,
        name: "Hallway 4",
        top_left: {
            x: 911,
            y: 591,
        },
        bottom_right: {
            x: 1046,
            y: 633,
        },
        color: 'blue',
        selectable: false
    }
];

let sensorStatus = {};

const canvas = document.getElementById('canvas');

function contactApiForStatus(sensor_id) {
    console.log("Contacting API for sensor status for sensor_id: " + sensor_id);
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/sensors/${sensor_id}/status`);
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => {
            reject(xhr.statusText);
        };
        xhr.send();
    });
}

function loadSensorData() {
    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.sensor_id !== -1) {
            contactApiForStatus(label.sensor_id).then(status => {
                sensorStatus[label.sensor_id] = status;
            });
        }
    }

    //call again in 10 seconds
    setTimeout(loadSensorData, 10000);
}

function drawRoom(label) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = '6';
    ctx.strokeStyle = label.color;
    ctx.rect(label.top_left.x, label.top_left.y, label.bottom_right.x - label.top_left.x, label.bottom_right.y - label.top_left.y);
    ctx.stroke();
}

function initDashboard() {
    //improve resolution of the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function resetDashboard(callback) {
    console.log("Resetting dashboard");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw layout.png to canvas, resizing to fit
    const img = new Image();
    img.src = 'static/layout.png';
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // for each item in labels, draw a rectangle on the canvas
        for (let i = 0; i < labels.length; i++)
            drawRoom(labels[i])

        if (callback)
            callback();
    }
}

function addCanvasListeners() {
    //get position of mouse cursor inside of the canvas in x y coordinates
    canvas.addEventListener('mousemove', function(e) {
        let rect = canvas.getBoundingClientRect();
        scaleX = canvas.width / rect.width;
        scaleY = canvas.height / rect.height;

        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;

        mouse_x = x;
        mouse_y = y;
    });

    //when mouse is clicked, check if it is inside of a rectangle
    canvas.addEventListener('click', function(e) {
        const ctx = canvas.getContext('2d');
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            if (x > label.top_left.x && x < label.bottom_right.x && y > label.top_left.y && y < label.bottom_right.y) {
                console.log("Clicked on label: " + label.name);
                if (label.selectable) {
                    resetDashboard(function() {
                        console.log("drawing labels");
                        //change color of the rectangle to green
                        ctx.beginPath();
                        ctx.lineWidth = '6';
                        ctx.strokeStyle = 'green';
                        ctx.fillStyle = 'green';
                        ctx.fillRect(label.top_left.x, label.top_left.y, label.bottom_right.x - label.top_left.x, label.bottom_right.y - label.top_left.y);
                        ctx.stroke();

                        //write the current status of that room to the dashboard, set to "no data" if no data is available
                        let text;
                        if (label.sensor_id in sensorStatus) {
                            text = sensorStatus[label.sensor_id];
                        } else {
                            text = "no data";
                        }

                        console.log("Writing text: " + text);

                        //write write the sensor status in the middle of the rectangle
                        ctx.font = '30px Arial';
                        ctx.fillStyle = 'white';
                        ctx.fillText(text, label.top_left.x + 20, label.top_left.y + (label.bottom_right.y - label.top_left.y) / 2);
                        ctx.stroke();
                    });
                }
            }
        }
    });

    //print x and y coordinates of mouse cursor to console on click
    canvas.addEventListener('click', function(e) {
        console.log(`x: ${mouse_x} y: ${mouse_y}`);
    });
}


function main() {
    loadSensorData();
    initDashboard();
    resetDashboard(null);
    addCanvasListeners();
}

document.onload = main();