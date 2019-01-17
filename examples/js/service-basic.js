/**
 * basic.js
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview
 */
'use strict';

var supportingFileAPI = !!(window.File && window.FileList && window.FileReader);
var rImageType = /data:(image\/.+);base64,/;
var shapeOptions = {};
var shapeType;
var activeObjectId;

// Buttons
var $btns = $('.menu-item');
var $btnsActivatable = $btns.filter('.activatable');
var $inputImage = $('#input-image-file');
var $btnDownload = $('#btn-download');

var $btnUndo = $('#btn-undo');
var $btnRedo = $('#btn-redo');
var $btnClearObjects = $('#btn-clear-objects');
var $btnRemoveActiveObject = $('#btn-remove-active-object');
var $btnCrop = $('#btn-crop');
var $btnFlip = $('#btn-flip');
var $btnRotation = $('#btn-rotation');
var $btnDrawLine = $('#btn-draw-line');
var $btnDrawShape = $('#btn-draw-shape');
var $btnApplyCrop = $('#btn-apply-crop');
var $btnCancelCrop = $('#btn-cancel-crop');
var $btnFlipX = $('#btn-flip-x');
var $btnFlipY = $('#btn-flip-y');
var $btnResetFlip = $('#btn-reset-flip');
var $btnRotateClockwise = $('#btn-rotate-clockwise');
var $btnRotateCounterClockWise = $('#btn-rotate-counter-clockwise');
var $btnText = $('#btn-text');
var $btnTextStyle = $('.btn-text-style');
var $btnAddIcon = $('#btn-add-icon');
var $btnRegisterIcon = $('#btn-register-icon');
var $btnMaskFilter = $('#btn-mask-filter');
var $btnImageFilter = $('#btn-image-filter');
var $btnLoadMaskImage = $('#input-mask-image-file');
var $btnApplyMask = $('#btn-apply-mask');
var $btnClose = $('.close');

// Input etc.
var $inputRotationRange = $('#input-rotation-range');
var $inputBrushWidthRange = $('#input-brush-width-range');
var $inputFontSizeRange = $('#input-font-size-range');
var $inputStrokeWidthRange = $('#input-stroke-width-range');
var $inputCheckTransparent = $('#input-check-transparent');
var $inputCheckGrayscale = $('#input-check-grayscale');
var $inputCheckInvert = $('#input-check-invert');
var $inputCheckSepia = $('#input-check-sepia');
var $inputCheckSepia2 = $('#input-check-sepia2');
var $inputCheckBlur = $('#input-check-blur');
var $inputCheckOld = $('#input-check-old');
var $inputCheckSharpen = $('#input-check-sharpen');
var $inputCheckEmboss = $('#input-check-emboss');
var $inputCheckRemoveWhite = $('#input-check-remove-white');
var $inputRangeRemoveWhiteThreshold = $('#input-range-remove-white-threshold');
var $inputRangeOldPercent = $('#input-range-old-percent');
var $inputRangeRemoveWhiteDistance = $('#input-range-remove-white-distance');
var $inputCheckBrightness = $('#input-check-brightness');
var $inputRangeBrightnessValue = $('#input-range-brightness-value');
var $inputCheckNoise = $('#input-check-noise');
var $inputRangeNoiseValue = $('#input-range-noise-value');
var $inputCheckGradientTransparency = $('#input-check-gradient-transparancy');
var $inputRangeGradientTransparencyValue = $('#input-range-gradient-transparency-value');
var $inputCheckPixelate = $('#input-check-pixelate');
var $inputRangePixelateValue = $('#input-range-pixelate-value');
var $inputCheckTint = $('#input-check-tint');
var $inputRangeTintOpacityValue = $('#input-range-tint-opacity-value');
var $inputCheckMultiply = $('#input-check-multiply');
var $inputCheckBlend = $('#input-check-blend');
var $inputCheckColorFilter = $('#input-check-color-filter');
var $inputRangeColorFilterValue = $('#input-range-color-filter-value');

// Sub menus
var $displayingSubMenu = $();
var $cropSubMenu = $('#crop-sub-menu');
var $flipSubMenu = $('#flip-sub-menu');
var $rotationSubMenu = $('#rotation-sub-menu');
var $freeDrawingSubMenu = $('#free-drawing-sub-menu');
var $drawLineSubMenu = $('#draw-line-sub-menu');
var $drawShapeSubMenu = $('#draw-shape-sub-menu');
var $textSubMenu = $('#text-sub-menu');
var $iconSubMenu = $('#icon-sub-menu');
var $filterSubMenu = $('#filter-sub-menu');
var $imageFilterSubMenu = $('#image-filter-sub-menu');

// Select line type
var $selectLine = $('[name="select-line-type"]');

// Select shape type
var $selectShapeType = $('[name="select-shape-type"]');

// Select color of shape type
var $selectColorType = $('[name="select-color-type"]');

//Select blend type
var $selectBlendType = $('[name="select-blend-type"]');

// Image editor
var imageEditor = new tui.ImageEditor('.tui-image-editor', {
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    scaleToMax: true,
    selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70
    },
    noSelector: true
});

// Color picker for free drawing
var brushColorpicker = tui.component.colorpicker.create({
    container: $('#tui-brush-color-picker')[0],
    color: '#000000'
});

// Color picker for text palette
var textColorpicker = tui.component.colorpicker.create({
    container: $('#tui-text-color-picker')[0],
    color: '#000000'
});

// Color picker for shape
var shapeColorpicker = tui.component.colorpicker.create({
    container: $('#tui-shape-color-picker')[0],
    color: '#000000'
});

// Color picker for icon
var iconColorpicker = tui.component.colorpicker.create({
    container: $('#tui-icon-color-picker')[0],
    color: '#000000'
});

var tintColorpicker = tui.component.colorpicker.create({
    container: $('#tui-tint-color-picker')[0],
    color: '#000000'
});

var multiplyColorpicker = tui.component.colorpicker.create({
    container: $('#tui-multiply-color-picker')[0],
    color: '#000000'
});

var blendColorpicker = tui.component.colorpicker.create({
    container: $('#tui-blend-color-picker')[0],
    color: '#00FF00'
});

