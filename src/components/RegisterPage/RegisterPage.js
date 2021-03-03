import React, {useRef, useState} from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import firebase from '../../firebase'
import md5 from 'md5';

function RegisterPage() {

    const {register, watch, errors, handleSubmit} = useForm({mode:"onChange"});
    const [ErrorFromSubmit, setErrorFromSubmit] = useState("")
    const [Loading, setLoading] = useState(false)

    const password = useRef("")
    let pass='';

    password.current=watch("password")

    const onSubmit = async(data) => {//data: hook form의 파라미터
        
        console.log("data: ", data)
        try {
            setLoading(true)
            let createdUser = await firebase
                .auth()
                .createUserWithEmailAndPassword(data.email, data.password)
            

            await createdUser.user.updateProfile({
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            })

            console.log("createdUser", createdUser)

            //firebase 데이터베이스에 저장해주기

            await firebase.database().ref("users").child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                image: createdUser.user.photoURL
            })

            setLoading(false)
                    
        } catch (error) {
            setErrorFromSubmit(error.message)}
            setTimeout(()=>{
                setErrorFromSubmit("")}, 5000);            
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

                    {ErrorFromSubmit &&
                    <p>{ErrorFromSubmit}</p>}                
                
                <input type="submit" value="submit" disabled={Loading}/>
                <Link style={{color:"gray", textDecoration:"none"}} to="login" >Login</Link>
            </form>
            </div>
    )
}

export default RegisterPage
