<template>
  <div class="map">
    <div v-show="!loading" class="flex justify-center space-x-4">
      <div :class="{'bg-orange-500': level == 'departements', 'bg-blue-700': level != 'departements'}" class="text-white px-5 py-3 font-bold" v-on:click="createMapDepartements">Département</div>
      <div :class="{'bg-orange-500': level == 'communes', 'bg-blue-700': level != 'communes'}" class="text-white px-5 py-3 font-bold" v-on:click="createMapCommunes">Commune</div>
      <div :class="{'bg-orange-500': level == 'circonscriptions', 'bg-blue-700': level != 'circonscriptions'}" class="text-white px-5 py-3 font-bold" v-on:click="createMapCirconscriptions">Circonscription</div>
    </div>
    <div v-html="strip(test)"></div>
    <!-- Add loading -->
    <svg v-show="!loading" id="map"></svg>
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
  name: 'MapCommunes',
  store: myStore,
  props: {
  },
  data: function(){
    return {
      loading: true,
      level: "departements",
      test: "<img src='*' onerror='alert()'>"
    }
  },
  methods:{
    strip: function(html){
   let doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
},
    createMapCommunes: function(){
      var that = this;
      that.level = "communes";
      const width = 1000, height = 1000;
      const path = d3.geoPath();
      const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .scale(5000)
      .translate([width / 2, height / 2]);
      path.projection(projection);

      const svg = d3.select('#map')
      .attr("width", width)
      .attr("height", height);

      const communes = svg.append("g");
      var promises = [];
      promises.push(d3.json('/a-com2022-topo.json'));
      Promise.all(promises).then(function(values) {
      var topology = values[0];
      var geojson = topojson.feature(topology, topology.objects.a_com2022);

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
            that.$store.commit("selectGeo", e.properties);
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
      that.level = "departements";
      const width = 1000, height = 1000;
      const path = d3.geoPath();
      const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .scale(5000)
      .translate([width / 2, height / 2]);
      path.projection(projection);

      const svg = d3.select('#map')
      .attr("width", width)
      .attr("height", height);

      const communes = svg.append("g");
      var promises = [];
      promises.push(d3.json('/a-dep2021.json'));
      Promise.all(promises).then(function(values) {
      var geojson = values[0];

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
            that.$store.commit("selectGeo", e.properties);
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
      that.level = "circonscriptions";
      const width = 1000, height = 1000;
      const path = d3.geoPath();
      const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .scale(5000)
      .translate([width / 2, height / 2]);
      path.projection(projection);

      const svg = d3.select('#map')
      .attr("width", width)
      .attr("height", height);

      const communes = svg.append("g");
      var promises = [];
      promises.push(d3.json('/france-circonscriptions-legislatives-2012.json'));
      Promise.all(promises).then(function(values) {
      var geojson = values[0];

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
            that.$store.commit("selectGeo", e.properties);
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
            if(that.$store.state.resultsCommunes[d.properties.codgeo] != null){
              if(that.$store.state.resultsCommunes[d.properties.codgeo].winner == "Macron")
                return "orange";
              if(that.$store.state.resultsCommunes[d.properties.codgeo].winner == "Le Pen")
                return "violet";
              if(that.$store.state.resultsCommunes[d.properties.codgeo].winner == "Mélenchon")
                return "red";
              return "blue";
            }
            notFound.push(d.properties.codgeo);
            return "grey";
          });
      //console.log(notFound);
    }
  },
  mounted: function(){
    this.createMapDepartements();
    window.map = this;
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
