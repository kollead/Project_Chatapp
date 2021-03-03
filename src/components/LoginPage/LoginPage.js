import React, { useState} from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import firebase from '../../firebase'


function LoginPage() {

    const {register, errors, handleSubmit} = useForm({mode:"onChange"});
    const [ErrorFromSubmit, setErrorFromSubmit] = useState("")
    const [Loading, setLoading] = useState(false)
    
    const onSubmit = async(data) => {//data: hook form의 파라미터
        
        
    }
    
        
    
    return (
        <div className="auth-wrapper">
            <div style={{textAlign: 'center'}}>``
                <h3>Login</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input name="email" type="email"
                    ref={register({required:true, pattern: /^\S+@\S+$/i})} />
                    
                    {errors.email && errors.email.type==="required" 
                        && <p>This field is required</p>}
                    
                
                <label>Password</label>
                <input name="password" type="password" 
                    ref={register({required:true, minLength:6})}/>
                    
                    {errors.password && errors.password.type==="required" 
                        && <p>This field is required</p>}
                    {errors.password && errors.password.type==="minLength" 
                        && <p>This field must have minimum length, 6characters</p>}
                
                {ErrorFromSubmit &&
                    <p>{ErrorFromSubmit}</p>}                
                
                <input type="submit" value="submit" disabled={Loading}/>
                <Link style={{color:"gray", textDecoration:"none"}} to="login" >Login</Link>
            </form>
            </div>
    )
}

export default LoginPage
