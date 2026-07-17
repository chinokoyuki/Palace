<template>
  <div class="af-hero-core" aria-hidden="true">
    <div class="af-hero-ring ring-1"></div>
    <div class="af-hero-ring ring-2"></div>
    <div class="af-hero-center"></div>
  </div>
</template>

<style scoped>
.af-hero-core {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.af-hero-center {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F0F8FF, #8FD3FF, #3BA7FF);
  box-shadow: 0 0 50px rgba(59, 167, 255, 0.35);
  animation: pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.af-hero-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(59, 167, 255, 0.25);
}

.ring-1 {
  width: 120px;
  height: 120px;
  animation: breathe 3s ease-in-out infinite;
}

.ring-2 {
  width: 160px;
  height: 160px;
  animation: breathe 3s ease-in-out infinite reverse;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.08); opacity: 1; }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.05); opacity: 0.7; }
}
</style>
