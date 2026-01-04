// =====================================================
// ORDERS SERVICE - API Layer
// =====================================================

import { createClient } from '@/lib/supabase/client';
import type { Order, OrderItem, CheckoutFormData, CartItemLocal } from '@/types';

const supabase = createClient();

// Create new order
export async function createOrder(
  formData: CheckoutFormData,
  items: CartItemLocal[],
  userId?: string
): Promise<{ order: Order | null; error: string | null }> {
  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 500000 ? 0 : 30000; // Free shipping over 500,000 som
  const total = subtotal + shippingCost;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId || null,
      status: 'pending',
      payment_status: 'pending',
      subtotal,
      shipping_cost: shippingCost,
      discount: 0,
      total,
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email || null,
      shipping_address: formData.shipping_address,
      shipping_city: formData.shipping_city,
      payment_method: formData.payment_method,
      notes: formData.notes || null,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return { order: null, error: 'Buyurtma yaratishda xatolik' };
  }

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.product.image_url,
    price: item.product.price,
    quantity: item.quantity,
    total: item.product.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // Rollback order
    await supabase.from('orders').delete().eq('id', order.id);
    return { order: null, error: 'Buyurtma yaratishda xatolik' };
  }

  return { order, error: null };
}

// Get user orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }

  return data || [];
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('order_number', orderNumber)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}
