import React, { useEffect, useRef, useState } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Manager = () => {
  const MySwal = withReactContent(Swal);
  const ref = useRef();
  const passwordref = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "", id: null });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    const req = await fetch("http://localhost:3000/");
    const passwords = await req.json();
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const savePassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      const id = form.id || uuidv4(); // Use existing ID if editing, otherwise new

      // Delete existing entry with same ID (in case of edit)
      if (form.id) {
        await fetch("http://localhost:3000/", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: form.id })
        });
      }

      const newEntry = { ...form, id };

      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry)
      });

      toast('Password Saved !!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });

      setform({ site: "", username: "", password: "", id: null });
      getPasswords(); // Refresh from backend
    } else {
      toast("Site/Password/Username cannot be less than 3 letters", { autoClose: 1500 });
    }
  };

  const deletePassword = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This password will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Yes, delete it!',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      toast('Password Deleted !!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });

      getPasswords(); // Refresh after deletion
    }
  };

  const editPassword = (id) => {
    const toEdit = passwordArray.find(i => i.id === id);
    setform(toEdit);
  };

  const showPassword = () => {
    if (ref.current.src.includes("icons/hidden.png")) {
      ref.current.src = "icons/eye.png";
      passwordref.current.type = 'password';
    } else {
      ref.current.src = "icons/hidden.png";
      passwordref.current.type = 'text';
    }
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    toast('Copied to Clipboard!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      transition: Bounce,
    });
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-screen px-4 py-6 mx-auto">
      <ToastContainer />
      <h1 className='text-3xl md:text-4xl font-bold text-center mb-2'>
        <span className='text-green-500'>&lt;</span>Pass<span className='text-green-500'>MAN/&gt;</span>
      </h1>
      <p className='text-green-900 text-sm md:text-lg text-center mb-6'>Your Own Password Manager</p>

      <div className="text-black flex flex-col gap-4 items-center w-full">
        <input
          value={form.site}
          onChange={handleChange}
          placeholder='Enter Website URL'
          className="rounded-full border border-green-500 w-full px-4 py-2 text-sm"
          type="text"
          name='site'
        />

        <div className="flex flex-col md:flex-row w-full gap-4 flex-wrap">
          <input
            value={form.username}
            onChange={handleChange}
            placeholder='Enter Username'
            className="rounded-full border border-green-500 w-full px-4 py-2 text-sm"
            type="text"
            name='username'
          />
          <div className="relative w-full flex items-center min-w-0">
            <input
              ref={passwordref}
              value={form.password}
              onChange={handleChange}
              placeholder='Enter Password'
              className="rounded-full border border-green-500 w-full px-4 py-2 pr-12 text-sm"
              type="password"
              name='password'
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={showPassword}
            >
              <img ref={ref} className='w-6 h-6' src="icons/eye.png" alt="Toggle visibility" />
            </span>
          </div>
        </div>

        <button
          onClick={savePassword}
          className='flex gap-2 justify-center items-center bg-green-400 rounded-full px-4 border border-green-800 py-2 w-fit hover:bg-green-500'
        >
          <lord-icon
            src="https://cdn.lordicon.com/jgnvfzqg.json"
            trigger="hover">
          </lord-icon>
          Save
        </button>
      </div>

      <div className="passwords mt-8 w-full">
        <h2 className='font-bold text-xl py-4'>Your Passwords</h2>
        {passwordArray.length === 0 && <div>No passwords to show</div>}
        {passwordArray.length !== 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm md:text-base min-w-full">
              <thead className='bg-green-800 text-white'>
                <tr>
                  <th className='py-2 px-2'>Site</th>
                  <th className='py-2 px-2'>Username</th>
                  <th className='py-2 px-2'>Password</th>
                  <th className='py-2 px-2'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-green-100'>
                {passwordArray.map((item, index) => (
                  <tr key={index}>
                    <td className='py-2 px-2 border border-white'>
                      <div className='gap-2 flex items-center justify-center' onClick={() => copyText(item.site)}>
                        <a href={item.site} target='_blank' rel='noreferrer'>{item.site}</a>
                        <lord-icon className="cursor-pointer w-5 md:w-6"
                          src="https://cdn.lordicon.com/depeqmsz.json"
                          trigger="hover">
                        </lord-icon>
                      </div>
                    </td>
                    <td className='text-center py-2 px-2 border border-white'>
                      <div className='gap-2 flex items-center justify-center' onClick={() => copyText(item.username)}>
                        <span>{item.username}</span>
                        <lord-icon className="cursor-pointer w-5 md:w-6"
                          src="https://cdn.lordicon.com/depeqmsz.json"
                          trigger="hover">
                        </lord-icon>
                      </div>
                    </td>
                    <td className='text-center py-2 px-2 border border-white'>
                      <div className='gap-2 flex items-center justify-center' onClick={() => copyText(item.password)}>
                        <span>{item.password}</span>
                        <lord-icon className="cursor-pointer w-5 md:w-6"
                          src="https://cdn.lordicon.com/depeqmsz.json"
                          trigger="hover">
                        </lord-icon>
                      </div>
                    </td>
                    <td className='text-center py-2 px-2 border border-white whitespace-nowrap'>
                      <span className='mx-1 cursor-pointer' onClick={() => deletePassword(item.id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                      </span>
                      <span className='mx-1 cursor-pointer' onClick={() => editPassword(item.id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/wvdxdmpi.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manager;
