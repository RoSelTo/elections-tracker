<template>
  <div id="app">
    <map-communes v-if="init" ref="map" :results-communes="resultsCommunes"/>
    <div v-else class="lds-ring"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
import MapCommunes from './components/Map.vue'
import * as d3 from 'd3'

export default {
  name: 'App',
  components: {
    MapCommunes
  },
  data: function(){
    return {
      resultsCommunes: {},
      init: false
    }
  },
  methods: {
    setWinner: function(results){
      var winner = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);
      if(winner == null)
        console.log(results);
      results.winner = winner;
    }
  },
  mounted: function(){
    var that = this;
      d3.dsv(",", '/p2022-resultats-communes-t1.csv', (data) => {
        that.resultsCommunes[data["CodeInsee"]] = {
          "Arthaud": parseFloat(data["ARTHAUD.exp"]),
          "Dupont-Aignan": parseFloat(data["DUPONT-AIGNAN.exp"]),
          "Hidalgo": parseFloat(data["HIDALGO.exp"]),
          "Jadot": parseFloat(data["JADOT.exp"]),
          "Lassalle": parseFloat(data["LASSALLE.exp"]),
          "Le Pen": parseFloat(data["LE PEN.exp"]),
          "Macron": parseFloat(data["MACRON.exp"]),
          "Mélenchon": parseFloat(data["MÉLENCHON.exp"]),
          "Poutou": parseFloat(data["POUTOU.exp"]),
          "Pécresse": parseFloat(data["PÉCRESSE.exp"]),
          "Zemmour": parseFloat(data["ZEMMOUR.exp"])
        };
        that.setWinner(that.resultsCommunes[data["CodeInsee"]]);
        that.init = true;
      });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background-color: #f3f2ef;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
