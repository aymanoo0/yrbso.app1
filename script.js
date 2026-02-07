/**
 * Al-Jawhara Card Generator Logic
 */

const CONFIG = {
    canvasWidth: 1080,
    canvasHeight: 1080,
    colors: {
        primary: '#3C217E',
        secondary: '#FF5722',
        accent: '#FFC107',
        textWhite: '#FFFFFF',
        textDark: '#1F2937'
    },
    fonts: {
        regular: '400 36px "IBM Plex Sans Arabic"',
        bold: '700 52px "IBM Plex Sans Arabic"',
        title: '700 80px "IBM Plex Sans Arabic"'
    }
};

const state = {
    selectedTemplate: 1,
    data: {
        shopName: '',
        phone: '',
        extraText: ''
    }
};

// Canvas Setup
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');

// Font Loading Check
let fontLoaded = false;
document.fonts.ready.then(() => {
    fontLoaded = true;
    render();
});

// Helper Functions
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (typeof r === 'undefined') r = 0;
        if (typeof r === 'number') {
            r = {tl: r, tr: r, br: r, bl: r};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                r[side] = r[side] || defaultRadius[side];
            }
        }
        this.beginPath();
        this.moveTo(x + r.tl, y);
        this.lineTo(x + w - r.tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
        this.lineTo(x + w, y + h - r.br);
        this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
        this.lineTo(x + r.bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
        this.lineTo(x, y + r.tl);
        this.quadraticCurveTo(x, y, x + r.tl, y);
        this.closePath();
        return this;
    }
}

function drawTextCentered(ctx, text, x, y, font, color, maxWidth = 900) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = text.split(' ');
    let line = '';
    const lineHeight = 70;
    
    if (ctx.measureText(text).width > maxWidth) {
        let lines = [];
        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        
        let currentY = y - ((lines.length - 1) * lineHeight) / 2;
        lines.forEach(l => {
             ctx.fillText(l, x, currentY);
             currentY += lineHeight;
        });
    } else {
        ctx.fillText(text, x, y);
    }
}

function drawIconPlaceholder(ctx, x, y) {
    // Phone Icon Path
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(3, 3); 
    ctx.translate(-10, -10); 
    
    ctx.moveTo(17.65, 14.85);
    ctx.lineTo(15.25, 12.45);
    ctx.bezierCurveTo(14.95, 12.15, 14.55, 12.15, 14.25, 12.45);
    ctx.lineTo(12.85, 13.85);
    ctx.bezierCurveTo(12.55, 13.65, 11.25, 12.95, 9.55, 11.25);
    ctx.bezierCurveTo(7.85, 9.55, 7.15, 8.25, 6.95, 7.95);
    ctx.lineTo(8.35, 6.55);
    ctx.bezierCurveTo(8.65, 6.25, 8.65, 5.85, 8.35, 5.55);
    ctx.lineTo(5.95, 3.15);
    ctx.bezierCurveTo(5.65, 2.85, 5.25, 2.85, 4.95, 3.15);
    ctx.lineTo(2.45, 5.65);
    ctx.bezierCurveTo(2.15, 5.95, 2.05, 6.45, 2.25, 6.85);
    ctx.bezierCurveTo(3.35, 9.25, 6.05, 13.65, 11.85, 16.55);
    ctx.bezierCurveTo(12.25, 16.75, 12.75, 16.65, 13.05, 16.35);
    ctx.lineTo(17.65, 15.35);
    ctx.bezierCurveTo(17.95, 15.05, 17.95, 14.65, 17.65, 14.85);
    ctx.fill();
    ctx.restore();
}

