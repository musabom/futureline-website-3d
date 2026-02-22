'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock, MapPin, Users, Phone, Mail, Menu, X,
  Mountain, Waves, Building2, Tent, Castle, Sun,
  MessageCircle, ChevronLeft, ChevronRight, Star, Send,
  Compass, CheckCircle
} from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/96896532326';
const TRIPADVISOR_URL = 'https://www.tripadvisor.com/Attraction_Review-g1940497-d33120883-Reviews-Authentic_Omani_Adventures_Private_Guided_Tours_Across_Oman-Muscat_Muscat_Gover.html';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Tours', href: '#tours' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const itinerarySummary = [
  { day: 1, title: 'Muscat City Tour', desc: 'Grand Mosque, Royal Opera House, Mutrah Souq & more' },
  { day: 2, title: 'Wadi Shab & Sur', desc: 'Bimmah Sinkhole, hidden waterfall cave, dhow shipyard' },
  { day: 3, title: 'Desert & Wahiba Sands', desc: 'Wadi Bani Khalid, dune bashing, overnight desert camp' },
  { day: 4, title: 'Nizwa & Jabal Akhdar', desc: 'Green Mountain viewpoints, rose terraces, Nizwa by night' },
  { day: 5, title: 'Forts & Mountain Villages', desc: 'Nizwa Fort, Jabreen Castle, Misfat Al Abriyeen' },
  { day: 6, title: 'Jabal Shams & Al Hamra', desc: 'Grand Canyon balcony walk, ancient mud-house village' },
];

const day1Stops = [
  {
    name: 'Sultan Qaboos Grand Mosque',
    desc: 'Begin your journey at one of the most magnificent mosques in the Islamic world. Admire the grand Swarovski crystal chandelier and the world\'s second-largest handwoven Persian carpet.',
    duration: '45 minutes',
    cost: 'Free',
  },
  {
    name: 'Royal Opera House Muscat',
    desc: 'Explore a masterpiece of architecture blending modern luxury with traditional Omani craftsmanship. A symbol of Oman\'s cultural refinement and global vision.',
    duration: '45 minutes',
    cost: 'Not included (Approx. 2 OMR per person)',
  },
  {
    name: 'Mutrah Fish Market',
    desc: 'Experience authentic coastal life as local fishermen sell their daily catch in this vibrant traditional market.',
    duration: '15 minutes',
    cost: 'Free',
  },
  {
    name: 'Mutrah Corniche',
    desc: 'Enjoy a scenic waterfront walk with views of traditional dhows, the harbor, and historic watchtowers.',
    duration: '15 minutes',
    cost: 'Free',
  },
  {
    name: 'Mutrah Souq',
    desc: 'Step into one of Oman\'s oldest marketplaces. Discover spices, frankincense, silver jewelry, traditional garments, and souvenirs.',
    duration: '45 minutes',
    cost: 'Free',
  },
  {
    name: 'Al Alam Palace with Jalali & Mirani Forts',
    desc: 'Visit the ceremonial palace of His Majesty the Sultan, flanked by the iconic 16th-century Portuguese forts. The exterior provides spectacular photo opportunities.',
    duration: '30 minutes',
    cost: 'Exterior only / not open to public',
  },
];

const optionalMuseums = [
  { name: 'Bait Al Zubair Museum', duration: '30–45 min', cost: '~3 OMR' },
  { name: 'National Museum of Oman', duration: '1 hour', cost: '~5 OMR' },
  { name: 'Ghalya\'s Museum of Modern Art', duration: '30 min', cost: '~2 OMR' },
];

