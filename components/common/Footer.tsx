import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto font-sans">
      
      <div className="bg-[#282828] text-white py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-white/10 p-3 rounded-full hidden sm:block">
               <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
               <h3 className="text-lg font-bold uppercase tracking-wide">New to FashionStore?</h3>
               <p className="text-xs text-gray-400 mt-1">Subscribe to get updates on our latest offers!</p>
            </div>
          </div>

          <div className="flex w-full md:w-1/2 lg:w-1/3">
             <input 
                type="email" 
                placeholder="Enter E-mail Address" 
                className="w-full h-12 px-4 rounded-l text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F68B1E]"
             />
             <button className="bg-[#F68B1E] hover:bg-orange-600 text-white px-6 font-bold text-sm uppercase rounded-r transition-colors h-12 whitespace-nowrap">
                Male
             </button>
             <button className="bg-[#F68B1E] hover:bg-orange-600 text-white px-6 font-bold text-sm uppercase rounded-r ml-1 transition-colors h-12 whitespace-nowrap">
                Female
             </button>
          </div>
        </div>
      </div>

      {/* 2. Main Links Section */}
      <div className="bg-[#313133] text-gray-300 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          
          {/* Brand / About */}
          <div>
            <div className="mb-4">
               <span className="text-2xl font-bold text-white tracking-tight">
                 Fashion<span className="text-[#F68B1E]">Store</span>
               </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Your one-stop shop for shoes, bags, and clothes. We provide the best quality products at the most affordable prices.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-white font-bold uppercase mb-4 tracking-wider text-xs">Buying on FashionStore</h4>
            <ul className="space-y-2.5">
              <li><Link href="/products?category=shoes" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Shoes</Link></li>
              <li><Link href="/products?category=bags" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Bags & Accessories</Link></li>
              <li><Link href="/products?category=clothes" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Clothing</Link></li>
              <li><Link href="/trending" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Trending Now</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold uppercase mb-4 tracking-wider text-xs">Customer Service</h4>
            <ul className="space-y-2.5">
              <li><Link href="/contact" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Return Policy</Link></li>
              <li><Link href="/track-order" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Track Your Order</Link></li>
              <li><Link href="/dispute" className="hover:text-white hover:underline decoration-[#F68B1E] transition-all">Report a Product</Link></li>
            </ul>
          </div>

          {/* Connect & Legal */}
          <div>
            <h4 className="text-white font-bold uppercase mb-4 tracking-wider text-xs">Join Us</h4>
            <div className="flex space-x-4 mb-6">
               <a href="#" className="hover:text-[#F68B1E] transition-colors"><Facebook className="h-5 w-5" /></a>
               <a href="#" className="hover:text-[#F68B1E] transition-colors"><Twitter className="h-5 w-5" /></a>
               <a href="#" className="hover:text-[#F68B1E] transition-colors"><Instagram className="h-5 w-5" /></a>
               <a href="#" className="hover:text-[#F68B1E] transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
            
            <h4 className="text-white font-bold uppercase mb-2 tracking-wider text-xs">Legal Area</h4>
             <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar: Copyright & Payment Icons Mockup */}
        <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-gray-700">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500 text-center md:text-left">
                &copy; 2024 FashionStore. All rights reserved.
              </p>
              
              {/* Payment Icons Mockup (Pure CSS/SVG placeholders) */}
              <div className="flex items-center gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                  {/* Visa Style Placeholder */}
                  <div className="h-6 w-10 bg-white rounded flex items-center justify-center font-bold text-blue-800 text-[10px] italic border border-gray-600">VISA</div>
                  {/* Mastercard Style Placeholder */}
                  <div className="h-6 w-10 bg-white rounded flex items-center justify-center relative overflow-hidden border border-gray-600">
                      <div className="w-3 h-3 bg-red-500 rounded-full -mr-1 z-10 opacity-80"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full -ml-1 z-0 opacity-80"></div>
                  </div>
                  {/* PayPal Style Placeholder */}
                  <div className="h-6 w-10 bg-white rounded flex items-center justify-center font-bold text-blue-600 text-[10px] border border-gray-600">Pay</div>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}