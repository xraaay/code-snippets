const dashboardRoutes = (state = {}, action) => {
    switch(action.type){
        case 'SET_MENTOR_ROUTE':
            return {
                ...state,
                userRoutes: action.route
            }
        case 'SET_ENTREPRENEUR_ROUTE':
            return {
                ...state,
                userRoutes: action.route
            }
            case 'SET_ADMINISTRATOR_ROUTE':
            return {
                ...state,
                userRoutes: action.route,
                dataManagement: action.dataManagement,
                survey: action.survey
            }
        case 'SET_COACH_ROUTE':
            return {
                ...state,
                userRoutes: action.route
            }
        default:
            return {
                ...state
            }
    }
}

export default dashboardRoutes;
