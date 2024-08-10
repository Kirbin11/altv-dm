import alt from 'alt-client';
import * as native from 'natives';

const player = alt.Player.local;

let speedometr;
let speedometrObject;
let intervalSpeed;
let intervalFuel;

alt.on('enteredVehicle', (vehicle, seat) => {
    let speedoModel = 'prop_tv_flat_01_screen';
    let modelHash = native.getHashKey(speedoModel);
    let speedoTexture = 'script_rt_tvscreen';

    speedometrObject = native.createObjectNoOffset(
        modelHash,
        vehicle.pos.x,
        vehicle.pos.y,
        vehicle.pos.z,
        true,
        false,
        false
    );

    native.setEntityAlpha(speedometrObject, 240, false);

     native.attachEntityToEntity(
        speedometrObject,
        vehicle,
        native.getEntityBoneIndexByName(vehicle, 'door_pside_f'),
        0.6,
        -0.2,
        0.2,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        true,
        0
    );


    native.setEntityCollision(speedometrObject, false, true);
    alt.setTimeout(() => {
        speedometr = new alt.WebView(
            'http://resource/client/speedometr/index.html',
            modelHash,
            speedoTexture
        );
        intervalSpeed = alt.setInterval(() => {
            let color;
            let speed = (native.getEntitySpeed(vehicle.scriptID) * 3.6).toFixed();
            let maxSpeed = (native.getVehicleEstimatedMaxSpeed(vehicle) * 3.6).toFixed();
            if (speed > maxSpeed - 30) color = 'red';
            else if (speed > maxSpeed / 2 - 30) color = 'orange';
            else color = 'white';
            let health = native.getVehicleEngineHealth(vehicle);
            speedometr.emit('cef::speedometer:value', speed, color);
            //speedometr.emit('cef::speedometer:engine', health / 100);
           // speedometr.emit('cef::speedometer:speedo', (vehicle.rpm * 100).toFixed());
        }, 0);
    
        // let fuel = 100;
        // intervalFuel = alt.setInterval(() => {
        //     fuel--;
        //     speedometr.emit('cef::speedometer:fuel', fuel);
        // }, 500);
    }, 500);

    
});

alt.on('leftVehicle', (vehicle, seat) => {
    if (intervalSpeed) alt.clearInterval(intervalSpeed);
    if (intervalFuel) alt.clearInterval(intervalFuel);
    if (speedometr) speedometr.destroy();
    if (speedometrObject) native.deleteObject(speedometrObject);
});
