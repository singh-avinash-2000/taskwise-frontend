import React, { useEffect, useRef, useState } from 'react'
import { Layout, Avatar, Input, Button } from 'antd'
import { ImAttachment } from 'react-icons/im'
import { GrEmoji } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import '../css/ChatProject.css'

const { Header, Footer, Content } = Layout;


function ChatProject() {
    const [chatData, setChatData] = useState({});

    const lastMessageRef = useRef(null);
    const [chatmessage, setchatmessage] = useState('');

    const scrollToBottom = () => {
        lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }


    useEffect(() => {
        setChatData({     //change data to orginal chat data from backend
            name: 'Bentley Systems',
            messages: [
                {
                    id: 1,
                    message: 'Hello',
                    sender: 'user',
                    time: '12:00 pm',
                    owner: 'Ritik Mishra'
                },
                {
                    id: 2,
                    message: 'Hi',
                    sender: 'bot',
                    time: '12:01 pm',
                    owner: 'Avinash Singh'
                },
                {
                    id: 3,
                    message: 'How are you?',
                    sender: 'user',
                    time: '12:02 pm',
                    owner: 'Ritik Mishra'
                },
                {
                    id: 4,
                    message: 'I am fineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    sender: 'bot',
                    time: '12:03 pm',
                    owner: 'Avinash Singh'
                },
                {
                    id: 5,
                    message: 'I am fineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    sender: 'bot',
                    time: '12:03 pm',
                    owner: 'Avinash Singh'
                },
                {
                    id: 6,
                    message: 'I am fineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    sender: 'bot',
                    time: '12:03 pm',
                    owner: 'Avinash Singh'
                },
                {
                    id: 7,
                    message: 'I am fineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    sender: 'bot',
                    time: '12:03 pm',
                    owner: 'Avinash Singh'
                },
            ]
        });
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [chatData])

    function handleSend(e) {
        e.preventDefault();
        const message = chatmessage;
        if (message) {
            const newMessage = {
                id: chatData.messages.length + 1,
                message: message,
                sender: 'user',
                time: '12:00 pm',
                owner: 'Ritik Mishra'
            }
            setChatData({
                ...chatData,
                messages: [...chatData.messages, newMessage]
            })
            setchatmessage('');
        }
    }

    return (
        <Layout className='chat-layout'>
            <Header className='header'>
                <div className="icon">
                    <Avatar size={40} className='avatar'>BS</Avatar>
                </div>
                <div className="Project-name">
                    <h1>Bentley Systems</h1>
                </div>

            </Header>
            <Content className='content'>
                <div className="chat-messages">
                    {chatData.messages && chatData.messages.map((message, index) => {   //change data to orginal chat data from backend
                        if (index === chatData.messages.length - 1) {
                            return (
                                <div className='chat-message' key={index} ref={lastMessageRef}>
                                    <div className={`${message.sender === 'user' ? 'chat-message-user' : 'chat-message-other'}`}>
                                        <div className="chat-message-header">
                                            <div className={`${message.sender === 'user' ? 'chat-message-owner-user' : 'chat-message-owner-other'}`}>
                                                {message.owner},
                                            </div>
                                            <div className="chat-message-time">
                                                {message.time}
                                            </div>
                                        </div>
                                        <div className={`${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-other'}`} >
                                            <div className="chat-message-text">
                                                {message.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className='chat-message' key={index}>
                                    <div className={`${message.sender === 'user' ? 'chat-message-user' : 'chat-message-other'}`}>
                                        <div className="chat-message-header">
                                            <div className={`${message.sender === 'user' ? 'chat-message-owner-user' : 'chat-message-owner-other'}`}>
                                                {message.owner},
                                            </div>
                                            <div className="chat-message-time">
                                                {message.time}
                                            </div>
                                        </div>
                                        <div className={`${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-other'}`} >
                                            <div className="chat-message-text">
                                                {message.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            </Content>
            <Content className='footer'>
                <div className="chat-input-wrapper">
                    <Input placeholder="Enter Your Message" className='chat-input' value={chatmessage} onChange={(e) => setchatmessage(e.target.value)} onPressEnter={handleSend} />
                    <div className="chat-input-icons">
                        <ImAttachment className="attachment-icon" size={15} />
                        <GrEmoji className="emoji-icon" size={15} />
                    </div>
                    <div className="chat-send-button" onClick={handleSend}>
                        <IoSend size={30} />
                    </div>
                </div>
            </Content>
        </Layout>

    )
}

export default ChatProject