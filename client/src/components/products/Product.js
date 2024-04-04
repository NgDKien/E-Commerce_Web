import React, { useState, memo } from "react";
import { formatMoney } from "../../ultils/helpers";
import label from '../../assets/new.png'
import trending from '../../assets/trending.png'
import { renderStarFromNumber } from '../../ultils/helpers'
import { SelectOption } from '..'
import icons from "../../ultils/icons";
import { Link } from "react-router-dom";
import path from "../../ultils/path";
import { DetailProduct } from "pages/public"
import withBaseComponent from "hocs/withBaseComponent"
import { showModal } from "store/app/appSlice"

const { IoEyeSharp, MdMenuOpen, FaHeart } = icons

const Product = ({ productData, isNew, normal, navigate, dispatch }) => {
  const [isShowOption, setIsShowOption] = useState(false)

  // const handleClickOptions = async (e, flag) => {
  //     e.stopPropagation()
  //     if (flag === "CART") {
  //       if (!current)
  //         return Swal.fire({
  //           title: "Almost...",
  //           text: "Please login first!",
  //           icon: "info",
  //           cancelButtonText: "Not now!",
  //           showCancelButton: true,
  //           confirmButtonText: "Go login page",
  //         }).then(async (rs) => {
  //           if (rs.isConfirmed)
  //             navigate({
  //               pathname: `/${path.LOGIN}`,
  //               search: createSearchParams({
  //                 redirect: location.pathname,
  //               }).toString(),
  //             })
  //         })
  //       const response = await apiUpdateCart({
  //         pid: productData?._id,
  //         color: productData?.color,
  //         quantity: 1,
  //         price: productData?.price,
  //         thumbnail: productData?.thumb,
  //         title: productData?.title,
  //       })
  //       if (response.success) {
  //         toast.success(response.mes)
  //         dispatch(getCurrent())
  //       } else toast.error(response.mes)
  //     }
  //     if (flag === "WISHLIST") {
  //       const response = await apiUpdateWishlist(pid)
  //       if (response.success) {
  //         dispatch(getCurrent())
  //         toast.success(response.mes)
  //       } else toast.error(response.mes)
  //     }
  //     if (flag === "QUICK_VIEW") {
  //       dispatch(
  //         showModal({
  //           isShowModal: true,
  //           modalChildren: (
  //             <DetailProduct
  //               data={{ pid: productData?._id, category: productData?.category }}
  //               isQuickView
  //             />
  //           ),
  //         })
  //       )
  //     }
  //   }

  const handleClickOptions = (e, flag) => {
    e.stopPropagation()
    if (flag === "MENU") navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)
    if (flag === "WISHLIST") console.log("wishlist")
    if (flag === "QUICK_VIEW") {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <DetailProduct
              data={{ pid: productData?._id, category: productData?.category }}
              isQuickView
            />
          ),
        })
      )
    }
  }

  return (
    <div className="w-full text-base px-[10px]">
      <div
        className="w-full border p-[15px] flex flex-col items-center"
        onClick={(e) =>
          navigate(
            `/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`
          )
        }
        onMouseEnter={e => {
          e.stopPropagation()
          setIsShowOption(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setIsShowOption(false)
        }}
      >
        <div className="w-full relative">
          {isShowOption && <div className="absolute gap-2 bottom-[-10px] left-0 right-0 flex justify-center animate-slide-top">
            <span onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}><SelectOption icon={<IoEyeSharp />} /></span>
            <span onClick={(e) => handleClickOptions(e, 'MENU')}><SelectOption icon={<MdMenuOpen />} /></span>
            <span onClick={(e) => handleClickOptions(e, 'WISHLIST')}><SelectOption icon={<FaHeart />} /></span>
          </div>}
          <img
            src={productData?.thumb || "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"}
            alt=""
            className="w-[274px] h-[274px] object-cover"
          />
          {!normal &&
            <img
              src={isNew ? label : trending}
              alt=""
              className="absolute w-[100px] h-[35px] top-[0] right-[0] object-cover"
            />}

        </div>
        <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span className="line-clamp-1">
            {productData?.title}
          </span>
          <span>
            {`${formatMoney(productData?.price)} VND`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Product))