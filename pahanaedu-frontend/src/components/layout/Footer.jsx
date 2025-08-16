import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Pahana EDU</h3>
                        <p className="text-gray-300">
                            Your trusted source for educational books and resources.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                            <li><a href="/books" className="text-gray-300 hover:text-white">Books</a></li>
                            <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                            <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <p className="text-gray-300">Email: info@pahanaedu.com</p>
                        <p className="text-gray-300">Phone: +94 77 123 4567</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Pahana EDU. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;