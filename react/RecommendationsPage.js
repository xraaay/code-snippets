import React from 'react';
import * as recommendationsService from '../services/recommendationsService'
import * as userService from '../services/userService'
import { connect } from 'react-redux'
import * as usersCoachesService from '../services/usersCoachesService'
import SwipeModal from './SwipeModal';
import ResourceRecommendations from './ResourceRecommendations'

class RecommendationPage extends React.Component { 
    constructor(props){
        super(props)
        this.state = {
            resources: [],
            mentorFilterList: [],
            coachesFilterList: [],
            maxCoaches: true,
            maxMentors: true
        }
        this.getMentors = this.getMentors.bind(this);
        this.getCoaches = this.getCoaches.bind(this);
        this.viewCoaches = this.viewCoaches.bind(this);
        this.viewMentors = this.viewMentors.bind(this)
    }

    getMentors(){
        userService.usersMentors_GetByUserId(parseInt(this.props.userProfiles.userId))
            .then(response => {
                let max = true
                if(response.items.length < 5){
                    max = false
                }
                this.setState({
                    mentorFilterList: response.items,
                    maxMentors: max
                })
            })
            .catch(console.error);
    }

    getCoaches(){
        usersCoachesService.readByUserId(parseInt(this.props.userProfiles.userId))
        .then(response => {
            let max = true
            if(response.item.length < 1){
                max = false
            }
            this.setState({
                coachesFilterList: response.item,
                maxCoaches: max
            })
        })
        .catch(console.log)
    }

    componentDidMount(){
        recommendationsService.getById(parseInt(this.props.userProfiles.userId))
            .then(response => {
                const data = {
                    ids: response.item.resourceProviderId
                }
                return recommendationsService.getByProviderId(data)
            })
            .then(response => {
                this.setState({
                    resources: response.items
                })
            })
            .catch(console.log)
        this.getCoaches();
        this.getMentors();

    }

    render(){
        const viewCoaches = this.state.coachesFilterList && this.state.coachesFilterList[0]
        ?(
            <div className="col text-right">
                <button type="button" onClick={this.goToCoach} className="btn btn-light btn-block text-center">View Coaches</button>
            </div> 
        )
        :null

        const viewMentors = this.state.mentorFilterList && this.state.mentorFilterList[0]
        ?(
            <div className="col text-right">
                <button type="button" onClick={this.goToMentors} className="btn btn-light btn-block text-center">View Mentors</button>
            </div>
        )
        :null

        return (
            <React.Fragment>
                <div className="col-sm-12">
                    <div className="row">
                        <div className="card col-sm-6 card-body">
                            <div>
                                <h3 className="text-center">Coaches</h3>
                                <div className="row">
                                    <div className="card col-sm-12">
                                        <div className="card-body text-center">
                                            <div className="col-sm-12 row">
                                                {this.state.coachesFilterList.map(item=> {
                                                    return (
                                                        <div className="col-sm-4">
                                                            <img src={item.imageUrl} className="col" />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row col-sm-12">
                                    {this.state.maxCoaches ? null :<SwipeModal getCoaches={this.getCoaches} isMentor={false} userId={this.props.userProfiles.userId} />}
                                    {viewCoaches}
                                </div>
                            </div>
                        </div>
                        <div className="card col-sm-6 card-body">
                            <div>
                                <h3 className="text-center">Mentors</h3>
                                <div className="row">
                                    <div className="card col-sm-12">
                                        <div className="card-body text-center">
                                            <div className="col-sm-12 row">
                                                {this.state.mentorFilterList.map(item=> {
                                                    return (
                                                        <div className="col-sm-4">
                                                            <img src={item.imageUrl} className="col" />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row col-sm-12">
                                    {this.state.maxMentors ? null : <SwipeModal getMentor={this.getMentors} isMentor={true} userId={this.props.userProfiles.userId} />}
                                    {viewMentors}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="card col-sm-12" >
                            <div className="card-body">
                                <h3 className="text-center card-body" >Resources</h3>
                                <div className="row">
                                    <ResourceRecommendations />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>   
        )
    }
}

const mapStateToProps = state => ({
    userProfiles: state.userProfiles
})

export default connect(mapStateToProps)(RecommendationPage)
