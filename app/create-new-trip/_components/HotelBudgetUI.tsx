import React from 'react'

export const SelectHotelBudgetOptions = [
    {
        id: 1,
        title: 'Low',
        desc: '₹0 - ₹3,000 per night',
        icon: '💵',
        color: 'bg-green-100 text-green-600',
        range: 'low'
    },
    {
        id: 2,
        title: 'Medium',
        desc: '₹3,000 - ₹8,000 per night',
        icon: '💰',
        color: 'bg-blue-100 text-blue-600',
        range: 'medium'
    },
    {
        id: 3,
        title: 'High',
        desc: '₹8,000 - ₹50,000 per night',
        icon: '💎',
        color: 'bg-purple-100 text-purple-600',
        range: 'high'
    },
    {
        id: 4,
        title: 'Luxury',
        desc: '₹50,000+ per night',
        icon: '💸',
        color: 'bg-yellow-100 text-yellow-600',
        range: 'luxury'
    },
]


function HotelBudgetUI({ onSelectedOption }: any) {
    return (
        <div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 items-center mt-1'>
                {SelectHotelBudgetOptions.map((item, index) => (
                    <div key={index} className='p-4 border rounded-2xl
                             bg-white hover:border-primary cursor-pointer flex flex-col items-center text-center
                             transition-all duration-200 hover:shadow-md'
                        onClick={() => onSelectedOption(item.range)}
                    >
                        <div className={`text-4xl p-3 rounded-full ${item.color}`}>{item.icon}</div>
                        <h2 className='text-lg font-semibold mt-2'>{item.title}</h2>
                        <p className='text-xs text-gray-500 mt-1'>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HotelBudgetUI
