import React, { memo, useEffect } from "react"
import { Link } from "react-router-dom"
import path from "../ultils/path"
import { getCurrent } from "../store/user/asyncActions"
import { useSelector, useDispatch } from "react-redux"
import icons from "../ultils/icons"
import { logout } from "../store/user/userSlice"
// import Swal from "sweetalert2"

const { IoLogOut } = icons

const TopHeader = () => {
  const { isLoggedIn, current, mes } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  //   const navigate = useNavigate()
  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent())
    }, 300)

    return () => {
      clearTimeout(setTimeoutId)
    }
  }, [dispatch, isLoggedIn])

  //   useEffect(() => {
  //     if (mes)
  //       Swal.fire("Oops!", mes, "info").then(() => {
  //         dispatch(clearMessage())
  //         navigate(`/${path.LOGIN}`)
  //       })
  //   }, [mes])
  return (
    <div className="h-[38px] w-full bg-main flex items-center justify-center">
      <div className="w-main flex items-center justify-between text-xs text-white">
        <span
          className="hidden md:inline-block"
        >
          ORDER ONLINE OR CALL US (+1800) 000 8808
        </span>
        {isLoggedIn ?
          <div className=" flex gap-4 text-sm items-center">
            <span className="pl-2">{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
            <span
              onClick={() => dispatch(logout())}
              className="hover:rounded-full hover:bg-gray-200 cursor-pointer hover:text-main p-2"
            >
              <IoLogOut size={18} />
            </span>
          </div>
          :
          <Link className="hover:text-gray-800" to={`/${path.LOGIN}`}>
            Sign In or Create Account
          </Link>
        }
      </div>
    </div>
  )
}

export default memo(TopHeader)