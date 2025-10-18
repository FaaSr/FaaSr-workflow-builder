import { useWorkflowContext } from "../WorkflowContext"
import { useRef, useState } from "react";
import useUndo from './Utils/Undo'
import TextInput from "./Utils/TextInput";
import useWorkflowUtils from "./Utils/WorkflowUtils";
import GenericLabel from "./Utils/GenericLabel";

export default function WorkflowSettings(props){
    const {workflow, setWorkflow, invocationIDType, setInvocationIDType} = useWorkflowContext();
    const { updateWorkflow } = useUndo();
    const { applyWorkflowChanges } = useWorkflowUtils()
    const [ settingsError, setSettingsError ] = useState("")


    const handleBlur = () => {
        updateWorkflow(workflow);
    }

const handleChangeIDType = (newType) => {
    if (newType === "UUID") {
        applyWorkflowChanges({
            ...workflow,
            InvocationID: "",
            InvocationIDFromDate: "",
        })

    } else if (newType === "Timestamp") {
        applyWorkflowChanges({
            ...workflow,
            InvocationID: "",
        })
    } else if (newType === "Custom") {
        applyWorkflowChanges({
            ...workflow,
            InvocationIDFromDate: "",
        })

    } else {
        console.log('error: unrecognized invocationIDType')
        return
    }
    setInvocationIDType(newType);
}
    
    const exampleUUID = useRef(crypto.randomUUID());

    const invocationIDInput = ( type ) => {
        switch (type) {
            case "Custom":
                return (
                    <>
                    <TextInput onChange={(e) => {
                        const customID = e.target.value
                        applyWorkflowChanges( { InvocationID : customID})
                    }} placeholder={"Custom Invocation ID"}></TextInput>
                    </>
                )
            case "Timestamp":
                return (
                    <>
                    <GenericLabel value={"Timestamp Format"} size={"20px"}>
                    </GenericLabel>
                    <TextInput  onChange={(e) => {
                        applyWorkflowChanges( { InvocationIDFromDate : e.target.value})
                    }} placeholder={"e.g. %Y%m%d"}></TextInput>
                    </>
                )
            default : 
                return null                
        }
    }
    
    return(
        <div className="editor-panel">
            
            {/* Workflow properties */}
            <h1>Workflow properties</h1>

            {/* Workflow Name */}
            <GenericLabel required={true} value={"Workflow Name"} size={"20px"}>
            <TextInput value={workflow.WorkflowName} onChange={(e) => {

                applyWorkflowChanges( { WorkflowName : e.target.value})

            }} onBlur={handleBlur} placeholder={"workflow-name"}></TextInput>
            </GenericLabel>

            {/* Entry Point */}
            <div>
                <GenericLabel required={true} value={"Entry Point"} size={"20px"}>
                <select placeholder="funcInvokeNext" onChange={(e)=> updateWorkflow({
                    ...workflow,
                    FunctionInvoke : e.target.value
                    })
                    }
                            type="text" value={workflow.FunctionInvoke}>
                            
                            <option value={""}> NONE </option>
                            
                            {Object.entries(workflow.ActionList).map(([key]) => (
                            
                            <option value={key}>{key}</option>
                            ))}
                </select>
                </GenericLabel>
            </div>

            {/* Log */}
            <GenericLabel value={"Log File Name"} size={"20px"}>
            <TextInput value={workflow.FaaSrLog} onChange={(e) => {

                applyWorkflowChanges( { FaaSrLog : e.target.value})

            }} onBlur={handleBlur} placeholder={"workflow-name"}></TextInput>
            </GenericLabel>

            {/* Invocation Id */}
            <div style={{ display : "flex"}}>
                <GenericLabel value={"InvocationID"} size={"20px"}>
                <select style={ { alignSelf : "center"}} value={invocationIDType} onChange={ (e) =>  { 
                    handleChangeIDType(e.target.value)
                }} >
                    <option value={"UUID"}>UUID</option>
                    <option value={"Timestamp"}>Timestamp</option>
                    <option value={"Custom"}>Custom</option>
                </select>
            </GenericLabel>
            </div>
            {
                invocationIDInput(invocationIDType)
            }

            
            {/* Data and Logs */}
            <h1>Data and logs</h1>

            {/* Default DataStore */}
            <div>
                <GenericLabel required={true} value={"Default Data Store"} size={"20px"}>
                <select placeholder="DefaultDataStore" onChange={(e)=>  updateWorkflow({
                    ...workflow,
                    DefaultDataStore : e.target.value
                    })
                    }
                            type="text" value={workflow.DefaultDataStore}>
                            
                            <option value={""}> NONE </option>
                            
                            {Object.entries(workflow.DataStores).map(([key]) => (
                            
                            <option value={key}>{key}</option>
                            ))}
                </select>
                </GenericLabel>
            </div>

            
            {/* Logging DataStore */}
            <div>
                <GenericLabel value={"Data Store for Logs"} size={"20px"}>
                <select placeholder="LoggingDataStore" onChange={(e)=> updateWorkflow({
                    ...workflow,
                    LoggingDataStore : e.target.value
                    })
                    }
                            type="text" value={workflow.LoggingDataStore}>
                            
                            <option value={""}> NONE </option>
                            
                            {Object.entries(workflow.DataStores).map(([key]) => (
                            
                            <option value={key}>{key}</option>
                            ))}
                </select>
                </GenericLabel>
            </div>

        </div>
    )
}
