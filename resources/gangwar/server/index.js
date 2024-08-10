import * as alt from "alt-server";
import * as chat from "chat";
import fs from "fs";
import { resolve, dirname } from "path";

const __dirname = dirname(decodeURI(new URL(import.meta.url).pathname)).replace(/^\/([A-Za-z]):\//, "$1:/");
let blacklistData = {};
if (fs.existsSync(__dirname + "/blacklist.json")) {
  blacklistData = JSON.parse(fs.readFileSync(__dirname + "/blacklist.json").toString());
}

function addToBlacklist(info) {
  blacklistData[info] = true;
  fs.writeFileSync(__dirname + "/blacklist.json", JSON.stringify(blacklistData, null, 4));
}

// const vehicles = {
//   ballas: ["karby"],
//   families: ["faction2", "blade", "gauntlet", "impaler"],
//   vagos: ["ellie", "chino", "dukes", "impaler"],
// };

const weapons = {
  WEAPON_INFINITYBLADE: "Infinity Blade",
  WEAPON_KNIFE: "Knife",
  WEAPON_BAT: "Bat",
  WEAPON_BOTTLE: "Bottle",
  WEAPON_WRENCH: "Wrench",
  WEAPON_PISTOL: "Pistol",
  WEAPON_HEAVYPISTOL: "Heavy pistol",
  WEAPON_REVOLVER: "Revolver",
  WEAPON_MICROSMG: "Micro-SMG",
  WEAPON_SMG: "SMG",
  WEAPON_COMBATPDW: "Combat PDW",
  WEAPON_ASSAULTRIFLE: "Assault Rifle",
  WEAPON_CARBINERIFLE: "Carbin Rifle",
  WEAPON_PUMPSHOTGUN: "Pump Shotgun",
  WEAPON_GRENADE: "Grenade",
  WEAPON_RAMMED_BY_CAR: "Jumped out of car",
  WEAPON_RUN_OVER_BY_CAR: "Run over by car",
  WEAPON_FALL: "Fall",
  WEAPON_DROWNING: "Drowning",
  WEAPON_DROWNING_IN_VEHICLE: "Drowning",
  WEAPON_EXPLOSION: "Explosion",
  WEAPON_FIRE: "Fired",
  WEAPON_BLEEDING: "Bleeding",
  WEAPON_BARBED_WIRE: "Barbed wire",
  WEAPON_EXHAUSTION: "Exhaustion",
  WEAPON_ELECTRIC_FENCE: "Electric fence",
};

const weaponHashes = {};

for (let w in weapons) {
  weaponHashes[alt.hash(w)] = weapons[w];
}

// const availableWeapons = ["WEAPON_INFINITYBLADE", "WEAPON_KNIFE", "WEAPON_BAT", "WEAPON_BOTTLE", "WEAPON_WRENCH", "WEAPON_PISTOL", "WEAPON_HEAVYPISTOL", "WEAPON_REVOLVER", "WEAPON_MICROSMG", "WEAPON_SMG", "WEAPON_COMBATPDW", "WEAPON_ASSAULTRIFLE", "WEAPON_CARBINERIFLE", "WEAPON_PUMPSHOTGUN"];

// function giveWeapons(player) {
//   for (const weapon of availableWeapons) {
//     player.giveWeapon(alt.hash(weapon), 9999, true);
//   }
// }

const colors = {
  ballas: {
    rgba: { r: 196, g: 0, b: 171, a: 150 },
    hex: "C400AB",
  },
  families: {
    rgba: { r: 0, g: 127, b: 0, a: 150 },
    hex: "008000",
  },
  vagos: {
    rgba: { r: 255, g: 191, b: 0, a: 150 },
    hex: "FFBF00",
  },
};

const positions = {
  vagos: {
    spawns: [
      { x: 348.5, y: -2052.6, z: 20.6 },
      { x: 335.6, y: -2053.5, z: 19.8 },
      { x: 353, y: -2050.9, z: 20.8 }
    ],
    weapon: { x: 352.6, y: -2036.4, z: 21.3 },
    vehicle: { x: 332.7, y: -2037.4, z: 20 },
    shop247: { x: 316.7, y: -2015.2, z: 19.6 },
    zz: { vectors: [new alt.Vector2(312.9, -1998.1), new alt.Vector2(290.6,-2024.2), new alt.Vector2(359.2, -2089.2), new alt.Vector2(389.5, -2053.3)],
      zMin: 19, zMax: 29, zMid:21
    },
    zz2: { x1: 312.9, y1: -1998.1,
      x2: 290.6, y2: -2024.2,
      x3: 359.2, y3: -2089.2,
      x4: 389.5, y4: -2053.3,
      zMin: 19, zMax: 29, zMid:21
     }
  },
  ballas: {
    spawns: [
      { x: -71.4, y: -1833.1, z: 25.9 },
      { x: -74.5, y: -1840.4, z: 25.9 },
      { x: -65, y: -1822.9, z: 25.9 }
    ],
    weapon: { x: -72.5, y: -1821.6, z: 25.9 },
    vehicle: { x: -49.9, y: -1845.8, z: 25.2 },
    shop247: { x: -73, y: -1835.4, z: 25.9 },
    zz: { vectors: [new alt.Vector2(-33, -1837.4), new alt.Vector2(-65.9, -1809.2), new alt.Vector2(-86.1, -1834.9), new alt.Vector2(-52, -1862.9)],
      zMin: 24, zMax: 34, zMid:26
    },
    zz2: { x1: -33, y1: -1837.4,
      x2: -65.9, y2: -1809.2,
      x3: -86.1, y3: -1834.9,
      x4: -52, y4: -1862.9,
      zMin: 24, zMax: 34, zMid:26
     }
  },
  families: {
    spawns: [
      { x: -216, y: -1499.7, z: 30.1 },
      { x: -223, y: -1515.2, z: 30.5 },
      { x: -205, y: -1498.2, z: 30.5 }
    ],
    weapon: { x: -233, y: -1490.5, z: 32 },
    vehicle: { x: -223.1, y: -1489.7, z: 30.2 },
    shop247: { x: -239.3, y: -1470.2, z: 30.5 },
    zz: { vectors: [new alt.Vector2(-194.4, -1488.5), new alt.Vector2(-233, -1458.7), new alt.Vector2(-259.6, -1500), new alt.Vector2(-229.3, -1528.6)],
          zMin: 29, zMax: 39, zMid:31
    },
    zz2: { x1: -194.4, y1: -1488.5,
      x2: -233, y2: -1458.7,
      x3: -259.6, y3: -1500,
      x4: -229.3, y4: -1528.6,
      zMin: 29, zMax: 39, zMid:31
     }
  },
};
let familiesBlip = new alt.PointBlip(positions.families.zz.x, positions.families.zz.y, positions.families.zz.z, true);
familiesBlip.sprite = 543;
familiesBlip.name = "Families";
familiesBlip.alpha = 200;
familiesBlip.color = 52;

let ballasBlip = new alt.PointBlip(positions.ballas.zz.x, positions.ballas.zz.y, positions.ballas.zz.z, true);
ballasBlip.sprite = 543;
ballasBlip.name = "Ballas";
ballasBlip.alpha = 200;
ballasBlip.color = 27;

let vagosBlip = new alt.PointBlip(positions.vagos.zz.x, positions.vagos.zz.y, positions.vagos.zz.z, true);
vagosBlip.sprite = 543;
vagosBlip.name = "Vagos";
vagosBlip.alpha = 200;
vagosBlip.color = 66;

const checkpoints = {
  ballas: {
    vehicle: null,
    weapon: null,
    shop247:null,
    zz: null
  },
  families: {
    vehicle: null,
    weapon: null,
    shop247:null,
    zz: null
  },
  vagos: {
    vehicle: null,
    weapon: null,
    shop247:null,
    zz: null
  },
};

for (let i in positions) {
  checkpoints[i].vehicle = new alt.Checkpoint(45, new alt.Vector3(positions[i].vehicle.x, positions[i].vehicle.y, positions[i].vehicle.z), 1, 1, alt.RGBA.green, 100);
  checkpoints[i].weapon = new alt.Checkpoint(45, new alt.Vector3(positions[i].weapon.x, positions[i].weapon.y, positions[i].weapon.z), 0.5, 1, alt.RGBA.green, 100);
  checkpoints[i].shop247 = new alt.Checkpoint(45, new alt.Vector3(positions[i].shop247.x, positions[i].shop247.y, positions[i].shop247.z), 0.5, 1, alt.RGBA.green, 100);
  checkpoints[i].zz = new alt.ColshapePolygon(positions[i].zz.zMin, positions[i].zz.zMax, positions[i].zz.vectors);//new alt.Checkpoint(45, new alt.Vector3(positions[i].zz.x, positions[i].zz.y, positions[i].zz.z), 20, 5, alt.RGBA.green, 200);
}

const currentTurfPoints = {
  ballas: 0,
  families: 0,
  vagos: 0,
};

class Turf {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  between(min, p, max) {
    let result = false;

    if (min < max) {
      if (p > min && p < max) result = true;
    }

    if (min > max) {
      if (p > max && p < min) result = true;
    }

    if (p == min || p == max) result = true;
    return result;
  }

  contains(x, y) {
    let result = false;
    if (this.between(this.x1, x, this.x2) && this.between(this.y1, y, this.y2)) result = true;
    return result;
  }
}

let turfs = [];
let currentTurf = null;

const xStartTurf = -404.1889;
const yStartTurf = -1221.2967;

for (let i = 0; i < 5; ++i) {
  for (let j = 0; j < 5; ++j) {
    const x1 = xStartTurf + 200 * i;
    const y1 = yStartTurf - 200 * j;
    turfs.push(new Turf(x1, y1, x1 + 200, y1 - 200));
  }
}

function startCapture() {
  currentTurfPoints.ballas = 0;
  currentTurfPoints.families = 0;
  currentTurfPoints.vagos = 0;

  currentTurf = turfs[Math.round(Math.random() * (turfs.length - 1))];
  alt.emitAllClients("captureStateChanged", true);
  alt.emitAllClients("startCapture", {
    x1: currentTurf.x1,
    y1: currentTurf.y1,
    x2: currentTurf.x2,
    y2: currentTurf.y2,
  });
  alt.emitAllClients("updateTeamPoints", currentTurfPoints);
}

function stopCapture() {
  currentTurfPoints.ballas = 0;
  currentTurfPoints.families = 0;
  currentTurfPoints.vagos = 0;
  currentTurf = null;
  alt.emitAllClients("captureStateChanged", false);
  alt.emitAllClients("stopCapture");
}

alt.setInterval(() => {
  let allPlayers = alt.Player.all;
  if (allPlayers.length > 0) {
    if (currentTurf == null) {
      startCapture();
    } else {
      for (let p of allPlayers) {
        if (!p.valid) continue;
        const pTeam = p.getMeta("team");
        if (!pTeam) continue;
        if (currentTurf.contains(p.pos.x, p.pos.y)) {
          currentTurfPoints[pTeam]++;
          if (currentTurfPoints[pTeam] >= 1000) {
            chat.broadcast(`{${colors[pTeam].hex}} ${pTeam} {FFFFFF}got this turf. Next capture started`);
            stopCapture();
            return;
          }
        }
      }
      alt.emitAllClients("updateTeamPoints", currentTurfPoints);
    }
  } else if (currentTurf != null) {
    stopCapture();
  }
}, 1000);

function getTeamsPopulation() {
  const population = {
    ballas: 0,
    families: 0,
    vagos: 0,
  };
  for (let p of alt.Player.all) {
    const team = p.getMeta("team");
    if (team) {
      population[team]++;
    }
  }
  return population;
}


function broadcastTeamsPopulation() {
  for (let p of alt.Player.all) {
    if (p.getMeta("selectingTeam")) {
      alt.emitClient(p, "showTeamSelect", getTeamsPopulation());
    }
  }
}

function broadcastPlayersOnline(add) {
  if (add !== undefined) alt.emitAllClients("updatePlayersOnline", alt.Player.all.length + add);
  else alt.emitAllClients("updatePlayersOnline", alt.Player.all.length);
}

alt.onClient("authData", (player, data) => {
  const licenseHash = data.sc;
  player.setMeta("licenseHash", licenseHash);
  let dsInfo = null;
  if (data.discord && data.discord.id) {
    dsInfo = data.discord.id;
    player.setMeta("discordId", dsInfo);
  }
  if (licenseHash in blacklistData || (dsInfo !== null && dsInfo in blacklistData)) {
    chat.broadcast(`{5555AA}${player.name} {FFFFFF}kicked (Blacklisted)`);
    player.kick();
  }
});

alt.on("playerConnect", (player) => {
  player.setMeta("selectingTeam", true);
  player.setMeta("checkpoint", 0);
  player.setMeta("vehicle", null);
  player.setMeta("canSpawnVehicle", 0);
  player.setMeta("warns", 0);

  broadcastPlayersOnline();

  chat.broadcast(`{5555AA}${player.name} {FFFFFF}connected`);
  alt.log(`${player.name} connected`);

  alt.emitClient(player, "youAreConnected");
});

alt.onClient("viewLoaded", (player) => {
  alt.log("View loaded for " + player.name);
  alt.emitClient(player, "showTeamSelect", getTeamsPopulation());
  alt.emitClient(player, "updatePlayersOnline", alt.Player.all.length);
});

alt.on("playerDisconnect", (player) => {
  const veh = player.getMeta("vehicle");
  if (veh) {
    veh.destroy();
  }

  player.setMeta("selectingTeam", false);

  broadcastTeamsPopulation();
  broadcastPlayersOnline(-1);

  chat.broadcast(`{5555AA}${player.name} {FFFFFF}disconnected`);
  alt.log(`${player.name} disconnected`);
});

alt.onClient("teamSelected", (player, teamId) => {
  let team = "families";
  if (teamId == 2) team = "ballas";
  else if (teamId == 3) team = "vagos";

  player.setMeta("team", team);
  player.setMeta("selectingTeam", false);
  broadcastTeamsPopulation();

  chat.broadcast(`{5555AA}${player.name} {FFFFFF}joined {${colors[team].hex}}${team}`);

  alt.log(player.name + " joined " + team);
  const nextSpawns = positions[team].spawns;

  const spawn = nextSpawns[Math.round(Math.random() * (nextSpawns.length - 1))];
  console.log("Spawning in " + JSON.stringify(spawn));
  player.model = "mp_m_freemode_01";
  player.spawn(spawn.x, spawn.y, spawn.z, 0);
  alt.setTimeout(()=>{

    alt.emitClient(player, "applyAppearance", team);
  }, 500);
  //
  alt.emitClient(player, "updateTeam", team);
  if (currentTurf != null) {
    alt.emitAllClients("captureStateChanged", true);
    alt.emitAllClients("startCapture", {
      x1: Math.min(currentTurf.x1, currentTurf.x2),
      y1: Math.min(currentTurf.y1, currentTurf.y2),
      x2: Math.max(currentTurf.x1, currentTurf.x2),
      y2: Math.max(currentTurf.y1, currentTurf.y2),
    });
    alt.emitAllClients("updateTeamPoints", currentTurfPoints);
  }
  player.setMeta("overPickup", 0);
});

alt.onClient("action", (player) => {
  const cp = player.getMeta("checkpoint");
  const pickup = player.getMeta("overPickup");
  if (pickup != 0) {
    alt.emit('pickingUp', pickup, player);
    alt.emitClient(player, 'playAnimPickup');
  }
  if (cp == 1) {
    const nextTimeSpawn = player.getMeta("canSpawnVehicle");
    if (nextTimeSpawn > Date.now()) return;

    alt.emitClient(player, 'chooseVehicle');
    // const pTeam = player.getMeta("team");
    // const pos = player.pos;
    // let curVeh = player.getMeta("vehicle");
    // if (curVeh) {
    //   curVeh.destroy();
    //   curVeh = null;
    // }

    // const nextModel = vehicles[pTeam][Math.round(Math.random() * (vehicles[pTeam].length - 1))];
    // const vehColor = colors[pTeam].rgba;
    // curVeh = new alt.Vehicle(nextModel, pos.x + 2, pos.y, pos.z, 0, 0, 0);
    // curVeh.customPrimaryColor = { r: vehColor.r, g: vehColor.g, b: vehColor.b };
    // curVeh.customSecondaryColor = { r: vehColor.r, g: vehColor.g, b: vehColor.b };
    //alt.emitAllClients('vehicleSpawned2', curVeh);
    
    //player.setMeta("vehicle", curVeh);
    //player.setMeta("canSpawnVehicle", Date.now() + 400);
  } else if (cp == 2) {
    alt.emitClient(player, 'chooseWeapons');
    //giveWeapons(player);
  }
  else if (cp == 3) {
    alt.emitClient(player, 'chooseProducts');
    //giveWeapons(player);
  }
});

alt.on("entityEnterColshape", (colshape, entity) => {
  if (entity instanceof alt.Player) {
    const pTeam = entity.getMeta("team");
    if (colshape == checkpoints[pTeam].zz) {
      entity.setSyncedMeta("ZZ", "1");
      alt.emitClient(entity, 'enteredGreenZone');
    }
    if (colshape == checkpoints[pTeam].vehicle) {
      entity.setMeta("checkpoint", 1);
      alt.emitClient(entity, "showInfo", "~INPUT_PICKUP~ to get car");
    } else if (colshape == checkpoints[pTeam].weapon) {
      entity.setMeta("checkpoint", 2);
      alt.emitClient(entity, "showInfo", "~INPUT_PICKUP~ to get weapons and ammo");
    } else if (colshape == checkpoints[pTeam].shop247) {
      entity.setMeta("checkpoint", 3);
      alt.emitClient(entity, "showInfo", "~INPUT_PICKUP~ to get heals");
    }
  }
});

alt.on("entityLeaveColshape", (colshape, entity) => {
  if (entity instanceof alt.Player) {
    const pTeam = entity.getMeta("team");
    if (colshape == checkpoints[pTeam].zz) {
      entity.setSyncedMeta("ZZ", "0");
      alt.emitClient(entity, 'exitedGreenZone');
    }
    else {
      entity.setMeta("checkpoint", 0);
    }

  }
});


alt.on('playerDamage',(player, attacker, weapon, damage, armourDamage) => {
  if(player.armour <= 0){
    player.setClothes(9, 0, 0);
  }
}
);

// alt.on('playerWeaponChange',(player, oldWeapon, newWeapon) => {
//   alt.log('changed weapon from '+ oldWeapon+ ' to ' + newWeapon);
//   player.setMeta('currentWeapon', newWeapon);
// }
// );


alt.on("playerDeath", (player, killer, weapon) => {
  let weaponName = "Killed";
  if (weapon in weaponHashes) weaponName = weaponHashes[weapon];

  if (player == killer && weaponName == "Killed") weaponName = "Suicided";
  else if (weaponName == "Killed") console.log("Unknown death reason: " + weapon.toString(16));

  const team = player.getMeta("team");
  if (!killer) killer = player;

  //alt.log('currentWeapon property '+ player.currentWeapon);
  //alt.log('currentWeapon meta '+ player.getMeta('currentWeapon'));
 //(player.getMeta('currentWeapon') > 0) {
    alt.emit('spawnPickups', player);
  alt.setTimeout(() => {
    const nextSpawns = positions[team].spawns;
  const spawnPos = nextSpawns[Math.round(Math.random() * (nextSpawns.length - 1))];

  
  player.spawn(spawnPos.x, spawnPos.y, spawnPos.z, 5000);
}, 3000);




  if (killer) {
    const killerTeam = killer.getMeta("team");
    alt.emitAllClients("playerKill", { killerName: killer.name, killerGang: killerTeam, victimName: player.name, victimGang: team, weapon: weaponName });

    if (currentTurf != null && killer != player && team != killerTeam) {
      if (currentTurf.contains(player.pos.x, player.pos.y)) {
        currentTurfPoints[killerTeam] += 50;
        if (currentTurfPoints[killerTeam] >= 1000) {
          chat.broadcast(`{${colors[killerTeam].hex}} ${killerTeam} {FFFFFF}got this turf. Next capture started`);
          stopCapture();
        }
      }
    } else if (currentTurf != null && team == killerTeam) {
      if (currentTurf.contains(player.pos.x, player.pos.y)) {
        if (currentTurfPoints[killerTeam] > 50) currentTurfPoints[killerTeam] -= 50;
        else currentTurfPoints[killerTeam] = 0;
      }
    }

    if (team == killerTeam && player != killer) {
      let warns = killer.getMeta("warns");
      if (warns == 2) {
        chat.broadcast(`{5555AA}${killer.name} {AA0000}kicked for team killing`);
        killer.kick();
      } else {
        chat.broadcast(`{5555AA}${killer.name} {AA0000}warned [${warns + 1}/3] for team killing`);
        killer.setMeta("warns", warns + 1);
      }
    } else if (player != killer && weaponName == weapons.WEAPON_RUN_OVER_BY_CAR) {
      let warns = killer.getMeta("warns");
      if (warns == 2) {
        chat.broadcast(`{5555AA}${killer.name} {AA0000}kicked for vehicle kill`);
        killer.kick();
      } else {
        chat.broadcast(`{5555AA}${killer.name} {AA0000}warned [${warns + 1}/3] for vehicle kill`);
        killer.setMeta("warns", warns + 1);
      }
    }
  }
});

function getDistanceBetweenPoints(pos1, pos2) {
  const dX = pos1.x - pos2.x;
  const dY = pos1.y - pos2.y;
  const dZ = pos1.z - pos2.z;
  return Math.sqrt(dX * dX + dY * dY + dZ * dZ);
}

// alt.setInterval(() => {
//   for (let p of alt.Player.all) {
//     if (!p.valid) continue;
//     const lastPos = p.getMeta("lastPos");
//     if (lastPos) {
//       if (getDistanceBetweenPoints(lastPos, p.pos) <= 1) {
//         chat.broadcast(`${p.name} {FFFFFF}was kicked for being AFK`);
//         //p.kick();
//       } else {
//         p.setMeta("lastPos", p.pos);
//       }
//     } else {
//       p.setMeta("lastPos", p.pos);
//     }
//   }
// }, 240000);
