import React from 'react';

function Row() {
    return (
    <div className="row">
        <div className="column side" style={{ backgroundColor: '#aaa' }}>Column</div>
        <div className="column middle" style={{ backgroundColor: '#bbb' }}>Column</div>
            {/*<div className="column side" style={{ backgroundColor: '#ccc' }}>Column</div>*/}
    </div>
   );
}

export default Row;