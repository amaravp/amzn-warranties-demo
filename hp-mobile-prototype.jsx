import { useState, useEffect, useRef } from "react";
import React from "react";

function useImage(path) {
  var [src, setSrc] = useState(null);
  useEffect(function() {
    fetch(path)
      .then(function(r) { return r.blob(); })
      .then(function(b) { setSrc(URL.createObjectURL(b)); })
      .catch(function() { setSrc(null); });
  }, [path]);
  return src;
}

var ImgCtx = React.createContext({});

function ImageProvider({ children }) {
  var logo   = useImage("/mnt/user-data/uploads/amazon-logo.png");
  var prime  = useImage("/mnt/user-data/uploads/prime-badge.png");
  var cartE  = useImage("/mnt/user-data/uploads/cart-empty.png");
  var cartN  = useImage("/mnt/user-data/uploads/cart-number.png");
  return (
    <ImgCtx.Provider value={{ logo, prime, cartE, cartN }}>
      {children}
    </ImgCtx.Provider>
  );
}

// ─────────────────────────────────────────────
// DESIGN SYSTEM
// ─────────────────────────────────────────────
const DS = {
  color: {
    navBg: "#131921",
    subNavBg: "#232F3E",
    orange: "#FF9900",
    bg: "#EAEDED",
    surface: "#FFFFFF",
    surfaceAlt: "#F0F2F2",
    border: "#D5D9D9",
    text: "#0F1111",
    textSub: "#565959",
    textMuted: "#767676",
    textLink: "#007185",
    green: "#007600",
    red: "#B12704",
    priceCut: "#CC0C39",
    prime: "#00A8E0",
    star: "#FFA41C",
    choiceBg: "#232F3E",
    selBorder: "#146EB4",
    selBg: "#EEF5FF",
  },
  font: { body: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif" },
  r: { sm: "4px", md: "8px", pill: "20px", full: "9999px" },
};

// ─────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────
const HP = {
  titleBase: "HP 15.6 inch Laptop, HD Touchscreen Display, AMD Ryzen 3 7320U, 8 GB RAM, AMD Radeon Graphics, Windows 11 Home in S Mode",
  rating: 4.5,
  reviewCount: 1432,
  boughtPastMonth: 500,
  images: ["💻", "⌨️", "🖥️", "🖱️", "📦"],
  colorOptions: [
    { label: "Natural Silver", hex: "#C4C4C4", border: "#A0A0A0", priceDelta: 19 },
    { label: "Jet Black",      hex: "#1C1C1C", border: "#444",    priceDelta: 0  },
    { label: "Diamond White",  hex: "#F0EFE8", border: "#CECECA", priceDelta: 19 },
    { label: "Moonlight Blue", hex: "#4A6FA5", border: "#334F7A", priceDelta: 19 },
    { label: "Pale Rose Gold", hex: "#D4A5A0", border: "#B8837E", priceDelta: 19 },
    { label: "Warm Gold",      hex: "#C8A84B", border: "#A07830", priceDelta: 19 },
  ],
  cpuOptions: [
    { label: "Ryzen 5 7530U", sublabel: "6-core · up to 4.5 GHz", priceDelta: 0,   ramLocked: false },
    { label: "Ryzen 7 7730U", sublabel: "8-core · up to 4.5 GHz", priceDelta: 100, ramLocked: false },
  ],
  ramOptions: [
    { label: "8 GB",  sublabel: "DDR4-3200", priceDelta: 0  },
    { label: "12 GB", sublabel: "DDR4-3200", priceDelta: 30 },
    { label: "16 GB", sublabel: "DDR4-3200", priceDelta: 70 },
  ],
  storageOptions: [
    { label: "256 GB", priceDelta: 0   },
    { label: "512 GB", priceDelta: 50  },
    { label: "1 TB",   priceDelta: 130 },
  ],
  basePrice: 599.99,
  baseListPrice: 699.99,
  // All three tiers retained for upsell modal; detail page shows 3-Year only
  warrantyPlans: [
    { label: "2-Year Protection Plan", years: 2, rate: 0.11 },
    { label: "3-Year Protection Plan", years: 3, rate: 0.17 },
    { label: "4-Year Protection Plan", years: 4, rate: 0.23 },
  ],
  upsellProducts: [
    { emoji: "💼", name: "Microsoft 365 Personal | 12-Month Subscription | Premium Office Apps", rating: 3.0, reviews: 69,  price: 99.99 },
    { emoji: "🛡️", name: "Norton 360 for Amazon 2025, Antivirus software for up to 5 Devices with Auto Renewal", rating: 4.0, reviews: 794, price: 34.99 },
    { emoji: "🔒", name: "McAfee Total Protection 5-Device 2025 | Antivirus, VPN, Password Manager | 1 Year", rating: 4.0, reviews: 2118, price: 19.99 },
  ],
  reviews: [
    { name: "TechFan22",      rating: 5, title: "Great budget laptop!", body: "Runs smoothly for everyday tasks. Touchscreen is responsive and display is bright.", date: "Feb 10, 2025", helpful: 47 },
    { name: "StudentUser",    rating: 4, title: "Solid for school",     body: "Battery lasts a full day, light enough to carry around campus. Wish storage was larger.", date: "Jan 22, 2025", helpful: 31 },
    { name: "CasualBrowsing", rating: 4, title: "Good value",           body: "Perfect for light use — streaming, browsing, Word docs. Don't expect gaming performance.", date: "Jan 15, 2025", helpful: 18 },
  ],
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function warrantyPrice(devicePrice, rate) {
  return (Math.floor(devicePrice * rate) + 0.99).toFixed(2);
}

function Stars({ rating, count }) {
  var filled = Math.round(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: DS.color.star, fontSize: 13, letterSpacing: -1 }}>
        {"★".repeat(filled) + "☆".repeat(5 - filled)}
      </span>
      {count && <span style={{ color: DS.color.textLink, fontSize: 12 }}>{count.toLocaleString()}</span>}
    </div>
  );
}

function Divider({ my }) {
  return <div style={{ height: 1, background: DS.color.border, margin: (my !== undefined ? my : 12) + "px 0" }} />;
}

