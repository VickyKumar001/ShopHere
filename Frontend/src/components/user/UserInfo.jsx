import React from 'react';
import styles from './UserInfo.module.css';
import dummyImage from '../../assets/dummy-profile.jpg';
const UserInfo = ({ userInfo }) => {

  return (
    <div className="container my-4">
      <div className="row">
        {/* Left Profile Card */}
        <div className="col-md-4 mb-4">
          <div className={`card p-3 text-center ${styles.textCenter}`}>
            <h6 className="fw-bold">User Profile</h6>
            <img
              src={dummyImage}
              alt="Profile picture"
              className={`img-fluid rounded ${styles.profileImage}`}
            />
            <h5 className="fw-bold mt-3">{userInfo.username}</h5>
            <p className="text-muted">{userInfo.email}</p>
            <button
              className="btn mt-2"
              style={{ backgroundColor: '#6050DC', color: 'white' }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right Account Info */}
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm">
            <div
              className="card-header"
              style={{ backgroundColor: '#6050DC', color: 'white' }}
            >
              Account Overview
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <p><strong>Full Name:</strong>{` ${userInfo.first_name} ${userInfo.last_name}`}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Phone:</strong> +91 1234567890</p>
                </div>
                <div className="col-sm-6 mb-3">
                  <p><strong>City:</strong> {userInfo.city}</p>
                  <p><strong>State:</strong> {userInfo.state}</p>
                  <p><strong>Member Since:</strong> 2025 </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
