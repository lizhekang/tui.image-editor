/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Add a text object
 */
import commandFactory from '../factory/command';
import Promise from 'core-js/library/es6/promise';
import consts from '../consts';

const {componentNames, commandNames} = consts;
const {TEXT} = componentNames;

const command = {
    name: commandNames.ADD_TEXTS,

    /**
     * Add a text object
     * @param {Graphics} graphics - Graphics instance
     * @param {Array<config>} configs - Options for text and styles
     *     @param {String} config.text - text string
     *     @param {Object} [config.styles] Initial styles
     *         @param {string} [config.styles.fill] Color
     *         @param {string} [config.styles.fontFamily] Font type for text
     *         @param {number} [config.styles.fontSize] Size
     *         @param {string} [config.styles.fontStyle] Type of inclination (normal / italic)
     *         @param {string} [config.styles.fontWeight] Type of thicker or thinner looking (normal / bold)
     *         @param {string} [config.styles.textAlign] Type of text align (left / center / right)
     *         @param {string} [config.styles.textDecoraiton] Type of line (underline / line-throgh / overline)
     *     @param {{x: number, y: number}} [config.position] - Initial position
     * @returns {Promise}
     */
    execute(graphics, configs) {
        const textComp = graphics.getComponent(TEXT);
        const result = [];
        let config = null;
        let p = null;

        this.undoData.objectArray = [];

        for (let index = 0; index < configs.length; index += 1) {
            config = configs[index];
            p = textComp.add(config.text, config.options).then(objectProps => {
                this.undoData.objectArray.push(graphics.getObject(objectProps.id));

                return objectProps;
            });

            result.push(p);
        }

        return Promise.all(result).then(arr => arr);
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        for (let index = 0; index < this.undoData.objectArray.length; index += 1) {
            graphics.remove(this.undoData.objectArray[index]);
        }

        return Promise.resolve();
    }
};

commandFactory.register(command);

module.exports = command;