// ─────────────────────────────────────────────
// SELECTION CARDS
// ─────────────────────────────────────────────
function StorageCard({ opt, selected, onClick, price }) {
  var imgs = React.useContext(ImgCtx);
  return (
    <button onClick={function() { onClick(opt.label); }} style={{
      padding: "10px 12px", minWidth: 120, flex: "0 0 auto",
      border: selected ? ("2px solid " + DS.color.selBorder) : ("1px solid " + DS.color.border),
      borderRadius: DS.r.sm,
      background: selected ? DS.color.selBg : DS.color.surface,
      boxShadow: selected ? "0 0 0 3px rgba(20,110,180,.15)" : "none",
      fontFamily: DS.font.body, color: DS.color.text,
      cursor: "pointer", textAlign: "left", transition: "all .15s",
    }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{opt.label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
        <sup style={{ fontSize: 11, verticalAlign: "super" }}>$</sup>
        {Math.floor(price)}
        <sup style={{ fontSize: 11, verticalAlign: "super" }}>{price.toFixed(2).split(".")[1]}</sup>
      </div>
      {imgs.prime ? <img src={imgs.prime} alt="prime" style={{ height: 14, objectFit: "contain", marginBottom: 2 }} /> : <span style={{ color: "#00A8E0", fontWeight: 800, fontStyle: "italic", fontSize: 11 }}>✓prime</span>}
      <div style={{ color: DS.color.green, fontWeight: 700, fontSize: 12, marginBottom: 1 }}>In Stock</div>
      <div style={{ color: DS.color.textSub, fontSize: 12 }}>FREE Delivery</div>
      <div style={{ fontWeight: 700, fontSize: 12 }}>Tomorrow</div>
    </button>
  );
}

function ColorCard({ opt, selected, onClick }) {
  return (
    <button onClick={function() { onClick(opt.label); }} style={{
      padding: "10px 12px", minWidth: 80, flex: "0 0 auto",
      border: selected ? ("2px solid " + DS.color.selBorder) : ("1px solid " + DS.color.border),
      borderRadius: DS.r.sm,
      background: selected ? DS.color.selBg : DS.color.surface,
      boxShadow: selected ? "0 0 0 3px rgba(20,110,180,.15)" : "none",
      fontFamily: DS.font.body, color: DS.color.text,
      cursor: "pointer", textAlign: "left", transition: "all .15s",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: DS.r.sm,
        background: opt.hex, border: "1px solid " + opt.border,
        marginBottom: 6, boxShadow: "inset 0 1px 3px rgba(0,0,0,.12)",
      }} />
      <div style={{ fontWeight: 700, fontSize: 12 }}>{opt.label}</div>
    </button>
  );
}

// ─────────────────────────────────────────────
// BUTTONS
// ─────────────────────────────────────────────
function AddToCartBtn({ added, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "12px", borderRadius: DS.r.pill,
      border: "1px solid #a88734",
      background: added ? "linear-gradient(to bottom,#c8e6c9,#a5d6a7)" : "linear-gradient(to bottom,#f7e6b0,#f5c518)",
      fontFamily: DS.font.body, fontSize: 15, fontWeight: 700,
      color: DS.color.text, cursor: "pointer", transition: "all .2s",
    }}>
      {added ? "✓ Added to Cart" : "Add to Cart"}
    </button>
  );
}

function BuyNowBtn() {
  return (
    <button style={{
      width: "100%", padding: "12px", borderRadius: DS.r.pill,
      border: "1px solid #a88734",
      background: "linear-gradient(to bottom,#f5a623,#e59700)",
      fontFamily: DS.font.body, fontSize: 15, fontWeight: 700,
      color: DS.color.text, cursor: "pointer",
    }}>
      Buy Now
    </button>
  );
}

