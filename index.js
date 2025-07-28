// index.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB(); // 👈 الاتصال بقاعدة البيانات
  console.log(`🚀 Server running on port ${PORT}`);
});
