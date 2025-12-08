import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { account } from "../lib/appwrite"
import { useEffect, useRef, useState } from "react"

const Navbar = () => {
  const user = useSelector((state: any) => state.user)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)

  const logout = async () => {
    try {
      await account.deleteSession("current")
      navigate("/")
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  return (
    <header className="bg-navbar/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1 select-none">
              <div className="p-2 flex rounded-md bg-green-500 text-white font-extrabold text-xl">
                TO-
              <div className="text-2xl font-extrabold text-black">DO</div>
              </div>
            </Link>
            <div className="hidden sm:flex items-center text-sm text-gray-700 gap-4 ml-6">
              <Link to="/" className="hover:text-black transition">
                Home
              </Link>
              <Link to="/about" className="hover:text-black transition">
                About
              </Link>
              <Link to="/tasks" className="hover:text-black transition">
                Tasks
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-4">
              {user.id ? (
                <div className="flex items-center gap-3" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((s) => !s)}
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                    className="flex items-center gap-3 focus:outline-none"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || "User"
                      )}&background=random&size=128`}
                      alt={user.name || "User avatar"}
                      className="w-10 h-10 rounded-full shadow-md"
                    />
                    <span className="text-black font-medium hidden sm:inline">
                      {user.name}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-6 mt-12 w-44 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div id="mobile-menu" className="sm:hidden mt-2 pb-4">
            <div className="flex flex-col gap-2 px-2">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                to="/tasks"
                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                Tasks
              </Link>

              {user.id ? (
                <div className="mt-2 border-t pt-2">
                  <div className="flex items-center gap-3 px-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || "User"
                      )}&background=random&size=128`}
                      alt={user.name || "User avatar"}
                      className="w-10 h-10 rounded-full shadow-sm"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 px-2">
                    <Link
                      to="/profile"
                      className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex gap-2 px-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 text-center bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar