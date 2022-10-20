<template>
  <div class="map">
    <div class="flex justify-center space-x-4">
      <div :class="{'bg-orange-500': level == 'departements', 'bg-blue-700': level != 'departements'}" class="text-white px-5 py-3 font-bold cursor-pointer" 
        v-on:click="createMapDepartements">Département</div>
      <div :class="{'bg-orange-500': level == 'communes', 'bg-blue-700': level != 'communes'}" class="text-white px-5 py-3 font-bold cursor-pointer" 
        v-on:click="createMapCommunes">Commune</div>
      <div :class="{'bg-orange-500': level == 'circonscriptions', 'bg-blue-700': level != 'circonscriptions'}" class="text-white px-5 py-3 font-bold cursor-pointer" 
        v-on:click="createMapCirconscriptions">Circonscription</div>
    </div>
    <!-- Add loading -->
    <div id="mapContainer" style="height:calc(100vh - 230px)" v-show="!loading">
      <svg id="map" class="m-auto"></svg>
    </div>
    <div class="tooltip">
    </div>
    <div v-if="loading" class="lds-ring">Chargement<div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
import myStore from './store.js'
import * as d3 from 'd3'
import * as topojson from 'topojson'
export default {
  name: 'MapComponent',
  store: myStore,
  props: {
    departements: Object,
    round: String,
    selectedElec: String
  },
  data: function(){
    return {
      loading: false,
      level: "departements",
      currentRound: "",
      currentElec: "",
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
    reloadMap: function(){
      if(this.level == "communes")
        this.createMapCommunes();
      else if (this.level == "circonscriptions")
        this.createMapCirconscriptions();
      else if (this.level == "departements")
        this.createMapDepartements();
    },
    createMapCommunes: function(){
      var that = this;
      that.loading = true; 
      that.level = "communes";
      this.currentElec = this.selectedElec;
      that.currentRound = this.round;
      that.$store.commit("selectLevel", that.level);
      that.$store.commit("selectGeo", null);
      var container = d3.select("#mapContainer").node().getBoundingClientRect().height;
      const width = container, height = container;
      const path = d3.geoPath();
      const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .scale(4000)
      .translate([width / 2, height / 2]);
      path.projection(projection);

      d3.select('#map').select("g").remove();
      const svg = d3.select('#map')
      .attr("width", width)
      .attr("height", height);
      
      const communes = svg.append("g");
      var promises = [];
      promises.push(d3.json('/a-com2022-topo.json'));
      Promise.all(promises).then(function(values) {
      var topology = values[0];
      var ps = topojson.presimplify(topology);
      var s = topojson.simplify(ps, 0.001);
      var geojson = topojson.feature(s, topology.objects.a_com2022);

      communes.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('id', d => d.properties.codgeo)
        .attr("d", path);

        var tooltip = d3.select(".tooltip");
        d3.select('#map')
          .selectAll("path")
          .on("mouseover", function(e) {
            var pos = d3.select(this).node().getBoundingClientRect();
            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);
            tooltip.html( "<b>Commune : </b>" + e.properties.libgeo + " (" + e.properties.codgeo + ")<br/>"
                        + "<b>Vainqueur : </b>" + that.$store.state.resultsCommunes[e.properties.codgeo].winner)
                  .style("left", pos.x + 50 + "px")     
                  .style("top", (pos.y) + "px");
          })
          .on("click", function(e){
            that.$store.commit("selectGeo", {id: e.properties.codgeo, label: e.properties.libgeo });
          })
          .on("mouseout", function(){
            tooltip.style("opacity", 0);
          });
        that.update();  

        var zoom = d3.zoom()
              .scaleExtent([1, 8])
              .on('zoom', function() {
                  d3.select('#map').selectAll('path')
                  .attr('transform', d3.event.transform);
        });

        svg.call(zoom);
        that.loading = false;          
      });
    },
    createMapDepartements: function(){
      var that = this;
      that.loading = true; 
      that.level = "departements";
      this.currentElec = this.selectedElec;
      that.currentRound = this.round;
      that.$store.commit("selectLevel", that.level);
      that.$store.commit("selectGeo", null);
      var container = d3.select("#mapContainer").node().getBoundingClientRect().height;
      const width = container, height = container;
      const path = d3.geoPath();
      const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .scale(4000)
      .translate([width / 2, height / 2]);
      path.projection(projection);

      d3.select('#map').select("g").remove();
      const svg = d3.select('#map')
      .attr("width", width)
      .attr("height", height);

      const departements = svg.append("g");
      var promises = [];
      promises.push(d3.json('/a-dep2021.json'));
      Promise.all(promises).then(function(values) {
      var geojson = values[0];

      departements.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('id', d => d.properties.dep)
        .attr("d", path);

        var tooltip = d3.select(".tooltip");
        d3.select('#map')
          .selectAll("path")
          .on("mouseover", function(e) {
            var pos = d3.select(this).node().getBoundingClientRect();
            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);
            tooltip.html( "<b>Département : </b>" + e.properties.libgeo + " (" + e.properties.dep + ")<br/>"
                        + "<b>Vainqueur : </b>" + that.$store.state.resultsDepartements[e.properties.dep].winner)
                  .style("left", pos.x + 50 + "px")     
                  .style("top", (pos.y) + "px");
          })
          .on("click", function(e){
            that.$store.commit("selectGeo", {id: e.properties.dep, label: e.properties.libgeo });
          })
          .on("mouseout", function(){
            tooltip.style("opacity", 0);
          });
        that.update();  

        var zoom = d3.zoom()
              .scaleExtent([1, 8])
              .on('zoom', function() {
                  d3.select('#map').selectAll('path')
                  .attr('transform', d3.event.transform);
        });

        svg.call(zoom);
        that.loading = false;          
      });
    },
    createMapCirconscriptions: function(){
      var that = this;
      that.loading = true; 
      that.level = "circonscriptions";
      this.currentElec = this.selectedElec;
      that.currentRound = this.round;
      that.$store.commit("selectLevel", that.level);
      that.$store.commit("selectGeo", null);
      var container = d3.select("#mapContainer").node().getBoundingClientRect().height;
      const width = container, height = container;
      const path = d3.geoPath();
      const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .scale(4000)
      .translate([width / 2, height / 2]);
      path.projection(projection);

      d3.select('#map').select("g").remove();
      const svg = d3.select('#map')
      .attr("width", width)
      .attr("height", height);

      const circo = svg.append("g");
      var promises = [];
      promises.push(d3.json('/france-circonscriptions-legislatives-2012.json'));
      Promise.all(promises).then(function(values) {
      var geojson = values[0];

      circo.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('id', d => d.properties.code_dpt + "" + d.properties.num_circ.padStart(2, "0"))
        .attr("d", path);

        var tooltip = d3.select(".tooltip");
        d3.select('#map')
          .selectAll("path")
          .on("mouseover", function(e) {
            var pos = d3.select(this).node().getBoundingClientRect();
            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);
            var id = e.properties.code_dpt + e.properties.num_circ.padStart(2, "0");
            tooltip.html( "<b>Circonscription : </b>" + e.properties.num_circ + "<sup>ème</sup> " + that.departements[e.properties.code_dpt] + "<br/>"
                        + "<b>Vainqueur : </b>" + that.$store.state.resultsCirconscriptions[id].winner)
                  .style("left", pos.x + 50 + "px")     
                  .style("top", (pos.y) + "px");
          })
          .on("click", function(e){
            var id = e.properties.code_dpt + e.properties.num_circ.padStart(2, "0");
            var label = e.properties.num_circ + "ème " + that.departements[e.properties.code_dpt];
            that.$store.commit("selectGeo", {id: id, label: label });
          })
          .on("mouseout", function(){
            tooltip.style("opacity", 0);
          });
        that.update();  

        var zoom = d3.zoom()
              .scaleExtent([1, 8])
              .on('zoom', function() {
                  d3.select('#map').selectAll('path')
                  .attr('transform', d3.event.transform);
        });

        svg.call(zoom);
        that.loading = false;          
      });
    },
    update: function(){
      var that = this;
      var notFound = [];
       d3.select('#map')
          .selectAll("path")
          .attr("fill", d => {
            var codeGeo = that.getCodeGeo(d);
            var results = that.$store.getters.getResults;
            if(results[codeGeo] != null){
              return that.colorCandidate[results[codeGeo].winner];
            }
            notFound.push(codeGeo);
            return "grey";
          });
      //console.log(notFound);
    },
    getCodeGeo: function(level){
      var that = this;
      if(that.level == "communes")
        return level.properties.codgeo;
      else if (that.level == "departements")
        return level.properties.dep;
      else if (that.level == "circonscriptions" && level.properties.num_circ != null)
        return level.properties.code_dpt + level.properties.num_circ.padStart(2, "0");
      // else
      //   console.log(level.properties);
    }
  },
  mounted: function(){
    this.createMapDepartements();
    window.map = this;
  },
  watch: {
    round: function(){
      if(this.round != this.currentRound)
        this.reloadMap();
    },
    selectedElec: function(){
      if(this.selectedElec != this.currentElec)
        this.reloadMap();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.map {
  flex: auto;
}

div.tooltip {
  position: absolute;
  text-align: left;
  color: black;
  padding: 12px;
  font: 14px sans-serif;
  background: white;
  border: 0px;
  pointer-events: none;
  opacity: 0;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
  line-height: 20px;
}
</style>
