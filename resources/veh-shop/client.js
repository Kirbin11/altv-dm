/* Visual Vehicle Spawner (1.0)
 * _dusieq#0404 (Discord), Enerv#6489 (Discord)
 * GPLv2 / MIT License
 */

import * as alt from 'alt';
import * as native from 'natives';

let loaded = false;
let opened = false;

const view = new alt.WebView('http://resource/html/index.html');

function menu(toggle) {
    opened = toggle;

    alt.showCursor(toggle);
    alt.toggleGameControls(!toggle);

    if (toggle) {
        view.focus();
    } else {
        view.unfocus();
    }

    view.emit('menu', toggle);
}

function promisify(callback) {
    return new Promise((resolve, reject) => {
        let loader = alt.setInterval(() => {
            if (callback() == true) {
                resolve(true);
                alt.clearInterval(loader);
            }
        }, 80);
    });
}

view.on('ready', () => {
    loaded = true;
});

view.on('menu', (toggle) => {
    menu(toggle);
});

view.on('select', (model) => {
    alt.emitServer('playerSpawnVehicle', model);
});

alt.on('keyup', (key) => {
    if (!loaded) return;

    //if (key === 113) {
    //    menu(!opened);
   // } else 
   if (opened && key === 0x1B) {
        menu(false);
    }
});

alt.onServer('chooseVehicle', () => {
    menu(!opened);
});

alt.onServer('setPedIntoVehicle', async (vehicle) => {
    const player = alt.Player.local;
    await promisify(() => {
        if (player.vehicle) return true;
        native.setPedIntoVehicle(player.scriptID, vehicle.scriptID, -1);
    });
    menu(false);
});

alt.onServer('vehicleSpawned', (vehicle) => {
    native.setEntityCompletelyDisableCollision(vehicle, true, true);
});