// Common global functions
// HEX to RGBA
function hexToRGBa(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    var a = alpha || 1;

    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

function base64ToBlob(data) {
    var mimeString = '';
    var raw, uInt8Array, i, rawLength;

    raw = data.replace(rImageType, function(header, imageType) {
        mimeString = imageType;

        return '';
    });

    raw = atob(raw);
    rawLength = raw.length;
    uInt8Array = new Uint8Array(rawLength); // eslint-disable-line

    for (i = 0; i < rawLength; i += 1) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: mimeString});
}

function resizeEditor() {
    var $editor = $('.tui-image-editor');
    var $container = $('.tui-image-editor-canvas-container');
    var height = parseFloat($container.css('max-height'));

    $editor.height(height);
}

function getBrushSettings() {
    var brushWidth = $inputBrushWidthRange.val();
    var brushColor = brushColorpicker.getColor();

    return {
        width: brushWidth,
        color: hexToRGBa(brushColor, 0.5)
    };
}

function activateShapeMode() {
    if (imageEditor.getDrawingMode() !== 'SHAPE') {
        imageEditor.stopDrawingMode();
        imageEditor.startDrawingMode('SHAPE');
    }
}

function activateIconMode() {
    imageEditor.stopDrawingMode();
}

function activateTextMode() {
    if (imageEditor.getDrawingMode() !== 'TEXT') {
        imageEditor.stopDrawingMode();
        imageEditor.startDrawingMode('TEXT');
    }
}

function setTextToolbar(obj) {
    var fontSize = obj.fontSize;
    var fontColor = obj.fill;

    $inputFontSizeRange.val(fontSize);
    textColorpicker.setColor(fontColor);
}

function setIconToolbar(obj) {
    var iconColor = obj.fill;

    iconColorpicker.setColor(iconColor);
}

function setShapeToolbar(obj) {
    var strokeColor, fillColor, isTransparent;
    var colorType = $selectColorType.val();

    if (colorType === 'stroke') {
        strokeColor = obj.stroke;
        isTransparent = (strokeColor === 'transparent');

        if (!isTransparent) {
            shapeColorpicker.setColor(strokeColor);
        }
    } else if (colorType === 'fill') {
        fillColor = obj.fill;
        isTransparent = (fillColor === 'transparent');

        if (!isTransparent) {
            shapeColorpicker.setColor(fillColor);
        }
    }

    $inputCheckTransparent.prop('checked', isTransparent);
    $inputStrokeWidthRange.val(obj.strokeWidth);
}

function showSubMenu(type) {
    var $submenu;

    switch (type) {
        case 'shape':
            $submenu = $drawShapeSubMenu;
            break;
        case 'icon':
            $submenu = $iconSubMenu;
            break;
        case 'text':
            $submenu = $textSubMenu;
            break;
        default:
            $submenu = 0;
    }

    $displayingSubMenu.hide();
    $displayingSubMenu = $submenu.show();
}

