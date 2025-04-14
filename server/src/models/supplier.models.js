import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      contactPerson:{
        type:String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      itemsSupplied: [
        {
          type: String,
        },
      ],
},
{
    timestamps: true
})

export const Supplier = mongoose.model("Supplier", supplierSchema);