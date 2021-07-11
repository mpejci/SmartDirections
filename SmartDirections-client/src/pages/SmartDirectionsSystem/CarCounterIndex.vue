<template>
  <div class="q-pa-lg row justify-center">
    <div
      class="col"
      style="max-width: 900px"
    >
      <div class="q-pb-md">
        <q-btn
          color="orange-14"
          label="Add car counter"
          @click="onNewCarCounter"
        />
      </div>
      <q-list bordered>
        <div
          v-for="(carCounter, carCounterIndex) in carCounters"
          :key="carCounter.carCounterID"
        >
          <q-expansion-item
            group="carCounters"
            :label="carCounter.name"
            :default-opened="carCounterIndex === 0"
            header-class="bg-orange-14 text-bold text-white text-uppercase"
            dense
          >
            <q-card>
              <q-card-actions align="right">
                <q-btn
                  dense
                  color="orange-14"
                  icon="edit"
                  @click="onUpdateCarCounter(carCounter)"
                />
                <q-btn
                  dense
                  color="orange-14"
                  icon="delete"
                  @click="onDeleteCarCounter(carCounter)"
                />
              </q-card-actions>
              <q-separator />
              <q-card-section>
                <div class="row">
                  <div class="col-6 q-pr-xs">
                    <q-input
                      readonly
                      dense
                      label="ID"
                      v-model="carCounter.carCounterID"
                    />
                    <q-input
                      readonly
                      dense
                      label="Description"
                      v-model="carCounter.description"
                    />
                    <div class="row">
                      <div class="col">
                        <q-input
                          readonly
                          dense
                          label="Latitude"
                          v-model="carCounter.geoPoint.Latitude"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          readonly
                          dense
                          label="Longitude"
                          v-model="carCounter.geoPoint.Longitude"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-6 q-pl-xs">
                    <div class="text-center q-pa-xs">
                      <croppa
                        ref="croppa"
                        crossOrigin="anonymous"
                        :width="150"
                        :height="150"
                        :accept="'image/*'"
                        :prevent-white-space="true"
                        :placeholder-font-size="18"
                        :file-size-limit="1 * 1024 * 1024"
                        :quality="1"
                        :remove-button-color="'red'"
                        :remove-button-size="30"
                        placeholder="Choose image"
                        :disable-drag-to-move="!uploadButton"
                        v-model="carCounter.photo"
                        :initial-image="carCounter.urlImage?carCounter.urlImage:initialImage?initialImage:null"
                        @image-remove="removeImage(carCounter)"
                        @file-type-mismatch="onError('File type mismatch')"
                        @file-size-exceed="onError('File size exceed')"
                        @file-choose="uploadButton=true"
                      >
                      </croppa>
                      <q-btn
                        flat
                        color="orange-14"
                        v-if="uploadButton"
                        class="full-width"
                        @click="uploadCroppedImage(carCounter)"
                        label="Set image"
                        icon="image"
                      />
                      <q-btn
                        flat
                        color="orange-14"
                        v-if="!carCounter.urlImage && $q.platform.is.mobile"
                        class="full-width"
                        @click="openCamera(carCounter)"
                        icon="camera_alt"
                      />
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-card
                  flat
                  bordered
                >
                  <q-card-section>
                    <div class="text-bold ">
                      Sensors
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <div class="q-pb-md">
                      <q-btn
                        color="orange-14"
                        label="Add sensor"
                        @click="onNewCarCounterSensor(carCounter)"
                      />
                    </div>
                    <q-list bordered>
                      <div
                        v-for="(carCounterSensor, carCounterSensorIndex) in carCounter.carCounterSensors"
                        :key="carCounterSensor.carCounterSensorID"
                      >
                        <q-expansion-item
                          group="carCounterSensors"
                          :label="carCounterSensor.sensor.name"
                          :default-opened="carCounterSensorIndex === 0"
                          header-class="bg-orange-11 text-bold text-uppercase"
                          dense
                        >
                          <q-card>
                            <q-separator />
                            <q-card-section>
                              <div class="row">
                                <div class="col-6 q-pr-xs">
                                  <q-input
                                    v-if="carCounterSensor.sensor"
                                    label="ID"
                                    readonly
                                    dense
                                    v-model="carCounterSensor.sensor.sensorID"
                                  />
                                </div>
                              </div>
                            </q-card-section>
                          </q-card>
                        </q-expansion-item>
                      </div>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
        </div>
      </q-list>
    </div>
    <q-dialog
      v-if="openCarCounterDialog"
      v-model="openCarCounterDialog"
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">
            Car counter
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            color="orange-14"
            ref="Name"
            :error="!carCounter.name || carCounter.name.length === 0"
            error-message="Name is required."
            label="Name"
            v-model="carCounter.name"
          />
          <q-input
            color="orange-14"
            label="Description"
            type="textarea"
            v-model="carCounter.description"
          />
          <div class="row">
            <div class="col">
              <q-input
                color="orange-14"
                ref="Latitude"
                :error="!carCounter.geoPoint.Latitude && carCounter.geoPoint.Latitude !== 0"
                error-message="Latitude is required."
                label="Latitude"
                type="number"
                v-model.number="carCounter.geoPoint.Latitude"
              />
            </div>
            <div class="col">
              <q-input
                color="orange-14"
                ref="Longitude"
                :error="!carCounter.geoPoint.Longitude && carCounter.geoPoint.Longitude !== 0"
                error-message="Longitude is required."
                label="Longitude"
                type="number"
                v-model.number="carCounter.geoPoint.Longitude"
              />
            </div>
          </div>
          <div class="row" v-if="$q.platform.is.mobile">
                        <div class="col">
                          <q-btn
                          dense
                          class="full-width"
                          color="orange-14"
                          icon="location_searching"
                          label="Search location"
                          @click="getGeolocation(carCounter)"
                          />
                      </div>
                      </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="orange-14"
            label="OK"
            @click="onOKCarCounterDialogClick"
          />
          <q-btn
            color="orange-14"
            label="Cancel"
            @click="onCancelCarCounterDialogClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-if="openCarCounterSensorDialog"
      v-model="openCarCounterSensorDialog"
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">
            Sensor
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-select
            color="orange-14"
            label="Sensor"
            dense
            v-model="carCounterSensor.sensor"
            :options="sensors"
            option-value="sensorID"
            option-label="name"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="orange-14"
            label="OK"
            @click="onOKCarCounterSensorDialogClick"
          />
          <q-btn
            color="orange-14"
            label="Cancel"
            @click="onCancelCarCounterSensorDialogClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { component as croppa } from 'vue-croppa'

