<template>
  <div id="quote-container">
    <p id="quote">{{ currentQuote }}</p>
  </div>
</template>

<script>
export default {
  name: 'QuoteGenerator',
  data() {
    return {
      quotes: [
        'Music is the divine way to tell beautiful, poetic things to the heart. - Pablo Casals',
        'Music is the shorthand of emotion. - Leo Tolstoy',
        'Music is the strongest form of magic. - Marilyn Manson',
        'Music is the universal language of mankind. - Henry Wadsworth Longfellow',
        'Music is the mediator between the spiritual and the sensual life. - Ludwig van Beethoven',
        'Music is the art which is most nigh to tears and memory. - Oscar Wilde',
        'Music is the moonlight in the gloomy night of life. - Jean Paul Friedrich Richter',
        'Music is the divine way to tell beautiful, poetic things to the heart. - Pablo Casals',
        'Music is the shorthand of emotion. - Leo Tolstoy',
        'Music is the strongest form of magic. - Marilyn Manson',
        'Music is the universal language of mankind. - Henry Wadsworth Longfellow',
        'Music is the mediator between the spiritual and the sensual life. - Ludwig van Beethoven',
        'Music is the art which is most nigh to tears and memory. - Oscar Wilde',
        'Music is the moonlight in the gloomy night of life. - Jean Paul Friedrich Richter',
      ],
      currentQuote: '',
    }
  },
  mounted() {
    this.generateQuote();
  },
  methods: {
    generateQuote() {
      const randomIndex = Math.floor(Math.random() * this.quotes.length);
      this.currentQuote = this.quotes[randomIndex];
    }
  }
}
</script>

<style scoped>
#quote-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  width: fit-content;
  margin: 1em auto;
}

#quote {
  font-size: 1.2rem;
  text-align: center;
  width: 60%;
  line-height: 1.4rem;
}
</style>