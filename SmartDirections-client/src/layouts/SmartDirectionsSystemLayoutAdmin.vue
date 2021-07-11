<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar class="bg-orange-14">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          SmartDirectionsSystemAdmin
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item
          clickable
          to="/Sensors"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="settings_input_antenna" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sensors</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          to="/Car_Counter"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="directions_car" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Car Counter</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
    <q-item
          clickable
          to="/Map"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="map" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Map</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          to="/Chart"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Data Chart</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          @click="logout"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="power_settings_new" />
          </q-item-section>
          <q-item-section>
            <q-item-label>LogOut</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'SmartDirectionsSystemLayoutAdmin',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    logout () {
      this.$auth.signOut()
        .then(() => {
          this.$router.push('/Login')
        })
    },
    home () {
      this.$router.push('/')
    }
  }
}
</script>
