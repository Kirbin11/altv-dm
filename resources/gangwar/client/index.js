import * as alt from "alt-client";
import * as game from "natives";
import * as chat from "chat";

let myTeam = null;
let inZZ = null;
let flag = false;

const clothes = {
  families: {
    1: {
      drawable: 51,
      texture: 5,
    },
    2: {
      drawable: 8,
      texture: 1,
    },
    3: {
      drawable: 1,
      texture: 0,
    },
    4: {
      drawable: 15,
      texture: 13,
    },
    6: {
      drawable: 9,
      texture: 4,
    },
    8: {
      drawable: 0,
      texture: 240,
    },
    11: {
      drawable: 14,
      texture: 6,
    },
  },
  ballas: {
    1: {
      drawable: 51,
      texture: 6,
    },
    2: {
      drawable: 10,
      texture: 4,
    },
    3: {
      drawable: 5,
      texture: 0,
    },
    4: {
      drawable: 88,
      texture: 23,
    },
    6: {
      drawable: 9,
      texture: 3,
    },
    8: {
      drawable: 0,
      texture: 240,
    },
    11: {
      drawable: 17,
      texture: 3,
    },
  },
  vagos: {
    1: {
      drawable: 51,
      texture: 8,
    },
    2: {
      drawable: 10,
      texture: 3,
    },
    3: {
      drawable: 5,
      texture: 0,
    },
    4: {
      drawable: 88,
      texture: 19,
    },
    6: {
      drawable: 9,
      texture: 11,
    },
    8: {
      drawable: 0,
      texture: 240,
    },
    11: {
      drawable: 17,
      texture: 2,
    },
  },
};

alt.everyTick(() => {
  game.disableControlAction(0,36,true);
});

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
    zz: { x1: 312.9, y1: -1998.1,
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
    zz: { x1: -33, y1: -1837.4,
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
    zz: { x1: -194.4, y1: -1488.5,
      x2: -233, y2: -1458.7,
      x3: -259.6, y3: -1500,
      x4: -229.3, y4: -1528.6,
      zMin: 29, zMax: 39, zMid:31
     }
  },
};


let leadingTeam = null;
let lastLeadingTeam = null;

const teamColors = {
  ballas: {
    rgba: { r: 196, g: 0, b: 171, a: 150 },
    hex: "C400AB",
    blipColor: 83,
  },
  families: {
    rgba: { r: 0, g: 127, b: 0, a: 150 },
    hex: "008000",
    blipColor: 52,
  },
  vagos: {
    rgba: { r: 255, g: 191, b: 0, a: 150 },
    hex: "FFBF00",
    blipColor: 81,
  },
};

let mainView = null;
let viewLoaded = false;

function loadWebView() {
  mainView = new alt.WebView("http://resource/client/html/index.html");
  mainView.on("viewLoaded", () => {
    alt.emitServer("viewLoaded");
    viewLoaded = true;
  });

  mainView.on("teamSelected", (teamId) => {
    alt.emitServer("teamSelected", teamId);
    alt.toggleGameControls(true);
    alt.showCursor(false);
  });
}

alt.on("connectionComplete", () => {
  //loadIpls();
  alt.emitServer("authData", {
    discord: alt.Discord.currentUser,
    sc: alt.getLicenseHash(),
  });
});

alt.onServer("youAreConnected", () => {
  chat.pushLine("Loading...");
  loadWebView();
});
// let vagosBlip = new alt.PointBlip(positions.vagos.zz.x, positions.vagos.zz.y, positions.vagos.zz.z);
// vagosBlip.sprite = 543;
// vagosBlip.name = "Vagos";
// vagosBlip.alpha = 200;
// vagosBlip.shortRange = false;
// vagosBlip.color = 5;


