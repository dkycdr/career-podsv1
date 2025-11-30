/**
 * Knowledge Base untuk Career Pods AI Assistant
 * Berisi informasi tentang President University dan Career Pods Platform
 * 
 * Career Pods dikembangkan oleh: Dwiky Candra
 * Status: Mahasiswa President University
 * Major: Information Technology
 * Faculty: Faculty of Computer Science
 * Batch: 2025
 */

export const KNOWLEDGE_BASE = `
# 🎓 PRESIDENT UNIVERSITY

President University adalah universitas swasta terkemuka di Indonesia yang berlokasi di Cikarang, Jawa Barat. 
Universitas ini didirikan dengan fokus pada pendidikan berkualitas tinggi dan pengembangan karakter mahasiswa.

## Visi & Misi
- Visi: Menjadi universitas pilihan yang menghasilkan lulusan unggul dan berkarakter
- Misi: Menyediakan pendidikan berkualitas dengan fokus pada career development dan soft skills

## Program Studi Utama
- Teknik Informatika
- Manajemen
- Akuntansi
- Teknik Mesin
- Teknik Elektro
- Ilmu Komunikasi
- Desain Grafis
- Dan program lainnya

## Fasilitas
- Campus modern dengan teknologi terkini
- Library dengan koleksi lengkap
- Lab komputer dan lab teknik
- Sports facilities dan student center
- Accommodation facilities

---

# 🚀 CAREER PODS PLATFORM

Career Pods adalah platform inovatif yang dirancang untuk membantu mahasiswa President University dalam pengembangan karir.
Platform ini menghubungkan mahasiswa dengan mentor, opportunities, dan resources untuk career development.

## 👨‍💻 Developer & Creator

**Career Pods dikembangkan oleh:**
- **Nama**: Dwiky Candra
- **Status**: Mahasiswa President University
- **Major**: Information Technology
- **Faculty**: Faculty of Computer Science
- **Batch**: 2025
- **Tujuan**: Membantu sesama mahasiswa President University mencapai career goals mereka

Ini adalah web project yang dibuat oleh mahasiswa untuk mahasiswa! 🎉

## Fitur Utama Career Pods

### 1. Mentorship Program
- Connect dengan mentor berpengalaman dari berbagai industri
- Regular mentoring sessions untuk guidance career
- 1-on-1 mentoring untuk personalized support
- Group mentoring untuk peer learning

### 2. Skill Development
- Track skill progress dan development goals
- Add skills yang ingin dikuasai
- Skill matching dengan career paths
- Learning resources untuk setiap skill
- Progress monitoring dashboard

### 3. Career Exploration
- Discover berbagai career paths dan industries
- Explore career options berdasarkan interest dan skills
- Career advice dari professionals
- Industry insights dan trends
- Salary information dan job market data

### 4. Meeting & Events
- Career talks dari industry experts
- Networking events dengan alumni dan professionals
- Workshop untuk skill enhancement
- Job fairs dan recruitment events
- Webinar series tentang career topics

### 5. Onboarding Process
Mahasiswa baru harus melakukan onboarding dengan langkah:
- Personal Information: Isi biodata lengkap
- Career Interests: Pilih industri dan role yang diminati
- Skills & Goals: Input skills yang dimiliki dan goals
- Availability: Tentukan ketersediaan untuk mentoring
- Review: Verifikasi semua informasi

### 6. Pod Materials
- Learning resources dan study materials
- Career development guides
- Resume dan cover letter templates
- Interview preparation materials
- Industry-specific resources

### 7. Dashboard Features
- View upcoming meetings dan mentoring sessions
- Track skill development progress
- See recommended career paths
- View your activity and achievements
- Connect dengan peers dan mentors

## Dashboard Widgets
- **Upcoming Meetings**: Lihat jadwal mentoring dan events mendatang
- **Skill Progress**: Monitor perkembangan skill yang sedang dipelajari
- **Career Recommendations**: Lihat career paths yang sesuai dengan profile
- **Recent Activity**: Track aktivitas terakhir di platform
- **Mentorship Status**: Lihat status mentorship journey

## User Roles

### Student
- Akses semua fitur platform
- Bisa request mentoring dari mentors
- Attend events dan workshops
- Track skill development
- Explore career paths

### Mentor
- Provide mentoring ke students
- Share expertise dan insights
- Conduct mentoring sessions
- Guide student career development
- Attend mentorship events

### Admin
- Manage platform
- Manage users dan roles
- Create dan manage events
- Monitor platform activity
- Generate reports

## Benefits untuk Mahasiswa
1. **Career Guidance**: Dapatkan guidance dari professionals berpengalaman
2. **Skill Development**: Develop dan track skills yang relevan dengan industry
3. **Networking**: Build connections dengan mentors, peers, dan professionals
4. **Opportunities**: Access job opportunities dan internship programs
5. **Personal Growth**: Grow professionally dan personally
6. **Industry Insights**: Learn tentang latest trends dalam industry
7. **Confidence Building**: Prepare untuk career challenges
8. **Peer Support**: Learn dari peers dan collaborative environment

## Tips untuk Maksimalkan Career Pods

### Untuk Students:
1. **Complete Onboarding**: Isi semua informasi dengan akurat dan lengkap
2. **Set Clear Goals**: Define career goals yang spesifik dan measurable
3. **Actively Seek Mentorship**: Jangan ragu untuk request mentoring
4. **Attend Events**: Participate dalam events dan workshops
5. **Track Progress**: Monitor skill development dan career progress
6. **Network Actively**: Build relationships dengan mentors dan peers
7. **Prepare for Meetings**: Come prepared untuk mentoring sessions
8. **Give Feedback**: Provide feedback untuk continuous improvement

### Untuk Mentors:
1. **Be Available**: Make yourself available untuk students
2. **Share Experiences**: Share relevant experiences dan insights
3. **Give Constructive Feedback**: Provide actionable feedback
4. **Guide Career Path**: Help students identify suitable career paths
5. **Build Long-term Relationships**: Focus pada long-term mentorship

## Contact & Support
- Email: support@careerpods.presidentuniversity.ac.id
- Website: careerpods.presidentuniversity.ac.id
- Campus: President University, Cikarang, Jawa Barat
- Working Hours: Monday - Friday, 09:00 - 17:00 WIB

---

# QUICK ANSWERS

## Apa itu Career Pods?
Career Pods adalah platform digital untuk pengembangan karir mahasiswa President University. Platform ini menyediakan mentorship, skill tracking, career exploration, dan networking opportunities.

## Bagaimana cara menggunakan Career Pods?
1. Login dengan akun President University kamu
2. Complete onboarding profile
3. Explore features: skill tracking, mentorship, career exploration
4. Connect dengan mentors dan peers
5. Attend events dan workshops
6. Track progress menuju career goals kamu

## Apa saja skills yang bisa di-track?
Semua jenis skills bisa di-track, seperti: programming, leadership, communication, project management, design, dll.

## Bagaimana cara request mentoring?
1. Go to Mentorship section
2. Browse available mentors
3. Click "Request Mentorship"
4. Set preferred meeting schedule
5. Wait for mentor approval

## Kapan mentoring meetings biasanya dilakukan?
Mentoring dapat dijadwalkan sesuai ketersediaan student dan mentor, biasanya di sela-sela jam kuliah atau akhir pekan.

## Apa saja jenis events yang ada di Career Pods?
- Career talks dari industry experts
- Networking events
- Workshops untuk skill enhancement
- Job fairs dan recruitment events
- Webinar series
- Mentorship training

## Apakah gratis menggunakan Career Pods?
Ya, Career Pods adalah platform gratis untuk semua mahasiswa President University.

## Bagaimana kalau ada kendala teknis?
Contact tim support melalui email support@careerpods.presidentuniversity.ac.id atau hubungi admin di kampus.
`;

export const getContextualInfo = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Return lebih banyak context jika query terkait Career Pods
  if (
    lowerQuery.includes('career pods') ||
    lowerQuery.includes('platform') ||
    lowerQuery.includes('mentorship') ||
    lowerQuery.includes('skill') ||
    lowerQuery.includes('university') ||
    lowerQuery.includes('presiden') ||
    lowerQuery.includes('onboarding') ||
    lowerQuery.includes('event') ||
    lowerQuery.includes('mentor')
  ) {
    return KNOWLEDGE_BASE;
  }
  
  return '';
};
