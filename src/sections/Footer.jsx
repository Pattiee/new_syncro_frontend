import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-12 px-6 mt-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400">About Metro</h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Metro is your go-to e-commerce destination. We offer a wide variety of high-quality products
            with unbeatable deals and reliable delivery.
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-orange-500 dark:hover:text-orange-300 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-orange-500 dark:hover:text-orange-300 transition">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-orange-500 dark:hover:text-orange-300 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-orange-500 dark:hover:text-orange-300 transition">Support</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-orange-500 dark:hover:text-orange-300 transition">Instagram</a></li>
            <li><a href="#" className="hover:text-orange-500 dark:hover:text-orange-300 transition">Facebook</a></li>
            <li><a href="#" className="hover:text-orange-500 dark:hover:text-orange-300 transition">Twitter</a></li>
            <li><a href="#" className="hover:text-orange-500 dark:hover:text-orange-300 transition">YouTube</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 text-center text-xs text-gray-500 dark:text-gray-600 border-t border-gray-200 dark:border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} Metro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
