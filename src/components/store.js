import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        resultsCommunes: {},
        resultsDepartements: {},
        resultsCirconscriptions: {},
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
        setCirconscriptions(state, value) {
            state.resultsCirconscriptions = value;
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
            if(state.selectedGeo == null)
                return null;
            if(state.selectedLevel == "communes")
                return state.resultsCommunes[state.selectedGeo.id];
            else if(state.selectedLevel == "departements")
                return state.resultsDepartements[state.selectedGeo.id];
            else if(state.selectedLevel == "circonscriptions")
                return state.resultsCirconscriptions[state.selectedGeo.id];
        },
        getResults: function(state) {
            if(state.selectedLevel == "communes")
                return state.resultsCommunes;
            else if(state.selectedLevel == "departements")
                return state.resultsDepartements;
            else if(state.selectedLevel == "circonscriptions")
                return state.resultsCirconscriptions;
        }
    }
})
Vue.config.devtools = true