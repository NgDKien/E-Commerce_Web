import React, { useState, useCallback } from 'react'
import { InputField, Button } from '../../components'

const Login = () => {
    const [isRegister, setIsRegister] = useState(false)
    const [payload, setPayload] = useState({
        email: "",
        password: "",
        // firstname: "",
        // lastname: "",
        // mobile: "",
        name: "",
    })

    const handleSubmit = useCallback(async () => {

    }, [payload])

    return (
        <div className="w-screen h-screen relative">
            <img
                src="https://img.freepik.com/premium-photo/shopping-cart-card-icon-discounts_116441-26066.jpg"
                alt=""
                className="w-full h-full object-cover"
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center flex">
                <div className="p-8 bg-white flex flex-col items-center rounded-md md:min-w-[500px]">
                    <h1 className="text-[28px] font-semibold text-main mb-8">
                        {isRegister ? "Register" : "Login"}
                    </h1>
                    {isRegister &&
                        <InputField
                            value={payload.name}
                            setValue={setPayload}
                            nameKey="name"
                        />}
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey="email"
                    // invalidFields={invalidFields}
                    // setInvalidFieds={setInvalidFields}
                    // fullWidth
                    />
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey="password"
                        type="password"
                    // invalidFields={invalidFields}
                    // setInvalidFieds={setInvalidFields}
                    // fullWidth
                    />
                    <Button handleOnClick={handleSubmit} fw name={isRegister ? "Register" : "Login"}>
                        {/* {isRegister ? "Register" : "Login"} */}
                    </Button>
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {!isRegister && (
                            <span
                                // onClick={() => setIsForgotPassword(true)}
                                className="text-blue-500 hover:underline cursor-pointer"
                            >
                                Forgot your account?
                            </span>
                        )}

                        {!isRegister && (
                            <span
                                className="text-blue-500 hover:underline cursor-pointer"
                                onClick={() => setIsRegister(true)}
                            >
                                Create account
                            </span>
                        )}

                        {isRegister && (
                            <span
                                className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                                onClick={() => setIsRegister(false)}
                            >
                                Go login
                            </span>
                        )}
                    </div>
                    {/* <Link
                    className="text-blue-500 text-sm hover:underline cursor-pointer"
                    to={`/${path.HOME}`}
                >
                    Go home?
                </Link> */}
                </div>
            </div>
        </div>
    )
}

export default Login