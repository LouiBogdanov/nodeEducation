let userContext = {
    id: undefined,
    name: undefined,
    surname: undefined,
    email: undefined,
};

export const getUserContext = () => userContext;
export const setUserContext = (context) => (userContext = context);
