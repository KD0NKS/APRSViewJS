<template>
    <div style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Settings</h1>
        </div>
        <v-expansion-panel
                v-model="panel"
                expand>
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div><h3>Station Settings</h3></div>
                </template>
                <v-card style="margin: 12px">
                    <v-form @submit.prevent="saveStationInfo" id="station-settings-form">
                        <v-container>
                            <v-layout>
                                <v-flex xs12 md8>
                                    <v-text-field
                                            v-model="stationInfo.callsign"
                                            :error-messages="stationInfoCallsignErrors"
                                            label="Callsign"
                                            required
                                            @input="$v.stationInfo.callsign.$touch()"
                                            @blur="$v.stationInfo.callsign.$touch()"
                                            >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 md4>
                                    <v-text-field v-model="stationInfo.ssid"
                                            label="ssid">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-text-field v-model="stationInfo.passcode"
                                    label="Passcode"
                                    required>
                            </v-text-field>

                            <v-select
                                    :items="aprsSymbols"
                                    v-model="stationInfo.symbol"
                                    item-text="name"
                                    item-value="key"
                                    label="Station Symbol"
                                    @blur="updateSymbol(`${stationInfo.symbol}`)"
                                    @change="updateSymbol(`${stationInfo.symbol}`)"
                                    >
                            </v-select>

                            <v-select
                                    :items="aprsSymbolOverlays"
                                    v-model="stationInfo.symbolOverlay"
                                    item-text="name"
                                    item-value = "key"
                                    label="Symbol Overlay"
                                    :disabled="!isOverlayEnabled"
                                    @blur="updateOverlay(`${stationInfo.symbolOverlay}`)"
                                    @change="updateOverlay(`${stationInfo.symbolOverlay}`)"
                                    >
                            </v-select>
                        </v-container>

                        <v-btn color="success" type="submit" :disabled="$v.stationInfo.$invalid" form="station-settings-form">Save</v-btn>
                        <v-btn color="error" @click="resetStationInfo">Reset</v-btn>
                    </v-form>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </div>
</template>

<script lang="ts">
    import { APRSSymbol, APRSSymbolService, StationSettings, StringUtil } from 'js-aprs-engine';
    import { validationMixin } from 'vuelidate';
    import { required, requiredIf } from 'vuelidate/lib/validators';
    import store from '../store';

    let symbolSvc = new APRSSymbolService();

    export default {
        data: () => ({
            panel: [true]
            , stationInfo: {
                callsign: store.state.stationSettings.callsign
                , passcode: store.state.stationSettings.passcode
                , ssid: store.state.stationSettings.ssid
                , symbol: store.state.stationSettings.symbol
                , symbolOverlay: store.state.stationSettings.symbol
            }
        })
        , created() {
            // load settings here
            //https://jsfiddle.net/awolf2904/3rabkzsn/1/
            store.dispatch('getStationSettings');
        }
        , computed: {
            stationInfoCallsignErrors() {
                const errors: string[] = [];

                if(!this.$v.stationInfo.callsign.$dirty)
                    return errors;

                !this.$v.stationInfo.callsign.required && errors.push('Callsign is required.');

                return errors;
            }
            , stationInfoPasscodeErrors() {
                const errors: string[] = [];

                if(!this.$v.stationInfo.passcode.$dirty)
                    return errors;

                !this.$v.stationInfo.passcode.required && errors.push('Passcode is required.');

                return errors;
            }
            , aprsSymbols() {
                return symbolSvc.GetSymbols();
            }
            , aprsSymbolOverlays() {
                return symbolSvc.GetOverlays();
            }
            , isOverlayEnabled(): boolean {
                return !StringUtil.IsNullOrWhiteSpace(this.stationInfo.symbol) && symbolSvc.GetSymbolByKey(this.stationInfo.symbol).isAllowOverlay === true;
            }
        }
        , methods: {
            saveStationInfo() {
                this.$v.$touch();

                if(!this.$data.stationInfo.$invalid) {
                    store.commit('setStationSettings', {
                        callsign: this.stationInfo.callsign
                        , passcode: this.stationInfo.passcode
                        , ssid: this.stationInfo.ssid
                    });
                }
            }
            , resetStationInfo() {
                this.stationInfo.callsign = store.state.stationSettings.callsign;
                this.stationInfo.passcode = store.state.stationSettings.passcode;
                this.stationInfo.ssid = store.state.stationSettings.ssid;
                this.stationInfo.symbol = store.state.stationSettings.symbol;
                this.stationInfo.symbolOverlay = store.state.stationSettings.symbolOverlay;
            }
            , updateSymbol(key: string) {
                this.stationInfo.symbol = key;

                if(symbolSvc.GetSymbolByKey(this.stationInfo.symbol).isAllowOverlay === false) {
                    this.stationInfo.symbolOverlay = null;
                }
            }
            , updateOverlay(key: string) {
                this.stationInfo.symbolOverlay = key;
            }
        }
        , mixins: [ validationMixin ]
        , validations: {
            stationInfo: {
                callsign: { required }
                , passcode: { required }
            }
        }
    }
</script>