import React from 'react'
import { quantum } from 'ldrs'

quantum.register()
export default function LoadingAnimation() {
  return (
    <div><l-quantum
    size="45"
    speed="1.75" 
    color="white" 
  ></l-quantum></div>
  )
}
