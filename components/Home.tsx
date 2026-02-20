import Image from "next/image";

const Home = ()=>{
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <div className="text-center">
                <Image

                    src="https://www.quesscorp.com/wp-content/uploads/2022/11/quessbluesvg.svg"
                    alt="Quess Corp Logo"
                    width={300}
                    height={100}
                    className="mx-auto mb-8"
                />
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                    Welcome to Quess Corp Employee Management System
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Manage employees and attendance efficiently.
                </p>
            </div>
        </div>
    );
}

export default Home;