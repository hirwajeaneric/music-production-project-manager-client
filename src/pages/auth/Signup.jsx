import { Link } from "react-router-dom"
import { FormElement, HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from "../../components/styles/GenericStyles"
import { useForm } from 'react-hook-form';
import axios from 'axios';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import { useCookies } from 'react-cookie';
import { GeneralContext } from "../../App";
import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { AuthenticationFormContainer } from "../../components/styles/AuthenticationPagesStyles";
import { Helmet } from "react-helmet-async";

const Signup = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies(null);
  const { setOpen, setResponseMessage } = useContext(GeneralContext);
  const [ visible, setVisible ] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {

    if (data.password !== data.confirmPassword) {
      setResponseMessage({message:'Passwords do not match', severity: 'warning'});
      setOpen(true);
      return;
    } else {
      setIsProcessing(true);

      axios.post(serverUrl+'/api/v1/mppms/user/signup', data)
      .then(response => {
        setTimeout(() => {
          if (response.status === 201) {
            setIsProcessing(false);
            setCookie('AuthToken', response.data.user.token);
            setCookie('UserData', JSON.stringify(response.data.user));
            window.location.replace('/');
          }
        }, 3000)
      })
      .catch(error => {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          setIsProcessing(false);
          setResponseMessage({ message: error.response.data.msg, severity:'error'})
          setOpen(true);
        }
      })
    }
  };

  return (
    <HorizontallyFlexSpaceBetweenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Helmet>
        <title>Create account</title>
        <meta name="description" content={`Create an account.`} /> 
      </Helmet>
      <AuthenticationFormContainer style={{ position: 'relative', boxShadow: 'rgba(0, 0, 0, 0.05) 0 6px 24px, rgba(0, 0, 0, 0.08) 0 5px 12px 1px' }}>
    
        <VerticallyFlexGapForm className="right" style={{ position: 'absolute', right: '0', top: '0', bottom: '0' }} onSubmit={handleSubmit(onSubmit)}>
          <VerticallyFlexGapContainer style={{ gap: '20px', textAlign:'left', color:'black', width: '100%' }}>
            <h1 style={{ fontWeight: '900', width: '100%', color: '#001b4b' }}>Soundss Pro</h1>
          </VerticallyFlexGapContainer>

          <HeaderTwo style={{ fontSize: '1.5rem' }}>Register</HeaderTwo>
          <FormElement>
            <label style={{ color: 'black' }} htmlFor="fullName">Full name</label>
            <input 
              style={{ color: 'black', border: '1.5px solid black' }}
              type="text" 
              id="fullName"
              placeholder="name" 
              {...register("fullName", 
              {required: true})} 
              aria-invalid={errors.fullName ? "true" : "false"}
            />
            {errors.fullName?.type === "required" && (
              <p role="alert">Full name is required</p>
            )}
          </FormElement>
          <HorizontallyFlexGapContainer style={{ gap: '10px' }}>
            <FormElement>
              <label style={{ color: 'black' }} htmlFor="email">Email address</label>
              <input 
                style={{ color: 'black', border: '1.5px solid black' }}
                type="email" 
                id="email"
                placeholder="email" 
                {...register("email", 
                {required: true})} 
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email?.type === "required" && (
                <p role="alert">Email is required</p>
              )}
            </FormElement>  
            <FormElement>
              <label style={{ color: 'black' }} htmlFor="role">Role</label>
              <select
                style={{ color: 'black', border: '1.5px solid black' }} 
                {...register("role", { required: true })}
                aria-invalid={errors.role ? "true" : "false"}
              >
                <option value="">Choose role</option>
                <option value="Producer">Producer</option>
                <option value="Manager">Manager</option>
                <option value="Artist">Artist</option>
              </select>
              {errors.role?.type === "required" && (
                <p role="alert">Role is required</p>
              )}
            </FormElement>
          </HorizontallyFlexGapContainer>
          <HorizontallyFlexGapContainer style={{ gap: '10px' }}>
            <FormElement style={{ color: '#97cadb' }}>
              <label style={{ color: 'black' }} htmlFor="password">Password</label>
              <input 
                style={{ color: 'black', border: '1.5px solid black' }}
                type={visible ? "text" : "password"}
                id="password" 
                placeholder="password" 
                {...register("password", {required: true})} 
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password?.type === "required" && (
                <p role="alert">Password is required</p>
              )}
            </FormElement>
            <FormElement style={{ color: '#97cadb' }}>
              <label style={{ color: 'black' }} htmlFor="confirmPassword">Confirm Password</label>
              <input 
                style={{ color: 'black', border: '1.5px solid black' }}
                type={visible ? "text" : "password"}
                id="confirmPassword" 
                placeholder="confirmPassword" 
                {...register("confirmPassword", {required: true})} 
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.confirmPassword?.type === "required" && (
                <p role="alert">Confirm your password</p>
              )}
            </FormElement>
          </HorizontallyFlexGapContainer>
          <HorizontallyFlexGapContainer>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
              <p>Show password</p>
              <input type='checkbox' name='visible' value={visible} onChange={() => setVisible(!visible)} />
            </div>
          </HorizontallyFlexGapContainer>
          <FormElement>
            {isProcessing 
              ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
              : <Button variant="contained" color="primary" size="medium" type="submit">Register</Button>
            }
          </FormElement>
          <VerticallyFlexGapContainer style={{ gap: '30px', width: '100%', color:'black' }}>
            <div style={{ textAlign:'left', width: '100%', }}>
              <p style={{ lineHeight:'2rem' }}>Do you already have an account?</p>
              <Link style={{ color: 'blue', textAlign: 'center' }} to={'/auth/signin'}>Login</Link>
            </div>
            <p>&copy; All rights reserved. Soundss Pro2023</p>
          </VerticallyFlexGapContainer>
        </VerticallyFlexGapForm>

        
      </AuthenticationFormContainer>
    </HorizontallyFlexSpaceBetweenContainer>
  )
}

export default Signup