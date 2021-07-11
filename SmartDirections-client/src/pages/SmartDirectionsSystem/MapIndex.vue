<template>
  <q-page>
    <q-card>
      <q-card-section v-if="center !== null">
        <GmapMap
          :center="center"
          :zoom="7"
          map-type-id="terrain"
          style="width: 100%; height: 700px"
        >
          <GmapInfoWindow
            :options="infoOptions"
            :position="infoWindowPosition"
            :opened="infoWindowOpen"
            @closeclick="infoWindowOpen = false"
          >
            <span v-html="infoWindowContent"></span>
          </GmapInfoWindow>
          <GmapMarker
            :key="index"
            v-for="(marker, index) in markers"
            :position="marker.position"
            :clickable="true"
            @click="showInfoWindow(marker, index)"
          />
        </GmapMap>
      </q-card-section>
    </q-card>
    <q-dialog
      v-if="openCarCounterDescriptionDialog"
      v-model="openCarCounterDescriptionDialog"
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">Car Counter description</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          {{ currentCarCounter.description }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="OK"
            @click="openCarCounterDescriptionDialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-if="openReadingsDialog"
      v-model="openReadingsDialog"
      full-width
      full-height
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">
            Readings
            <div
              class="text-subtitle2"
              v-if="currentCarCounterSensor.sensor !== null"
            ></div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <LineChart :chart-data="chartData" :update="updateChart"></LineChart>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="OK" @click="closeReadings" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import LineChart from '../LineChart.js'
