import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';


const Background = () => {
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const ref = useRef();
  const passwordRef = useRef();

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/")
    let passwords = await req.json()
    console.log(passwords)
    setpasswordArray(passwords)
  }


  useEffect(() => {
    getPasswords()
  }, [])

  const copyText = (text) => {
    toast('Copied to clipboard!', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text)
  }
  const showPassword = () => {
    passwordRef.current.type = "text";
    if (ref.current.src.includes("/icons/eyecross.png")) {
      ref.current.src = "/icons/eye.png";
      passwordRef.current.type = "password";
    } else {
      ref.current.src = "/icons/eyecross.png";
      passwordRef.current.type = "text";
    }
  };


  const savePassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

      // If any such id exists in the db, delete it 
      await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({id:form.id }) })

      setpasswordArray([...passwordArray, { ...form, id: uuidv4() }])
      await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

      // Otherwise clear the form and show toast
      setform({ site: "", username: "", password: "" })
      toast('Password saved!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else {
      toast('Error: Password not saved!');
    }
  }


  const editPassword = async(id) => {
    console.log("Editing password with", id);
    setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
    setpasswordArray(passwordArray.filter(item => item.id !== id));
  }


  const deletePassword = async (id) => {
    console.log("Deleting password with id ", id)
    let c = confirm("Do you really want to delete this password?")
    if (c) {
      setpasswordArray(passwordArray.filter(item => item.id !== id))

      await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

      toast('Password Deleted!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  const handelChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };


  return (
    <>
      <ToastContainer />
      <div className="lg:max-w-[70%]  mx-auto">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

        <div className="md:mycontainer ">
          <div className="heading justify-center flex">
            <h1>
              {" "}
              <div className=" font-semibold items-center font-sora">
                {" "}
                <span>&lt;</span> <span className="text-[2.6rem]">Pass</span>
                <span className=" text-[3rem] bg-gradient-to-tr from-pink-600 to-yellow-400  text-transparent bg-clip-text ">
                  Op
                </span>{" "}
                <span>/ &gt;</span>
              </div>
            </h1>
          </div>
          <p className="text-center mt-2 font-semibold text-cyan-600 mb-4 font-code">
            Your own Password Managing Application!!!
          </p>
          <div className="mt-5">
            <input
              value={form.site}
              onChange={handelChange}
              name="site"
              className="w-full border border-black rounded-full px-3 py-1 font-code font-semibold"
              type="text"
              placeholder="Enter website url"
              id="site"
            />
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <input
                value={form.username}
                onChange={handelChange}
                className="w-full border border-black rounded-full px-3 py-1 font-code font-semibold"
                type="text"
                placeholder="Enter Username"
                name="username"
                id="username"
              />
              <div className="relative">
                <input
                  ref={passwordRef}
                  value={form.password}
                  name="password"
                  onChange={handelChange}
                  className="w-full border border-black rounded-full px-3 py-1 font-code font-semibold"
                  type="password"
                  placeholder="Enter Password"
                  id="password"
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={showPassword}
                >
                  <img ref={ref} width={20} src="/icons/eye.png" alt="" />
                </span>
              </div>
            </div>
          </div>
          <div className="button flex justify-center mt-5 ">
            <button
              onClick={savePassword}
              className="font-grotesk  bg-blue-300 hover:bg-blue-200 text-black rounded-full flex gap-2 items-center px-4 border border-blue-700  font-bold py-1"
            >
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="hover"
              ></lord-icon>
              Save
            </button>
          </div>
          <div className="password mt-4 font-sora">
            <h1 className="font-bold text-xl">Your PassWords</h1>
            {passwordArray.length === 0 && (
              <div className="font-grotesk font-bold  text-xl bg-gradient-to-tr from-blue-600 to-violet-400  mt-3 bg-clip-text text-transparent">
                No password to show
              </div>
            )}
            {passwordArray.length != 0 && (
              <table className="table-auto   lg:w-full rounded-md overflow-hidden">
                <thead className='bg-cyan-300 text-white '>
                  <tr>
                    <th className='py-1 border-2 border-cyan-300'>Site</th>
                    <th className='py-1 border-2 border-cyan-300'>Username</th>
                    <th className='py-1 border-2 border-cyan-300'>Password</th>
                    <th className='py-1 border-2 border-cyan-300'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-cyan-100'>
                  {passwordArray.map((item, index) => {
                    if (item != []) {
                      return <tr key={index}>
                        <td className='py-2 border-2 border-cyan-300 text-center min-w-32'>
                          <div className="flex items-center justify-center">
                            <a href={item.site}>{item.site}</a>
                            <div className="cursor-pointer size-7 " onClick={() => { copyText(item.site) }}>
                              <lord-icon
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  paddingTop: "3px",
                                  paddingLeft: "3px",
                                }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className='py-2 border-2 border-cyan-300 text-center min-w-32'>
                          <div className="flex items-center justify-center">
                            <a href={item.username}>{item.username}</a>
                            <div className="cursor-pointer size-7 " onClick={() => { copyText(item.username) }}>
                              <lord-icon
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  paddingTop: "3px",
                                  paddingLeft: "3px",
                                }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className='py-2 border-2 border-cyan-300 text-center min-w-32'>
                          <div className="flex items-center justify-center">
                            <a href={item.password}>{"*".repeat(item.password.length)}</a>
                            <div className="cursor-pointer size-7 " onClick={() => { copyText(item.password) }}>
                              <lord-icon
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  paddingTop: "3px",
                                  paddingLeft: "3px",
                                }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className='justify-center py-2 border-2 border-cyan-300 text-center'>
                          <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                            <lord-icon
                              src="https://cdn.lordicon.com/gwlusjdu.json"
                              trigger="hover"
                              style={{ "width": "25px", "height": "25px" }}>
                            </lord-icon>
                          </span>
                          <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                            <lord-icon
                              src="https://cdn.lordicon.com/skkahier.json"
                              trigger="hover"
                              style={{ "width": "25px", "height": "25px" }}>
                            </lord-icon>
                          </span>
                        </td>
                      </tr>
                    }
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Background;
