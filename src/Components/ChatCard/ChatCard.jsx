import React from 'react';

const ChatHeader = ({ content }) => {
    console.log(content);
    return (
        <>
            <div className="chat_top_header">
                        <div className="about_names">
                            <h4>{content.item}</h4>
                            <p>last message 12 mins ago</p>
                        </div>
                        <div className="call_search_control">
                            <div className="icons">
                                <span><i className="bi bi-search"></i></span>
                                <span><i className="bi bi-telephone-fill"></i></span>
                                <span><i className="bi bi-three-dots-vertical"></i></span>
                            </div>
                        </div>
            </div>
        </>
    );
};

export default ChatHeader;