import React, { Component } from 'react'
import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import {connect} from 'react-redux'
import firebase from '../../../firebase'
import {setUserPosts} from '../../../redux/actions/chatRoom_action'


export class MainPanel extends Component {

    messageEndRef=React.createRef()
    
    state={
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        serchTerm:"",
        searchResults: [],
        serchLoading: false,
        typingRef: firebase.database().ref("typing"),
        typingUsers: [],
        listnerLists: []
    }
    
    constructor(props){
        super(props)
        this.bottomMessage=React.createRef()
    }

    componentDidMount(){
        const {chatRoom} = this.props;
        if(chatRoom){
            this.addMessagesListeners(chatRoom.id)
            this.addTypingListeners(chatRoom.id)
        };        
    }

    componentDidUpdate() {
        if(this.messageEndRef){
            this.messageEndRef.scrollIntoView({behavior: "smooth"})
        }
    }

    componentWillUnmount() {
        //this.state.typingRef.off()
        this.state.messagesRef.off()
        this.removeListeners(this.state.listnerLists)
    }

    removeListeners = (listeners) => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event)
        });
    }

    addTypingListeners=(chatRoomId)=>{
        
        let typingUsers=[]
        
        this.state.typingRef.child(chatRoomId).on("child_added", 
            dataSnapshot=>{
                if(dataSnapshot.key!==this.props.user.uid){
                    typingUsers=typingUsers.concat({
                        id: dataSnapshot.key,
                        name: dataSnapshot.val()
                    })
                    this.setState({typingUsers})
                }
            })

        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_added")

        this.state.typingRef.child(chatRoomId).on("child_removed",
            dataSnapshot => {
                const index = typingUsers.findIndex(user=>
                    user.id===dataSnapshot.key)
                if(index!==-1){
                    typingUsers=typingUsers.filter(user=>
                        user.id!==dataSnapshot.key)
                    this.setState({typingUsers})
                }
            })

            this.addToListenerLists(chatRoomId, this.state.typingRef, "child_removed")

    }

    addToListenerLists = (id, ref, event) => {
        const index = this.state.listnerLists.findIndex(listener=>{
            return(
                listener.id===id &&
                listener.ref===ref &&
                listener.event===event
            )            
        })
        if(index === -1){
            const newListener={id, ref, event}
            this.setState({listenerLists:  this.state.listnerLists.concat(newListener)})
        }
    }

    

    handleSearchChange = event => {
        console.log("handleSerchChange")
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        },
        () => this.handleSearchMessages()
        )
    }

    handleSearchMessages = () => {
        const chatRoomMessages=[...this.state.messages]
        const regex = new RegExp(this.state.searchTerm, "gi")
        const searchResults = chatRoomMessages.reduce((acc, message)=>{
            if((message.content&&message.content.match(regex))||
            message.user.name.match(regex)){
                acc.push(message)
            }
            return acc
        }, [])
        console.log(searchResults)
        this.setState({
            searchResults
        })
    }

    

    addMessagesListeners=(chatRoomId)=>{
        let messagesArray=[]
        this.state.messagesRef.child(chatRoomId).on("child_added", dataSnapshot => {
            messagesArray.push(dataSnapshot.val());
            this.setState({
                messages: messagesArray,
                messagesLoading: false
            })
            this.userPostsCount(messagesArray)
        })
        
    }

    userPostsCount = (messages) => {
        let userPosts = messages.reduce((acc, message)=>{
            if(message.user.name in acc) {
                acc[message.user.name].count += 1
            } else {
                acc[message.user.name]={
                    image: message.user.image,
                    count: 1
                }                
            }
            return acc
        },{})
        this.props.dispatch(setUserPosts(userPosts))
    }

    renderMessages=(messages)=>
        messages.length>0 &&
        messages.map(msg=>(
            <Message
                key={msg.timestamp}
                message={msg}
                user={this.props.user}/>
        ))
    
    renderTypingUsers=(typingUsers)=>
        typingUsers.length>0&&
        typingUsers.map(user=>(
            <span>
                {user.name} 님이 입력하고 있습니다.
            </span>
        ))
    

    render() {

        const {messages, searchTerm, searchResults, typingUsers}=this.state
        return (
            <div style={{padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader handleSearchChange={this.handleSearchChange}/>
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
                    {searchTerm ?
                        this.renderMessages(searchResults)
                    :
                        this.renderMessages(messages)}
                    
                    {this.renderTypingUsers(typingUsers)}
                    <div ref={node => (this.messageEndRef=node)}/>
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

