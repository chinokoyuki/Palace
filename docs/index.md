---
layout: home

hero:
  name:
  text:
  tagline:
---

<div class="kp-home">
  <div class="kp-home-glow"></div>
  <div class="kp-home-core"></div>
  <h1 class="kp-home-title">Koyuki Palace</h1>
  <p class="kp-home-subtitle">
    Wisdom takes many forms,<br>
    and we have long coveting the secrets of wisdom.
  </p>
  <div class="kp-home-action">
    <a href="/books" class="kp-home-button">开始阅读</a>
  </div>
</div>

<style scoped>
.kp-home {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  text-align: center;
  padding: 48px 24px;
  overflow: hidden;
}

.kp-home-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 167, 255, 0.18) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

.dark .kp-home-glow {
  background: radial-gradient(circle, rgba(59, 167, 255, 0.12) 0%, transparent 70%);
}

.kp-home-core {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F0F8FF, #8FD3FF, #3BA7FF);
  opacity: 0.12;
  filter: blur(40px);
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.12; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.18; }
}

.kp-home-title {
  position: relative;
  z-index: 1;
  font-size: clamp(56px, 10vw, 120px);
  font-weight: 700;
  margin: 0 0 24px;
  letter-spacing: -0.03em;
  line-height: 1.05;
  background: linear-gradient(135deg, #F0F8FF 0%, #8FD3FF 40%, #3BA7FF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.kp-home-subtitle {
  position: relative;
  z-index: 1;
  font-size: clamp(15px, 2.2vw, 20px);
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 40px;
  letter-spacing: 0.02em;
}

.kp-home-action {
  position: relative;
  z-index: 1;
}

.kp-home-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 40px;
  border-radius: 999px;
  background: linear-gradient(135deg, #3BA7FF, #1769AA);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 28px rgba(59, 167, 255, 0.3);
  transition: none;
}

.kp-home-button:hover {
  transform: none;
  box-shadow: 0 8px 28px rgba(59, 167, 255, 0.3);
  color: #ffffff;
}

@media (max-width: 768px) {
  .kp-home {
    min-height: calc(100vh - 56px);
    padding: 32px 20px;
  }

  .kp-home-title {
    font-size: clamp(40px, 12vw, 56px);
    margin-bottom: 16px;
  }

  .kp-home-subtitle {
    font-size: clamp(14px, 4vw, 16px);
    margin-bottom: 32px;
  }

  .kp-home-button {
    padding: 12px 32px;
    font-size: 15px;
  }

  .kp-home-glow {
    width: 360px;
    height: 360px;
  }

  .kp-home-core {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 375px) {
  .kp-home {
    padding: 28px 16px;
  }

  .kp-home-title {
    font-size: clamp(36px, 11vw, 40px);
  }
}
</style>