const day2Stops = [
  { name: 'Bimmah Sinkhole', desc: 'Marvel at this stunning natural limestone crater filled with turquoise water. A geological wonder where you can take a refreshing swim in the crystal-clear pool.', duration: '30 minutes', cost: 'Free' },
  { name: 'Wadi Shab', desc: 'Hike through one of Oman\'s most beautiful wadis with emerald pools, towering cliffs, and lush palm groves. Swim through a narrow canyon to discover a hidden waterfall cave.', duration: '2–3 hours', cost: '~1 OMR entry' },
  { name: 'Fins Beach', desc: 'Stop at this pristine white-sand beach with dramatic turquoise waters — one of Oman\'s most beautiful coastal spots, perfect for photos and a quick rest.', duration: '20 minutes', cost: 'Free' },
  { name: 'Sur City & Dhow Shipyard', desc: 'Visit the historic port city of Sur, famous for centuries of maritime trade. Watch master craftsmen build traditional wooden dhow boats using age-old techniques.', duration: '45 minutes', cost: 'Free' },
  { name: 'Ras Al Jinz Turtle Reserve (seasonal)', desc: 'During nesting season, witness endangered green turtles coming ashore to lay eggs on this protected beach — a truly magical wildlife experience.', duration: '1–2 hours', cost: '~5 OMR' },
];

const day3Stops = [
  { name: 'Wadi Bani Khalid', desc: 'One of Oman\'s few year-round wadis with deep turquoise pools perfect for swimming, surrounded by date palms and dramatic canyon walls.', duration: '1.5 hours', cost: 'Free' },
  { name: 'Wahiba Sands (Sharqiya Sands)', desc: 'Enter the vast rolling dunes of the Wahiba desert. Experience the thrill of 4x4 dune bashing as your driver navigates steep sand ridges at exciting angles.', duration: '1 hour', cost: 'Included' },
  { name: 'Bedouin Village Visit', desc: 'Meet a local Bedouin family and learn about their traditional desert lifestyle, camel herding, and hospitality. Enjoy Omani coffee and dates.', duration: '30 minutes', cost: 'Free' },
  { name: 'Desert Sunset & Camel Ride', desc: 'Watch the desert transform into golden hues as the sun sets over the dunes. Enjoy a peaceful camel ride through the sands as the sky changes color.', duration: '1 hour', cost: 'Included' },
  { name: 'Overnight Desert Camp', desc: 'Stay in a traditional-style desert camp under a blanket of stars. Enjoy a BBQ dinner, Arabic coffee, and the profound silence of the desert night.', duration: 'Overnight', cost: 'Included in package' },
];

const day4Stops = [
  { name: 'Drive to Nizwa via Mountain Road', desc: 'Travel through the scenic interior of Oman, passing through dramatic mountain passes and traditional villages. The landscape shifts from desert sands to rugged peaks.', duration: '2.5 hours', cost: 'Included' },
  { name: 'Jabal Akhdar (Green Mountain)', desc: 'Ascend to 2,000+ meters on the "Green Mountain," famous for its terraced rose gardens, fruit orchards, and cool climate. Visit the viewpoint overlooking the vast canyon.', duration: '2–3 hours', cost: 'Free' },
  { name: 'Rose Terraces & Village Walk', desc: 'Explore the ancient agricultural terraces where Damask roses, pomegranates, and walnuts are grown. In spring, the valley fills with the fragrance of rose harvesting.', duration: '45 minutes', cost: 'Free' },
  { name: 'Diana\'s Point Viewpoint', desc: 'Stand at the famous viewpoint named after Princess Diana, who visited this spot. The panoramic view of the deep canyon below is breathtaking.', duration: '20 minutes', cost: 'Free' },
  { name: 'Nizwa by Night', desc: 'Settle into Nizwa and enjoy the town\'s peaceful evening atmosphere. Visit local restaurants for traditional Omani cuisine like shuwa and harees.', duration: 'Evening', cost: 'Meals not included' },
];

const day5Stops = [
  { name: 'Nizwa Fort', desc: 'Explore Oman\'s most iconic fort, built in the 17th century. Climb the massive round tower for panoramic views of the oasis town and the Hajar Mountains beyond.', duration: '1 hour', cost: '~5 OMR' },
  { name: 'Nizwa Souq', desc: 'Wander through the traditional market known for silver jewelry, Omani khanjars (daggers), pottery, and spices. On Fridays, the famous livestock auction takes place.', duration: '45 minutes', cost: 'Free' },
  { name: 'Jabreen Castle', desc: 'Visit this beautifully preserved 17th-century castle, considered Oman\'s finest example of Islamic architecture. Admire the painted ceilings, secret passages, and intricate carvings.', duration: '45 minutes', cost: '~5 OMR' },
  { name: 'Bahla Fort (UNESCO)', desc: 'See Oman\'s only UNESCO-listed fort, a massive 12th-century structure surrounded by a 13km wall. The town of Bahla is also renowned for its pottery tradition.', duration: '30 minutes', cost: '~5 OMR' },
  { name: 'Misfat Al Abriyeen', desc: 'Discover this enchanting cliffside village with ancient stone houses, a falaj irrigation system, and terraced date palm gardens. One of Oman\'s most photogenic villages.', duration: '1 hour', cost: 'Free' },
];

