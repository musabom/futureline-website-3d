import Link from 'next/link';
import {
  Compass, MapPin, Clock, Users, Star, Phone, Mail,
  Mountain, Waves, Building2, Tent, Castle, Sun,
  Camera, Footprints, ChevronRight, MessageCircle,
  Landmark, Ship, TreePalm
} from 'lucide-react';

const itinerary = [
  {
    day: 1,
    title: 'Muscat City Tour',
    subtitle: 'A Journey Through Culture and Majesty',
    duration: 'Approx. 6–7 Hours',
    stops: 7,
    icon: Building2,
    items: [
      {
        name: 'Sultan Qaboos Grand Mosque',
        desc: 'Begin your journey at one of the most magnificent mosques in the Islamic world. Admire the grand Swarovski crystal chandelier and the world\'s second-largest handwoven Persian carpet.',
        duration: '45 minutes',
        admission: 'Free',
      },
      {
        name: 'Royal Opera House Muscat',
        desc: 'Explore a masterpiece of architecture blending modern luxury with traditional Omani craftsmanship. A symbol of Oman\'s cultural refinement and global vision.',
        duration: '45 minutes',
        admission: 'Approx. 2 OMR per person',
      },
      {
        name: 'Mutrah Fish Market',
        desc: 'Experience authentic coastal life as local fishermen sell their daily catch in this vibrant traditional market.',
        duration: '15 minutes',
        admission: 'Free',
      },
      {
        name: 'Mutrah Corniche',
        desc: 'Enjoy a scenic waterfront walk with views of traditional dhows, the harbor, and historic watchtowers.',
        duration: '15 minutes',
        admission: 'Free',
      },
      {
        name: 'Mutrah Souq',
        desc: 'Step into one of Oman\'s oldest marketplaces. Discover spices, frankincense, silver jewelry, traditional garments, and souvenirs.',
        duration: '45 minutes',
        admission: 'Free',
      },
      {
        name: 'Al Alam Palace & Jalali & Mirani Forts',
        desc: 'Visit the ceremonial palace of His Majesty the Sultan, flanked by the iconic 16th-century Portuguese forts. The exterior provides spectacular photo opportunities.',
        duration: '30 minutes',
        admission: 'Exterior view only',
      },
    ],
    optional: [
      { name: 'Bait Al Zubair Museum', desc: 'Private museum showcasing traditional Omani heritage and daily life.', duration: '30–45 minutes', admission: 'Approx. 3 OMR' },
      { name: 'National Museum of Oman', desc: 'Modern museum presenting Oman\'s history and maritime legacy.', duration: '1 hour', admission: 'Approx. 5 OMR' },
      { name: 'Ghalya\'s Museum of Modern Art', desc: 'A charming museum bridging traditional and modern Omani life.', duration: '30 minutes', admission: 'Approx. 2 OMR' },
    ],
  },
  {
    day: 2,
    title: 'Wadi Shab, Bimmah Sinkhole & Sur Coastal Tour',
    subtitle: 'Nature\'s Hidden Gems Along the Coast',
    duration: '8–9 Hours',
    stops: 3,
    icon: Waves,
    items: [
      {
        name: 'Bimmah Sinkhole',
        desc: 'A stunning natural limestone crater filled with turquoise water, perfect for swimming or photos.',
        duration: '45 minutes',
        admission: 'Free',
      },
      {
        name: 'Wadi Shab',
        desc: 'One of Oman\'s most famous natural attractions. After a short boat crossing (approx. 1 OMR), hike through palm-lined canyons and swim through clear pools to reach a hidden waterfall cave.',
        duration: '4 hours (hike + swim + rest)',
        admission: 'Free (Boat fee: approx. 1 OMR)',
      },
      {
        name: 'Sur Dhow Shipyard',
        desc: 'Witness handcrafted wooden dhows in one of the region\'s last traditional shipyards.',
        duration: '30 minutes',
        admission: '2 OMR',
      },
      {
        name: 'Al Ayjah Watchtower & Lighthouse',
        desc: 'Panoramic harbor views from this historic defense point.',
        duration: '15 minutes',
        admission: 'Free',
      },
      {
        name: 'Sur Corniche & Local Market',
        desc: 'Relax along the waterfront and explore everyday life in Sur.',
        duration: '30–45 minutes',
        admission: 'Free',
      },
    ],
  },
  {
    day: 3,
    title: 'Wadi Bani Khalid & Wahiba Sands Desert Camp',
    subtitle: 'From Desert Oasis to Starlit Sands',
    duration: 'Full Day + Overnight',
    stops: 2,
    icon: Tent,
    items: [
      {
        name: 'Wadi Bani Khalid',
        desc: 'A beautiful desert oasis with turquoise pools and palm trees. Swim or relax in a peaceful setting.',
        duration: '3 hours',
        admission: 'Free',
      },
      {
        name: 'Desert Drive into Wahiba Sands',
        desc: 'Journey deep into the golden dunes in a 4x4 vehicle.',
        duration: '1 hour',
        admission: 'Included',
      },
      {
        name: 'Dune Bashing (Optional)',
        desc: 'Thrilling off-road adventure across the desert dunes.',
        duration: '30 minutes',
        admission: '20–25 OMR (optional)',
      },
      {
        name: 'Sunset Viewpoint',
        desc: 'Enjoy panoramic desert sunset views over the golden sand dunes.',
        duration: '30 minutes',
        admission: 'Free',
      },
      {
        name: 'Overnight Desert Camp',
        desc: 'Stay in a traditional Bedouin-style camp with dinner, music, and stargazing.',
        duration: 'Overnight',
        admission: 'Approx. 20–35 OMR per person',
      },
    ],
  },
  {
    day: 4,
    title: 'Nizwa, Birkat Al Mouz & Jabal Akhdar',
    subtitle: 'Mountains, Terraces & Ancient Heritage',
    duration: '9–10 Hours',
    stops: 3,
    icon: Mountain,
    items: [
      {
        name: 'Birkat Al Mouz',
        desc: 'Ancient mud-brick village with UNESCO-listed falaj irrigation system.',
        duration: '1 hour',
        admission: 'Free',
      },
      {
        name: 'Jabal Akhdar – Diana\'s Point',
        desc: 'Famous panoramic canyon viewpoint on the Green Mountain.',
        duration: '20–30 minutes',
        admission: 'Free (4x4 required)',
      },
      {
        name: 'Al Ayn Terraces',
        desc: 'Beautiful rose terraces and mountain villages.',
        duration: '45 minutes',
        admission: 'Free',
      },
      {
        name: 'Wadi Bani Habib',
        desc: 'Abandoned stone village with scenic hike.',
        duration: '45–60 minutes',
        admission: 'Free',
      },
      {
        name: 'Mountain Lunch (Optional)',
        desc: 'Optional lunch overlooking the valleys.',
        duration: '1 hour',
        admission: '5–10 OMR',
      },
      {
        name: 'Nizwa by Night',
        desc: 'Evening stroll around Nizwa Fort and Souq with a calm, magical atmosphere.',
        duration: '2 hours',
        admission: 'Exterior free',
      },
    ],
  },
  {
    day: 5,
    title: 'Nizwa, Jabreen Castle, Bahla Fort & Misfat Al Abriyeen',
    subtitle: 'Forts, Castles & Mountain Villages',
    duration: '8–9 Hours',
    stops: 4,
    icon: Castle,
    items: [
      {
        name: 'Nizwa Fort & Souq',
        desc: 'Iconic circular fort and traditional market.',
        duration: '1 hour',
        admission: 'Approx. 5 OMR',
      },
      {
        name: 'Bahla Fort (Photo Stop)',
        desc: 'UNESCO World Heritage site.',
        duration: '15 minutes',
        admission: 'Free (exterior)',
      },
      {
        name: 'Jabreen Castle',
        desc: '17th-century castle with ornate ceilings and hidden staircases.',
        duration: '1 hour',
        admission: 'Approx. 1 OMR',
      },
      {
        name: 'Misfat Al Abriyeen',
        desc: 'Charming mountain village with terraced farms and falaj system.',
        duration: '1 hour',
        admission: 'Free',
      },
    ],
  },
  {
    day: 6,
    title: 'Jabal Shams & Al Hamra',
    subtitle: 'The Grand Canyon of Oman',
    duration: '9–10 Hours',
    stops: 2,
    icon: Sun,
    items: [
      {
        name: 'Jabal Shams – Wadi Nakhar Viewpoint',
        desc: 'Stunning viewpoint overlooking Oman\'s Grand Canyon.',
        duration: '15 minutes',
        admission: 'Free',
      },
      {
        name: 'Balcony Walk (W6 Trail)',
        desc: '3–4 hour scenic canyon hike along cliff edges with breathtaking views. Moderate fitness required.',
        duration: '3–4 hours',
        admission: 'Free',
      },
      {
        name: 'Al Hamra Old Town Walking Tour',
        desc: 'Explore 400-year-old mud houses in one of Oman\'s most ancient towns.',
        duration: '30 minutes',
        admission: 'Free',
      },
      {
        name: 'Bait Al Safah',
        desc: 'Living museum demonstrating traditional crafts and Omani heritage.',
        duration: '30 minutes',
        admission: 'Approx. 3 OMR',
      },
      {
        name: 'Return to Muscat',
        desc: 'Drive time approximately 2.5–3 hours.',
        duration: '2.5–3 hours',
        admission: 'N/A',
      },
    ],
  },
];

