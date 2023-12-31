import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer } from "../components/styles/GenericStyles"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GeneralContext } from "../App";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import AddResourcesForm from "../components/forms/AddResourcesForm";
import ResourcesTable from "../components/tables/ResourcesTable";
import { getProjectResources } from "../redux/features/materialSlice";
import { Button } from "@mui/material";
import { useCookies } from "react-cookie";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const ProjectMaterials = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { handleOpenModal, setDetailsFormType, setDetailsData } = useContext(GeneralContext);
  const { register, handleSubmit, formState: { errors } } = useForm();  
  const [project, setProject] = useState({});
  const [ cookies ] = useCookies(null);
  const user = cookies.UserData;

  // Fetching project 
  useEffect(() => {
    axios.get(`${serverUrl}/api/v1/mppms/project/findByCode?code=${params.code}`)
    .then((response) => {
      setProject(response.data.project);
      dispatch(getProjectResources(response.data.project._id));
    })
    .catch(error => console.log(error))
  },[]);

  const { isLoading: loadingProject, } = useSelector(state => state.project);
  const { listOfProjectResources } = useSelector(state => state.material);

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px'}}>
      <Helmet>
        <title>{`Resources - ${project.name}`}</title>
        <meta name="description" content={`A list of all resources associated to this project and a form to add more.`} /> 
      </Helmet>

      <VerticallyFlexGapContainer style={{ gap: '20px', background: '#02457a', color: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
        {loadingProject ? <p style={{ width: '100%', textAlign: 'left', color: 'white' }}>Loading...</p> :
          <HorizontallyFlexSpaceBetweenContainer style={{ alignItems: 'flex-start' }}>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '10px' }}>
              <HeaderTwo style={{ width: '100%', textAlign: 'left', color: '#d6e8ee' }}><strong>Project:</strong> {project.name}</HeaderTwo>
              <strong>Resources</strong>
            </div>
            <HorizontallyFlexGapContainer style={{ gap: '20px', justifyContent: 'flex-end' }}>
              <p style={{ color: 'white' }}>Code: <span style={{ color: '#97cadb' }}>{project.code}</span></p>
              <Button 
                variant='contained' 
                size='small' 
                color='info' 
                onClick={() => { 
                  handleOpenModal(); 
                  setDetailsFormType('project');
                  setDetailsData(project);
                }}>
                  Edit/View Project
                </Button>
            </HorizontallyFlexGapContainer>
          </HorizontallyFlexSpaceBetweenContainer>
        }
      </VerticallyFlexGapContainer>

      <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems:'flex-start'}}>
        {/* List of resources  */}
        <VerticallyFlexGapContainer style={{ justifyContent:'flex-start', background: '#02457a', color: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ fontWeight: '600', width: '100%', textAlign:'left' }}>List</p>
          {loadingProject ? <p style={{ width: '100%', textAlign: 'left' }}>Loading...</p> :
            <>
              {listOfProjectResources.length !== 0 && <ResourcesTable data={listOfProjectResources}/>}
              {listOfProjectResources.length === 0 && <p style={{ color: '#97cadb', marginTop: '20px' }}>No resources available</p>}
            </>
          }
        </VerticallyFlexGapContainer>
        
        {/* Add resource form  */}
        {user.role === 'Producer' && <AddResourcesForm projectId={project._id}/>}
      </HorizontallyFlexGapContainer>

    </VerticallyFlexGapContainer>
  )
}

export default ProjectMaterials