'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { clearTokens, getTokens } from '../src/utils/token';
import api, { URL } from '../src/utils/api';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine active tab based on current path
  const getActiveTab = () => {
    if (pathname.includes('/single-processor')) return 'single-processor';
    if (pathname.includes('/pipeline-processor')) return 'multi-stage-processor';
    if (pathname.includes('/summaries')) return 'conversation-journal';
    if (pathname.includes('/quiz')) return 'quiz';
    if (pathname.includes('/instructor')) return 'instructor';
    if (pathname.includes('/arithmetic')) return 'arithmetic-module';
    if (pathname.includes('/stats')) return 'student-stats';
    if (pathname.includes('/')) return '';
    return '';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);

  useEffect(() => {
    const checkInstructor = async () => {
      try {
        const res = await api.get("/api/users/check-instructor");
        setIsInstructor(res.data);
      } catch {
        console.log("failed to fetch instructor status");
      }
    };
    checkInstructor();
  }, []);
  
  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [pathname]);

  const [username, setUsername] = useState<string | null>(null);
  const [isGithubUser, setIsGithubUser] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfoFetched, setUserInfoFetched] = useState(false);

  useEffect(() => {
    // Check if we have valid tokens first
    const tokens = getTokens();
    const hasValidTokens = tokens && tokens.access && tokens.refresh;
    
    // If no valid tokens, clear GitHub user state immediately
    if (!hasValidTokens && !isLoggingOut) {
      setUsername(null);
      setIsGithubUser(false);
      localStorage.removeItem("github_username");
      setUserInfoFetched(true);
      return;
    }
    
    // Don't fetch user info if we're logging out or already fetched
    if (isLoggingOut || userInfoFetched) return;
    
    const fetchUsername = async () => {
      try {
        const response = await api.get('/api/users/get_user_info/');
        const fetchedUsername = response.data.username;
        const authMethod = response.data.auth_method || 'guest';

        if (authMethod === 'github' && fetchedUsername) {
          setUsername(fetchedUsername);
          setIsGithubUser(true);
          localStorage.setItem("github_username", fetchedUsername);
        } else {
          setUsername(null);
          setIsGithubUser(false);
          localStorage.removeItem("github_username");
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUsername(null);
        setIsGithubUser(false);
        localStorage.removeItem("github_username");
      } finally {
        setUserInfoFetched(true);
      }
    };

    fetchUsername();
  }, [pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    switch (value) {
      case 'single-processor':
        router.push('/single-processor');
        break;
      case 'multi-stage-processor':
        router.push('/pipeline-processor');
        break;
      case 'conversation-journal':
        router.push('/summaries');
        break;
      case 'quiz':
        router.push('/quiz');
        break;
      case 'instructor':
        router.push('/instructor');
        break;
      case 'arithmetic-module':
        router.push('/arithmetic');
        break;
      case 'student-stats':
        router.push('/stats');
        break;
      default:
        router.push('/');
    }
  };
  
  const handleLogoClick = () => {
    router.push('/');
  };
  
  const handleLoginClick = () => {
    window.location.href = `${URL}/api/users/githubauth/login/github/`;
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutMenu(!showLogoutMenu);
  };
  
  const handleLogout = () => {
    setIsLoggingOut(true);
    setUserInfoFetched(false);
    
    clearTokens();

    setUsername(null);
    setIsGithubUser(false);
    setShowLogoutMenu(false);
    
    localStorage.removeItem("github_username");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_tokens");
    
    sessionStorage.clear();

    window.location.href = '/';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-menu-container')) {
        setShowLogoutMenu(false);
      }
    };

    if (showLogoutMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLogoutMenu]);

  return (
    <header className="bg-card shadow-sm bg-[#36517d] relative z-40 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center justify-between h-full">
          {/* Logo/Title */}
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-[#f3f3f3] pr-8 hover:text-[#b6c8e3] transition-colors cursor-pointer"
            title="Home"
          >
            Instructli
          </button>

          {/* Navigation */}
          <nav className="flex items-center h-full">
            <button
              onClick={() => handleTabChange("single-processor")}
              className={`px-4 h-full text-sm font-medium transition-colors focus:outline-none flex flex-col justify-center relative cursor-pointer hover:text-[#f3f3f3] ${
                activeTab === "single-processor" ? "text-[#f3f3f3]" : "text-[#f3f3f3]/80"
              } active:bg-[#2a3d5a] active:shadow-[inset_0_0_0_4px_#f3f3f3]`}
            >
              <span>Single-cycled Processor</span>
              {activeTab === "single-processor" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-38 h-0.5 bg-[#f3f3f3] translate-y-[-20px]" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("multi-stage-processor")}
              className={`px-4 h-full text-sm font-medium transition-colors focus:outline-none flex flex-col justify-center relative cursor-pointer hover:text-[#f3f3f3] ${
                activeTab === "multi-stage-processor" ? "text-[#f3f3f3]" : "text-[#f3f3f3]/80"
              } active:bg-[#2a3d5a] active:shadow-[inset_0_0_0_4px_#f3f3f3]`}
            >
              <span>Pipelined Processor</span>
              {activeTab === "multi-stage-processor" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-[#f3f3f3] translate-y-[-20px]" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("conversation-journal")}
              className={`px-4 h-full text-sm font-medium transition-colors focus:outline-none flex flex-col justify-center relative cursor-pointer hover:text-[#f3f3f3] ${
                activeTab === "conversation-journal" ? "text-[#f3f3f3]" : "text-[#f3f3f3]/80"
              } active:bg-[#2a3d5a] active:shadow-[inset_0_0_0_4px_#f3f3f3]`}
            >
              <span>Chat Summaries</span>
              {activeTab === "conversation-journal" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-26 h-0.5 bg-[#f3f3f3] translate-y-[-20px]" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("quiz")}
              className={`px-4 h-full text-sm font-medium transition-colors focus:outline-none flex flex-col justify-center relative cursor-pointer hover:text-[#f3f3f3] ${
                activeTab === "quiz" ? "text-[#f3f3f3]" : "text-[#f3f3f3]/80"
              } active:bg-[#2a3d5a] active:shadow-[inset_0_0_0_4px_#f3f3f3]`}
            >
              <span>Check For Understanding</span>
              {activeTab === "quiz" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-38 h-0.5 bg-[#f3f3f3] translate-y-[-20px]" />
              )}
            </button>
            <button
                onClick={() => handleTabChange("arithmetic-module")}
                className={`px-4 h-full text-sm font-medium transition-colors focus:outline-none flex flex-col justify-center relative cursor-pointer hover:text-[#f3f3f3] ${
                  activeTab === "arithmetic-module" ? "text-[#f3f3f3]" : "text-[#f3f3f3]/80"
                } active:bg-[#2a3d5a] active:shadow-[inset_0_0_0_4px_#f3f3f3]`}
              >
                <span>Learn Arithmetics</span>
                {activeTab === "arithmetic-module" && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-0.5 bg-[#f3f3f3] translate-y-[-20px]" />
                )}
              </button>

            {isInstructor && (
              <button
              onClick={() => handleTabChange("instructor")}
              className={`px-4 h-full text-sm font-medium transition-colors focus:outline-none flex flex-col justify-center relative cursor-pointer hover:text-[#f3f3f3] ${
                activeTab === "instructor" ? "text-[#f3f3f3]" : "text-[#f3f3f3]/80"
              } active:bg-[#2a3d5a] active:shadow-[inset_0_0_0_4px_#f3f3f3]`}
            >
              <span>Instructor Dashboard</span>
              {activeTab === "instructor" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-26 h-0.5 bg-[#f3f3f3] translate-y-[-20px]" />
              )}
            </button>
            )}
          </nav>
        </div>

        {/* Right side - Profile or Login */}
        <div className="flex items-center h-full">
          {isGithubUser && username ? (
            /* Profile Picture with Dropdown Logout */
            <div className="relative profile-menu-container">
              <button
                onClick={handleProfileClick}
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
              >
                <img src={`https://github.com/${username}.png`} alt={username} className="w-10 h-10 border-2 border-[#f3f3f3]" />
              </button>

              {/* Dropdown Logout Menu */}
              {showLogoutMenu && (
                <div className="absolute top-1/2 transform -translate-y-1/2 right-full mr-2 z-50 transition-opacity duration-200">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 text-black bg-[#D9D9D9] hover:bg-[#BFBFBF] focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium text-sm px-3 py-1.5 shadow whitespace-nowrap transition-colors duration-200 cursor-pointer rounded"
                  >
                    
                  <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">

                  <g strokeWidth="5"/>

                  <g strokeLinecap="round" strokeLinejoin="round"/>

                  <g>
                    <path d="M16.5 15V19.5H5.5V5.5H16.5V10M10 12.5H22.5" stroke="#212121" strokeWidth="1.2"/>
                    <path d="M20 10L22.5 12.5L20 15" stroke="#212121" strokeWidth="1.2"/>
                  </g>

                  </svg>
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login Button for Guest Users */
            <button
              onClick={handleLoginClick}
              className="px-6 h-full text-sm font-medium transition-colors focus:outline-none flex flex-col justify-center relative text-[#f3f3f3]/80 hover:text-[#f3f3f3] active:bg-[#2a3d5a] active:shadow-[inset_0_0_0_4px_#f3f3f3] cursor-pointer"
            >
              <span>Log in with GitHub</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}