/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Free drawing module, Set brush
 */
import fabric from 'fabric.upgrade/dist/fabric.require';
import Component from '../interface/component';
import consts from '../consts';

/**
 * FreeDrawing
 * @class FreeDrawing
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class FreeDrawing extends Component {
    constructor(graphics) {
        super(consts.componentNames.FREE_DRAWING, graphics);

        /**
         * Brush width
         * @type {number}
         */
        this.width = 12;

        /**
         * fabric.Color instance for brush color
         * @type {fabric.Color}
         */
        this.oColor = new fabric.Color('rgba(0, 0, 0, 0.5)');
    }

    /**
     * Start free drawing mode
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    start(setting) {
        const canvas = this.getCanvas();

        canvas.isDrawingMode = true;
        this.setBrush(setting);
    }

    /**
     * Set brush
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    setBrush(setting) {
        setting = setting || {};
        const isMosaic = setting.mosaic;
        const brush = isMosaic ? this.getCanvas().MosaicDrawingBrush : this.getCanvas().freeDrawingBrush;

        if (isMosaic) {
            brush.blocksize = setting.blocksize || 10;
            if (setting.isNew) {
                brush.mosaicSign = new Date().getTime();
            }
        }

        this.width = setting.width || this.width;
        if (setting.color) {
            this.oColor = new fabric.Color(setting.color);
        }
        brush.width = this.width;
        brush.color = this.oColor.toRgba();

        this.getCanvas().freeDrawingBrush = brush;
    }

    /**
     * End free drawing mode
     */
    end() {
        const canvas = this.getCanvas();

        canvas.isDrawingMode = false;
    }
}

module.exports = FreeDrawing;
