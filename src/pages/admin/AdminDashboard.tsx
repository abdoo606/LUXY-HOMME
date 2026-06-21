import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Settings, LogOut,
  DollarSign, Clock, CheckCircle, ChevronRight,
  Eye, Trash2, Search, X, Save, Bell, Plus, Edit2, Image
} from 'lucide-react';
import { useAdminStore, type Order } from '../../store/adminStore';
import { useCurrency } from '../../hooks/useCurrency';
import type { Product } from '../../store/useStore';
import type { Language } from '../../i18n/translations';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'dashboard' | 'orders' | 'products' | 'settings';

const emptyProductForm = {
  nameEn: '',
  nameAr: '',
  descEn: '',
  descAr: '',
  price: '',
  originalPrice: '',
  image: '',
  category: 'casual',
  sizes: 'S,M,L,XL',
  colors: 'Black:#000000,White:#ffffff',
  inStock: true,
  isNew: false,
  isSale: false,
};

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { formatPrice } = useCurrency();
  const { 
    adminUser, adminLogout, orders, products, 
    updateOrderStatus, deleteOrder, getStats, 
    updateProduct, deleteProduct, addProduct 
  } = useAdminStore();
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  
  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productSearch, setProductSearch] = useState('');

  // Settings state
  const [settings, setSettings] = useState({
    storeName: 'LUXE HOMME',
    supportEmail: 'abdu1rhmant2le@gmail.com',
    freeShippingMin: '100',
    taxRate: '8',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const stats = getStats();

  const handleLogout = () => {
    adminLogout();
    onLogout();
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedOrder(null);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredProducts = products.filter((product) => {
    return product.name.en.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearch.toLowerCase());
  });

  const statusColors: Record<Order['status'], string> = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      nameEn: product.name.en,
      nameAr: product.name.ar,
      descEn: product.description.en,
      descAr: product.description.ar,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      category: product.category,
      sizes: product.sizes.join(','),
      colors: product.colors.map(c => `${c.name}:${c.hex}`).join(','),
      inStock: product.inStock,
      isNew: product.isNew || false,
      isSale: product.isSale || false,
    });
    setShowProductForm(true);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setShowProductForm(true);
  };

  const handleSaveProduct = () => {
    const sizes = productForm.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colors = productForm.colors.split(',').map(c => {
      const [name, hex] = c.split(':');
      return { name: name?.trim() || 'Default', hex: hex?.trim() || '#000000' };
    });

    const productData: Omit<Product, 'id'> = {
      name: {
        en: productForm.nameEn,
        ar: productForm.nameAr || productForm.nameEn,
        fr: productForm.nameEn,
        es: productForm.nameEn,
        de: productForm.nameEn,
        tr: productForm.nameEn,
      } as Record<Language, string>,
      description: {
        en: productForm.descEn,
        ar: productForm.descAr || productForm.descEn,
        fr: productForm.descEn,
        es: productForm.descEn,
        de: productForm.descEn,
        tr: productForm.descEn,
      } as Record<Language, string>,
      price: parseFloat(productForm.price) || 0,
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      image: productForm.image,
      images: [productForm.image],
      category: productForm.category,
      sizes,
      colors,
      rating: 4.5,
      reviews: 0,
      inStock: productForm.inStock,
      isNew: productForm.isNew,
      isSale: productForm.isSale,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm(emptyProductForm);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const navItems = [
    { key: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'orders' as Tab, label: 'Orders', icon: ShoppingBag, badge: stats.pendingOrders },
    { key: 'products' as Tab, label: 'Products', icon: Package, badge: products.length },
    { key: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  // Dashboard Content
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
          { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'from-blue-500 to-indigo-600' },
          { label: 'Pending', value: stats.pendingOrders.toString(), icon: Clock, color: 'from-amber-500 to-orange-600' },
          { label: 'Delivered', value: stats.completedOrders.toString(), icon: CheckCircle, color: 'from-purple-500 to-pink-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.color}`}
          >
            <div className="relative z-10">
              <stat.icon size={24} className="text-white/80 mb-3" />
              <p className="text-white/80 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20">
              <stat.icon size={100} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <button
            onClick={() => handleTabChange('orders')}
            className="flex items-center gap-2 text-accent hover:text-accent-light text-sm"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Order</th>
                <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Total</th>
                <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-t border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="py-4 px-6 text-white font-mono text-sm">{order.orderNumber}</td>
                  <td className="py-4 px-6 text-white/70">{order.customer.firstName} {order.customer.lastName}</td>
                  <td className="py-4 px-6 text-accent font-bold">{formatPrice(order.total)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-white/30">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Orders Content
  const renderOrders = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-accent"
          />
        </div>
        <select
          value={orderFilter}
          onChange={(e) => setOrderFilter(e.target.value)}
          className="px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Order ID</th>
              <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Customer</th>
              <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Items</th>
              <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Total</th>
              <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Status</th>
              <th className="text-left py-4 px-6 text-white/50 text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="py-4 px-6">
                  <p className="text-white font-mono text-sm">{order.orderNumber}</p>
                  <p className="text-white/30 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-white">{order.customer.firstName} {order.customer.lastName}</p>
                  <p className="text-white/40 text-sm">{order.customer.email}</p>
                </td>
                <td className="py-4 px-6 text-white/70">{order.items.length} items</td>
                <td className="py-4 px-6 text-accent font-bold">{formatPrice(order.total)}</td>
                <td className="py-4 px-6">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border bg-transparent outline-none ${statusColors[order.status]}`}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="confirmed">✓ Confirmed</option>
                    <option value="processing">🔄 Processing</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => { if(confirm('Delete this order?')) deleteOrder(order.id); }}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-white/30">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Products Content
  const renderProducts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={handleAddNewProduct}
          className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden group">
            <div className="relative h-48">
              <img src={product.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-3 bg-accent hover:bg-accent-dark rounded-xl text-white"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-3 bg-red-500 hover:bg-red-600 rounded-xl text-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {product.isNew && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">NEW</span>
              )}
              {product.isSale && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">SALE</span>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-white font-medium truncate">{product.name.en}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-accent font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-white/30 text-sm line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-white/30 text-xs capitalize">{product.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Settings Content
  const renderSettings = () => (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Store Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-2 block">Store Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm mb-2 block">Free Shipping Min ($)</label>
              <input
                type="number"
                value={settings.freeShippingMin}
                onChange={(e) => setSettings({ ...settings, freeShippingMin: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
              />
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            className="w-full py-3 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            {settingsSaved ? <CheckCircle size={18} /> : <Save size={18} />}
            {settingsSaved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Admin Account</h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-2xl">
            {adminUser?.avatar}
          </div>
          <div>
            <p className="text-white font-bold">{adminUser?.name}</p>
            <p className="text-white/40 text-sm">{adminUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d15] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#12121c] border-r border-white/5 flex flex-col fixed h-full z-50">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">LUXE HOMME</h1>
              <p className="text-white/30 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.key
                  ? 'bg-accent text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === item.key ? 'bg-white/20' : 'bg-accent'
                } text-white`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0d0d15]/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-xl font-bold text-white capitalize">{activeTab}</h2>
              <p className="text-white/40 text-sm">Welcome, {adminUser?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 relative">
                <Bell size={20} />
                {stats.pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-lg">
                {adminUser?.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedOrder(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a2e] border border-white/10 rounded-2xl"
            >
              <div className="sticky top-0 bg-[#1a1a2e] p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">Order Details</h3>
                  <p className="text-accent font-mono">{selectedOrder.orderNumber}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/40 text-xs mb-2">Customer</p>
                    <p className="text-white">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    <p className="text-white/60 text-sm">{selectedOrder.customer.email}</p>
                    <p className="text-white/60 text-sm">{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/40 text-xs mb-2">Shipping</p>
                    <p className="text-white/60 text-sm">{selectedOrder.customer.address}</p>
                    <p className="text-white/60 text-sm">{selectedOrder.customer.city}, {selectedOrder.customer.state}</p>
                    <p className="text-white/60 text-sm">{selectedOrder.customer.country}</p>
                  </div>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-3">Items</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-4 bg-white/5 rounded-xl p-3">
                        <img src={item.image} alt="" className="w-14 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="text-white">{item.productName}</p>
                          <p className="text-white/40 text-sm">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                        </div>
                        <p className="text-accent font-bold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Shipping</span>
                    <span className="text-white">{selectedOrder.shipping === 0 ? 'Free' : formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Tax</span>
                    <span className="text-white">{formatPrice(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/10 font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-accent text-lg">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showProductForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowProductForm(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a2e] border border-white/10 rounded-2xl"
            >
              <div className="sticky top-0 bg-[#1a1a2e] p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setShowProductForm(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Name (English) *</label>
                    <input
                      type="text"
                      value={productForm.nameEn}
                      onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
                      placeholder="Product name in English"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Name (Arabic)</label>
                    <input
                      type="text"
                      value={productForm.nameAr}
                      onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent text-right"
                      placeholder="اسم المنتج بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">Description (English) *</label>
                  <textarea
                    value={productForm.descEn}
                    onChange={(e) => setProductForm({ ...productForm, descEn: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent resize-none h-20"
                    placeholder="Product description"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">Description (Arabic)</label>
                  <textarea
                    value={productForm.descAr}
                    onChange={(e) => setProductForm({ ...productForm, descAr: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent resize-none h-20 text-right"
                    placeholder="وصف المنتج بالعربية"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Price ($) *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
                      placeholder="99.99"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Original Price (Sale)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
                      placeholder="149.99"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">Image URL *</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="w-14 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {productForm.image ? (
                        <img src={productForm.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Image size={20} className="text-white/30" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
                    >
                      <option value="suits">Suits & Blazers</option>
                      <option value="casual">Casual Wear</option>
                      <option value="shoes">Shoes</option>
                      <option value="accessories">Accessories</option>
                      <option value="sportswear">Sportswear</option>
                      <option value="outerwear">Outerwear</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Sizes (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.sizes}
                      onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
                      placeholder="S,M,L,XL"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">Colors (Name:Hex, comma separated)</label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent"
                    placeholder="Black:#000000,White:#ffffff"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                    />
                    <span className="text-white/70">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                    />
                    <span className="text-white/70">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isSale}
                      onChange={(e) => setProductForm({ ...productForm, isSale: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                    />
                    <span className="text-white/70">On Sale</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="flex-1 py-3 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
