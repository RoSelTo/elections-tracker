<template>
  <div class="tab">
    <h2>Résultats {{geo.libgeo}}</h2>
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
.tab {
  flex: auto;
  text-align: center;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
  height: 500px;
}

#tab-result{
  margin: auto;
  font-size: 18px;
}
</style>
