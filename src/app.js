import './style.scss';
import ColorConverter from './converter';
import {CopyExplainText, InputExplainText} from './constants';

document.addEventListener('DOMContentLoaded', function(event) {


    let input = document.getElementById('input');
    let leftButton = document.getElementById('leftButton');
    let rightButton = document.getElementById('rightButton');
    let title = document.getElementById('title');
    let explainText = document.getElementById('explainText');
    let buttons = document.getElementById('buttons');

    let rightCopyValue = '';
    let leftCopyValue = '';

    // Set onClick listener
    leftButton.onclick = leftButtonClick;
    rightButton.onclick = rightButtonClick;

    // Sets listener for onchange in input
    input.addEventListener('input', setColor);
    input.addEventListener('focus', () => {
        input.scrollIntoView(true);
    });

    explainText.innerHTML = InputExplainText;

    /**
     * Sets the background color of body, and buttons,
     * and the text color of all other
     * @param e
     */
    function setColor(e) {
        let color = ColorConverter.convert(e.target.value);

        if (color.hex === '' && color.rgb === '') {
            buttons.style.display = 'none';
            explainText.innerHTML = InputExplainText;
        } else {
            explainText.innerHTML = CopyExplainText;

            leftCopyValue  = color.hex;
            buttons.style.display = 'flex';

            let buttonStyle = `background: ${color.textColor}; color: ${color.background};`;

            leftButton.setAttribute('style', buttonStyle);
            leftButton.innerHTML = leftCopyValue;

            rightCopyValue  = color.rgb;
            buttons.style.display = 'flex';
            rightButton.setAttribute('style', buttonStyle);
            rightButton.innerHTML = rightCopyValue;
        }

        title.setAttribute('style', `color: ${color.textColor};`);
        document.body.setAttribute('style', `background: ${color.background}; color: ${color.textColor};`);
    }

    /**
     * User click for copying the right text
     */
    function rightButtonClick(elm) {
        if (document.queryCommandSupported('copy')) {
            ColorConverter.Utils.copy(rightCopyValue);
        }
    }

    /**
     * User click for copying the left text
     */
    function leftButtonClick(elm) {
        if (document.queryCommandSupported('copy')) {
            ColorConverter.Utils.copy(leftCopyValue);
        }
    }

});
