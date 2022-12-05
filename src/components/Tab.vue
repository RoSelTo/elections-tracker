<template>
  <div v-if="results != null" class="tab box-border text-center h-fit pb-[20px] flex-1 shadow-lg">
    <h2 v-if="geo != null" class="text-xl mt-10">Résultats {{geo.label}}</h2>
    <h2 v-else class="text-xl mt-10">Résultats France</h2>
    <table id="tab-result">
      <thead>
        <th>Candidat</th>
        <th>% voix exprimés</th>
        <th v-if="sortedResults[0] != null && sortedResults[0].sieges != null">Sièges</th>
      </thead>
      <tbody>
        <tr v-for="result in sortedResults" :key="result.candidate">
          <td>{{result.candidate}}</td>
          <td>{{result.percent}}</td>
          <td v-if="result.sieges != null">{{result.sieges}}</td>
        </tr>
      </tbody>
    </table>
    <div class="text-lg mt-5">
      <span class="font-bold">Abstention</span> : {{ results.abstention }}%
    </div>
    <GChart v-if="sortedResults[0] != null && sortedResults[0].sieges != null"
        type="PieChart"
        :data="chartData"
        :options="chartOptions"
      />
  </div>
</template>

<script>
import myStore from './store.js'
import { GChart } from 'vue-google-charts/legacy'

export default {
  name: 'TabResult',
  store: myStore,
  components: {
    GChart
  },
  data: function(){
    return {
      chartOptions: {
        title: "Répartition des sièges",
        titleTextStyle: {
            fontName: "Arial",
            fontSize: 18
        },
        pieHole: 0.4,
        backgroundColor: "#f3f2ef",
        width: "100%",
        height: 400,
        colors: []
      },
      colorCandidate: {
        "Macron": "#FF9F0E",
        "Le Pen": "#802990",
        "Mélenchon": "#942017",
        "Zemmour": "#5543CC",
        "Pécresse": "#16418B",
        "Lassalle": "#B2B2B2",
        "Jadot": "#02C001",
        "Roussel": "#CB2A1E",
        "Dupont-Aignan": "#163860",
        "Hidalgo": "#F19999",
        "Poutou": "#CB2A1E",
        "Arthaud": "#CB2A1E",
        "Ensemble": "#FF9F0E",
        "Divers centre": "#FF9F0E",
        "RN": "#802990",
        "Divers extrême droite": "#802990",
        "NUPES": "#942017",
        "Reconquête": "#5543CC",
        "UDI": "#16418B",
        "LR": "#16418B",
        "Divers droite": "#16418B",
        "Régionalistes": "#B2B2B2",
        "Droite souverainiste": "#163860",
        "Radical de gauche": "#F19999",
        "Divers gauche": "#F19999",
        "Divers extrême gauche": "#CB2A1E",
        "Ecologistes": "#02C001",
      }
    }
  },
  computed: {
    geo: function(){
      return this.$store.state.selectedGeo;
    },
    results: function(){
      return this.$store.getters.resultsForGeo;
    },
    sortedResults: function(){
      var results = [];
      if(this.results != null){
        Object.keys(this.results.data).forEach(k => {
          var result = {candidate: k, percent: Math.round(this.results.data[k].percent*100)/100};
          if(this.results.data[k].sieges != null)
            result.sieges = this.results.data[k].sieges;
          results.push(result);
        })
      }
      return results.sort((a,b) => b.percent - a.percent);
    },
    chartData: function(){
      var that = this;
      var chartData = [];
      chartData.push(["Parti", "Sièges"]);
      that.chartOptions.colors = [];
      if(this.results != null && this.sortedResults[0] != null && this.sortedResults[0].sieges != null){
        this.sortedResults.forEach(element => {
          chartData.push([element.candidate, element.sieges]);
          that.chartOptions.colors.push(that.colorCandidate[element.candidate] != null ? that.colorCandidate[element.candidate] : "grey");
        });
      }
      return chartData;
    }
  }
}
</script>

<style>
#tab-result{
  margin: auto;
  font-size: 18px;
}
</style>
