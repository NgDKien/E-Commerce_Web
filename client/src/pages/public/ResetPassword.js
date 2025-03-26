import React, { useState } from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const { token } = useParams()

    const handleResetPassword = async () => {
        const response = await apiResetPassword({ password, token })
        if (response.success) {
            toast.success(response.mes, { theme: 'colored' })
        } else toast.info(response.mes, { theme: 'colored' })

    }
    return (
        // <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
        //     <div className='flex flex-col gap-4'>
        //         <label htmlFor="password">Enter your new password:</label>
        //         <input
        //             type="text"
        //             id="password"
        //             className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
        //             placeholder='Type here'
        //             value={password}
        //             onChange={e => setPassword(e.target.value)}
        //         />
        //         <div className='flex items-center justify-end w-full gap-4'>
        //             <Button
        //                 name='Submit'
        //                 handleOnClick={handleResetPassword}
        //                 style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
        //             />
        //         </div>
        //     </div>
        // </div>
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-fade-in'>
                <div className='p-6'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Set New Password</h2>
                    <div className='flex flex-col gap-4 w-full'>
                        <label htmlFor="password" className='text-gray-700 font-medium'>Enter your new password:</label>
                        <input
                            type="password"
                            id="password"
                            className='w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                            placeholder='Enter your new password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <p className="text-sm text-gray-500 mt-1">Password should be at least 8 characters long</p>

                        <div className='flex items-center justify-end w-full gap-3 mt-4'>
                            <Button
                                name='Submit'
                                handleOnClick={handleResetPassword}
                                style='px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium'
                            >
                                Update Password
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword