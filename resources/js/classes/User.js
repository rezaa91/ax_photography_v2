class User {
    
   constructor() {
        // get the current user
        fetch('/api/user')
        .then(response => response.status === 200 && response.json())
        .then(data => {
            const user = data.data;

            this.user_id = user.id;
            this.name = user.name;
            this.email = user.email;
            this.username = user.username;
            this.created_at = user.created_at;
            this.updated_at = user.updated_at;
        })
        .catch(error => console.log('error finding user'));
   }

   //Getters bellow
   getUserId() {
       return this.user_id;
   }

   getName() {
       return this.name;
   }

   getEmail() {
       return this.email;
   }

   getUsername() {
       return this.username;
   }

   getCreatedAt() {
       return this.created_at;
   }

   getUpdatedAt() {
       return this.updated_at;
   }
}

export default User;