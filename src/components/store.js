import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loaded: false,
        resultsFrance: {},
        resultsCommunes: {},
        resultsDepartements: {},
        resultsCirconscriptions: {},
        selectedGeo: {},
        selectedLevel: "",
        stats: {
            communes:{},
            departements: {},
            circonscriptions: {}
        }
    },
    mutations: {
        setFrance(state, value) {
            state.loaded = true;
            state.resultsFrance = value;
        },
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
        },
        setStats(state, payload) {
            state.stats[payload.geo] = payload.stats;
        }
    },
    getters: {
        resultsForGeo: function(state){
            if(!state.loaded)
                return null;
            if(state.selectedGeo == null)
                return state.resultsFrance;
            else if(state.selectedLevel == "communes")
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
            else
                return state.resultsFrance
        }
    }
})
Vue.config.devtools = true