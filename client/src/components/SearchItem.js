import React, { memo } from "react";
import icons from "../ultils/icons";

const { MdArrowDropDownCircle } = icons

const SearchItem = ({ name, activeClick, changeActiveFitler }) => {
    return (
        <div className="p-3 cursor-pointer text-gray-500 gap-6 relative text-xs border border-gray-800 flex justify-between items-center"
            onClick={() => changeActiveFitler(name)}>
            <span className="capitalize">{name}</span>
            <MdArrowDropDownCircle />
            {activeClick === name &&
                <div className="absolute top-full left-0 w-fit p-4 bg-red-500">
                    context
                </div>
            }
        </div>
    )
}

export default memo(SearchItem)