// Local Modules
import  Users from "../../migrations/1_create_collection.js";
import bCrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { UsersModel, UsersStorageModel, StorageInfoModel } from '../models';
import EmailVerificationCode from "../../migrations/1_create_collection.js";


export default class UsersService {
  
  static async sendMail(name, email, text) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        // company mail
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      // company mail
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: 'Email Subject',
      text: `From ${name}, ${email}, ${text}`
    };

    return new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(`Email sent: ${info.response}`);
        }
      });
    });
  }

  
static async insertValues(data, userId) {
  const createSlug = (value) => {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
};
  const generateUniqueSlug = async (base) => {
    let candidate = base;
    let attempt = 0;
    while (attempt < 5) {
      const existing = await Users.Invitation.findOne({ slug: candidate });
      if (!existing) return candidate;
      attempt += 1;
      candidate = `${base}-${Math.random().toString(36).slice(2, 7)}`;
    }
    return `${base}-${Date.now().toString(36)}`;
  };

  const first = data.couple?.groomEn || data.couple?.groom || "celebration";
  const second = data.couple?.brideEn || data.couple?.bride || "invite";
  const year = data.weddingDate ? new Date(data.weddingDate).getFullYear() : "event";
  
  // Combine custom createSlug with fallback logic
  const slugBase = createSlug(data.title) || createSlug(`${first}-${second}-${year}`) || `invite-${Date.now().toString(36)}`;
  const slug = await generateUniqueSlug(slugBase);

  const payload = {
    ...data, // Spread original data first
    slug,
    status: "PENDING",
    isPublic: false,
    createdBy: userId || null,
    
    // Explicit mapping of relations to subdocuments
    locations: (data.locations || []).map((l, idx) => ({ ...l, order: l.order ?? idx })),
    timelineEvents: (data.timeline?.events || []).map((e, idx) => ({ ...e, order: e.order ?? idx })),
    dressCodeImages: (data.dressCode?.images || []).map((img, idx) => ({ imageUrl: img, order: idx })),
    galleryImages: (data.gallery || []).map((g, idx) => ({ ...g, order: g.order ?? idx })),
    
    // Structure nested sections
    dressCodeSection: data.dressCode || {},
    finalSection: data.final || {},
    rsvpSection: data.rsvp || { title: data.title || "RSVP" }
  };

  console.log("Creating invitation with slug:", slug);
  
  return await Users.Invitation.create({...payload});
}



  static async edit(id, payload) {
    return UsersModel.edit(id, payload);
  }

  static async getUser(usersId) {
    return UsersModel.findByUsersId(usersId);
  }

  static async getAllUsers() {
    return UsersModel.getAllUsers();
  }

  static async getValues(id) {
    return await Users.Invitation.findOne({ _id: id });
  }

  static async getCompanyDataWithLimit(category, companyName, limit) {
    return UsersModel.getCompanyDataWithLimit(category, companyName, limit);
  }

  // Storage Name
  static async getStorageName() {
    return UsersStorageModel.getStorageName();
  }

  static async addStorageName(payload) {
    return UsersStorageModel.addStorageName(payload);
  }

  // Stotrage Info
  static async deleteValues(payload) {
    return await Users.Invitation.deleteOne({ _id: payload.id });
  }

  static async updateValues(id, payload) {
    return await Users.Invitation.findByIdAndUpdate(id, payload, { new: true } );
  }

  static async getStorageInfoByCategory(users_id, branch_address, category_name) {
    return StorageInfoModel.getStorageInfoByCategory(users_id, branch_address, category_name);
  }

  static async getPrice(info) {
    return StorageInfoModel.getPrice(info);
  }
}

