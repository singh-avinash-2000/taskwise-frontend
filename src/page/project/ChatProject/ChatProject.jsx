import React, { useEffect, useRef, useState } from 'react';
import { Layout, Input, Image, Popover, Col, Row, Drawer, Button, Space, Tooltip, Card, message, Spin, Result, Avatar } from 'antd';
import { ImAttachment } from 'react-icons/im';
import { GrEmoji } from 'react-icons/gr';
import { BsImageFill, BsCameraVideoFill, BsFillFileEarmarkFill } from 'react-icons/bs';
import { FaFileAudio } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { AiFillFile } from 'react-icons/ai';
import { BiMessageRoundedX } from 'react-icons/bi';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import { useStateContext } from '../../../context/ContextProvider.jsx';
import { getSocketInstance } from "../../../config/socket";
import './ChatProject.css';
import { axiosClient } from '../../../config/axios';
import { formatTimeForChat } from "../../../config/formatTime.js";
import ImageModal from "./ImageModal.jsx";
import VideoModal from "./VideoModal.jsx";
import AudioModal from "./AudioModal.jsx";

const { Content } = Layout;



function ChatProject()
{
    const [chatData, setChatData] = useState([]);
    const lastMessageRef = useRef(null);
    const [chatmessage, setchatmessage] = useState('');
    const [attachments, setattachments] = useState([]);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [attachmentLoading, setAttachmentLoading] = useState(false);
    const [attachmentType, setAttachmentType] = useState('');
    const [open, setOpen] = useState(false);
    const { activeProjectName, activeProjectDetails, userDetails } = useStateContext();
    const socket = getSocketInstance();

    // For previewing different types of attachments
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [audioModalOpen, setAudioModalOpen] = useState(false);


    const showDrawer = () =>
    {
        setOpen(true);
    };
    const onClose = () =>
    {
        setAttachmentType('');
        setattachments([]);
        setOpen(false);
    };

    const scrollToBottom = () =>
    {
        lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChatMessages = async () =>
    {
        try
        {
            const response = await axiosClient.get(`/projects/${activeProjectDetails._id}/chat`);
            setChatData(response.data.result);
        }
        catch (error)
        {
            console.log(error);
        }
    };


    // const message = [
    //     {
    //         id: 1,
    //         type: 'TEXT',
    //         message: 'Hello',
    //         sender: {
    //             display_name: 'Rahul',
    //             email: 'rahul@gmail.com',
    //             profile_picture: 'www.placeholder.com/200x200',
    //             _id: jdfgnsnsidfnsein,
    //         },
    //         sent_at: new Date(),
    //         read_by: [
    //             {
    //                 display_name: 'Rahul',
    //                 email: 'rahul@gmail.com',
    //                 profile_picture: 'www.placeholder.com/200x200',
    //                 _id: fdkjvndvdvnsdv,
    //             }
    //         ]
    //     },
    //     {
    //         id: 2,
    //         type: 'IMAGE',
    //         document: [
    //             {
    //                 name: 'image1.jpg',
    //                 url: 'www.placeholder.com/200x200',
    //                 _id: 'jdfgnsnsidfnsein',
    //             },
    //             {

    //             }
    //         ]
    //         sender: {
    //             display_name: 'Rahul',
    //             email: 'rahul@gmail.com',
    //             profile_picture: 'www.placeholder.com/200x200',
    //             _id: jdfgnsnsidfnsein,
    //         },
    //         sent_at: new Date(),
    //         read_by: [
    //             {
    //                 display_name: 'Rahul',
    //                 email: 'rahul@gmail.com',
    //                 profile_picture: 'www.placeholder.com/200x200',
    //                 _id: fdkjvndvdvnsdv,
    //             }
    //         ]

    //     },
    //     {

    //     }
    // ];



    useEffect(() =>
    {
        fetchChatMessages();
        socket.on("chat-message", (data) =>
        {
            setChatData((prev) => [...prev, data]);
        });

        return () =>
        {
            socket.off("chat-message");
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() =>
    {
        scrollToBottom();
    }, [chatData]);

    function mappedTheAttachments(attachments)
    {
        const mappedAttachments = attachments.map((attachment, index) =>
        {
            return {
                id: attachment._id || index,
                name: attachment.name,
                type: attachment.type,
                url: URL.createObjectURL(attachment)
            };
        });
        return mappedAttachments;
    }

    function ImageAttachments({ toMapAttachments })
    {
        let mappedAttachments = [];
        if (!toMapAttachments)
            mappedAttachments = mappedTheAttachments(attachments);
        else
            mappedAttachments = mappedTheAttachments(toMapAttachments);

        return (
            <Image.PreviewGroup>
                {mappedAttachments.map((attachment) =>

                (
                    <Image width={200} src={attachment.url} key={attachment.id} />
                ))}
            </Image.PreviewGroup>
        );
    }

    function VideoAttachments({ toMapAttachments })
    {
        let mappedAttachments = [];
        if (!toMapAttachments)
            mappedAttachments = mappedTheAttachments(attachments);
        else
            mappedAttachments = mappedTheAttachments(toMapAttachments);
        return (
            <div className="video-attachments">
                {mappedAttachments.map((attachment) => (
                    <Card title={attachment.name} key={attachment.id}>
                        <ReactPlayer url={attachment.url} playing={false} controls={true} />
                    </Card>
                ))}
            </div>
        );
    }

    function AudioAttachments({ toMapAttachments })
    {
        let mappedAttachments = [];
        if (!toMapAttachments)
            mappedAttachments = mappedTheAttachments(attachments);
        else
            mappedAttachments = mappedTheAttachments(toMapAttachments);
        return (
            <div className="audio-attachments">
                {mappedAttachments.map((attachment) => (
                    <Card title={attachment.name} key={attachment.id}>
                        <ReactAudioPlayer src={attachment.url} controls />
                    </Card>
                ))}
            </div>
        );
    }

    function FileAttachments({ toMapAttachments })
    {
        let mappedAttachments = [];
        if (!toMapAttachments)
            mappedAttachments = mappedTheAttachments(attachments);
        else
            mappedAttachments = mappedTheAttachments(toMapAttachments);
        return (
            <div className="file-attachments">
                {mappedAttachments.map((attachment) => (
                    <div className="file-attachment-preview" key={attachment.id}>
                        <AiFillFile size={30} />
                        <a href={attachment.url} download={attachment.name}>
                            {attachment.name}
                        </a>
                    </div>
                ))}
            </div>
        );
    }

    const attachmentComponents = {
        IMAGE: <ImageAttachments />,
        VIDEO: <VideoAttachments />,
        AUDIO: <AudioAttachments />,
        FILE: <FileAttachments />,
    };


    async function handleSend(e)
    {
        e.preventDefault();
        const message = chatmessage;
        if (message && message.length > 0)
        {
            const sentAt = new Date();
            const response = await axiosClient.post(`/projects/${activeProjectDetails._id}/chat`,
                {
                    message,
                    type: "TEXT",
                    sent_at: sentAt,
                });
            const newMessage = {
                id: response.data.result._id,
                message,
                type: "TEXT",
                sender: {
                    display_name: userDetails.display_name,
                    email: userDetails.email,
                    profile_picture: userDetails.profile_picture,
                    _id: userDetails._id,
                },
                sent_at: sentAt,
                read_by: [],
            };
            setChatData([...chatData, newMessage]);
            setAttachmentType('');
            setchatmessage('');
            setattachments([]);
        }
    }

    async function handleAttachmentSend(e)
    {
        e.preventDefault();
        setAttachmentLoading(true);
        try
        {
            const formData = new FormData();

            for (let i = 0; i < attachments.length; i++)
            {
                formData.append("files", attachments[i]);
            }
            const uploadToS3 = await axiosClient.post(`/misc/upload-all-chat`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
            const sendAt = new Date();
            const response = await axiosClient.post(`/projects/${activeProjectDetails._id}/chat`,
                {
                    type: attachmentType,
                    attachments: uploadToS3.data.result,
                    sent_at: sendAt,
                });
            const newMessage = {
                id: response.data.result._id,
                type: attachmentType,
                sender: {
                    display_name: userDetails.display_name,
                    email: userDetails.email,
                    profile_picture: userDetails.profile_picture,
                    _id: userDetails._id,
                },
                sent_at: sendAt,
                read_by: [],
                document: response.data.result.document,
            };
            setChatData([...chatData, newMessage]);
            setAttachmentType('');
            setchatmessage('');
            setattachments([]);
            setOpen(false);
            console.log(response.data);
        } catch (error)
        {
            console.log(error);
        }
        finally
        {
            setAttachmentLoading(false);
        }
    }

    function handleAttachmentChange(e, type)
    {
        setAttachmentType(type);
        e.preventDefault();
        const newAttachments = [];
        const fileNumber = e.target.files.length;
        for (let i = 0; i < e.target.files.length; i++)
        {
            const file = e.target.files[i];
            if (file.size > 10000000 * 2.5)
            {
                message.error("File size should be less than 25MB");
                e.target.value = "";
                setPopoverVisible(false);
                return;
            }
            if (!file) return;
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = function (e)
            {
                const newAttachment = file;
                newAttachments.push(newAttachment);
                if (newAttachments?.length === fileNumber)
                {
                    setattachments((prevAttachments) => [
                        ...(prevAttachments),
                        ...newAttachments,
                    ]);
                }
            };
        }

        e.target.value = "";
        setPopoverVisible(false);
        showDrawer(true);
    }



    const Attachments = (
        <div className="attachment-types">
            <Row>
                <Col>
                    <label htmlFor="image-upload" className="each-attach-type">
                        <p className="each-attach-type"><BsImageFill size={25} /> Image</p>
                    </label>
                    <input type="file" accept="image/*" id="image-upload" multiple={true} onChange={(e) => handleAttachmentChange(e, "IMAGE")} />
                </Col>
                <Col>
                    <label htmlFor="video-upload" className="each-attach-type">
                        <p className="each-attach-type"><BsCameraVideoFill size={25} /> Video</p>
                    </label>
                    <input type="file" accept="video/*" id="video-upload" multiple={true} onChange={(e) => handleAttachmentChange(e, "VIDEO")} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <label htmlFor="audio-upload" className="each-attach-type">
                        <p className="each-attach-type"><FaFileAudio size={25} /> Audio</p>
                    </label>
                    <input type="file" accept="audio/*" id="audio-upload" multiple={true} onChange={(e) => handleAttachmentChange(e, "AUDIO")} />
                </Col>
                <Col>
                    <label htmlFor="file-upload" className="each-attach-type">
                        <p className="each-attach-type"><BsFillFileEarmarkFill size={25} /> File</p>
                    </label>
                    <input type="file" accept="*" id="file-upload" multiple={true} onChange={(e) => handleAttachmentChange(e, "FILE")} />
                </Col>
            </Row>
        </div>
    );
    return (
        <Layout className='chat-layout'>
            <div className='header'>
                <div className="icon">
                    <img src={activeProjectDetails.thumbnail} alt="project" className="chat-profile-image" />
                </div>
                <div className="Project-name">
                    <h1>{activeProjectName}</h1>
                </div>

            </div>
            <Content className='content'>
                <Drawer
                    title={`Send ${attachments.length} Attachments`}
                    placement="bottom"
                    closable={true}
                    onClose={onClose}
                    open={open}
                    getContainer={false}
                    keyboard={true}
                    extra={
                        <Space>
                            <Tooltip title="Send">
                                <Button className="chat-send-button" onClick={handleAttachmentSend}>
                                    <IoSend size={20} />
                                </Button>
                            </Tooltip>
                        </Space>
                    }
                >
                    <Spin spinning={attachmentLoading}>
                        {attachments.length > 0 && (
                            <div className="attachments">{attachmentComponents[attachmentType]}</div>
                        )}
                    </Spin>
                </Drawer>
                <div className="chat-messages" style={{ height: window.innerHeight - 200 }} >
                    {chatData?.length > 0 ? chatData.map((message, index) =>
                    {
                        const sentAt = formatTimeForChat(message.sent_at);

                        return (
                            <div className='chat-message' key={index} >
                                <div className={`${message.sender._id === userDetails._id ? 'chat-message-user' : 'chat-message-other'}`}>
                                    <div className={`${message.sender._id === userDetails._id ? 'chat-message-header-user' : 'chat-message-header-other'}`}>
                                        <div className={`${message.sender._id === userDetails._id ? 'chat-message-owner-user' : 'chat-message-owner-other'}`}>
                                            {message.sender.display_name}
                                        </div>
                                        <div className={`${message.sender._id === userDetails._id ? 'chat-message-time-user' : 'chat-message-time-other'}`}>
                                            {sentAt}
                                        </div>
                                        {
                                            message.type === 'TEXT' &&
                                            <div className={`${message.sender._id === userDetails._id ? 'chat-bubble-user' : 'chat-bubble-other'}`} >
                                                <div className="chat-message-text">
                                                    {message?.message}
                                                </div>
                                            </div>
                                        }
                                        <Avatar src={<img src={message.sender.profile_picture} alt="avatar" />} className={userDetails._id === message.sender._id ? "chat-avatar-user" : "chat-avatar-other"} />
                                        {message.type === 'IMAGE' &&
                                            <div className={`${message.sender._id === userDetails._id ? 'chat-bubble-user' : 'chat-bubble-other'}`}>
                                                {message.document.map((image) =>
                                                {
                                                    return (
                                                        <Tooltip title="Preview Image" key={image.name}>
                                                            <div className="image-box" onClick={() => setImageModalOpen(true)}>
                                                                <BsImageFill />
                                                                <span>{image.name}</span>
                                                            </div>
                                                            <ImageModal name={image.name} url={image.url} imageModalOpen={imageModalOpen} setImageModalOpen={setImageModalOpen} />
                                                        </Tooltip>);
                                                })}
                                            </div>
                                        }

                                        {message.type === 'VIDEO' &&
                                            <div className={`${message.sender._id === userDetails._id ? 'chat-bubble-user' : 'chat-bubble-other'}`}>
                                                {message.document.map((video) =>
                                                {
                                                    return (
                                                        <Tooltip title="Preview Video" key={video._id}>
                                                            <div className="image-box" onClick={() => setVideoModalOpen(true)}>
                                                                <BsCameraVideoFill />
                                                                <span>{video.name}</span>
                                                            </div>
                                                            <VideoModal name={video.name} url={video.url} videoModalOpen={videoModalOpen} setVideoModalOpen={setVideoModalOpen} />
                                                        </Tooltip>);
                                                })}
                                            </div>
                                        }

                                        {message.type === 'AUDIO' &&
                                            <div className={`${message.sender._id === userDetails._id ? 'chat-bubble-user' : 'chat-bubble-other'}`}>
                                                {message.document.map((audio) =>
                                                {
                                                    return (
                                                        <Tooltip title="Preview Audio" key={audio._id}>
                                                            <div className="image-box" onClick={() => setAudioModalOpen(true)}>
                                                                <FaFileAudio />
                                                                <span>{audio.name}</span>
                                                            </div>
                                                            <AudioModal name={audio.name} url={audio.url} audioModalOpen={audioModalOpen} setAudioModalOpen={setAudioModalOpen} />
                                                        </Tooltip>);
                                                })}
                                            </div>
                                        }
                                        {message.type === 'FILE' &&
                                            <div className={`${message.sender._id === userDetails._id ? 'chat-bubble-user' : 'chat-bubble-other'}`}>
                                                {message.document.map((file) =>
                                                {
                                                    return (
                                                        <Tooltip title="Click To Download File" key={file._id}>
                                                            <div className="image-box">
                                                                <BsFillFileEarmarkFill />
                                                                <a href={file.url} download={file.name} className="file-attachment">
                                                                    {file.name}
                                                                </a>
                                                            </div>
                                                        </Tooltip>);
                                                })}
                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>);
                    }) : <Result
                        icon={<BiMessageRoundedX size={100} />}
                        title="No messages yet! Send first message to start interaction."
                    />}
                    <div ref={lastMessageRef}>
                    </div>
                </div>
            </Content>
            <Content className='footer'>
                <div className="chat-input-wrapper">
                    <div className="chat-input-icons">
                        <Popover content={Attachments} trigger="click" open={popoverVisible} onOpenChange={setPopoverVisible}>
                            <ImAttachment className="attachment-icon" size={25} />
                        </Popover>
                        <GrEmoji className="emoji-icon" size={25} />
                    </div>
                    <Input placeholder="Type a Message" className='chat-input' value={chatmessage} onChange={(e) => setchatmessage(e.target.value)} onPressEnter={handleSend} />
                    <div className="chat-send-button" onClick={handleSend}>
                        <IoSend size={30} />
                    </div>
                </div>
            </Content >
        </Layout >

    );
}

export default ChatProject;
