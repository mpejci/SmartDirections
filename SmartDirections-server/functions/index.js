/* eslint-disable promise/no-nesting */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var admin = require("firebase-admin");

var serviceAccount = require("./smart-directions-mp499-firebase-adminsdk-h3vrs-85a2ec6803.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smart-directions-mp499.firebaseio.com "
});

const db = admin.firestore();

app.get('/hello', (request, response) => {
    return response.send('Hello world');
});

//Filter
app.get('/categoriesFilter', (request, response) => {
    let res = []
    if (typeof request.query.id === 'undefined') {
        var cRef = db.collection('categories').where('categoryName', '==', 'Vidikovci')
        cRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let document = {
                        id: doc.id,
                        data: doc.data()
                    }
                    res.push(document)
                })
                return response.send(res)
            })
            .catch((error) => {
                return response.send(
                    "Error getting documents: " + error
                )
            })
    } else {
        var docRef =
            db.collection('categories').doc(request.query.id)
        docRef.get()
            .then((doc) => {
                if (typeof doc.data() !== 'undefined') {
                    let document = {
                        id: doc.id,
                        data: doc.data()
                    }
                    return response.send(document)
                } else {
                    return response.send(
                        "Error getting document " +
                        request.query.id +
                        ": The document is undefined"
                    )
                }
            })
            .catch((error) => {
                return response.send(
                    "Error getting document " +
                    request.query.id +
                    ": " + error
                )
            })
    }
})

//filterOrder
app.get('/categoriesFilterOrder', (request, response) => {
    let res = []
    if (typeof request.query.id === 'undefined') {
        var cRef = db.collection('categories').orderBy('categoryId')
        cRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let document = {
                        id: doc.id,
                        data: doc.data()
                    }
                    res.push(document)
                })
                return response.send(res)
            })
            .catch((error) => {
                return response.send(
                    "Error getting documents: " + error
                )
            })
    } else {
        var docRef =
            db.collection('categories').doc(request.query.id)
        docRef.get()
            .then((doc) => {
                if (typeof doc.data() !== 'undefined') {
                    let document = {
                        id: doc.id,
                        data: doc.data()
                    }
                    return response.send(document)
                } else {
                    return response.send(
                        "Error getting document " +
                        request.query.id +
                        ": The document is undefined"
                    )
                }
            })
            .catch((error) => {
                return response.send(
                    "Error getting document " +
                    request.query.id +
                    ": " + error
                )
            })
    }
})


//categories
app.get('/categories', (request, response) => {
    let res = [];
    db.collection('categories')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let document = {
                    id: doc.id,
                    data: doc.data()
                }
                res.push(document)
            })
            return response.send(res)
        })
        .catch((error) => {
            return response.send("Error getting documents: ", error);
        })
})

app.post('/categories', (request, response) => {
    if (Object.keys(request.body).length) {
        db.collection('categories').doc().set(request.body)
            .then(() => {
                return response.send(
                    "Document successfully written - created!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error writing document: " + error
                )
            })
    } else {
        return response.send(
            "No post data for new document. " +
            "A new document is not created!"
        )
    }
})

app.put('/categories', (request, response) => {
    if (Object.keys(request.body).length) {
        if (typeof request.query.id !== 'undefined') {
            db.collection('categories')
                .doc(request.query.id)
                .set(request.body)
                .then(() => {
                    return response.send(
                        "Document successfully written - " +
                        "updated!"
                    )
                })
                .catch((error) => {
                    return response.send(
                        "Error writing document: " + error
                    )
                })
        } else {
            return response.send(
                "A parameter id is not set. " +
                "A document is not updated!"
            )
        }
    } else {
        return response.send(
            "No post data for new document. " +
            "A document is not updated!"
        )
    }
})

app.delete('/categories', (request, response) => {
    if (typeof request.query.id !== 'undefined') {
        db.collection('categories').doc(request.query.id).delete()
            .then(() => {
                return response.send(
                    "Document successfully deleted!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error removing document: " + error
                )
            })
    } else {
        return response.send(
            "A parameter id is not set. " +
            "A document is not deleted!"
        )
    }
})


//contents
app.get('/contents', (request, response) => {
    let res = [];
    db.collection('contents')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let document = {
                    id: doc.id,
                    data: doc.data()
                }
                res.push(document)
            })
            return response.send(res)
        })
        .catch((error) => {
            return response.send("Error getting documents: ", error);
        })
})

app.post('/contents', (request, response) => {
    if (Object.keys(request.body).length) {
        db.collection('contents').doc().set(request.body)
            .then(() => {
                return response.send(
                    "Document successfully written - created!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error writing document: " + error
                )
            })
    } else {
        return response.send(
            "No post data for new document. " +
            "A new document is not created!"
        )
    }
})