function applyOrRemoveFilter(applying, type, options) {
    if (applying) {
        imageEditor.applyFilter(type, options).then(result => {
            console.log(result);
        });
    } else {
        imageEditor.removeFilter(type);
    }
}
console.log(imageEditor, 12);
// Attach image editor custom events
imageEditor.on({
    objectRemove: function(target) {
        console.log('remove');
        imageEditor.removeActiveObject();
    },
    textEditing: function(target) {
        console.log('editing', target);
        var id = target.__fe_id;
        imageEditor.changeText(id, 'lalal');
    },
    objectRotateFix: function(data) {
        console.log('fix', data.angle);
    },
    objectAdded: function(objectProps) {
        console.info(objectProps);
    },
    undoStackChanged: function(length) {
        if (length) {
            $btnUndo.removeClass('disabled');
        } else {
            $btnUndo.addClass('disabled');
        }
        resizeEditor();
    },
    redoStackChanged: function(length) {
        if (length) {
            $btnRedo.removeClass('disabled');
        } else {
            $btnRedo.addClass('disabled');
        }
        resizeEditor();
    },
    objectScaled: function(obj) {
        if (obj.type === 'text') {
            $inputFontSizeRange.val(obj.fontSize);
        }
    },
    addText: function(pos) {
        imageEditor.addText('双击编辑', {
            position: pos.originPosition,
            styles: {
                outerDecoration: {
                    backgroundColor: '#ffecd0',
                    borderColor: '#cd1b1e',
                    borderLineWidth: 2,
                    cornerSize: 40,
                    radius: 10,
                    offsetX: 24,
                    offsetY: 12,
                    tl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+ICA8bWV0YWRhdGE+PD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz48eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+ICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+ICAgPC9yZGY6UkRGPjwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PjwvbWV0YWRhdGE+PGRlZnM+ICAgIDxzdHlsZT4gICAgICAuY2xzLTEgeyAgICAgICAgZmlsbDogI2YxNDQ0NDsgICAgICAgIGZpbGwtcnVsZTogZXZlbm9kZDsgICAgICB9ICAgIDwvc3R5bGU+ICA8L2RlZnM+ICA8ZyBpZD0iVG9wX2xlZnQiPiAgICA8ZyBpZD0iVG9wX2xlZnQtMiIgZGF0YS1uYW1lPSJUb3BfbGVmdCI+ICAgICAgPHBhdGggaWQ9IuWchuinkuefqeW9ol83X+aLt+i0nV84IiBkYXRhLW5hbWU9IuWchuinkuefqeW9oiA3IOaLt+i0nSA4IiBjbGFzcz0iY2xzLTEiIGQ9Ik0xMjY3LjY5LDMwOWExLjU0LDEuNTQsMCwwLDEsMS41NCwxLjUzOHYzLjA3N2ExLjU0LDEuNTQsMCwwLDEtMy4wOCwwdi0zLjA3N0ExLjU0LDEuNTQsMCwwLDEsMTI2Ny42OSwzMDlabTAsOS44NDZhMS41NCwxLjU0LDAsMCwxLDEuNTQsMS41Mzl2My4wNzdhMS41NCwxLjU0LDAsMCwxLTMuMDgsMHYtMy4wNzdBMS41NCwxLjU0LDAsMCwxLDEyNjcuNjksMzE4Ljg0NlptMy42OS0zLjA3N2gzLjA4YTEuNTM5LDEuNTM5LDAsMSwxLDAsMy4wNzdoLTMuMDhBMS41MzksMS41MzksMCwwLDEsMTI3MS4zOCwzMTUuNzY5Wm0tOS44NCwwaDMuMDhhMS41MzksMS41MzksMCwwLDEsMCwzLjA3N2gtMy4wOEExLjUzOSwxLjUzOSwwLDEsMSwxMjYxLjU0LDMxNS43NjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTIxMyAtMjYwKSIvPiAgICAgIDxwYXRoIGlkPSLlnIbop5Lnn6nlvaJfN1/mi7fotJ1fOC0yIiBkYXRhLW5hbWU9IuWchuinkuefqeW9oiA3IOaLt+i0nSA4IiBjbGFzcz0iY2xzLTEiIGQ9Ik0xMjkyLjI1LDMyNWExLjI0NSwxLjI0NSwwLDAsMSwxLjI0LDEuMjQ0djIuNTE0YTEuMjQ1LDEuMjQ1LDAsMCwxLTIuNDksMHYtMi41MTRBMS4yNDcsMS4yNDcsMCwwLDEsMTI5Mi4yNSwzMjVabTAsOGExLjI0NSwxLjI0NSwwLDAsMSwxLjI0LDEuMjQ0djIuNTE0YTEuMjQ1LDEuMjQ1LDAsMCwxLTIuNDksMHYtMi41MTRBMS4yNDcsMS4yNDcsMCwwLDEsMTI5Mi4yNSwzMzNabTMtMi41aDIuNWExLjI1LDEuMjUsMCwwLDEsMCwyLjVoLTIuNUExLjI1LDEuMjUsMCwwLDEsMTI5NS4yNSwzMzAuNVptLTguMDEuMDFoMi41MmExLjI0NCwxLjI0NCwwLDAsMSwwLDIuNDg4aC0yLjUyQTEuMjQ0LDEuMjQ0LDAsMCwxLDEyODcuMjQsMzMwLjUxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyMTMgLTI2MCkiLz4gICAgPC9nPiAgPC9nPjwvc3ZnPg==',
                    tr: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+ICA8bWV0YWRhdGE+PD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz48eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+ICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+ICAgPC9yZGY6UkRGPjwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PjwvbWV0YWRhdGE+PGRlZnM+ICAgIDxzdHlsZT4gICAgICAuY2xzLTEgeyAgICAgICAgZmlsbDogI2YxNDQ0NDsgICAgICAgIGZpbGwtcnVsZTogZXZlbm9kZDsgICAgICB9ICAgIDwvc3R5bGU+ICA8L2RlZnM+ICA8ZyBpZD0iVG9wX3JpZ2h0Ij4gICAgPGcgaWQ9IlRvcF9yaWdodC0yIiBkYXRhLW5hbWU9IlRvcF9yaWdodCI+ICAgICAgPHBhdGggaWQ9IuWchuinkuefqeW9ol83X+aLt+i0nV8zIiBkYXRhLW5hbWU9IuWchuinkuefqeW9oiA3IOaLt+i0nSAzIiBjbGFzcz0iY2xzLTEiIGQ9Ik0xNDcyLjUsMzI3YTIuNSwyLjUsMCwwLDEsMi41LDIuNXY1YTIuNSwyLjUsMCwwLDEtNSwwdi01QTIuNSwyLjUsMCwwLDEsMTQ3Mi41LDMyN1ptMCwxNmEyLjUsMi41LDAsMCwxLDIuNSwyLjV2NWEyLjUsMi41LDAsMCwxLTUsMHYtNUEyLjUsMi41LDAsMCwxLDE0NzIuNSwzNDNabTYtNWg1YTIuNSwyLjUsMCwwLDEsMCw1aC01QTIuNSwyLjUsMCwwLDEsMTQ3OC41LDMzOFptLTE2LDBoNWEyLjUsMi41LDAsMCwxLDAsNWgtNUEyLjUsMi41LDAsMCwxLDE0NjIuNSwzMzhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQzMyAtMjYwKSIvPiAgICAgIDxwYXRoIGlkPSLlnIbop5Lnn6nlvaJfN1/mi7fotJ1fNCIgZGF0YS1uYW1lPSLlnIbop5Lnn6nlvaIgNyDmi7fotJ0gNCIgY2xhc3M9ImNscy0xIiBkPSJNMTQ3NC42OSwzMDBhMS41NCwxLjU0LDAsMCwxLDEuNTQsMS41Mzh2My4wNzdhMS41NCwxLjU0LDAsMCwxLTMuMDgsMHYtMy4wNzdBMS41NCwxLjU0LDAsMCwxLDE0NzQuNjksMzAwWm0wLDkuODQ2YTEuNTQsMS41NCwwLDAsMSwxLjU0LDEuNTM5djMuMDc3YTEuNTQsMS41NCwwLDAsMS0zLjA4LDB2LTMuMDc3QTEuNTQsMS41NCwwLDAsMSwxNDc0LjY5LDMwOS44NDZabTMuNjktMy4wNzdoMy4wOGExLjUzOSwxLjUzOSwwLDEsMSwwLDMuMDc3aC0zLjA4QTEuNTM5LDEuNTM5LDAsMCwxLDE0NzguMzgsMzA2Ljc2OVptLTkuODQsMGgzLjA4YTEuNTM5LDEuNTM5LDAsMCwxLDAsMy4wNzdoLTMuMDhBMS41MzksMS41MzksMCwxLDEsMTQ2OC41NCwzMDYuNzY5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0MzMgLTI2MCkiLz4gICAgICA8cGF0aCBpZD0i5ZyG6KeS55+p5b2iXzdf5ou36LSdXzUiIGRhdGEtbmFtZT0i5ZyG6KeS55+p5b2iIDcg5ou36LSdIDUiIGNsYXNzPSJjbHMtMSIgZD0iTTE0OTkuMjUsMzE2YTEuMjQ1LDEuMjQ1LDAsMCwxLDEuMjQsMS4yNDR2Mi41MTRhMS4yNDUsMS4yNDUsMCwwLDEtMi40OSwwdi0yLjUxNEExLjI0NywxLjI0NywwLDAsMSwxNDk5LjI1LDMxNlptMCw4YTEuMjQ1LDEuMjQ1LDAsMCwxLDEuMjQsMS4yNDR2Mi41MTRhMS4yNDUsMS4yNDUsMCwwLDEtMi40OSwwdi0yLjUxNEExLjI0NywxLjI0NywwLDAsMSwxNDk5LjI1LDMyNFptMy0yLjVoMi41YTEuMjUsMS4yNSwwLDAsMSwwLDIuNWgtMi41QTEuMjUsMS4yNSwwLDAsMSwxNTAyLjI1LDMyMS41Wm0tOC4wMS4wMWgyLjUyYTEuMjQ0LDEuMjQ0LDAsMCwxLDAsMi40ODhoLTIuNTJBMS4yNDQsMS4yNDQsMCwwLDEsMTQ5NC4yNCwzMjEuNTFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQzMyAtMjYwKSIvPiAgICAgIDxwYXRoIGlkPSLlnIbop5Lnn6nlvaJfN1/mi7fotJ1fNyIgZGF0YS1uYW1lPSLlnIbop5Lnn6nlvaIgNyDmi7fotJ0gNyIgY2xhc3M9ImNscy0xIiBkPSJNMTQ0OS4yNSwzMjVhMS4yNDUsMS4yNDUsMCwwLDEsMS4yNCwxLjI0NHYyLjUxNGExLjI0NSwxLjI0NSwwLDAsMS0yLjQ5LDB2LTIuNTE0QTEuMjQ3LDEuMjQ3LDAsMCwxLDE0NDkuMjUsMzI1Wm0wLDhhMS4yNDUsMS4yNDUsMCwwLDEsMS4yNCwxLjI0NHYyLjUxNGExLjI0NSwxLjI0NSwwLDAsMS0yLjQ5LDB2LTIuNTE0QTEuMjQ3LDEuMjQ3LDAsMCwxLDE0NDkuMjUsMzMzWm0zLTIuNWgyLjVhMS4yNSwxLjI1LDAsMCwxLDAsMi41aC0yLjVBMS4yNSwxLjI1LDAsMCwxLDE0NTIuMjUsMzMwLjVabS04LjAxLjAxaDIuNTJhMS4yNDQsMS4yNDQsMCwwLDEsMCwyLjQ4OGgtMi41MkExLjI0NCwxLjI0NCwwLDAsMSwxNDQ0LjI0LDMzMC41MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNDMzIC0yNjApIi8+ICAgIDwvZz4gIDwvZz48L3N2Zz4=',
                    bl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+ICA8bWV0YWRhdGE+PD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz48eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+ICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+ICAgPC9yZGY6UkRGPjwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PjwvbWV0YWRhdGE+PGRlZnM+ICAgIDxzdHlsZT4gICAgICAuY2xzLTEgeyAgICAgICAgZmlsbDogI2VhNGM0YzsgICAgICB9ICAgICAgLmNscy0xLCAuY2xzLTIsIC5jbHMtMywgLmNscy00LCAuY2xzLTUgeyAgICAgICAgc3Ryb2tlOiAjY2QxYjFlOyAgICAgICAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyAgICAgICAgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsgICAgICAgIHN0cm9rZS13aWR0aDogM3B4OyAgICAgIH0gICAgICAuY2xzLTEsIC5jbHMtMiwgLmNscy0zLCAuY2xzLTQgeyAgICAgICAgZmlsbC1ydWxlOiBldmVub2RkOyAgICAgIH0gICAgICAuY2xzLTIgeyAgICAgICAgZmlsbDogI2YzNjE2MTsgICAgICB9ICAgICAgLmNscy0zIHsgICAgICAgIGZpbGw6ICNmZjUxNTE7ICAgICAgfSAgICAgIC5jbHMtNCB7ICAgICAgICBmaWxsOiAjZmY2NzY3OyAgICAgIH0gICAgICAuY2xzLTUgeyAgICAgICAgZmlsbDogI2ZmYzY3MDsgICAgICB9ICAgICAgLmNscy02IHsgICAgICAgIGZvbnQtc2l6ZTogMTguNjY3cHg7ICAgICAgICBmaWxsOiAjY2QxYjFlOyAgICAgICAgdGV4dC1hbmNob3I6IG1pZGRsZTsgICAgICAgIGZvbnQtZmFtaWx5OiAiUGluZ0ZhbmcgU0MiOyAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDsgICAgICB9ICAgIDwvc3R5bGU+ICA8L2RlZnM+ICA8ZyBpZD0iQm90dG9tX2xlZnQiPiAgICA8ZyBpZD0iQm90dG9tX2xlZnQtMiIgZGF0YS1uYW1lPSJCb3R0b21fbGVmdCI+ICAgICAgPGcgaWQ9Iue6ouWMhSI+ICAgICAgICA8cGF0aCBpZD0i5ZyG6KeS55+p5b2iXzEiIGRhdGEtbmFtZT0i5ZyG6KeS55+p5b2iIDEiIGNsYXNzPSJjbHMtMSIgZD0iTTEyOTQuNTcsNDI5Ljg4NmwxOS45LDguNDEzYTUuNjc2LDUuNjc2LDAsMCwxLDIuOTMsNy40NjdsLTEzLjQ0LDMxLjc4OWE1LjY2Niw1LjY2NiwwLDAsMS03LjM5LDMuMTA1bC0xOS45MS04LjQxMmE1LjY2NSw1LjY2NSwwLDAsMS0yLjkyLTcuNDY4bDEzLjQzLTMxLjc4OUE1LjY4MSw1LjY4MSwwLDAsMSwxMjk0LjU3LDQyOS44ODZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTIxMyAtNDA2KSIvPiAgICAgICAgPHBhdGggaWQ9IuW9oueKtl8xMSIgZGF0YS1uYW1lPSLlvaLnirYgMTEiIGNsYXNzPSJjbHMtMiIgZD0iTTEyODUuNTMsNDM3LjEzM3MtMC44Myw2LjUyMiwxMi45NiwxMi40ODksMTcuMDcsMC45ODUsMTcuMDcuOTg1bDIuNTItNS45NDdhNy42NzksNy42NzksMCwwLDAtNS40Mi02Ljk2M2MtNS4wOC0yLjE1NS0xOC4wNi03LjYzNC0xOC4wNi03LjYzNHMtNS41OS0xLjUtNy40LDMuMTA1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyMTMgLTQwNikiLz4gICAgICA8L2c+ICAgICAgPGcgaWQ9Iue6ouWMhS0yIiBkYXRhLW5hbWU9Iue6ouWMhSI+ICAgICAgICA8cGF0aCBpZD0i5ZyG6KeS55+p5b2iXzEtMiIgZGF0YS1uYW1lPSLlnIbop5Lnn6nlvaIgMSIgY2xhc3M9ImNscy0zIiBkPSJNMTI1My44Nyw0MTcuNzg4aDMwLjg1YTgsOCwwLDAsMSw4LDhWNDczLjlhOCw4LDAsMCwxLTgsOGgtMzAuODVhOCw4LDAsMCwxLTgtOFY0MjUuNzg4QTgsOCwwLDAsMSwxMjUzLjg3LDQxNy43ODhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTIxMyAtNDA2KSIvPiAgICAgICAgPHBhdGggaWQ9IuW9oueKtl8xMS0yIiBkYXRhLW5hbWU9IuW9oueKtiAxMSIgY2xhc3M9ImNscy00IiBkPSJNMTI0Niw0MzJzMi41NCw4LjgyNCwyNCw5LDIzLTgsMjMtOHYtOXMtMi42NC02LjQwOS0xMS02Yy03Ljg3LS4wMTMtMjgsMC0yOCwwcy04LjE4LDEuMS04LDh2NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjEzIC00MDYpIi8+ICAgICAgICA8Y2lyY2xlIGlkPSLmpK3lnIZfMiIgZGF0YS1uYW1lPSLmpK3lnIYgMiIgY2xhc3M9ImNscy01IiBjeD0iNTYuMyIgY3k9IjM1LjE3MiIgcj0iMTAuNDIiLz4gICAgICAgIDx0ZXh0IGlkPSJfIiBkYXRhLW5hbWU9IsKlIiBjbGFzcz0iY2xzLTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2LjAzMiA0MC44MzYpIHNjYWxlKDAuNzQ0IDAuNzQzKSI+wqU8L3RleHQ+ICAgICAgPC9nPiAgICA8L2c+ICA8L2c+PC9zdmc+',
                    br: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+ICA8bWV0YWRhdGE+PD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz48eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+ICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+ICAgPC9yZGY6UkRGPjwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PjwvbWV0YWRhdGE+PGRlZnM+ICAgIDxzdHlsZT4gICAgICAuY2xzLTEgeyAgICAgICAgZmlsbDogI2Y5YjM1ODsgICAgICB9ICAgICAgLmNscy0xLCAuY2xzLTIsIC5jbHMtMyB7ICAgICAgICBzdHJva2U6ICNjZDFiMWU7ICAgICAgICBzdHJva2UtbGluZWNhcDogcm91bmQ7ICAgICAgICBzdHJva2UtbGluZWpvaW46IHJvdW5kOyAgICAgICAgc3Ryb2tlLXdpZHRoOiAzcHg7ICAgICAgICBmaWxsLXJ1bGU6IGV2ZW5vZGQ7ICAgICAgfSAgICAgIC5jbHMtMiB7ICAgICAgICBmaWxsOiAjZmZhYzQwOyAgICAgIH0gICAgICAuY2xzLTMgeyAgICAgICAgZmlsbDogI2ZlY2MyNDsgICAgICB9ICAgIDwvc3R5bGU+ICA8L2RlZnM+ICA8ZyBpZD0iQm90dG9tX3JpZ2h0Ij4gICAgPGcgaWQ9IkJvdHRvbV9yaWdodC0yIiBkYXRhLW5hbWU9IkJvdHRvbV9yaWdodCI+ICAgICAgPGcgaWQ9IuWFg+WunSI+ICAgICAgICA8cGF0aCBpZD0i5b2i54q2XzkiIGRhdGEtbmFtZT0i5b2i54q2IDkiIGNsYXNzPSJjbHMtMSIgZD0iTTE0ODQuNzksNDYwLjU2MnM5LjQ3LTE1LjEsMjEuNTUuNTIzbC0xLjU3LDcuMzMxLTE4LjkzLS41MjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQzMyAtNDA2KSIvPiAgICAgICAgPHBhdGggaWQ9IuW9oueKtl84IiBkYXRhLW5hbWU9IuW9oueKtiA4IiBjbGFzcz0iY2xzLTIiIGQ9Ik0xNDgzLjIxLDQ1OS41MTVzMTAuNjgsOC41MzQsMjUuMjQsMGM0LjMtLjUsOC4yMiw2LjczNSwzLjE1LDE0LjY2MXMtMjIuODMsOS4xNjEtMjguOTIsMi42MTlDMTQ3NS40Nyw0NzAuNiwxNDc0LjU3LDQ2MC4xODIsMTQ4My4yMSw0NTkuNTE1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0MzMgLTQwNikiLz4gICAgICA8L2c+ICAgICAgPGcgaWQ9IuWFg+WunS0yIiBkYXRhLW5hbWU9IuWFg+WunSI+ICAgICAgICA8cGF0aCBpZD0i5b2i54q2XzktMiIgZGF0YS1uYW1lPSLlvaLnirYgOSIgY2xhc3M9ImNscy0yIiBkPSJNMTQ0OS40Miw0NDguNDVzMTUuMTEtMjQuMDQxLDM0LjM3LjgzNGwtMi41MSwxMS42NzUtMzAuMTgtLjgzNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNDMzIC00MDYpIi8+ICAgICAgICA8cGF0aCBpZD0i5b2i54q2XzgtMiIgZGF0YS1uYW1lPSLlvaLnirYgOCIgY2xhc3M9ImNscy0zIiBkPSJNMTQ0Ni45LDQ0Ni43ODJzMTcuMDQsMTMuNTkzLDQwLjI0LDBjNi44Ny0uNzg4LDEzLjEyLDEwLjcyOCw1LjAzLDIzLjM1MXMtMzYuNDEsMTQuNTg5LTQ2LjExLDQuMTY5QzE0MzQuNTUsNDY0LjQ0MiwxNDMzLjEyLDQ0Ny44NDYsMTQ0Ni45LDQ0Ni43ODJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQzMyAtNDA2KSIvPiAgICAgIDwvZz4gICAgPC9nPiAgPC9nPjwvc3ZnPg=='
                  }
            }
        }).then(objectProps => {
            console.log(objectProps);
            let text = objectProps;
        });
    },
    objectActivated: function(obj) {
        activeObjectId = obj.id;
        if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
            showSubMenu('shape');
            setShapeToolbar(obj);
            activateShapeMode();
        } else if (obj.type === 'icon') {
            showSubMenu('icon');
            setIconToolbar(obj);
            activateIconMode();
        } else if (obj.type === 'text') {
            showSubMenu('text');
            setTextToolbar(obj);
            activateTextMode();
        }
    },
    mousedown: function(event, originPointer) {
        if ($imageFilterSubMenu.is(':visible') && imageEditor.hasFilter('colorFilter')) {
            imageEditor.applyFilter('colorFilter', {
                x: parseInt(originPointer.x, 10),
                y: parseInt(originPointer.y, 10)
            });
        }
    }
});

