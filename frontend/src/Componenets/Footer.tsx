import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">FuelEU Maritime</h2>
          <p className="text-sm leading-relaxed">
            A compliance monitoring dashboard for maritime routes under the FuelEU Regulation.
            Track emissions, manage compliance balances, and enable sustainable pooling.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="/routes" className="hover:text-blue-400">Routes</a></li>
            <li><a href="/compare" className="hover:text-blue-400">Compare</a></li>
            <li><a href="/banking" className="hover:text-blue-400">Banking</a></li>
            <li><a href="/pooling" className="hover:text-blue-400">Pooling</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Connect</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              <a href="mailto:youremail@example.com" className="hover:text-blue-400">
                youremail@example.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaGithub className="text-blue-400" />
              <a href="https://github.com/yourusername" target="_blank" className="hover:text-blue-400">
                GitHub
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaLinkedin className="text-blue-400" />
              <a href="https://linkedin.com/in/yourprofile" target="_blank" className="hover:text-blue-400">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FuelEU Maritime Compliance Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
