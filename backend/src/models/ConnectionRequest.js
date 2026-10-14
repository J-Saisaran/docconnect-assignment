const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected'],
      default: 'requested',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensures a sender cannot create duplicate requests to the same recipient
connectionRequestSchema.index({ sender: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