const day6Stops = [
  { name: 'Jabal Shams (Sun Mountain)', desc: 'Drive to the summit of Oman\'s highest peak at 3,009 meters. The road itself is an adventure, winding through dramatic mountain scenery with sheer drops.', duration: '1.5 hours drive', cost: 'Included' },
  { name: 'Balcony Walk (Oman\'s Grand Canyon)', desc: 'Hike the famous Balcony Walk trail along the edge of Wadi Ghul — Oman\'s Grand Canyon. The narrow path offers vertigo-inducing views 1,000 meters down.', duration: '2–3 hours', cost: 'Free' },
  { name: 'Abandoned Village of Sab Bani Khamis', desc: 'Along the Balcony Walk, explore the ruins of an abandoned cliffside village. The crumbling stone houses and terraces tell stories of the mountain people who once lived here.', duration: 'Part of hike', cost: 'Free' },
  { name: 'Al Hamra Old Town', desc: 'Visit one of the oldest towns in Oman, featuring well-preserved 400-year-old mud-brick houses. The Bait Al Safah living museum demonstrates traditional Omani daily life.', duration: '1 hour', cost: '~2 OMR (museum)' },
  { name: 'Return to Muscat', desc: 'Journey back to Muscat with a final scenic drive through the Hajar mountain range, arriving in the evening with unforgettable memories of your Oman adventure.', duration: '2.5 hours', cost: 'Included' },
];

const allDays = [
  { day: 1, title: 'Muscat City Tour', subtitle: 'A Journey Through Culture and Majesty', duration: '6–7 hours', stops: day1Stops, icon: Building2 },
  { day: 2, title: 'Wadi Shab & Sur', subtitle: 'Hidden Waterfalls and Maritime Heritage', duration: 'Full day', stops: day2Stops, icon: Waves },
  { day: 3, title: 'Desert & Wahiba Sands', subtitle: 'Dunes, Bedouin Life and Starlit Camps', duration: 'Full day + overnight', stops: day3Stops, icon: Tent },
  { day: 4, title: 'Nizwa & Jabal Akhdar', subtitle: 'Green Mountain and Rose Valley', duration: 'Full day', stops: day4Stops, icon: Mountain },
  { day: 5, title: 'Forts & Mountain Villages', subtitle: 'Ancient Castles and Cliffside Towns', duration: 'Full day', stops: day5Stops, icon: Castle },
  { day: 6, title: 'Jabal Shams & Al Hamra', subtitle: 'Grand Canyon and Mud-Brick Heritage', duration: 'Full day', stops: day6Stops, icon: Sun },
];

