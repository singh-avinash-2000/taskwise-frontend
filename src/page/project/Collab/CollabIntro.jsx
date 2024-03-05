import React, { useState } from 'react';
import { FaCodepen } from "react-icons/fa";
import { FaKeyboard } from "react-icons/fa";
import { Breadcrumb, Button, Input, Space, message } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { useStateContext } from "../../../context/ContextProvider";
import { axiosClient } from "../../../config/axios";
import { version as uuidVersion, validate as uuidValidate } from 'uuid';

import './Collab.css';

function CollabIntro()
{

    const { activeProjectName, activeProjectDetails } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [collabId, setCollabId] = useState('');
    const navigate = useNavigate();

    function uuidValidateV4(uuid)
    {
        return uuidValidate(uuid) && uuidVersion(uuid) === 4;
    }

    const handleNewCollabCreation = async () =>
    {
        try
        {
            setLoading(true);
            const { data } = await axiosClient.get(`/projects/${activeProjectDetails._id}/collab`);
            message.success('Collab session created successfully');
            navigate(`/project/${activeProjectDetails._id}/collab/${data.result.collabId}`, {
                state: {
                    redirected: true
                }
            });
        } catch (error)
        {
            console.log(error);
            message.error(error.message);
        }
        finally
        {
            setLoading(false);
        }
    };

    const handleCollabJoin = async () => 
    {
        if (collabId === '')
        {
            message.error('Please enter the code to join');
            return;
        }
        else
        {
            if (!uuidValidateV4(collabId))
            {
                message.error('Please enter a valid collab code to join the session.');
                return;
            }
            else
            {
                navigate(`/project/${activeProjectDetails._id}/collab/${collabId}`);
            }
        }
    };

    return (
        <div>
            <Breadcrumb
                items={[
                    {
                        title: <Link to="/"><HomeOutlined /></Link>,
                    },
                    {
                        title: activeProjectName,
                    },
                    {
                        title: "Collaborative IDE"
                    }
                ]}
            />
            <div className='collab-writing'>
                <h1>
                    Collaborate seamlessly, innovate endlessly: <br />IDEs for every team.
                </h1>
                <span>
                    Empowering teams to code together effortlessly, our collaborative IDE offers a seamless platform for innovation.
                </span>
            </div>
            <div className='collab-join-section'>
                <Button className='connect-btn btn-primary' onClick={handleNewCollabCreation} loading={loading}>
                    <FaCodepen size={20} />
                    <span>Create a new collab session</span>
                </Button>
                <Space.Compact style={{ width: '60%', marginBottom: '50px' }} size='large'>
                    <Input placeholder="Enter the code to join" prefix={<FaKeyboard />} onChange={(e) => setCollabId(e.target.value)} onPressEnter={handleCollabJoin} />
                    <Button type="primary" onClick={handleCollabJoin}>Join</Button>
                </Space.Compact>
            </div>
        </div>
    );
}

export default CollabIntro;
