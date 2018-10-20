/* eslint-disable */
/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview ColorFilter extending fabric.Image.filters.BaseFilter
 */
import fabric from 'fabric.upgrade/dist/fabric.require';

/**
 * OldMaker object
 * @class OldMaker
 * @extends {fabric.Image.filters.BaseFilter}
 * @ignore
 */
const OldMaker = fabric.util.createClass(fabric.Image.filters.BaseFilter, /** @lends BaseFilter.prototype */{
    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'OldMaker',

    /**
     * Constructor
     * @member fabric.Image.filters.OldMaker.prototype
     * @param {Object} [options] Options object
     * @param {Number} [options.color='#FFFFFF'] Value of color (0...255)
     * @param {Number} [options.threshold=45] Value of threshold (0...255)
     * @override
     */
    initialize(options) {
        if (!options) {
            options = {};
        }
        this.percent = options.percent || 50;
    },

    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
     */
    applyTo(canvasEl) { // eslint-disable-line
        const context = canvasEl.getContext('2d');
        let imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height);
        const {data, width, height} = imageData;
        const area_min = width < height ? width : height;
        // add noise
        // add pixed
        // add blur
        const noiseBase = 15;
        const PixedBase = 0.026 * Math.pow(area_min, 0.737);   // 160 * 160 比较好的pixed=1， 之后的可以按照该公式变化
        const BlurBase = 0.02;
        const percent = this.percent / 100;

        this._addNoise(data, Math.floor(noiseBase * percent));
        this._addPixed(data, height, width, Math.floor(PixedBase * percent));
        imageData = this._simpleBlur(context, imageData, percent * BlurBase);

        context.putImageData(imageData, 0, 0);
    },

    /**
     * noise filter
     * @param data
     * @param noise
     * @private
     */
    _addNoise(data, noise) {
        let rand = 0;
        for (let i = 0, len = data.length; i < len; i += 4) {
            rand = (0.5 - Math.random()) * noise;

            data[i] += rand;
            data[i + 1] += rand;
            data[i + 2] += rand;
        }
    },

    /**
     * pixed filter
     * @param data
     * @param height
     * @param width
     * @param blockSize
     * @private
     */
    _addPixed(data, height, width, blockSize) {
        let r, g, b, a, _height, _width;

        blockSize *= 1;
        if (blockSize <= 0) {
            return;
        }

        for (let i = 0; i < height; i += blockSize) {
            for (let j = 0; j < width; j += blockSize) {
                let index = ((i * 4) * width) + (j * 4);

                r = data[index];
                g = data[index + 1];
                b = data[index + 2];
                a = data[index + 3];

                _height = Math.min(i + blockSize, height);
                _width = Math.min(j + blockSize, width);
                for (let _i = i; _i < _height; _i += 1) {
                    for (let _j = j; _j < _width; _j += 1) {
                        index = ((_i * 4) * width) + (_j * 4);
                        data[index] = r;
                        data[index + 1] = g;
                        data[index + 2] = b;
                        data[index + 3] = a;
                    }
                }
            }
        }
    },

    /**
     * blur filter
     * @param context
     * @param imageData
     * @param _blur
     * @returns {ImageData}
     * @private
     */
    _simpleBlur(context, imageData, _blur) {
        let canvas1, canvas2,
            width = imageData.width,
            height = imageData.height;

        canvas1 = fabric.util.createCanvasElement();
        canvas2 = fabric.util.createCanvasElement();
        if (canvas1.width !== width || canvas1.height !== height) {
            canvas2.width = canvas1.width = width;
            canvas2.height = canvas1.height = height;
        }
        let ctx1 = canvas1.getContext('2d'),
            ctx2 = canvas2.getContext('2d'),
            nSamples = 15,
            random, percent, j, i,
            blur = _blur * 0.06 * 0.5;

        // load first canvas
        ctx1.putImageData(imageData, 0, 0);
        ctx2.clearRect(0, 0, width, height);

        for (i = -nSamples; i <= nSamples; i++) {
            //random = (Math.random() - 0.5) / 4;
            percent = i / nSamples;
            j = blur * percent * width + random;
            ctx2.globalAlpha = 1 - Math.abs(percent);
            ctx2.drawImage(canvas1, j, random);
            ctx1.drawImage(canvas2, 0, 0);
            ctx2.globalAlpha = 1;
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        }
        for (i = -nSamples; i <= nSamples; i++) {
            //random = (Math.random() - 0.5) / 4;
            random = 0;
            percent = i / nSamples;
            j = blur * percent * height + random;
            ctx2.globalAlpha = 1 - Math.abs(percent);
            ctx2.drawImage(canvas1, random, j);
            ctx1.drawImage(canvas2, 0, 0);
            ctx2.globalAlpha = 1;
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        }
        context.drawImage(canvas1, 0, 0);
        let newImageData = context.getImageData(0, 0, canvas1.width, canvas1.height);
        ctx1.globalAlpha = 1;
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        return newImageData;
    }
});

module.exports = OldMaker;
