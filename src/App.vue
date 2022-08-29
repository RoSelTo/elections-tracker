<template>
  <div id="app">
    <h1 class="text-3xl w-full">Election présidentielle</h1>
    <div class="flex justify-center space-x-4 w-full mb-5 mt-5">
      <div :class="{'bg-orange-500': round == '1', 'bg-blue-700': round != '1'}" class="text-white px-5 py-3 font-bold cursor-pointer" v-on:click="getResultsRound1">1er tour</div>
      <div :class="{'bg-orange-500': round == '2', 'bg-blue-700': round != '2'}" class="text-white px-5 py-3 font-bold cursor-pointer" v-on:click="getResultsRound2">2ème tour</div>
    </div>
    <div v-if="!init" class="lds-ring">Chargement<div></div><div></div><div></div><div></div></div>
    <map-component v-if="init" ref="map" :departements="departements" :round="round"/>
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
      round: "1"
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
    },
    getResultsRound1: function() {
      var that = this;
      if(that.round == "1" && that.init)
        return;
      that.round = "1";
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
      });

      that.$store.commit("setCommunes", that.resultsCommunes);
      that.$store.commit("setDepartements", that.resultsDepartements);
      that.$store.commit("setCirconscriptions", that.resultsCirconscriptions);
      that.init = true;
    },
    getResultsRound2: function() {
      var that = this;
      if(that.round == "2" && that.init)
        return;
      that.round = "2";
      that.resultsFrance = [];
      that.resultsDepartements = {};
      d3.dsv(";", '/resultats-par-niveau-fe-t2-france-entiere.csv', (data) => {
        that.resultsFrance.push({candidate: "Macron", percent: parseFloat(data["MACRON.% Voix/Exp"].replace(',', '.'))});
        that.resultsFrance.push({candidate: "Le Pen", percent: parseFloat(data["LE PEN.% Voix/Exp"].replace(',', '.'))});
      });

      d3.dsv(";", '/resultats-par-niveau-dpt-t2-france-entiere.csv', (data) => {
        if(data["Code du département"] == undefined)
          return;
        var code = that.fixOutreMer(data["Code du département"], false);
        that.departements[code] = data["Libellé du département"];
        that.resultsDepartements[code] = {
          "Macron": parseFloat(data["MACRON.% Voix/Exp"].replace(',', '.')),
          "Le Pen": parseFloat(data["LE PEN.% Voix/Exp"].replace(',', '.'))
        };
        that.setWinner(that.resultsDepartements[code]);
      });

      d3.dsv(";", '/resultats-par-niveau-cirlg-t2-france-entiere.csv', (data) => {
        if(data["Code du département"] == undefined)
          return;
        var code = that.fixOutreMer(data["Code du département"], false) + data["Code de la circonscription"];
        that.resultsCirconscriptions[code] = {
          "Macron": parseFloat(data["MACRON.% Voix/Exp"].replace(',', '.')),
          "Le Pen": parseFloat(data["LE PEN.% Voix/Exp"].replace(',', '.'))
        };
        that.setWinner(that.resultsCirconscriptions[code]);
      });

      that.$store.commit("setCommunes", that.resultsCommunes);
      that.$store.commit("setDepartements", that.resultsDepartements);
      that.$store.commit("setCirconscriptions", that.resultsCirconscriptions);
      that.init = true;
    }
  },
  mounted: function(){
    var that = this;
    that.getResultsRound1();
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
  margin-top: 40px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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
