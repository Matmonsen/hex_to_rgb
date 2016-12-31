import './style.scss';
import {ColorHexNames, ColorNames, DefaultBackgroundColor, DefaultTextColor} from './constants';
import Utils from './utils';

/**
 * Figures out if white or black text is best with the specific background color
 * @param r
 * @param g
 * @param b
 * @returns {*}
 */
function whichTextColor(r,g,b) {

    let threshold = 105;
    let delta = parseInt((r * 0.299) + (g * 0.587) + (b * 0.114));

    return (255 - delta < threshold) ? '#000000' : '#ffffff';
}

/**
 * Checks which kind of input the user is typing
 * # or xxx or xxxxxx or #xxx or #xxxxxx is hex
 * rgb(x,x,x) or x,x,x or (x,x,x)  is rgb
 * @param input
 * @returns {*}
 */
function whatIsInput(input) {
    let type = null;
    if (input.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i) !== null) {
        type = 'hex';
    } else if (input.match(/rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/i)
        || input.match(/\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/i)
        || input.match(/[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/i)) {
        type = 'rgb';
    } else {
        type = 'name';
    }

    return type;
}

/**
 * * Converts the ipnut to two output and changes background color
 * @param input
 * @returns {*}
 */
function convert(input) {

    if (typeof input === 'undefined') {
        return {input: '', out_left: '', out_right: '', textColor: setTextColer(), background: DefaultBackgroundColor};
    }

    let trimmed = input.trim();
    let color = null;
    let type = whatIsInput(trimmed);
    switch (type) {
        case 'hex':
            color = hex(trimmed);
            break;
         case 'rgb':
             color = rgb(trimmed);
            break;
         case 'name':
             color = name(trimmed);
             break;
    }
    return color;
}

/**
 * Sets the text color based on an rgb
 * @param rgb
 * @returns {string}
 */
function setTextColer(rgb = '') {
    let textColor = DefaultTextColor;

    if (rgb !== '') {
        let rgb_array = rgb.replace('rgb', '').replace('(', '').replace(')', '').split(',');
        textColor = whichTextColor(rgb_array[0], rgb_array[1], rgb_array[2]);
    }
    return textColor;
}

/**
 * Converts a html named color to hex and rgb
 * @param input
 * @returns {*}
 */
function name(input) {
    let index = ColorNames.indexOf(input.toLowerCase());

    if (index === -1) {
        return {input: input, out_left: '', out_right: ''};
    }

    let name = ColorNames[index];
    let hex = ColorHexNames[index];
    let rgb = hex_to_rgb(hex);

    let background = hex === '' ? DefaultBackgroundColor : hex;

    return {input: name, out_left: hex, out_right: rgb, textColor: setTextColer(rgb), background: background};

}



/**
 * Converts a rgb color to hex and color name
 * @param input
 * @returns {*}
 */
function rgb(input) {

    // remove rgb and ()
    let rgb_array = input.replace('(', '').replace(')', '').replace('rgb', '').split(',');

    let r = parseInt(rgb_array[0]);
    let g = parseInt(rgb_array[1]);
    let b = parseInt(rgb_array[2]);

    // Is valid rgb
    if (rgb_array.length == 3 && r < 256 && g < 256 && b < 256) {
        // Bit shifts all values to numbers
        let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

        let indexOfColor = ColorHexNames.indexOf(hex.toUpperCase());
        let name = '';
        if (indexOfColor > -1) {
            name = ColorNames[indexOfColor];
        }

        let background = input;
        if (background.indexOf('rgb') === -1) {
            background = `rgb(${background})`;
        }

        return {input: input, out_left: hex, out_right: name, textColor: setTextColer(input), background: background};
    }
    return {input: input, out_left: '', out_right: '', textColor: setTextColer(), background: DefaultBackgroundColor};
}

/**
 * Converts hex to rgb and color name
 * @param input
 * @returns {*}
 */
function hex(input) {

    // If input is hex #xxx we convert it to #xxxxxx
    let long_hex = input.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let rgb = hex_to_rgb(long_hex);
    let name = '';

    if (rgb !== '') {
        let indexOfColor = ColorHexNames.indexOf(long_hex.toUpperCase());

        if (indexOfColor > -1) {
            name = ColorNames[indexOfColor];
        }
    }
    if (!long_hex.startsWith('#')) {
        long_hex = `#${long_hex}`;
    }

    let background = long_hex === '' ? DefaultBackgroundColor : long_hex;

    console.log('Hex', background)
    return {input: long_hex, out_left: name, out_right: rgb,textColor: setTextColer(rgb), background: background};
}

/**
 * Converts a hex to rgb
 * @param long_hex
 * @returns {*}
 */
function hex_to_rgb(long_hex) {
    // Splits hex into [long_hex, first_char_group, _second_char_group, third_char_group]
    // ex long_hex = #e1f134 -> [#e1f134, e1, f1, 34]
    let rgb_exists = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(long_hex);
    return rgb_exists ?
    'rgb(' + parseInt(rgb_exists[1], 16) + ', ' + parseInt(rgb_exists[2], 16) + ', ' + parseInt(rgb_exists[3], 16) + ')'
        : '';
}

export default {convert,Utils};
