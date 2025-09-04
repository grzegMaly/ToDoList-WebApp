import {Link} from "react-router-dom";

export const WelcomePage = () => {
    return (
        <main className={`w-full h-[100vh] flex justify-center items-center bg-[#454545]`}>
            <div className={`flex flex-col items-center justify-center text-white w-[40%] text-center`}>
                <h1 className={`font-bold text-[3.5rem] mb-4`}>Welcome to ToDo List App</h1>
                <p className={`text-2xl mb-8 text-center`}>Here you can write as many notes as you want</p>
                <Link
                    to={'/todo-list'}
                    className={`block py-4 px-8 bg-[#3d95d8] hover:bg-[#2081c8] font-bold text-white 
                    min-w-[40%] rounded-md text-center`}
                >
                    Click here to start
                </Link>
            </div>
        </main>
    )
}
