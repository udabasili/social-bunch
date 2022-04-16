import React from 'react'
import groovyWalkAnimation from "@/data/loading.json";
import Lottie from "lottie-react";

export const FullScreenLoader = () => {

  return ( 
    <Lottie 
        animationData={groovyWalkAnimation} 
        className="h-screen w-screen"
    />
  )

};