let weaponBlip = null;
let vehicleBlip = null;
alt.onServer("updateTeam", (team) => {
  myTeam = team;
  if (weaponBlip) {
    weaponBlip.destroy();
  }

  weaponBlip = new alt.PointBlip(positions[myTeam].weapon.x, positions[myTeam].weapon.y, positions[myTeam].weapon.z);

  weaponBlip.sprite = 110;
  weaponBlip.name = "Weapon provider";
  weaponBlip.alpha = 200;
  weaponBlip.shortRange = true;

  if (vehicleBlip) {
    vehicleBlip.destroy();
  }

  vehicleBlip = new alt.PointBlip(positions[myTeam].vehicle.x, positions[myTeam].vehicle.y, positions[myTeam].vehicle.z);

  vehicleBlip.sprite = 227;
  vehicleBlip.name = "Vehicle provider";
  vehicleBlip.alpha = 200;
  vehicleBlip.shortRange = true;

  loadCheckpoints();
});

const colors = {
  ballas: "C400AB",
  families: "008000",
  vagos: "FFBF00",
};

alt.setInterval(() => {
  game.invalidateIdleCam();
}, 25000);

alt.setInterval(() => {
  alt.Player.local.stamina = 100;
}, 8000);

alt.onServer("applyAppearance", (team) => {
// const redMarker2 = new alt.Utils.Marker(new alt.Vector3(x - 10, y+10, z), { type: 2 }); // стрелка
// const redMarkxcer3 = new alt.Utils.Marker(new alt.Vector3(x4 - 20, y4+20, z), { type: 28 }); // шарик
// const redMaqwrker4 = new alt.Utils.Marker(new alt.Vector3(x4- 25, y4+25, z), { type: 29 }); // бабки
// const redMazxcrker5 = new alt.Utils.Marker(new alt.Vector3(x4 - 30, y4+30, z), { type: 30 }); // палочки типа вход


  const components = clothes[team];
  for (let c in components) {
    game.setPedComponentVariation(alt.Player.local.scriptID, parseInt(c), components[c].drawable, components[c].texture, 0);
  }
});

function loadCheckpoints() {
  const pos = new alt.Vector3(positions[myTeam].vehicle.x, positions[myTeam].vehicle.y, positions[myTeam].vehicle.z);
const pos2 = new alt.Vector3(positions[myTeam].weapon.x, positions[myTeam].weapon.y, positions[myTeam].weapon.z);
const pos3 = new alt.Vector3(positions[myTeam].shop247.x, positions[myTeam].shop247.y, positions[myTeam].shop247.z);

//const pos4 = new alt.Vector3(positions[myTeam].zz.x, positions[myTeam].zz.y, positions[myTeam].zz.z);

var vehCheck = new alt.Checkpoint(47, pos, pos, 1, 1, alt.RGBA.blue, alt.RGBA.green, 100);
var weapCheck = new alt.Checkpoint(47, pos2, pos2, 0.5, 1, alt.RGBA.blue, alt.RGBA.green, 100);
var shopCheck = new alt.Checkpoint(47, pos3, pos3, 0.5, 1, alt.RGBA.blue, alt.RGBA.green, 100);
//new alt.Checkpoint(47, pos4, pos4, 20, 1, alt.RGBA.green, alt.RGBA.green, 100);

const labelVehPos = pos.add(0,0,1);
const labelWeapPos = pos2.add(0,0,1);
const label247Pos = pos3.add(0,0,1);
const labelRot = new alt.Vector3(0, 0, -0.253);
const labelColor = new alt.RGBA(255, 255, 255, 255);
const labelOutlineColor = new alt.RGBA(0, 0, 0, 80);
const labelFontSize = 32;
const labelFontScale = 2;
const labelOutlineWidth = .25;

// alt.emit('drawCheckpointText', vehCheck, 'Магащин авто');
// alt.emit('drawCheckpointText', weapCheck, 'Мазагин оружия');
// alt.emit('drawCheckpointText', shopCheck, 'Мачагин 247');


// new alt.TextLabel('Взять тачку', 'Segoe UI', labelFontSize, labelFontScale, labelVehPos, labelRot, labelColor, labelOutlineWidth, labelOutlineColor);
// new alt.TextLabel('Взять ганы', 'Segoe UI', labelFontSize, labelFontScale, labelWeapPos, labelRot, labelColor, labelOutlineWidth, labelOutlineColor);
// new alt.TextLabel('Магазин 24/7', 'Segoe UI', labelFontSize, labelFontScale, label247Pos, labelRot, labelColor, labelOutlineWidth, labelOutlineColor);
drawZZ();
}


