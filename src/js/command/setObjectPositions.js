/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Set object properties
 */
import commandFactory from '../factory/command';
import Promise from 'core-js/library/es6/promise';
import consts from '../consts';

const {commandNames} = consts;

const command = {
    name: commandNames.SET_OBJECT_POSITIONS,

    /**
     * Set object properties
     * @param {Graphics} graphics - Graphics instance
     * @param {array} settings - object id
     * @param {Object} posInfo - position object
     *  @param {number} posInfo.x - x position
     *  @param {number} posInfo.y - y position
     *  @param {string} posInfo.originX - can be 'left', 'center', 'right'
     *  @param {string} posInfo.originY - can be 'top', 'center', 'bottom'
     * @returns {Promise}
     */
    execute(graphics, settings) {
        this.undoData.propsList = [];
        let set = null;
        let targetObj = null;

        for (let i = 0; i < settings.length; i += 1) {
            set = settings[i];
            targetObj = graphics.getObject(set.id);
            if (targetObj) {
                this.undoData.propsList.push({
                    id: set.id,
                    props: graphics.getObjectProperties(set.id, ['left', 'top'])
                });
                graphics.setObjectPosition(set.id, set.posInfo);
            }
        }
        graphics.renderAll();

        return Promise.resolve();
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        for (let index = 0; index < this.undoData.propsList.length; index += 1) {
            const {id, props} = this.undoData.propsList[index];
            graphics.setObjectProperties(id, props);
        }
        graphics.renderAll();

        return Promise.resolve();
    }
};

commandFactory.register(command);

module.exports = command;
