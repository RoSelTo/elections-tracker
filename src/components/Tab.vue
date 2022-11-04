<template>
  <div class="tab box-border text-center h-fit pb-[20px] flex-1 shadow-lg">
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
  props: {
    resultsFrance: Array
  },
  data: function(){
    return {
      loading: true,
      chartOptions: {
        pieHole: 0.4,
        backgroundColor: "#f3f2ef",
        width: 600,
        height: 400,
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
      if(!this.results) {
        results = this.resultsFrance;
      } else {
        Object.keys(this.results).filter(k => k != "winner").forEach(k => {
          var result = {candidate: k, percent: Math.round(this.results[k].percent*100)/100};
          if(this.results[k].sieges != null)
            result.sieges = this.results[k].sieges;
          results.push(result);
        })
      }
      return results.sort((a,b) => b.percent - a.percent);
    },
    chartData: function(){
      var chartData = [];
      chartData.push(["Parti", "Sièges"]);
      if(this.sortedResults[0] != null && this.sortedResults[0].sieges != null){
        this.sortedResults.forEach(element => {
          chartData.push([element.candidate, element.sieges]);
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
