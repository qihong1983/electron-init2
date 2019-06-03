import React, {
  Component
} from 'react';

import './NotFound.css';
// import axios from 'axios';


import {
  Link
} from 'react-router';



class NotFound extends Component {
  render() {


    // axios.get("https://www.easy-mock.com/mock/5a2dca93e9ee5f7c09d8c6d7/Aaa/tableNoChange?p=1")
    //   .then(response => {
    //     console.log('response');
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })


    return (
      <div className="NotFound">
            <h1> NotFound 11</h1>
           <p> <Link to="/">首页</Link></p>
      </div>
    );
  }
}

export default NotFound;