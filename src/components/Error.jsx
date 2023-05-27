import React from 'react'
import errorImg from "../images/404Error.png"

function Error() {
  return (
    <div className = "text-center">
        <img className = "align-center" src={errorImg} alt="" />
    </div>
  )
}

export default Error