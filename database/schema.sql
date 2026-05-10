-- ============================================================
-- Traveloop Database Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS traveloop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE traveloop_db;

-- ────────────────────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  profile_photo VARCHAR(500) DEFAULT NULL,
  language      VARCHAR(10)  DEFAULT 'en',
  role          ENUM('user','admin') DEFAULT 'user',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- CITIES (seed data)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  country     VARCHAR(100) NOT NULL,
  region      VARCHAR(100),
  cost_index  DECIMAL(5,2) DEFAULT 50.00,
  popularity  INT DEFAULT 0,
  description TEXT,
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- CITY ACTIVITIES (seed data)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS city_activities (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  city_id     INT NOT NULL,
  name        VARCHAR(200) NOT NULL,
  type        ENUM('sightseeing','food','adventure','culture','shopping','nightlife','nature') DEFAULT 'sightseeing',
  cost        DECIMAL(10,2) DEFAULT 0,
  duration    INT DEFAULT 60,
  description TEXT,
  image_url   VARCHAR(500),
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- TRIPS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  name         VARCHAR(200) NOT NULL,
  start_date   DATE,
  end_date     DATE,
  description  TEXT,
  cover_photo  VARCHAR(500),
  is_public    TINYINT(1) DEFAULT 0,
  public_token VARCHAR(64) UNIQUE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- STOPS (cities in a trip)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stops (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  trip_id        INT NOT NULL,
  city           VARCHAR(100) NOT NULL,
  country        VARCHAR(100),
  arrival_date   DATE,
  departure_date DATE,
  order_index    INT DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- ACTIVITIES (assigned to stops)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  stop_id     INT NOT NULL,
  name        VARCHAR(200) NOT NULL,
  type        ENUM('sightseeing','food','adventure','culture','shopping','nightlife','nature') DEFAULT 'sightseeing',
  cost        DECIMAL(10,2) DEFAULT 0,
  duration    INT DEFAULT 60,
  description TEXT,
  image_url   VARCHAR(500),
  time_of_day TIME DEFAULT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- BUDGET ENTRIES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budget_entries (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  trip_id  INT NOT NULL,
  category ENUM('transport','stay','activities','meals','misc') DEFAULT 'misc',
  amount   DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes    VARCHAR(500),
  entry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- PACKING ITEMS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packing_items (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  trip_id   INT NOT NULL,
  name      VARCHAR(200) NOT NULL,
  category  ENUM('clothing','documents','electronics','toiletries','medicine','misc') DEFAULT 'misc',
  is_packed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- NOTES / JOURNAL
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  trip_id    INT NOT NULL,
  stop_id    INT DEFAULT NULL,
  title      VARCHAR(200),
  content    TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE SET NULL
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Cities
INSERT INTO cities (name, country, region, cost_index, popularity, description, image_url) VALUES
('Paris',         'France',       'Europe',        85, 98,  'The City of Light — home to the Eiffel Tower, world-class cuisine, and iconic art.', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'),
('Tokyo',         'Japan',        'Asia',          70, 97,  'A dazzling blend of ultramodern and traditional — neon lights meet ancient temples.', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'),
('New York',      'USA',          'North America', 95, 96,  'The city that never sleeps — Times Square, Central Park, and endless energy.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'),
('Bali',          'Indonesia',    'Asia',          35, 94,  'Tropical paradise with terraced rice fields, Hindu temples, and surf beaches.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'),
('Rome',          'Italy',        'Europe',        75, 93,  'The Eternal City — walk among millennia of history, art, and passion.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'),
('Barcelona',     'Spain',        'Europe',        72, 91,  'Gaudí architecture, vibrant nightlife, and the magnificent Mediterranean coast.', 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800'),
('Dubai',         'UAE',          'Middle East',   90, 90,  'Futuristic skyline, luxury shopping, and desert adventures all in one.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'),
('London',        'UK',           'Europe',        92, 95,  'Royal palaces, world-class museums, iconic red buses, and Big Ben.', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800'),
('Sydney',        'Australia',    'Oceania',       80, 89,  'Iconic Opera House, golden beaches, and laid-back Australian culture.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),
('Santorini',     'Greece',       'Europe',        88, 92,  'Whitewashed clifftop villages, sunsets over the caldera, and azure waters.', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'),
('Kyoto',         'Japan',        'Asia',          65, 88,  'Ancient temples, geisha districts, bamboo groves, and cherry blossoms.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'),
('Amsterdam',     'Netherlands',  'Europe',        80, 87,  'Canal rings, cycling culture, world-class museums, and vibrant nightlife.', 'https://static.vecteezy.com/system/resources/previews/008/354/512/large_2x/downtown-amsterdam-city-skyline-cityscape-in-netherlands-photo.jpg'),
('Maldives',      'Maldives',     'Asia',          120, 91, 'Crystal lagoons, overwater bungalows, and the world''s most pristine reefs.', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800'),
('Istanbul',      'Turkey',       'Europe/Asia',   55, 86,  'Where East meets West — bazaars, mosques, and the Bosphorus strait.', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800'),
('Bangkok',       'Thailand',     'Asia',          30, 85,  'Gilded temples, floating markets, vibrant street food, and pulsing nightlife.', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800'),
-- 🇮🇳 Indian Cities
('Mumbai',        'India',        'South Asia',    45, 92,  'The City of Dreams — Bollywood, colonial architecture, Marine Drive, and vibrant street food.', 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800'),
('New Delhi',     'India',        'South Asia',    38, 90,  'India''s capital blending Mughal grandeur, colonial boulevards, and modern energy.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'),
('Jaipur',        'India',        'South Asia',    32, 88,  'The Pink City — majestic forts, ornate palaces, vibrant bazaars, and rich Rajasthani culture.', 'https://images.unsplash.com/photo-1477587458883-47145ed31459?w=800'),
('Goa',           'India',        'South Asia',    35, 91,  'Sun, sand, and spice — golden beaches, Portuguese heritage, and legendary nightlife.', 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800'),
('Agra',          'India',        'South Asia',    28, 89,  'Home of the Taj Mahal — one of the seven wonders and a testament to eternal love.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'),
('Varanasi',      'India',        'South Asia',    22, 85,  'The spiritual heart of India — ancient ghats, sacred rituals, and timeless mysticism.', 'https://tse2.mm.bing.net/th/id/OIP.6z-eJvXtAnj70uu7NXQdwgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'),
('Bengaluru',     'India',        'South Asia',    42, 84,  'India''s Silicon Valley — tech hub with craft breweries, lush parks, and vibrant culture.', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800'),
('Kerala',        'India',        'South Asia',    30, 87,  'God''s Own Country — backwaters, tea plantations, Ayurveda, and elephant festivals.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800');

-- City Activities
INSERT INTO city_activities (city_id, name, type, cost, duration, description, image_url) VALUES
(1, 'Eiffel Tower Visit',    'sightseeing', 25.00,  120, 'Ascend the iron lady for panoramic Paris views.',          'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400'),
(1, 'Louvre Museum',         'culture',     17.00,  180, 'Home to the Mona Lisa and thousands of masterpieces.',     'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=400'),
(1, 'Seine River Cruise',    'sightseeing', 15.00,   60, 'Float past Notre Dame and iconic bridges.',                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
(1, 'Montmartre Food Tour',  'food',        45.00,  150, 'Taste cheese, wine, and pastries in the artists'' quarter.','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'),
(2, 'Shibuya Crossing',      'sightseeing',  0.00,   30, 'Experience the world''s busiest pedestrian crossing.',      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400'),
(2, 'Tsukiji Food Tour',     'food',        35.00,  120, 'Fresh sushi and seafood at the iconic market.',            'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400'),
(2, 'Mt Fuji Day Trip',      'nature',      60.00,  480, 'Journey to Japan''s sacred volcanic peak.',                'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400'),
(3, 'Central Park Stroll',   'nature',       0.00,   90, 'Green oasis in the heart of Manhattan.',                  'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400'),
(3, 'Statue of Liberty',     'sightseeing', 24.00,  180, 'Ferry to Liberty Island for iconic NYC views.',           'https://images.unsplash.com/photo-1575995872537-3793d29d972c?w=400'),
(3, 'Broadway Show',         'culture',    120.00,  150, 'World-class theatre in the Theater District.',            'https://images.unsplash.com/photo-1499375199809-d744f9f3e0a3?w=400'),
(4, 'Tanah Lot Temple',      'culture',      5.00,   90, 'Sea temple perched on a rocky outcrop at sunset.',        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400'),
(4, 'Ubud Monkey Forest',    'nature',       5.00,   60, 'Sacred forest sanctuary with hundreds of macaques.',      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'),
(4, 'Bali Cooking Class',    'food',        45.00,  180, 'Learn to cook authentic Balinese cuisine.',               'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'),
(5, 'Colosseum Tour',        'sightseeing', 18.00,  120, 'Step inside the ancient gladiatorial arena.',             'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400'),
(5, 'Vatican Museums',       'culture',     20.00,  180, 'Sistine Chapel and millennia of papal art.',              'https://images.unsplash.com/photo-1555992643-c7e990df58d0?w=400'),
(5, 'Pasta Making Class',    'food',        55.00,  150, 'Hand-craft fresh pasta with a Roman chef.',               'https://images.unsplash.com/photo-1473093226555-4ce8ed7048d6?w=400');

-- Default admin user (password: Admin@123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@traveloop.com', '$2a$10$HYdYO1oFukB6q.ClUpd/vekiliMh.cQ6ME21jPcshuMv7N8.bMAna', 'admin');
