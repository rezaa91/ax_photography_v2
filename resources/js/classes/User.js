export default async function getUser() {
    try{
        const getUser = await fetch('/api/user');
        let user = await getUser.json();
        user = user.data;

        if (!user) {
            throw new Error('Unable to get current user');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            created_at: user.created_at,
            updated_at: user.updated_at,
            avatar_filepath: user.avatar_filepath,
            isAdmin: user.isAdmin 
        }

    } catch (Error) {
        return Error;
    }
}
