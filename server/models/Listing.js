const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Textbooks', 'Notes', 'Electronics', 'Other'],
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    courseCode: {
      type: String,
      trim: true,
      default: '',
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDonation: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    location: {
      type: String,
      trim: true,
      default: '',
    },
    university: {
      type: String,
      trim: true,
      default: '',
    },
    dropPoint: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'reserved'],
      default: 'available',
    },
    views: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

listingSchema.index({ title: 'text', description: 'text', subject: 'text', courseCode: 'text', author: 'text' });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ university: 1 });
listingSchema.index({ seller: 1 });
listingSchema.index({ isDonation: 1 });

module.exports = mongoose.model('Listing', listingSchema);