export default function TourismPage() {
  return (
    <>
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1E3D] via-[#1B4B6D] to-[#0F1E3D] opacity-95" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-sky-400/20 rounded-xl flex items-center justify-center border border-white/10">
              <Compass className="text-sky-300" size={24} />
            </div>
            <span className="text-sky-300 font-semibold tracking-wider uppercase text-sm">FL Tourism</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
            6-Day Oman Discovery
          </h1>
          <p className="text-xl md:text-2xl text-sky-200/80 mb-4 font-light">
            Culture, Coast, Desert & Mountains
          </p>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
            An authentic private guided tour through Oman&apos;s most breathtaking landscapes,
            ancient heritage sites, and vibrant coastal cities.
          </p>
          <div className="flex flex-wrap gap-6 mb-10">
            {[
              { icon: Clock, label: '6 Days / 5 Nights' },
              { icon: Users, label: 'Private Guided Tour' },
              { icon: Star, label: 'Culture \u2022 Nature \u2022 Heritage \u2022 Adventure' },
            ].map((tag) => (
              <div key={tag.label} className="flex items-center gap-2 text-gray-300 text-sm">
                <tag.icon size={16} className="text-sky-300" />
                <span>{tag.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/96896532326"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Book via WhatsApp
            </a>
            <a
              href="mailto:authentic.tour.om@gmail.com"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
            >
              <Mail size={18} />
              Email Enquiry
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: 'Cultural Heritage', desc: 'Mosques, forts & souqs' },
              { icon: Waves, label: 'Coastal Beauty', desc: 'Wadis, sinkholes & harbors' },
              { icon: Tent, label: 'Desert Adventure', desc: 'Dune bashing & stargazing' },
              { icon: Mountain, label: 'Mountain Trails', desc: 'Canyons, terraces & villages' },
            ].map((item) => (
              <div key={item.label} className="text-center p-6 rounded-xl bg-gray-soft group hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-navy mb-1">{item.label}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-soft">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-3">The Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Day-by-Day Itinerary</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Six days of unforgettable experiences across Oman&apos;s most iconic destinations
            </p>
          </div>

          <div className="space-y-8">
            {itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-[#0F1E3D] to-[#1B4B6D] p-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0">
                    <day.icon className="text-sky-300" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-sky-400/20 text-sky-200 text-xs font-bold px-3 py-1 rounded-full">
                        Day {day.day}
                      </span>
                      <span className="text-gray-400 text-sm">{day.duration}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">{day.title}</h3>
                    <p className="text-sky-200/70 text-sm mt-0.5">{day.subtitle}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {day.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-gray-soft transition-colors group">
                        <div className="flex-shrink-0 w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center text-teal font-bold text-sm mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-navy group-hover:text-teal transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <Clock size={12} /> {item.duration}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <MapPin size={12} /> {item.admission}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {day.optional && day.optional.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Optional Museum Visits
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {day.optional.map((opt, idx) => (
                          <div key={idx} className="p-4 bg-gray-soft rounded-xl">
                            <h5 className="font-semibold text-navy text-sm mb-1">{opt.name}</h5>
                            <p className="text-xs text-gray-500 mb-2">{opt.desc}</p>
                            <div className="flex gap-3 text-xs text-gray-400">
                              <span><Clock size={10} className="inline mr-1" />{opt.duration}</span>
                              <span>{opt.admission}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0F1E3D] to-[#1B4B6D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-sky-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Phone className="text-sky-300" size={28} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore Oman?
          </h2>
          <p className="text-gray-300 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
            Contact us to book your private 6-day Oman Discovery tour or to customise your own itinerary.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <MessageCircle className="text-green-400 mx-auto mb-3" size={24} />
              <h3 className="font-semibold text-white mb-2">WhatsApp</h3>
              <a href="https://wa.me/96896532326" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-200 text-sm block mb-1">
                +968 9653 2326
              </a>
              <a href="https://wa.me/96894259459" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-200 text-sm block">
                +968 9425 9459
              </a>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Mail className="text-sky-300 mx-auto mb-3" size={24} />
              <h3 className="font-semibold text-white mb-2">Email</h3>
              <a href="mailto:authentic.tour.om@gmail.com" className="text-sky-300 hover:text-sky-200 text-sm block">
                authentic.tour.om@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/96896532326"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Book via WhatsApp
            </a>
            <Link
              href="/"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
