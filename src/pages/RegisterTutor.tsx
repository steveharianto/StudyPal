// Import Images
import image from '../assets/register.jpg';
import google from '../assets/google.png'


function RegisterTutor() {
    return (
        <>
          <div className="grid grid-cols-5" style={{ width: "100vw", height: "90vh"}}>
            <div className="col-span-3 h-full mb-10" style={{overflowY:"scroll"}}>
                <div className='container ml-32 mb-10 mt-20 w-auto'>

                    {/* Name */}
                    <h2 className='font-semibold ml-24 text-2xl font-sans'>Create your Tutor Account 🧑‍🏫</h2>
                    <div className='mt-5'><a>Fullname</a></div>
                    <input type='text' className='mt-4 h-10 w-3/4 border-2 p-3'  placeholder='Whats your name ?'></input>

                    {/* Email */}
                    <div className='mt-5'><a>Email</a></div>
                    <input type='text' className='mt-4 h-10 w-3/4 border-2 p-3'  placeholder='Your email address'></input>

                    {/* Username */}
                    <div className='mt-5'><a>Username</a></div>
                    <input type='text' className='mt-4 h-10 w-3/4 border-2 p-3'  placeholder='Pick a username'></input>

                    {/* Phone */}
                    <div className='mt-5'><a>Phone number</a></div>
                    <input type='tel' className='mt-4 h-10 w-3/4 border-2 p-3'  placeholder='Your phone number here..'></input>

                    {/* Password */}
                    <div style={{float:"left"}}>
                        <div className='mt-5'><a>Password</a></div>
                        <input type='password' className='mt-4 h-10 w-4/5 border-2 p-3' placeholder='Password'></input> <br />
                    </div>

                    {/* Confirm */}
                    <div style={{float:"left"}}>
                        <div className='mt-5'><a>Confirm Password</a></div>
                        <input type='password' className='mt-4 h-10 w-4/5 border-2 p-3' placeholder='Password'></input> <br />
                    </div>

                    <div style={{clear:'both'}}></div>

                    <button className='font-medium h-10 w-44 mt-10' style={{background:"#3f5db7",color:"white"}}>Create my Account</button>
                    <br />
                    <button style={{borderColor:"#3f5db7"}} className='font-medium h-12 rounded-xl w-3/4 mt-20 border-2'>< img src={google} className='w-10 float-left ml-32'/><div className='mt-2 mr-36'>Signup with Google</div></button>
                </div>
            </div>
            <div className="col-span-2 h-full" style={{overflow:"hidden", backgroundImage: `url(${image})`,backgroundSize: "cover", backgroundPositionX:"50%"}}></div>
          </div>
        </>
    );
}

export default RegisterTutor;
