// Import Images
import image from '../assets/login.png';
import google from '../assets/google.png'

// Hook


function Login() {
  return (
    <>
      <div className="grid grid-cols-5" style={{ width: "100vw", height: "90vh" }}>
        <div className="col-span-3 h-full" style={{}}>
            <div className='container ml-32 mt-20 w-auto'>
                <h2 className='font-semibold ml-32 text-2xl font-sans'>Sign In to your Account 🤗</h2>
                <div className='mt-5'><a>Email</a></div>
                <input type='text' className='mt-4 h-10 w-3/4 border-2 p-3'  placeholder='Username or email address...'></input>
                <div className='mt-5'><a>Password</a></div>
                <input type='password' className='mt-4 h-10 w-3/4 border-2 p-3' placeholder='Password'></input> <br />
                <button className='font-medium h-10 w-32 mt-5' style={{background:"#3f5db7",color:"white"}}>Sign In</button>
                <br />
                <button style={{borderColor:"#3f5db7"}} className='font-medium h-12 rounded-xl w-3/4 mt-20 border-2'>< img src={google} className='w-10 float-left ml-32'/><div className='mt-2 mr-36'>Login with Google</div></button>
            </div>
        </div>
        <div className="col-span-2 h-full" ><img src={image} alt="Login" style={{ height:"100%",objectFit:"cover"}} /></div>
      </div>
    </>
  );
}

export default Login;
