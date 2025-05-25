import React from 'react'
import { NavLink } from 'react-router-dom'

const Links = () => {
    return (
        <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
                <NavLink
                    to='/login'
                    className={({ isActive }) => isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'}
                    end
                >
                    Login
                </NavLink>
            </li>
            <li className='nav-item'>
                <NavLink
                    to='/register'
                    className={({ isActive }) => isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'}
                    end
                >
                    Register
                </NavLink>
            </li>
            <li className='nav-item'>
                <NavLink
                    to='/profile'
                    className={({ isActive }) => isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'}
                    end
                >
                    Hi, User
                </NavLink>
            </li>
            <li className='nav-item'>
                <NavLink
                    to='/logout'
                    className={({ isActive }) => isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'}
                    end
                >
                    Logout
                </NavLink>
            </li>
        </ul>
    )
}

export default Links