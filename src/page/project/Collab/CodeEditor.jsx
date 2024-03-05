import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { getSocketInstance } from '../../../config/socket';
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import randomColor from 'randomcolor';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Switch, Tooltip, message } from "antd";
import { axiosClient } from "../../../config/axios";
import { useStateContext } from "../../../context/ContextProvider";
import DebounceSelect from "./DebounceSelect";

function CodeEditor()
{
    const [currentTheme, setCurrentTheme] = useState('vs-dark');
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [codevalue, setCodeValue] = useState('');
    const { collabId, project_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;
    const editorRef = useRef(null);
    const cursorsRef = useRef({});
    const cursorColors = new Map();
    const collabUsers = new Map();
    const [collabUsersList, setCollabUsersList] = useState([]);
    const { activeProjectDetails, userDetails } = useStateContext();

    const socket = getSocketInstance();
    const monaco = useMonaco();

    function getUserColor(userId)
    {
        if (!cursorColors.has(userId))
        {
            cursorColors.set(userId, randomColor());
        }
        return cursorColors.get(userId);
    }

    function createCursor(userId)
    {
        const color = getUserColor(userId);
        const cursor = document.createElement('div');
        cursor.className = `cursor cursor-${userId}`; // Use a different CSS class for each user.
        cursor.style.position = 'absolute';
        cursor.style.width = '4px';
        cursor.style.height = '18px'; // You can adjust this based on your font size.
        cursor.style.backgroundColor = color; // Use a different color for each user.
        return cursor;
    }

    function createPointer(userId)
    {
        // badgeContainer styles
        const display_name = collabUsers.get(collabId).find(user => user.userId === userId).display_name;

        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'badge-container';
        badgeContainer.id = `badge-container-${userId}`;

        // badge styles
        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.innerText = display_name;
        badge.style.backgroundColor = getUserColor(userId);
        badgeContainer.appendChild(badge);

        // pointer styles
        const pointer = document.createElement('div');
        pointer.className = 'pointer';
        pointer.style.borderRight = `20px solid ${getUserColor(userId)}`;
        pointer.id = `pointer-${userId}`;
        badgeContainer.appendChild(pointer);
        return badgeContainer;
    }

    function handleEditorChange(value, event)
    {
        if (socket)
        {
            socket.emit('CODE_CHANGED', { collabId, payload: value });
        }
    }

    function ChangeTheme()
    {
        if (currentTheme === 'vs-dark') 
        {

            setCurrentTheme('light');
        }
        else
        {
            setCurrentTheme('vs-dark');
        }
    }

    function leaveCollabSession()
    {
        axiosClient.delete(`/projects/${activeProjectDetails._id}/collab/${collabId}`);
        delete collabUsers[collabId];
        setCollabUsersList([]);
        message.info('You left the collab session');
    }

    useEffect(() =>
    {

        if (socket)
        {
            socket.on('CHANGE_CODE', (value) =>
            {
                setCodeValue(value);
            });

            socket.on('CHANGE_CURSOR_POSITION', (data) =>
            {
                const { userId, position } = data;
                const editor = editorRef.current;
                // Remove the old cursor if it exists.
                if (cursorsRef.current[userId])
                {
                    editor.removeOverlayWidget(cursorsRef.current[userId]);
                }
                // Create a new cursor and add it to the editor.
                const cursor = createCursor(userId);
                cursorsRef.current[userId] = cursor;
                const cursorWidget = {
                    getId: () => 'cursor.' + userId,
                    getDomNode: () => cursor,
                    getPosition: () => ({ position: position, preference: [monaco?.editor.ContentWidgetPositionPreference.EXACT] })
                };

                cursorsRef.current[userId] = cursorWidget;
                editor.addOverlayWidget(cursorWidget);

                // Update the cursor's position.
                const coords = editor.getScrolledVisiblePosition(position);
                cursor.style.left = coords.left + 'px';
                cursor.style.top = coords.top + 'px';
            });

            socket.on('MOUSE_MOVE', (data) =>
            {
                const { userId, position } = data;

                let pointerContainer = document.getElementById(`badge-container-${userId}`);
                if (!pointerContainer)
                {
                    pointerContainer = createPointer(userId);
                    editorRef?.current?.getDomNode()?.appendChild(pointerContainer);
                }

                pointerContainer.style.left = `${position.x}px`;
                pointerContainer.style.top = `${position.y}px`;
            });

            socket.on('MOUSE_LEAVE', (data) =>
            {
                const { userId } = data;
                const pointerContainer = document.querySelector(`#badge-container-${userId}`);
                if (pointerContainer)
                {
                    pointerContainer.remove();
                }
            });

            socket.on('MOUSE_ENTER', (data) =>
            {
                const { userId } = data;
                const pointerContainer = document.querySelector(`#badge-container-${userId}`);
                if (pointerContainer)
                {
                    editorRef?.current?.getDomNode()?.appendChild(pointerContainer);
                }
            });

            socket.on('USER_JOINED', (data) =>
            {
                const { userId, display_name, profile_picture } = data;

                const newUser = {
                    userId,
                    display_name,
                    profile_picture
                };

                message.info(`${display_name} joined the session`);
                if (collabUsers.has(collabId))
                {
                    const userList = collabUsers.get(collabId);
                    userList.push(newUser);
                    collabUsers.set(collabId, userList);
                    setCollabUsersList(userList);
                }
                else
                {
                    collabUsers.set(collabId, [newUser]);
                    setCollabUsersList([newUser]);
                }
            });

            socket.on("USER_LEFT", (data) =>
            {
                const { userId, display_name } = data;
                message.info(`${display_name} left the session`);
                const userList = collabUsers.get(collabId);
                const updatedList = userList.filter(user => user.userId !== userId);
                collabUsers.set(collabId, updatedList);
                setCollabUsersList(updatedList);
            });
        }

        return () =>
        {
            if (socket)
            {
                socket.off('CHANGE_CODE');
                socket.off('CHANGE_CURSOR_POSITION');
                socket.off('MOUSE_MOVE');
                socket.off('MOUSE_LEAVE');
                socket.off('MOUSE_ENTER');
                socket.off('USER_JOINED');

                leaveCollabSession();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);


    useEffect(() =>
    {

        let domNode = null;
        if (editorRef.current)
        {
            domNode = editorRef.current.getDomNode();
            domNode.addEventListener('mousemove', handleMouseMove);
            domNode.addEventListener('mouseleave', handleMouseLeave);
            domNode.addEventListener('mouseenter', handleMouseEnter);
        }


        // Cleanup function
        return () =>
        {
            if (domNode)
            {
                domNode.removeEventListener('mousemove', handleMouseMove);
                domNode.removeEventListener('mouseleave', handleMouseLeave);
                domNode.removeEventListener('mouseenter', handleMouseEnter);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorRef]);

    async function fetchCollabIdAndJoin()
    {
        if (!state || !state.redirected)
        {
            try
            {

                const { data } = await axiosClient.get(`/projects/${activeProjectDetails._id}/collab?collabId=${collabId}`);
                const { userId, display_name, profile_picture } = data.result.user;
                const members = data.result.members;

                const newUser = {
                    userId,
                    display_name,
                    profile_picture
                };

                message.info(`${display_name} joined the session`);
                if (collabUsers.has(collabId))
                {
                    collabUsers.set(collabId, members);
                    setCollabUsersList(members);
                }
                else
                {
                    collabUsers.set(collabId, [newUser]);
                    setCollabUsersList([newUser]);
                }
            }
            catch (error)
            {
                console.log(error);
                message.error(error.message);
                navigate(`/project/${activeProjectDetails._id}/collab`);
            }
        }
    }

    function addUserToCollabList()
    {
        if (collabUsers.has(collabId))
        {
            const userList = collabUsers.get(collabId);
            const userIndex = userList.findIndex(user => user.userId === userDetails._id);
            if (userIndex === -1)
            {
                userList.push({ userId: userDetails._id, display_name: userDetails.display_name, profile_picture: userDetails.profile_picture, });
                collabUsers.set(collabId, userList);
                setCollabUsersList(userList);
            }

        }
        else
        {
            collabUsers.set(collabId, [{ userId: userDetails._id, display_name: userDetails.display_name, profile_picture: userDetails.profile_picture, }]);
            setCollabUsersList([{ userId: userDetails._id, display_name: userDetails.display_name, profile_picture: userDetails.profile_picture, }]);
        }

    }

    useEffect(() =>
    {
        fetchCollabIdAndJoin();
        addUserToCollabList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleMouseMove(event)
    {
        const rect = editorRef.current.getDomNode().getBoundingClientRect();
        const position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        if (socket)
        {
            socket.emit('MOUSE_MOVE', { collabId, position });
        }
    }

    function handleMouseLeave(event)
    {
        if (socket)
        {
            socket.emit('MOUSE_LEAVE', { collabId });
        }
    }

    function handleMouseEnter(event)
    {
        if (socket)
        {
            socket.emit('MOUSE_ENTER', { collabId });
        }
    }

    function handleEditorDidMount(editor, monaco)
    {
        editorRef.current = editor;

        editor.onDidChangeCursorPosition((event) =>
        {
            const position = editor.getPosition();
            if (socket)
            {
                socket.emit('CURSOR_POSITION_CHANGED', { collabId, position });
            }
        });

        editor.getDomNode().addEventListener('mousemove', handleMouseMove);
        editor.getDomNode().addEventListener('mouseleave', handleMouseLeave);
        editor.getDomNode().addEventListener('mouseenter', handleMouseEnter);
    }

    async function fetchUserList(username)
    {
        try
        {

            const { data } = await axiosClient.get(`/projects/${project_id}/members`);
            const matchedUsers = data.result.map((member) =>
            {
                return {
                    label: member.user.display_name,
                    value: member.user._id,
                    title: member.user.profile_picture
                };
            });

            const currentUserIndex = matchedUsers.findIndex(user => user.value === userDetails._id);
            matchedUsers.splice(currentUserIndex, 1);

            return matchedUsers;
        }
        catch (error)
        {
            console.log(error);
            message.error(error.message);
            const members = activeProjectDetails.members.map((member) =>
            {
                return {
                    label: member.user.display_name,
                    value: member.user._id
                };
            });
            return members;
        }
    }

    async function handleInviteToCollab()
    {
        try 
        {
            // console.log(invitedUsers);
            const usersToInvite = invitedUsers.map(user =>
            {
                return {
                    _id: user.value,
                    display_name: user.label,
                    profile_picture: user.title
                };
            });
            // const invitedUsers = 
            axiosClient.post(`/projects/${project_id}/collab/${collabId}`, { usersToInvite });
            message.success('Invitation sent successfully');
            setInvitedUsers([]);
        }
        catch (error)
        {
            console.log(error);
            message.error(error.message);
        }
    }


    return (
        <div className="editor-wrapper">
            <div className="editor-upper-bar">
                <Switch
                    checkedChildren={< MdDarkMode size={18} />}
                    unCheckedChildren={<MdOutlineLightMode size={18} />}
                    defaultChecked
                    onChange={ChangeTheme}
                />
                <div className="collab-invite-wrapper">
                    <DebounceSelect
                        mode="multiple"
                        value={invitedUsers}
                        placeholder="Invite users to Collab"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) =>
                        {
                            setInvitedUsers(newValue);
                        }}
                        style={{
                            width: '80%',
                        }}
                    />
                    <Button type="primary" onClick={handleInviteToCollab}>Invite</Button>
                </div>
                <div>
                    <Avatar.Group
                        maxCount={2}
                        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                    >
                        {
                            collabUsersList.map((user) =>
                            {
                                return (
                                    <Tooltip title={user.display_name} key={user.userId} placement="top">
                                        <Avatar
                                            key={user.userId}
                                            src={user.profile_picture}
                                        />
                                    </Tooltip>
                                );
                            })
                        }
                    </Avatar.Group>
                </div>

            </div>
            <Editor
                height={'77vh'}
                defaultLanguage="javascript"
                defaultValue="//Write something in JavaScript"
                onChange={handleEditorChange}
                theme={currentTheme}
                value={codevalue}
                onMount={handleEditorDidMount}

            />
        </div>
    );
}

export default CodeEditor;