alt.onServer("updateTeamPoints", (info) => {
  let myTeamPoints = info[myTeam];
  if (viewLoaded) mainView.emit("setTeamPoints", myTeam, myTeamPoints);

  const teamsArray = [];
  for (let t in info) {
    teamsArray.push({
      team: t,
      scores: info[t],
    });
  }
  teamsArray.sort((a, b) => {
    return a.scores < b.scores ? 1 : -1;
  });
  if (teamsArray[0].scores == 0) leadingTeam = null;
  else leadingTeam = teamsArray[0].team;

  const rightTeam = teamsArray[0].team == myTeam ? teamsArray[1] : teamsArray[0];

  const progressLeft = myTeamPoints / 1000;
  const progressRight = rightTeam.scores / 1000;
  const colorLeft = colors[myTeam];
  const colorRight = colors[rightTeam.team];

  if (viewLoaded) mainView.emit("setProgress", progressLeft, progressRight, "#" + colorLeft, "#" + colorRight);
});

alt.onServer("captureStateChanged", (state) => {
  if (!viewLoaded) return;
  if (state == false) {
    mainView.emit("hideProgress");
  } else {
    mainView.emit("showProgress");
  }
});

alt.onServer("playerKill", (data) => {
  if (!viewLoaded) return;
  mainView.emit("registerKill", data);
});

alt.onServer("showTeamSelect", (teamsPopulation) => {
  if (!viewLoaded) return;
  mainView.emit("showTeamSelect", teamsPopulation);
  mainView.focus();
  alt.toggleGameControls(false);
  alt.showCursor(true);
});

alt.on("keydown", (key) => {
  if (key == "E".charCodeAt(0)) {
    alt.emitServer("action");
  }
});

let captureBlip = null;

alt.onServer("startCapture", (info) => {
  const { x1, x2, y1, y2 } = info;

  if (captureBlip != null) {
    captureBlip.destroy();
    captureBlip = null;
  }

  leadingTeam = null;
  lastLeadingTeam = null;
  captureBlip = new alt.AreaBlip((x1 + x2) / 2, (y1 + y2) / 2, 0, 200, 200);
  // game.SetBlipSprite(captureBlip, 84);
  captureBlip.color = 39;
  captureBlip.flashTimer = 500;
  captureBlip.flashInterval = 500;
  captureBlip.flashes = true;
  captureBlip.alpha = 125;
  captureBlip.heading = 0;
  captureBlip.name = "Turf War";

  if (viewLoaded) {
    mainView.emit("setProgress", 0, 0, "#000000", "#000000");
  }
});

alt.onServer("stopCapture", () => {
  leadingTeam = null;
  lastLeadingTeam = null;
  if (captureBlip) {
    captureBlip.destroy();
    captureBlip = null;
  }

  if (viewLoaded) {
    mainView.emit("setProgress", 0, 0, "#000000", "#000000");
  }
});

alt.everyTick(() => {
  if (captureBlip) {
    if (leadingTeam && leadingTeam != lastLeadingTeam && leadingTeam in teamColors) {
      captureBlip.color = teamColors[leadingTeam].blipColor;
      lastLeadingTeam = leadingTeam;
    } else if (!leadingTeam) {
      captureBlip.color = 39;
      lastLeadingTeam = leadingTeam;
    }
  }
});

