<template>
    <q-layout>
        <q-header elevated>
            <q-toolbar class="bg-orange-14">
                <q-toolbar-title>
                    Smart Directions
                </q-toolbar-title>
            <q-btn
                flat
                dense
                @click="openWelcomePage"
                icon="home"
            />
            <q-space />
        </q-toolbar>
    </q-header>
    <q-page-container>
    <router-view />
    </q-page-container>
 </q-layout>
 </template>

<script>
export default {
  name: 'LoginPageLayout',
  methods: {
    openWelcomePage () {
      this.$router.push('/')
    }
  }
}

</script>
