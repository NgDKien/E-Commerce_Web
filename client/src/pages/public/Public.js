import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Navigation } from '../../components'
import Footer from 'components/footer/Footer'
import TopHeaders from 'components/headers/TopHeader'

const Public = () => {
    return (
        <div className='max-h-screen overflow-y-auto w-full flex flex-col items-center'>
            <TopHeaders />
            <Header />
            <Navigation />
            <div className='w-main'>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Public