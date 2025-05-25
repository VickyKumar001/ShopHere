import React from 'react';
import PlaceHolder from './PlaceHolder'; // Ensure this path is correct

const PlaceHolderContainer = () => {
    const placeNumber = [...Array(8).keys()];

    return (
        <section className="py-5" id="shop">
            <h4 className="text-center mb-4">Our Products</h4>
            <div className="container px-4 px-lg-5 mt-5">
                <div className="row">
                    {placeNumber.map(num => (
                        <PlaceHolder key={num} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlaceHolderContainer;
