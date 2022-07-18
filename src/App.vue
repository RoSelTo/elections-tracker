<template>
  <div id="app">
    <map-component v-if="init" ref="map" :departements="departements"/>
    <tab-result :results-france="resultsFrance"/>
  </div>
</template>

<script>
import myStore from './components/store.js'
import MapComponent from './components/Map.vue'
import TabResult from './components/Tab.vue'
import * as d3 from 'd3'

export default {
  name: 'App',
  components: {
    MapComponent,
    TabResult
  },
  store: myStore,
  data: function(){
    return {
      resultsCommunes: {},
      resultsDepartements: {},
      resultsCirconscriptions: {},
      resultsFrance: [],
      departements: {},
      init: false,
      tour: "1"
    }
  },
  methods: {
    setWinner: function(results){
      var winner = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);
      if(winner == null)
        console.log(results);
      results.winner = winner;
    },
    toTitleCase: function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    },
    fixOutreMer: function(code, isCommune){
      var dep = code.substring(0, 2);
      switch(dep){
        case "ZA":
          return isCommune ? "97" + code.substring(2) : "971";
        case "ZB":
          return isCommune ? "97" + code.substring(2) : "972";
        case "ZC":
          return isCommune ? "97" + code.substring(2) : "973";
        case "ZD":
          return isCommune ? "97" + code.substring(2) : "974";
        case "ZM":
          return isCommune ? "97" + code.substring(2) : "976";
        case "ZN":
          return isCommune ? "98" + code.substring(2) : "988";
        case "ZP":
          return isCommune ? "98" + code.substring(2) : "987";
        case "ZS":
          return isCommune ? "97" + code.substring(2) : "975";
        case "ZW":
          return isCommune ? "98" + code.substring(2) : "986";
        case "ZX":
          return isCommune ? "97" + code.substring(2) : "977";
        case "ZZ":
          return "99";
        default:
          return code;
      }
    }
  },
  mounted: function(){
    var that = this;
    d3.dsv(",", '/01-resultats-france-entiere.csv', (data) => {
      that.resultsFrance.push({candidate: that.toTitleCase(data["cand_nom"]), percent: Math.round(data["cand_rapport_exprim"]*100)/100});
    });

    d3.dsv(",", '/p2022-resultats-communes-t1.csv', (data) => {
      var code = that.fixOutreMer(data["CodeInsee"], true);
      that.resultsCommunes[code] = {
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
      that.setWinner(that.resultsCommunes[code]);
      that.init = true;
    });

    d3.dsv(",", '/p2022-resultats-departement-t1.csv', (data) => {
      var code = that.fixOutreMer(data["CodeDépartement"], false);
      that.departements[code] = data["Département"];
      that.resultsDepartements[code] = {
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
      that.setWinner(that.resultsDepartements[code]);
      that.init = true;
    });

    d3.dsv(",", '/p2022-resultats-circonscriptions-t1.csv', (data) => {
      that.resultsCirconscriptions[data["CodeCirco"]] = {
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
      that.setWinner(that.resultsCirconscriptions[data["CodeCirco"]]);
      that.init = true;
    });

    that.$store.commit("setCommunes", that.resultsCommunes);
    that.$store.commit("setDepartements", that.resultsDepartements);
    that.$store.commit("setCirconscriptions", that.resultsCirconscriptions);
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
  display: flex;
  justify-content: center;
}

body {
  background-color: #f3f2ef;
}

.lds-ring {
  margin-top: 300px;
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
  border: 8px solid orange;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: orange transparent transparent transparent;
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
