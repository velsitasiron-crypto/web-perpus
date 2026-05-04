const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Koneksi ke MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Terhubung ke MongoDB');
    
    // Hapus admin lama jika ada
    const deleted = await User.deleteOne({ username: 'admin' });
    console.log('⚠️ Admin lama dihapus:', deleted.deletedCount > 0 ? 'Ada' : 'Tidak ada');
    
    // Hash password secara manual
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Buat admin baru (langsung dengan password terhash)
    const admin = new User({
      username: 'admin',
      password: hashedPassword,  // Langsung pakai hash
      name: 'Admin Perpustakaan SMA',
      role: 'admin',
      class: 'Staff'
    });
    
    // Simpan ke database
    await admin.save();
    console.log('✅ Admin BERHASIL DIBUAT!');
    console.log('=================================');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('=================================');
    
    // Verifikasi
    const check = await User.findOne({ username: 'admin' });
    if (check) {
      console.log('✅ Verifikasi: Admin tersimpan');
      console.log('Password terhash:', check.password.substring(0, 20) + '...');
    }
    
    await mongoose.disconnect();
    console.log('✅ Selesai');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

createAdmin();