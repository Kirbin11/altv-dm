/* Visual Vehicle Spawner (0.1)
 * _dusieq#0404 (Discord), Enerv#6489 (Discord)
 * GPLv2 / MIT License
 */

let app = new Vue({
    el: '#app',
    data: {
        categories: [
            'All',
            'Pistols',
            'SMG',
            'Rifles',
            'Shotguns',
            'Snipers',
            'Extra',
            'Equipment'
        ],
        models: [
            { category: 1, model: 'WEAPON_PISTOL' },
            { category: 1, model: 'WEAPON_COMBATPISTOL' },
            { category: 1, model: 'WEAPON_APPISTOL' },
            { category: 1, model: 'WEAPON_PISTOL50' },
            { category: 1, model: 'WEAPON_HEAVYPISTOL' },
            { category: 2, model: 'WEAPON_MICROSMG' },
            { category: 2, model: 'WEAPON_SMG' },
            { category: 2, model: 'WEAPON_ASSAULTSMG' },
            { category: 3, model: 'WEAPON_ASSAULTRIFLE' },
            { category: 3, model: 'WEAPON_CARBINERIFLE' },
            { category: 3, model: 'WEAPON_ADVANCEDRIFLE' },
            { category: 3, model: 'WEAPON_SPECIALCARBINE' },
            { category: 3, model: 'WEAPON_BULLPUPRIFLE' },
            { category: 4, model: 'WEAPON_MG' },
            { category: 4, model: 'WEAPON_COMBATMG' },
            { category: 4, model: 'WEAPON_PUMPSHOTGUN' },
            { category: 4, model: 'WEAPON_SAWNOFFSHOTGUN' },
            { category: 4, model: 'WEAPON_ASSAULTSHOTGUN' },
            { category: 4, model: 'WEAPON_BULLPUPSHOTGUN' },
            { category: 4, model: 'WEAPON_HEAVYSHOTGUN' },
            { category: 5, model: 'WEAPON_SNIPERRIFLE' },
            { category: 5, model: 'WEAPON_HEAVYSNIPER' },
            { category: 5, model: 'WEAPON_REMOTESNIPER' },
            { category: 5, model: 'WEAPON_MARKSMANRIFLE' },
            { category: 6, model: 'WEAPON_GRENADELAUNCHER' },
            { category: 6, model: 'WEAPON_RPG' },
            { category: 6, model: 'WEAPON_MINIGUN' },
            { category: 6, model: 'WEAPON_GRENADE' },
            { category: 7, model: 'Bulletproof vest 50%' },
            { category: 7, model: 'Bulletproof vest 100%' }
            ],
        keyword: '',
        storage: [],
        visible: false
    },
    watch: {
        'keyword': function(input) {
            if (input.length > 0) {
                this.storage = this.models.filter((weapon => {
                    return weapon.model.toLocaleLowerCase().includes(input.toLowerCase());
                }));
            } else {
                this.storage = [];
            }
        }
    },
    methods: {
        close() {
            this.visible = false;
            alt.emit('menu', false);
        },
        select(model) {
            alt.emit('select', model);
        }
    }
});