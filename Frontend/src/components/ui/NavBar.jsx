import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaCartShopping } from 'react-icons/fa6'
import styles from './NavBar.module.css'
import NavBarLink from './NavBarLink'

const NavBar = ({ numCartItems, username, logout }) => {
    const [isTogglerOpen, setIsTogglerOpen] = useState(false)

    const toggleNavbar = () => {
        setIsTogglerOpen(prev => !prev)
    }

    return (
        <nav className={`navbar navbar-expand-lg bg-white shadow-sm py-3 ${styles.stickyNavbar}`}>
            <div className="container">
                <Link className="navbar-brand fw-bold text-uppercase" to="/">ShopHere</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded={isTogglerOpen}
                    aria-label="Toggle navigation"
                    onClick={toggleNavbar}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isTogglerOpen ? 'show' : ''}`} id="navbarContent">
                    <NavBarLink />

                    {/* Auth buttons (shown when toggler is active) */}
                    <ul className="navbar-nav ms-auto d-lg-none mt-3">
                        {username ? (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        to="/profile"
                                        className={({ isActive }) =>
                                            isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'
                                        }
                                        end
                                    >
                                        Hi, {username}
                                    </NavLink>
                                </li>
                                <li className="nav-item" onClick={logout}>
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'
                                        }
                                        end
                                    >
                                        Logout
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'
                                        }
                                        end
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/register"
                                        className={({ isActive }) =>
                                            isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'
                                        }
                                        end
                                    >
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Cart button (always visible) */}
                    <Link
                        to="/cart"
                        className={`btn btn-dark ms-3 rounded-pill position-relative ${styles.responsiveCart}`}
                    >
                        <FaCartShopping />
                        {numCartItems === 0 || (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                style={{ fontSize: "0.85rem", padding: "0.5em 0.65em", backgroundColor: "#6050DC" }}
                            >
                                {numCartItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
