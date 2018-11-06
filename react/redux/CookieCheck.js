import React from 'react';
import NotLoggedInLayout from '../dataManagement/Account/NotLoggedInLayout';
import Layout from '../layout/Layout';
import { connect } from 'react-redux'
import { setRoutes } from '../../actions/userRoutes'
import * as currentUserProfileServices from '../../services/currentUserProfileService';
import { setUserProfile } from '../../actions/userProfiles'
import { withRouter } from 'react-router'

class CookieCheck extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
        }
    }
    componentDidMount(){
        const promise = currentUserProfileServices.readById()
        promise.then((response) => {
            let currentUserId = response.items[0].userId
            let currentUserImage = response.items[0].imageUrl
            let currentUserTypeId = response.items[0].userTypeId
            this.setState({
                currentUserId: currentUserId,
                currentUserImage: currentUserImage,
                currentUserTypeId: currentUserTypeId,
                isLoading: false
            })
    
            let signedInProfile = response.items[0]
            this.props.setUserProfile(signedInProfile);
            this.props.setRoutes(currentUserTypeId)
        })
        .catch(error => {
            if(error && error.response && error.response.data && error.response.data.err){
                console.log(error.response.data.err)
            }
            this.setState({
                isLoading: false
            })
        })
    }

    render(){
        let layout;
        if(this.state.isLoading){
            layout = null
        } else if (!this.state.isLoading && this.props.currentUserProfile.userId) {
            layout = <Layout />
        } else {
            layout = <NotLoggedInLayout />
        }
        return (
            <React.Fragment>
                {layout}
            </React.Fragment>
        )
    }
}


const mapDispatchToProps = dispatch => ({
    setUserProfile: userProfile => dispatch(setUserProfile(userProfile)),
    setRoutes: userType => dispatch(setRoutes(userType))
})
  
const mapStateToProps = state => ({
    currentUserProfile: state.userProfiles
})
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CookieCheck));
