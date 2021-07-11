<template>
  <div class="q-pa-lg row justify-center">
    <div
      class="col"
      style="max-width: 500px"
    >
      <q-table
        v-if="isMounted"
        title="Sensors"
        :data="sensors"
        :columns="columns"
        row-key="sensorID"
        flat
      >
        <template v-slot:top>
          <q-btn
            color="orange-14"
            label="Add sensor"
            @click="onNewRow"
          />
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div v-if="props.col.name==='actions'">
            <q-btn
              dense
              color="orange-14"
              icon="edit"
              @click="onUpdateRow(props.row)"
            />
            <q-btn
              dense
              color="orange-14"
              icon="delete"
              @click="onDeleteRow(props.row)"
            />
          </div>
          <div v-else>
            {{props.row[props.col.field]}}
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
  <q-dialog
    v-if="openDialog"
    v-model="openDialog"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">
          Sensor
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          color="orange-14"
          ref="Name"
          :error="!sensor.name || sensor.name.length === 0"
          error-message="Name is required."
          label="Name"
          v-model="sensor.name"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="orange-14"
          label="OK"
          @click="onOKClick"
        />
        <q-btn
          color="orange-14"
          label="Cancel"
          @click="onCancelClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</template>
<script>
export default {
  name: 'SensorsIndex',
  data () {
    return {
      openDialog: false,
      sensor: null,
      sensorModel: {
        sensorID: null,
        name: null
      },
      isMounted: false,
      sensors: [],
      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'center',
          field: 'name',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Actions',
          align: 'left',
          field: null,
          sortable: false
        }
      ]
    }
  },
  mounted: function () {
    const collectionRef = this.$db.collection('sensors')
    collectionRef.get()
      .then((rows) => {
        rows.forEach((row) => {
          this.sensors.push(row.data())
        })
        this.isMounted = true
      })
  },
  methods: {
    onNewRow () {
      this.sensor = JSON.parse(JSON.stringify(this.sensorModel))
      this.openDialog = true
    },
    onOKClick () {
      if (!this.$refs.Name.hasError) {
        const collectionRef = this.$db.collection('sensors')
        if (this.sensor.sensorID === null) {
          collectionRef.add(this.sensor)
            .then((doc) => {
              this.sensor.sensorID = doc.id
              var docRef =
this.$db.collection('sensors').doc(doc.id)
              docRef.update({ sensorID: doc.id })
                .then((response) => {
                  this.sensor.sensorID = doc.id
                  this.sensors.push(this.sensor)
                  this.openDialog = false
                })
                .catch(function (error) {
                  console.error('Error adding document: ', error)
                })
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        } else {
          var docRef =
this.$db.collection('sensors').doc(this.sensor.sensorID)
          docRef.set(this.sensor)
            .then((response) => {
              const sensor = this.sensors.find(sensor =>
                sensor.sensorID === this.sensor.sensorID)
              if (sensor) {
                for (const attributeName in this.sensor) {
                  sensor[attributeName] =
JSON.parse(JSON.stringify(this.sensor[attributeName]))
                }
              }
              this.openDialog = false
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        }
      }
    },
    onCancelClick () {
      this.openDialog = false
    },
    onUpdateRow (sensor) {
      this.sensor = JSON.parse(JSON.stringify(this.sensorModel))
      for (const attributeName in this.sensor) {
        this.sensor[attributeName] =
 JSON.parse(JSON.stringify(sensor[attributeName]))
      }
      this.openDialog = true
    },
    onDeleteRow (row) {
      const docRef =
this.$db.collection('sensors').doc(row.sensorID)
      docRef.delete()
        .then(() => {
          const index = this.sensors.findIndex(sensor =>
            sensor.sensorID === row.sensorID)
          if (index >= 0) {
            this.sensors.splice(index, 1)
          }
        }).catch((error) => {
          console.error('Error removing document: ', error)
        })
    }
  }
}

</script>
