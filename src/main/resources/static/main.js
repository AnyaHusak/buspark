// Завантаження даних при завантаженні сторінки
window.onload = function () {
    if (document.getElementById('inParkList') && document.getElementById('onRouteList')) {
        loadBusLists();
    }
};

function handleForm(event) {
    event.preventDefault();
    addBus();
}

function addBus() {
    const numberStr = document.getElementById('busNumber').value.trim();
    const driver = document.getElementById('driverName').value.trim();
    const route = document.getElementById('routeNumber').value.trim();

    if (!numberStr || !driver || !route) {
        alert("Будь ласка, заповніть усі поля.");
        return;
    }

    const number = parseInt(numberStr);
    if (isNaN(number) || number < 1) {
        alert("Номер автобуса має бути додатним числом.");
        return;
    }

    fetch('/api/buses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            number: number,
            driver: driver,
            route: route,
            onRoute: false
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Помилка: ${response.status} — ${text}`);
                });
            }
            alert("Автобус додано успішно!");
            location.reload();
        })
        .catch(error => {
            alert("Помилка при додаванні: " + error.message);
            const messageEl = document.getElementById('message');
            if (messageEl) {
                messageEl.textContent = error.message;
            }
        });
}

function departBus() {
    const number = parseInt(document.getElementById('departNumber').value);
    if (!number) {
        alert("Введіть номер автобуса.");
        return;
    }

    fetch(`/api/buses/depart/${number}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(success => {
            if (success) {
                alert("Автобус виїхав на маршрут.");
                location.reload();
            } else {
                alert("Не вдалося виїхати. Можливо, автобус уже на маршруті або не існує.");
            }
        })
        .catch(error => {
            alert("Помилка при виїзді: " + error.message);
            document.getElementById('message').textContent = error.message;
        });
}

function arriveBus() {
    const number = parseInt(document.getElementById('arriveNumber').value);
    if (!number) {
        alert("Введіть номер автобуса.");
        return;
    }

    fetch(`/api/buses/return/${number}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(success => {
            if (success) {
                alert("Автобус повернувся до парку.");
                location.reload();
            } else {
                alert("Не вдалося повернути. Можливо, автобус уже в парку або не існує.");
            }
        })
        .catch(error => {
            alert("Помилка при поверненні: " + error.message);
            document.getElementById('message').textContent = error.message;
        });
}

function loadBusLists() {
    fetch('/api/buses/in-park')
        .then(res => res.json())
        .then(buses => {
            const inParkList = document.getElementById('inParkList');
            inParkList.innerHTML = '';
            buses.forEach(bus => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';

                li.innerHTML = `
                    <span>#${bus.number} — ${bus.driver}, маршрут: ${bus.route}</span>
                    <div>
                        <button class="btn btn-sm btn-primary me-2" onclick='editBus(${JSON.stringify(bus)})'>Редагувати</button>
                        <button class="btn btn-sm btn-danger" onclick='deleteBus(${bus.number})'>Видалити</button>
                    </div>
                `;
                inParkList.appendChild(li);
            });
        });

    fetch('/api/buses/on-route')
        .then(res => res.json())
        .then(buses => {
            const onRouteList = document.getElementById('onRouteList');
            onRouteList.innerHTML = '';
            buses.forEach(bus => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';

                li.innerHTML = `
                    <span>#${bus.number} — ${bus.driver}, маршрут: ${bus.route}</span>
                    <div>
                        <button class="btn btn-sm btn-primary me-2" onclick='editBus(${JSON.stringify(bus)})'>Редагувати</button>
                        <button class="btn btn-sm btn-danger" onclick='deleteBus(${bus.number})'>Видалити</button>
                    </div>
                `;
                onRouteList.appendChild(li);
            });
        });
}

function loadFromFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Оберіть файл для завантаження.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.split('\n');
        lines.forEach(line => {
            const [numberStr, driver, route] = line.split(',').map(s => s.trim());
            const number = parseInt(numberStr);
            if (!number || !driver || !route) {
                console.warn("Пропущено рядок через неправильний формат:", line);
                return;
            }

            fetch('/api/buses/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: number,
                    driver: driver,
                    route: route,
                    onRoute: false
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Помилка: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error("Помилка при додаванні з файлу:", error.message);
                });
        });

        alert("Дані з файлу надіслано. Оновіть сторінку для перегляду.");
    };

    reader.readAsText(file);
}

function deleteBus(number) {
    if (!confirm("Ви впевнені, що хочете видалити автобус #" + number + "?")) return;

    fetch(`/api/buses/delete/${number}`, {
        method: 'DELETE'
    })
        .then(() => location.reload())
        .catch(err => alert("Помилка при видаленні: " + err.message));
}

function editBus(bus) {
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    document.getElementById('editBusNumber').value = bus.number;
    document.getElementById('editDriverName').value = bus.driver;
    document.getElementById('editRouteNumber').value = bus.route;
    document.getElementById('editOnRoute').checked = bus.onRoute;
    modal.show();
}

function saveEdit() {
    const number = document.getElementById('editBusNumber').value;
    const driver = document.getElementById('editDriverName').value;
    const route = document.getElementById('editRouteNumber').value;
    const onRoute = document.getElementById('editOnRoute').checked;

    fetch(`/api/buses/update/${number}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, driver, route, onRoute })
    })
        .then(() => location.reload())
        .catch(err => alert("Помилка при редагуванні: " + err.message));
}
window.onload = function () {
    if (document.getElementById('inParkList') && document.getElementById('onRouteList')) {
        loadBusLists();
    }

    const form = document.getElementById('busForm');
    if (form) {
        form.addEventListener('submit', handleForm);
    }
}