/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';


export const QUERY_GET_USER_BY_ID = gql`
query Query($userId: ID) {
    getUserById(userId: $userId) {
      id
      firstName
      lastName
      email
      contact
      churchName
      username
      password
      coverPic
      avatar
      bio
      userType
      verifyTag
      deviceToken
      status
      createdDateTime
      friends {
        id
        firstName
        lastName
        email
        contact
        churchName
        username
        avatar
        friendsId
        createdDateTime
        status
      }
    }
  }

`

export const QUERY_GET_ALL_USER = gql`
query Query {
  getAllUsers {
    id
    firstName
    lastName
    email
    contact
    churchName
    username
    password
    coverPic
    avatar
    bio
    userType
    verifyTag
    deviceToken
    createdDateTime
    status
    friends {
      id
      firstName
      lastName
      email
      contact
      churchName
      username
      avatar
      createdDateTime
      friendsId
      status
    }
  }
}
`

export const QUERY_ALL_POST = gql`
query GetAllPost {
  getAllPost {
    id
    userId
    firstName
    lastName
    email
    contact
    churchName
    avatar
    addLocation
    addSomeone
    caption
    createdDateTime
    status
    fileDetails {
      id
      file
      filetype
      createdDateTime
      status
    }
    like {
      id
      userId
      firstName
      lastName
      avatar
      createdDateTime
      status
    }
    comment {
      id
      userId
      firstName
      lastName
      avatar
      comment
      createdDateTime
      status
    }
  }
}
`

export const QUERY_ALL_STATUS = gql`
query Query {
  getAllStatus {
    id
    userId
    username
    profile
    stories {
      id
      url
      fileType
      isReadMore
      title
    }
  }
}
`

export const QUERY_GET_STATUS_BY_ID = gql`
query GetStatusById($statusId: ID) {
  getStatusById(statusId: $statusId) {
    id
    userId
    username
    profile
    stories {
      id
      url
      fileType
      title
      isReadMore
    }
  }
}
`

export const QUERY_GET_POST_BY_USER_ID = gql`
query GetStatusById($userId: ID) {
  getPostByUserId(userId: $userId) {
    id
    userId
    firstName
    lastName
    email
    contact
    churchName
    avatar
    caption
    createdDateTime
    status
    fileDetails {
      id
      file
      filetype
      createdDateTime
      status
    }
    like {
      id
      userId
      firstName
      lastName
      avatar
      createdDateTime
      status
    }
    comment {
      id
      userId
      firstName
      lastName
      avatar
      comment
      createdDateTime
      status
    }
  }
}

`

export const QUERY_GET_SEARCH_USER = gql`
query GetAllSearch($userName: String) {
  getAllSearch(userName: $userName) {
    id
    firstName
    lastName
    email
    contact
    churchName
    username
    password
    coverPic
    avatar
    bio
    userType
    verifyTag
    deviceToken
    createdDateTime
    status
    friends {
      id
      firstName
      lastName
      email
      contact
      churchName
      username
      avatar
      createdDateTime
      friendsId
      status
    }
  }
}
`

export const QUERY_GET_POST_BY_ID = gql`
query GetStatusById($postId: ID) {
  getPostById(postId: $postId) {
    id
    userId
    firstName
    lastName
    email
    contact
    churchName
    avatar
    addLocation
    addSomeone
    caption
    createdDateTime
    status
    comment {
      id
      userId
      firstName
      lastName
      avatar
      comment
      createdDateTime
      status
    }
    like {
      id
      userId
      firstName
      lastName
      avatar
      createdDateTime
      status
    }
    fileDetails {
      id
      file
      filetype
      createdDateTime
      status
    }
  }
}
`

export const QUERY_GET_CHAT_BY_USER_ID = gql`
query GetConversationByUserId($userId: ID) {
  grtConversationByUserId(userId: $userId) {
    id
    userId
    senderId
    senderFirstName
    senderLastName
    senderAvatar
    createdDateTime
    status
    messageDetails {
      id
      sender
      message
      createDateTime
      status
    }
  }
}
`

