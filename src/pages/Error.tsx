import image from '../assets/404.png'

function Error() {
    return (
        <div className="w-full h-screen">
            <img src={image} className='w-1/4 ml-auto mr-auto mt-16'/>
            <h1 className="font-bold text-3xl text-center m-auto -mt-10">PAGE NOT FOUND</h1>
        </div>
    );
}

export default Error;
