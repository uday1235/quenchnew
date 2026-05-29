import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const providers = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@quench.com',
    phone: '+919876543210',
    contactEmail: 'priya.sharma@quench.com',
    bio: 'Certified spa therapist with 8 years of experience in luxury wellness treatments.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@quench.com',
    phone: '+919876543211',
    contactEmail: 'rahul.verma@quench.com',
    bio: 'Senior sales professional with a proven track record in B2B and retail.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    name: 'Ananya Singh',
    email: 'ananya.singh@quench.com',
    phone: '+919876543212',
    contactEmail: 'ananya.singh@quench.com',
    bio: 'Mathematics & Science tutor for grades 6–12 with IIT background.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
  {
    name: 'Kiran Mehta',
    email: 'kiran.mehta@quench.com',
    phone: '+919876543213',
    contactEmail: 'kiran.mehta@quench.com',
    bio: 'Full-stack developer specialising in React, Next.js and Node.js.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    name: 'Dr. Sneha Patel',
    email: 'sneha.patel@quench.com',
    phone: '+919876543214',
    contactEmail: 'sneha.patel@quench.com',
    bio: 'MBBS with 10 years of general practice. Available for home consultations.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
  },
  {
    name: 'Arjun Nair',
    email: 'arjun.nair@quench.com',
    phone: '+919876543215',
    contactEmail: 'arjun.nair@quench.com',
    bio: 'Certified personal trainer & nutritionist. Specialises in weight loss and muscle gain.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80',
  },
  {
    name: 'Vikram Das',
    email: 'vikram.das@quench.com',
    phone: '+919876543216',
    contactEmail: 'vikram.das@quench.com',
    bio: 'Fast & reliable delivery across the city. Same-day delivery available.',
    image: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=200&q=80',
  },
  {
    name: 'Suresh Kumar',
    email: 'suresh.kumar@quench.com',
    phone: '+919876543217',
    contactEmail: 'suresh.kumar@quench.com',
    bio: 'Professional driver with 12 years of experience. Clean record, all India permit.',
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80',
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@quench.com',
    phone: '+919876543218',
    contactEmail: 'meera.joshi@quench.com',
    bio: 'Bridal & editorial makeup artist. Worked with top fashion magazines and weddings.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
  {
    name: 'Lakshmi Devi',
    email: 'lakshmi.devi@quench.com',
    phone: '+919876543219',
    contactEmail: 'lakshmi.devi@quench.com',
    bio: 'Experienced household helper with expertise in deep cleaning and cooking.',
    image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200&q=80',
  },
  {
    name: 'Amit Bhatt',
    email: 'amit.bhatt@quench.com',
    phone: '+919876543220',
    contactEmail: 'amit.bhatt@quench.com',
    bio: 'EdTech educator with courses in Python, Data Science and Digital Marketing.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80',
  },
  {
    name: 'Rohan Pillai',
    email: 'rohan.pillai@quench.com',
    phone: '+919876543221',
    contactEmail: 'rohan.pillai@quench.com',
    bio: 'Award-winning photographer for weddings, portraits and corporate events.',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
  },
  {
    name: 'Divya Krishnan',
    email: 'divya.krishnan@quench.com',
    phone: '+919876543222',
    contactEmail: 'divya.krishnan@quench.com',
    bio: 'Certified yoga & meditation instructor. Online and in-person sessions.',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&q=80',
  },
  {
    name: 'Sanjay Rao',
    email: 'sanjay.rao@quench.com',
    phone: '+919876543223',
    contactEmail: 'sanjay.rao@quench.com',
    bio: 'End-to-end event management for weddings, corporate events and birthdays.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
  {
    name: 'Neha Agarwal',
    email: 'neha.agarwal@quench.com',
    phone: '+919876543224',
    contactEmail: 'neha.agarwal@quench.com',
    bio: 'Interior designer with 7 years of experience in residential and commercial spaces.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
  },
];

const listings = [
  // SpaServices
  {
    title: 'Luxury Full-Body Massage',
    description: 'Indulge in a 90-minute Swedish or deep-tissue massage using premium aromatherapy oils. Relieves stress, improves circulation and leaves you completely rejuvenated. Home visits available across Mumbai.',
    imageSrc: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80',
    category: 'SpaServices',
    locationValue: 'Mumbai',
    price: 1500,
  },
  {
    title: 'Balinese Spa Experience',
    description: 'Traditional Balinese massage combined with a herbal scrub and head massage. A 2-hour ritual that harmonises mind, body and spirit. Packages for couples also available.',
    imageSrc: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    category: 'SpaServices',
    locationValue: 'Bangalore',
    price: 2200,
  },

  // SalesMen
  {
    title: 'B2B Sales Representative',
    description: 'Experienced sales professional available for product demos, client visits and lead generation. Specialises in FMCG, IT and real estate sectors. Hire by the day or month.',
    imageSrc: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    category: 'SalesMen',
    locationValue: 'Delhi',
    price: 2500,
  },
  {
    title: 'Retail Sales Executive',
    description: 'Trained retail sales staff for exhibitions, pop-up stores and product launches. Fluent in Hindi and English. Available for short-term and long-term engagements.',
    imageSrc: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    category: 'SalesMen',
    locationValue: 'Hyderabad',
    price: 1800,
  },

  // HomeTutions
  {
    title: 'IIT-Grad Maths & Science Tutor',
    description: 'One-on-one home tutoring for CBSE/ICSE students in Maths, Physics and Chemistry. Proven results — 95% of students improved by at least one grade. Flexible timings.',
    imageSrc: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    category: 'HomeTutions',
    locationValue: 'Bangalore',
    price: 800,
  },
  {
    title: 'English & Spoken Communication Tutor',
    description: 'Improve spoken English, grammar and communication skills with personalised coaching. Ideal for school students and working professionals. Online sessions also available.',
    imageSrc: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    category: 'HomeTutions',
    locationValue: 'Chennai',
    price: 600,
  },

  // WebDeveloper
  {
    title: 'React & Next.js Web Development',
    description: 'Professional full-stack development using React, Next.js, Tailwind CSS and Node.js. From landing pages to full-scale SaaS products. Clean code, fast delivery.',
    imageSrc: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    category: 'WebDeveloper',
    locationValue: 'Bangalore',
    price: 5000,
  },
  {
    title: 'WordPress & E-commerce Setup',
    description: 'Custom WordPress sites, WooCommerce stores and Shopify setups. Includes domain, hosting guidance and basic SEO. Delivered within 5 business days.',
    imageSrc: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    category: 'WebDeveloper',
    locationValue: 'Mumbai',
    price: 3500,
  },

  // HealthCare
  {
    title: 'Home Doctor Consultation',
    description: 'MBBS doctor available for home visits — general consultations, fever, infections and minor ailments. Prescription provided. Available 8 AM–9 PM, 7 days a week.',
    imageSrc: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    category: 'HealthCare',
    locationValue: 'Delhi',
    price: 700,
  },
  {
    title: 'Physiotherapy at Home',
    description: 'Certified physiotherapist for post-surgery recovery, sports injuries and chronic pain management. Bringing professional clinic-quality care to your home.',
    imageSrc: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    category: 'HealthCare',
    locationValue: 'Hyderabad',
    price: 1200,
  },

  // Fitness&Training
  {
    title: 'Personal Fitness Trainer',
    description: 'Certified personal trainer for weight loss, muscle building and general fitness. Custom workout plans and diet charts included. Morning and evening slots available.',
    imageSrc: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    category: 'Fitness&Training',
    locationValue: 'Mumbai',
    price: 1000,
  },
  {
    title: 'Yoga & Flexibility Training',
    description: 'Group or private yoga sessions for all levels — from beginners to advanced. Focus on flexibility, core strength and mindfulness. Indoor and outdoor sessions.',
    imageSrc: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    category: 'Fitness&Training',
    locationValue: 'Chennai',
    price: 700,
  },

  // DeliveryBoys
  {
    title: 'Same-Day City Delivery',
    description: 'Fast and reliable parcel delivery within the city. Two-wheeler for quick deliveries, 4-wheeler for bulk. Real-time tracking and proof of delivery provided.',
    imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'DeliveryBoys',
    locationValue: 'Bangalore',
    price: 300,
  },
  {
    title: 'Grocery & Essentials Runner',
    description: 'Personal shopper and delivery for groceries, medicines and household essentials. Contactless delivery available. Order by 10 AM for same-morning delivery.',
    imageSrc: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800&q=80',
    category: 'DeliveryBoys',
    locationValue: 'Delhi',
    price: 200,
  },

  // Drivers
  {
    title: 'Full-Day Personal Driver',
    description: 'Experienced, verified driver for full-day hire. Comfortable with city traffic, highways and outstation travel. AC vehicle also available on request.',
    imageSrc: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    category: 'Drivers',
    locationValue: 'Mumbai',
    price: 1500,
  },
  {
    title: 'Airport & Station Transfers',
    description: 'Punctual, professional driver for airport pickups and drops, railway station transfers. Flight tracking included. Available 24/7 for early or late flights.',
    imageSrc: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
    category: 'Drivers',
    locationValue: 'Hyderabad',
    price: 800,
  },

  // MakeupArtists
  {
    title: 'Bridal Makeup & Styling',
    description: 'Complete bridal package — makeup, hair styling and saree draping. Air-brush and HD makeup options available. Trial session included. Book 30 days in advance.',
    imageSrc: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
    category: 'MakeupArtists',
    locationValue: 'Delhi',
    price: 8000,
  },
  {
    title: 'Party & Event Makeup',
    description: 'Glam party makeup, smoky eyes and festive looks for any occasion. Lightweight and long-lasting formulas. Home visits across the city for groups and individuals.',
    imageSrc: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    category: 'MakeupArtists',
    locationValue: 'Chennai',
    price: 2500,
  },

  // Maids
  {
    title: 'Full-Home Deep Cleaning',
    description: 'Professional deep cleaning of your entire home — kitchen, bathrooms, bedrooms and living areas. Eco-friendly products used. 4–6 hour service with a satisfaction guarantee.',
    imageSrc: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    category: 'Maids',
    locationValue: 'Bangalore',
    price: 1200,
  },
  {
    title: 'Daily Household Help',
    description: 'Reliable daily maid for sweeping, mopping, utensil washing and basic cooking. Background verified, trained in hygiene protocols. Flexible 2–4 hour slots.',
    imageSrc: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80',
    category: 'Maids',
    locationValue: 'Mumbai',
    price: 500,
  },

  // OnlineCourses
  {
    title: 'Python & Data Science Bootcamp',
    description: 'Intensive online course covering Python basics, Pandas, data visualisation and ML fundamentals. 20 hours of live instruction + recorded sessions. Certificate provided.',
    imageSrc: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    category: 'OnlineCourses',
    locationValue: 'Bangalore',
    price: 4999,
  },
  {
    title: 'Digital Marketing Masterclass',
    description: 'Learn SEO, Google Ads, Meta Ads and email marketing from an industry expert. 15 live sessions, real campaign case studies and a LinkedIn-ready certificate.',
    imageSrc: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80',
    category: 'OnlineCourses',
    locationValue: 'Delhi',
    price: 3999,
  },

  // Photographers
  {
    title: 'Wedding Photography Package',
    description: 'Full-day wedding coverage with a 2-photographer team. 500+ edited photos, same-week delivery, online album and a printed photobook. Drone shots available.',
    imageSrc: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80',
    category: 'Photographers',
    locationValue: 'Mumbai',
    price: 25000,
  },
  {
    title: 'Corporate & Headshot Photography',
    description: 'Professional headshots and corporate event photography. Studio or on-location shoot. 10 retouched photos delivered in 48 hours. Perfect for LinkedIn and press kits.',
    imageSrc: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80',
    category: 'Photographers',
    locationValue: 'Bangalore',
    price: 3500,
  },

  // Meditation
  {
    title: 'Guided Mindfulness Meditation',
    description: 'One-on-one or group meditation sessions focusing on stress relief, focus and emotional balance. 45-minute sessions with breathing exercises and body scan techniques.',
    imageSrc: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    category: 'Meditation',
    locationValue: 'Rishikesh',
    price: 500,
  },
  {
    title: 'Corporate Wellness & Meditation',
    description: 'Workplace wellness sessions for teams — 30-minute guided meditation to boost productivity and reduce burnout. Available on-site or via Zoom. Monthly packages available.',
    imageSrc: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
    category: 'Meditation',
    locationValue: 'Bangalore',
    price: 800,
  },

  // EventManagers
  {
    title: 'Wedding Planning & Management',
    description: 'Full-service wedding planning from venue shortlisting and vendor coordination to day-of management. We handle décor, catering, photography and entertainment.',
    imageSrc: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    category: 'EventManagers',
    locationValue: 'Delhi',
    price: 50000,
  },
  {
    title: 'Birthday & Private Party Organiser',
    description: 'Theme-based birthday parties, anniversary dinners and private gatherings. Decorations, cake, entertainment and photography all arranged. Packages from 20–200 guests.',
    imageSrc: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    category: 'EventManagers',
    locationValue: 'Mumbai',
    price: 15000,
  },

  // InteriorDesigner
  {
    title: 'Home Interior Design Consultation',
    description: 'Transform your living space with expert interior design consultation. Includes mood boards, 3D renders and a detailed material list. Modular and traditional styles.',
    imageSrc: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    category: 'InteriorDesigner',
    locationValue: 'Bangalore',
    price: 5000,
  },
  {
    title: 'Office & Commercial Space Design',
    description: 'End-to-end commercial interior design — layout planning, furniture procurement, lighting and branding integration. Turnkey execution with project management.',
    imageSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    category: 'InteriorDesigner',
    locationValue: 'Hyderabad',
    price: 20000,
  },
];

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('Quench@123', 12);

  // Create provider users
  const createdUsers = await Promise.all(
    providers.map((p) =>
      prisma.user.upsert({
        where: { email: p.email },
        update: {},
        create: {
          name: p.name,
          email: p.email,
          hashedPassword,
          phone: p.phone,
          contactEmail: p.contactEmail,
          bio: p.bio,
          image: p.image,
          role: 'PROVIDER',
          isVerified: true,
          subscriptionStatus: 'active',
        },
      })
    )
  );

  console.log(`Created ${createdUsers.length} provider users`);

  // Map each listing to a provider user (round-robin by index)
  await Promise.all(
    listings.map((listing, i) =>
      prisma.listing.create({
        data: {
          ...listing,
          userId: createdUsers[i % createdUsers.length].id,
          phone: providers[i % providers.length].phone,
          contactEmail: providers[i % providers.length].contactEmail,
        },
      })
    )
  );

  console.log(`Created ${listings.length} listings`);
  console.log('Done! Login with any provider email and password: Quench@123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
