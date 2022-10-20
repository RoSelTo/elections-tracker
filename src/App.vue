<template>
  <div id="app">
    <select id="choix-elec" v-model="selectedElec" class="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
      <option value="presidentielle2022">Présidentielle 2022</option>
      <option value="legislatives2022">Législatives 2022</option>
    </select>
    <div class="flex justify-center space-x-4 w-full mb-5 mt-5">
      <div :class="{'bg-orange-500': round == '1', 'bg-blue-700': round != '1'}" class="text-white px-5 py-3 font-bold cursor-pointer" v-on:click="getResultsRound1">1er tour</div>
      <div :class="{'bg-orange-500': round == '2', 'bg-blue-700': round != '2'}" class="text-white px-5 py-3 font-bold cursor-pointer" v-on:click="getResultsRound2">2ème tour</div>
    </div>
    <div v-if="!init" class="lds-ring">Chargement<div></div><div></div><div></div><div></div></div>
    <map-component v-if="init" ref="map" :departements="departements" :round="round" :selected-elec="selectedElec"/>
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
      round: "1",
      selectedElec: "presidentielle2022"
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
    getStats: function(results){
      var stats = {};
      Object.keys(results).forEach(function(geo){
        if(stats[results[geo].winner] != null)
          stats[results[geo].winner]++;
        else
          stats[results[geo].winner] = 1;
      });
      return stats;
    },
    getPresidentielleRound1: function() {
      var that = this;
      if(that.round == "1" && that.selectedElec === "presidentielle2022" && that.init)
        return;
      that.round = "1";
      that.resultsFrance = [];
      d3.dsv(",", '/presidentielle/01-resultats-france-entiere.csv', (data) => {
        that.resultsFrance.push({candidate: that.toTitleCase(data["cand_nom"]), percent: Math.round(data["cand_rapport_exprim"]*100)/100});
      });

      d3.dsv(",", '/presidentielle/p2022-resultats-communes-t1.csv', (data) => {
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
      }).then(() => {
        that.$store.commit("setStats", { geo: "communes", stats: that.getStats(that.resultsCommunes)});
        that.$store.commit("setCommunes", that.resultsCommunes);
      });

      d3.dsv(",", '/presidentielle/p2022-resultats-departement-t1.csv', (data) => {
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
      }).then(() => {
        that.$store.commit("setStats", { geo: "departements", stats: that.getStats(that.resultsDepartements)});
        that.$store.commit("setDepartements", that.resultsDepartements);
      });

      d3.dsv(",", '/presidentielle/p2022-resultats-circonscriptions-t1.csv', (data) => {
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
      }).then(() => {
        that.$store.commit("setStats", { geo: "circonscriptions", stats: that.getStats(that.resultsCirconscriptions)});
        that.$store.commit("setCirconscriptions", that.resultsCirconscriptions);
      });

      that.init = true;
    },
    getPresidentielleRound2: function() {
      var that = this;
      if(that.round == "2" && that.selectedElec === "presidentielle2022" && that.init)
        return;
      that.round = "2";
      that.resultsFrance = [];
      that.resultsDepartements = {};
      that.resultsCommunes = {};
      d3.dsv(";", '/presidentielle/resultats-par-niveau-fe-t2-france-entiere.csv', (data) => {
        that.resultsFrance.push({candidate: "Macron", percent: parseFloat(data["MACRON.% Voix/Exp"].replace(',', '.'))});
        that.resultsFrance.push({candidate: "Le Pen", percent: parseFloat(data["LE PEN.% Voix/Exp"].replace(',', '.'))});
      });

      d3.dsv(";", '/presidentielle/resultats-par-niveau-subcom-t2-france-entiere.csv', (data) => {
        if(data["Code du département"] == undefined)
          return;
        var code = that.fixOutreMer(data["Code du département"], false) + "" + data["Code de la commune"];
        that.resultsCommunes[code] = {
          "Macron": parseFloat(data["MACRON.% Voix/Exp"].replace(',', '.')),
          "Le Pen": parseFloat(data["LE PEN.% Voix/Exp"].replace(',', '.'))
        };
        that.setWinner(that.resultsCommunes[code]);
      }).then(() => {
        that.$store.commit("setStats", { geo: "communes", stats: that.getStats(that.resultsCommunes)});
        that.$store.commit("setCommunes", that.resultsCommunes);
        that.init = true;
      });

      d3.dsv(";", '/presidentielle/resultats-par-niveau-dpt-t2-france-entiere.csv', (data) => {
        if(data["Code du département"] == undefined)
          return;
        var code = that.fixOutreMer(data["Code du département"], false);
        that.departements[code] = data["Libellé du département"];
        that.resultsDepartements[code] = {
          "Macron": parseFloat(data["MACRON.% Voix/Exp"].replace(',', '.')),
          "Le Pen": parseFloat(data["LE PEN.% Voix/Exp"].replace(',', '.'))
        };
        that.setWinner(that.resultsDepartements[code]);
      }).then(() => {
        that.$store.commit("setStats", { geo: "departements", stats: that.getStats(that.resultsDepartements)});
        that.$store.commit("setDepartements", that.resultsDepartements);
      });

      d3.dsv(";", '/presidentielle/resultats-par-niveau-cirlg-t2-france-entiere.csv', (data) => {
        if(data["Code du département"] == undefined)
          return;
        var code = that.fixOutreMer(data["Code du département"], false) + data["Code de la circonscription"];
        that.resultsCirconscriptions[code] = {
          "Macron": parseFloat(data["MACRON.% Voix/Exp"].replace(',', '.')),
          "Le Pen": parseFloat(data["LE PEN.% Voix/Exp"].replace(',', '.'))
        };
        that.setWinner(that.resultsCirconscriptions[code]);
      }).then(() => {
        that.$store.commit("setStats", { geo: "circonscriptions", stats: that.getStats(that.resultsCirconscriptions)});
        that.$store.commit("setCirconscriptions", that.resultsCirconscriptions);
      });
    },
    loadPresidentielle: function(){
      this.getPresidentielleRound1();
    },
    loadLegislatives: function(){
      this.getLegislativesRound1();
    },
    getResultsRound1: function(){
      if(this.selectedElec === "presidentielle2022")
        this.getPresidentielleRound1();
      else if(this.selectedElec === "legislatives2022")
        this.getLegislativesRound1();
    },
    getResultsRound2: function(){
      if(this.selectedElec === "presidentielle2022")
        this.getPresidentielleRound2();
      else if(this.selectedElec === "legislatives2022")
        this.getLegislativesRound2();
    },
    getLegislativesRound1: function(){
      var that = this;
      if(that.round == "1" && that.selectedElec === "legislatives2022" && that.init)
        return;
      that.round = "1";
      that.resultsFrance = [];
      that.resultsDepartements = {};
      that.resultsCommunes = {};
      d3.dsv(";", '/legislatives/resultats-par-niveau-fe-t1-leg.csv', (data) => {
        that.resultsFrance.push({candidate: "Ensemble", percent: parseFloat(data["ENS.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["ENS.Sièges"])});
        that.resultsFrance.push({candidate: "NUPES", percent: parseFloat(data["NUP.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["NUP.Sièges"])});
        that.resultsFrance.push({candidate: "Divers extrême gauche", percent: parseFloat(data["DXG.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DXG.Sièges"])});
        that.resultsFrance.push({candidate: "Radical de gauche", percent: parseFloat(data["RDG.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["RDG.Sièges"])});
        that.resultsFrance.push({candidate: "Divers gauche", percent: parseFloat(data["DVG.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DVG.Sièges"])});
        that.resultsFrance.push({candidate: "Ecologistes", percent: parseFloat(data["ECO.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["ECO.Sièges"])});
        that.resultsFrance.push({candidate: "Divers", percent: parseFloat(data["DIV.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DIV.Sièges"])});
        that.resultsFrance.push({candidate: "Régionalistes", percent: parseFloat(data["REG.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["REG.Sièges"])});
        that.resultsFrance.push({candidate: "Divers centre", percent: parseFloat(data["DVC.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DVC.Sièges"])});
        that.resultsFrance.push({candidate: "UDI", percent: parseFloat(data["UDI.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["UDI.Sièges"])});
        that.resultsFrance.push({candidate: "LR", percent: parseFloat(data["LR.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["LR.Sièges"])});
        that.resultsFrance.push({candidate: "Divers droite", percent: parseFloat(data["DVD.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DVD.Sièges"])});
        that.resultsFrance.push({candidate: "Droite souverainiste", percent: parseFloat(data["DSV.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DSV.Sièges"])});
        that.resultsFrance.push({candidate: "Reconquête", percent: parseFloat(data["REC.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["REC.Sièges"])});
        that.resultsFrance.push({candidate: "RN", percent: parseFloat(data["RN.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["RN.Sièges"])});
        that.resultsFrance.push({candidate: "Divers extrême droite", percent: parseFloat(data["DXD.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DXD.Sièges"])});
      });

      const custom = d3.dsvFormat(";");
      custom.parseRows(this.loadFile('/legislatives/resultats-par-niveau-subcom-t1-leg.csv'), (data, i) => {
        if(i > 0){
          var code = that.fixOutreMer(data[0] + "" + data[4], true);
          that.resultsCommunes[code] = {};
          for(var col = 25; col <= data.length - 4; col = col + 8){
             that.resultsCommunes[code][that.readableParty(data[col])] = parseFloat(data[col + 3].replace(',', '.'));
          }
          that.setWinner(that.resultsCommunes[code]);
        }
      });

      custom.parseRows(this.loadFile('/legislatives/resultats-par-niveau-dpt-t1-leg.csv'), (data, i) => {
        if(i > 0){
          var code = that.fixOutreMer(data[0], false);
          that.resultsDepartements[code] = {};
          for(var col = 17; col <= data.length - 5; col = col + 5){
             that.resultsDepartements[code][that.readableParty(data[col])] = parseFloat(data[col + 3].replace(',', '.'));
          }
          that.setWinner(that.resultsDepartements[code]);
        }
      });

      custom.parseRows(this.loadFile('/legislatives/resultats-par-niveau-cirlg-t1-leg.csv'), (data, i) => {
        if(i > 0){
          if(data[0] == undefined)
            return;
          var code = that.fixOutreMer(data[0], false) + data[2];
          that.resultsCirconscriptions[code] = {};
          for(var col = 23; col <= data.length - 4; col = col + 9){
             that.resultsCirconscriptions[code][that.readableParty(data[col])] = parseFloat(data[col + 3].replace(',', '.'));
          }
          that.setWinner(that.resultsCirconscriptions[code]);
        }
      });

      that.$store.commit("setCommunes", that.resultsCommunes);
      that.$store.commit("setDepartements", that.resultsDepartements);
      that.$store.commit("setCirconscriptions", that.resultsCirconscriptions);
      that.init = true;
    },
    getLegislativesRound2: function(){
      var that = this;
      if(that.round == "2" && that.selectedElec === "legislatives2022" && that.init)
        return;
      that.round = "2";
      that.resultsFrance = [];
      that.resultsDepartements = {};
      that.resultsCommunes = {};
      d3.dsv(";", '/legislatives/resultats-par-niveau-fe-t2-leg.csv', (data) => {
        that.resultsFrance.push({candidate: "Ensemble", percent: parseFloat(data["ENS.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["ENS.Sièges"])});
        that.resultsFrance.push({candidate: "NUPES", percent: parseFloat(data["NUP.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["NUP.Sièges"])});
        that.resultsFrance.push({candidate: "Divers extrême gauche", percent: parseFloat(data["DXG.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DXG.Sièges"])});
        that.resultsFrance.push({candidate: "Divers gauche", percent: parseFloat(data["DVG.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DVG.Sièges"])});
        that.resultsFrance.push({candidate: "Divers", percent: parseFloat(data["DIV.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DIV.Sièges"])});
        that.resultsFrance.push({candidate: "Régionalistes", percent: parseFloat(data["REG.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["REG.Sièges"])});
        that.resultsFrance.push({candidate: "Divers centre", percent: parseFloat(data["DVC.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DVC.Sièges"])});
        that.resultsFrance.push({candidate: "UDI", percent: parseFloat(data["UDI.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["UDI.Sièges"])});
        that.resultsFrance.push({candidate: "LR", percent: parseFloat(data["LR.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["LR.Sièges"])});
        that.resultsFrance.push({candidate: "Divers droite", percent: parseFloat(data["DVD.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DVD.Sièges"])});
        that.resultsFrance.push({candidate: "Droite souverainiste", percent: parseFloat(data["DSV.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["DSV.Sièges"])});
        that.resultsFrance.push({candidate: "RN", percent: parseFloat(data["RN.% Voix/Exp"].replace(',', '.')), sieges: parseInt(data["RN.Sièges"])});
      });

      const custom = d3.dsvFormat(";");
      custom.parseRows(this.loadFile('/legislatives/resultats-par-niveau-subcom-t2-leg.csv'), (data, i) => {
        if(i > 0){
          var code = that.fixOutreMer(data[0] + "" + data[4], true);
          that.resultsCommunes[code] = {};
          for(var col = 25; col <= data.length - 4; col = col + 8){
             that.resultsCommunes[code][that.readableParty(data[col])] = parseFloat(data[col + 3].replace(',', '.'));
          }
          that.setWinner(that.resultsCommunes[code]);
        }
      });

      custom.parseRows(this.loadFile('/legislatives/resultats-par-niveau-dpt-t2-leg.csv'), (data, i) => {
        if(i > 0){
          var code = that.fixOutreMer(data[0], false);
          that.resultsDepartements[code] = {};
          for(var col = 17; col <= data.length - 5; col = col + 5){
             that.resultsDepartements[code][that.readableParty(data[col])] = parseFloat(data[col + 3].replace(',', '.'));
          }
          that.setWinner(that.resultsDepartements[code]);
        }
      });

      custom.parseRows(this.loadFile('/legislatives/resultats-par-niveau-cirlg-t2-leg.csv'), (data, i) => {
        if(i > 0){
          if(data[0] == undefined)
            return;
          var code = that.fixOutreMer(data[0], false) + data[2];
          that.resultsCirconscriptions[code] = {};
          for(var col = 23; col <= data.length - 4; col = col + 9){
             that.resultsCirconscriptions[code][that.readableParty(data[col])] = parseFloat(data[col + 3].replace(',', '.'));
          }
          that.setWinner(that.resultsCirconscriptions[code]);
        }
      });

      that.$store.commit("setCommunes", that.resultsCommunes);
      that.$store.commit("setDepartements", that.resultsDepartements);
      that.$store.commit("setCirconscriptions", that.resultsCirconscriptions);
      that.init = true;
    },
    loadFile: function(filePath) {
      var result = null;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", filePath, false);
      xmlhttp.send();
      if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
      }
      return result;
    },
    readableParty: function(etiquette){
      switch(etiquette){
        case "ENS":
          return "Ensemble";
        case "DVC":
          return "Divers centre";
        case "RN":
          return "RN";
        case "DXD":
          return "Divers extrême droite";
        case "DIV":
          return "Divers";
        case "NUP":
          return "NUPES";
        case "REC":
          return "Reconquête";
        case "UDI":
          return "UDI";
        case "LR":
          return "LR";
        case "DVD":
          return "Divers droite";
        case "REG":
          return "Régionalistes";
        case "DSV":
          return "Droite souverainiste";
        case "RDG":
          return "Radical de gauche";
        case "DVG":
          return "Divers gauche";
        case "DXG":
          return "Divers extrême gauche";
        case "ECO":
          return "Ecologistes";
      }
    }
  },
  mounted: function(){
    var that = this;
    that.loadPresidentielle();
  },
  watch: {
    selectedElec: function(){
      this.init = false;
      if(this.selectedElec == "legislatives2022")
        this.loadLegislatives();
      else if(this.selectedElec == "presidentielle2022")
        this.loadPresidentielle();
    }
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
