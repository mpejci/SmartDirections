const endpoint = "carCounter"

const carCounter = (app, db) => {
    app.get(`/${endpoint}`, (request, response) => {
        let res = [];
        db.collection(endpoint)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const document = {
                        id: doc.id,
                        data: doc.data()
                    }
                    res.push(document)
                })
                return response.send(res)
            })
            .catch ((error) => {
                return response.send("Error getting documents: ", error);
            })
    })
    
    app.post(`/${endpoint}`, (request, response) => {
        const data = request.body;
        console.log(data.carCounter);
        return response.send('POST metoda -> Add '+data.carCounter);
    });
    
    app.put(`/${endpoint}`, (request, response) => {
        const data = request.body;
        console.log(data.carCounter);
        return response.send('PUT metoda -> Change '+data.carCounter);
    })
    
    app.delete(`/${endpoint}`, (request, response) => {
        const data = request.body;
        console.log('Delete '+data.carCounter);
        return response.send('Delete '+data.carCounter);
    })   
 }

module.exports = {carCounter}