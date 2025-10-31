const SHOP_NAME = process.env.REACT_APP_SHOP_NAME

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col justify-between px-6 py-16 h-screen text-gray-700 transition-colors duration-300 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 dark:text-gray-300 tracking-tight">
      <div className="grid max-w-6xl grid-cols-1 gap-10 mx-auto md:grid-cols-3">
        {/* About */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-orange-600 dark:text-orange-400">{ SHOP_NAME }</h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            { SHOP_NAME } is your go-to e-commerce destination. We offer a wide variety of high-quality products
            with unbeatable deals and reliable delivery.
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-orange-600 dark:text-orange-400">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/contact" className="transition hover:text-orange-500 dark:hover:text-orange-300">Contact Us</a></li>
            <li><a href="/" className="transition hover:text-orange-500 dark:hover:text-orange-300">Shipping & Returns</a></li>
            <li><a href="/faq" className="transition hover:text-orange-500 dark:hover:text-orange-300">FAQs</a></li>
            <li><a href="/support" className="transition hover:text-orange-500 dark:hover:text-orange-300">Support</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-orange-600 dark:text-orange-400">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="transition hover:text-orange-500 dark:hover:text-orange-300">Instagram</a></li>
            <li><a href="#" className="transition hover:text-orange-500 dark:hover:text-orange-300">Facebook</a></li>
            <li><a href="#" className="transition hover:text-orange-500 dark:hover:text-orange-300">Twitter</a></li>
            <li><a href="#" className="transition hover:text-orange-500 dark:hover:text-orange-300">YouTube</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-6 mt-12 text-xs text-center text-gray-500 border-t border-gray-200 dark:text-gray-600 dark:border-gray-700">
        &copy; { currentYear } { SHOP_NAME }. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
