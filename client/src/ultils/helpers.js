import icons from "./icons"

const { FaStar, CiStar } = icons

export const createSlug = (string) =>
    string
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(" ")
        .join("-")

export const formatMoney = (number) =>
    Number(number?.toFixed(1)).toLocaleString()

export const renderStarFromNumber = (number, size) => {
    //Nếu số truyền vào ko phải dạng number thì return 
    if (!Number(number)) return
    const stars = []
    number = Math.round(number)
    for (let i = 0; i < +number; i++)
        stars.push(<FaStar color="orange" size={size || 16} />)
    for (let i = 5; i > +number; i--)
        stars.push(<CiStar color="orange" size={size || 16} />)
    return stars
}

export function secondsToHms(d) {
    d = Number(d) / 1000
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    const s = Math.floor((d % 3600) % 60)
    return { h, m, s }
}