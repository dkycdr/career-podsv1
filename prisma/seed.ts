import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing data
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();

  // Create skill templates
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: 'JavaScript', category: 'technical', description: 'JavaScript programming language' } }),
    prisma.skill.create({ data: { name: 'React', category: 'technical', description: 'React.js library' } }),
    prisma.skill.create({ data: { name: 'TypeScript', category: 'technical', description: 'TypeScript programming language' } }),
    prisma.skill.create({ data: { name: 'Node.js', category: 'technical', description: 'Node.js runtime' } }),
    prisma.skill.create({ data: { name: 'PostgreSQL', category: 'technical', description: 'PostgreSQL database' } }),
    prisma.skill.create({ data: { name: 'Problem Solving', category: 'soft', description: 'Problem-solving skills' } }),
    prisma.skill.create({ data: { name: 'Communication', category: 'soft', description: 'Communication skills' } }),
    prisma.skill.create({ data: { name: 'Leadership', category: 'soft', description: 'Leadership skills' } }),
    prisma.skill.create({ data: { name: 'Project Management', category: 'business', description: 'Project management' } }),
  ])

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.STUDENT,
      major: 'Computer Science',
      year: 2,
      studentId: '12345678',
      password: '$2b$12$k1gK5x5xZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', // bcrypt hashed 'password'
    }
  })

  // Add some skills to the user
  await prisma.userSkill.create({
    data: {
      userId: user.id,
      skillId: skills[0].id, // JavaScript
      level: 4,
      targetLevel: 5
    }
  })

  await prisma.userSkill.create({
    data: {
      userId: user.id,
      skillId: skills[1].id, // React
      level: 3,
      targetLevel: 5
    }
  })

  console.log('✅ Seed data created successfully!')
  console.log(`Test user: ${user.email}`)
  console.log(`Skills created: ${skills.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