// Attach button click event listeners
$btns.on('click', function() {
    $btnsActivatable.removeClass('active');
});

$btnsActivatable.on('click', function() {
    $(this).addClass('active');
});

$btnUndo.on('click', function() {
    $displayingSubMenu.hide();

    if (!$(this).hasClass('disabled')) {
        imageEditor.undo();
    }
});

$btnRedo.on('click', function() {
    $displayingSubMenu.hide();

    if (!$(this).hasClass('disabled')) {
        imageEditor.redo();
    }
});

$btnClearObjects.on('click', function() {
    $displayingSubMenu.hide();
    imageEditor.clearObjects();
});

$btnRemoveActiveObject.on('click', function() {
    $displayingSubMenu.hide();
    imageEditor.removeObject(activeObjectId);
});

$btnCrop.on('click', function() {
    const {height, width} = imageEditor.getCanvasSize();
    const ajwh = (height > width ? width : height) / 2;
    // console.log(imageEditor._graphics.adjustCanvasDimension(500, 500));
    imageEditor.startDrawingMode('CROPPER', {
        lockProportion: true,
        lockUniScaling: true,
        top: (height - ajwh) / 2,
        left: (width - ajwh) / 2,
        width: ajwh,
        height: ajwh,
        cornerStyle: 'cropper',
        cornerSize: 48,
        cornerWidth: 4,
        cornerColor: '#ffe626',
        cornerStrokeColor: '#fff',
        transparentCorners: false,
        lineWidth: 1,
        borderColor: '#fff'
    });
    $displayingSubMenu.hide();
    $displayingSubMenu = $cropSubMenu.show();
});

