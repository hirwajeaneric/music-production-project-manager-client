import { Link } from "react-router-dom"
import { FormElement, HeaderOne, HeaderTwo, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm, VerticallyFlexSpaceBetweenContainer } from "../../components/styles/GenericStyles"
import { useForm } from 'react-hook-form';
import axios from 'axios';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import { useCookies } from 'react-cookie';
import { GeneralContext } from "../../App";
import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { AuthenticationFormContainer } from "../../components/styles/AuthenticationPagesStyles";
import { Helmet } from "react-helmet-async";

const ForgotPassword = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies(null);
  const { setOpen, setResponseMessage } = useContext(GeneralContext);
    
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    
    
    setIsProcessing(true);
    axios.post(serverUrl+'/api/v1/mppms/user/requestPasswordReset', data)
    .then(response => {
      setTimeout(() => {
        if (response.status === 200) {
          setIsProcessing(false);
          setResponseMessage({message: response.data.message, severity:'success'});
          setOpen(true);
          setTimeout(()=> {
            window.location.reload();
          },2000)
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
  };

  return (
    <HorizontallyFlexSpaceBetweenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Helmet>
        <title>Forgot password</title>
        <meta name="description" content={`Forgot password.`} /> 
      </Helmet>
      <AuthenticationFormContainer style={{ position: 'relative', boxShadow: 'rgba(0, 0, 0, 0.05) 0 6px 24px, rgba(0, 0, 0, 0.08) 0 5px 12px 1px' }}>

        <VerticallyFlexGapForm className="right" style={{ position: 'absolute', right: '0', top: '0', bottom: '0' }} onSubmit={handleSubmit(onSubmit)}>
          <VerticallyFlexGapContainer style={{ gap: '20px', textAlign:'left', color:'black', width: '100%' }}>
            <h1 style={{ fontWeight: '900', width: '100%', color: '#001b4b' }}>Soundss Pro</h1>
            {/* <p style={{ lineHeight:'1.5rem', color: 'black' }}>Quality project organization,  management and tracking,  all done in one place. Achieved by the use of Soundss Pro. </p> */}
          </VerticallyFlexGapContainer>
          <div>
            <HeaderTwo>Forgot your password</HeaderTwo>
            <p style={{ color: 'black', marginTop: '20px'}}>Enter your email and we will send you a reset link</p>
          </div>
          <FormElement>
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
            {isProcessing 
              ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
              : <Button variant="contained" color="primary" size="medium" type="submit">Send reset link</Button>
            }
          </FormElement>
          <Link style={{ color: 'blue', fontSize:'90%', textAlign: 'center', textDecoration: 'none' }} to={'/auth/signin'}>I can't recover my account using this page</Link>
        </VerticallyFlexGapForm>
        
      </AuthenticationFormContainer>
    </HorizontallyFlexSpaceBetweenContainer>
  )
}

export default ForgotPassword