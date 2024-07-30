/* Visual Vehicle Spawner (1.0)
 * _dusieq#0404 (Discord), Enerv#6489 (Discord)
 * GPLv2 / MIT License
 */

import * as alt from 'alt';

//default = 1
//const limit = 1;

alt.onClient('playerGiveWeapon', (player, weapon) => {
    // if (player.vehicles.length >= limit) {
    //     player.vehicles[0].destroy();
    //     player.vehicles.splice(0, 1);
    // }

    //const vehicle = new alt.Vehicle(model, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    //alt.emitAllClients('vehicleSpawned', vehicle);
    //player.vehicles.push(vehicle);

    if(weapon == 'Bulletproof vest 50%') {
        player.armour = 50;
        player.setClothes(9, 12, 0);
    }
    else if (weapon == 'Bulletproof vest 100%') {
        player.armour = 100;
        player.setClothes(9, 16, 0);
    }
    else { 
        player.giveWeapon(alt.hash(weapon), 9999, true);
    }
    
});

// alt.on('playerConnect', (player) => {
//     //player.vehicles = [];
// });

// alt.on('playerDisconnect', (player) => {
//    //const vehicles = player.vehicles;

//     //vehicles.forEach(vehicle => {
//    //     vehicle.destroy();
//    // });
// });