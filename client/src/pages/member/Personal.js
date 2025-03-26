import moment from 'moment'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Button, InputForm } from 'components'
import avatar from 'assets/avatarDefault.png'
import { apiUpdateCurrent } from 'apis'
import { getCurrent } from 'store/user/asyncActions'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'
import withBaseComponent from 'hocs/withBaseComponent'

const Personal = ({ navigate }) => {
    const { register, formState: { errors, isDirty }, handleSubmit, reset, watch } = useForm()
    const { current } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()

    const handleUpdateInfor = async (data) => {
        const formData = new FormData()
        if (data.avatar.length > 0) formData.append('avatar', data.avatar[0])
        delete data.avatar
        for (let i of Object.entries(data)) formData.append(i[0], i[1])

        const response = await apiUpdateCurrent(formData)
        if (response.success) {
            dispatch(getCurrent())
            toast.success(response.mes)
            if (searchParams.get('redirect')) navigate(searchParams.get('redirect'))
        } else toast.error(response.mes)
    }

    useEffect(() => {
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
            address: current?.address,
        })
    }, [current])

    return (
        // <div className='w-full relative px-4'>
        //     <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
        //         Personal
        //     </header>
        //     <form onSubmit={handleSubmit(handleUpdateInfor)} className='w-3/5 mx-auto py-8 flex flex-col gap-4'>
        //         <InputForm
        //             label='Firstname'
        //             register={register}
        //             errors={errors}
        //             id='firstname'
        //             validate={{
        //                 required: 'This field is required'
        //             }}
        //         />
        //         <InputForm
        //             label='Lastname'
        //             register={register}
        //             errors={errors}
        //             id='lastname'
        //             validate={{
        //                 required: 'This field is required'
        //             }}
        //         />
        //         <InputForm
        //             label='Email address'
        //             register={register}
        //             errors={errors}
        //             id='email'
        //             validate={{
        //                 required: 'This field is required',
        //                 pattern: { value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message: 'Email invalid.' }
        //             }}
        //         />
        //         <InputForm
        //             label='Phone'
        //             register={register}
        //             errors={errors}
        //             id='mobile'
        //             validate={{
        //                 required: 'This field is required',
        //                 pattern: {
        //                     value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
        //                     message: 'Phone invalid.'
        //                 }

        //             }}
        //         />
        //         <InputForm
        //             label='Address'
        //             register={register}
        //             errors={errors}
        //             id='address'
        //             validate={{
        //                 required: 'This field is required',
        //             }}
        //         />
        //         <div className='flex items-center gap-2'>
        //             <span className='font-medium'>Account status:</span>
        //             <span>{current?.isBlocked ? 'Blocked' : 'Actived'}</span>
        //         </div>
        //         <div className='flex items-center gap-2'>
        //             <span className='font-medium'>Role:</span>
        //             <span>{+current?.role === 1945 ? 'Admin' : 'User'}</span>
        //         </div>
        //         <div className='flex items-center gap-2'>
        //             <span className='font-medium'>Created At:</span>
        //             <span>{moment(current?.createdAt).fromNow()}</span>
        //         </div>
        //         <div className='flex flex-col gap-2'>
        //             <span className='font-medium'>Profile image (Click to change):</span>
        //             <label htmlFor="file">
        //                 <img src={current?.avatar || avatar} alt="avatar" className='w-20 h-20 ml-8 object-cover rounded-full' />
        //             </label>
        //             <input type="file" id="file" {...register('avatar')} hidden />
        //         </div>
        //         {isDirty && <div className='w-full flex justify-end'><Button type='submit'>Update information</Button></div>}
        //     </form>
        // </div>
        <div className='w-full relative px-4 bg-gray-50'>
            <header className='text-xl font-bold py-4 uppercase'>
                Personal
            </header>
            <form onSubmit={handleSubmit(handleUpdateInfor)} className='w-full mx-auto py-4 flex flex-col gap-6'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="firstname" className="font-medium">Firstname:</label>
                    <input
                        type="text"
                        id="firstname"
                        placeholder="John"
                        className="p-3 bg-gray-200 rounded-sm"
                        {...register('firstname', {
                            required: 'This field is required'
                        })}
                    />
                    {errors.firstname && <span className="text-red-500 text-sm">{errors.firstname.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="lastname" className="font-medium">Lastname:</label>
                    <input
                        type="text"
                        id="lastname"
                        placeholder="Doe"
                        className="p-3 bg-gray-200 rounded-sm"
                        {...register('lastname', {
                            required: 'This field is required'
                        })}
                    />
                    {errors.lastname && <span className="text-red-500 text-sm">{errors.lastname.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-medium">Email address:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="User-01SDB@gmail.com"
                        className="p-3 bg-gray-200 rounded-sm"
                        {...register('email', {
                            required: 'This field is required',
                            pattern: { value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message: 'Email invalid.' }
                        })}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="mobile" className="font-medium">Phone:</label>
                    <input
                        type="text"
                        id="mobile"
                        placeholder="0123456789"
                        className="p-3 bg-gray-200 rounded-sm"
                        {...register('mobile', {
                            required: 'This field is required',
                            pattern: {
                                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                                message: 'Phone invalid.'
                            }
                        })}
                    />
                    {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="address" className="font-medium">Address:</label>
                    <input
                        type="text"
                        id="address"
                        placeholder="2611 Pago Pago Ave, Anchorage, Alaska"
                        className="p-3 bg-gray-200 rounded-sm"
                        {...register('address', {
                            required: 'This field is required',
                        })}
                    />
                    {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                </div>

                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Account status:</span>
                    <span>{current?.isBlocked ? 'Blocked' : 'Actived'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Role:</span>
                    <span>{+current?.role === 1945 ? 'Admin' : 'User'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Created At:</span>
                    <span>{moment(current?.createdAt).fromNow()}</span>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='font-medium'>Profile image (Click to change):</span>
                    <label htmlFor="file">
                        <img src={current?.avatar || avatar} alt="avatar" className='w-20 h-20 ml-8 object-cover rounded-full' />
                    </label>
                    <input type="file" id="file" {...register('avatar')} hidden />
                </div>
                {isDirty && <div className='w-full flex justify-end'><Button type='submit'>Update information</Button></div>}
            </form>
        </div>
    )
}

export default withBaseComponent(Personal)