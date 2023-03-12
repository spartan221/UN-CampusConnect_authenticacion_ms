import mongoose from 'mongoose';


mongoose.connect("mongodb://127.0.0.1/UN-CampusConnect_autenticacion_db")
    .then(db => console.log('MongoDb is working'))
    .catch(error => console.log(error));