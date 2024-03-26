import React from 'react'
import logo from '../assets/logo.png'
import icons from '../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const Header = () => {
    const { FaPhone, IoIosMail, BsBagPlusFill, FaUserCircle } = icons
    return (
        <div className="w-main flex justify-between h-[110px] py-[35px]">
            <Link className="w-fit h-fit" to={`/${path.HOME}`}>
                <img
                    src={logo}
                    alt="logo"
                    className="h-[20px] md:w-[234px] md:h-fit object-contain"
                />
            </Link>
            <div className="flex text-[13px]">
                <div className="md:flex hidden flex-col px-6 border-r items-center">
                    <span className="flex gap-4 items-center">
                        <FaPhone color="red" />
                        <span className="font-semibold">(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className="flex flex-col items-center px-4 border-r">
                    <span className="flex gap-4 items-center">
                        <IoIosMail color="red" size={20} />
                        <span className="font-semibold">SUPPORT@TADATHEMES.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-6 border-r">
                    <BsBagPlusFill color="red" size={20} />
                    <span>0 item(s)</span>
                </div>
                <div className='flex cursor-pointer gap-2 items-center justify-center px-6'>
                    <FaUserCircle size={30} color='red' />
                    <span>Profile</span>
                </div>
            </div>
        </div>
    )
}

export default Header