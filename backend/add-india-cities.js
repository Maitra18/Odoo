/**
 * Add Indian Cities – run once: node add-india-cities.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'traveloop_db',
  });
  console.log('✅ Connected to MySQL');

  // ── Cities ────────────────────────────────────────────────
  const cities = [
    ['Mumbai',    'India', 'South Asia', 45, 92, 'The City of Dreams — Bollywood, colonial architecture, Marine Drive, and vibrant street food.', 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800'],
    ['New Delhi', 'India', 'South Asia', 38, 90, 'India\'s capital blending Mughal grandeur, colonial boulevards, and modern energy.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'],
    ['Jaipur',    'India', 'South Asia', 32, 88, 'The Pink City — majestic forts, ornate palaces, vibrant bazaars, and rich Rajasthani culture.', 'https://images.unsplash.com/photo-1477587458883-47145ed31459?w=800'],
    ['Goa',       'India', 'South Asia', 35, 91, 'Sun, sand, and spice — golden beaches, Portuguese heritage, and legendary nightlife.', 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800'],
    ['Agra',      'India', 'South Asia', 28, 89, 'Home of the Taj Mahal — one of the seven wonders and a testament to eternal love.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'],
    ['Varanasi',  'India', 'South Asia', 22, 85, 'The spiritual heart of India — ancient ghats, sacred rituals, and timeless mysticism.', 'https://images.unsplash.com/photo-1561361058-c24e0e59b7b6?w=800'],
    ['Bengaluru', 'India', 'South Asia', 42, 84, 'India\'s Silicon Valley — tech hub with craft breweries, lush parks, and vibrant culture.', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800'],
    ['Kerala',    'India', 'South Asia', 30, 87, 'God\'s Own Country — serene backwaters, tea plantations, Ayurveda, and elephant festivals.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'],
  ];

  const [cityResult] = await conn.query(
    'INSERT INTO cities (name, country, region, cost_index, popularity, description, image_url) VALUES ?',
    [cities]
  );
  const firstId = cityResult.insertId;
  const [Mumbai, Delhi, Jaipur, Goa, Agra, Varanasi, Bengaluru, Kerala] =
    Array.from({ length: cities.length }, (_, i) => firstId + i);

  console.log(`✅ ${cities.length} Indian cities inserted (IDs ${firstId}–${firstId + cities.length - 1})`);

  // ── Activities ────────────────────────────────────────────
  const activities = [
    // Mumbai
    [Mumbai, 'Gateway of India',        'sightseeing', 0,  60,  'Iconic colonial arch overlooking the Arabian Sea.',                    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400'],
    [Mumbai, 'Marine Drive Stroll',     'sightseeing', 0,  90,  'Walk the Queen\'s Necklace at sunset along the coastline.',            'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400'],
    [Mumbai, 'Elephanta Caves',         'culture',     15, 240, 'UNESCO rock-cut cave temples on an island in Mumbai Harbour.',         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    [Mumbai, 'Dharavi Slum Tour',       'culture',     20, 150, 'Eye-opening guided tour through Asia\'s largest urban settlement.',    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400'],
    [Mumbai, 'Vada Pav Street Food Tour','food',        10, 120, 'Taste Mumbai\'s beloved street snacks across Dadar and CST.',         'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400'],
    // New Delhi
    [Delhi,  'Red Fort',                'sightseeing', 10, 120, 'Magnificent 17th-century Mughal fortress, UNESCO World Heritage Site.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'],
    [Delhi,  'Qutub Minar',             'sightseeing', 8,  90,  'World\'s tallest brick minaret — stunning example of early Islamic art.','https://images.unsplash.com/photo-1548013146-72479768bada?w=400'],
    [Delhi,  'India Gate',              'sightseeing', 0,  60,  'War memorial on Rajpath — iconic silhouette at sunset.',               'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=400'],
    [Delhi,  'Chandni Chowk Food Walk', 'food',        15, 150, 'Feast on parathas, chaat, and kebabs in Old Delhi\'s historic bazaar.','https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'],
    [Delhi,  'Lotus Temple',            'culture',     0,  60,  'Award-winning Bahai House of Worship shaped like a blooming lotus.',   'https://images.unsplash.com/photo-1555652736-e92021d28a10?w=400'],
    // Jaipur
    [Jaipur, 'Amber Fort',              'sightseeing', 12, 150, 'Stunning hilltop Rajput fort with mirror halls and elephant rides.',    'https://images.unsplash.com/photo-1477587458883-47145ed31459?w=400'],
    [Jaipur, 'Hawa Mahal',             'sightseeing', 3,  60,  'Palace of Winds — iconic honeycomb facade with 953 latticed windows.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400'],
    [Jaipur, 'City Palace Museum',      'culture',     10, 120, 'Royal residence housing Rajasthani art, textiles, and royal armory.',  'https://images.unsplash.com/photo-1580471874875-7a5ceba1ffa8?w=400'],
    [Jaipur, 'Johari Bazaar Shopping',  'shopping',    0,  120, 'Hunt for gemstones, block-print textiles, and silver jewelry.',        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400'],
    [Jaipur, 'Dal Baati Churma Dinner', 'food',        8,  90,  'Traditional Rajasthani thali — a true royal culinary experience.',     'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
    // Goa
    [Goa,    'Calangute Beach',         'nature',      0,  180, 'Queen of Beaches — golden sands, water sports, and beach shacks.',     'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=400'],
    [Goa,    'Old Goa Churches',        'culture',     0,  90,  'UNESCO baroque churches including Basilica of Bom Jesus.',            'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400'],
    [Goa,    'Dudhsagar Waterfall Trek','adventure',   25, 300, 'Trek through jungle to witness India\'s tallest waterfall.',            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    [Goa,    'Spice Plantation Tour',   'nature',      15, 180, 'Walk through aromatic spice gardens with a traditional lunch.',        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    [Goa,    'Anjuna Night Market',     'nightlife',   0,  120, 'Eclectic flea market alive with music, crafts, and street food.',      'https://images.unsplash.com/photo-1608138278869-a1d3c53f2c4c?w=400'],
    // Agra
    [Agra,   'Taj Mahal Sunrise Visit', 'sightseeing', 15, 180, 'Witness the world\'s greatest monument to love at golden dawn.',       'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400'],
    [Agra,   'Agra Fort',               'sightseeing', 8,  90,  'Red sandstone Mughal fort with sweeping views of the Taj Mahal.',      'https://images.unsplash.com/photo-1548013146-72479768bada?w=400'],
    [Agra,   'Mehtab Bagh Sunset',      'sightseeing', 3,  60,  'Mughal garden offering the finest silhouette view of the Taj.',        'https://images.unsplash.com/photo-1590649880765-91b1956b8276?w=400'],
    [Agra,   'Mughlai Cuisine Dinner',  'food',        18, 90,  'Savor authentic biryani, kebabs, and korma in Agra\'s old lanes.',    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
    // Varanasi
    [Varanasi,'Ganga Aarti Ceremony',   'culture',     0,  90,  'Sacred fire ritual on the ghats at dusk — profoundly spiritual.',     'https://images.unsplash.com/photo-1561361058-c24e0e59b7b6?w=400'],
    [Varanasi,'Sunrise Boat Ride',      'sightseeing', 12, 90,  'Row past ancient ghats as the holy city awakens at first light.',     'https://images.unsplash.com/photo-1561361058-c24e0e59b7b6?w=400'],
    [Varanasi,'Kashi Vishwanath Temple','culture',     0,  60,  'One of the twelve sacred Jyotirlinga shrines of Lord Shiva.',         'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400'],
    [Varanasi,'Lassi & Chaat Trail',    'food',        5,  60,  'Taste the legendary Varanasi lassi and street chaat at local dhabas.','https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
    // Bengaluru
    [Bengaluru,'Lalbagh Botanical Garden','nature',    1,  90,  '240-acre garden with a glass house and ancient geological formations.','https://images.unsplash.com/photo-1566765628853-c898b72e382f?w=400'],
    [Bengaluru,'Craft Beer Brewery Tour','food',       20, 120, 'Visit Bengaluru\'s famous microbreweries along Church Street.',        'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400'],
    [Bengaluru,'ISKCON Temple',          'culture',    0,  60,  'One of the world\'s largest ISKCON temples — serene and majestic.',   'https://images.unsplash.com/photo-1555652736-e92021d28a10?w=400'],
    [Bengaluru,'Bangalore Palace',       'sightseeing',7,  90,  'Tudor-style royal palace modelled after Windsor Castle.',             'https://images.unsplash.com/photo-1548013146-72479768bada?w=400'],
    // Kerala
    [Kerala, 'Alleppey Houseboat Cruise','nature',     80, 480, 'Glide through serene backwaters on a traditional Kerala houseboat.',  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400'],
    [Kerala, 'Munnar Tea Plantation Walk','nature',    10, 180, 'Wander through rolling green tea estates in the Western Ghats.',      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    [Kerala, 'Kathakali Performance',    'culture',    12, 90,  'Ancient classical dance with elaborate costumes and face painting.',   'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400'],
    [Kerala, 'Ayurveda Wellness Retreat','nature',     60, 240, 'Traditional herbal oil massage and rejuvenating wellness treatments.', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'],
    [Kerala, 'Kerala Sadya Feast',       'food',       8,  60,  '26-dish vegetarian feast served on a fresh banana leaf.',             'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
  ];

  await conn.query(
    'INSERT INTO city_activities (city_id, name, type, cost, duration, description, image_url) VALUES ?',
    [activities]
  );

  console.log(`✅ ${activities.length} activities inserted`);
  console.log('\n🇮🇳 Indian cities now available in Traveloop:');
  cities.forEach((c, i) => console.log(`   ${i + 1}. ${c[0]}`));
  await conn.end();
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
