import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    speedKph: { type: Number, required: true, min: 1 },
    fuelCostPerKm: { type: Number, default: 0.15 }
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
