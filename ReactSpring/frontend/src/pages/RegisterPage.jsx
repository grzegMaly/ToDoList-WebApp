import {Link} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";

export const RegisterPage = () => {
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
                <form className={`w-full mb-3`}>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            placeholder={'john.doe@example.com'}
                            className={`outline-none border border-slate-300 rounded-md px-2 py-1`}
                        />
                    </div>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="password">Password</label>
                        <input
                            id={'password'}
                            type="password"
                            placeholder={'··········'}
                            className={`outline-none border border-slate-300 rounded-md px-2 py-1`}
                        />
                    </div>
                    <div className={`flex flex-col mb-4`}>
                        <label htmlFor="passwordConfirm">Password Confirm</label>
                        <input
                            id={'passwordConfirm'}
                            type="password"
                            placeholder={'··········'}
                            className={`outline-none border border-slate-300 rounded-md px-2 py-1`}
                        />
                    </div>
                    <button
                        type={"submit"}
                        className={`text-center w-full bg-[#3d95d8] hover:bg-[#2870a8] 
                        text-white font-bold text-lg rounded-md py-2 mb-3`}
                    >
                        Register
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
