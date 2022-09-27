import PropTypes from 'prop-types'
import { Route } from "react-router-dom";
import UserService from "./UserService";
import NotAllowed from "./NotAllowed";

const RolesRoute = ({ roles, children, ...rest }) => {
    return UserService.hasRoles(roles)? children : <NotAllowed/>;
}

RolesRoute.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RolesRoute