import { suggestions } from '@/app/_components/Hero'
import React from 'react'

function EmptyBoxState({ onSelectOption }: any) {
    return (
        <div className='mt-7 px-4'>
            <h2 className='font-bold text-3xl text-center text-foreground'>
                Start Planning new <strong className='text-primary'>Trip</strong> using AI
            </h2>
            <p className='text-center text-muted-foreground mt-2 leading-relaxed'>
                Discover personalized travel itineraries, find the best destinations, and plan your dream vacation effortlessly with the power of AI. Let our smart assistant do the hard work while you enjoy the journey.
            </p>

            <div className='flex flex-col gap-4 mt-7'>
                {suggestions.map((suggestion, index) => (
                    <div key={index}
                        onClick={() => onSelectOption(suggestion.title)}
                        className='flex items-center gap-3 border border-border
                                rounded-xl p-4 cursor-pointer hover:border-primary hover:bg-primary/5 
                                bg-card text-card-foreground transition-all duration-200 hover:shadow-md'>
                        <div className="flex-shrink-0">{suggestion.icon}</div>
                        <h2 className='text-lg font-medium'>{suggestion.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EmptyBoxState