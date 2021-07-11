<template>
  <q-layout >
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
          SmartDirectionsSystem
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
          to="/Nearby"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="my_location" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nearby</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/User_Profile"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>User Profile</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          to="/Search"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="search" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Search</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          to="/Main_Menu"
        >
          <q-item-section avatar>
            <q-icon color="orange-14" name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Main Menu</q-item-label>
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
  name: 'SmartDirectionsSystemLayout',
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
