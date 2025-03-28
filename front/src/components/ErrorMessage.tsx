

export default function ErrorMessage({children} : {children: React.ReactNode}) {
  
  return (
  <>
  {/* <p className="bg-red-600 px-3 py-2 rounded text-center text-white font-semibold"> {children} </p> */}
  <p className="text-red-600 font-semibold rounded my-1"> {children} </p>
  </>  
  )  
}