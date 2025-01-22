<template>
  <div>
    <Header />
    <PageOption :cards="[
      { to: '/guitar', src: '/images/button_images/guitar.png', alt: 'Interactive Guitar' },
      { to: '/interactive_keyboard', src: '/images/button_images/keyboard.png', alt: 'Interactive Keyboard' }
    ]" />
  </div>
</template>