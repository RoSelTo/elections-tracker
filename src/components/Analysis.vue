<template>
  <div class="analysis m-auto w-[800px]">
      <div class="mb-5 mt-5">
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
        title: "Corrélation",
        titleTextStyle: {
            fontName: "Arial",
            fontSize: 18
        },
        hAxis: { title: 'Vote LePen' },
        vAxis: { title: 'Chomage' },
        bubble: { textStyle: { fontSize: 11 } },
        width: 800,
        height: 600
      },
      variable1: "Le Pen",
      variable2: "chomage",
      chartData: null
    }
  },
  methods:{
    drawChart: function(){
        var that = this;
        var data = that.$store.state.resultsDepartements;
        that.chartData = [];
        that.chartOptions.hAxis.title = `Vote ${that.variable1}`;
        that.chartOptions.vAxis.title = `${that.variable2}`;
        that.chartData.push(["Id", that.variable1, that.variable2, "", "Population"]);
        if(data != null){
            Object.keys(data).forEach(element => {
                var absValue = that.variable2 == "abstention" ? data[element].abstention : that.departements[element][that.variable2];
                that.chartData.push([element, data[element].data[that.variable1].percent, absValue, '', that.departements[element].population]);
            });
        }
    }  
  },
  mounted: function(){
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