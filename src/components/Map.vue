<template>
  <div class="map">
    <!-- Add loading -->
    <svg v-show="!loading" id="map"></svg>
    <div class="tooltip">
    </div>
    <div v-if="loading" class="lds-ring"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
export default {
  name: 'MapCommunes',
  props: {
    resultsCommunes: Object
  },
  data: function(){
    return {
      loading: true
    }
  },
  methods:{
    create: function(){
      var that = this;
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
                        + "<b>Vainqueur : </b>" + that.resultsCommunes[e.properties.codgeo].winner)
                  .style("left", pos.x + 50 + "px")     
                  .style("top", (pos.y) + "px");
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
            if(that.resultsCommunes[d.properties.codgeo] != null){
              if(that.resultsCommunes[d.properties.codgeo].winner == "Macron")
                return "orange";
              if(that.resultsCommunes[d.properties.codgeo].winner == "Le Pen")
                return "violet";
              if(that.resultsCommunes[d.properties.codgeo].winner == "Mélenchon")
                return "red";
              return "blue";
            }
            notFound.push(d.properties.codgeo);
            return "grey";
          });
      console.log(notFound);
    }
  },
  mounted: function(){
    this.create();
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
