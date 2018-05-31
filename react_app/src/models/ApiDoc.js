import PropTypes from 'prop-types';

export default PropTypes.shape({
  annotation: PropTypes.shape({
    section: PropTypes.string.isRequired,
    deprecated: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    documentation: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,

    headers: PropTypes.isRequired,

    filters: PropTypes.isRequired, // { propName: { dataType: ... , pattern: ... }, ... }
    requirements: PropTypes.isRequired, // { propName: { dataType: ... , default: ... , description: ... , required: ... , requirement: ... }, ... }
    parameters: PropTypes.isRequired, // { propName: { dataType: ... , default: ... , description: ... , required: ... }, ... }

  }).isRequired,
  resource: PropTypes.string.isRequired,
});