$btnFlip.on('click', function() {
    imageEditor.stopDrawingMode();
    $displayingSubMenu.hide();
    $displayingSubMenu = $flipSubMenu.show();
});

$btnRotation.on('click', function() {
    imageEditor.stopDrawingMode();
    $displayingSubMenu.hide();
    $displayingSubMenu = $rotationSubMenu.show();
});

$btnClose.on('click', function() {
    imageEditor.stopDrawingMode();
    $displayingSubMenu.hide();
});

$btnApplyCrop.on('click', function() {
    imageEditor.crop(imageEditor.getCropzoneRect()).then(() => {
        imageEditor.stopDrawingMode();
        resizeEditor();
    });
});

$btnCancelCrop.on('click', function() {
    imageEditor.stopDrawingMode();
});

$btnFlipX.on('click', function() {
    imageEditor.flipX().then(status => {
        console.log('flipX: ', status.flipX);
        console.log('flipY: ', status.flipY);
        console.log('angle: ', status.angle);
    });
});

$btnFlipY.on('click', function() {
    imageEditor.flipY().then(status => {
        console.log('flipX: ', status.flipX);
        console.log('flipY: ', status.flipY);
        console.log('angle: ', status.angle);
    });
});

$btnResetFlip.on('click', function() {
    imageEditor.resetFlip().then(status => {
        console.log('flipX: ', status.flipX);
        console.log('flipY: ', status.flipY);
        console.log('angle: ', status.angle);
    });
});

