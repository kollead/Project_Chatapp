import React, {useRef} from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import firebase from '../../firebase'

function RegisterPage() {

    const {register, watch, errors, handleSubmit} = useForm({mode:"onChange"});
    
    const password = useRef("")
    let pass='';

    password.current=watch("password")

    const onSubmit = async(data) => {//data: hook form의 파라미터
        let createdUser = await firebase
            .auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            console.log("createdUser", createdUser)
        }
    
    return (
        <div className="auth-wrapper">
            <div style={{textAlign: 'center'}}>``
                <h3>Register</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input name="email" type="email"
                    ref={register({required:true, pattern: /^\S+@\S+$/i})} />
                    
                    {errors.email && errors.email.type==="required" 
                        && <p>This field is required</p>}
                    
                <label>Name</label>
                <input name="name"
                    ref={register({required:true, maxLength:10})}/>
                    
                    {errors.name && errors.name.type==="required" 
                        && <p>This field is required</p>}
                    {errors.name && errors.name.type==="maxLength" 
                        && <p>This field exceed maximum length, 10 characters</p>}
                
                <label>Password</label>
                <input name="password" type="password" 
                    ref={register({required:true, minLength:6})}/>
                    
                    {errors.password && errors.password.type==="required" 
                        && <p>This field is required</p>}
                    {errors.password && errors.password.type==="minLength" 
                        && <p>This field must have minimum length, 6characters</p>}
                
                <label>Password Confirm</label>
                <input name="password_confirm" type="password"
                    ref={register({required: true, 
                        validate:(value)=>
                            value === password.current    
                    })}/>

                    {errors.password_confirm && errors.password_confirm.type==="required" 
                        && <p>Password confirm field is required</p>}
                    {errors.password_confirm && errors.password_confirm.type==="validate" 
                        && <p>The password do not match
                            </p>}
                                
                
                <input type="submit" value="submit"/>
                <Link style={{color:"gray", textDecoration:"none"}} to="login" >Login</Link>
            </form>
            </div>
    )
}

export default RegisterPage
