import * as alt from 'alt-server';

alt.log('hitmarker loaded server');

alt.on('weaponDamage',(attacker, target, weaponHash, damage, offset, bodyPart) => {
    alt.log("trigger hitmarker");
        attacker.emit('Hitmarker:Add', damage.toString(), target.pos);
  
    }
);