<template>
  <div class="analysis m-auto w-[800px]">
      <div class="mb-5 mt-5 text-lg">
        Corrélation entre 
        <select v-model="variable1">
            <option v-for="candidate in variable1List" :key="candidate" :value="candidate">Vote {{candidate}}</option>
        </select>
        et 
        <select v-model="variable2">
            <option value="chomage">Chomage</option>
            <option value="medianeNiveau">Revenu</option>
            <option value="abstention">Abstention</option>
        </select>
      </div>
      <div>
        <GChart type="BubbleChart" 
            :data="chartData"
            :options="chartOptions"
        />
      </div>
  </div>
</template>

<script>
import myStore from './store.js'
import { GChart } from 'vue-google-charts/legacy'
export default {
  name: 'AnalysisComponent',
  store: myStore,
  components: {
    GChart
  },
  props: {
    departements: Object,
    round: String,
    selectedElec: String
  },
  data: function(){
    return {
      loading: false,
       chartOptions: {
        hAxis: { title: '' },
        vAxis: { title: '' },
        bubble: { textStyle: { fontSize: 11 } },
        width: 800,
        height: 600
      },
      variable1: "",
      variable2: "chomage",
      chartData: null,
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
  methods:{
    drawChart: function(){
        var that = this;
        if(that.variable1 != "" && that.variable2 != "") {
          var data = that.$store.state.resultsDepartements;
          that.chartData = [];
          that.chartOptions.hAxis.title = `Vote ${that.variable1}`;
          that.chartOptions.vAxis.title = `${that.variable2}`;
          that.chartOptions.colors = [];
          that.chartData.push(["Id", that.variable1, that.variable2, "", "Population"]);
          if(data != null){
            var winners = [];
            Object.keys(data).forEach(element => {
                var absValue = that.variable2 == "abstention" ? data[element].abstention : that.departements[element][that.variable2];
                if(data[element].data[that.variable1] != null) {
                  that.chartData.push([element, data[element].data[that.variable1].percent, absValue, data[element].winner, that.departements[element].population]);
                  if(winners.indexOf(data[element].winner) == -1)
                    winners.push(data[element].winner);
                }
            });
            winners.forEach(w => that.chartOptions.colors.push(that.colorCandidate[w] != null ? that.colorCandidate[w] : "grey"));
          }
        }
    }  
  },
  mounted: function(){
      this.variable1 = this.variable1List[0];
      this.drawChart();
  },
  computed:{
      variable1List: function(){
        return Object.keys(this.$store.state.resultsDepartements["01"].data);
      }
  },
  watch: {
      variable1: function(){
        this.drawChart();
      },
      variable2: function(){
        this.drawChart();
      }
  }
}
</script>