export default {
  name: 'CarCountersIndex',
  components: {
    croppa
  },
  data () {
    return {
      isMounted: false,
      openCarCounterDialog: false,
      openCarCounterSensorDialog: false,
      carCounters: [],
      carCounter: null,
      carCounterModel: {
        carCounterID: null,
        geoPoint: {
          Latitude: null,
          Longitude: null
        },
        name: null,
        description: null,
        urlImage: null
      },
      currentCarCounter: null,
      carCounterSensor: null,
      carCounterSensorModel: {
        carCounterID: null,
        carCounterSensorID: null,
        sensor: null
      },
      uploadButton: false,
      initialImage: null,
      sensors: []
    }
  },
  mounted: async function () {
    let collectionRef = this.$db.collection('carcounter')
    await collectionRef.get()
      .then((carCounters) => {
        carCounters.forEach(async (carCounter) => {
          const carCounterFromDB = carCounter.data()
          this.$set(carCounterFromDB, 'carCounterSensors', [])
          this.$set(carCounterFromDB, 'photo', {})
          const subCollectionRef = collectionRef.doc(carCounter.data().carCounterID).collection('carcountersensor')
          await subCollectionRef.get()
            .then((carCounterSensors) => {
              const carCounterSensorsFromDB = []
              carCounterSensors.forEach((carCounterSensor) => {
                carCounterSensorsFromDB.push(carCounterSensor.data())
              })
              carCounterFromDB.carCounterSensors = carCounterSensorsFromDB
              this.carCounters.push(carCounterFromDB)
              this.isMounted = true
            })
        })
      })
    collectionRef = this.$db.collection('sensors')
    collectionRef.get()
      .then((sensors) => {
        sensors.forEach((sensor) => {
          this.sensors.push(sensor.data())
        })
      })
  },
  methods: {
    onNewCarCounter () {
      this.carCounter = JSON.parse(JSON.stringify(this.carCounterModel))
      this.openCarCounterDialog = true
    },
    onNewCarCounterSensor (carCounter) {
      this.currentCarCounter = carCounter
      this.carCounterSensor = JSON.parse(JSON.stringify(this.carCounterSensorModel))
      this.carCounterSensor.carCounterID = this.currentCarCounter.carCounterID
      this.openCarCounterSensorDialog = true
    },
    onOKCarCounterDialogClick () {
      if (!this.$refs.Name.hasError &&
          !this.$refs.Latitude.hasError &&
          !this.$refs.Longitude.hasError) {
        const collectionRef = this.$db.collection('carcounter')
        if (this.carCounter.carCounterID === null) {
          collectionRef.add(this.carCounter)
            .then((doc) => {
              var docRef = this.$db.collection('carcounter').doc(doc.id)
              docRef.update({ carCounterID: doc.id })
                .then((response) => {
                  this.carCounter.carCounterID = doc.id
                  this.$set(this.carCounter, 'carCounterSensors', [])
                  this.carCounters.push(this.carCounter)
                  this.openCarCounterDialog = false
                })
                .catch(function (error) {
                  console.error('Error adding document: ', error)
                })
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        } else {
          var docRef = this.$db.collection('carcounter').doc(this.carCounter.carCounterID)
          docRef.set(this.carCounter)
            .then((response) => {
              const carCounter = this.carCounters.find(carCounter => carCounter.carCounterID === this.carCounter.carCounterID)
              if (carCounter) {
                for (const attributeName in this.carCounter) {
                  carCounter[attributeName] = JSON.parse(JSON.stringify(this.carCounter[attributeName]))
                }
              }
              this.openCarCounterDialog = false
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        }
      }
    },
    onOKCarCounterSensorDialogClick () {
      const collectionRef = this.$db.collection('carcounter').doc(this.currentCarCounter.carCounterID).collection('carcountersensor')
      if (this.carCounterSensor.carCounterSensorID === null) {
        collectionRef.add(this.carCounterSensor)
          .then((doc) => {
            var docRef = collectionRef.doc(doc.id)
            docRef.update({ carCounterSensorID: doc.id })
              .then((response) => {
                this.carCounterSensor.carCounterSensorID = doc.id
                this.currentCarCounter.carCounterSensors.push(this.carCounterSensor)
                this.openCarCounterSensorDialog = false
              })
              .catch(function (error) {
                console.error('Error adding document: ', error)
              })
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
      } else {
        var docRef = this.$db.collection('carcounter').doc(this.currentCarCounter.carCounterID).collection('carcountersensor').doc(this.carCounterSensor.carCounterSensorID)
        docRef.set(this.carCounterSensor)
          .then((response) => {
            const carCounterSensor = this.currentCarCounter.carCounterSensors.find(carCounterSensor => carCounterSensor.carCounterSensorID === this.carCounterSensor.carCounterSensorID)
            if (carCounterSensor) {
              for (const attributeName in this.carCounterSensor) {
                carCounterSensor[attributeName] = JSON.parse(JSON.stringify(this.carCounterSensor[attributeName]))
              }
            }
            this.openCarCounterSensorDialog = false
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
      }
    },
    onCancelCarCounterDialogClick () {
      this.openCarCounterDialog = false
    },
    onCancelCarCounterSensorDialogClick () {
      this.openCarCounterSensorDialog = false
    },
    onUpdateCarCounter (carCounter) {
      this.carCounter = JSON.parse(JSON.stringify(this.carCounterModel))
      for (const attributeName in this.carCounter) {
        this.carCounter[attributeName] = JSON.parse(JSON.stringify(carCounter[attributeName]))
      }
      this.openCarCounterDialog = true
    },
    onDeleteCarCounter (row) {
      const docRef = this.$db.collection('carcounter').doc(row.carCounterID)
      row.carCounterSensors.forEach((carCounterSensor) => {
        docRef.collection('carcountersensor').doc(carCounterSensor.carCounterSensorID).delete()
          .then(() => {
            console.log('Document in subcollection deleted: ', carCounterSensor.carCounterSensorID)
          }).catch(error => {
            console.error('Error deleting document in subcollection: ', error)
          })
      })
      docRef.delete()
        .then(() => {
          const index = this.carCounters.findIndex(carCounter => carCounter.carCounterID === row.carCounterID)
          if (index >= 0) {
            this.carCounters.splice(index, 1)
          }
          if (row.urlImage) {
            const storageRef = this.$storage.ref()
            const imageRef = storageRef.child(row.carCounterID)
            imageRef.delete().then(() => {
            }).catch((error) => {
              console.error('Error deleting image: ', error)
            })
          }
        }).catch((error) => {
          console.error('Error removing document: ', error)
        })
    },
    onError (errorMessage) {
      this.uploadButton = false
      this.$q.notify({
        message: errorMessage,
        icon: 'warning',
        color: 'negative',
        position: 'bottom',
        timeout: 3000
      })
    },
    uploadCroppedImage (carCounter) {
      if (!carCounter.photo.hasImage()) {
        alert('no image to upload')
        return
      }
      carCounter.photo.generateBlob(
        blob => {
          console.log(blob)
          if (blob) {
            console.log('uploadCroppedImage')
            const storageRef = this.$storage.ref()
            const imageRef = storageRef.child(carCounter.carCounterID)
            imageRef.put(blob)
              .then((snapshot) => {
                snapshot.ref.getDownloadURL()
                  .then((downloadURL) => {
                    var docRef = this.$db.collection('carcounter').doc(carCounter.carCounterID)
                    docRef.update({ urlImage: downloadURL })
                      .then((response) => {
                        carCounter.urlImage = downloadURL
                        this.initialImage = null
                        this.uploadButton = false
                      })
                      .catch(function (error) {
                        console.error('Error adding document: ', error)
                      })
                  })
                  .catch(error => {
                    console.error('Get download URL: ', error)
                  })
              })
              .catch((error) => {
                console.error('Uploading file: ', error)
              })
          } else {
            this.onError('File type mismatch')
          }
        },
        'image/jpeg',
        0.8
      ) // 80% compressed jpeg file
    },
    removeImage (carCounter) {
      this.uploadButton = false
      if (carCounter.urlImage) {
        const storageRef = this.$storage.ref()
        const imageRef = storageRef.child(carCounter.carCounterID)
        imageRef.delete().then(() => {
          var docRef = this.$db.collection('carcounter').doc(carCounter.carCounterID)
          docRef.update({ urlImage: null })
            .then((response) => {
              carCounter.urlImage = null
            })
            .catch((error) => {
              console.error('Error adding document: ', error)
            })
        }).catch((error) => {
          console.error('Error deleting image: ', error)
        })
      }
    },
    openCamera (carCounter) {
      if (typeof navigator.camera !== 'undefined') {
        const onSuccess = (imageData) => {
          const image = new Image()
          // Notice: it's necessary to set "crossorigin" attribute
          // before "src" attribute.
          image.setAttribute('crossOrigin', 'anonymous')
          image.src = 'data:image/jpeg;base64,' + imageData
          this.initialImage = image
          carCounter.photo.refresh()
          this.uploadButton = true
        }
        // onError Callback receives a PositionError object
        //
        const onError = (error) => {
          if (typeof error.code !== 'undefined') {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n')
          }
        }
        navigator.camera.getPicture(onSuccess, onError, {
          destinationType: navigator.camera.DestinationType.DATA_URL,
          encodingType: navigator.camera.EncodingType.JPEG
        })
      }
    },
    getGeolocation (carCounter) {
      const onSuccess = function (position) {
        carCounter.geoPoint.Latitude = position.coords.latitude
        carCounter.geoPoint.Longitude = position.coords.longitude
        // alert('Latitude: ' + position.coords.latitude + '\n' +
        // 'Longitude: ' + position.coords.longitude + '\n' +
        // 'Altitude: ' + position.coords.altitude + '\n' +
        // 'Accuracy: ' + position.coords.accuracy + '\n' +
        // 'Altitude Accuracy: ' + position.coords.altitudeAccuracy +
        // '\n' +
        // 'Heading: ' + position.coords.heading + '\n' +
        // 'Speed: ' + position.coords.speed + '\n' +
        // 'Timestamp: ' + position.timestamp + '\n')
      }
      // onError Callback receives a PositionError object
      //
      const onError = function (error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n')
      }
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 5000, maximumAge: 3000, enableHighAccuracy: true })
    }
  }
}
</script>
