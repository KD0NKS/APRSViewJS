<template>
    <div class="about">
        <v-container fluid>
            <v-layout text-xs-center wrap>
                <v-flex mb-4>
                    <h1>APRS</h1>
                    <p>
                        APRS is a registered trademark of APRS Software and Bob Bruninga, WB4APR.
                    </p>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    import 'vuetify/dist/vuetify.min.css';

    @Component({
      components: { }
    })

    export default class About extends Vue {}
</script>