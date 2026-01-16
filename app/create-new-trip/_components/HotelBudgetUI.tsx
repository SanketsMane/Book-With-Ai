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
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 items-center mt-2'>
                {SelectHotelBudgetOptions.map((item, index) => (
                    <div key={index}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center text-center transition-all duration-200 group
                        ${item.range === 'luxury' ? 'bg-amber-50 border-amber-100 hover:border-amber-300' :
                                item.range === 'high' ? 'bg-purple-50 border-purple-100 hover:border-purple-300' :
                                    item.range === 'medium' ? 'bg-blue-50 border-blue-100 hover:border-blue-300' :
                                        'bg-green-50 border-green-100 hover:border-green-300'} hover:shadow-md hover:-translate-y-1`}
                        onClick={() => onSelectedOption(item.range)}
                    >
                        <div className={`text-3xl p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                        <h2 className='text-base font-bold text-gray-800'>{item.title}</h2>
                        <p className='text-[10px] text-gray-500 font-medium px-2 py-1 rounded-full bg-white/60 mt-1'>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HotelBudgetUI
