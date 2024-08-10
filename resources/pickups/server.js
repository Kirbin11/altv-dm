import * as alt from "alt-server";

const weapons = {
    453432689: "w_pi_pistol",
    3249783761: "w_pi_revolver_g",
    324215364: "w_sb_microsmg",
    736523883: "w_sb_smg",
    4024951519: "w_ar_assaultrifle_smg",
    3220176749: "w_ar_assaultrifle",
    2210333304: "w_ar_carbinerifle",
    2937143193: "w_ar_advancedrifle",
    3231910285: "w_ar_specialcarbine",
    2132975508: "w_ar_bullpuprifle",
    2634544996: "w_mg_mg",
    2144741730: "w_mg_combatmg",
    487013001: "w_sg_pumpshotgun",
    2017895192: "w_sg_sawnoff",
    3800352039: "w_sg_assaultshotgun",
    2640438543: "w_sg_bullpupshotgun",
    984333226: "w_sg_heavyshotgun",
    100416529: "w_sr_sniperrifle",
    205991906: "w_sr_heavysniper",
    177293209: "w_sr_heavysnipermk2",
    3342088282: "w_sr_marksmanrifle",
    2726580491: "w_lr_grenadelauncher",
    2982836145: "w_lr_rpg",
    1119849093: "w_mg_minigun",
    2481070269: "w_ex_grenadefrag",
}
class Pickups {
    static _pickups = {};
    
    static create(name, model, position, dimension = 0, respawn = false, respawnTime = 30000, pickupSound = "Deliver_Pick_Up", pickupSoundSet = "HUD_FRONTEND_MP_COLLECTABLE_SOUNDS") {
        if(Pickups._pickups[name]) return;
        new Pickups(name, model, position, dimension, respawn, respawnTime, pickupSound, pickupSoundSet);
    }
    static remove(name) {
        let pickup = Pickups._pickups[name];
        if(!pickup) return;
        Pickups.removeColshapes(pickup);
        if(pickup._respawnTimeout) alt.clearTimeout(pickup._respawnTimeout);

        
        delete Pickups._pickups[name];
        alt.emitAllClients("pickups:remove", name);
    }
    static handleEnterColshape(colshape, entity) {
        if(!entity instanceof alt.Player) return;
        if(colshape.isPickupColshape) {
            entity.setMeta("overPickup", colshape.ownerPickup);
            alt.emitClient(entity, "showInfo", "~INPUT_PICKUP~ to pick up a gun");
        }
    }
    static handleLeaveColshape(colshape, entity) {
        if(!entity instanceof alt.Player) return;
        if(colshape.isPickupColshape) {
            entity.setMeta("overPickup", 0);
        }
    }
    constructor(name, model, position, dimension, respawn, respawnTime, pickupSound, pickupSoundSet) {
        this._name = name;
        this._model = model;
        this._position = position;
        this._dimension = dimension;
        this._respawn = respawn;
        this._respawnTime = respawnTime;
        this._disabled = false;
        this._pickupSound = {
            name: pickupSound,
            set: pickupSoundSet
        };

        Pickups._pickups[name] = this;
        this.createColshapes();
        this.createForPlayers();
    }
    createColshapes() {
        this._pickupColshape = new alt.ColshapeCylinder(this.position.x, this.position.y, this.position.z-1, 0.5, 2);
        this._pickupColshape.isPickupColshape = true;
        this._pickupColshape.ownerPickup = this;
    }
    static removeColshapes(pickup) {
        pickup._pickupColshape.destroy();
    }
    static playerPickedUp(player, weapon){
        player.giveWeapon(weapon, 9999, true);
    }
    
    static onPickup(player, pickup) {
        //if(player.dimension !== this.dimension) return;
        if(pickup._disabled) return;
        pickup._disabled = true;
        Pickups.removeForPlayers(pickup);
        player.setMeta("overPickup", 0);
        alt.emitClient(player, "pickups:pickup", pickup._pickupSound.name, pickup._pickupSound.set);
        //alt.emit("pickups:pickedUp", player, this.name);
        Pickups.remove(pickup._name);
        var hash = Object.keys(weapons).find(key => weapons[key] === pickup._model);
        Pickups.playerPickedUp(player, parseInt(hash));
    }
    createForPlayers() {
        alt.emitAllClients("pickups:create", this.name, this.model, this.position);
    }
    static removeForPlayers(pickup) {
        alt.emitAllClients("pickups:remove", pickup._name);
    }

    get name() {
        return this._name;
    }
    get model() {
        return this._model;
    }
    get position() {
        return this._position;
    }
    get dimension() {
        return this._dimension;
    }
    get respawn() {
        return this._respawn;
    }
    get respawnTime() {
        return this._respawnTime;
    }
    get pickupSound() {
        return this._pickupSound;
    }
}

alt.on("entityLeaveColshape", Pickups.handleLeaveColshape);

alt.on("entityEnterColshape", Pickups.handleEnterColshape);
// alt.onClient("action", (player) => {
//     const pickup = player.getMeta("overPickup");
//     alt.log("overPickup2 "+ pickup);
//     alt.log(typeof pickup);
//     if (pickup != 0) {
//         Pickups.onPickup(player, pickup);
//     }
//   });
alt.on("pickingUp", (pickup, player) => {
    Pickups.onPickup(player, pickup);
});

alt.on("spawnPickups", (player)=> {
    let weaponHash = player.currentWeapon;//player.getMeta('currentWeapon');
    player.removeWeapon(weaponHash);
    let id = "id"+(player.pos.x+player.pos.y+player.pos.z);
    if (weaponHash in weapons){
        Pickups.create(id, weapons[weaponHash], player.pos);
    }
    //player.setMeta('currentWeapon', 0);
    //Pickups.create(player,"kalash", alt.hash("w_ar_assaultrifle"), player.pos);
    //Pickups.create(player,"granata", "WEAPON_GRENADE", player.pos.sub(3,0,0));

    //Pickups.handlePlayerConnect(player);
}
);


//alt.on("pickups:create", Pickups.create);
//alt.on("pickups:remove", Pickups.remove);
alt.on("pickups:setStreamRange", (range) => {
    STREAM_RANGE = range;
});