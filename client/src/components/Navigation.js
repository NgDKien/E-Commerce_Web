import React from 'react'
import { navigation } from '../ultils/contants'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
    return (
        <div className='w-main w-full h-[48px] border-y flex items-center px-4 md:px-0 justify-between border-y'>
            {navigation.map((el) => (
                <NavLink
                    to={el.path}
                    key={el.id}
                    className={({ isActive }) =>
                        isActive
                            ? "py-3 font-semibold text-sm hover:text-main text-main"
                            : "py-3 text-sm hover:text-main"
                    }
                >
                    {el.value}
                </NavLink>
            ))}
        </div>
    )
}

export default Navigation