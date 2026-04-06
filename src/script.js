const socket = io('https://locatert-1.onrender.com/');
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
            timeout: 5000,
        }
    )
}

const map = L.map("map").setView([0, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
L.marker([21.2343602, 72.8666841]).addTo(map)

const markers = {}

var staticIcon = L.icon({
    iconUrl: 'src/images/leaf-green.png',
    shadowUrl: 'src/images/leaf-shadow.png',

    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


socket.on('recieve-location', (data) => {
    // console.log(data)
    const { id, latitude, longitude } = data
    map.setView([latitude, longitude], 18)
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);

    } else markers[id] = L.marker([latitude, longitude], {icon: staticIcon}).addTo(map);
    console.log('markers: ', markers)
})

socket.on('user-disconnect', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})