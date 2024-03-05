import React, { useEffect } from 'react';
import { Breadcrumb, Spin } from 'antd';
import { useStateContext } from '../../../context/ContextProvider';
import './Collab.css';
import { Link, useParams } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CodeEditor from './CodeEditor';

function Collab()
{
    const { activeProjectName } = useStateContext();
    const [loading, setLoading] = useState(true);
    const { project_id } = useParams();

    function checkPermission()
    {
        //write your own logic
        if (project_id)
        {
            setLoading(false);
        }
    }

    useEffect(() =>
    {
        checkPermission();
        // eslint-disable-next-line
    }, []);

    return (
        <div className='collab-wrapper'>
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
            {
                loading ? <Spin size="large" className='spinner' /> :
                    <CodeEditor />
            }
        </div >
    );

}

export default Collab;
