# NodeJS web+database - Multi level nested message

## Technology Stack

### back-end

1. NodeJS: typescript + typeORM + Redis
2. Protobuf/Thrift (nice to have)
3. API interface: Rest/GraphQL/gRPC, one of them

The backend is the main focus of this assignment

### front end

1. Typescript
2. React

The front-end is mainly for demonstrating functions and is a secondary test object. But since React is used in the front-end of the team, it is recommended to use it.

## Functional:

- Users can register on the website
- Need to fill in username, password, email.
- Username needs to be checked: cannot be empty, can only use letters and numbers, length between 5-20, cannot be duplicated with existing usernames
- Password needs to be checked: cannot be empty, length between 8-20, containing at least one uppercase, one lowercase, one number, and one special symbol
- Email needs to be checked: it cannot be empty, the format must be correct, and it cannot be duplicated with existing emails. For simplicity, there is no need to send an email confirmation
- Users can log in on the website
- Log in using username+password or email+password
- Provide the "remember me" function, which means there is no need to log in again within one month after logging in
- If 'remember me' is not selected, closing the browser and accessing again will prompt for registration or login
- After logging in, the user needs to display their username and email at the top of the page
- After logging in, users can leave messages.
- The length of the message should be between 3 and 200 words, and it can be in Chinese
- When inputting, it will dynamically prompt how many more words can be inputted
- We will record the time of posting the message
- You can leave another comment on a certain message
- The requirements for comment input are the same as those for leaving a message
- You can comment again on a certain comment, regardless of the level
- Users can view messages
  \*Just need one page to display all the comments and nested comments in a tree (the backend provides complete tree data, don't load lazily in the frontend)
- The messages are arranged in reverse chronological order from top to bottom, with the latest one at the top
- Next to a certain message, you can see the publisher's username and publication time
- No need to log in when viewing messages

## Technical:

- Backend using NodeJS+typescript+TypeORM+Redis
- The Restful API provided by the backend needs to consider permission checks, as well as the correct HTTP method and HTTP code
- For nested messages with larger layers (such as exceeding dozens of layers), performance issues (such as loop queries) should be avoided as much as possible in the code logic
- There are appropriate unit tests for both the front-end and back-end
