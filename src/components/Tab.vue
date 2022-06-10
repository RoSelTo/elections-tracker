<template>
  <div class="tab">
    <h2>Résultats {{geo.libgeo}}</h2>
    <table>
      <thead>
        <th>Candidat</th>
        <th>Pourcentage voix exprimés</th>
      </thead>
      <tbody>
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
        return this.$store.getters.resultsForGeo();
    }
  }
}
</script>

<style>
.tab {
  flex: auto;
}
</style>
