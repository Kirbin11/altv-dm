import * as alt from 'alt-client';
import * as native from 'natives';

const scale = 0.35;
const fontType = 4;
const r = 255;
const g = 0;
const b = 0;
const alpha = 255;
const useOutline = true;
const useDropShadow = false;
const zOffsetPerTick = 0.005;
const deleteAfterInSec = 3;
const audioVolume = 1; // 0 - 1

const output = new alt.AudioOutputFrontend();
const audio = new alt.Audio('./assets/hitmarker_sound.mp3', audioVolume);
audio.addOutput(output);

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean() {
    return Math.random() < 0.5;
}

alt.log('hitmarker loaded client');

function generateRandomValue() {
    let randomNumber = getRandomNumber(0, 4);
    const isNegative = getRandomBoolean();

    if (isNegative) {
        randomNumber = -randomNumber;
    }

    return randomNumber * 0.1;
}

alt.onServer('Hitmarker:Add', AddHitmarker);
function AddHitmarker(damage, position) {
    let xOffset = generateRandomValue();
    let yOffset = generateRandomValue();
    let zOffset = generateRandomValue();

    hitmarkerSet.add({
        damage: damage,
        x: position.x + xOffset,
        y: position.y + yOffset,
        z: position.z + zOffset,
        CreatedAt: Date.now(),
    });
    if (audio.playing) {
        audio.reset();
    }
    audio.play();
}

let hitmarkerSet = new Set();
const markedForDeletion = [];

alt.everyTick(() => {
    for (const hitmarker of hitmarkerSet) {
        if (Date.now() - hitmarker.CreatedAt >= deleteAfterInSec * 1000) {
            markedForDeletion.push(hitmarker);
        }

        hitmarker.z += zOffsetPerTick;
        drawText3d(
            hitmarker.damage,
            hitmarker.x,
            hitmarker.y,
            hitmarker.z,
            scale,
            fontType,
            r,
            g,
            b,
            alpha,
            useOutline,
            useDropShadow
        );
    }
    markedForDeletion.forEach((hitmarker) => hitmarkerSet.delete(hitmarker));
});

function drawText3d(
    msg,
    x,
    y,
    z,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true
) {
    native.setDrawOrigin(x, y, z, false);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
}

