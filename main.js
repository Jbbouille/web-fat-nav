const LETTERS = ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'w', 'x', 'c', 'v', 'b', 'n'];
const DISPLAY_TYPE = {none: 'none', block: 'block'};
const CLASS_NAME = 'web-fast-nav';

let indexWithoutInvisible = 0;
let anchorsDisplay = DISPLAY_TYPE.none;

document.querySelectorAll('a')
    .forEach(a => {
        if (isNodeInvisible(a)) {
            return;
        }
        const letter = letterFromIndex(indexWithoutInvisible);

        const keyButton = document.createElement('span');
        keyButton.id = `${CLASS_NAME}-${letter}`;
        keyButton.className = CLASS_NAME;
        keyButton.style.position = 'absolute';
        keyButton.style['border-style'] = 'solid';
        keyButton.style['border-width'] = '2px';
        keyButton.style['border-color'] = 'brown';
        keyButton.style['background'] = 'yellow';
        keyButton.style['border-radius'] = '4px';
        keyButton.style.color = 'black';
        keyButton.style['min-width'] = '12px';
        keyButton.style['min-height'] = '11px';
        keyButton.style['text-align'] = 'center';
        keyButton.style['font-weight'] = a.style['font-weight'];
        keyButton.style['font-size'] = a.style['font-size'];
        keyButton.style.display = DISPLAY_TYPE.none;
        keyButton.textContent = letter;

        a.appendChild(keyButton);

        indexWithoutInvisible++;
    });

function letterFromIndex(anchorIndex) {
    const numberOfLetter = Math.trunc(anchorIndex / LETTERS.length) + 1;
    const indexInLetters = anchorIndex % LETTERS.length;
    return Array(numberOfLetter).fill(0).map((_, i) => LETTERS[indexInLetters + i]).join('');
}

function isNodeInvisible(anchor) {
    return anchor.offsetHeight === 0;
}

function onKeyDown({key}) {
    if (key !== 'Control') {
        return;
    }
    anchorsDisplay = anchorsDisplay === DISPLAY_TYPE.none ? DISPLAY_TYPE.block : DISPLAY_TYPE.none;
    [...document.getElementsByClassName(CLASS_NAME)].forEach(kb => kb.style.display = anchorsDisplay);
}

document.addEventListener('keydown', onKeyDown);

let keyPressed = [];

const debounced = (callback, time) => {
    let interval;
    return (...args) => {
        clearTimeout(interval);
        interval = setTimeout(() => {
            interval = null;
            callback(...args);
        }, time);
    };
};

function followLink(identifier) {
    document.getElementById(`${CLASS_NAME}-${identifier}`).click();
    keyPressed = [];
}

const debouncedFollowLink = debounced(followLink, 100);

function onKeyPress({key}) {
    if (anchorsDisplay === DISPLAY_TYPE.none) {
        return;
    }
    if (key.length > 1) {
        return;
    }
    keyPressed.push(key);
    debouncedFollowLink(keyPressed.join(''));
}

document.addEventListener('keypress', onKeyPress);


