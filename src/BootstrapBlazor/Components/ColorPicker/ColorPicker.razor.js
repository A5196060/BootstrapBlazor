﻿import '../../lib/pickr/pickr.es5.min.js'
import { addLink } from "../../modules/utility.js"
import Data from "../../modules/data.js"

export async function init(id, invoke, options) {
    if (options.isSupportOpacity === true) {
        await addLink("./_content/BootstrapBlazor/css/nano.min.css");

        const el = document.getElementById(id);
        const pickr = Pickr.create({
            el,
            theme: 'nano',
            default: options.value,
            useAsButton: true,
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)'
            ],
            defaultRepresentation: 'HEXA',
            components: {
                preview: true,
                opacity: true,
                hue: true,

                interaction: {
                    hex: false,
                    rgba: false,
                    hsva: false,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });

        Data.set(id, { pickr });

        pickr.on('save', (color, instance) => {
            instance.hide();
            invoke.invokeMethodAsync('OnColorChanged', formatColorString(color));
        }).on('swatchselect', color => {
            invoke.invokeMethodAsync('OnColorChanged', formatColorString(color));
        });
    }
}

const formatColorString = color => {
    if (color === null) {
        return "#FFFFFF";
    }
    else {
        const hex = color.toRGBA();
        let val = `#${formatHexString(hex[0])}${formatHexString(hex[1])}${formatHexString(hex[2])}`;
        if (hex[3] !== 1) {
            val = `${val}${formatHexString(hex[3] * 255)}`;
        }
        return val.toUpperCase();
    }
};

const formatHexString = hex => Math.round(hex).toString(16).padStart(2, '0');

export function dispose(id) {
    const data = Data.get(id);
    data.remove(id);
    if (data) {
        data.pickr.destroyAndRemove();
    }
}