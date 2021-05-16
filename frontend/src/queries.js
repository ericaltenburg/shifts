import {gql} from '@apollo/client';

const LOGIN_USER = gql`
    query loginUser($email: String!, $password: String!){
        login(email: $email, password: $password) {
            AccessToken
        }
    }
`

const ADD_USER = gql`
    mutation registerUser($username: String!, $userID: ID!){
        addUser(username: $username, userID: $userID){
            userID
            username
            favorites{
              symbol
            }
        }
    }
`

const CHECK_USERNAME = gql`
    query ($username: String!){
        checkUsername(username: $username)
    }
`

const REMOVE_USER = gql`
    mutation removeUser($id: String!){
        deleteUser(id: $id){
            email
        }
    }
`

const GET_POPULAR_COMPANIES = gql`
    query getPopular($queryNum: Int){
        popularCompanies(num: $queryNum){
            ticker
            companyName
            _id
        }
    }
`

const GET_GAINING_COMPANIES = gql`
    query getGainers($queryNum: Int){
        gainingCompanies(num: $queryNum){
            ticker
            companyName
            _id
        }
    }
`

const GET_LOSING_COMPANIES = gql`
    query getLosers($queryNum: Int){
        losingCompanies(num: $queryNum){
            ticker
            companyName
            _id
        }
    }
`

const GET_LOGGED_IN_USERS = gql`
    query{
        getUsers{
            _id
            username
        }
    }
`



export default {
  CHECK_USERNAME, LOGIN_USER, ADD_USER, REMOVE_USER, GET_LOGGED_IN_USERS, GET_GAINING_COMPANIES, GET_LOSING_COMPANIES, GET_POPULAR_COMPANIES
}
