-- =====================================================
-- VELUNA MARKET - SUPABASE DATABASE SCHEMA
-- PostgreSQL + Row Level Security (RLS)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon VARCHAR(50),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  original_price DECIMAL(12, 2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images TEXT[], -- Array of image URLs
  stock INTEGER DEFAULT 0,
  sku VARCHAR(50) UNIQUE,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);

-- =====================================================
-- 3. USERS PROFILE TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  address TEXT,
  city VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. ORDERS TABLE
-- =====================================================
CREATE TYPE order_status AS ENUM (
  'pending',      -- Kutilmoqda
  'confirmed',    -- Tasdiqlangan
  'processing',   -- Jarayonda
  'shipped',      -- Yo'lda
  'delivered',    -- Yetkazildi
  'cancelled'     -- Bekor qilindi
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping_cost DECIMAL(12, 2) DEFAULT 0,
  discount DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  
  -- Customer info (for guest checkout)
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  
  -- Shipping address
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  
  -- Payment info
  payment_method VARCHAR(50),
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- =====================================================
-- 5. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  price DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =====================================================
-- 6. CART TABLE (persistent cart)
-- =====================================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_user ON cart_items(user_id);

-- =====================================================
-- 7. BANNERS TABLE
-- =====================================================
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Public read
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

-- PRODUCTS: Public read for active products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

-- PROFILES: Users can view/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ORDERS: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ORDER ITEMS: Users can view items from their orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- CART: Users can manage their own cart
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- BANNERS: Public read
CREATE POLICY "Banners are viewable by everyone" ON banners
  FOR SELECT USING (is_active = true);

-- REVIEWS: Public read for approved reviews
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'VLN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Update product rating when review is added
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE product_id = NEW.product_id AND is_approved = true
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = NEW.product_id AND is_approved = true
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- =====================================================
-- SEED DATA (Demo mahsulotlar)
-- =====================================================

-- Categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Elektronika', 'electronics', 'Smartphone', 1),
  ('Kiyim-kechak', 'fashion', 'Shirt', 2),
  ('Uy-ro''zg''or', 'home', 'Home', 3),
  ('Sport', 'sports', 'Dumbbell', 4),
  ('Kitoblar', 'books', 'BookOpen', 5),
  ('Go''zallik', 'beauty', 'Sparkles', 6);

-- Products
INSERT INTO products (name, slug, price, original_price, category_id, image_url, stock, rating, reviews_count, is_featured) VALUES
  ('Apple iPhone 15 Pro Max', 'iphone-15-pro-max', 15999000, 17999000, 
    (SELECT id FROM categories WHERE slug = 'electronics'),
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 50, 4.8, 342, true),
  
  ('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 13499000, 14999000,
    (SELECT id FROM categories WHERE slug = 'electronics'),
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 35, 4.7, 289, true),
  
  ('MacBook Pro 14" M3', 'macbook-pro-14-m3', 28999000, 32000000,
    (SELECT id FROM categories WHERE slug = 'electronics'),
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 20, 4.9, 156, true),
  
  ('Zamonaviy Kurtka', 'zamonaviy-kurtka', 450000, 650000,
    (SELECT id FROM categories WHERE slug = 'fashion'),
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 100, 4.5, 78, false),
  
  ('Erkaklar Ko''ylagi Premium', 'erkaklar-koylagi-premium', 280000, NULL,
    (SELECT id FROM categories WHERE slug = 'fashion'),
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 150, 4.3, 45, false),
  
  ('Uy bezagi to''plami', 'uy-bezagi-toplami', 850000, 1200000,
    (SELECT id FROM categories WHERE slug = 'home'),
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800', 30, 4.6, 92, true),
  
  ('Yoga Matsi Professional', 'yoga-matsi-professional', 180000, 250000,
    (SELECT id FROM categories WHERE slug = 'sports'),
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 80, 4.7, 134, false),
  
  ('Fitnes Gantellari to''plami', 'fitnes-gantellari', 550000, NULL,
    (SELECT id FROM categories WHERE slug = 'sports'),
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 25, 4.5, 67, false),
  
  ('Bestseller Kitoblar to''plami', 'bestseller-kitoblar', 220000, 300000,
    (SELECT id FROM categories WHERE slug = 'books'),
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 200, 4.9, 412, true),
  
  ('Terini parvarish qilish to''plami', 'terini-parvarish-toplami', 420000, 550000,
    (SELECT id FROM categories WHERE slug = 'beauty'),
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', 60, 4.6, 178, true),
  
  ('AirPods Pro 2', 'airpods-pro-2', 3299000, 3599000,
    (SELECT id FROM categories WHERE slug = 'electronics'),
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800', 45, 4.8, 523, true),
  
  ('Smart Watch Ultra', 'smart-watch-ultra', 5499000, 6200000,
    (SELECT id FROM categories WHERE slug = 'electronics'),
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800', 30, 4.7, 234, false);

-- Banners
INSERT INTO banners (title, subtitle, image_url, sort_order) VALUES
  ('Yangi yil aksiyasi 🎄', '50% gacha chegirma!', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop', 1),
  ('Eng yangi smartfonlar', 'iPhone 15 va Samsung S24', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=500&fit=crop', 2),
  ('Kiyim-kechak kolleksiyasi', 'Moda va stil', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop', 3);
