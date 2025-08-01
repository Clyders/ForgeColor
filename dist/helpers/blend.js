"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendMode = void 0;
exports.blendRGB = blendRGB;
var BlendMode;
(function (BlendMode) {
    BlendMode["average"] = "average";
    BlendMode["additive"] = "additive";
    BlendMode["screen"] = "screen";
    BlendMode["multiply"] = "multiply";
    BlendMode["gamma"] = "gamma";
})(BlendMode || (exports.BlendMode = BlendMode = {}));
function blendRGB(a, b, mode = BlendMode.average, t = 0.5) {
    const clamp = (x) => Math.max(0, Math.min(255, x));
    const lerp = (x, y, t) => x * (1 - t) + y * t;
    const toLinear = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const toSRGB = (c) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    const result = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        const A = a[i];
        const B = b[i];
        let val = 0;
        switch (mode) {
            case BlendMode.average:
                val = lerp(A, B, t);
                break;
            case BlendMode.additive:
                val = clamp(A + B);
                break;
            case BlendMode.screen:
                val = 255 - ((255 - A) * (255 - B)) / 255;
                break;
            case BlendMode.multiply:
                val = (A * B) / 255;
                break;
            case BlendMode.gamma:
                const la = toLinear(A / 255);
                const lb = toLinear(B / 255);
                const mixed = lerp(la, lb, t);
                val = clamp(Math.round(toSRGB(mixed) * 255));
                break;
        }
        result[i] = clamp(Math.round(val));
    }
    return result;
}
