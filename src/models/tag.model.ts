import mongoose from "mongoose";

export type TagDocument = { name: string };
const TagSchema = new mongoose.Schema({
  name: { required: true, type: String },
});
export const Tag = mongoose.model<TagDocument>("Tag", TagSchema);
