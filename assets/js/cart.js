// assets/js/cart.js
const CatalogData = [
  { id: 'beras', name: 'Beras Premium', img: 'assets/img/beras.jpg', pcs: 0, pricePcs: 15000, kilo: 1, priceKilo: 13000 },
  { id: 'minyak', name: 'Minyak Goreng', img: 'assets/img/minyak.jpg', pcs: 1, pricePcs: 16000, kilo: 0, priceKilo: 0 },
  { id: 'ayam', name: 'Daging Ayam', img: 'assets/img/ayam.jpg', pcs: 0, pricePcs: 0, kilo: 1, priceKilo: 38000 },
  { id: 'sapi', name: 'Daging Sapi', img: 'assets/img/sapi.jpg', pcs: 0, pricePcs: 0, kilo: 125000, priceKilo: 125000 },
  { id: 'telur', name: 'Telur Ayam', img: 'assets/img/banner-telur.jpg', pcs: 10, pricePcs: 2500, kilo: 1, priceKilo: 28000 },
  { id: 'gula', name: 'Gula Pasir', img: 'assets/img/gula.jpg', pcs: 1, pricePcs: 15000, kilo: 0, priceKilo: 0 },
  { id: 'buah', name: 'Buah Campur', img: 'assets/img/buah.jpg', pcs: 1, pricePcs: 5000, kilo: 1, priceKilo: 15000 },
  { id: 'ikan', name: 'Ikan Segar', img: 'assets/img/ikan.jpg', pcs: 0, pricePcs: 0, kilo: 35000, priceKilo: 35000 },
  // Tambahkan produk lain sesuai kebutuhan...
];

const Cart = {
  items: [],
  open() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('drawer-backdrop').classList.add('show');
    this.render();
  },
  close() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('drawer-backdrop').classList.remove('show');
  },
  add(productId, mode='pcs') {
    const p = CatalogData.find(x => x.id === productId);
    if(!p) return;
    const key = productId + ':' + mode;
    const existing = this.items.find(x => x.key === key);
    const price = (mode === 'pcs' ? p.pricePcs : p.priceKilo);
    if(price <= 0) return; // kalau tidak tersedia, jangan ditambahkan
    if(existing){
      existing.qty += 1;
      existing.total = existing.qty * price;
    } else {
      this.items.push({
        key, productId, name: p.name + (mode === 'kilo' ? ' (kg)' : ' (pcs)'),
        img: p.img, mode, price, qty: 1, total: price
      });
    }
    this.updateCount();
    this.render();
  },
  remove(key){
    this.items = this.items.filter(x => x.key !== key);
    this.updateCount();
    this.render();
  },
  clear(){
    this.items = [];
    this.updateCount();
    this.render();
  },
  updateCount(){
    const cnt = this.items.reduce((a,b)=> a + b.qty, 0);
    const el = document.getElementById('cart-count');
    if(el) el.textContent = cnt;
    this.updateTotal();
  },
  updateTotal(){
    const total = this.items.reduce((a,b)=> a + b.total, 0);
    const el = document.getElementById('cart-total');
    if(el) el.textContent = 'Rp ' + total.toLocaleString('id-ID');
  },
  render(){
    const wrap = document.getElementById('cart-items');
    if(!wrap) return;
    wrap.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-info">
          <div class="name">${item.name}</div>
          <div class="meta">Qty: ${item.qty} • Harga: Rp ${item.price.toLocaleString('id-ID')}</div>
          <div class="total">Subtotal: Rp ${item.total.toLocaleString('id-ID')}</div>
        </div>
        <button class="btn danger" onclick="Cart.remove('${item.key}')">Hapus</button>
      </div>
    `).join('') || '<p>Keranjang kosong.</p>';
  },
  checkoutWhatsApp(){
    const lines = this.items.map(i => `- ${i.name} x${i.qty} = Rp ${i.total.toLocaleString('id-ID')}`);
    const total = this.items.reduce((a,b)=> a + b.total, 0);
    const text = encodeURIComponent(
      `Assalamu'alaikum... Halo Kakak-Kakak Amanda Mart Katapang, Aku mau checkout:\n${lines.join('\n')}\nTotal: Rp ${total.toLocaleString('id-ID')}`
    );
    const phone = '6281389188903'; // ganti ke nomor WA admin
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  },
  checkoutTelegram(){
    const lines = this.items.map(i => `- ${i.name} x${i.qty} = Rp ${i.total.toLocaleString('id-ID')}`);
    const total = this.items.reduce((a,b)=> a + b.total, 0);
    const text = encodeURIComponent(
      `Checkout A‑Mart:\n${lines.join('\n')}\nTotal: Rp ${total.toLocaleString('id-ID')}`
    );
    const botUser = 'your_bot'; // ganti ke username bot Telegram kamu
    window.open(`https://t.me/${botUser}?start=${text}`, '_blank');
  }
};

function renderCatalog(){
  const grid = document.getElementById('catalog-grid');
  if(!grid) return;
  grid.innerHTML = CatalogData.map(p => `
    <div class="product">
      <img src="${p.img}" alt="${p.name}" onclick="Cart.add('${p.id}', '${p.pcs>0?'pcs':'kilo'}')" style="cursor:pointer">
      <h3>${p.name}</h3>
      <p>${p.pricePcs>0 ? ('Per pcs: Rp ' + p.pricePcs.toLocaleString('id-ID')) : 'Per pcs: -'}</p>
      <p>${p.priceKilo>0 ? ('Per kilo: Rp ' + p.priceKilo.toLocaleString('id-ID')) : 'Per kilo: -'}</p>
      <div style="margin-top:8px; display:flex; gap:8px; justify-content:center;">
        ${p.pricePcs>0 ? `<button class="btn" onclick="Cart.add('${p.id}','pcs')">Tambah (pcs)</button>` : ''}
        ${p.priceKilo>0 ? `<button class="btn" onclick="Cart.add('${p.id}','kilo')">Tambah (kg)</button>` : ''}
      </div>
    </div>
  `).join('');
}
renderCatalog();
