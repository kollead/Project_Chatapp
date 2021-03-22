import React, { Component } from 'react'
import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import {connect} from 'react-redux'
import firebase from '../../../firebase'


export class MainPanel extends Component {
    
    state={
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        serchTerm:"",
        searchResults: [],
        serchLoading: false
    }
    
    constructor(props){
        super(props)
        this.bottomMessage=React.createRef()
    }

    componentDidMount(){
        const {chatRoom} = this.props;
        if(chatRoom){
            this.addMessagesListeners(chatRoom.id)
        };    
        this.scrolltoBottom();
    }

    componentDidUpdate(){
        this.scrolltoBottom();
    }

    handleSerchChange = event => {
        this.setState({
            serchTerm: event.target.value,
            serchLoading: true
        },
        () => this.handleSerchMessages()
        )
    }

    handleSerchMessages = () => {
        const chatRoomMessages=[...this.state.messages]
        const regex = new RegExp(this.state.serchTerm, "gi")
        const serchResults = chatRoomMessages.reduce((acc, message)=>{
            if((message.content&&message.content.match(regex))||
            message.user.name.match(regex)){
                acc.push(message)
            }
            return acc
        }, [])
        this.setState({
            serchResults
        })
    }

    scrolltoBottom=()=>{
        this.bottomMessage.current.scrollTop=this.bottomMessage.current.scrollHeight        
    
    }

    addMessagesListeners=(chatRoomId)=>{
        let messagesArray=[]
        this.state.messagesRef.child(chatRoomId).on("child_added", dataSnapshot => {
            messagesArray.push(dataSnapshot.val());
            this.setState({
                messages: messagesArray,
                messagesLoading: false
            })
        })
        
    }

    renderMessages=(messages)=>
        messages.length>0 &&
        messages.map(msg=>(
            <Message
                key={msg.timestamp}
                message={msg}
                user={this.props.user}/>
        ))
    

    render() {

        const {messages}=this.state
        return (
            <div style={{padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader handleSerchChange={this.handleSerchChange}/>
                <div ref={this.bottomMessage}
                    style={{
                    width: '100%', 
                    height: '450px',
                    border: '.2rem solid #ececec',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto'
                }}>
                    {}
                    {this.renderMessages(messages)}
                    <div />                    
                </div>
                
                <MessageForm/>
            </div>
        )
    }
}

const mapStateToProps= state=> {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}
export default connect(mapStateToProps)(MainPanel)

