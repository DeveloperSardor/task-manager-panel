import {useState} from 'react';
// Initialization for ES Users

import "./TaskCard.css"
import { Link } from 'react-router-dom';
const taskCard = () => {


    return (
        <>
            <div className="taskCard">
                <div className="isImpotent">
                    <span></span>
                </div>
                <div className="task_header">
                    <h4>Task bmme</h4>
                </div>
                <div className="tast_body">
                    <h5>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae magni voluptatibus error? Accusantium cumque sit est necessitatibus cupiditate obcaecati soluta!
                    </h5>
                    <div className="detailes">
                    <button className='downloadTask'><i className="bi bi-download"></i></button>
                        <div className="users">
                            <i className="bi bi-people-fill"></i>
                            <span>5</span>
                        </div>
                      
                        <div className="time">
                           <span> <p>Create AT:</p><p>2/15/2024</p></span>
                            <span><p>DeadLine:</p>  <p>2/20/2024</p></span>
                        </div>
                    </div>
                </div>
                <div className="task_footer flex justify-between">
                        <Link to="/chat/13">
                    <button className='btn btn-info'>
                        chat
                    </button>
                        </Link>
                        
                </div>
            </div>
         


        </>



    );
};

export default taskCard;