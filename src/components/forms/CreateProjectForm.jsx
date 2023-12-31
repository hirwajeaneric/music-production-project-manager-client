import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { GeneralContext } from "../../App";
import { FormElement, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from "../styles/GenericStyles";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import { WorldCountries } from "../../utils/WorldCountries";
import { ProjectTypes } from "../../utils/ProjectTypes";
import { useCookies } from "react-cookie";
import axios from "axios";
import { currencies } from "../../utils/Currencies";

export default function CreateProjectForm() {
    const [isProcessing, setIsProcessing] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { setOpen, setResponseMessage } = useContext(GeneralContext);
    const [ cookies ] = useCookies(null);
    const user = cookies.UserData;

    const onSubmit = data => {
        if (data.password !== data.confirmPassword) {
          setResponseMessage({message:'Passwords do not match', severity: 'warning'});
          setOpen(true);
          return;
        } else {
            
          data.studio = 'The Soundss Studio';
          data.producerId = user.id;
          data.producerName = user.fullName;
          data.producerEmail = user.email;

          console.log(data);

          setIsProcessing(true);
    
          axios.post(serverUrl+'/api/v1/mppms/project/add', data)
          .then(response => {
            setTimeout(() => {
              if (response.status === 201) {
                setIsProcessing(false);
                setResponseMessage({ message: response.data.message, severity: 'success' });
                setOpen(true);
                window.location.reload();
                // dispatch(getAllProjects(user.id));
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
        <VerticallyFlexGapForm onSubmit={handleSubmit(onSubmit)} style={{ gap: '20px', backgroundColor: '#02457a', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
            <HorizontallyFlexSpaceBetweenContainer style={{ borderBottom: '1px solid #b3d9ff', paddingBottom: '15px'}}>
                <p style={{ width: '100%', fontWeight: '600', textAlign:'left', color: '#d6e8ee' }}>Create New Project</p>
            </HorizontallyFlexSpaceBetweenContainer>
            <VerticallyFlexGapContainer style={{ gap: '15px' }}>
                <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="fullName">Name *</label>
                        <input 
                            type="text" 
                            id="name"
                            placeholder="Project name" 
                            {...register("name", 
                            {required: true})} 
                            aria-invalid={errors.name ? "true" : "false"}
                        />
                        {errors.name?.type === "required" && (
                        <p role="alert">Project name is required</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="startDate">Start date *</label>
                        <input 
                            type="date" 
                            id="startDate"
                            placeholder="startDate" 
                            {...register("startDate", 
                            {required: true})} 
                            aria-invalid={errors.startDate ? "true" : "false"}
                        />
                        {errors.startDate?.type === "required" && (
                        <p role="alert">The start date of the project is required</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="estimatedEndDate">Estimated end date *</label>
                        <input 
                            type="date" 
                            id="estimatedEndDate"
                            placeholder="estimatedEndDate" 
                            {...register("estimatedEndDate", 
                            {required: true})} 
                            aria-invalid={errors.estimatedEndDate ? "true" : "false"}
                        />
                        {errors.estimatedEndDate?.type === "required" && (
                        <p role="alert">Estimated end date must be provided</p>
                        )}
                    </FormElement>
                </HorizontallyFlexGapContainer>
                <FormElement style={{ color: '#97cadb' }}>
                    <label htmlFor="description">Description *</label>
                    <textarea 
                        rows={4}
                        type="text" 
                        id="description"
                        placeholder="Description" 
                        {...register("description", 
                        {required: true})} 
                        aria-invalid={errors.description ? "true" : "false"}
                    ></textarea>
                    {errors.description?.type === "required" && (
                    <p role="alert">A description is required</p>
                    )}
                </FormElement>

                <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="projectType">Project type *</label>
                        <select 
                            {...register("projectType", { required: true })}
                            aria-invalid={errors.projectType ? "true" : "false"}
                        >
                            <option value="">Select type</option>
                            {ProjectTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.projectType?.type === "required" && (
                        <p role="alert">The type of project is required</p>
                        )}
                    </FormElement>
                </HorizontallyFlexGapContainer>        

                <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="country">Country *</label>
                        <select 
                            {...register("country", { required: true })}
                            aria-invalid={errors.country ? "true" : "false"}
                        >
                            <option value="">Choose country</option>
                            {WorldCountries.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                        {errors.country?.type === "required" && (
                        <p role="alert">Country is required</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="city">City *</label>
                        <input 
                            type="text" 
                            id="city"
                            placeholder="City" 
                            {...register("city", 
                            {required: true})} 
                            aria-invalid={errors.city ? "true" : "false"}
                        />
                        {errors.city?.type === "required" && (
                        <p role="alert">The city is required</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="district">District</label>
                        <input 
                            type="text" 
                            id="district"
                            placeholder="District" 
                            {...register("district", 
                            {required: true})} 
                            aria-invalid={errors.district ? "true" : "false"}
                        />
                    </FormElement>
                </HorizontallyFlexGapContainer>
                <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="sector">Sector</label>
                        <input 
                            type="text" 
                            id="sector"
                            placeholder="Sector" 
                            {...register("sector", 
                            {required: true})} 
                            aria-invalid={errors.sector ? "true" : "false"}
                        />
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="startDate">Address *</label>
                        <input 
                            type="text" 
                            id="address"
                            placeholder="Street address" 
                            {...register("address", 
                            {required: true})} 
                            aria-invalid={errors.address ? "true" : "false"}
                        />
                        {errors.address?.type === "required" && (
                        <p role="alert">Provide street address</p>
                        )}
                    </FormElement>
                </HorizontallyFlexGapContainer>
                <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="price">Project price *</label>
                        <input 
                            type="number" 
                            id="price"
                            placeholder="Project price" 
                            {...register("price", 
                            {required: true})} 
                            aria-invalid={errors.price ? "true" : "false"}
                        />
                        {errors.price?.type === "required" && (
                        <p role="alert">Provide project price</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="currency">Currency *</label>
                        <select 
                            {...register("currency", { required: true })}
                            aria-invalid={errors.currency ? "true" : "false"}
                        >
                            <option value="">Choose currency</option>
                            {currencies.map((currency, index) => (
                                <option key={index} value={currency}>{currency}</option>
                            ))}
                        </select>
                        {errors.currency?.type === "required" && (
                        <p role="alert">Choose currency</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="paymentStrategy">Payment Strategy *</label>
                        <select 
                            {...register("paymentStrategy", { required: true })}
                            aria-invalid={errors.paymentStrategy ? "true" : "false"}
                        >
                            <option value="">Select strategy</option>
                            <option value="50% Before - 50% After">50% Before - 50% After</option>
                            <option value="100% before">100% before</option>
                            <option value="100% after">100% after</option>
                        </select>
                    </FormElement>
                </HorizontallyFlexGapContainer>

                <FormElement style={{ flexDirection: 'row', gap: '70%' }}>
                    {isProcessing 
                    ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
                    : <Button variant="contained" color="success" size="medium" type="submit">SUBMIT</Button>
                    }
                    <Button variant="contained" color="secondary" size="medium" type="button" onClick={() => {window.location.reload()}}>Cancel</Button>
                </FormElement>
            </VerticallyFlexGapContainer>
        </VerticallyFlexGapForm>
    )
}