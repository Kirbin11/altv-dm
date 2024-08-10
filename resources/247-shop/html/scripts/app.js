/* Visual Vehicle Spawner (0.1)
 * _dusieq#0404 (Discord), Enerv#6489 (Discord)
 * GPLv2 / MIT License
 */

let app = new Vue({
    el: '#app',
    data: {
        categories: [
            'All',
            'Аптечки',
            'Закур',
            'Прочее'
        ],
        models: [
            { category: 1, model: 'Бинты 1шт' },
            { category: 1, model: 'Желтая аптечка' },
            { category: 1, model: 'Супер хил?' },
            { category: 2, model: 'Green' },
            { category: 2, model: 'Blue' },
            { category: 2, model: 'White' },
            { category: 3, model: 'Энергетик' },
            { category: 3, model: 'Хз' }
            ],
        keyword: '',
        storage: [],
        visible: false
    },
    watch: {
        'keyword': function(input) {
            if (input.length > 0) {
                this.storage = this.models.filter((product => {
                    return product.model.toLocaleLowerCase().includes(input.toLowerCase());
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