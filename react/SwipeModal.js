import React from 'react';
import SwipeableViews from 'react-swipeable-views'
import { Modal } from 'react-bootstrap'
import * as userService from '../services/userService'
import swal from 'sweetalert2';
import * as coachRecommendationService from '../services/coachRecommendationService';
import * as mentorRecommendationService from '../services/mentorRecommendationService';
import "./SwipeModal.css"
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
class SwipeModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            recommendations: [],
            counter: 1,
            isMentor: true,
            isMentorMax: true,
            isCoach: false,
            isCoachMax: true
        }
        this.toggleMentor = this.toggleMentor.bind(this);
        this.toggleCoach = this.toggleCoach.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    
    toggleModal(){
        //removed for brevity
    }

    shuffleResults(arr){
        //removed for brevity
    }

    toggleCoach(){
        coachRecommendationService.readCoachExpertiseId(this.props.userId)
            .then(response => {
                let unique = response.item.coachExpertiseTypeId.filter((v, i, a) => a.indexOf(v) === i); 
                const data = {
                    expertiseList: unique
                }
                return coachRecommendationService.readCoachProfiles(data)
            })
            .then(response => {
                const coaches = this.shuffleResults(response.items)
                const newArr = []
                for (let i = 0; i < response.items.length; i++) {
                    const obj = {}
                    newArr.push(obj);
                    newArr.push(coaches[i]);
                }
                this.setState({
                    counter: 1,
                    isMentor: false,
                    recommendations: newArr,
                    show: !this.state.show
                })
            })
            .catch(console.log)
    }

    toggleMentor(){
        mentorRecommendationService.readMentorProfiles(this.props.userId)
            .then(response => {
                const mentors = this.shuffleResults(response.items)
                const newArr = []
                for(let i=0; i< response.items.length; i++){
                    const obj = {};
                    newArr.push(obj)
                    newArr.push(mentors[i])
                }
                this.setState({
                    counter: 1,
                    recommendations: newArr,
                    show: !this.state.show
                })
            })
            .catch(console.log)
    }

    onSwipe(index, last) {
        let counter = this.state.counter + 2
        if (index > last) {
            this.setState({
                counter: counter
            })
        } else {
            let promise;
            if(this.state.isMentor && this.state.recommendations[last]){
                const data = {
                    userId: this.props.userId,
                    mentorId: this.state.recommendations[last].userId
                }
                promise = userService.matchUserMentor(data)
            } else {

                const data = {
                    userId: this.props.userId,
                    coachId: this.state.recommendations[last].userId,
                    expertiseId: this.state.recommendations[last].expertiseId
                }
                promise = userService.createUserCoachEntry(data)
            }
            promise.then(() => {
                if(this.props.getMentor){
                    this.props.getMentor();
                } else if(this.props.getCoaches) {
                    this.props.getCoaches();
                }
                this.toggleModal()
                swal({
                    title: "You have connected with " + this.state.recommendations[last].firstName,
                    timer: 5000,
                    type: "success",
                    showConfirmButton: true,
                    confirmButtonColor: '#7ac7f6',
                    confirmButtonText: 'Confirm',
                    background: '#0f2940'
                })                        
            })
            .catch(console.error)
        }
    }

    render() {
        const backdropStyle = {
            //removed for brevity
        };
        
        const imgStyle = {
            //removed for brevity
        };
        const button = this.props.isMentor 
        ? <button type="button" onClick={this.toggleMentor} className="btn btn-light btn-block text-center">Connect</button>
        : <button type="button" onClick={this.toggleCoach} className="btn btn-light btn-block text-center">Connect</button>

        return ( 
            <React.Fragment>
                <div className="col">
                    {button}
                </div>
                    <Modal 
                        show={this.state.show} 
                        onHide={this.toggleModal} 
                        animation={false} 
                        backdropStyle={backdropStyle}
                        className="custom-map-modal"
                    >
                        <Modal.Body>
                            <div style={{ outlineType:"none", textAlign: "center", backgroundColor:"black", width:"100%", height:"100%", }}>
                            <button type="button" className="btn btn-dark float-right" onClick={this.toggleModal}>&times;</button>
                            <br></br><br></br>
                            <div className="row">
                                <h6>Swipe <strong>right</strong> to make a connection</h6>
                            </div>
                                <SwipeableViews
                                    enableMouseEvents 
                                    onChangeIndex={(index, indexLatest) => this.onSwipe(index, indexLatest)}
                                    index={this.state.counter}
                                >
                                {this.state.recommendations.map(item =>{
                                    if(item.email){
                                        return (
                                            <div key={item.id} style={{ maxHeight: "100%", maxWidth: "100%" }}>
                                                <div className="card" style={{ pointerEvents: "none" }}>
                                                <div className='display_name'>
                                                   {item.firstName} {item.lastName}
                                                </div>
                                                    <div className="card-body" style={{ pointerEvents: "none" }}>
                                                        <img style={{ pointerEvents: "none" }} src={item.imageUrl} style={imgStyle} />
                                                        <br/><br/>                                                        
                                                        <p>Bio: {item.bio}</p>
                                                        <br/>
                                                        <p>{item.yearsInBusiness} years in business</p>
                                                    </div>
                                                </div>
                                                <button type="button" className="btn btn-light" onClick={this.toggleModal}>Exit</button>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={item.id}>
                                                <div className="card" style={{ pointerEvents: "none" }}>
                                                    <div className="card-body" style={{ pointerEvents: "none" }}>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </SwipeableViews>
                        </div>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    userId: state.userProfiles.userId
})

export default withRouter(connect(mapStateToProps)(SwipeModal));