app.put('/contents', (request, response) => {
    if (Object.keys(request.body).length) {
        if (typeof request.query.id !== 'undefined') {
            db.collection('contents')
                .doc(request.query.id)
                .set(request.body)
                .then(() => {
                    return response.send(
                        "Document successfully written - " +
                        "updated!"
                    )
                })
                .catch((error) => {
                    return response.send(
                        "Error writing document: " + error
                    )
                })
        } else {
            return response.send(
                "A parameter id is not set. " +
                "A document is not updated!"
            )
        }
    } else {
        return response.send(
            "No post data for new document. " +
            "A document is not updated!"
        )
    }
})

app.delete('/contents', (request, response) => {
    if (typeof request.query.id !== 'undefined') {
        db.collection('contents').doc(request.query.id).delete()
            .then(() => {
                return response.send(
                    "Document successfully deleted!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error removing document: " + error
                )
            })
    } else {
        return response.send(
            "A parameter id is not set. " +
            "A document is not deleted!"
        )
    }
})


//reservations
app.get('/reservations', (request, response) => {
    let res = [];
    db.collection('reservations')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let document = {
                    id: doc.id,
                    data: doc.data()
                }
                res.push(document)
            })
            return response.send(res)
        })
        .catch((error) => {
            return response.send("Error getting documents: ", error);
        })
})

app.post('/reservations', (request, response) => {
    if (Object.keys(request.body).length) {
        db.collection('reservations').doc().set(request.body)
            .then(() => {
                return response.send(
                    "Document successfully written - created!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error writing document: " + error
                )
            })
    } else {
        return response.send(
            "No post data for new document. " +
            "A new document is not created!"
        )
    }
})

app.put('/reservations', (request, response) => {
    if (Object.keys(request.body).length) {
        if (typeof request.query.id !== 'undefined') {
            db.collection('reservations')
                .doc(request.query.id)
                .set(request.body)
                .then(() => {
                    return response.send(
                        "Document successfully written - " +
                        "updated!"
                    )
                })
                .catch((error) => {
                    return response.send(
                        "Error writing document: " + error
                    )
                })
        } else {
            return response.send(
                "A parameter id is not set. " +
                "A document is not updated!"
            )
        }
    } else {
        return response.send(
            "No post data for new document. " +
            "A document is not updated!"
        )
    }
})

app.delete('/reservations', (request, response) => {
    if (typeof request.query.id !== 'undefined') {
        db.collection('reservations').doc(request.query.id).delete()
            .then(() => {
                return response.send(
                    "Document successfully deleted!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error removing document: " + error
                )
            })
    } else {
        return response.send(
            "A parameter id is not set. " +
            "A document is not deleted!"
        )
    }
})


//reviews
app.get('/reviews', (request, response) => {
    let res = [];
    db.collection('reviews')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let document = {
                    id: doc.id,
                    data: doc.data()
                }
                res.push(document)
            })
            return response.send(res)
        })
        .catch((error) => {
            return response.send("Error getting documents: ", error);
        })
})

app.post('/reviews', (request, response) => {
    if (Object.keys(request.body).length) {
        db.collection('reviews').doc().set(request.body)
            .then(() => {
                return response.send(
                    "Document successfully written - created!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error writing document: " + error
                )
            })
    } else {
        return response.send(
            "No post data for new document. " +
            "A new document is not created!"
        )
    }
})

app.put('/reviews', (request, response) => {
    if (Object.keys(request.body).length) {
        if (typeof request.query.id !== 'undefined') {
            db.collection('reviews')
                .doc(request.query.id)
                .set(request.body)
                .then(() => {
                    return response.send(
                        "Document successfully written - " +
                        "updated!"
                    )
                })
                .catch((error) => {
                    return response.send(
                        "Error writing document: " + error
                    )
                })
        } else {
            return response.send(
                "A parameter id is not set. " +
                "A document is not updated!"
            )
        }
    } else {
        return response.send(
            "No post data for new document. " +
            "A document is not updated!"
        )
    }
})

app.delete('/reviews', (request, response) => {
    if (typeof request.query.id !== 'undefined') {
        db.collection('reviews').doc(request.query.id).delete()
            .then(() => {
                return response.send(
                    "Document successfully deleted!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error removing document: " + error
                )
            })
    } else {
        return response.send(
            "A parameter id is not set. " +
            "A document is not deleted!"
        )
    }
})


//users
app.get('/users', (request, response) => {
    let res = [];
    db.collection('users')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let document = {
                    id: doc.id,
                    data: doc.data()
                }
                res.push(document)
            })
            return response.send(res)
        })
        .catch((error) => {
            return response.send("Error getting documents: ", error);
        })
})

app.post('/users', (request, response) => {
    if (Object.keys(request.body).length) {
        db.collection('users').doc().set(request.body)
            .then(() => {
                return response.send(
                    "Document successfully written - created!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error writing document: " + error
                )
            })
    } else {
        return response.send(
            "No post data for new document. " +
            "A new document is not created!"
        )
    }
})

