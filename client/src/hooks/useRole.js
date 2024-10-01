import { useState } from "react"
import useAuth from "./useAuth"



const useRole = () => {
   const {user} = useAuth()
   const [role, setRole] = useState()
   
   
}

export default useRole
