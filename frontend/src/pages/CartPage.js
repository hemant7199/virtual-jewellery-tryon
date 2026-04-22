import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { formatPrice } from '../utils/mockData';
import './CartPage.css';

export default function CartPage() {
  const { cart, setCart, user } = useApp();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const removeItem = (id) => {
    if (typeof setCart === 'function') {
      setCart(prev => prev.filter(c => c._id !== id));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 2000 ? 0 : 199;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'GLIMMR10') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try GLIMMR10 for 10% off!');
    }
  };

  const placeOrder = () => {
    if (!user) { navigate('/login'); return; }
    setOrderPlaced(true);
  };

  const iconMap = { earring:'💎', necklace:'📿', ring:'💍', bracelet:'🔮', 'nose-ring':'✦', bangle:'⭕', pendant:'🌟' };

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="order-success">
            <div className="order-success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for shopping with GLIMMR. Your order has been confirmed and will be delivered within 5-7 business days.</p>
            <div className="order-meta">
              <div className="order-meta-row"><span>Order ID</span><span>GLM-{Date.now().toString().slice(-8)}</span></div>
              <div className="order-meta-row"><span>Amount Paid</span><span className="price">{formatPrice(total)}</span></div>
              <div className="order-meta-row"><span>Delivery</span><span>5-7 Business Days</span></div>
            </div>
            <div className="order-success-actions">
              <button className="btn btn-gold btn-lg" onClick={() => navigate('/')}>Continue Shopping</button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/profile')}>View Orders</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
          <h1>Shopping Cart</h1>
          <span className="cart-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Discover our beautiful collection and find your perfect piece.</p>
            <button className="btn btn-gold btn-lg" onClick={() => navigate('/catalogue')}>Browse Collection</button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item card">
                  <div className="cart-item-thumb">
                    <span>{iconMap[item.category] || '💎'}</span>
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <div className="cart-item-meta">
                      <span className="badge badge-dark">{item.category}</span>
                      <span className="badge badge-dark">{item.material}</span>
                      <span className="badge badge-dark">{item.style}</span>
                    </div>
                    <div className="cart-item-price">{formatPrice(item.price, item.currency)}</div>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/tryon/${item._id}`, { state: { jewellery: item } })}
                    >✦ Try On</button>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeItem(item._id)}
                      title="Remove"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="summary-card card">
                <h3>Order Summary</h3>
                <div className="summary-rows">
                  <div className="summary-row"><span>Subtotal ({cart.length} items)</span><span>{formatPrice(subtotal)}</span></div>
                  {couponApplied && <div className="summary-row discount"><span>Discount (GLIMMR10)</span><span>−{formatPrice(discount)}</span></div>}
                  <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>

                {/* Coupon */}
                {!couponApplied ? (
                  <div className="coupon-row">
                    <input
                      className="input"
                      placeholder="Coupon code (try GLIMMR10)"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    />
                    <button className="btn btn-outline btn-sm" onClick={applyCoupon}>Apply</button>
                  </div>
                ) : (
                  <div className="coupon-applied">
                    <span>✓ GLIMMR10 applied — 10% off!</span>
                    <button className="coupon-remove" onClick={() => { setCouponApplied(false); setCoupon(''); }}>✕</button>
                  </div>
                )}

                <button className="btn btn-gold btn-lg checkout-btn" onClick={placeOrder}>
                  {user ? 'Place Order' : 'Sign In to Checkout'}
                </button>

                {shipping > 0 && (
                  <p className="free-shipping-hint">
                    Add {formatPrice(2000 - subtotal)} more for free shipping!
                  </p>
                )}

                <div className="summary-trust">
                  <span>🔒 Secure Payment</span>
                  <span>🚚 Free Returns</span>
                  <span>💎 Authentic</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
