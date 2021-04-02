import React, { Component } from 'react'
import {FaRegSmileBeam} from 'react-icons/fa'
import firebase from '../../../firebase'
import {connect} from 'react-redux'


export class Favorited extends Component {

    state = {
        usersRef : firebase.database().ref("users")
        
    }

    componentDidMount () {
        this.addListeners()
    }

    addListeners = () => {
        const{usersRef}=this.state;
        usersRef
            .child(userId)
    }

    render() {
        return (
            <div>
                <span style={{ display: 'flex', alignItems: 'center'}}>
                    <FaRegSmileBeam style={{marginRight: '3px'}}/>
                    FAVORITED (1)
                </span>
                <ul style={{listStyleType: 'none', padding: '0'}}>
                    
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}
export default connect(mapStateToProps)(Favorited)


