import React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const NavBarLink = () => {
    const { isAuthenticated , setIsAuthenticated, username} = useContext(AuthContext)

    function logout() {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);

    }

    return (
        <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
            {isAuthenticated
                ?
                (
                    <>
                        <li className='nav-item'>
                            <NavLink
                                to='/profile'
                                className={({ isActive }) => isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'}
                                end
                            >
                                Hi, {username}
                            </NavLink>
                        </li>
                        <li className='nav-item' onClick={logout}>
                            <NavLink
                                to='/'
                                className={({ isActive }) => isActive ? 'active nav-link fw-semibold' : 'nav-link fw-semibold'}
                                end
                            >
                                Logout
                            </NavLink>
                        </li>
                    </>
                )
                :
                (
                    <>
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

                    </>
                )

            }
        </ul>
    )
}

export default NavBarLink