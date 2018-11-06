import { userTypeRoutes } from '../constants/dashboardRoutes'

export const setRoutes = userType => {
    switch(userType){
        case 1:
            return {
                type: 'SET_ENTREPRENEUR_ROUTE',
                route: userTypeRoutes.entrepreneur
            }
        case 2:
            return {
                type: 'SET_ADMINISTRATOR_ROUTE',
                route: userTypeRoutes.administrator,
                dataManagement: userTypeRoutes.dataManagement,
                survey: userTypeRoutes.survey
            }
        case 3:
            return {
                type: 'SET_COACH_ROUTE',
                route: userTypeRoutes.coach
            }
        case 5:
            return {
                type: 'SET_MENTOR_ROUTE',
                route: userTypeRoutes.mentor
        }
        default:
            console.log("Invalid User Type")
    }
}
