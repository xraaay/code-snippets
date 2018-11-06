import React from 'react'
import * as surveyInstanceService from '../../../services/surveyInstanceService'
import { USER_TYPES } from '../../../enums/userTypes'
import moment from 'moment-timezone'

class SurveyInstanceList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            list: [],
            counter: 0,
            totalPages: ''
        }
        this.viewInstance = this.viewInstance.bind(this);
        this.nextIndex = this.nextIndex.bind(this);
        this.prevIndex = this.prevIndex.bind(this);
        this.lastIndex = this.lastIndex.bind(this);
        this.firstIndex = this.firstIndex.bind(this)
    }

    componentDidMount(){
        this.getList(0)
    }

    getList(index, size = 20){
        surveyInstanceService.getInstanceListPaged(index, size)
            .then(response => {
                let totalPages = Math.ceil(response.items[0].totalPages / size)
                this.setState({
                    list: response.items,
                    totalPages: totalPages - 1
                })
            })
            .catch(console.log)
    }

    firstIndex(){
        if(this.state.counter > 0){
            let counter = 0
            this.updateList(counter);
        }
    }

    lastIndex(){
        if(this.state.counter < this.state.totalPages){
            let counter = this.state.totalPages
            this.updateList(counter);
        }
    }

    nextIndex(){
        if(this.state.counter < this.state.totalPages){
            let counter = this.state.counter + 1
            this.updateList(counter);
        }
    }

    prevIndex(){
        if(this.state.counter > 0){
            let counter = this.state.counter - 1
            this.updateList(counter);
        }
    }

    toIndex(i, e){
        this.updateList(i)
    }

    updateList(counter){
        this.getList(counter)
        this.setState({
            counter : counter
        })
    }

    viewInstance(e, id){
        this.props.history.push(`/data-management/survey-instance/${id}/preview`)
    }

    
    render(){
        const items = []
        for (let i = 1; i <= this.state.totalPages; i++) {
            items.push(
                <li className='page-item' key={i}>
                    <a className='page-link' onClick={e => { this.toIndex(i, e) }}>{i}</a>
                </li>
            );
        };
        const firstButton = this.state.counter > 0
        ? <li className="page-item pagination-first" onClick={this.firstIndex}><a className="page-link"></a></li>
        : <li className="page-item pagination-first disabled" onClick={this.firstIndex}><a className="page-link"></a></li>

        const prevButton = this.state.counter > 0
        ? <li className="page-item pagination-prev" onClick={this.prevIndex}><a className="page-link"></a></li>
        : <li className="page-item pagination-prev disabled" onClick={this.prevIndex}><a className="page-link"></a></li>
        
        const nextButton = this.state.counter < this.state.totalPages
        ? <li className="page-item pagination-next" onClick={this.nextIndex}><a className="page-link"></a></li>
        : <li className="page-item pagination-next disabled" onClick={this.nextIndex}><a className="page-link"></a></li>

        const lastButton = this.state.counter < this.state.totalPages
        ? <li className="page-item pagination-last" onClick={this.lastIndex}><a className="page-link"></a></li>
        : <li className="page-item pagination-last disabled" onClick={this.lastIndex}><a className="page-link"></a></li>
        const mappedList = this.state.list.map((item) => {
            let user;
            switch(item.userType){
                case USER_TYPES.ENTREPRENEUR:
                    user = "Entrepreneur";
                    break;
                case USER_TYPES.ADMINISTRATOR:
                    user = "Administrator";
                    break;
                case USER_TYPES.COACH:
                    user = "Coach";
                    break;
                case USER_TYPES.BUSINESS_OWNER:
                    user = "Business Owner"
                    break;
                case USER_TYPES.MENTOR:
                    user = "Mentor"
                    break;
            }
            return (
                <tr key={item.id} onClick={e => {this.viewInstance(e, item.id)}}>
                    <td>{item.id}</td>
                    <td>{item.surveyTemplateId}</td>
                    <td>{item.userId}</td>
                    <td>{item.name} </td>
                    <td>{item.email} </td>
                    <td>{user} </td>
                    <td>{moment.utc(item.dateCreated).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm a')}</td>
                    <span>
                        {/* <button class="btn btn-light btn--icon" onClick={e => this.editButton(item.id, e)}  ><span><i class="zmdi zmdi-edit zmdi-hc-fw"></i></span></button>
                        <button class="btn btn-light btn--icon" onClick={e => this.deleteButton(item.id, e)}   ><span><i class="zmdi zmdi-delete zmdi-hc-fw"></i></span></button> */}
                    </span>
                </tr>
            )
        })
        return (
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Survey Instance List</h4>
                    <div className="table-responsive">
                        <table className="table table-inverse">
                            <thead>
                                <tr>
                                    <th>Instance Id</th>
                                    <th>Survey Id</th>
                                    <th>User Id</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>User Type</th>
                                    <th>Date Taken</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mappedList}
                            </tbody>
                        </table>
                    </div>
                </div>
                <ul className="pagination justify-content-center">
                    {firstButton}
                    {prevButton}
                    {items}
                    {nextButton}
                    {lastButton}
                </ul>
            </div>

        )
    }
}

export default SurveyInstanceList
