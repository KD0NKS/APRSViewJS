import { StationSettings } from 'js-aprs-engine';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        stationSettings: new StationSettings()
    },
    mutations: {
        setStationSettings(state, settings) {
            state.stationSettings = settings;
        }
    },
    actions: {
        async getStationSettings({ state, commit }) {
            commit('setStationSettings', new StationSettings())
        }
    },
});