import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function MessageHeader() {
    return (
        <div style={{
            width: '100%',
            height: '170px',
            border: '.2rem solid #ececec',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
        }}>
            <Container>
                <Row>
                    <Col></Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
        
    )
}

export default MessageHeader
