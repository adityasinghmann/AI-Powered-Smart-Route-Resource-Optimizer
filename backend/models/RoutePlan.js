import mongoose from 'mongoose';

const routePlanSchema = new mongoose.Schema(
  {
    input: { type: Object, required: true },
    output: { type: Object, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.RoutePlan || mongoose.model('RoutePlan', routePlanSchema);
