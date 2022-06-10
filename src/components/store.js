import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        resultsCommunes: {},
        selectedGeo: {}
    },
    mutations: {
        set(state, value) {
            state.resultsCommunes = value;
        },
        selectGeo(state, geo) {
            state.selectedGeo = geo;
        }
    },
    getters: {
        resultsForGeo(state){
            return state.resultsCommunes[state.selectedGeo.codgeo];
        }
    }
})
Vue.config.devtools = true