$btnRotateClockwise.on('click', function() {
    imageEditor.rotate(30);
});

$btnRotateCounterClockWise.on('click', function() {
    imageEditor.rotate(-30);
});

$inputRotationRange.on('mousedown', function() {
    var changeAngle = function() {
        imageEditor.setAngle(parseInt($inputRotationRange.val(), 10)).catch(() => {});
    };
    $(document).on('mousemove', changeAngle);
    $(document).on('mouseup', function stopChangingAngle() {
        $(document).off('mousemove', changeAngle);
        $(document).off('mouseup', stopChangingAngle);
    });
});

$inputRotationRange.on('change', function() {
    imageEditor.setAngle(parseInt($inputRotationRange.val(), 10)).catch(() => {});
});

$inputBrushWidthRange.on('change', function() {
    imageEditor.setBrush({width: parseInt(this.value, 10)});
});

$inputImage.on('change', function(event) {
    var file;

    if (!supportingFileAPI) {
        alert('This browser does not support file-api');
    }

    file = event.target.files[0];
    imageEditor.loadImageFromFile(file).then(result => {
        console.log(result);
        imageEditor.clearUndoStack();
    });
});

$btnDownload.on('click', function() {
    var imageName = imageEditor.getImageName();
    var dataURL = imageEditor.toDataURL();
    var blob, type, w;

    if (supportingFileAPI) {
        blob = base64ToBlob(dataURL);
        type = blob.type.split('/')[1];
        if (imageName.split('.').pop() !== type) {
            imageName += '.' + type;
        }

        // Library: FileSaver - saveAs
        saveAs(blob, imageName); // eslint-disable-line
    } else {
        alert('This browser needs a file-server');
        w = window.open();
        w.document.body.innerHTML = '<img src=' + dataURL + '>';
    }
});

// control draw line mode
$btnDrawLine.on('click', function() {
    imageEditor.stopDrawingMode();
    $displayingSubMenu.hide();
    $displayingSubMenu = $drawLineSubMenu.show();
    $selectLine.eq(0).change();
});

$selectLine.on('change', function() {
    var mode = $(this).val();
    var settings = getBrushSettings();

    imageEditor.stopDrawingMode();
    if (mode === 'freeDrawing') {
        imageEditor.startDrawingMode('FREE_DRAWING', settings);
    } else if(mode === 'mosaicDrawing') {
        settings.mosaic = true;
        settings.blocksize = 10;
        settings.isNew = true;
        imageEditor.startDrawingMode('FREE_DRAWING', settings);
    } else {
        imageEditor.startDrawingMode('LINE_DRAWING', settings);
    }
});

