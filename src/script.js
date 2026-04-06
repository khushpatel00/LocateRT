const socket = io('http://192.168.5.182:8080/');
// let socketid = JSON.parse(sessionStorage.getItem('socketid') || 0)

if (window.navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude, speed } = position.coords
            socket.emit('send-location', { latitude, longitude, speed });
            console.log('sent coords to server!')
        }, (error) => {
            console.error(error)
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 500,
        }
    )
}

const map = L.map("map").setView([0, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)


const markers = {}


socket.on('recieve-location', (data) => {
    // console.log(data)
    const { id, latitude, longitude } = data
    map.setView([latitude, longitude], 15)
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else markers[id] = L.marker([latitude, longitude]).addTo(map);
    console.log('markers: ',markers)
})

socket.on('user-disconnect', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})