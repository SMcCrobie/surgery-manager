import mongoose from 'mongoose';

const surgerySchema = new mongoose.Schema({
    dateTime: { type: Date, required: true },
    surgeryType: { type: String, required: true },
    surgeon: { type: String, required: true },
    patient: {
        name: { type: String, required: true },
        birthdate: { type: Date},
        age: { type: Number}
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

const Surgery = mongoose.model('Surgery', surgerySchema);
export default Surgery;