import React, { memo } from "react"
// import { CgSpinner } from "react-icons/cg"

const Button = ({
    name,
    handleOnClick,
    style,
    fw,
    //   type = "button",
    //   disabled,
    iconsBefore,
    iconsAfter
}) => {
    return (
        <button
            type='button'
            className={
                style
                    ? style
                    : `px-4 py-2 rounded-md text-white flex items-center justify-center bg-main text-semibold my-2 ${fw ? "w-full" : "w-fit"
                    }`
            }
            onClick={() => {
                handleOnClick && handleOnClick()
            }}
        >
            {/* {disabled && (
        <span className="animate-spin">
          <CgSpinner size={18} />
        </span>
      )}
      {children} */}
            {iconsBefore}
            <span>{name}</span>
            {iconsAfter}
        </button>
    )
}

export default memo(Button)