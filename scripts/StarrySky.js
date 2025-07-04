class StarrySky {
    constructor(canvasId, config = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) throw new Error('Canvas not found');
        this.ctx = this.canvas.getContext('2d');

        // Настройки
        this.active = true
        this.config = {
            rotationSpeed: config.rotationSpeed || 0.0002,
            maxOrbitRadius: config.maxOrbitRadius || Math.max(this.canvas.width, this.canvas.height),
            starDensity: config.starDensity || 0.01,
            fadeSpeed: config.fadeSpeed || 0.02,
            visibleAngleStart: config.visibleAngleStart || Math.PI / 6,
            visibleAngleEnd: config.visibleAngleEnd || 3 * Math.PI / 2,
            flickerSpeed: config.flickerSpeed || 0.02,
            flickerIntensity: config.flickerIntensity || 0.3,
            gradientColors: config.gradientColors || ['#1a1a1a', '#2a2a4a'],
            cloudConfig: {
                cloudCount: config.cloudConfig?.cloudCount || 5,
                cloudSpeed: config.cloudConfig?.cloudSpeed || 0.5,
                cloudOpacity: config.cloudConfig?.cloudOpacity || 0.1,
                cloudBlur: config.cloudConfig?.cloudBlur || 20
            }
        };

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height;
        this.stars = [];
        this.clouds = [];
        this.animationFrameId = null;

        this.numStars = Math.floor(this.canvas.width * this.canvas.height * this.config.starDensity);
        for (let i = 0; i < this.numStars; i++) this.stars.push(this.createStar());
        for (let i = 0; i < this.config.cloudConfig.cloudCount; i++) this.clouds.push(this.createCloud());

        window.addEventListener('resize', () => this.handleResize());
        this.observeCanvas();
        this.start(); // Запускаем анимацию
    }

    start() {
        if (!this.animationFrameId) this.animate();
        this.active = true
        console.log("sky start")
    }

    stop() {
        console.log("sky stop")
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.active = false
            this.animationFrameId = null;
        }
    }


    observeCanvas() {
        const observer = new MutationObserver(() => {
            const inDOM = document.body.contains(this.canvas);
            const style = getComputedStyle(this.canvas);
            const hidden = style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';

            if (!inDOM || hidden) {
                // this.stop();
            } else {
                // this.start();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    createStar() {
        return {
            angle: Math.random() * Math.PI,
            orbitRadius: Math.random() * this.config.maxOrbitRadius,
            x: 0,
            y: 0,
            radius: Math.random() * 1.5,
            baseAlpha: Math.random() * 0.5 + 0.5,
            alpha: 0,
            velocity: this.config.flickerSpeed * (Math.random() * 0.5 + 0.5),
            direction: Math.random() < 0.5 ? 1 : -1
        };
    }

    createCloud() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height * 0.5,
            radius: Math.random() * 100 + 50
        };
    }

    updateStar(star) {
        star.angle += this.config.rotationSpeed;
        star.x = this.centerX + Math.cos(star.angle) * star.orbitRadius;
        star.y = this.centerY - Math.sin(star.angle) * star.orbitRadius;

        if (star.angle > Math.PI) {
            star.angle -= Math.PI;
            star.x = this.centerX + Math.cos(star.angle) * star.orbitRadius;
            star.y = this.centerY - Math.sin(star.angle) * star.orbitRadius;
            star.alpha = 0;
        }

        if (star.angle < this.config.visibleAngleStart || star.angle > this.config.visibleAngleEnd) {
            star.alpha = Math.max(0, star.alpha - this.config.fadeSpeed);
        } else {
            star.alpha = Math.min(star.baseAlpha, star.alpha + this.config.fadeSpeed);
        }

        if (star.alpha > 0) {
            star.baseAlpha += this.config.flickerSpeed * star.direction;
            const minAlpha = Math.max(0.5 - this.config.flickerIntensity, 0);
            const maxAlpha = Math.min(0.5 + this.config.flickerIntensity, 1);
            if (star.baseAlpha > maxAlpha || star.baseAlpha < minAlpha) {
                star.direction *= -1;
            }
        }

        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        this.ctx.fill();
    }

    updateCloud(cloud) {
        cloud.x += this.config.cloudConfig.cloudSpeed;
        if (cloud.x - cloud.radius > this.canvas.width) {
            cloud.x = -cloud.radius;
            cloud.y = Math.random() * this.canvas.height * 0.5;
            cloud.radius = Math.random() * 100 + 50;
        }

        const gradient = this.ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.config.cloudConfig.cloudOpacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, Math.max(this.canvas.width, this.canvas.height)
        );
        gradient.addColorStop(0, this.config.gradientColors[0]);
        gradient.addColorStop(1, this.config.gradientColors[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height;
        this.numStars = Math.floor(this.canvas.width * this.canvas.height * this.config.starDensity);
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) this.stars.push(this.createStar());
        this.clouds = [];
        for (let i = 0; i < this.config.cloudConfig.cloudCount; i++) this.clouds.push(this.createCloud());
    }

    animate() {
        this.drawBackground();
        // this.ctx.filter = `blur(${this.config.cloudConfig.cloudBlur}px)`;
        this.clouds.forEach(cloud => this.updateCloud(cloud));
        this.ctx.filter = 'none';
        this.stars.forEach(star => this.updateStar(star));
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
}

window.StarrySky = StarrySky;