brushColorpicker.on('selectColor', function(event) {
    imageEditor.setBrush({
        color: hexToRGBa(event.color, 0.5)
    });
});

// control draw shape mode
$btnDrawShape.on('click', function() {
    showSubMenu('shape');

    // step 1. get options to draw shape from toolbar
    shapeType = $('[name="select-shape-type"]:checked').val();

    shapeOptions.stroke = '#000000';
    shapeOptions.fill = '#ffffff';

    shapeOptions.strokeWidth = Number($inputStrokeWidthRange.val());

    // step 2. set options to draw shape
    imageEditor.setDrawingShape(shapeType, shapeOptions);

    // step 3. start drawing shape mode
    activateShapeMode();
});

$selectShapeType.on('change', function() {
    shapeType = $(this).val();

    imageEditor.setDrawingShape(shapeType);
});

$inputCheckTransparent.on('change', function() {
    var colorType = $selectColorType.val();
    var isTransparent = $(this).prop('checked');
    var color;

    if (!isTransparent) {
        color = shapeColorpicker.getColor();
    } else {
        color = 'transparent';
    }

    if (colorType === 'stroke') {
        imageEditor.changeShape(activeObjectId, {
            stroke: color
        });
    } else if (colorType === 'fill') {
        imageEditor.changeShape(activeObjectId, {
            fill: color
        });
    }

    imageEditor.setDrawingShape(shapeType, shapeOptions);
});

shapeColorpicker.on('selectColor', function(event) {
    var colorType = $selectColorType.val();
    var isTransparent = $inputCheckTransparent.prop('checked');
    var color = event.color;

    if (isTransparent) {
        return;
    }

    if (colorType === 'stroke') {
        imageEditor.changeShape(activeObjectId, {
            stroke: color
        });
    } else if (colorType === 'fill') {
        imageEditor.changeShape(activeObjectId, {
            fill: color
        });
    }

    imageEditor.setDrawingShape(shapeType, shapeOptions);
});

$inputStrokeWidthRange.on('change', function() {
    var strokeWidth = Number($(this).val());

    imageEditor.changeShape(activeObjectId, {
        strokeWidth: strokeWidth
    });

    imageEditor.setDrawingShape(shapeType, shapeOptions);
});

// control text mode
$btnText.on('click', function() {
    showSubMenu('text');
    activateTextMode();
});

$inputFontSizeRange.on('change', function() {
    imageEditor.changeTextStyle(activeObjectId, {
        fontSize: parseInt(this.value, 10)
    });
});

$btnTextStyle.on('click', function(e) { // eslint-disable-line
    var styleType = $(this).attr('data-style-type');
    var styleObj;

    e.stopPropagation();

    switch (styleType) {
        case 'b':
            styleObj = {fontWeight: 'bold'};
            break;
        case 'i':
            styleObj = {fontStyle: 'italic'};
            break;
        case 'u':
            styleObj = {textDecoration: 'underline'};
            break;
        case 'l':
            styleObj = {textAlign: 'left'};
            break;
        case 'c':
            styleObj = {textAlign: 'center'};
            break;
        case 'r':
            styleObj = {textAlign: 'right'};
            break;
        default:
            styleObj = {};
    }

    imageEditor.changeTextStyle(activeObjectId, styleObj);
});

textColorpicker.on('selectColor', function(event) {
    imageEditor.changeTextStyle(activeObjectId, {
        'fill': event.color
    });
});

// control icon
$btnAddIcon.on('click', function() {
    showSubMenu('icon');
    activateIconMode();
});

function onClickIconSubMenu(event) {
    var element = event.target || event.srcElement;
    var iconType = $(element).attr('data-icon-type');

    imageEditor.once('mousedown', function(e, originPointer) {
        imageEditor.addIcon(iconType, {
            left: originPointer.x,
            top: originPointer.y
        }).then(objectProps => {
            // console.log(objectProps);
        });
    });
}

$btnRegisterIcon.on('click', function() {
    $iconSubMenu.find('.menu-item').eq(3).after(
        '<li id="customArrow" class="menu-item icon-text" data-icon-type="customArrow">↑</li>'
    );

    imageEditor.registerIcons({
        customArrow: 'M 60 0 L 120 60 H 90 L 75 45 V 180 H 45 V 45 L 30 60 H 0 Z'
    });

    $btnRegisterIcon.off('click');

    $iconSubMenu.on('click', '#customArrow', onClickIconSubMenu);
});

$iconSubMenu.on('click', '.icon-text', onClickIconSubMenu);

iconColorpicker.on('selectColor', function(event) {
    imageEditor.changeIconColor(activeObjectId, event.color);
});

// control mask filter
$btnMaskFilter.on('click', function() {
    imageEditor.stopDrawingMode();
    $displayingSubMenu.hide();

    $displayingSubMenu = $filterSubMenu.show();
});

$btnImageFilter.on('click', function() {
    var filters = {
        'grayscale': $inputCheckGrayscale,
        'invert': $inputCheckInvert,
        'sepia': $inputCheckSepia,
        'sepia2': $inputCheckSepia2,
        'blur': $inputCheckBlur,
        'oldMaker': $inputCheckOld,
        'shapren': $inputCheckSharpen,
        'emboss': $inputCheckEmboss,
        'removeWhite': $inputCheckRemoveWhite,
        'brightness': $inputCheckBrightness,
        'noise': $inputCheckNoise,
        'gradientTransparency': $inputCheckGradientTransparency,
        'pixelate': $inputCheckPixelate,
        'tint': $inputCheckTint,
        'multiply': $inputCheckMultiply,
        'blend': $inputCheckBlend,
        'colorFilter': $inputCheckColorFilter
    };

    tui.util.forEach(filters, function($value, key) {
        $value.prop('checked', imageEditor.hasFilter(key));
    });
    $displayingSubMenu.hide();

    $displayingSubMenu = $imageFilterSubMenu.show();
});

$btnLoadMaskImage.on('change', function() {
    var file;
    var imgUrl;

    if (!supportingFileAPI) {
        alert('This browser does not support file-api');
    }

    file = event.target.files[0];

    if (file) {
        imgUrl = URL.createObjectURL(file);

        imageEditor.loadImageFromURL(imageEditor.toDataURL(), 'FilterImage').then(() => {
            imageEditor.addImageObject(imgUrl).then(objectProps => {
                URL.revokeObjectURL(file);
                console.log(objectProps);
            });
        });
    }
});

