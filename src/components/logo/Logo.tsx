"use cliente";

import Image from "next/image"

type TProp = {
    width: number;
    height: number
}

export const Logo = ({width, height}: TProp) => {
    return (
        <div>
            <img width={width} height={height} className="" src="/assets/images/logo.png" />
        </div>
    )
}