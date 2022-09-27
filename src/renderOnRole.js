import PropTypes from 'prop-types'
import UserService from "./UserService";

const RenderOnRole = ({ roles, children }) => (UserService.hasRoles(roles)) ? children : null;

RenderOnRole.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RenderOnRole