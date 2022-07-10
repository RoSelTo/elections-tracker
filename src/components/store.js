import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        resultsCommunes: {},
        resultsDepartements: {},
        selectedGeo: {},
        selectedLevel: ""
    },
    mutations: {
        setCommunes(state, value) {
            state.resultsCommunes = value;
        },
        setDepartements(state, value) {
            state.resultsDepartements = value;
        },
        selectLevel(state, level) {
            state.selectedLevel = level;
        },
        selectGeo(state, geo) {
            state.selectedGeo = geo;
        }
    },
    getters: {
        resultsForGeo: function(state){
            if(state.selectedLevel == "communes")
                return state.resultsCommunes[state.selectedGeo.codgeo];
            else if(state.selectedLevel == "departements")
                return state.resultsDepartements[state.selectedGeo.dep];
        },
        getResults: function(state) {
            if(state.selectedLevel == "communes")
                return state.resultsCommunes;
            else if(state.selectedLevel == "departements")
                return state.resultsDepartements;
        }
    }
})
Vue.config.devtools = true