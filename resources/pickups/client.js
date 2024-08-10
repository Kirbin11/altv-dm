import * as alt from "alt-client";
import * as native from "natives";
let pickups = {};
const STREAM_RANGE = 200;
const OBJECTS = {};
let LAST_POS = null;
let checkpoints = {};
function createObject(name, model, pos){
    pickups[name] = native.createObject(alt.hash(model), pos.x, pos.y, pos.z, false, false, false);
    native.freezeEntityPosition(pickups[name], true);
    native.setEntityCollision(pickups[name], false, false);
    const pos1 = new alt.Vector3(pos.x, pos.y, pos.z-1);
    checkpoints[name] = new alt.Checkpoint(47, pos1, pos1, 0.5, 2, alt.RGBA.green, alt.RGBA.green, STREAM_RANGE);
};

alt.on('resourceStop',()=>{
    for (const key in pickups) {
        const element = pickups[key];
        if (element && typeof element === "number") native.deleteObject(element)
    }
});

alt.onServer("pickups:create", (name, model, pos) => {
    OBJECTS[name] = {
        model,
        pos,
        created: false
    };
    if(LAST_POS) updatePlayerPos(LAST_POS.x, LAST_POS.y, LAST_POS.z);
       // else updatePlayerPos(pos.x, pos.y, pos.z);
});

function distance(pointA, pointB) {
    let dx = pointB.x - pointA.x;
    let dy = pointB.y - pointA.y;
    let dz = pointB.z - pointA.z;
    let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
    return dist;
}

function removeObject(name) {delete OBJECTS[name];};

function updatePlayerPos(x, y, z) {
    const pos = { x, y, z };
    LAST_POS = pos;
    for(const name in OBJECTS) {
        let object = OBJECTS[name];
        let dist = distance(pos, object.pos);
        if(!object.created && dist <= STREAM_RANGE) {
            object.created = true;
            createObject(name, object.model, object.pos);
        }
        else if(object.created && dist > STREAM_RANGE) {
            object.created = false;
            removeObject(name);
        }
    }
}

alt.onServer("pickups:remove", (name) => {
    let pickup = pickups[name];
    if(pickup) {
        native.deleteObject(pickup);
        delete pickups[name];
        checkpoints[name].destroy();
        delete checkpoints[name];
    }
});

native.setAudioFlag("LoadMPData", true);
alt.onServer("pickups:pickup", (sound, soundSet) => {
    native.playSoundFrontend(-1, sound, soundSet, true);
});

alt.everyTick(() => {
    let frametime = native.timestep();
    for(let name in pickups) {
        let obj = pickups[name];
        let rot = native.getEntityRotation(obj, 2);
        let pos = native.getEntityCoords(obj, true);
        native.setEntityRotation(obj, rot.x, rot.y, rot.z + (90 * frametime), 2, true);
        native.drawLightWithRangeex(pos.x, pos.y, pos.z, 255, 255, 255, 2.5, 3.5, 15.0);
    }
});
alt.setInterval(() => {
    let pos = alt.Player.local.pos;
    updatePlayerPos(pos.x, pos.y, pos.z);
}, 2000);