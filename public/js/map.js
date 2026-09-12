const mapElement = document.getElementById("map");

if (mapElement) {

    const latitude = Number(mapElement.dataset.lat);
    const longitude = Number(mapElement.dataset.lng);
    const title = mapElement.dataset.title || "Listing";

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {

        const map = L.map("map").setView(
            [latitude, longitude],
            13
        );

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        ).addTo(map);

        const marker = L.marker([
            latitude,
            longitude
        ]).addTo(map);

        marker.bindPopup(
            `<b>${title}</b><br>Exact Listing Location`
        );

        L.circle(
            [latitude, longitude],
            {
                radius: 1000
            }
        ).addTo(map);

    } else {
        console.warn("Map skipped: listing has no valid coordinates.");
    }
}
