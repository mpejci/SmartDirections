import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB4dHef5W9nIUMWiY3Kz6HvFN2BdMxTqKw'
    // libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    // If you want to set the version, you can do so:
    // v: '3.26',
  },

  // If you intend to programmatically custom event listener code
  // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed='someFunc'>`)
  // you might need to turn this on.
  // autobindAllEvents: false,

  // If you want to manually install components, e.g.
  // import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  // Vue.component('GmapMarker', GmapMarker)
  // then set installComponents to 'false'.
  // If you want to automatically install all the components this property must be set to 'true':
  installComponents: true
})

const firebaseConfig = {
  apiKey: 'AIzaSyDNq-N2-oUxJojYkCtarJu1NTlGy9JP3nQ',
  authDomain: 'smart-directions-mp499.firebaseapp.com',
  databaseURL: 'https://smart-directions-mp499-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'smart-directions-mp499',
  storageBucket: 'smart-directions-mp499.appspot.com',
  messagingSenderId: '566070222642',
  appId: '1:566070222642:web:96c207717187e7e626412b',
  measurementId: 'G-JBRJ2S4LP6'
}

firebase.initializeApp(firebaseConfig)

export default ({ Vue }) => {
  Vue.prototype.$auth = firebase.auth()
  Vue.prototype.$db = firebase.firestore()
  Vue.prototype.$storage = firebase.storage()
}
