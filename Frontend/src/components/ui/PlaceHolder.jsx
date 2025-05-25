import React from 'react';

const PlaceHolder = () => {
    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm" aria-hidden="true">
                <div
                    className="placeholder-glow"
                    style={{
                        height: '180px',
                        backgroundColor: '#e0e0e0',
                        borderTopLeftRadius: '0.25rem',
                        borderTopRightRadius: '0.25rem',
                    }}
                ></div>
                <div className="card-body">
                    <p className="card-text placeholder-glow">
                        <span className="placeholder col-10 mb-2 d-block"></span>
                        <span className="placeholder col-8 d-block"></span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlaceHolder;
