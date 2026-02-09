import React from 'react'

const HotelBanner = ({ image }) => {
  return (
    <div style={{ height: 200, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {image ? (
            <img src={image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
            'Big Banner Image'
        )}
    </div>
  )
}

export default HotelBanner
