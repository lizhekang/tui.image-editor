/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview CropperDrawingMode class
 */
import DrawingMode from '../interface/drawingMode';
import consts from '../consts';

const {drawingModes} = consts;
const components = consts.componentNames;

/**
 * CropperDrawingMode class
 * @class
 * @ignore
 */
class CropperDrawingMode extends DrawingMode {
    constructor() {
        super(drawingModes.CROPPER);
    }

    /**
    * start this drawing mode
    * @param {Graphics} graphics - Graphics instance
    * @param {Object} options - Params options
    * @override
    */
    start(graphics, options) {
        const cropper = graphics.getComponent(components.CROPPER);
        cropper.start(options);
    }

    /**
     * stop this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    end(graphics) {
        const cropper = graphics.getComponent(components.CROPPER);
        cropper.end();
    }
}

module.exports = CropperDrawingMode;
