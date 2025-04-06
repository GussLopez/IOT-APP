import { useState } from "react"

export default function Pregunta() {
  const [answer, setAnswer] = useState()

  if (answer === '') {
    
  }

  return (
  <>
  <div className="">

  <h1>¿Cúal es el nombre de tu perro?</h1>
  <input type="text" onChange={setAnswer} value={answer}/>
  </div>
  </>  
  )  
}
