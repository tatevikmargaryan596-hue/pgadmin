import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Assuming you have defined these models elsewhere in your project
import User from "./models/User.js";
import Invitation from "./models/Invitation.js";
import InvitationCategory from "./models/InvitationCategory.js";
import InvitationTemplate from "./models/InvitationTemplate.js";
import Location from "./models/Location.js";
import TimelineEvent from "./models/TimelineEvent.js";
import DressCodeImage from "./models/DressCodeImage.js";
import GalleryImage from "./models/GalleryImage.js";

dotenv.config();

const main = async () => {
  await mongoose.connect(process.env.DATABASE_URL);

  const passwordHash = await bcrypt.hash("SaFeP@ssw0rd!", 12);

  // 1. User Upsert
  const admin = await User.findOneAndUpdate(
    { email: "admin@luxurywedding.com" },
    { password: passwordHash, role: "ADMIN" },
    { upsert: true, new: true }
  );

  // 2. Invitation Upsert
  const invitation = await Invitation.findOneAndUpdate(
    { slug: "karen-gayane-wedding" },
    {
      title: "Karen & Gayane",
      category: "wedding",
      style: "elegant",
      couple: {
        groom: "Karen",
        bride: "Gayane",
        groomEn: "KAREN",
        brideEn: "GAYANE",
      },
      hero: { image: "/uploads/hero.jpg", subtitle: "Սիրով հրավիրում ենք" },
      story: { title: "Մեր Սիրո Պատմությունը", content: "Our story..." },
      calendar: { monthName: "Օգոստոս", year: 2026 },
      weddingDate: new Date("2026-08-17T15:00:00.000Z"),
      musicUrl: "https://example.com/music.mp3",
      finalSection: { message: "..." },
      status: "PUBLISHED",
      isPublic: true,
    },
    { upsert: true, new: true }
  );

  // 3. Categories
  const categories = [
    { slug: "wedding", name: "Wedding", isActive: true },
    { slug: "birthday", name: "Birthday", isActive: true },
  ];
  for (const cat of categories) {
    await InvitationCategory.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
  }

  // 4. Templates
  await InvitationTemplate.deleteMany({});
  await InvitationTemplate.insertMany([
    { category: "wedding", style: "elegant", name: "Elegant", isActive: true },
    // ... add others
  ]);

  // 5. Relations (Reference the invitation._id)
  await Location.insertMany([
    { invitationId: invitation._id, type: 'ceremony', name: "Wedding Ceremony", address: "..." },
    { invitationId: invitation._id, type: 'reception', name: "Reception", address: "..." },
  ]);

  // Repeat for TimelineEvent, DressCodeImage, and GalleryImage similarly...

  console.log("Seed completed.");
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});