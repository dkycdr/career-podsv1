import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Hapus data existing jika ada
  await prisma.user.deleteMany();

  // Buat user contoh untuk testing login
  await prisma.user.create({
    data: {
      email: 'dwiky.candra@student.president.ac.id',
      name: 'Dwiky Candra',
      role: UserRole.STUDENT,
      major: 'Computer Science',
      year: 2023,
      studentId: '12345678'
    }
  })

  console.log('✅ Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
