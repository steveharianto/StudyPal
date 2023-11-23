import { useState } from "react";

const FindTutor = () => {
    // Temp Variables
    const [resultCount, setResultCount] = useState(3145684);
    const [currentCategory, setCurrentCategory] = useState("ui/ux design");

    // State to track the selected value
    const [selectedOption, setSelectedOption] = useState("");

    // Handler function to update the selected value
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const [users, setUsers] = useState([
        {
            userID: "U001",
            username: "Username1",
            email: "user1@gmail.com",
            password: "pass0001",
            dob: "2023-11-21T12:30:45.678Z",
            role: "Student",
        },
        {
            userID: "U002",
            username: "Username2",
            email: "user2@gmail.com",
            password: "pass0002",
            dob: "2023-11-21T12:30:45.678Z",
            role: "Tutor",
        },
    ]);
    // Class state
    const [classes, setClasses] = useState([
        {
            classID: "C001",
            image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4vlkTJCWbP2Kh2vyK9BdEw.png",
            name: "Flutter for Beginners",
            description: 'In a "Flutter for Beginners" tutor class, aspiring developers are introduced to the fundamentals of Flutter, a popular open-source framework for building natively compiled applications for mobile, web, and desktop from a single codebase.',
            tutor: "U001",
            tag: "IT & Software",
            price: 125000,
            rating: 4.9,
            students: 123,
        },
        {
            classID: "C002",
            image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4vlkTJCWbP2Kh2vyK9BdEw.png",
            name: "Flutter for Advanced",
            description: 'In a "Flutter for Beginners" tutor class, aspiring developers are introduced to the fundamentals of Flutter, a popular open-source framework for building natively compiled applications for mobile, web, and desktop from a single codebase.',
            tutor: "U001",
            tag: "IT & Software",
            price: 125000,
            rating: 4.7,
            students: 125,
        },
        {
            classID: "C003",
            image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4vlkTJCWbP2Kh2vyK9BdEw.png",
            name: "Flutter for Professionals",
            description: 'In a "Flutter for Beginners" tutor class, aspiring developers are introduced to the fundamentals of Flutter, a popular open-source framework for building natively compiled applications for mobile, web, and desktop from a single codebase.',
            tutor: "U001",
            tag: "IT & Software",
            price: 125000,
            rating: 4.8,
            students: 1222,
        },
        {
            classID: "C004",
            image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4vlkTJCWbP2Kh2vyK9BdEw.png",
            name: "Flutter for semi Professionals or something",
            description: 'In a "Flutter for Beginners" tutor class, aspiring developers are introduced to the fundamentals of Flutter, a popular open-source framework for building natively compiled applications for mobile, web, and desktop from a single codebase.',
            tutor: "U001",
            tag: "IT & Software",
            price: 125000,
            rating: 5.0,
            students: 110,
        },
        {
            classID: "C005",
            image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4h8xKhOdQQztEvyzTvycwQ.jpeg",
            name: "Flutter for Professionals",
            description: 'In a "Flutter for Beginners" tutor class, aspiring developers are introduced to the fundamentals of Flutter, a popular open-source framework for building natively compiled applications for mobile, web, and desktop from a single codebase.',
            tutor: "U001",
            tag: "IT & Software",
            price: 125000,
            rating: 4.4,
            students: 12,
        },
    ]);
    return (
        <div className="w-[80%] min-h-full mx-auto mt-8 flex flex-col">
            <div className="flex justify-between">
                <div className="flex">
                    <div>
                        <select id="dropdown" name="dropdown" value={selectedOption} onChange={handleSelectChange} className="block p-2 border rounded-md">
                            <option value="">Category</option>
                            <option value="IT & Software">IT & Software</option>
                            <option value="IT & Software">IT & Software</option>
                            <option value="IT & Software">IT & Software</option>
                            <option value="IT & Software">IT & Software</option>
                        </select>
                    </div>
                    <div className="relative ms-4 w-96">
                        <input type="text" name="" id="" className="pl-8 pr-2 py-2 border rounded-md w-full" placeholder="Search..." />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 absolute left-2 top-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center">
                    <p className="text-gray-500 me-4">Sort by: </p>
                    <div>
                        <select id="dropdown" name="dropdown" value={selectedOption} onChange={handleSelectChange} className="block p-2 border rounded-md">
                            <option value="Trending">Trending</option>
                            <option value="Trending">Trending</option>
                            <option value="Trending">Trending</option>
                            <option value="Trending">Trending</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex justify-between py-2 border-b-2">
                <div className="flex">
                    <p>Suggestion: </p>
                    {/* Suggestions Map TBD */}
                    <p className="text-blue-600 mx-2">user interface</p>
                    <p className="text-blue-600 mx-2">user experience</p>
                    <p className="text-blue-600 mx-2">web design</p>
                </div>

                <div className="flex">
                    <p className="font-medium">{resultCount.toLocaleString()}</p> <p className="mx-1">results find for </p>
                    <p>"{currentCategory}"</p>
                </div>
            </div>
            <div className="flex flex-wrap mt-4">
                {classes.map((item, index) => {
                    return (
                        <div className="flex flex-col h-72 md:w-[20%] my-4 md:mx-[2.5%] border-2 rounded-lg w-[40%] mx-[5%] shadow-lg hover:cursor-pointer hover:scale-105 transition-all">
                            <div className="rounded-t-lg h-[55%]">
                                <img src={item.image} alt="" className="object-cover h-full w-full rounded-t-lg" />
                            </div>
                            <div className="flex justify-between px-2 py-2">
                                <div className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[0.6em] rounded-sm h-fit my-auto">{item.tag}</div>
                                <div className="text-blue-600 h-fit">Rp. {item.price.toLocaleString()}</div>
                            </div>
                            <div className="px-2 font-medium text-sm tracking-wide h-12">{item.name}</div>
                            <hr />
                            <div className="flex justify-between my-auto px-2">
                                <div className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" strokeWidth={1.5} stroke="yellow" className="w-5 h-5 my-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                    <div className="ms-1 text-sm">{item.rating}</div>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 my-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    <p className="text-sm my-auto"> {item.students}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FindTutor;
