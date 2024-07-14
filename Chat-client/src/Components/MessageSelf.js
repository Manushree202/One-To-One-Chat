import React from 'react';

function MessageSelf({props}) {
  return (
    <div className='self-message-container'>
        <div className='message-Box'>
            <p style={{ color: "black" }}> {props.content}</p>
            {/*<p className='self-timeStamp'>12:00am</p>*/}
        </div>
    </div>
  );
}

export default MessageSelf