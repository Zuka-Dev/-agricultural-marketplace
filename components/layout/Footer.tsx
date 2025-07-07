import { Wheat, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-soil-800 text-earth-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Wheat className="h-8 w-8 text-forest-400" />
              <div>
                <h3 className="text-xl font-bold text-white">GreenHarvest</h3>
                <p className="text-earth-300">McPherson University Farm</p>
              </div>
            </div>
            <p className="text-earth-200 mb-4">
              Fresh, organic agricultural produce grown with care on our university campus. Supporting sustainable
              farming practices and providing quality food to our community.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-forest-400" />
                <span className="text-earth-200">McPherson University, Seriki Sotayo, Ogun State</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-forest-400" />
                <span className="text-earth-200">+234-800-FARM-001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-forest-400" />
                <span className="text-earth-200">farm@mcpherson.edu.ng</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-earth-200 hover:text-forest-400 transition-colors">
                Home
              </a>
              <a href="/#products" className="block text-earth-200 hover:text-forest-400 transition-colors">
                Products
              </a>
              <a href="/about" className="block text-earth-200 hover:text-forest-400 transition-colors">
                About Us
              </a>
              <a href="/contact" className="block text-earth-200 hover:text-forest-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-soil-700 mt-8 pt-8 text-center">
          <p className="text-earth-300">© 2024 GreenHarvest - McPherson University Farm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
