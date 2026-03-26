class EColi {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.35 + Math.random() * 0.55;
        this.bodyLength = 30 + Math.random() * 18;
        this.bodyWidth = 10 + Math.random() * 5;
        this.flagellaLen = 26 + Math.random() * 14;
        this.numFlagella = 2 + Math.floor(Math.random() * 2);
        this.flagellaPhase = Math.random() * Math.PI * 2;
        this.opacity = 0.18 + Math.random() * 0.14;

        // Run-and-tumble state machine
        this.state = 'run';
        this.stateTimer = 0;
        this.runDuration = 1800 + Math.random() * 2800;
        this.tumbleDuration = 200 + Math.random() * 400;
        this.startAngle = this.angle;
        this.targetAngle = this.angle;
    }

    update(dt) {
        this.flagellaPhase += dt * 0.0045;
        this.stateTimer += dt;

        if (this.state === 'run') {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            if (this.stateTimer >= this.runDuration) {
                this.state = 'tumble';
                this.stateTimer = 0;
                this.startAngle = this.angle;
                const turnAmount = (Math.PI * 0.3) + Math.random() * Math.PI * 1.1;
                const dir = Math.random() < 0.5 ? 1 : -1;
                this.targetAngle = this.angle + dir * turnAmount;
                this.tumbleDuration = 200 + Math.random() * 400;
            }
        } else {
            const t = Math.min(this.stateTimer / this.tumbleDuration, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            this.angle = this.startAngle + (this.targetAngle - this.startAngle) * eased;

            if (this.stateTimer >= this.tumbleDuration) {
                this.state = 'run';
                this.stateTimer = 0;
                this.angle = this.targetAngle;
                this.runDuration = 1800 + Math.random() * 2800;
            }
        }

        // Wrap around edges
        const pad = 80;
        if (this.x < -pad) this.x = this.canvas.width + pad;
        if (this.x > this.canvas.width + pad) this.x = -pad;
        if (this.y < -pad) this.y = this.canvas.height + pad;
        if (this.y > this.canvas.height + pad) this.y = -pad;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const l = this.bodyLength;
        const r = this.bodyWidth / 2;
        const a = this.opacity;

        // Flagella drawn behind body
        ctx.strokeStyle = `rgba(110, 165, 105, ${a * 1.4})`;
        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';

        for (let i = 0; i < this.numFlagella; i++) {
            const yOff = (i - (this.numFlagella - 1) / 2) * (r * 0.75);
            this._drawFlagellum(ctx, -l / 2, yOff, this.flagellaPhase + i * 1.05);
        }

        // Capsule body
        ctx.beginPath();
        ctx.moveTo(-l / 2, -r);
        ctx.lineTo(l / 2, -r);
        ctx.arc(l / 2, 0, r, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-l / 2, r);
        ctx.arc(-l / 2, 0, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(175, 215, 168, ${a})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(120, 170, 115, ${a * 1.3})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.restore();
    }

    _drawFlagellum(ctx, startX, startY, phase) {
        const numSeg = 4;
        const segLen = this.flagellaLen / numSeg;
        const amp = 6;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        for (let i = 0; i < numSeg; i++) {
            const cpX = startX - (i + 0.5) * segLen;
            const cpY = startY + Math.sin(phase + i * 1.35) * amp;
            const endX = startX - (i + 1) * segLen;
            const endY = startY + Math.sin(phase + (i + 1) * 1.35) * amp * 0.9;
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        }

        ctx.stroke();
    }
}

function initEColi() {
    const canvas = document.getElementById('ecoli-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const baseCount = Math.round((window.innerWidth * window.innerHeight) / 26000);
    const count = Math.max(20, Math.min(baseCount, 45));
    const bacteria = Array.from({ length: count }, () => new EColi(canvas));

    let lastTime = null;

    function animate(timestamp) {
        if (lastTime === null) lastTime = timestamp;
        const dt = Math.min(timestamp - lastTime, 50);
        lastTime = timestamp;

        ctx.fillStyle = '#F1F1F2';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        bacteria.forEach(b => {
            b.update(dt);
            b.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', initEColi);