export default {
  name: 'MapIndex',
  data () {
    return {
      infoWindowContent: '',
      infoWindowPosition: null,
      infoWindowOpen: false,
      currentMarkerIndex: null,
      // optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      center: null,
      markers: [],
      carCounterListener: null,
      carCounterSensorListeners: [],
      currentReadingListener: null,
      carCounters: [],
      carCounterSensors: [],
      currentReadings: [],
      currentOpenedMarker: null,
      currentCarCounterID: null,
      openCarCounterDescriptionDialog: false,
      chartData: {
        labels: [],
        datasets: []
      },
      updateChart: true,
      readingsListener: null,
      openReadingsDialog: false
    }
  },
  components: {
    LineChart
  },

  computed: {
    currentCarCounter: function () {
      if (this.currentCarCounterID === null) return null
      return this.carCounters.find(
        (carCounter) => carCounter.carCounterID === this.currentCarCounterID
      )
    },
    currentCarCounterSensor: function () {
      if (
        this.currentCarCounterID === null ||
        this.currentCarCounterSensorID === null
      ) { return null }
      return this.carCounterSensors.find(
        (carCounterSensor) =>
          carCounterSensor.carCounterID === this.currentCarCounterID &&
          carCounterSensor.carCounterSensorID === this.currentCarCounterSensorID
      )
    }
  },
  mounted () {
    const vm = this
    window.openDescription = function (carCounterID) {
      vm.openDescription(carCounterID)
    }
    window.openReadings = function (carCounterID, carCounterSensorID) {
      vm.openReadings(carCounterID, carCounterSensorID)
    }
    this.carCounterListener = this.$db
      .collection('carcounter')
      .onSnapshot((carCounterSnapshot) => {
        carCounterSnapshot.docChanges().forEach((change) => {
          if (change.doc.data().carCounterID !== null) {
            this.carCounterSensorListeners.push(
              this.$db
                .collection('carcounter')
                .doc(change.doc.data().carCounterID)
                .collection('carcountersensor')
                .onSnapshot((carCounterSensorSnapshot) => {
                  carCounterSensorSnapshot.docChanges().forEach((change) => {
                    if (change.doc.data().carCounterSensorID !== null) {
                      const index = this.carCounterSensors.findIndex(
                        (carCounterSensor) =>
                          carCounterSensor.carCounterSensorID ===
                          change.doc.data().carCounterSensorID
                      )
                      if (index < 0) {
                        this.carCounterSensors.push(change.doc.data())
                      } else {
                        this.carCounterSensors.splice(
                          index,
                          1,
                          change.doc.data()
                        )
                      }
                      this.setInfoWindowContent(change.doc.data().carCounterID)
                    }
                  })
                })
            )
            let index = this.carCounters.findIndex(
              (carCounter) =>
                carCounter.carCounterID === change.doc.data().carCounterID
            )
            if (index < 0) {
              this.carCounters.push(change.doc.data())
            } else {
              this.carCounters.splice(index, 1, change.doc.data())
            }
            if (
              change.doc.data().geoPoint.Latitude !== null &&
              change.doc.data().geoPoint.Longitude !== null
            ) {
              index = this.markers.findIndex(
                (marker) =>
                  marker.carCounterID === change.doc.data().carCounterID
              )
              const marker = {
                carCounterID: change.doc.data().carCounterID,
                position: {
                  lat: change.doc.data().geoPoint.Latitude,
                  lng: change.doc.data().geoPoint.Longitude
                }
              }
              if (index < 0) {
                this.markers.push(marker)
                if (this.markers.length === 1) {
                  this.center = marker.position
                }
              } else {
                if (index === 0) {
                  this.center = marker.position
                }
                this.markers.splice(index, 1, marker)
              }
            }
            this.setInfoWindowContent(change.doc.data().carCounterID)
          }
        })
      })
    this.currentReadingListener = this.$db
      .collection('readings')
      .onSnapshot((readingSnapshot) => {
        readingSnapshot.docChanges().forEach((change) => {
          const index = this.currentReadings.findIndex(
            (currentReading) =>
              currentReading.carCounterID === change.doc.data().carCounterID &&
              currentReading.carCounterSensorID ===
                change.doc.data().carCounterSensorID
          )
          if (index < 0) {
            const date = new Date(0)
            date.setSeconds(change.doc.data().readingDateTime.seconds)
            const localeDateString = date.toLocaleDateString()
            const localeTimeString = date.toLocaleTimeString()
            const currentReading = change.doc.data()
            currentReading.localeDateString = localeDateString
            currentReading.localeTimeString = localeTimeString
            this.currentReadings.push(currentReading)
          } else {
            const date1 = new Date(0)
            date1.setSeconds(
              this.currentReadings[index].readingDateTime.seconds
            )
            const date2 = new Date(0)
            date2.setSeconds(change.doc.data().readingDateTime.seconds)
            if (date1 < date2) {
              const localeDateString = date2.toLocaleDateString()
              const localeTimeString = date2.toLocaleTimeString()
              const currentReading = change.doc.data()
              currentReading.localeDateString = localeDateString
              currentReading.localeTimeString = localeTimeString
              this.currentReadings.splice(index, 1, currentReading)
            }
          }
          this.setInfoWindowContent(change.doc.data().carCounterID)
        })
        console.log(this.currentReadings)
      })
  },
  destroyed () {
    if (this.carCounterListener !== null) {
      this.carCounterListener()
    }
    if (this.readingsListener !== null) {
      this.readingsListener()
    }
    this.carCounterSensorListeners.forEach((carCounterSensorListener) => {
      if (carCounterSensorListener !== null) {
        carCounterSensorListener()
      }
    })
    if (this.currentReadingListener !== null) {
      this.currentReadingListener()
    }
  },
  methods: {
    setInfoWindowContent (carCounterID) {
      this.currentCarCounter = this.carCounters.find(
        (carCounter) => carCounter.carCounterID === carCounterID
      )
      this.currentCarCounterID = carCounterID
      if (
        this.currentOpenedMarker !== null &&
        this.currentOpenedMarker.carCounterID === carCounterID
      ) {
        let windowContent = ''
        const index = this.carCounters.findIndex(
          (carCounter) => carCounter.carCounterID === carCounterID
        )
        if (index >= 0) {
          windowContent =
            '<strong>' + this.carCounters[index].name + '</strong>'
          if (this.carCounters[index].urlImage !== null) {
            windowContent =
              windowContent +
              '<br><img height="100" width="100" src="' +
              this.carCounters[index].urlImage +
              '" alt="Meteo station image">'
          }
          windowContent =
            windowContent +
            "<br><button onclick=\"openDescription('" +
            carCounterID +
            "')\">Description</button>"
        }
        const carCounterSensors = this.carCounterSensors.filter(
          (carCounterSensor) => carCounterSensor.carCounterID === carCounterID
        )
        if (carCounterSensors.length > 0) {
          windowContent = windowContent + '<hr>'
        }
        carCounterSensors.forEach((carCounterSensor) => {
          windowContent =
            windowContent +
            "<p><button onclick=\"openReadings('" +
            carCounterID +
            "', '" +
            carCounterSensor.carCounterSensorID +
            "')\">Readings</button> " +
            carCounterSensor.sensor.name
          windowContent = windowContent + '</p>'
        })

        this.infoWindowContent = windowContent
      }
    },
    openDescription (carCounterID) {
      if (typeof this.currentCarCounter !== 'undefined') {
        this.openCarCounterDescriptionDialog = true
      }
    },
    showInfoWindow (marker, index) {
      this.currentOpenedMarker = marker
      this.infoWindowPosition = marker.position
      this.infoWindowContent = marker.infoText
      this.setInfoWindowContent(marker.carCounterID)
      // check if its the same marker that was selected if yes toggle
      if (this.currentMarkerIndex === index) {
        this.infoWindowOpen = !this.infoWindowOpen
      } else {
        // if different marker set infowindow to open and reset current marker index
        this.infoWindowOpen = true
        this.currentMarkerIndex = index
      }
    },
    openReadings (carCounterID, carCounterSensorID) {
      this.currentCarCounterSensorID = carCounterSensorID
      this.readings = []

      this.chartData = {
        labels: [],
        datasets: [
          {
            label: 'Readings',
            data: []
          }
        ]
      }
      this.readingsListener = this.$db
        .collection('readings')
        .where('carCounterID', '==', carCounterID)
        .where('carCounterSensorID', '==', carCounterSensorID)
        .orderBy('readingDateTime')
        .onSnapshot((readingSnapshot) => {
          readingSnapshot.docChanges().forEach((change) => {
            if (
              typeof change.doc.data().readingID !== 'undefined' &&
              change.doc.data().readingID !== null
            ) {
              const date = new Date(0)
              date.setSeconds(change.doc.data().readingDateTime.seconds)
              const localeDateString = date.toLocaleDateString()
              const localeTimeString = date.toLocaleTimeString()
              const reading = change.doc.data()
              reading.localeDateString = localeDateString
              reading.localeTimeString = localeTimeString
              this.chartData.labels.push(
                localeDateString + '[' + localeTimeString + ']'
              )
              this.chartData.datasets[0].data.push(reading.value)
            }
          })
          this.updateChart = !this.updateChart
        })
      this.openReadingsDialog = true
    },
    closeReadings () {
      if (this.readingsListener !== null) {
        this.readingsListener()
      }
      this.openReadingsDialog = false
    }
  }
}
</script>
