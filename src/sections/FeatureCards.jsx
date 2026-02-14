import React from 'react';

const FeatureCards = ({ t }) => {
    // Fetch the 'abilities' array from the translation file using the 't' function.
    const abilities = t('abilities', { returnObjects: true });

    // Add a defensive check to ensure 'abilities' is a valid array before mapping.
    if (!Array.isArray(abilities)) {
        console.error("The 'abilities' translation key is missing or not an array.");
        return null;
    }

    return (
        <div className='w-full padding-x-lg'>
            <div className='mx-auto grid-3-cols'>
                {abilities.map(({imgPath, title, desc}) => (
                    <div
                        key={title}
                        className='card-border rounded-xl p-8 flex flex-col gap-4'
                    >
                        <div className='size-14 flex item-center justify-center rounded-full'>
                            <img src={imgPath} alt={title} />
                        </div>
                        <h3 className='text-white text-2xl font-semibold mt-2'>{title}</h3>
                        <p className='text-white-50 text-lg'>{desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureCards;
