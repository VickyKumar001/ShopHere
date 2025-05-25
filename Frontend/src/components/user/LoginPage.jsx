import React, { useContext, useEffect, useState } from 'react'
import './LoginPage.css'
import api from '../../api'
import Error from '../ui/Error'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


const LoginPage = () => {


    const {setIsAuthenticated, get_username} = useContext(AuthContext);


    const location = useLocation();
    const navigate = useNavigate();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const userInfo={
        username: username,
        password: password
    }

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        api.post('token/', userInfo)
        .then(res => {
            console.log(res.data)
            localStorage.setItem("access", res.data.access)
            localStorage.setItem("refresh", res.data.refresh)
            setUsername("")
            setPassword("")
            setLoading(false)
            setIsAuthenticated(true)
            get_username()
            setError("")

            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
            
        }).catch(err => {
            console.log(err.message)
            setLoading(false)
            setError(err.message)
        })

        // console.log(username, password)
    }

  return (
    <div className='login-container my-5'>
        <div className='login-card shadow'>
            {error && <Error error={error} />}
            <h2 className='login-title'>Welcome Back</h2>
            <p className='login-subtitle'>Please login to your account</p>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='username' className='form-label'>Username</label>
                    <input type='username' className='form-control' value={username} onChange={(e) => setUsername(e.target.value)} id='email' placeholder='Enter your username' required />
                </div>
                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>Password</label>
                    <input type='password' className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} id='password' placeholder='Enter your password' required />
                </div>
                <button type='submit'  className='btn btn-primary w-100' disabled={loading}>Login</button>
            </form>
            <div className='login-footer'>
                <p><a href='/forgot-password'>Forgot password?</a></p>
                <p>Don't have an account? <a href='/register'>Sign up</a></p>
            </div>
        </div>
    </div>
  )
}

export default LoginPage