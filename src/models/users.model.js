՝import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    adminname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt և updatedAt
  }
);

// ===== Static Methods =====

adminSchema.statics.findByAdminName = function (adminname) {
  return this.findOne({ adminname });
};

adminSchema.statics.create = function (email, password) {
  return this.create({email, password});
};

adminSchema.statics.getById = function (id) {
  return this.findById(id);
};