export const QUERY_GET_CHAT_BY_SENDER_ID = gql`
query GetConversationBySenderId($senderId: ID) {
  getConversationBySenderId(senderId: $senderId) {
    id
    userId
    senderId
    senderFirstName
    senderLastName
    senderAvatar
    createdDateTime
    status
    messageDetails {
      id
      sender
      message
      createDateTime
      status
    }
  }
}

`


export const QUERY_GET_CHAT_BY_USER_ID_AND_SENDER_ID = gql`
query GetConversationBySenderIdAndUserId($userId: ID, $senderId: ID) {
  getConversationBySenderIdAndUserId(userId: $userId, senderId: $senderId) {
    id
    userId
    senderId
    senderFirstName
    senderLastName
    senderAvatar
    createdDateTime
    status
    messageDetails {
      id
      sender
      message
      createDateTime
      status
    }
  }
}
`
export  const QUERY_GET_STATUS_BY_USER_ID = gql`
query Query($userId: ID) {
  getStatusByUserId(userId: $userId) {
    id
    userId
    username
    profile
    stories {
      id
      url
      fileType
      title
      isReadMore
    }
  }
}

`


export const QUERY_GET_CHAT_SEND_BY_SEND_TO = gql`
query Query($userIdA: ID, $userIdB: ID) {
  getChatBySendBySendTo(userIdA: $userIdA, userIdB: $userIdB) {
    id
    userIdA
    userNameA
    userProfileAvatarA
    userIdB
    userNameB
    userProfileAvatarB
    createDateAndTime
    status
    message {
      sentBy
      sentTo
      text
      createAt
      status
      userId
      id
    }
  }
}
`

export const QUERY_CHAT_USER_BY_ID = gql`
query GetAllChatByUserId($userId: ID) {
  getAllChatByUserId(userId: $userId) {
    id
    userIdA
    userNameA
    userProfileAvatarA
    userIdB
    userNameB
    userProfileAvatarB
    createDateAndTime
    status
    message {
      sentBy
      sentTo
      text
      createAt
      status
      userId
     id
    }
  }
}
`

export const QUERY_GET_USER_BY_ID_NOTIFICATION = gql`
query Query($userId: ID) {
  getNoticationByUserId(userId: $userId) {
    id
    userId
    userName
    notifyUserId
    title
    titleCaption
    avatar
    postId
    notificationType
    createdDateTime
    status
  }
}
`

export const QUERY_GET_EMAIL_VALIDATION = gql`
query Query($email: String) {
  getEmailvalidation(email: $email) {
    id
    firstName
    lastName
    email
    contact
    churchName
    username
    password
    coverPic
    avatar
    bio
    userType
    verifyTag
    deviceToken
    createdDateTime
    status
  }
}
`
export const QUERY_GET_ALL_BANNER = gql`
query Query {
  getAllBanner {
    id
    file
    createdDateTime
    status
  }
}

`



export const QUERY_FRIEND_STORY = gql`
query GetFriendStatus($userId: ID) {
  getFriendStatus(userId: $userId) {
    id
    userId
    username
    profile
    stories {
      id
      url
      fileType
      title
      isReadMore
    }
  }
}

`


export const QUERY_FRIEND_POST = gql`
query GetFriendsPosts($userId: ID!, $commonId: ID) {
  getFriendsPosts(userId: $userId, commonId: $commonId) {
    id
    userId
    firstName
    lastName
    email
    contact
    churchName
    avatar
    addLocation
    addSomeone
    caption
    createdDateTime
    status
    fileDetails {
      id
      file
      filetype
      createdDateTime
      status
    }
    comment {
      id
      userId
      firstName
      lastName
      avatar
      comment
      createdDateTime
      status
    }
    like {
      id
      userId
      firstName
      lastName
      avatar
      createdDateTime
      status
    }
  }
}
`