// Templates Definition
const templates = {
    1: {
        name: "الجوهرة VIP",
        draw: (ctx, data) => {
            // Background
            const grd = ctx.createLinearGradient(0, 0, 0, 1080);
            grd.addColorStop(0, '#2E1A66');
            grd.addColorStop(1, '#3C217E');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, 1080, 1080);

            // Decoration
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(900, 200, 300, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(100, 900, 200, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Header Container
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.roundRect(100, 100, 880, 300, 40);
            ctx.fill();

            drawTextCentered(ctx, data.shopName || "مركز الجوهرة للخدمات", 540, 250, CONFIG.fonts.title, '#FFFFFF');
            
            // Content Box
            ctx.fillStyle = '#FFFFFF';
            ctx.roundRect(100, 450, 880, 500, 40);
            ctx.fill();

            drawTextCentered(ctx, data.extraText || "خدمات شحن فوري - باقات نت - تسديد فواتير", 540, 650, CONFIG.fonts.regular, CONFIG.colors.primary, 800);
            
            // Footer
            ctx.fillStyle = CONFIG.colors.secondary;
            ctx.roundRect(240, 880, 600, 100, 50);
            ctx.fill();
            
            drawTextCentered(ctx, data.phone || "77X XXX XXX", 540, 950, CONFIG.fonts.bold, '#FFFFFF');
            drawIconPlaceholder(ctx, 540, 850);
        }
    },
    2: {
        name: "مودرن",
        draw: (ctx, data) => {
            const grd = ctx.createLinearGradient(0, 0, 1080, 1080);
            grd.addColorStop(0, CONFIG.colors.secondary);
            grd.addColorStop(1, '#3C217E');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, 1080, 1080);

            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.beginPath();
            ctx.moveTo(0, 800);
            ctx.lineTo(1080, 400);
            ctx.lineTo(1080, 1080);
            ctx.lineTo(0, 1080);
            ctx.fill();

            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 40;
            ctx.fillStyle = '#FFFFFF';
            ctx.roundRect(140, 140, 800, 800, 60);
            ctx.fill();
            ctx.shadowBlur = 0;

            drawTextCentered(ctx, data.shopName || "مركز الجوهرة للخدمات", 540, 300, CONFIG.fonts.title, CONFIG.colors.primary);
            
            ctx.strokeStyle = CONFIG.colors.secondary;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(340, 350);
            ctx.lineTo(740, 350);
            ctx.stroke();

            drawTextCentered(ctx, data.extraText || "نقدم لكم أفضل خدمات الاتصالات والإنترنت", 540, 500, CONFIG.fonts.regular, '#555555', 700);

            ctx.fillStyle = CONFIG.colors.primary;
            ctx.roundRect(140, 780, 800, 160, {bl: 60, br: 60});
            ctx.fill();

            drawTextCentered(ctx, data.phone || "77X XXX XXX", 540, 885, CONFIG.fonts.bold, '#FFFFFF');
        }
    },
    3: {
        name: "كلاسيك",
        draw: (ctx, data) => {
            ctx.fillStyle = '#F8F9FA';
            ctx.fillRect(0, 0, 1080, 1080);

            ctx.fillStyle = CONFIG.colors.primary;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(1080, 0);
            ctx.lineTo(1080, 300);
            ctx.bezierCurveTo(810, 400, 270, 200, 0, 300);
            ctx.fill();

            drawTextCentered(ctx, data.shopName || "مركز الجوهرة للخدمات", 540, 200, CONFIG.fonts.title, '#FFFFFF');

            ctx.fillStyle = CONFIG.colors.secondary;
            ctx.beginPath();
            ctx.moveTo(0, 1080);
            ctx.lineTo(1080, 1080);
            ctx.lineTo(1080, 900);
            ctx.bezierCurveTo(810, 800, 270, 1000, 0, 900);
            ctx.fill();

            drawTextCentered(ctx, data.extraText || "خدمة سريعة وموثوقة على مدار الساعة", 540, 600, CONFIG.fonts.regular, '#333333', 900);
            drawTextCentered(ctx, data.phone || "77X XXX XXX", 540, 1000, CONFIG.fonts.bold, '#FFFFFF');
        }
    }
};

function render() {
    ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
    if (templates[state.selectedTemplate]) {
        templates[state.selectedTemplate].draw(ctx, state.data);
    }
}

function init() {
    const inputs = ['shopName', 'phone', 'extraText'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                state.data[id] = e.target.value;
                render();
            });
        }
    });

    const templateOptions = document.querySelectorAll('.template-card');
    templateOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            templateOptions.forEach(t => t.classList.remove('active'));
            opt.classList.add('active');
            state.selectedTemplate = parseInt(opt.dataset.id);
            render();
        });
    });

    document.getElementById('downloadBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `AlJawhara-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });

    render();
}

init();
