const memberships = {};

const ROLES = memberships.ROLES = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

export default (state) => {
  memberships.create = (organization, email, role) => {
    if (Object.keys(ROLES).map((key) => ROLES[key]).indexOf(role) === -1) {
      throw new Error(`Invalid role "${role}"`);
    }

    const path = `organizations/${organization}/memberships/${email}`;
    return state.request('PUT', path, role);
  };

  return {
    memberships
  };
};
