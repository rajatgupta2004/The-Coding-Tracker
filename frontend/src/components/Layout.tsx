import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PanelBottomClose, PanelTopClose } from 'lucide-react';
import { cn } from '../lib/util';
import axios from 'axios';
import UserData from '../types';
const URL = "https://leetcode-tracker-1-ucio.onrender.com";
const navigation = [
  { name: 'Leader Board', href: '/' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Add User', href: '/adduser' },
  { name: 'How it Works?', href: '/howitworks' },
];



export function Layout() {
  const [loading, setLoading] = useState(true);
  const [sampleData, setSampleData] = useState<UserData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(URL + '/data');
        setSampleData(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-100 ">

      <nav className="bg-navy text-white z-50 sticky top-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex">
              <Link to='/' className='flex'>
                <img className='w-16 h-16 mt-1' src="https://img.icons8.com/?size=100&id=SG4IvAiNNVRd&format=png&color=000000" alt="" />
                <span className="ml-2 flex w-full text-xl items-center font-bold">The Coding Tracker
                </span>
              </Link>
            </div>


            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        location.pathname === item.href
                          ? 'bg-health text-white'
                          : 'text-gray-300 hover:bg-health/80 hover:text-white'
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition duration-150"
              >
                {mobileMenuOpen ? <PanelTopClose /> : <PanelBottomClose />}
              </button>
            </div>
          </div>
        </div>
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} px-2 pt-2 pb-3`}>
          {navigation.map((item) => {
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-health text-white'
                    : 'text-gray-300 hover:bg-health/80 hover:text-white'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      <main>
        <Outlet context={{ sampleData, loading, setSampleData }} />
      </main>
    </div>
  );
}

export default Layout;
