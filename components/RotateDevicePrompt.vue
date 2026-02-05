<template>
  <div class="rotate-device-prompt">
    <div class="content">
      <div class="device-icon"></div>
      <h1>Please Rotate Device</h1>
      <p>For the best experience, please use landscape mode.</p>
    </div>
  </div>
</template>

<style scoped>
.rotate-device-prompt {
  display: none;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 12, 0.95);
  backdrop-filter: blur(10px);
  z-index: 99999;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  color: white;
  font-family: "Inter", system-ui, sans-serif;
}

.device-icon {
  width: 48px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  position: relative;
  animation: rotate-animation 2.5s ease-in-out infinite;
}

/* Screen line */
.device-icon::before {
  content: "";
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

/* Home button line */
.device-icon::after {
  content: "";
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #a5a5a5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1rem;
  color: #888899;
  margin: 0;
  max-width: 300px;
  line-height: 1.5;
}

@keyframes rotate-animation {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(90deg);
  }
  80% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/* Show only on portrait screens below a certain size (tablets/phones) */
@media screen and (orientation: portrait) and (max-width: 1024px) {
  .rotate-device-prompt {
    display: flex;
  }
}
</style>
