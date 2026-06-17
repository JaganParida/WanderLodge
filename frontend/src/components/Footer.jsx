const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Safety information</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">WanderLodge.org: disaster relief housing</a></li>
              <li><a href="#" className="hover:underline">Support Afghan refugees</a></li>
              <li><a href="#" className="hover:underline">Combating discrimination</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Hosting</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Try hosting</a></li>
              <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:underline">Explore hosting resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">Learn about new features</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div>
            &copy; 2026 WanderLodge, Inc. &middot; <a href="#" className="hover:underline">Privacy</a> &middot; <a href="#" className="hover:underline">Terms</a>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4 font-semibold">
            <span>English (US)</span>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