app.put('/users', (request, response) => {
    if (Object.keys(request.body).length) {
        if (typeof request.query.id !== 'undefined') {
            db.collection('users')
                .doc(request.query.id)
                .set(request.body)
                .then(() => {
                    return response.send(
                        "Document successfully written - " +
                        "updated!"
                    )
                })
                .catch((error) => {
                    return response.send(
                        "Error writing document: " + error
                    )
                })
        } else {
            return response.send(
                "A parameter id is not set. " +
                "A document is not updated!"
            )
        }
    } else {
        return response.send(
            "No post data for new document. " +
            "A document is not updated!"
        )
    }
})

app.delete('/users', (request, response) => {
    if (typeof request.query.id !== 'undefined') {
        db.collection('users').doc(request.query.id).delete()
            .then(() => {
                return response.send(
                    "Document successfully deleted!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error removing document: " + error
                )
            })
    } else {
        return response.send(
            "A parameter id is not set. " +
            "A document is not deleted!"
        )
    }
})

//6 tjedni zadatak
app.post('/setReading', (request, response) => {
    if (request.method === 'POST') {
        const data = request.body

        if (typeof data === 'undefined' || data === null ||
            typeof data.carCounterID === 'undefined' || data.carCounterID === null ||
            typeof data.carCounterSensorID === 'undefined' || data.carCounterSensorID === null ||
            typeof data.value === 'undefined' || data.value === null) {
            return response.status(400).send('The received data is not valid.')
        }
        const carCounterCollection = db.collection('carcounter')
        return carCounterCollection.where('carCounterID', '==', data.carCounterID).get()
            .then(carCounters => {
                if (carCounters.empty) {
                    return response.status(404).send('There is no car counter with ID: ' + data.carCounterID + '.')
                }
                const carCounter = carCounters.docs[0].data()
                const carCounterSensorCollection = carCounterCollection.doc(carCounter.carCounterID).collection('carcountersensor')
                return carCounterSensorCollection.where('carCounterSensorID', '==', data.carCounterSensorID).get()
                    .then(carCounterSensors => {
                        if (carCounterSensors.empty) {
                            return response.status(404).send('There is no sensor with ID: ' + data.carCounterSensorID + ' on car counter with ID: ' + data.carCounterID + '.')
                        }
                        const carCounterSensor = carCounterSensors.docs[0].data()
                        const reading = {
                            readingID: null,
                            carCounterID: carCounter.carCounterID,
                            carCounterSensorID: carCounterSensor.carCounterSensorID,
                            readingDateTime: new Date(),
                            value: data.value
                        }
                        return db.collection('readings').add(reading)
                            .then((doc) => {
                                var docRef = db.collection('readings').doc(doc.id)
                                return docRef.update({ readingID: doc.id })
                                    .then(() => {
                                        return response.status(200).send('OK.')
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                        return response.status(500).send('Error updating ID in readings collection.')
                                    })
                            })
                            .catch((error) => {
                                console.error(error)
                                return response.status(500).send('Error adding new reading in readings collection.')
                            })
                    })
                    .catch(error => {
                        console.error(error)
                        return response.status(500).send('Error reading car counter sensor collection.')
                    })
            })
            .catch(error => {
                console.error(error)
                return response.status(500).send('Error reading car counter collection.')
            })
    }
    return response.status(403).send('Forbidden.')
})

app.get('/getReadings', (request, response) => {
    let res = [];
    db.collection('readings')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let document = {
                    id: doc.id,
                    data: doc.data()
                }
                res.push(document)
            })
            return response.send(res)
        })
        .catch((error) => {
            return response.send("Error getting documents: ", error);
        })
})

app.put('/updateReading', (request, response) => {
    if (Object.keys(request.body).length) {
        if (typeof request.query.id !== 'undefined') {
            db.collection('readings')
                .doc(request.query.id)
                .set(request.body)
                .then(() => {
                    return response.send(
                        "Document successfully written - " +
                        "updated!"
                    )
                })
                .catch((error) => {
                    return response.send(
                        "Error writing document: " + error
                    )
                })
        } else {
            return response.send(
                "A parameter id is not set. " +
                "A document is not updated!"
            )
        }
    } else {
        return response.send(
            "No post data for new document. " +
            "A document is not updated!"
        )
    }
})

app.delete('/deleteReading', (request, response) => {
    if (typeof request.query.id !== 'undefined') {
        db.collection('readings').doc(request.query.id).delete()
            .then(() => {
                return response.send(
                    "Document successfully deleted!"
                )
            })
            .catch((error) => {
                return response.send(
                    "Error removing document: " + error
                )
            })
    } else {
        return response.send(
            "A parameter id is not set. " +
            "A document is not deleted!"
        )
    }
})

//git komentar

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

