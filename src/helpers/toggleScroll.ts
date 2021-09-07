const keys: any = {
    37: 1, 38: 1, 39: 1, 40: 1,
};

function preventDefault(e: any) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e: any) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
    return true;
}

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
    window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
        // eslint-disable-next-line getter-return
        get() { supportsPassive = true; },
    }));
// eslint-disable-next-line no-empty
} catch (e) {}

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
export function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
export function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    (window as any).removeEventListener(wheelEvent, preventDefault, wheelOpt);
    (window as any).removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}
