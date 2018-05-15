const LETTERS = ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'w', 'x', 'c', 'v', 'b', 'n'];
const DISPLAY_TYPE = {none: 'none', inlineFlex: 'inline-flex'};
const CLASS_NAME = 'web-fast-nav';

const fastNavAnchorIds = [];
const keyPressed = [];

let indexWithoutInvisible = 0;
let anchorsDisplay = DISPLAY_TYPE.none;

document.querySelectorAll('a')
    .forEach(a => {
        if (isNodeInvisible(a)) {
            return;
        }
        const letters = lettersFromIndex(indexWithoutInvisible, a.text);

        const keyButton = document.createElement('span');
        keyButton.id = `${CLASS_NAME}-${letters}`;
        keyButton.className = CLASS_NAME;
        keyButton.style.position = 'absolute';
        keyButton.style['border-style'] = 'solid';
        keyButton.style['border-width'] = '2px';
        keyButton.style['border-color'] = 'brown';
        keyButton.style['background'] = 'yellow';
        keyButton.style['border-radius'] = '4px';
        keyButton.style.color = 'black';
        keyButton.style.width = `${letters.length}em`;
        keyButton.style.height = '1em';
        keyButton.style['text-align'] = 'center';
        keyButton.style['font-weight'] = a.style['font-weight'];
        keyButton.style['font-size'] = a.style['font-size'];
        keyButton.style.display = DISPLAY_TYPE.none;
        keyButton.style.opacity = 0.7   ;
        keyButton.style['flex-direction'] = 'row';
        keyButton.style['justify-content'] = 'center';
        keyButton.style['z-index'] = 9999;
        keyButton.style['align-items'] = 'center';

        decomposeLetterInLink(keyButton, letters);

        a.prepend(keyButton);

        indexWithoutInvisible++;
        fastNavAnchorIds.push(letters);
    });

function lettersFromIndex(anchorIndex, anchorText) {
    const numberOfLetter = Math.trunc(anchorIndex / LETTERS.length) + 1;
    const indexInLetters = anchorIndex % LETTERS.length;
    if (numberOfLetter > 3 && anchorText.length > 3) {
        return anchorText.substring(0, 8).replace(/ /g, '-').toLowerCase();
    }
    return Array(numberOfLetter).fill(0).map((_, i) => LETTERS[indexInLetters + i]).join('');
}

function isNodeInvisible(anchor) {
    return anchor.offsetHeight === 0;
}

function decomposeLetterInLink(keyButton, letters) {
    [...letters].forEach(l => {
        const spanLetter = document.createElement('span');
        spanLetter.textContent = l;
        keyButton.appendChild(spanLetter);
    });
}

function scrollToFirstLinkWith(keyPressed) {
    if(!keyPressed.length) {
        window.scrollTo(0,0);
        return;
    }
    const id = fastNavAnchorIds.find(l => l.startsWith(keyPressed.join('')));
    document.getElementById(`${CLASS_NAME}-${id}`).scrollIntoView();
}

function highlightLink(kb, keyPressed) {
    [...kb.children].forEach((child, i) => {
        if (child.textContent === keyPressed[i]) {
            child.style.color = 'white';
        } else {
            child.style.color = 'grey'
        }
    });
    kb.style.background = 'black';
    kb.style.zIndex = 10000;
}

function highlightBack(kb) {
    kb.style.background = 'yellow';
    kb.style.zIndex = 9999;
    [...kb.children].forEach(child => child.style.color = 'black');
}

function highlightAllLinksWith(keyPressed) {
    const word = keyPressed.join('');
    [...document.getElementsByClassName(CLASS_NAME)]
        .forEach(kb => {
            if(word && kb.id.startsWith(`${CLASS_NAME}-${word}`)) {
                highlightLink(kb, keyPressed);
                return;
            }
            highlightBack(kb);
        });
}

function followFirstLinkWith(keyPressed) {
    const id = fastNavAnchorIds.find(l => l.startsWith(keyPressed.join('')));
    document.getElementById(`${CLASS_NAME}-${id}`).click();
}

function onKeyPress({key}) {
    if (anchorsDisplay === DISPLAY_TYPE.none) {
        return;
    }
    if(key === 'Backspace') {
        keyPressed.pop();
        scrollToFirstLinkWith(keyPressed);
        highlightAllLinksWith(keyPressed);
        return;
    }
    if (key === 'Enter') {
        followFirstLinkWith(keyPressed);
        return;
    }
    if (key.length > 1) {
        return;
    }
    keyPressed.push(key);
    scrollToFirstLinkWith(keyPressed);
    highlightAllLinksWith(keyPressed);
}

function onKeyDown({key}) {
    if (key !== 'Control') {
        return;
    }
    anchorsDisplay = anchorsDisplay === DISPLAY_TYPE.none ? DISPLAY_TYPE.inlineFlex : DISPLAY_TYPE.none;
    [...document.getElementsByClassName(CLASS_NAME)].forEach(kb => kb.style.display = anchorsDisplay);
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keypress', onKeyPress);


