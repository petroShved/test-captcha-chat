const { createCanvas } = require('canvas');

function randomBetween(from, to) {
    return Math.floor(Math.random() * (to - from)) + from;
}
function randomColor() {
    return randomBetween(0, 255);
}

function getColors(count) {
    const colors = [];
    for (let i = 0; i < count; i += 1) {
        const color = {
            r: randomColor(),
            g: randomColor(),
            b: randomColor(),
        };
        color.css = `rgb(${color.r},${color.g},${color.b})`;
        colors.push(color);
    }
    return colors;
}
function getFontRotation() {
    return (Math.random() * -0.4) + 0.2;
}
function getFontSize(height) {
    const max = height * 0.50;
    const min = height * 0.40;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate() {
    const width = 70;
    const height = 30;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    const text = `${Math.floor(100000 + Math.random() * 900000)}`;
    const font = 'Arial';

    const colors = getColors(text.length);

    let x = 0; // start point

    text.split('').forEach((letter, idx) => {
        const color = colors[idx];

        const size = getFontSize(height, width, font);
        ctx.font = `${size}px ${font}`;
        ctx.textBaseline = 'top';
        const te = ctx.measureText(letter);
        const y = Math.floor(((Math.random() * height - size) / 100) + size / 3);

        ctx.fillStyle = color.css;

        const rot = getFontRotation();
        ctx.rotate(rot);

        ctx.fillText(letter, x, y);
        // undo rotate for next letters
        ctx.rotate(-rot);

        x += te.width + 1;
    });
    return {
        image: canvas.toBuffer().toString('base64'),
        code: +text,
    };
}

module.exports = {
    generate,
};
