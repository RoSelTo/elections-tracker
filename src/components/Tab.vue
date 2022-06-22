<template>
  <div class="tab box-border text-center h-[500px] flex-auto shadow-lg">
    <h2 class="text-xl mt-10">Résultats {{geo.libgeo}}</h2>
    <table id="tab-result">
      <thead>
        <th>Candidat</th>
        <th>Pourcentage voix exprimés</th>
      </thead>
      <tbody>
        <tr v-for="result in sortedResults" :key="result.candidate">
          <td>{{result.candidate}}</td>
          <td>{{result.percent}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import myStore from './store.js'

export default {
  name: 'TabResult',
  store: myStore,
  props: {
  },
  data: function(){
    return {
      loading: true
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
      Object.keys(this.results).filter(k => k != "winner").forEach(k => {
        results.push({candidate: k, percent: Math.round(this.results[k]*100)/100});
      })
      return results.sort((a,b) => b.percent - a.percent);
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
