import {Link, useNavigate} from "react-router-dom";
import {FaGithub} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {login, me, messageClear} from "../store/reducers/authReducers.js";
import toast from "react-hot-toast";

export const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, isLoading, errorMessage, successMessage} = useSelector(state => state.auth);

    useEffect(() => {
        if (user?.id && user?.username && user?.roles) {
            navigate("/todo-list")
        }
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onTouched"
    });

    const onSubmitHandler = (data) => {
        dispatch(login({
            email: data.email,
            password: data.password
        }));
    }

    useEffect(() => {
        if (successMessage) {
            reset();
            toast.success(successMessage);
            setTimeout(() => {
                navigate('/todo-list')
            }, 500)
        }

        if (errorMessage) {
            toast.error(errorMessage);
        }
        dispatch(messageClear())
    }, [successMessage, errorMessage]);

    return (
        <main
            className={`w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#cd25df] to-[#2ced26]`}>
            <div className={`bg-white py-8 px-8 rounded-xl flex flex-col items-center justify-center w-md`}>
                <h1 className={`font-bold text-5xl text-center mb-6`}>Login</h1>
                <div className={`w-full flex gap-2 mb-6`}>
                    <Link to={"/#"} className={` w-[50%] flex items-center justify-center gap-2 border 
                   border-slate-700 rounded-md py-1.5 hover:bg-[#cad5e2] transition-colors duration-300 ease-in-out`}>
                        <span><FcGoogle size={25}/></span>
                        <span>Login with Google</span>
                    </Link>
                    <Link to={"/#"} className={` w-[50%] flex items-center justify-center gap-2 border 
                   border-slate-700 rounded-md py-1.5 hover:bg-[#cad5e2] transition-colors duration-300 ease-in-out`}>
                        <span><FaGithub size={25}/></span>
                        <span>Login with GitHub</span>
                    </Link>
                </div>
                <form className={`w-full mb-3`} onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id={"email"}
                            type="email"
                            placeholder={'john.doe@example.com'}
                            className={`outline-none border rounded-md px-2 py-1
                                ${errors["email"]?.message ? "border-red-500" : "border-slate-300"}`
                            }
                            {...register("email", {
                                required: {value: true, message: "Email is required"}
                            })}
                        />
                        {errors["email"]?.message && (
                            <p className={`text-sm font-semibold text-red-500 mt-0`}>{errors["email"].message}</p>
                        )}
                    </div>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="password">Password</label>
                        <input
                            id={'password'}
                            type="password"
                            placeholder={'··········'}
                            className={`outline-none border rounded-md px-2 py-1
                                ${errors["password"]?.message ? "border-red-500" : "border-slate-300"}`
                            }
                            {...register("password", {
                                required: {value: true, message: "Password is required"},
                                minLength: {value: 12, message: "Password must have at least 12 characters"}
                            })}
                        />
                        {errors["password"]?.message && (
                            <p className={`text-sm font-semibold text-red-500 mt-0`}>{errors["email"].message}</p>
                        )}
                    </div>
                    <button
                        type={"submit"}
                        className={`text-center w-full bg-[#3d95d8] hover:bg-[#2870a8] 
                        text-white font-bold text-lg rounded-md py-2 mb-3`}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>
                <div className={`flex items-center gap-1.5 text-sm`}>
                    <p className={`text-slate-700`}>Don't have account?</p>
                    <Link to={'/register'} className={`font-bold text-[#a21bb1]`}>Click Here</Link>
                </div>
            </div>
        </main>
    )
}
