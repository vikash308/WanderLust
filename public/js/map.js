// Use the global window variables
const coords = window.listingCoordinates;
const title = window.listingTitle;
const locations = window.listingLocation;
const country = window.listingCountry;

console.log(coords[1]);

// Initialize map
const map = L.map('map').setView([coords[0],coords[1]], 10);

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Marker
L.marker([coords[0],coords[1]])
  .addTo(map)
  .bindPopup(`<b>${title}</b><br>${locations}, ${country}`)
  .openPopup();