const galleryItems = [
  { src: '/images/tourism/1.jpg', title: 'Oman Adventure', desc: 'Discover the beauty and wonder of authentic Oman.' },
  { src: '/images/tourism/gallery-2.jpg', title: 'Jebel Shams Balcony Walk', desc: 'A dramatic cliff-edge trail offering breathtaking views of Oman\'s Grand Canyon.' },
  { src: '/images/tourism/3.jpg', title: 'Desert Landscape', desc: 'Golden sands stretching to the horizon under vast Omani skies.' },
  { src: '/images/tourism/gallery-4.jpg', title: 'Al Hamra Village', desc: '400-year-old mud-brick houses nestled at the foot of the Hajar Mountains.' },
  { src: '/images/tourism/4.jpg', title: 'Cultural Experience', desc: 'Immerse yourself in the rich traditions and heritage of Oman.' },
  { src: '/images/tourism/5.jpg', title: 'Mountain Views', desc: 'Breathtaking vistas from Oman\'s majestic mountain ranges.' },
  { src: '/images/tourism/6.jpg', title: 'Coastal Scenery', desc: 'Where turquoise waters meet dramatic rocky coastlines.' },
  { src: '/images/tourism/gallery-7.jpg', title: 'Sur City', desc: 'A historic port town known for its traditional dhow boat-building heritage.' },
  { src: '/images/tourism/12.jpg', title: 'Hidden Wonders', desc: 'Secret spots and natural treasures waiting to be explored.' },
  { src: '/images/tourism/14.jpg', title: 'Natural Beauty', desc: 'Oman\'s diverse landscapes from wadis to golden dunes.' },
  { src: '/images/tourism/15.jpg', title: 'Heritage Sites', desc: 'Ancient forts, castles, and monuments across the Sultanate.' },
  { src: '/images/tourism/16.jpg', title: 'Wadi Exploration', desc: 'Crystal-clear pools and palm-lined canyons in Oman\'s wadis.' },
  { src: '/images/tourism/17.jpg', title: 'Desert Camp', desc: 'Unforgettable nights under the stars in the Wahiba Sands.' },
  { src: '/images/tourism/18.jpg', title: 'Scenic Drive', desc: 'Stunning routes through mountains, valleys, and coastal roads.' },
  { src: '/images/tourism/19.jpg', title: 'Local Life', desc: 'The warmth and hospitality of everyday Omani culture.' },
];

const testimonials = [
  {
    initials: 'F4',
    name: 'Fiona',
    location: 'London, UK · 4 contributions',
    title: 'Absolutely Unforgettable Experience!',
    quote: 'Our guide was incredibly knowledgeable and passionate about Oman. Every stop was perfectly timed, and the desert camp under the stars was magical. Highly recommend this tour to anyone visiting Oman!',
  },
  {
    initials: 'MZ',
    name: 'Marco Z.',
    location: 'Munich, Germany · 2 contributions',
    title: 'Best Tour We\'ve Ever Taken',
    quote: 'From Wadi Shab to Jabal Shams, every day was a highlight. The 4x4 desert drive was thrilling and the overnight camp was a once-in-a-lifetime experience. Professional, friendly, and authentic.',
  },
  {
    initials: 'ES',
    name: 'Emily S.',
    location: 'Sydney, Australia · 6 contributions',
    title: 'A Hidden Gem of a Tour Company',
    quote: 'We felt like family, not tourists. Our guide customized everything to our interests. The old villages, the mountain hikes, and the local food experiences were incredible. Can\'t wait to come back!',
  },
  {
    initials: 'AK',
    name: 'Ahmed K.',
    location: 'Dubai, UAE · 3 contributions',
    title: 'Authentic and Professional',
    quote: 'Finally a tour that shows the real Oman. No rushed tourist traps — just genuine experiences, stunning scenery, and a guide who truly loves his country. Worth every penny.',
  },
  {
    initials: 'JP',
    name: 'Julia P.',
    location: 'Toronto, Canada · 5 contributions',
    title: 'Perfect Family Adventure',
    quote: 'Traveled with our two teenagers and they loved it. The snorkeling, dune bashing, and souq shopping kept everyone engaged. Our guide was patient and fun. A trip we\'ll talk about for years.',
  },
  {
    initials: 'RN',
    name: 'Rajesh N.',
    location: 'Mumbai, India · 2 contributions',
    title: 'Exceeded All Expectations',
    quote: 'The attention to detail was remarkable. From picking the best viewpoints to finding the most authentic local restaurants, our guide made Oman come alive. The Balcony Walk at Jabal Shams was breathtaking.',
  },
];

function TourismHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <img src="/images/logo-light.png" alt="Logo" className="h-10 w-auto" />
            <span className="hidden sm:block font-semibold text-[#1A1A1A] text-sm leading-tight">
              Authentic Oman Tours<br />and Adventures
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-[#666666] hover:text-[#C49A3A] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C49A3A] hover:bg-[#B08A2E] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors hidden sm:inline-flex items-center gap-2"
            >
              Book Now
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#1A1A1A]"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[#EAEAEA] pb-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left py-3 px-2 text-[#1A1A1A] hover:text-[#C49A3A] text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mt-2 bg-[#C49A3A] text-white text-center py-3 rounded-lg text-sm font-semibold"
            >
              Book Now
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

function GalleryCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? galleryItems.length - 1 : c - 1));
  const next = useCallback(() => setCurrent((c) => (c === galleryItems.length - 1 ? 0 : c + 1)), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100">
        <img
          src={galleryItems[current].src}
          alt={galleryItems[current].title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{galleryItems[current].title}</h3>
          <p className="text-white/80 text-sm md:text-base">{galleryItems[current].desc}</p>
        </div>
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors">
          <ChevronLeft size={20} className="text-[#1A1A1A]" />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors">
          <ChevronRight size={20} className="text-[#1A1A1A]" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {galleryItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-[#C49A3A] w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {galleryItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === current ? 'border-[#C49A3A] ring-2 ring-[#C49A3A]/30' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <div>
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 md:p-10 min-h-[280px] flex flex-col justify-between">
        <div>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} className="text-[#C49A3A] fill-[#C49A3A]" />
            ))}
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{testimonials[current].title}</h3>
          <p className="text-[#666666] leading-relaxed italic">&ldquo;{testimonials[current].quote}&rdquo;</p>
        </div>
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[#EAEAEA]">
          <div className="w-12 h-12 rounded-full bg-[#C49A3A] flex items-center justify-center text-white font-bold text-sm">
            {testimonials[current].initials}
          </div>
          <div>
            <p className="font-semibold text-[#1A1A1A]">{testimonials[current].name}</p>
            <p className="text-sm text-[#666666]">{testimonials[current].location}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={prev} className="w-10 h-10 rounded-full border border-[#EAEAEA] hover:border-[#C49A3A] flex items-center justify-center transition-colors">
          <ChevronLeft size={18} className="text-[#666666]" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-[#C49A3A] w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 rounded-full border border-[#EAEAEA] hover:border-[#C49A3A] flex items-center justify-center transition-colors">
          <ChevronRight size={18} className="text-[#666666]" />
        </button>
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', tourType: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', tourType: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Message Sent!</h3>
        <p className="text-[#666666] mb-6">We&apos;ll get back to you within 24 hours.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-[#C49A3A] font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#EAEAEA] p-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C49A3A] focus:ring-1 focus:ring-[#C49A3A] transition-colors"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C49A3A] focus:ring-1 focus:ring-[#C49A3A] transition-colors"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Tour Type *</label>
        <select
          required
          value={form.tourType}
          onChange={(e) => setForm({ ...form, tourType: e.target.value })}
          className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C49A3A] focus:ring-1 focus:ring-[#C49A3A] transition-colors bg-white"
        >
          <option value="">Select tour type</option>
          <option value="Day Tour">Day Tour</option>
          <option value="Multi-Day Tour">Multi-Day Tour</option>
          <option value="Custom Tour">Custom Tour</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Message *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C49A3A] focus:ring-1 focus:ring-[#C49A3A] transition-colors resize-none"
          placeholder="Tell us about your ideal Oman adventure..."
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#C49A3A] hover:bg-[#B08A2E] text-white py-3.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Send size={16} />
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

export default function TourismPage() {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <>
      <TourismHeader />

      {/* Hero */}
      <section id="home" className="relative pt-20">
        <div className="relative h-[600px] md:h-[700px]">
          <img src="/images/tourism/hero.jpg" alt="Discover the Magic of Oman" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover the Magic of Oman
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed">
              Experience authentic adventures through breathtaking landscapes, rich culture,
              and unforgettable memories with Authentic Oman Tours and Adventures
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C49A3A] hover:bg-[#B08A2E] text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2 text-lg"
              >
                <MessageCircle size={20} />
                Book Now
              </a>
              <a
                href={TRIPADVISOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#34E0A1] hover:bg-[#2BC88E] text-black px-8 py-4 rounded-full font-bold transition-colors inline-flex items-center justify-center gap-2.5 shadow-lg text-lg"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><circle cx="6.5" cy="13.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="17.5" cy="13.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2C6.48 2 2 5.88 2 10.5c0 2.52 1.47 4.77 3.77 6.3L4 22l3.73-2.6c1.3.46 2.74.72 4.27.72s2.97-.26 4.27-.72L20 22l-1.77-5.2C20.53 15.27 22 13.02 22 10.5 22 5.88 17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="6.5" cy="13.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="17.5" cy="13.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="8" r="1.5"/></svg>
                TripAdvisor Reviews
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Package */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Our Signature Six-Day Oman Adventure
            </h2>
            <p className="text-[#666666] max-w-2xl mx-auto">
              Experience the complete essence of Oman in our carefully crafted six-day journey through culture, nature, and heritage
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 md:p-10 shadow-sm text-center">

              {/* Pricing Block Centered */}
              <div className="mb-8 pb-8 border-b border-[#EAEAEA] flex flex-col items-center">

                <div className="flex items-baseline gap-3 mb-3 justify-center">
                  <span className="text-[#666666] line-through text-lg">
                    $1,940 USD
                  </span>
                  <span className="text-3xl md:text-4xl font-bold text-[#C49A3A]">
                    $1,792 USD
                  </span>
                </div>

                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="bg-[#C49A3A]/10 text-[#C49A3A] px-3 py-1 rounded-full text-sm font-semibold">
                    Save $148
                  </span>
                  <span className="text-[#666666] text-sm">
                    Limited time offer — Book now!
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-[#666666] justify-center">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-[#C49A3A]" />
                    <span>6 Days / 5 Nights</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-[#C49A3A]" />
                    <span>Private Tour</span>
                  </div>
                </div>

              </div>

              {/* CTA */}
              <div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
                >
                  <MessageCircle size={20} />
                  Book or Customize on WhatsApp
                </a>
                <p className="text-[#666666] text-sm mt-3">
                  Get instant answers from our Omani tour experts
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Tours Section - All Days */}
      <section id="tours" className="py-20 bg-[#F9F9F9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Your 6-Day Itinerary
            </h2>
            <p className="text-[#666666] max-w-2xl mx-auto">
              Every day is a new adventure — from city culture to desert camps, mountain canyons to coastal wonders.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {allDays.map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeDay === d.day
                      ? 'bg-[#C49A3A] text-white shadow-md'
                      : 'bg-white text-[#1A1A1A] border border-[#EAEAEA] hover:border-[#C49A3A] hover:text-[#C49A3A]'
                  }`}
                >
                  <Icon size={16} />
                  Day {d.day}
                </button>
              );
            })}
          </div>

          {allDays.filter((d) => d.day === activeDay).map((dayData) => {
            const Icon = dayData.icon;
            return (
              <div key={dayData.day}>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-[#C49A3A] flex items-center justify-center text-white">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                        Day {dayData.day}: {dayData.title}
                      </h3>
                      <p className="text-[#C49A3A] font-medium">{dayData.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-[#666666]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} className="text-[#C49A3A]" /> {dayData.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-[#C49A3A]" /> {dayData.stops.length} stops
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  {dayData.stops.map((stop, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-[#EAEAEA] p-6 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#C49A3A]/10 flex items-center justify-center flex-shrink-0 text-[#C49A3A] font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[#1A1A1A] mb-2">{stop.name}</h4>
                          <p className="text-[#666666] text-sm leading-relaxed mb-3">{stop.desc}</p>
                          <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-1.5 text-xs text-[#666666] bg-gray-100 px-3 py-1.5 rounded-full">
                              <Clock size={12} /> {stop.duration}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-[#666666] bg-gray-100 px-3 py-1.5 rounded-full">
                              {stop.cost}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {dayData.day === 1 && (
                  <div className="mt-8 bg-white rounded-xl border border-[#EAEAEA] p-6">
                    <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                      <Compass size={20} className="text-[#C49A3A]" />
                      Optional Museum Visits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {optionalMuseums.map((m, idx) => (
                        <div key={idx} className="p-4 bg-[#F9F9F9] rounded-lg border border-[#EAEAEA]">
                          <h4 className="font-medium text-[#1A1A1A] text-sm mb-2">{m.name}</h4>
                          <div className="flex justify-between text-xs text-[#666666]">
                            <span>{m.duration}</span>
                            <span>{m.cost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#C49A3A] hover:bg-[#B08930] text-white px-8 py-3.5 rounded-lg font-semibold transition-colors shadow-md"
                  >
                    <MessageCircle size={18} />
                    Book This Tour Package
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Experience Oman&apos;s Beauty
            </h2>
            <p className="text-[#666666] max-w-xl mx-auto">
              From golden deserts to turquoise coastlines, discover the landscapes and culture that make Oman unforgettable.
            </p>
          </div>
          <GalleryCarousel />
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-[#F9F9F9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-[#666666] mb-4">Real experiences from real adventurers</p>
            <a
              href={TRIPADVISOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#34E0A1] hover:bg-[#2BC88E] text-black px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="6.5" cy="13.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="17.5" cy="13.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2C6.48 2 2 5.88 2 10.5c0 2.52 1.47 4.77 3.77 6.3L4 22l3.73-2.6c1.3.46 2.74.72 4.27.72s2.97-.26 4.27-.72L20 22l-1.77-5.2C20.53 15.27 22 13.02 22 10.5 22 5.88 17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="6.5" cy="13.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="17.5" cy="13.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="8" r="1.5"/></svg>
              View all reviews on TripAdvisor
            </a>
          </div>
          <ReviewsCarousel />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                Contact Us
              </h2>
              <p className="text-[#666666] mb-8 leading-relaxed">
                Ready to start planning your Oman adventure? Get in touch with our team for booking,
                customizations, or any questions.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#C49A3A]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#C49A3A]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] text-sm">Address</h4>
                    <p className="text-[#666666] text-sm">Muscat, Sultanate of Oman<br />P.O. Box 123, Postal Code 100</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[#25D366]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] text-sm">WhatsApp</h4>
                    <a href="https://wa.me/96896532326" className="text-[#666666] text-sm hover:text-[#C49A3A] block">+968 9653 2326</a>
                    <a href="https://wa.me/96894259459" className="text-[#666666] text-sm hover:text-[#C49A3A] block">+968 9425 9459</a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#C49A3A]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[#C49A3A]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] text-sm">Email</h4>
                    <a href="mailto:authentic.tour.om@gmail.com" className="text-[#666666] text-sm hover:text-[#C49A3A]">authentic.tour.om@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/images/logo-dark.png" alt="Logo" className="h-10 w-auto" />
                <span className="font-semibold text-sm leading-tight">
                  Authentic Oman Tours<br />and Adventures
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Discover the beauty, heritage, and adventure of Oman with authentic private guided tours.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} className="block text-gray-400 text-sm hover:text-[#C49A3A] transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>Muscat, Sultanate of Oman</p>
                <p>+968 9653 2326</p>
                <p>+968 9425 9459</p>
                <p>authentic.tour.om@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
            <p>
              &copy; 2024 Authentic Oman Tours and Adventures. All rights reserved.
              {' | '}
              <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
              {' | '}
              <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating TripAdvisor Button */}
      <a
        href={TRIPADVISOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-[#34E0A1] hover:bg-[#2BC88E] text-black px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 z-50"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="6.5" cy="13.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="17.5" cy="13.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2C6.48 2 2 5.88 2 10.5c0 2.52 1.47 4.77 3.77 6.3L4 22l3.73-2.6c1.3.46 2.74.72 4.27.72s2.97-.26 4.27-.72L20 22l-1.77-5.2C20.53 15.27 22 13.02 22 10.5 22 5.88 17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="6.5" cy="13.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="17.5" cy="13.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="8" r="1.5"/></svg>
        <span className="font-semibold text-sm hidden sm:inline">TripAdvisor Reviews</span>
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BD5A] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 z-50"
      >
        <MessageCircle size={20} />
        <span className="font-semibold text-sm hidden sm:inline">Chat on WhatsApp</span>
      </a>
    </>
  );
}
