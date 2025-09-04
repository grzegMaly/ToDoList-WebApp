import {Link} from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <main className={`w-full min-h-screen flex items-center justify-center bg-[#454545] text-white`}>
            <div className={`text-center flex flex-col items-center justify-center`}>
                <h1 className={`mb-8 text-[3.5rem] font-bold`}>404 Not Found</h1>
                <p className={`mb-8 text-2xl`}>We couldn't find this page</p>
                <Link to={'/'} className={`mb-8 text-xl font-bold bg-[#6066e1] text-[#ccc] py-4 px-8 rounded-lg hover:bg-[#747ad8]`}>Go Back to Home Page</Link>
            </div>
        </main>
    )
}
