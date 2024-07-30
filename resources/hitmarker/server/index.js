import * as alt from 'alt-server';


alt.on('weaponDamage',(attacker, target, weaponHash, damage, offset, bodyPart) => {

        attacker.emit('Hitmarker:Add', damage.toString(), target.pos.add(offset));
  
    }
);