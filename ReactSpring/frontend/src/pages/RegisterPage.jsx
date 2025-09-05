import {Link, useNavigate} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import toast from "react-hot-toast";
import {messageClear, registerUser} from "../store/reducers/authReducers.js";

export const RegisterPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, isLoading, errorMessage, successMessage} = useSelector(state => state.auth);

    useEffect(() => {
        if (user?.id && user?.username && user?.roles) {
            navigate('/todo-list');
        }
    }, []);

    const {
        formState: {errors},
        reset,
        register,
        handleSubmit,
        getValues
    } = useForm({
        mode: "onTouched",
        defaultValues: {
            username: "",
            email: "",
            password: "",
            passwordConfirm: ""
        },
    });

    const onHandleSubmit = (data) => {
        dispatch(registerUser({
            username: data.username,
            email: data.email,
            password: data.password,
            passwordConfirm: data.passwordConfirm
        }));
        reset();
    }

    useEffect(() => {
        if (successMessage) {
            reset();
            toast.success(successMessage);
            setTimeout(() => {
                navigate('/todo-list');
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
                <h1 className={`font-bold text-5xl text-center mb-6`}>Register</h1>
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
                <form className={`w-full mb-3`} onSubmit={handleSubmit(onHandleSubmit)}>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="username">Username</label>
                        <input
                            id={"username"}
                            name={"username"}
                            type="text"
                            placeholder={'John Doe'}
                            className={`outline-none border rounded-md px-2 py-1
                                ${errors["username"]?.message ? "border-red-400" : "border-slate-300 "}`
                            }
                            {...register("username", {
                                required: {value: true, message: "Username is required"},
                                minLength: {value: 5, message: 'Username is to short. At least 5 characters'},
                                maxLength: {value: 20, message: "Username is to long. Max 20 characters"}
                            })}
                        />
                        {
                            errors["username"]?.message &&
                            <p className={`mt-0 text-sm font-semibold text-red-500`}>{errors["username"].message}</p>
                        }
                    </div>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id={"email"}
                            name={"email"}
                            type="email"
                            placeholder={'john.doe@example.com'}
                            className={`outline-none border border-slate-300 rounded-md px-2 py-1
                                ${errors["username"]?.message ? "border-red-400" : "border-slate-300 "}`
                            }
                            {...register("email", {
                                required: {value: true, message: "Email is required"},
                                maxLength: {value: 50, message: "Email is to long. Max 50 characters"},
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email format"
                                }
                            })}
                        />
                        {
                            errors["email"]?.message &&
                            <p className={`mt-0 text-sm font-semibold text-red-500`}>{errors["email"].message}</p>
                        }
                    </div>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="password">Password</label>
                        <input
                            id={'password'}
                            name={'password'}
                            type="password"
                            placeholder={'··········'}
                            className={`outline-none border  rounded-md px-2 py-1
                                ${errors["password"]?.message ? "border-red-400" : "border-slate-300"}`
                            }
                            {...register('password', {
                                required: {value: true, message: "Password is required"},
                                minLength: {value: 12, message: "Password is too short. At least 12 characters"}
                            })}
                        />
                        {
                            errors["password"]?.message &&
                            <p className={`mt-0 text-sm font-semibold text-red-500`}>{errors["password"].message}</p>
                        }
                    </div>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="passwordConfirm">Password Confirm</label>
                        <input
                            id={'passwordConfirm'}
                            name={'passwordConfirm'}
                            type="password"
                            placeholder={'··········'}
                            className={`outline-none border  rounded-md px-2 py-1
                                ${errors["passwordConfirm"]?.message ? "border-red-400" : "border-slate-300"}`
                            }
                            {...register("passwordConfirm", {
                                required: {value: true, message: "Password confirm is required"},
                                validate: (value) =>
                                    value === getValues("password") || "Passwords do not match"
                            })}
                        />
                        {
                            errors["passwordConfirm"]?.message &&
                            <p className={`mt-0 text-sm font-semibold text-red-500`}>{errors["passwordConfirm"].message}</p>
                        }
                    </div>
                    <button
                        type={"submit"}
                        className={`text-center w-full bg-[#3d95d8] hover:bg-[#2870a8] outline-none
                        text-white font-bold text-lg rounded-md py-2 mb-3`}
                    >
                        {isLoading ? "Loading..." : "Register"}
                    </button>
                </form>
                <div className={`flex items-center gap-1.5 text-sm`}>
                    <p className={`text-slate-700`}>Already have an account?</p>
                    <Link to={'/login'} className={`font-bold text-[#a21bb1]`}>Click Here</Link>
                </div>
            </div>
        </main>
    )
}