// ─────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid " + DS.color.border, overflowX: "auto" }}>
      {tabs.map(function(t) {
        return (
          <button key={t} onClick={function() { onChange(t); }} style={{
            flex: "0 0 auto", padding: "10px 16px",
            background: "transparent", border: "none",
            borderBottom: active === t ? ("3px solid " + DS.color.orange) : "3px solid transparent",
            fontFamily: DS.font.body, fontSize: 13,
            fontWeight: active === t ? 700 : 400,
            color: active === t ? DS.color.text : DS.color.textSub,
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// SELECTOR CARDS — generic config option
// ─────────────────────────────────────────────
function ConfigCard({ label, sublabel, price, selected, onClick, disabled }) {
  return (
    <button onClick={function() { if (!disabled) onClick(label); }} style={{
      padding: "10px 12px", minWidth: 100, flex: "0 0 auto",
      border: selected ? ("2px solid " + DS.color.selBorder) : ("1px solid " + (disabled ? "#E8E8E8" : DS.color.border)),
      borderRadius: DS.r.sm,
      background: disabled ? "#F8F8F8" : (selected ? DS.color.selBg : DS.color.surface),
      boxShadow: selected ? "0 0 0 3px rgba(20,110,180,.15)" : "none",
      fontFamily: DS.font.body, color: disabled ? DS.color.textMuted : DS.color.text,
      cursor: disabled ? "not-allowed" : "pointer",
      textAlign: "left", transition: "all .15s",
    }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: disabled ? DS.color.textMuted : DS.color.textSub, marginBottom: 3 }}>{sublabel}</div>}
      {price !== undefined && (
        <div style={{ fontSize: 13, fontWeight: 700, color: DS.color.text }}>
          {"$" + Math.floor(price) + "." + price.toFixed(2).split(".")[1]}
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────
// TAB PANELS
// ─────────────────────────────────────────────
function ProductTab({ color, setColor, storage, setStorage, currentPrice, currentListPrice, warrantyChecked, setWarrantyChecked, onLearnMoreWarranty, added, onAddToCart, ctaRef }) {
  var imgs = React.useContext(ImgCtx);
  var selectedColorOpt   = HP.colorOptions.find(function(o) { return o.label === color; })   || HP.colorOptions[0];
  var selectedStorageOpt = HP.storageOptions.find(function(o) { return o.label === storage; }) || HP.storageOptions[0];
  var discount = Math.round((1 - currentPrice / currentListPrice) * 100);
  var threeYear = HP.warrantyPlans.find(function(p) { return p.years === 3; });
  var wPrice = warrantyPrice(currentPrice, threeYear.rate);

  return (
    <div style={{ padding: 16 }}>
      {/* Price */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: DS.color.priceCut, fontWeight: 700, fontSize: 15 }}>{"-" + discount + "%"}</span>
          <span style={{ fontSize: 28, fontWeight: 700 }}>
            {"$" + Math.floor(currentPrice) + "." + currentPrice.toFixed(2).split(".")[1]}
          </span>
        </div>
        <div style={{ fontSize: 12, color: DS.color.textSub }}>
          {"List Price: "}<span style={{ textDecoration: "line-through" }}>{"$" + currentListPrice.toFixed(2)}</span>
        </div>
        <div style={{ fontSize: 12, color: DS.color.textSub, marginTop: 2 }}>
          {"Or $" + (currentPrice / 12).toFixed(2) + "/mo (12 mo). "}
          <span style={{ color: DS.color.textLink }}>Select from 3 plans</span>
        </div>
      </div>

      {/* Delivery */}
      <div style={{ marginBottom: 12, fontSize: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          {imgs.prime ? <img src={imgs.prime} alt="prime" style={{ height: 14, objectFit: "contain" }} /> : <span style={{ color: "#00A8E0", fontWeight: 800, fontStyle: "italic", fontSize: 11 }}>✓prime</span>}
          <span style={{ fontWeight: 700 }}>Tomorrow</span>
        </div>
        <div style={{ marginBottom: 2 }}>{"FREE delivery "}<strong>Tomorrow, March 1</strong>{". Order within "}<span style={{ color: DS.color.green }}>1 hr 14 mins</span></div>
        <div style={{ color: DS.color.textLink }}>{"📍 Deliver to Amara - Aurora 80011"}</div>
      </div>

      <span style={{ color: DS.color.green, fontWeight: 700, fontSize: 13 }}>In Stock</span>

      <div ref={ctaRef} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, marginBottom: 16 }}>
        <AddToCartBtn added={added} onClick={onAddToCart} />
        <BuyNowBtn />
      </div>

      {/* 1 — Color */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, marginBottom: 8 }}>{"Color: "}<strong>{color}</strong></div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {HP.colorOptions.map(function(opt) {
            return <ColorCard key={opt.label} opt={opt} selected={opt.label === color} onClick={setColor} />;
          })}
        </div>
      </div>

      {/* 2 — Storage */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, marginBottom: 8 }}>{"Storage: "}<strong>{storage}</strong></div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {HP.storageOptions.map(function(opt) {
            var p = HP.basePrice + selectedColorOpt.priceDelta + opt.priceDelta;
            return <StorageCard key={opt.label} opt={opt} price={p} selected={opt.label === storage} onClick={setStorage} />;
          })}
        </div>
      </div>

      {/* Seller info */}
      <div style={{ marginBottom: 4 }}>
        {[["Ships from", "Amazon", false], ["Sold by", "Amazon.com", false], ["Returns", "FREE 30-day refund", true], ["Payment", "Secure transaction", true]].map(function(row) {
          return (
            <div key={row[0]} style={{ display: "flex", gap: 16, fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: DS.color.textSub, minWidth: 80 }}>{row[0]}</span>
              <span style={{ color: row[2] ? DS.color.textLink : DS.color.text, fontWeight: row[2] ? 400 : 700 }}>{row[1]}</span>
            </div>
          );
        })}
        <div style={{ color: DS.color.textLink, fontSize: 13, marginTop: 4 }}>▾ See more</div>
      </div>

      <Divider />

      {/* Protection plan */}
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Add a Protection Plan</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          checked={warrantyChecked}
          onChange={function(e) { setWarrantyChecked(e.target.checked); }}
          style={{ width: 16, height: 16, accentColor: DS.color.selBorder, cursor: "pointer", flexShrink: 0 }}
        />
        <button
          onClick={onLearnMoreWarranty}
          style={{ background: "none", border: "none", padding: 0, color: DS.color.textLink, fontSize: 13, cursor: "pointer", fontFamily: DS.font.body, textAlign: "left", flex: 1 }}
        >
          3-Year Protection Plan
        </button>
        <span style={{ color: DS.color.red, fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>{"$" + wPrice}</span>
      </div>
    </div>
  );
}

function AboutSection() {
  var bullets = [
    { label: "MICRO-EDGE HD TOUCHSCREEN DISPLAY", text: "Reach out and control your PC with just pinch, tap, or swipe, for a totally intuitive experience with flicker-free, 1366 x 768 resolution visuals" },
    { label: "AMD RYZEN PROCESSOR", text: "Experience acceleration for your work and creativity in a laptop powered by an AMD Ryzen 3 processor and boosted with incredible battery life" },
    { label: "AMD RADEON GRAPHICS", text: "Experience high performance for all your entertainment whether it's games or movies" },
    { label: "STORAGE AND MEMORY", text: "128 GB PCIe NVMe M.2 SSD performs up to 15x faster than a traditional hard drive; and 8 GB LPDDR5 RAM memory is power efficient and provides speedy, responsive performance" },
    { label: "WINDOWS 11 HOME IN S MODE", text: "Experience the most secure Windows ever built with added protection against phishing and malware" },
    { label: "ONE-TOUCH ACCESS TO MICROSOFT COPILOT", text: "Kickstart your creativity and productivity with intelligent assistance and relevant answers by pressing the Copilot button on your keyboard" },
    { label: "ENSURE YOUR PRIVACY", text: "Hide your private moments with a visible, physical camera shutter that turns off your PC's camera when not in use and a dedicated microphone mute button clearly indicated by an active LED light" },
  ];
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>About this item</div>
      {bullets.map(function(b) {
        return (
          <div key={b.label} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>•</span>
            <span style={{ fontSize: 14, lineHeight: 1.5 }}>
              <strong>{b.label + " - "}</strong>{b.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ProductDescriptionSection() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Product description</div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: DS.color.text, margin: 0 }}>
        The HP 15.6 inch Laptop is designed to have your back with a reliable AMD processor and integrated Radeon graphics for assembling creative work projects or wowing your friends with HD resolution entertainment on the anti-glare touch display. Collaborate on group projects with a high quality camera, noise reduction software, and easy access to helpful AI technology. Long-lasting battery life and HP Fast Charge help you stay in the productive zone longer. Whether in your comfy spot at home or on-the-go, this HP 15.6 Laptop gives you a great view of your content and offers plenty of ports for connecting your additional devices. The HP 15.6 Laptop comes with a 45 W AC power adapter and goes from 0 to 50% charge in 45 minutes. Plus, it contains recycled materials and is EPEAT Gold registered and ENERGY STAR Certified. HP is here to help. This HP computer comes with 1-year limited hardware warranty and 90-days limited technical support for software and initial setup with 24-hour, 7 days a week web support when shipped from and sold by Amazon.com.
      </p>
    </div>
  );
}

function TechSpecsSection({ color, storage }) {
  var specs = [
    ["Brand",                       "HP"],
    ["Model Name",                  "HP Laptop 15-fc0099nr"],
    ["Screen Size",                 "15.6 Inches"],
    ["Color",                       color],
    ["Hard Disk Size",              storage],
    ["CPU Model",                   "Ryzen 3"],
    ["Ram Memory Installed Size",   "8 GB"],
    ["Operating System",            "Windows 11 Home"],
    ["Special Feature",             "1 USB Type-C 5Gbps signaling rate (supports data transfer only and does not support charging or external monitors); 2 USB Type-A 3.2 Gen 1 ports; 1 HDMI 1.4b; 1 headphone/microphone combo"],
    ["Graphics Card Description",   "Integrated"],
  ];
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Technical specifications</div>
      {specs.map(function(row) {
        return (
          <div key={row[0]} style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 14, fontWeight: 700, minWidth: 120, flexShrink: 0, lineHeight: 1.5 }}>{row[0]}</span>
            <span style={{ fontSize: 14, color: DS.color.text, lineHeight: 1.5 }}>{row[1]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ReviewsSection() {
  var dist = [68, 20, 7, 3, 2];
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Customer reviews</div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{HP.rating}</div>
          <Stars rating={HP.rating} />
          <div style={{ fontSize: 11, color: DS.color.textMuted, marginTop: 2 }}>out of 5</div>
        </div>
        <div style={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map(function(star, i) {
            return (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: DS.color.textLink, minWidth: 32 }}>{star + " star"}</span>
                <div style={{ flex: 1, height: 10, background: DS.color.border, borderRadius: DS.r.full, overflow: "hidden" }}>
                  <div style={{ width: dist[i] + "%", height: "100%", background: DS.color.star }} />
                </div>
                <span style={{ fontSize: 11, color: DS.color.textLink, minWidth: 28 }}>{dist[i] + "%"}</span>
              </div>
            );
          })}
        </div>
      </div>
      <Divider my={8} />
      {HP.reviews.map(function(r, i) {
        return (
          <div key={i} style={{ paddingBottom: 14, borderBottom: "1px solid " + DS.color.border, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <strong style={{ fontSize: 13 }}>{r.name}</strong>
              <span style={{ fontSize: 11, color: DS.color.textMuted }}>{r.date}</span>
            </div>
            <Stars rating={r.rating} />
            <div style={{ fontWeight: 700, fontSize: 13, margin: "4px 0 2px" }}>{r.title}</div>
            <div style={{ fontSize: 13, color: DS.color.textSub, marginBottom: 6 }}>{r.body}</div>
            <div style={{ fontSize: 11, color: DS.color.textMuted }}>
              {r.helpful + " people found this helpful\u00a0\u00a0"}
              <button style={{
                background: "none", border: "1px solid " + DS.color.border,
                padding: "2px 8px", borderRadius: DS.r.sm, cursor: "pointer",
                fontSize: 11, fontFamily: DS.font.body,
              }}>Helpful</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// WARRANTY DETAIL DRAWER
// ─────────────────────────────────────────────
function WarrantyDetailDrawer({ open, onClose, devicePrice, onAddProtection }) {
  if (!open) return null;
  var threeYear = HP.warrantyPlans.find(function(p) { return p.years === 3; });
  var wPrice = warrantyPrice(devicePrice, threeYear.rate);
  var bullets = [
    { label: "No Additional Cost:", text: "You pay nothing for repairs — parts, labor, and shipping included." },
    { label: "Coverage:", text: "Plan starts on the date of purchase. Drops, spills and cracked screens due to normal use are covered from day one. Malfunctions are covered by the plan after the manufacturer's warranty ends (typical laptop warranties last 1 year — consult your laptop warranty term). Real experts are available 24/7 to help with set-up, connectivity issues, troubleshooting and much more." },
    { label: "Easy Claims Process:", text: "File a claim anytime online or by phone. Most claims approved within minutes. If we can't repair it, we'll send you an Amazon e-gift card for the purchase price of your covered product or replace it." },
    { label: "Product Eligibility:", text: "Plan must be purchased with a product or within 30 days of the product purchase. Pre-existing conditions are not covered." },
    { label: "Terms & Details:", text: "More information about this protection plan is available within the \"Product guides and documents\" section. Simply click \"User Guide\" for more info. Terms & Conditions will be available in Your Orders on Amazon. Asurion will also email your plan confirmation with Terms & Conditions to the address associated with your Amazon account within 24 hours of purchase." },
  ];
  return (
    <div
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "flex-end" }}
    >
      <div style={{
        background: DS.color.surface, width: "100%", maxWidth: 393, margin: "0 auto",
        borderRadius: "16px 16px 0 0", maxHeight: "92vh", overflowY: "auto",
        animation: "sheetUp .25s ease",
      }}>
        {/* Sticky header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px 14px", borderBottom: "1px solid " + DS.color.border,
          position: "sticky", top: 0, background: DS.color.surface, zIndex: 1,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Add to your order</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 22,
            cursor: "pointer", color: DS.color.text, padding: 4, lineHeight: 1,
          }}>✕</button>
        </div>

        <div style={{ padding: "16px 16px 24px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>3-Year Laptop Protection Plan</div>
          <div style={{ fontSize: 12, color: DS.color.textSub, marginBottom: 4 }}>from Asurion, LLC</div>
          <Stars rating={4.4} count={1064} />
          <div style={{ fontSize: 22, fontWeight: 700, margin: "6px 0 12px" }}>{"$" + wPrice}</div>

          <div style={{ marginBottom: 16 }}>
            {bullets.map(function(b) {
              return (
                <div key={b.label} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 13, lineHeight: 1.5 }}>
                    <strong>{b.label}</strong>{" " + b.text}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={{ color: DS.color.textLink, fontSize: 13, cursor: "pointer" }}>Learn more</span>
          </div>

          <button
            onClick={function() { onAddProtection(); onClose(); }}
            style={{
              width: "100%", padding: "13px", marginBottom: 10,
              borderRadius: DS.r.pill, border: "1px solid #a88734",
              background: "linear-gradient(to bottom,#f7e6b0,#f5c518)",
              fontFamily: DS.font.body, fontSize: 15, fontWeight: 700,
              color: DS.color.text, cursor: "pointer",
            }}
          >
            Add protection
          </button>
          <button onClick={onClose} style={{
            width: "100%", padding: "13px",
            borderRadius: DS.r.pill, border: "1px solid " + DS.color.border,
            background: "transparent",
            fontFamily: DS.font.body, fontSize: 14, color: DS.color.text, cursor: "pointer",
          }}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// UPSELL DRAWER
// ─────────────────────────────────────────────
function UpsellDrawer({ open, onClose, devicePrice, onAddWithWarranty, onAddWithout, onRemoveWarranty }) {
  var [selectedWarranty, setSelectedWarranty] = useState(null);
  var [selectedAllDevices, setSelectedAllDevices] = useState(false);
  var [expandedPlans, setExpandedPlans] = useState({});
  var [warrantyAdded, setWarrantyAdded] = useState(false);
  var [addedWarrantyLabel, setAddedWarrantyLabel] = useState("");
  var [addedWarrantyPrice, setAddedWarrantyPrice] = useState("");

  useEffect(function() {
    if (open) {
      setSelectedWarranty(null);
      setSelectedAllDevices(false);
      setExpandedPlans({});
      setWarrantyAdded(false);
      setAddedWarrantyLabel("");
      setAddedWarrantyPrice("");
    }
  }, [open]);

  if (!open) return null;

  function toggleWarranty(years) {
    setSelectedWarranty(selectedWarranty === years ? null : years);
    setSelectedAllDevices(false);
  }

  function toggleExpand(key) {
    setExpandedPlans(function(prev) {
      var next = Object.assign({}, prev);
      next[key] = !prev[key];
      return next;
    });
  }

  var planBullets = {
    2: [
      { label: "No Additional Cost:", text: "You pay nothing for repairs — parts, labor, and shipping included." },
      { label: "Coverage:", text: "Plan starts on the date of purchase. Malfunctions are covered after the manufacturer's warranty ends. Real experts available 24/7 for set-up, connectivity, and troubleshooting." },
      { label: "Easy Claims Process:", text: "File a claim anytime online or by phone. Most claims approved within minutes. If we can't repair it, we'll send you an Amazon e-gift card or replace it." },
      { label: "Product Eligibility:", text: "Must be purchased with a product or within 30 days. Pre-existing conditions not covered." },
    ],
    3: [
      { label: "No Additional Cost:", text: "You pay nothing for repairs — parts, labor, and shipping included." },
      { label: "Coverage:", text: "Plan starts on the date of purchase. Drops, spills and cracked screens are covered from day one. Malfunctions covered after the manufacturer's warranty ends (typically 1 year). Real experts available 24/7." },
      { label: "Easy Claims Process:", text: "File a claim anytime online or by phone. Most claims approved within minutes. If we can't repair it, we'll send you an Amazon e-gift card or replace it." },
      { label: "Product Eligibility:", text: "Must be purchased with a product or within 30 days. Pre-existing conditions not covered." },
    ],
    4: [
      { label: "No Additional Cost:", text: "You pay nothing for repairs — parts, labor, and shipping included." },
      { label: "Coverage:", text: "Plan starts on the date of purchase. Drops, spills and cracked screens are covered from day one. Malfunctions covered after the manufacturer's warranty ends. Real experts available 24/7 for set-up, connectivity, troubleshooting and much more." },
      { label: "Easy Claims Process:", text: "File a claim anytime online or by phone. Most claims approved within minutes. If we can't repair it, we'll send you an Amazon e-gift card for the purchase price or replace it." },
      { label: "Product Eligibility:", text: "Must be purchased with a product or within 30 days of purchase. Pre-existing conditions not covered." },
      { label: "Terms & Details:", text: "Terms & Conditions available in Your Orders on Amazon. Asurion will email plan confirmation within 24 hours of purchase." },
    ],
    complete: [
      { label: "Extensive Coverage:", text: "Protection for all your eligible products purchased from Amazon. (Note: Products used commercially or for a business are excluded)" },
      { label: "Exceptional Protection:", text: "Including malfunctions and failures, plus drops or spills for eligible portable items." },
      { label: "Past & Future Purchases Covered:", text: "You're protected on eligible items purchased within the last year and new purchases going forward, including this purchase -- starting 30 days after enrollment." },
      { label: "Quick & Easy Claims:", text: "File in minutes at Asurion.com/amazon. We'll repair, replace, or reimburse you up to the purchase price (excluding tax)." },
      { label: "No Hidden Fees:", text: "You're covered for up to $5,000 in total claims per 12-month period. Cancel anytime — your plan renews monthly until canceled (coupons applied at checkout do not renew monthly)." },
    ],
  };

  return (
    <div
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,.55)",
        display: "flex", alignItems: "flex-end",
      }}
    >
      <div style={{
        background: DS.color.surface,
        width: "100%", maxWidth: 393, margin: "0 auto",
        borderRadius: "16px 16px 0 0",
        maxHeight: "92vh", overflowY: "auto",
        animation: "sheetUp .25s ease",
      }}>

        {/* Header */}
        <div style={{ borderRadius: "16px 16px 0 0", padding: "16px 16px 14px", borderBottom: "1px solid " + DS.color.border, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 32 }}>💻</span>
            {warrantyAdded && <span style={{ fontSize: 32 }}>🛡️</span>}
          </div>
          <span style={{ color: DS.color.green, fontWeight: 700, fontSize: 15, flex: 1 }}>✓ Added to your cart</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 22,
            cursor: "pointer", color: DS.color.textSub, padding: 4, lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 16px" }}>

          {/* Warranty section — collapses once added */}
          {!warrantyAdded && (
            <div>
              {/* Benefits */}
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Add to your order</div>
              {[
                { icon: "🔧", text: "Coverage for accidental damage including drops, spills, and broken parts, as well as breakdowns (plans vary)" },
                { icon: "🎧", text: "24/7 support when you need it" },
                { icon: "⚡", text: "Quick, easy, and frustration-free claims" },
              ].map(function(b) {
                return (
                  <div key={b.text} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{b.icon}</span>
                    <span style={{ fontSize: 13, color: DS.color.text, lineHeight: 1.5 }}>{b.text}</span>
                  </div>
                );
              })}

              {/* Cover this product */}
              <div style={{ fontSize: 13, color: DS.color.textSub, marginBottom: 10 }}>Cover this product:</div>
              <div style={{ border: "1px solid " + DS.color.border, borderRadius: DS.r.sm, overflow: "hidden", marginBottom: 20 }}>
                {HP.warrantyPlans.slice().reverse().map(function(plan, i) {
                  var price = warrantyPrice(devicePrice, plan.rate);
                  var isChecked = selectedWarranty === plan.years;
                  var isExpanded = !!expandedPlans[plan.years];
                  var bullets = planBullets[plan.years] || [];
                  return (
                    <div key={plan.years} style={{ borderTop: i > 0 ? ("1px solid " + DS.color.border) : "none" }}>
                      <div
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "14px 14px",
                          background: isChecked ? DS.color.selBg : DS.color.surface,
                          cursor: "pointer",
                        }}
                        onClick={function() { toggleWarranty(plan.years); setSelectedAllDevices(false); }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={function() { toggleWarranty(plan.years); setSelectedAllDevices(false); }}
                          style={{ width: 18, height: 18, accentColor: DS.color.selBorder, cursor: "pointer", flexShrink: 0 }}
                          onClick={function(e) { e.stopPropagation(); }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{plan.label}</div>
                          <div style={{ fontSize: 14, marginTop: 2 }}>{"$" + price}</div>
                          <button
                            onClick={function(e) { e.stopPropagation(); toggleExpand(plan.years); }}
                            style={{ background: "none", border: "none", padding: 0, color: DS.color.textLink, fontSize: 13, cursor: "pointer", fontFamily: DS.font.body, marginTop: 2 }}
                          >
                            {isExpanded ? "Learn less ▴" : "Learn more ▾"}
                          </button>
                        </div>
                        <div style={{ background: "#F0F0F8", borderRadius: DS.r.sm, padding: "6px 10px", textAlign: "center", flexShrink: 0, border: "1px solid #DDD" }}>
                          <div style={{ fontSize: 9, color: "#5A5AE0", fontWeight: 700, letterSpacing: 0.5 }}>asurion</div>
                          <div style={{ fontSize: 9, color: "#5A5AE0" }}>protection</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: DS.color.text, marginTop: 2 }}>{plan.years + " YEAR"}</div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div style={{ padding: "8px 14px 14px 44px", background: DS.color.surfaceAlt, borderTop: "1px solid " + DS.color.border }}>
                          {bullets.map(function(b) {
                            return (
                              <div key={b.label} style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "flex-start" }}>
                                <span style={{ fontSize: 13, flexShrink: 0, lineHeight: 1.5 }}>•</span>
                                <span style={{ fontSize: 12, lineHeight: 1.5, color: DS.color.text }}>
                                  <strong>{b.label}</strong>{" " + b.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cover all eligible devices */}
              <div style={{ fontSize: 13, color: DS.color.textSub, marginBottom: 10 }}>Cover all of your eligible devices:</div>
              <div style={{ border: "1px solid " + DS.color.border, borderRadius: DS.r.sm, overflow: "hidden", marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 14px",
                    background: selectedAllDevices ? DS.color.selBg : DS.color.surface,
                    cursor: "pointer",
                  }}
                  onClick={function() { setSelectedAllDevices(!selectedAllDevices); if (!selectedAllDevices) setSelectedWarranty(null); }}
                >
                  <input
                    type="checkbox"
                    checked={selectedAllDevices}
                    onChange={function() { setSelectedAllDevices(!selectedAllDevices); if (!selectedAllDevices) setSelectedWarranty(null); }}
                    style={{ width: 18, height: 18, accentColor: DS.color.selBorder, cursor: "pointer", flexShrink: 0 }}
                    onClick={function(e) { e.stopPropagation(); }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 2 }}>
                      Complete Protect: One simple plan covers all eligible past & future Amazon Purchases
                    </div>
                    <div style={{ fontSize: 14, marginTop: 2 }}>$16.99/month</div>
                    <button
                      onClick={function(e) { e.stopPropagation(); toggleExpand("complete"); }}
                      style={{ background: "none", border: "none", padding: 0, color: DS.color.textLink, fontSize: 13, cursor: "pointer", fontFamily: DS.font.body, marginTop: 2 }}
                    >
                      {expandedPlans["complete"] ? "Learn less ▴" : "Learn more ▾"}
                    </button>
                  </div>
                  <div style={{
                    background: "linear-gradient(135deg, #C850C0, #7B2FF7)",
                    borderRadius: DS.r.sm, padding: "8px 10px",
                    textAlign: "center", flexShrink: 0, minWidth: 64,
                  }}>
                    <div style={{ fontSize: 18, color: "#fff", marginBottom: 2 }}>🛡️</div>
                    <div style={{ fontSize: 8, color: "#fff", fontWeight: 700, lineHeight: 1.3 }}>Complete</div>
                    <div style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>Protect</div>
                  </div>
                </div>
                {expandedPlans["complete"] && (
                  <div style={{ padding: "8px 14px 14px 44px", background: DS.color.surfaceAlt, borderTop: "1px solid " + DS.color.border }}>
                    {planBullets.complete.map(function(b) {
                      return (
                        <div key={b.label} style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 13, flexShrink: 0, lineHeight: 1.5 }}>•</span>
                          <span style={{ fontSize: 12, lineHeight: 1.5, color: DS.color.text }}>
                            <strong>{b.label}</strong>{" " + b.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CTAs */}
              <button
                onClick={function() {
                  if (selectedWarranty || selectedAllDevices) {
                    var plan = HP.warrantyPlans.find(function(p) { return p.years === selectedWarranty; });
                    var label = selectedAllDevices ? "Complete Protect" : plan.label;
                    var price = selectedAllDevices ? "16.99/mo" : warrantyPrice(devicePrice, plan.rate);
                    setAddedWarrantyLabel(label);
                    setAddedWarrantyPrice(price);
                    setWarrantyAdded(true);
                    onAddWithWarranty(selectedWarranty);
                  }
                }}
                disabled={!selectedWarranty && !selectedAllDevices}
                style={{
                  width: "100%", padding: "13px", marginBottom: 10,
                  borderRadius: DS.r.pill, border: "1px solid #a88734",
                  background: (selectedWarranty || selectedAllDevices)
                    ? "linear-gradient(to bottom,#f7e6b0,#f5c518)"
                    : DS.color.surfaceAlt,
                  fontFamily: DS.font.body, fontSize: 15, fontWeight: 700,
                  color: (selectedWarranty || selectedAllDevices) ? DS.color.text : DS.color.textMuted,
                  cursor: (selectedWarranty || selectedAllDevices) ? "pointer" : "default",
                  transition: "all .15s",
                }}
              >
                {selectedAllDevices
                  ? "Add protection — $16.99/mo"
                  : selectedWarranty
                    ? ("Add protection — $" + warrantyPrice(devicePrice, HP.warrantyPlans.find(function(p) { return p.years === selectedWarranty; }).rate))
                    : "Add protection"}
              </button>
              <button onClick={onAddWithout} style={{
                width: "100%", padding: "13px", marginBottom: 20,
                borderRadius: DS.r.pill, border: "1px solid " + DS.color.border,
                background: "transparent",
                fontFamily: DS.font.body, fontSize: 14, color: DS.color.text, cursor: "pointer",
              }}>
                No thanks
              </button>
            </div>
          )}
          {/* Go to checkout — shown after warranty added */}
          {warrantyAdded && (
            <div style={{ marginBottom: 20 }}>
              <button onClick={onClose} style={{
                width: "100%", padding: "13px",
                borderRadius: DS.r.pill, border: "1px solid #a88734",
                background: "linear-gradient(to bottom,#f7e6b0,#f5c518)",
                fontFamily: DS.font.body, fontSize: 15, fontWeight: 700,
                color: DS.color.text, cursor: "pointer",
              }}>
                Go to your cart
              </button>
            </div>
          )}

          {/* Discover additional products — always shown */}
          <div style={{ fontSize: 18, fontWeight: 700, color: DS.color.text, marginBottom: 14 }}>Discover additional products</div>
          <div style={{ marginBottom: 20 }}>
            {HP.upsellProducts.map(function(p) {
              return (
                <div key={p.name} style={{
                  display: "flex", gap: 12, marginBottom: 16,
                  paddingBottom: 16, borderBottom: "1px solid " + DS.color.border,
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: DS.r.sm,
                    background: DS.color.surfaceAlt, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 28, flexShrink: 0, border: "1px solid " + DS.color.border,
                  }}>{p.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: DS.color.textLink, fontSize: 13, lineHeight: 1.4, marginBottom: 4 }}>{p.name}</div>
                    <Stars rating={p.rating} count={p.reviews} />
                    <div style={{ fontWeight: 700, fontSize: 14, margin: "4px 0 8px" }}>{"$" + p.price.toFixed(2)}</div>
                    <button style={{
                      padding: "6px 16px", borderRadius: DS.r.pill,
                      border: "1px solid #a88734",
                      background: "linear-gradient(to bottom,#f7e6b0,#f5c518)",
                      fontFamily: DS.font.body, fontSize: 13, fontWeight: 700,
                      color: DS.color.text, cursor: "pointer",
                    }}>Add to cart</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
function HPMobilePrototypeInner() {
  var imgs = React.useContext(ImgCtx);
  var [activeImage, setActiveImage] = useState(0);
  var [color, setColor] = useState("Jet Black");
  var [storage, setStorage] = useState("256 GB");
  var [added, setAdded] = useState(false);
  var [cartCount, setCartCount] = useState(2);
  var [warrantyChecked, setWarrantyChecked] = useState(false);
  var [upsellOpen, setUpsellOpen] = useState(false);
  var [warrantyDetailOpen, setWarrantyDetailOpen] = useState(false);
  var [showStickyFooter, setShowStickyFooter] = useState(false);
  var ctaRef = useRef(null);

  useEffect(function() {
    var observer = new IntersectionObserver(
      function(entries) { setShowStickyFooter(!entries[0].isIntersecting); },
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return function() { observer.disconnect(); };
  }, []);

  useEffect(function() { setAdded(false); setWarrantyChecked(false); }, [color, storage]);

  var selectedColor   = HP.colorOptions.find(function(c) { return c.label === color; })   || HP.colorOptions[0];
  var selectedStorage = HP.storageOptions.find(function(s) { return s.label === storage; }) || HP.storageOptions[0];

  var currentPrice     = HP.basePrice     + selectedColor.priceDelta + selectedStorage.priceDelta;
  var currentListPrice = HP.baseListPrice + selectedColor.priceDelta + selectedStorage.priceDelta + 50;
  var currentStorage = { price: currentPrice, listPrice: currentListPrice };

  function handleAddToCart() {
    if (!warrantyChecked) {
      setUpsellOpen(true);
    } else {
      setAdded(true);
      setCartCount(function(c) { return c + 1; });
    }
  }

  function handleUpsellAddWithWarranty(years) {
    setWarrantyChecked(true);
    setAdded(true);
    setCartCount(function(c) { return c + 1; });
  }

  function handleUpsellAddWithout() {
    setUpsellOpen(false);
    setAdded(true);
    setCartCount(function(c) { return c + 1; });
  }

  function handleRemoveWarranty() {
    setWarrantyChecked(false);
    setCartCount(function(c) { return c - 1; });
  }

  return (
    <div style={{
      fontFamily: DS.font.body, background: DS.color.bg,
      minHeight: "100vh", color: DS.color.text,
      maxWidth: 393, margin: "0 auto",
      position: "relative", boxShadow: "0 0 60px rgba(0,0,0,.15)",
    }}>
      <style>{"\
        @import url('https://fonts.cdnfonts.com/css/amazon-ember');\
        @keyframes slideDown { from { opacity:0; transform:translateX(-50%) translateY(-10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }\
        @keyframes sheetUp  { from { transform:translateY(60px); opacity:0; } to { transform:translateY(0); opacity:1; } }\
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }\
        button { outline:none; }\
        ::-webkit-scrollbar { display:none; }\
      "}</style>

      <WarrantyDetailDrawer
        open={warrantyDetailOpen}
        onClose={function() { setWarrantyDetailOpen(false); }}
        devicePrice={currentStorage.price}
        onAddProtection={function() { setWarrantyChecked(true); }}
      />

      <UpsellDrawer
        open={upsellOpen}
        onClose={function() { setUpsellOpen(false); }}
        devicePrice={currentStorage.price}
        onAddWithWarranty={handleUpsellAddWithWarranty}
        onAddWithout={handleUpsellAddWithout}
        onRemoveWarranty={handleRemoveWarranty}
      />

      {/* NAVBAR */}
      <div style={{
        background: DS.color.navBg, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        {imgs.logo
          ? <img src={imgs.logo} alt="Amazon" style={{ height: 28, objectFit: "contain" }} />
          : <svg width="80" height="28" viewBox="0 0 120 38" fill="none"><text x="0" y="26" fontFamily="Arial" fontStyle="italic" fontWeight="800" fontSize="28" fill="white">amazon</text><path d="M8 32 Q60 42 112 32" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round"/><polygon points="108,29 114,32 108,35" fill="#FF9900"/></svg>
        }
        <div style={{ flex: 1, display: "flex", background: "#fff", borderRadius: DS.r.sm, overflow: "hidden" }}>
          <input placeholder="Search Amazon" style={{
            flex: 1, border: "none", padding: "7px 10px", fontSize: 13,
            fontFamily: DS.font.body, outline: "none",
          }} />
          <button style={{ background: DS.color.orange, border: "none", padding: "0 12px", cursor: "pointer", fontSize: 15 }}>🔍</button>
        </div>
        <div style={{ position: "relative" }}>
          {(imgs.cartE || imgs.cartN)
            ? <img src={cartCount > 2 ? (imgs.cartN || imgs.cartE) : imgs.cartE} alt="Cart" style={{ width: 30, height: 28, objectFit: "contain" }} />
            : <svg width="28" height="26" viewBox="0 0 28 26" fill="white"><path d="M1 1h4l2.5 12h13l2.5-9H7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="23" r="2" fill="white"/><circle cx="20" cy="23" r="2" fill="white"/></svg>
          }
          {cartCount > 2 && !imgs.cartN && (
            <span style={{
              position: "absolute", top: -4, right: -8,
              background: DS.color.orange, borderRadius: "50%",
              width: 16, height: 16, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#000",
            }}>{cartCount}</span>
          )}
        </div>
      </div>

      {/* DELIVERY BAR */}
      <div style={{ background: DS.color.subNavBg, padding: "6px 14px", fontSize: 12, color: "#ccc", display: "flex", alignItems: "center", gap: 6 }}>
        <span>📍</span>
        <span>{"Deliver to Amara — "}<strong style={{ color: "#fff" }}>Aurora 80011</strong></span>
      </div>

      {/* BREADCRUMB */}
      <div style={{ padding: "8px 14px", background: DS.color.surface, fontSize: 11, color: DS.color.textLink }}>
        {"Computers › Laptops › "}<span style={{ color: DS.color.textSub }}>HP</span>
      </div>

      {/* PRODUCT CARD */}
      <div style={{ background: DS.color.surface }}>
        <div style={{ padding: "14px 14px 0" }}>
          <a href="#" style={{ color: DS.color.textLink, fontSize: 13, textDecoration: "none" }}>HP</a>
          <h1 style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.4, margin: "4px 0 8px" }}>
            {HP.titleBase + ", " + color + ", 15-fc0099nr"}
          </h1>
          <Stars rating={HP.rating} count={HP.reviewCount} />
          <div style={{ marginTop: 6 }}>
            <span style={{ background: DS.color.choiceBg, color: "#fff", padding: "2px 8px", borderRadius: DS.r.sm, fontSize: 12, fontWeight: 600 }}>
              {"Amazon's Choice"}
            </span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: DS.color.textSub }}>
            <strong style={{ color: DS.color.text }}>{HP.boughtPastMonth + "+"}</strong>{" bought in past month"}
          </div>
        </div>

        {/* IMAGE CAROUSEL */}
        <div style={{ padding: "14px 0 8px", textAlign: "center" }}>
          <div style={{
            fontSize: 110, lineHeight: 1, padding: "20px 0",
            background: "linear-gradient(135deg, " + selectedColor.hex + "28 0%, #F0F2F2 100%)",
            margin: "0 14px", borderRadius: DS.r.md,
            minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden", transition: "background .35s ease",
          }}>
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: 4, background: selectedColor.hex, opacity: 0.7, transition: "background .35s ease",
            }} />
            {HP.images[activeImage]}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10, padding: "0 14px" }}>
            {HP.images.map(function(img, i) {
              return (
                <button key={i} onClick={function() { setActiveImage(i); }} style={{
                  width: 44, height: 44, fontSize: 22,
                  border: i === activeImage ? ("2px solid " + DS.color.orange) : ("1px solid " + DS.color.border),
                  borderRadius: DS.r.sm, background: DS.color.surface, cursor: "pointer", transition: "all .15s",
                }}>{img}</button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 8 }}>
            {HP.images.map(function(_, i) {
              return (
                <div key={i} onClick={function() { setActiveImage(i); }} style={{
                  width: i === activeImage ? 18 : 6, height: 6, borderRadius: DS.r.full,
                  background: i === activeImage ? DS.color.orange : DS.color.border,
                  cursor: "pointer", transition: "all .2s",
                }} />
              );
            })}
          </div>
        </div>

        <Divider my={0} />
        <ProductTab
          color={color} setColor={setColor}
          storage={storage} setStorage={setStorage}
          currentPrice={currentPrice} currentListPrice={currentListPrice}
          warrantyChecked={warrantyChecked} setWarrantyChecked={setWarrantyChecked}
          onLearnMoreWarranty={function() { setWarrantyDetailOpen(true); }}
          added={added} onAddToCart={handleAddToCart} ctaRef={ctaRef}
        />

        <Divider my={0} />
        <AboutSection />

        <Divider my={0} />
        <ProductDescriptionSection />

        <Divider my={0} />
        <TechSpecsSection color={color} storage={storage} />

        <Divider my={0} />
        <ReviewsSection />
      </div>

      {/* STICKY BOTTOM CTA — only when inline buttons scrolled out of view */}
      {showStickyFooter && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 393, zIndex: 99,
          background: DS.color.surface, borderTop: "1px solid " + DS.color.border,
          padding: "10px 14px",
          boxShadow: "0 -4px 12px rgba(0,0,0,.08)",
        }}>
          <AddToCartBtn added={added} onClick={handleAddToCart} />
        </div>
      )}
    </div>
  );
}

export default function HPMobilePrototype() {
  return (
    <ImageProvider>
      <HPMobilePrototypeInner />
    </ImageProvider>
  );
}
