import React, { Fragment, useState, useEffect, memo } from 'react'
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'
import { useDispatch, useSelector } from "react-redux"
import { logout } from "store/user/userSlice"
import withBaseComponent from 'hocs/withBaseComponent'
import { showCart } from 'store/app/appSlice'

const { FaPhone, IoIosMail, BsBagPlusFill, FaUserCircle } = icons
const Header = ({ dispatch }) => {
    const { current } = useSelector((state) => state.user)
    const [isShowOption, setIsShowOption] = useState(false)

    useEffect(() => {
        const handleClickoutOptions = (e) => {
            const profile = document.getElementById("profile")
            if (!profile?.contains(e.target)) setIsShowOption(false)
        }

        document.addEventListener("click", handleClickoutOptions)

        return () => {
            document.removeEventListener("click", handleClickoutOptions)
        }
    }, [])

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
                {current && <Fragment>
                    <div onClick={() => dispatch(showCart())} className="flex items-center justify-center gap-2 px-6 border-r">
                        <BsBagPlusFill color="red" size={20} />
                        <span>{`${current?.cart?.length || 0} item(s)`}</span>
                    </div>
                    <div className='flex cursor-pointer gap-2 items-center justify-center px-6 relative'
                        onClick={() => setIsShowOption((prev) => !prev)}
                        id="profile"
                    >
                        <FaUserCircle size={30} color='red' />
                        <span>Profile</span>
                        {isShowOption && (
                            <div
                                className="absolute top-full flex-col flex right-4 md:left-[16px] bg-gray-100 border md:min-w-[150px] py-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Link
                                    className="p-2 w-full hover:bg-sky-100"
                                    to={`/${path.MEMBER}/${path.PERSONAL}`}
                                >
                                    Personal
                                </Link>
                                {+current.role === 1945 && (
                                    <Link
                                        className="p-2 w-full hover:bg-sky-100"
                                        to={`/${path.ADMIN}/${path.DASHBOARD}`}
                                    >
                                        Admin workspace
                                    </Link>
                                )}
                                <span
                                    onClick={() => dispatch(logout())}
                                    className="p-2 w-full hover:bg-sky-100"
                                >
                                    Logout
                                </span>
                            </div>
                        )}
                    </div>
                </Fragment>}
            </div>
        </div>
    )
}

export default withBaseComponent(memo(Header))