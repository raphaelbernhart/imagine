import './scss/main.scss';
import { Options } from './types/index';
import { enableScroll, disableScroll } from './helpers/toggleScroll';

const imagineInstances: Array<HTMLElement> = [];
let _options: Options = {};

const addActions = (lightbox: HTMLElement) => {
    // Create actions div > gallery arrows, image actions
    const actionsWrapper = document.createElement('div');
    actionsWrapper.classList.add('imagine-actions-wrapper');
    lightbox.appendChild(actionsWrapper);

    const imagineActions = document.createElement('div');
    imagineActions.classList.add('imagine-actions');
    actionsWrapper.appendChild(imagineActions);

    const imagineImageActions = document.createElement('div');
    imagineImageActions.classList.add('imagine-image-actions');

    const closeIcon = document.createElement('svg');
    closeIcon.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><title>x</title><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z" fill="#2b2b2b"></path></g></svg>';
    imagineImageActions.appendChild(closeIcon);

    imagineActions.appendChild(imagineImageActions);

    // Add Event Listeners
};

const openLightbox = (instance: HTMLElement, image: HTMLImageElement) => {
    // Animation
    const iUrl: string = instance.dataset.url;

    // Create Lightbox on Body Div > img
    const lightbox = document.createElement('div');
    lightbox.classList.add('imagine-lightbox');

    const lbBackground = document.createElement('div');
    lightbox.appendChild(lbBackground);
    lbBackground.classList.add('imagine-lightbox-background');
    setTimeout(() => {
        lbBackground.classList.add('show');
    }, 50);

    document.body.appendChild(lightbox);

    // Disable Scroll
    disableScroll();

    // Add Actions
    if (_options.actions) addActions(lightbox);

    // onClick on Background close lightbox
    lbBackground.addEventListener('click', () => {
        lightbox.remove();
        image.classList.remove('imagine-o-none');
        enableScroll();
    });
    // Get width height und position und übertrage auf neues element Div > img
    // (left, top, width, height, position fixed)
    const iTop = image.getBoundingClientRect().top;
    const iLeft = image.getBoundingClientRect().left;
    const iWidth: string = image.width.toString();
    const iHeight: string = image.height.toString();

    // const lbImage: HTMLImageElement = document.createElement('img');
    const lbImage: HTMLImageElement = new Image();
    lbImage.src = image.src;
    lbImage.setAttribute('style', `top: ${iTop}px; left: ${iLeft}px; width: ${iWidth}px; height: ${iHeight}px; position: fixed;`);
    lightbox.appendChild(lbImage);

    lbImage.src = iUrl;

    // Calculate Size
    const finalHeight = window.innerHeight * 0.9;
    const finalWidth = window.innerWidth * 0.9;

    const currentHeight = lbImage.height;
    const currentWidth = lbImage.width;
    let scale = Math.round((finalHeight / currentHeight) * 100) / 100;

    if ((currentWidth * scale) >= (finalWidth)) {
        scale = Math.round((finalWidth / currentWidth) * 100) / 100;
    }
    lbImage.style.transform += `translate(-50%, -50%) scale(${scale})`;

    // Remove thumbnail
    image.classList.add('imagine-o-none');

    // Animation
    lbImage.classList.add('open');
};

const handleThumbnailClick = (instance: HTMLElement) => {
    const image = instance.childNodes[1] as HTMLImageElement;
    openLightbox(instance, image);
};

const registerClickEventListener = (instances: Array<any>) => {
    instances.forEach((instance: HTMLElement) => {
        instance.addEventListener('click', () => {
            handleThumbnailClick(instance);
        });
    });
};

const initImagine = (options?: Options) => {
    if (options) {
        _options = {
            actions: options.actions,
        };
    } else {
        _options = {
            actions: true,
        };
    }
    const nodeList: NodeList = document.querySelectorAll('.imagine');

    nodeList.forEach((e: Node) => {
        if (e.nodeType !== Node.ELEMENT_NODE || !(e as HTMLElement).dataset.url) throw Error(`Instance ${(e as HTMLElement).dataset.lightbox} configured wrong`);

        // Check if no Thumbnail is set
        if (e.childNodes[1].nodeType !== Node.ELEMENT_NODE || (e.childNodes[1] as HTMLElement).tagName !== 'IMG') {
            const img = document.createElement('img');
            img.src = (e as HTMLElement).dataset.url;
            e.appendChild(img);
        }

        imagineInstances.push((e as HTMLElement));
    });

    registerClickEventListener(imagineInstances);
};

// Cast init Function to window
(window as any).initImagine = initImagine;

export default initImagine;