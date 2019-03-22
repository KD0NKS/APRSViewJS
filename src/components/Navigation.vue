<template id="Navigation">
    <v-navigation-drawer
            v-model="drawer"
            :mini-variant.sync="mini"
            hide-overlay
            stateless
            app>
        <v-toolbar flat class="transparent">
            <v-list class="pa-0">
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <v-img
                                :src="require('../assets/radio-tower.png')"
                                class="my-3"
                                contain>
                        </v-img>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ callsign }}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-btn
                                icon
                                @click.stop="mini = !mini"
                                >
                            <v-icon>chevron_left</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-toolbar>

        <v-list class="pt-0" dense>
            <v-divider></v-divider>

            <v-list-tile
                    v-for="item in items"
                    :key="item.title"
                    :to="item.action"
                    >
                <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        computed: {
            callsign() {
                return this.$store.state.stationSettings.callsign;
            }
        }
        , data() {
            return {
                drawer: true
                , items: [
                    { title: 'Dashboard', icon: 'dashboard', action: "/" }
                    , { title: 'Map', icon: 'map', action: '/map' }
                    , { title: 'Messages', icon: 'message', action: "/messages" }
                    , { title: 'Settings', icon: 'settings', action: "/settings" }
                    , { title: 'About', icon: 'info', action: "/about" }
                ]
                , mini: true
                , right: null
            }
        }
    }
</script>