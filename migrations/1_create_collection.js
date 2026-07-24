const mongoose = require('mongoose');
const { Schema, model } = mongoose;
require('dotenv').config();

// ==========================================
// 1. SUB-SCHEMAS (Embedded Data Models)
// ==========================================

const LocationSchema = new Schema({
  type: { type: String, default: null },
  name: { type: String, required: true },
  nameEn: { type: String, default: null },
  imageUrl: { type: String, default: null },
  address: { type: String, required: true },
  mapUrl: { type: String, default: null },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const TimelineEventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const DressCodeImageSchema = new Schema({
  label: { type: String, required: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const GalleryImageSchema = new Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, default: null },
  order: { type: Number, default: 0 },
}, { timestamps: true });


// ==========================================
// 2. MAIN SCHEMAS & MODELS
// ==========================================

// --- USER MODEL ---
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = model('User', UserSchema);


// --- EMAIL VERIFICATION CODE MODEL ---
const EmailVerificationCodeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 }
}, { timestamps: true });

const EmailVerificationCode = model('EmailVerificationCode', EmailVerificationCodeSchema);


// --- PASSWORD RESET TOKEN MODEL ---
const PasswordResetTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date, default: null }
}, { timestamps: true });

const PasswordResetToken = model('PasswordResetToken', PasswordResetTokenSchema);


// --- INVITATION MODEL ---
const InvitationSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: null },
  category: { type: String, default: 'wedding', index: true },
  style: { type: String, default: 'elegant' },
  couple: { type: Schema.Types.Mixed, required: true }, // Json fields mapping
  hero: { type: Schema.Types.Mixed, required: true },
  story: { type: Schema.Types.Mixed, required: true },
  calendar: { type: Schema.Types.Mixed, required: true },
  rsvpSection: { type: Schema.Types.Mixed, default: null },
  timelineSection: { type: Schema.Types.Mixed, default: null },
  dressCodeSection: { type: Schema.Types.Mixed, default: null },
  weddingDate: { type: Date, required: true },
  musicUrl: { type: String, default: null },
  finalSection: { type: Schema.Types.Mixed, default: null },
  status: { 
    type: String, 
    enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED'], 
    default: 'DRAFT',
    index: true 
  },
  isPublic: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  showGuestList: { type: Boolean, default: false },
  showGuestContact: { type: Boolean, default: false },
  rejectionReason: { type: String, default: null },
  submittedAt: { type: Date, default: null },
  reviewedAt: { type: Date, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },

  // Array Embedded subdocuments (Prisma 1-to-many relations converted to embedded lists)
  locations: [LocationSchema],
  timelineEvents: [TimelineEventSchema],
  dressCodeImages: [DressCodeImageSchema],
  galleryImages: [GalleryImageSchema]
}, { timestamps: true });

const Invitation = model('Invitation', InvitationSchema);


// --- INVITATION CATEGORY MODEL ---
const InvitationCategorySchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: null },
  fields: { type: Schema.Types.Mixed, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const InvitationCategory = model('InvitationCategory', InvitationCategorySchema);


// --- INVITATION TEMPLATE MODEL ---
const InvitationTemplateSchema = new Schema({
  category: { type: String, required: true },
  style: { type: String, required: true },
  name: { type: String, required: true },
  previewUrl: { type: String, default: null },
  config: { type: Schema.Types.Mixed, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const InvitationTemplate = model('InvitationTemplate', InvitationTemplateSchema);


// --- UPLOADED IMAGE MODEL ---
const UploadedImageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  width: { type: Number, default: null },
  height: { type: Number, default: null },
  folder: { type: String, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

const UploadedImage = model('UploadedImage', UploadedImageSchema);


// --- RSVP MODEL ---
const RsvpSchema = new Schema({
  invitationId: { type: Schema.Types.ObjectId, ref: 'Invitation', required: true, index: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  attendance: { 
    type: String, 
    enum: ['ACCEPTED', 'DECLINED', 'MAYBE'], 
    default: 'ACCEPTED',
    index: true 
  },
  dietaryRestrictions: { type: String, default: null },
  guests: { type: Number, default: 0 },
  message: { type: String, default: null },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const Rsvp = model('Rsvp', RsvpSchema);


// --- CHAT ROOM PARTICIPANT SCHEMA (Embedded within ChatRoom for efficiency) ---
const ChatRoomParticipantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, default: 'member' },
  joinedAt: { type: Date, default: Date.now }
});


// --- CHAT ROOM MODEL ---
const ChatRoomSchema = new Schema({
  type: { type: String, enum: ['APPROVAL', 'SUPPORT'], required: true },
  invitationId: { type: Schema.Types.ObjectId, ref: 'Invitation', default: null },
  name: { type: String, required: true },
  description: { type: String, default: null },
  // Keeping participants array compound structure embedded within the room
  participants: [ChatRoomParticipantSchema]
}, { timestamps: true });

const ChatRoom = model('ChatRoom', ChatRoomSchema);


// --- MESSAGE MODEL ---
const MessageSchema = new Schema({
  chatRoomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['SENT', 'DELIVERED', 'READ'], default: 'SENT' }
}, { timestamps: true });

const Message = model('Message', MessageSchema);


// ==========================================
// 3. DATABASE CONNECTION & EXPORTS
// ==========================================

async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI_DEV || 'mongodb://localhost:27017/invitations_db';
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Connection error:", error.message);
    // Keep standard error trace handling here safely.
  }
}

connectDB()
// Export models and database module wrapper
const a = {
  User,
  EmailVerificationCode,
  PasswordResetToken,
  Invitation,
  InvitationCategory,
  InvitationTemplate,
  UploadedImage,
  Rsvp,
  ChatRoom,
  Message
};

export default a;