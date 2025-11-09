import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Pricing() {
    return (
        <div className='mt-20'>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 1rem' }}>
                <PricingTable />
            </div>
        </div>
    )
}

export default Pricing