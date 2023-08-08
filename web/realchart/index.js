let _focused;

function init() {
    const menu = document.getElementById('menu');
    let gindex = -1;
    let index = 0;

    for (let elt of menu.children) {
        if (isGroup(elt)) {
            elt.dataset.group = ++gindex;
            elt.dataset.state = elt.dataset.group == 0 ? 1 : 0;
            index = 0;
        } else {
            elt.dataset.group = gindex;
            elt.dataset.index = index++;
            if (gindex === 0 && index === 1) {
                _focused = elt;
            }
        }
    }

    resetMenus();
}

function resizeFrame(frame) {
    frame.style.minHeight = frame.contentWindow.document.body.scrollHeight + 'px';
}

function isGroup(elt) {
    return elt.classList.contains('menu-group');
}

function isLeaf(elt) {
    return elt.classList.contains('menu-leaf');
}

function resetMenus() {
    const menu = document.getElementById('menu');
    let expanded = false;

    for (let elt of menu.children) {
        if (isGroup(elt)) {
            expanded = elt.dataset.state == 1;
        } else {
            if (elt === _focused) {
                elt.dataset.focus = 'focus';
            } else {
                delete elt.dataset.focus;
            }
            elt.style.display = expanded ? '' : 'none';
        }
    }
}

function clickHandler(event) {
    if (isGroup(event.target)) {
        event.target.dataset.state = 1 - event.target.dataset.state;
        resetMenus();
    } else if (isLeaf(event.target.parentElement)) {
        _focused = event.target.parentElement;   
        resetMenus();
    }
}

function clickRef(event) {
    const a = event.target.href;
    const frame = document.getElementById('frame');

    frame.src = a;
    return false;
}