alt.onServer("showInfo", (text) => {
  game.beginTextCommandDisplayHelp("STRING");
  game.addTextComponentSubstringKeyboardDisplay(text);
  game.endTextCommandDisplayHelp(0, 0, true, -1);
});

alt.onServer("updatePlayersOnline", (players) => {
  if (!viewLoaded) return;
  mainView.emit("updatePlayersOnline", players);
});

alt.onServer('vehicleSpawned2', (vehicle) => {
  game.setEntityNoCollisionEntity(alt.Player.local, vehicle, false);
});

alt.onServer('exitedGreenZone', () => {
  game.setEntityInvincible(alt.Player.local.scriptID, false);
  alt.emit('freeroam:sendNotification', 'CHAR_AMMUNATION', 'Admin', 'Слушай сюда', 'Exited Green Zone');
  alt.clearEveryTick(inZZ);
});

alt.onServer('enteredGreenZone', () => {
  game.setEntityInvincible(alt.Player.local.scriptID, true);
  alt.emit('freeroam:sendNotification', 'CHAR_AMMUNATION', 'Admin', 'Слушай сюда', 'Entered Green Zone');
  inZZ = drawLabels();
});
// function loadIpls() {
//   alt.requestIpl("chop_props");
//   alt.requestIpl("FIBlobby");
//   alt.removeIpl("FIBlobbyfake");
//   alt.requestIpl("FBI_colPLUG");
//   alt.requestIpl("FBI_repair");
//   alt.requestIpl("v_tunnel_hole");
//   alt.requestIpl("TrevorsMP");
//   alt.requestIpl("TrevorsTrailer");
//   alt.requestIpl("TrevorsTrailerTidy");
//   alt.removeIpl("farm_burnt");
//   alt.removeIpl("farm_burnt_lod");
//   alt.removeIpl("farm_burnt_props");
//   alt.removeIpl("farmint_cap");
//   alt.removeIpl("farmint_cap_lod");
//   alt.requestIpl("farm");
//   alt.requestIpl("farmint");
//   alt.requestIpl("farm_lod");
//   alt.requestIpl("farm_props");
//   alt.requestIpl("facelobby");
//   alt.removeIpl("CS1_02_cf_offmission");
//   alt.requestIpl("CS1_02_cf_onmission1");
//   alt.requestIpl("CS1_02_cf_onmission2");
//   alt.requestIpl("CS1_02_cf_onmission3");
//   alt.requestIpl("CS1_02_cf_onmission4");
//   alt.requestIpl("v_rockclub");
//   alt.requestIpl("v_janitor");
//   alt.removeIpl("hei_bi_hw1_13_door");
//   alt.requestIpl("bkr_bi_hw1_13_int");
//   alt.requestIpl("ufo");
//   alt.requestIpl("ufo_lod");
//   alt.requestIpl("ufo_eye");
//   alt.removeIpl("v_carshowroom");
//   alt.removeIpl("shutter_open");
//   alt.removeIpl("shutter_closed");
//   alt.removeIpl("shr_int");
//   alt.requestIpl("csr_afterMission");
//   alt.requestIpl("v_carshowroom");
//   alt.requestIpl("shr_int");
//   alt.requestIpl("shutter_closed");
//   alt.requestIpl("smboat");
//   alt.requestIpl("smboat_distantlights");
//   alt.requestIpl("smboat_lod");
//   alt.requestIpl("smboat_lodlights");
//   alt.requestIpl("cargoship");
//   alt.requestIpl("railing_start");
//   alt.removeIpl("sp1_10_fake_interior");
//   alt.removeIpl("sp1_10_fake_interior_lod");
//   alt.requestIpl("sp1_10_real_interior");
//   alt.requestIpl("sp1_10_real_interior_lod");
//   alt.removeIpl("id2_14_during_door");
//   alt.removeIpl("id2_14_during1");
//   alt.removeIpl("id2_14_during2");
//   alt.removeIpl("id2_14_on_fire");
//   alt.removeIpl("id2_14_post_no_int");
//   alt.removeIpl("id2_14_pre_no_int");
//   alt.removeIpl("id2_14_during_door");
//   alt.requestIpl("id2_14_during1");
//   alt.removeIpl("Coroner_Int_off");
//   alt.requestIpl("coronertrash");
//   alt.requestIpl("Coroner_Int_on");
//   alt.removeIpl("bh1_16_refurb");
//   alt.removeIpl("jewel2fake");
//   alt.removeIpl("bh1_16_doors_shut");
//   alt.requestIpl("refit_unload");
//   alt.requestIpl("post_hiest_unload");
//   alt.requestIpl("Carwash_with_spinners");
//   alt.requestIpl("KT_CarWash");
//   alt.requestIpl("ferris_finale_Anim");
//   alt.removeIpl("ch1_02_closed");
//   alt.requestIpl("ch1_02_open");
//   alt.requestIpl("AP1_04_TriAf01");
//   alt.requestIpl("CS2_06_TriAf02");
//   alt.requestIpl("CS4_04_TriAf03");
//   alt.removeIpl("scafstartimap");
//   alt.requestIpl("scafendimap");
//   alt.removeIpl("DT1_05_HC_REMOVE");
//   alt.requestIpl("DT1_05_HC_REQ");
//   alt.requestIpl("DT1_05_REQUEST");
//   alt.requestIpl("FINBANK");
//   alt.removeIpl("DT1_03_Shutter");
//   alt.removeIpl("DT1_03_Gr_Closed");
//   alt.requestIpl("golfflags");
//   alt.requestIpl("airfield");
//   alt.requestIpl("v_garages");
//   alt.requestIpl("v_foundry");
//   alt.requestIpl("hei_yacht_heist");
//   alt.requestIpl("hei_yacht_heist_Bar");
//   alt.requestIpl("hei_yacht_heist_Bedrm");
//   alt.requestIpl("hei_yacht_heist_Bridge");
//   alt.requestIpl("hei_yacht_heist_DistantLights");
//   alt.requestIpl("hei_yacht_heist_enginrm");
//   alt.requestIpl("hei_yacht_heist_LODLights");
//   alt.requestIpl("hei_yacht_heist_Lounge");
//   alt.requestIpl("hei_carrier");
//   alt.requestIpl("hei_Carrier_int1");
//   alt.requestIpl("hei_Carrier_int2");
//   alt.requestIpl("hei_Carrier_int3");
//   alt.requestIpl("hei_Carrier_int4");
//   alt.requestIpl("hei_Carrier_int5");
//   alt.requestIpl("hei_Carrier_int6");
//   alt.requestIpl("hei_carrier_LODLights");
//   alt.requestIpl("bkr_bi_id1_23_door");
//   alt.requestIpl("lr_cs6_08_grave_closed");
//   alt.requestIpl("hei_sm_16_interior_v_bahama_milo_");
//   alt.requestIpl("CS3_07_MPGates");
//   alt.requestIpl("cs5_4_trains");
//   alt.requestIpl("v_lesters");
//   alt.requestIpl("v_trevors");
//   alt.requestIpl("v_michael");
//   alt.requestIpl("v_comedy");
//   alt.requestIpl("v_cinema");
//   alt.requestIpl("V_Sweat");
//   alt.requestIpl("V_35_Fireman");
//   alt.requestIpl("redCarpet");
//   alt.requestIpl("triathlon2_VBprops");
//   alt.requestIpl("jetstealturnel");
//   alt.requestIpl("Jetsteal_ipl_grp1");
//   alt.requestIpl("v_hospital");
//   alt.removeIpl("RC12B_Default");
//   alt.removeIpl("RC12B_Fixed");
//   alt.requestIpl("RC12B_Destroyed");
//   alt.requestIpl("RC12B_HospitalInterior");
//   alt.requestIpl("canyonriver01");
// }
function drawZZ(){
  alt.setInterval(() => {
    game.drawLine(positions[myTeam].zz.x1, positions[myTeam].zz.y1, positions[myTeam].zz.zMin, positions[myTeam].zz.x2, positions[myTeam].zz.y2, positions[myTeam].zz.zMin, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x1, positions[myTeam].zz.y1, positions[myTeam].zz.zMin, positions[myTeam].zz.x4, positions[myTeam].zz.y4, positions[myTeam].zz.zMin, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x3, positions[myTeam].zz.y3, positions[myTeam].zz.zMin, positions[myTeam].zz.x2, positions[myTeam].zz.y2, positions[myTeam].zz.zMin, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x3, positions[myTeam].zz.y3, positions[myTeam].zz.zMin, positions[myTeam].zz.x4, positions[myTeam].zz.y4, positions[myTeam].zz.zMin, 0, 255, 0, 255);

  game.drawLine(positions[myTeam].zz.x1, positions[myTeam].zz.y1, positions[myTeam].zz.zMax, positions[myTeam].zz.x2, positions[myTeam].zz.y2, positions[myTeam].zz.zMax, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x1, positions[myTeam].zz.y1, positions[myTeam].zz.zMax, positions[myTeam].zz.x4, positions[myTeam].zz.y4, positions[myTeam].zz.zMax, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x3, positions[myTeam].zz.y3, positions[myTeam].zz.zMax, positions[myTeam].zz.x2, positions[myTeam].zz.y2, positions[myTeam].zz.zMax, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x3, positions[myTeam].zz.y3, positions[myTeam].zz.zMax, positions[myTeam].zz.x4, positions[myTeam].zz.y4, positions[myTeam].zz.zMax, 0, 255, 0, 255);

  game.drawLine(positions[myTeam].zz.x1, positions[myTeam].zz.y1, positions[myTeam].zz.zMin, positions[myTeam].zz.x1, positions[myTeam].zz.y1, positions[myTeam].zz.zMax, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x2, positions[myTeam].zz.y2, positions[myTeam].zz.zMin, positions[myTeam].zz.x2, positions[myTeam].zz.y2, positions[myTeam].zz.zMax, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x3, positions[myTeam].zz.y3, positions[myTeam].zz.zMin, positions[myTeam].zz.x3, positions[myTeam].zz.y3, positions[myTeam].zz.zMax, 0, 255, 0, 255);
  game.drawLine(positions[myTeam].zz.x4, positions[myTeam].zz.y4, positions[myTeam].zz.zMin, positions[myTeam].zz.x4, positions[myTeam].zz.y4, positions[myTeam].zz.zMax, 0, 255, 0, 255);

  }, 5);

}

function drawLabels(){
  const pos = new alt.Vector3(positions[myTeam].vehicle.x, positions[myTeam].vehicle.y, positions[myTeam].vehicle.z);
const pos2 = new alt.Vector3(positions[myTeam].weapon.x, positions[myTeam].weapon.y, positions[myTeam].weapon.z);
const pos3 = new alt.Vector3(positions[myTeam].shop247.x, positions[myTeam].shop247.y, positions[myTeam].shop247.z);
  return alt.everyTick(() => {
alt.Utils.drawText3dThisFrame(`Магазин оружия`, pos2.add(0,0,1), 7, 0.4,  alt.RGBA.white, true, true, 0);//, 2);
alt.Utils.drawText3dThisFrame(`Магазин 24/7`, pos3.add(0,0,1), 7, 0.4,  alt.RGBA.white, true, true, 0);
alt.Utils.drawText3dThisFrame(`Магазин авто`, pos.add(0,0,1), 7, 0.4,  alt.RGBA.white, true, true, 0);
});

}
