const getLocationButton = document.getElementById('getLocationButton');
const statusDisplay = document.getElementById('status');
const coordinatesDisplay = document.getElementById('coordinates');
const coordinatesList = document.getElementById('coordinatesList');

let collectedCoordinates = []; 

function renderCoordinatesList() {
    coordinatesList.innerHTML = ''; // Limpa a lista antes de renderizar
    if (collectedCoordinates.length === 0) {
        coordinatesList.innerHTML = '<li>Nenhuma coordenada coletada ainda.</li>';
        return;
    }

    collectedCoordinates.slice().reverse().forEach((coord) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>[${coord.latitude}, ${coord.longitude}]</span>
        `;
        coordinatesList.appendChild(listItem);
    });
}

renderCoordinatesList();

getLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        statusDisplay.textContent = 'Obtendo localização...';
        coordinatesDisplay.innerHTML = '';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                statusDisplay.textContent = 'Localização obtida com sucesso!';
                coordinatesDisplay.innerHTML = `
                    <span>[${latitude},${longitude}]</span><br>
                    <br>
                    <a href="https://maps.google.com/?q=${latitude},${longitude}" target="_blank">Ver no Google Maps</a>
                `;

                collectedCoordinates.push({ latitude, longitude });

                renderCoordinatesList();
            },
            (error) => {
                statusDisplay.textContent = 'Erro ao obter localização.';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        coordinatesDisplay.textContent = "Usuário negou a requisição de Geolocalização.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        coordinatesDisplay.textContent = "Informações de localização indisponíveis.";
                        break;
                    case error.TIMEOUT:
                        coordinatesDisplay.textContent = "A requisição para obter a localização expirou.";
                        break;
                    case error.UNKNOWN_ERROR:
                        coordinatesDisplay.textContent = "Um erro desconhecido ocorreu.";
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        statusDisplay.textContent = 'Geolocalização não é suportada por este navegador.';
    }
});