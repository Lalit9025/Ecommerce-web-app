import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer'>
        <h4 className='text-center '>All Right Reserved &copy; Lalit</h4>
        <p className='text-center mt-3'>
          <Link to='/about'>About</Link>|
          <Link to='/contact'>Contact</Link>|
          <Link to='/policy'>Privacy Policy</Link>

        </p>
        <p className='text-center '>made with ❤️ by Lalit</p>
    </div>
  )
}

export default Footer