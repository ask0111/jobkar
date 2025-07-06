import SectionContainer from "../components/SectionContainer";

const Footer = () => {
  return (
    <div className="w-full bg-gray-100 border-t border-gray-300 py-8 px-6 md:px-36 text-gray-700 ">
      <SectionContainer className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 items-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <img src="/assets/logo.png" alt="logo" className="w-12 h-12 rounded mb-2" />
          <span className="text-lg font-bold text-blue-700">Jobkar</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row md:space-x-12 space-y-8 md:space-y-0">
          {/* Section 1 */}
          <div>
            <h4 className="text-sm font-bold mb-2">Navigation</h4>
            <ul className="space-y-2">
              <li className="hover:text-blue-700 cursor-pointer">About</li>
              <li className="hover:text-blue-700 cursor-pointer">Careers</li>
              <li className="hover:text-blue-700 cursor-pointer">
                Advertising
              </li>
              <li className="hover:text-blue-700 cursor-pointer">
                Small Business
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <ul className="space-y-2">
              <li className="hover:text-blue-700 cursor-pointer">
                Talent Solutions
              </li>
              <li className="hover:text-blue-700 cursor-pointer">
                Marketing Solutions
              </li>
              <li className="hover:text-blue-700 cursor-pointer">
                Sales Solutions
              </li>
              <li className="hover:text-blue-700 cursor-pointer">
                Safety Center
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <ul className="space-y-2">
              <li className="hover:text-blue-700 cursor-pointer">
                Community Guidelines
              </li>
              <li className="hover:text-blue-700 cursor-pointer">
                Privacy & Terms
              </li>
              <li className="hover:text-blue-700 cursor-pointer">Mobile App</li>
            </ul>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-sm font-bold mb-2">Fast access</h4>
          <button className="bg-blue-700 text-white py-2 px-4 rounded-md mb-2 hover:bg-blue-800">
            Questions?
          </button>
          <button className="border border-blue-700 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-100">
            Settings
          </button>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Footer;
