import React, { memo } from "react"

const Banner = () => {
    return (
        <div className="w-full">
            <img
                src="https://statics.vincom.com.vn/chi_tiet_uu_dai/anh_bai_viet/Online_Vincom_1170x512.png"
                alt="banner"
                className="h-[400px] w-full object-cover"
            />
        </div>
    )
}

export default memo(Banner)