$btnApplyMask.on('click', function() {
    imageEditor.applyFilter('mask', {
        maskObjId: activeObjectId
    }).then(result => {
        console.log(result);
    });
});

$inputCheckGrayscale.on('change', function() {
    applyOrRemoveFilter(this.checked, 'Grayscale', null);
});

$inputCheckInvert.on('change', function() {
    applyOrRemoveFilter(this.checked, 'Invert', null);
});

$inputCheckSepia.on('change', function() {
    applyOrRemoveFilter(this.checked, 'Sepia', null);
});

$inputCheckSepia2.on('change', function() {
    applyOrRemoveFilter(this.checked, 'Sepia2', null);
});

$inputCheckBlur.on('change', function() {
    applyOrRemoveFilter(this.checked, 'Blur', null);
});

$inputCheckOld.on('change', function() {
    applyOrRemoveFilter(this.checked, 'oldMaker', {
        percent: parseInt($inputRangeOldPercent.val(), 10)
    });
});

$inputCheckSharpen.on('change', function() {
    applyOrRemoveFilter(this.checked, 'Sharpen', null);
});

$inputCheckEmboss.on('change', function() {
    applyOrRemoveFilter(this.checked, 'Emboss', null);
});

$inputCheckRemoveWhite.on('change', function() {
    applyOrRemoveFilter(this.checked, 'removeWhite', {
        threshold: parseInt($inputRangeRemoveWhiteThreshold.val(), 10),
        distance: parseInt($inputRangeRemoveWhiteDistance.val(), 10)
    });
});

$inputRangeRemoveWhiteThreshold.on('change', function() {
    applyOrRemoveFilter($inputCheckRemoveWhite.is(':checked'), 'removeWhite', {
        threshold: parseInt(this.value, 10)
    });
});

$inputRangeOldPercent.on('change', function() {
    applyOrRemoveFilter($inputCheckOld.is(':checked'), 'oldMaker', {
        percent: parseInt(this.value, 10)
    });
});

$inputRangeRemoveWhiteDistance.on('change', function() {
    applyOrRemoveFilter($inputCheckRemoveWhite.is(':checked'), 'removeWhite', {
        distance: parseInt(this.value, 10)
    });
});

$inputCheckBrightness.on('change', function() {
    applyOrRemoveFilter(this.checked, 'brightness', {
        brightness: parseInt($inputRangeBrightnessValue.val(), 10)
    });
});

$inputRangeBrightnessValue.on('change', function() {
    applyOrRemoveFilter($inputCheckBrightness.is(':checked'), 'brightness', {
        brightness: parseInt(this.value, 10)
    });
});

$inputCheckNoise.on('change', function() {
    applyOrRemoveFilter(this.checked, 'noise', {
        noise: parseInt($inputRangeNoiseValue.val(), 10)
    });
});

$inputRangeNoiseValue.on('change', function() {
    applyOrRemoveFilter($inputCheckNoise.is(':checked'), 'noise', {
        noise: parseInt(this.value, 10)
    });
});

$inputCheckGradientTransparency.on('change', function() {
    applyOrRemoveFilter(this.checked, 'gradientTransparency', {
        threshold: parseInt($inputRangeGradientTransparencyValue.val(), 10)
    });
});

$inputRangeGradientTransparencyValue.on('change', function() {
    applyOrRemoveFilter($inputCheckGradientTransparency.is(':checked'), 'gradientTransparency', {
        threshold: parseInt(this.value, 10)
    });
});

$inputCheckPixelate.on('change', function() {
    applyOrRemoveFilter(this.checked, 'pixelate', {
        blocksize: parseInt($inputRangePixelateValue.val(), 10)
    });
});

$inputRangePixelateValue.on('change', function() {
    applyOrRemoveFilter($inputCheckPixelate.is(':checked'), 'pixelate', {
        blocksize: parseInt(this.value, 10)
    });
});

$inputCheckTint.on('change', function() {
    applyOrRemoveFilter(this.checked, 'tint', {
        color: tintColorpicker.getColor(),
        opacity: parseFloat($inputRangeTintOpacityValue.val())
    });
});

tintColorpicker.on('selectColor', function(e) {
    applyOrRemoveFilter($inputCheckTint.is(':checked'), 'tint', {
        color: e.color
    });
});

$inputRangeTintOpacityValue.on('change', function() {
    applyOrRemoveFilter($inputCheckTint.is(':checked'), 'tint', {
        opacity: parseFloat($inputRangeTintOpacityValue.val())
    });
});

$inputCheckMultiply.on('change', function() {
    applyOrRemoveFilter(this.checked, 'multiply', {
        color: multiplyColorpicker.getColor()
    });
});

multiplyColorpicker.on('selectColor', function(e) {
    applyOrRemoveFilter($inputCheckMultiply.is(':checked'), 'multiply', {
        color: e.color
    });
});

$inputCheckBlend.on('change', function() {
    applyOrRemoveFilter(this.checked, 'blend', {
        color: blendColorpicker.getColor(),
        mode: $selectBlendType.val()
    });
});

blendColorpicker.on('selectColor', function(e) {
    applyOrRemoveFilter($inputCheckBlend.is(':checked'), 'blend', {
        color: e.color
    });
});

$selectBlendType.on('change', function() {
    applyOrRemoveFilter($inputCheckBlend.is(':checked'), 'blend', {
        mode: this.value
    });
});

$inputCheckColorFilter.on('change', function() {
    applyOrRemoveFilter(this.checked, 'colorFilter', {
        color: '#FFFFFF',
        threshold: $inputRangeColorFilterValue.val()
    });
});

$inputRangeColorFilterValue.on('change', function() {
    applyOrRemoveFilter($inputCheckColorFilter.is(':checked'), 'colorFilter', {
        threshold: this.value
    });
});

// Etc..

// Load sample image
imageEditor.loadImageFromURL('img/sampleImage.jpg', 'SampleImage').then(sizeValue => {
    imageEditor.clearUndoStack();
});

// IE9 Unselectable
$('.menu').on('selectstart', function() {
    return false;
});
